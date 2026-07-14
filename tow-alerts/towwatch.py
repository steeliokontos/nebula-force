#!/usr/bin/env python3
"""
TowWatch — government meeting alerts for the towing industry.

Watches city/county legislative feeds (Legistar) for anything mentioning
towing, impound, PPI, wrecker rotation, vehicle auctions, etc., and builds
a clean dashboard.html you open in any browser.

No installs needed beyond Python 3 (already on every Mac).

Commands:
  python3 towwatch.py probe          test which sources in sources.json respond
  python3 towwatch.py scan           fetch recent legislation, find tow/impound hits
                                     (polite guest: max once every 3 days; the
                                     lookback window auto-covers the gap)
  python3 towwatch.py scan --force   scan now even if the 3 days aren't up
  python3 towwatch.py scan --days 30 look further back (first run defaults to 14)
  python3 towwatch.py report         rebuild dashboard.html from saved hits
  python3 towwatch.py demo           fill the dashboard with sample alerts (to see the look)

Optional AI summaries: set the environment variable ANTHROPIC_API_KEY and
every hit gets a plain-English "why this matters" summary + relevance grade.
Without a key everything still works — you just get the raw matched text.
"""

import hashlib
import json
import os
import re
import sqlite3
import sys
import time
import html
import zlib
import urllib.request
import urllib.parse
import urllib.error
from datetime import datetime, timedelta, timezone

__version__ = "1.0.0"

ROOT = os.path.dirname(os.path.abspath(__file__))
SOURCES_FILE = os.path.join(ROOT, "sources.json")
DB_FILE = os.path.join(ROOT, "towwatch.db")
DASH_FILE = os.path.join(ROOT, "dashboard.html")
TICKETS_FILE = os.path.join(ROOT, "tickets.md")
API = "https://webapi.legistar.com/v1"
USER_AGENT = "TowWatch/0.1 (personal research tool; public legislative data)"

# ---------------------------------------------------------------- keywords --
# Each entry: (tag shown on the card, weight, regex). Weight = business value
# to a towing company. Word boundaries keep "tow" from matching "town".
# A keyword's weight counts once per mention, up to MAX_MENTIONS mentions;
# the overall score is capped at MAX_SCORE.
MAX_MENTIONS, MAX_SCORE = 5, 100

KEYWORDS = [
    ("tow software",  7, r"\b(?:tow(?:ing)?|impound(?:ment)?) (?:dispatch|management) (?:software|system|platform|solution)s?|\btow(?:ing)? dispatch(?:ing)?\b|\bvehicle release (?:portal|system)s?\b"),
    ("predatory",     7, r"\bpredator(?:y|s)?[- ]tow\w*|\bpredatory (?:tow(?:ing)?|booting|practices)"),
    ("vendor watch",  6, r"\bAutura\b|\bAutoReturn\b"),  # add competitor names here as you learn them
    ("rotation list", 5, r"\brotation (?:list|tow|wrecker)"),
    ("non-consent",   5, r"\bnon[- ]?consent(?:ual)? tow"),
    ("police tow",    4, r"\bpolice[- ]initiated tow\w*|\blaw[- ]enforcement(?:[- ]initiated)? tow\w*|\bpolice tow\w*"),
    ("consolidated",  7, r"\bconsolidat\w+ (?:dispatch|communications?|9-?1-?1)|\bregional (?:dispatch|communications?|9-?1-?1) (?:center|district|authority|board)|\bdispatch consolidation\b"),
    ("CAD",           3, r"\bcomputer[- ]aided dispatch\b|\bCAD (?:system|replacement|upgrade|integration|platform|vendor)s?\b"),
    ("PPI",           4, r"\bprivate property (?:tow|impound)\w*|\bPPI\b"),
    ("wrecker",       3, r"\bwreckers?\b"),
    ("impound",       3, r"\bimpound(?:ment|ed|ing|s)?\b"),
    ("veh auction",   3, r"\bvehicle auctions?\b|\bauction of (?:abandoned|impounded) vehicles\b"),
    ("veh storage",   3, r"\bvehicle storage\b|\bstorage lot\b|\bvehicle storage facilit"),
    ("tow truck",     2, r"\btow[- ]?trucks?\b"),
    ("towing",        2, r"\btow(?:ing|ed|s)?\b"),
    ("abandoned veh", 2, r"\babandoned (?:vehicle|auto|car)s?\b"),
    ("immobilize",    2, r"\bimmobiliz\w+\b|\bvehicle boot(?:ing)?\b"),
    ("clearance",     3, r"\b(?:quick|incident|scene) clearance\b|\bsecondary (?:crash|collision|accident)e?s?\b"),
    ("TIM",           3, r"\btraffic incident management\b"),
    ("junk vehicle",  1, r"\bjunk(?:ed)? (?:vehicle|motor vehicle|car)s?\b"),
]
KEYWORDS = [(tag, w, re.compile(rx, re.IGNORECASE)) for tag, w, rx in KEYWORDS]

# Context boosters: only counted when a keyword above already matched.
# Each adds its weight once and suggests the category badge.
CONTEXT = [
    ("contract/RFP",  6, r"\brequest for (?:proposal|qualification)s?\b|\bRFP\b|\bsolicitation\b|\binvitation to bid\b"),
    ("contract/RFP",  4, r"\bcontract|agreement\b|\bprocurement\b|\bbid(?:s|ding)?\b|\baward(?:ing|ed)?\b"),
    ("enforcement",   3, r"\bpredator\w*\b"),  # bare "predatory" near any tow language
    ("dispatch/911",  3, r"\bPSAP\b|\b9-?1-?1\b|\bdispatch(?:ing)? center\b|\bcommunications center\b|\bsheriff|police department\b"),
    ("PPI/portal",    3, r"\bportal\b|\bonline (?:system|registry)\b|\bpermit(?:s|ting)?\b|\blicens\w+"),
    ("tech/software", 3, r"\bsoftware\b|\bplatform\b|\bautomat\w+|\bmobile app\w*|\bdigital\b|\btechnology\b"),
    ("fees",          2, r"\bfees?\b|\brate schedule\b|\bcharges\b|\bsurcharge"),
    ("enforcement",   1, r"\benforcement\b|\bviolations?\b|\bcitations?\b|\bpenalt\w+"),
    ("ordinance",     1, r"\bordinance\b|\bamend\w*\b|\bmunicipal code\b|\bregulations?\b"),
]
CONTEXT = [(cat, w, re.compile(rx, re.IGNORECASE)) for cat, w, rx in CONTEXT]

# Score thresholds for the color-coded rating.
HIGH_AT, MEDIUM_AT = 10, 5

# Polite-guest rule: never hit the government sites more than once every
# N days. Our industry moves slowly; the sites appreciate the manners.
MIN_SCAN_GAP_DAYS = 3

CATEGORY_LIST = ["contract/RFP", "dispatch/911", "tech/software", "ordinance",
                 "fees", "enforcement", "PPI/portal", "other"]


# ------------------------------------------------------------------- utils --
LOG_LINES = []  # rolling activity log, included in bug tickets


def log(msg):
    LOG_LINES.append(str(msg))
    print(msg, flush=True)


def file_ticket(summary, likely, claude_steps, operator_steps, details=""):
    """File a bug ticket the operator can hand straight to Claude or Erik.

    Every ticket answers four questions: what happened, why (probably),
    what Claude will do about it, and what the operator needs to do.
    """
    import platform
    stamp = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")
    entry = [
        "\n## Ticket - %s\n\n" % stamp,
        "**App:** ToWatch v%s | Python %s | %s\n\n" % (
            __version__, sys.version.split()[0], platform.platform(terse=True)),
        "**What happened:** %s\n\n" % summary,
        "**Likely reason:** %s\n\n" % likely,
        "**Next steps Claude will take:** %s\n\n" % claude_steps,
        "**What you (the operator) should do:** %s\n\n" % operator_steps,
    ]
    if details:
        entry.append("**Technical details:**\n```\n%s\n```\n\n" % details.strip()[:4000])
    tail = LOG_LINES[-15:]
    if tail:
        entry.append("**Recent activity log:**\n```\n%s\n```\n" % "\n".join(tail))
    header = ""
    if not os.path.exists(TICKETS_FILE):
        header = ("# ToWatch bug tickets\n\n"
                  "Paste this file (or one ticket) into a Claude chat, or send it\n"
                  "to the app's creator, to get a fix. Delete tickets once fixed.\n")
    with open(TICKETS_FILE, "a", encoding="utf-8") as f:
        f.write(header + "".join(entry))
    log("TICKET FILED -> %s (paste it to Claude for a fix)" % TICKETS_FILE)


# Pause between every outbound request - part of being a polite guest.
REQUEST_PAUSE = 0.4


class ConnectorError(Exception):
    """A connector failed in a way the watchdog should record."""


def http_get_raw(url, timeout=30, accept="*/*"):
    """GET a URL, return (bytes, None) or (None, 'error string'). Paced."""
    time.sleep(REQUEST_PAUSE)
    req = urllib.request.Request(url, headers={
        "Accept": accept,
        "User-Agent": USER_AGENT,
    })
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            return resp.read(), None
    except urllib.error.HTTPError as e:
        return None, "HTTP %d" % e.code
    except Exception as e:  # timeouts, DNS, etc.
        return None, str(e)[:120]


def http_get_json(url, timeout=30):
    """GET a URL, return (parsed_json, None) or (None, 'error string')."""
    raw, err = http_get_raw(url, timeout, accept="application/json")
    if raw is None:
        return None, err
    try:
        return json.loads(raw.decode("utf-8", "replace")), None
    except Exception:
        return None, "response was not JSON (site may have changed)"


def html_to_text(page):
    """Best-effort plain text from an HTML page."""
    page = re.sub(r"(?is)<(script|style)[^>]*>.*?</\1>", " ", page)
    page = re.sub(r"(?i)<br\s*/?>|</p>|</div>|</tr>|</li>|</h[1-6]>", "\n", page)
    text = re.sub(r"<[^>]+>", " ", page)
    text = html.unescape(text)
    return re.sub(r"[ \t\r]+", " ", text)


def pdf_to_text(data):
    """Best-effort plain text from a PDF, no libraries.

    Decompresses the PDF's content streams and pulls out the text-drawing
    strings. Imperfect by design - good enough for keyword scanning, and
    returns "" rather than garbage when a PDF resists.
    """
    try:
        if not data.startswith(b"%PDF"):
            return ""
        out = []
        for m in re.finditer(rb"stream\r?\n(.*?)endstream", data, re.S):
            chunk = m.group(1)
            try:
                chunk = zlib.decompress(chunk)
            except Exception:
                pass
            for t in re.findall(rb"\((?:[^()\\]|\\.)*\)", chunk):
                s = t[1:-1].decode("latin-1", "replace")
                s = s.replace("\\(", "(").replace("\\)", ")").replace("\\\\", "\\")
                if s.strip():
                    out.append(s)
        text = " ".join(out)
        return text if len(text) > 200 else ""
    except Exception:
        return ""


def load_sources():
    with open(SOURCES_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


def save_sources(cfg):
    with open(SOURCES_FILE, "w", encoding="utf-8") as f:
        json.dump(cfg, f, indent=2)
        f.write("\n")


def db():
    conn = sqlite3.connect(DB_FILE)
    conn.execute("""CREATE TABLE IF NOT EXISTS hits (
        id TEXT PRIMARY KEY,        -- client:matterId
        client TEXT, city TEXT, state TEXT,
        matter_file TEXT, title TEXT, url TEXT,
        keywords TEXT,              -- comma-separated tags
        snippet TEXT,               -- matched text with context
        status TEXT, body TEXT,
        intro_date TEXT, last_modified TEXT,
        first_seen TEXT,
        summary TEXT, category TEXT, relevance TEXT,
        score INTEGER DEFAULT 0,
        graded_by TEXT DEFAULT 'keywords',   -- 'keywords' or 'ai'
        demo INTEGER DEFAULT 0
    )""")
    # Upgrade older databases in place (ignore "already exists" errors).
    for col in ("score INTEGER DEFAULT 0", "graded_by TEXT DEFAULT 'keywords'"):
        try:
            conn.execute("ALTER TABLE hits ADD COLUMN " + col)
        except sqlite3.OperationalError:
            pass
    conn.execute("CREATE TABLE IF NOT EXISTS meta (key TEXT PRIMARY KEY, value TEXT)")
    return conn


def get_meta(conn, key):
    row = conn.execute("SELECT value FROM meta WHERE key=?", (key,)).fetchone()
    return row[0] if row else None


def set_meta(conn, key, value):
    conn.execute("INSERT OR REPLACE INTO meta (key, value) VALUES (?, ?)", (key, value))
    conn.commit()


def score_text(text):
    """Score text for tow/impound relevance using weighted keywords.

    Returns (score, tags, snippets, category, relevance).
    score 0 means no keyword hit at all.
    """
    if not text:
        return 0, [], [], "", ""
    score, tags, snippets = 0, [], []
    for tag, weight, rx in KEYWORDS:
        found = rx.findall(text)
        if found:
            score += weight * min(len(found), MAX_MENTIONS)
            tags.append(tag)
            if len(snippets) < 3:
                m = rx.search(text)
                start = max(0, m.start() - 130)
                end = min(len(text), m.end() + 130)
                snip = re.sub(r"\s+", " ", text[start:end]).strip()
                snippets.append(("…" if start > 0 else "") + snip + ("…" if end < len(text) else ""))
    if not tags:
        return 0, [], [], "", ""
    # Context boosters raise the score and pick the category badge.
    category, best = ("PPI/portal", 99) if "PPI" in tags else ("", 0)
    for cat, weight, rx in CONTEXT:
        if rx.search(text):
            score += weight
            if weight > best:
                category, best = cat, weight
    category = category or "other"
    score = min(score, MAX_SCORE)
    relevance = "high" if score >= HIGH_AT else "medium" if score >= MEDIUM_AT else "low"
    return score, tags, snippets, category, relevance


# ------------------------------------------------------------------- probe --
def probe_source(src):
    """Cheapest possible request per platform. Returns (ok, err)."""
    c = src["client"]
    platform = src.get("platform", "legistar")
    top1 = urllib.parse.urlencode({"$top": 1}, quote_via=urllib.parse.quote)
    if platform == "legistar":
        data, err = http_get_json("%s/%s/bodies?%s" % (API, c, top1), timeout=20)
        return data is not None, err
    if platform == "civicclerk":
        data, err = http_get_json(
            "https://%s.api.civicclerk.com/v1/Events?%s" % (c, top1), timeout=20)
        return data is not None, err
    if platform == "primegov":
        data, err = http_get_json(
            "https://%s.primegov.com/api/v2/PublicPortal/ListUpcomingMeetings" % c,
            timeout=20)
        return isinstance(data, list), err or "unexpected response format"
    if platform == "iqm2":
        raw, err = http_get_raw(
            "https://%s.iqm2.com/Citizens/Calendar.aspx" % c, timeout=20)
        ok = raw is not None and b"<html" in raw[:2000].lower()
        return ok, err or ("unexpected page (layout may have changed)"
                           if raw is not None else None)
    if platform == "agendacenter":
        raw, err = http_get_raw("https://%s/AgendaCenter" % c.rstrip("/"), timeout=20)
        ok = raw is not None and b"viewfile" in raw.lower()
        return ok, err or ("no agenda links found (layout may have changed)"
                           if raw is not None else None)
    if platform == "pagewatch":
        if not src.get("url"):
            return False, "no 'url' configured for this pagewatch source"
        raw, err = http_get_raw(src["url"], timeout=20)
        return raw is not None, err
    return False, "unknown platform '%s'" % platform


def cmd_probe():
    cfg = load_sources()
    ok = blocked = 0
    for src in cfg["sources"]:
        good, err = probe_source(src)
        if good:
            src["verified"] = True
            src.pop("error", None)
            ok += 1
            log("  OK      %-22s %-10s (%s, %s)" % (
                src["client"], src.get("platform", "legistar"), src["name"], src["state"]))
        else:
            src["verified"] = False
            src["error"] = err
            blocked += 1
            log("  FAILED  %-22s %-10s (%s, %s) - %s" % (
                src["client"], src.get("platform", "legistar"), src["name"],
                src["state"], err))
    save_sources(cfg)
    log("\n%d working, %d failed. Results saved to sources.json." % (ok, blocked))
    log("Failed sources are skipped by 'scan'. A 403 usually means that city")
    log("requires an API token or blocks bots — remove it or find its platform.")


# -------------------------------------------------------------------- scan --
def fetch_matter_text(client, matter_id):
    """Best-effort full text of a matter. Returns '' on any failure."""
    url = "%s/%s/matters/%s/versions" % (API, client, matter_id)
    versions, err = http_get_json(url, timeout=20)
    if not versions or not isinstance(versions, list):
        return ""
    key = versions[-1].get("Key") if isinstance(versions[-1], dict) else None
    if key is None:
        return ""
    url = "%s/%s/matters/%s/texts/%s" % (API, client, matter_id, key)
    text, err = http_get_json(url, timeout=20)
    if isinstance(text, dict):
        return text.get("MatterTextPlain") or ""
    return ""


# --------------------------------------------------------------- connectors --
# One connector per publishing platform. Each takes (src, since, now) and
# returns a list of items:
#   {"uid": unique-id, "title": str, "text": str-or-"" (agenda text),
#    "fetch_text": optional lazy callable for the full body,
#    "status": str, "meeting_body": str, "date": "YYYY-MM-DD",
#    "modified": "YYYY-MM-DD", "file": str, "url": str}
# On failure a connector raises ConnectorError("plain-english reason") so
# the watchdog can record exactly what went wrong for that source.
# Adding a platform = adding one function + one CONNECTORS entry.

MAX_MEETINGS_PER_SCAN = 12  # politeness cap for meeting-based platforms


def fetch_legistar(src, since, now):
    """Legistar (Granicus) - free public API, item = piece of legislation."""
    flt = ("MatterLastModifiedUtc ge datetime'%s' and MatterRestrictViewViaWeb eq false"
           % since)
    qs = urllib.parse.urlencode(
        {"$filter": flt, "$top": 1000, "$orderby": "MatterLastModifiedUtc desc"},
        quote_via=urllib.parse.quote)
    data, err = http_get_json("%s/%s/matters?%s" % (API, src["client"], qs))
    if data is None:
        raise ConnectorError(err)
    if not isinstance(data, list):
        raise ConnectorError("unexpected response format (site may have changed platforms)")
    items = []
    for m in data:
        mid = m.get("MatterId")
        items.append({
            "uid": mid,
            "title": " ".join(filter(None, [m.get("MatterName"), m.get("MatterTitle")])),
            "text": "",
            "fetch_text": (lambda _mid=mid: fetch_matter_text(src["client"], _mid)),
            "status": m.get("MatterStatusName") or "",
            "meeting_body": m.get("MatterBodyName") or "",
            "date": (m.get("MatterIntroDate") or "")[:10],
            "modified": (m.get("MatterLastModifiedUtc") or "")[:10],
            "file": m.get("MatterFile") or "",
            "url": "https://%s.legistar.com/LegislationDetail.aspx?ID=%s&GUID=%s" % (
                src["client"], mid, m.get("MatterGuid") or ""),
        })
    return items


def fetch_civicclerk(src, since, now):
    """CivicClerk (CivicPlus) - public JSON API, item = a meeting.

    The agenda text lives in published files (usually PDFs) streamed from
    the API; we extract text from the agenda file for keyword scanning.
    """
    base = "https://%s.api.civicclerk.com" % src["client"]
    qs = urllib.parse.urlencode(
        {"$filter": "startDateTime ge %sZ" % since,
         "$orderby": "startDateTime asc", "$top": 100},
        quote_via=urllib.parse.quote)
    data, err = http_get_json("%s/v1/Events?%s" % (base, qs))
    if data is None:
        raise ConnectorError(err)
    events = data.get("value") if isinstance(data, dict) else data
    if not isinstance(events, list):
        raise ConnectorError("unexpected response format (API may have changed)")
    items, fetched = [], 0
    for ev in events:
        if not isinstance(ev, dict):
            continue
        eid = ev.get("id") or ev.get("eventId")
        title = (ev.get("eventName") or ev.get("name") or ev.get("title")
                 or "Meeting").strip()
        date = str(ev.get("startDateTime") or ev.get("eventDate") or "")[:10]
        text = ""
        files = ev.get("publishedFiles") or ev.get("files") or []
        # Prefer the agenda file; fall back to the first file with text.
        files = sorted(files, key=lambda f: 0 if "agenda" in
                       str(f.get("type", "") or f.get("name", "")).lower() else 1)
        for f in files:
            if fetched >= MAX_MEETINGS_PER_SCAN:
                break
            fid = f.get("fileId") or f.get("id")
            if not fid:
                continue
            raw, _ = http_get_raw(
                "%s/v1/Meetings/GetMeetingFileStream(fileId=%s,plainText=false)"
                % (base, fid))
            fetched += 1
            if raw:
                text = pdf_to_text(raw) if raw[:5] == b"%PDF-" \
                    else html_to_text(raw.decode("utf-8", "replace"))
                if len(text.strip()) >= 80:
                    break
                text = ""
        items.append({
            "uid": eid, "title": title, "text": text,
            "status": "Scheduled" if date >= now.strftime("%Y-%m-%d") else "Held",
            "meeting_body": ev.get("categoryName") or "", "date": date,
            "modified": date, "file": "",
            "url": "https://%s.portal.civicclerk.com/event/%s/overview"
                   % (src["client"], eid),
        })
    return items


def fetch_primegov(src, since, now):
    """PrimeGov - public JSON API, item = a meeting with agenda documents."""
    base = "https://%s.primegov.com" % src["client"]
    meetings, err = http_get_json(base + "/api/v2/PublicPortal/ListUpcomingMeetings")
    if meetings is None:
        raise ConnectorError(err)
    if not isinstance(meetings, list):
        raise ConnectorError("unexpected response format (API may have changed)")
    for year in {now.year, int(since[:4])}:
        arch, _ = http_get_json(
            base + "/api/v2/PublicPortal/ListArchivedMeetings?year=%d" % year)
        if isinstance(arch, list):
            meetings = meetings + arch
    items, fetched = [], 0
    for m in meetings:
        if not isinstance(m, dict):
            continue
        raw_date = str(m.get("dateTime") or m.get("date") or "")
        date = raw_date[:10] if re.match(r"\d{4}-\d{2}-\d{2}", raw_date) else ""
        if date and date < since[:10]:
            continue
        mid = m.get("id") or m.get("meetingId")
        title = (m.get("title") or m.get("templateName") or "Meeting").strip()
        text = ""
        docs = sorted(m.get("documentList") or [],
                      key=lambda d: 0 if "agenda" in
                      str(d.get("templateName", "")).lower() else 1)
        for d in docs:
            if fetched >= MAX_MEETINGS_PER_SCAN:
                break
            fid = d.get("compiledMeetingDocumentFileId") or d.get("id")
            if not fid:
                continue
            # Try the HTML preview first (clean text), then the PDF.
            for url in ("%s/Portal/MeetingPreview?compiledMeetingDocumentFileId=%s" % (base, fid),
                        "%s/Public/CompiledDocument/%s?compileOutputType=1" % (base, fid)):
                raw, _ = http_get_raw(url)
                fetched += 1
                if raw:
                    text = pdf_to_text(raw) if raw[:5] == b"%PDF-" \
                        else html_to_text(raw.decode("utf-8", "replace"))
                    if len(text.strip()) >= 80:
                        break
                    text = ""
            if text:
                break
        items.append({
            "uid": mid, "title": title, "text": text,
            "status": "Scheduled" if (date and date >= now.strftime("%Y-%m-%d")) else "Held",
            "meeting_body": "", "date": date, "modified": date, "file": "",
            "url": base + "/Portal/Meeting?meetingTemplateId=%s" % (
                m.get("templateId") or mid or ""),
        })
    return items


def fetch_iqm2(src, since, now):
    """Granicus iQM2 - HTML calendar + meeting detail pages, item = a meeting."""
    base = "https://%s.iqm2.com" % src["client"]
    since_dt = datetime.fromisoformat(since[:10])
    frm = "%d/%d/%d" % (since_dt.month, since_dt.day, since_dt.year)
    to_dt = now + timedelta(days=30)
    to = "%d/%d/%d" % (to_dt.month, to_dt.day, to_dt.year)
    raw, err = http_get_raw("%s/Citizens/Calendar.aspx?From=%s&To=%s" % (
        base, urllib.parse.quote(frm, safe=""), urllib.parse.quote(to, safe="")))
    if raw is None:
        raise ConnectorError(err)
    page = raw.decode("utf-8", "replace")
    if "<html" not in page.lower():
        raise ConnectorError("unexpected page (layout may have changed)")
    ids = list(dict.fromkeys(re.findall(r"Detail_Meeting\.aspx\?ID=(\d+)", page)))
    if len(ids) > MAX_MEETINGS_PER_SCAN:
        log("  %-22s note: %d meetings in window, reading first %d (politeness cap)"
            % (src["client"], len(ids), MAX_MEETINGS_PER_SCAN))
        ids = ids[:MAX_MEETINGS_PER_SCAN]
    items = []
    for mid in ids:
        url = "%s/Citizens/Detail_Meeting.aspx?ID=%s" % (base, mid)
        praw, _ = http_get_raw(url)
        if not praw:
            continue
        detail = praw.decode("utf-8", "replace")
        t = re.search(r"<title>(.*?)</title>", detail, re.I | re.S)
        title = html.unescape(t.group(1)).strip() if t else "Meeting %s" % mid
        d = re.search(r"(\d{1,2}/\d{1,2}/\d{4})", title + " " + detail[:3000])
        date = ""
        if d:
            mo, dy, yr = d.group(1).split("/")
            date = "%s-%02d-%02d" % (yr, int(mo), int(dy))
        items.append({
            "uid": mid, "title": title[:200], "text": html_to_text(detail),
            "status": "Scheduled" if (date and date >= now.strftime("%Y-%m-%d")) else "Held",
            "meeting_body": "", "date": date, "modified": date, "file": "",
            "url": url,
        })
    return items


def fetch_agendacenter(src, since, now):
    """CivicPlus Agenda Center - agenda/minutes PDFs linked from /AgendaCenter.

    src["client"] is the government's web domain (e.g. "bexar.org").
    Document links embed their date: /AgendaCenter/ViewFile/Agenda/_MMDDYYYY-NNN
    """
    base = "https://%s" % src["client"].rstrip("/")
    raw, err = http_get_raw(base + "/AgendaCenter")
    if raw is None:
        raise ConnectorError(err)
    page = raw.decode("utf-8", "replace")
    if "viewfile" not in page.lower():
        raise ConnectorError("no agenda links found (layout may have changed)")
    items, fetched = [], 0
    links = re.finditer(
        r'<a[^>]*href="(/AgendaCenter/ViewFile/(Agenda|Minutes)/_(\d{2})(\d{2})(\d{4})-(\d+))"'
        r'[^>]*>', page)
    todays = now.strftime("%Y-%m-%d")
    skipped = 0
    for m in links:
        path, typ, mm, dd, yyyy, num = m.groups()
        tm = re.search(r'title="([^"]*)"', m.group(0))
        title = tm.group(1) if tm else ""
        date = "%s-%s-%s" % (yyyy, mm, dd)
        if date < since[:10]:
            continue
        uid = "%s-%s" % (typ.lower(), num)
        if "%s:%s" % (src["client"], uid) in KNOWN_IDS:
            continue
        if fetched >= MAX_MEETINGS_PER_SCAN:
            skipped += 1
            continue
        fetched += 1
        raw2, _ = http_get_raw(base + path)
        text = pdf_to_text(raw2) if raw2 else ""
        items.append({
            "uid": uid,
            "title": html.unescape(title).strip() if title else "%s %s/%s/%s" % (typ, mm, dd, yyyy),
            "text": text,
            "status": "Scheduled" if date >= todays else "Held",
            "meeting_body": "", "date": date, "modified": date, "file": typ,
            "url": base + path,
        })
    if skipped:
        log("  %-22s note: %d newer documents deferred to next scan (politeness cap)"
            % (src["client"], skipped))
    return items


MONTH_RX = (r"(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*")


def sniff_date(s):
    """Best-effort meeting date from a link label or filename. '' if none."""
    if not s:
        return ""
    m = re.search(r"(20\d{2})[-_/.](\d{1,2})[-_/.](\d{1,2})", s)          # 2026-07-21
    if m:
        y, mo, d = m.groups()
    else:
        m = re.search(r"(?<!\d)(\d{1,2})[-_/.](\d{1,2})[-_/.](20\d{2})", s)  # 7/21/2026
        if m:
            mo, d, y = m.groups()
        else:
            m = re.search(MONTH_RX + r"\.?\s+(\d{1,2}),?\s+(20\d{2})", s, re.I)  # July 21, 2026
            if m:
                mo = str(["jan", "feb", "mar", "apr", "may", "jun", "jul",
                          "aug", "sep", "oct", "nov", "dec"].index(m.group(1)[:3].lower()) + 1)
                d, y = m.group(2), m.group(3)
            else:
                m = re.search(r"_?(\d{2})(\d{2})(20\d{2})\b", s)          # _07212026
                if m:
                    mo, d, y = m.groups()
                else:
                    return ""
    try:
        mo, d = int(mo), int(d)
        if 1 <= mo <= 12 and 1 <= d <= 31:
            return "%s-%02d-%02d" % (y, mo, d)
    except ValueError:
        pass
    return ""


def fetch_pagewatch(src, since, now):
    """Generic fallback for governments with no platform at all.

    Point src["url"] at the page where a body posts its agendas/minutes.
    The connector collects agenda-looking document links from that page,
    reads the new ones, and scans their text. Works on plain PDF-on-a-
    website publishing - the long tail that no vendor platform covers.
    """
    url = src.get("url")
    if not url:
        raise ConnectorError("no 'url' configured for this pagewatch source")
    raw, err = http_get_raw(url)
    if raw is None:
        raise ConnectorError(err)
    page = raw.decode("utf-8", "replace")
    # Collect links that look like meeting documents.
    cands = []
    for m in re.finditer(r'<a[^>]+href="([^"]+)"[^>]*>(.*?)</a>', page, re.S):
        href, label = m.group(1), html_to_text(m.group(2)).strip()
        blob = (href + " " + label).lower()
        if re.search(r"agenda|minutes|packet|meeting", blob) and (
                ".pdf" in href.lower() or "agenda" in href.lower()):
            cands.append((urllib.parse.urljoin(url, href), label))
    if not cands and "<html" not in page.lower():
        raise ConnectorError("unexpected page (layout may have changed)")
    items, fetched = [], 0
    seen_urls = set()
    for link, label in cands:
        if link in seen_urls:
            continue
        seen_urls.add(link)
        uid = "u" + hashlib.md5(link.encode()).hexdigest()[:16]
        if "%s:%s" % (src["client"], uid) in KNOWN_IDS:
            continue
        if fetched >= MAX_MEETINGS_PER_SCAN:
            break
        fetched += 1
        raw2, _ = http_get_raw(link)
        if not raw2:
            continue
        text = pdf_to_text(raw2) if raw2[:5] == b"%PDF-" \
            else html_to_text(raw2.decode("utf-8", "replace"))
        title = label or link.rsplit("/", 1)[-1]
        date = sniff_date(label) or sniff_date(link.rsplit("/", 1)[-1])
        status = ""
        if date:
            status = "Scheduled" if date >= now.strftime("%Y-%m-%d") else "Held"
        items.append({
            "uid": uid, "title": title[:200], "text": text,
            "status": status, "meeting_body": "", "date": date,
            "modified": date or now.strftime("%Y-%m-%d"), "file": "",
            "url": link,
        })
    return items


# Ids already in the database (set by cmd_scan before dispatch) so document-
# fetching connectors never re-download something we've already read.
KNOWN_IDS = set()

CONNECTORS = {
    "legistar": fetch_legistar,
    "civicclerk": fetch_civicclerk,
    "primegov": fetch_primegov,
    "iqm2": fetch_iqm2,
    "agendacenter": fetch_agendacenter,
    "pagewatch": fetch_pagewatch,
}


def cmd_scan(days=None, force=False):
    cfg = load_sources()
    conn = db()
    now = datetime.now(timezone.utc)
    now_iso = now.strftime("%Y-%m-%d %H:%M")

    # Polite-guest rule: refuse to re-scan within MIN_SCAN_GAP_DAYS.
    last_scan = get_meta(conn, "last_scan")
    gap_days = None
    if last_scan:
        gap_days = (now - datetime.fromisoformat(last_scan)).total_seconds() / 86400
        if gap_days < MIN_SCAN_GAP_DAYS and not force:
            due = datetime.fromisoformat(last_scan) + timedelta(days=MIN_SCAN_GAP_DAYS)
            log("Last scan was %.1f days ago - being a polite guest, next scan is due %s."
                % (gap_days, due.strftime("%b %d")))
            log("(Use 'scan --force' if you really need one now.)")
            build_dashboard(conn)
            conn.close()
            return

    # Look back far enough to cover the gap since the last scan, plus a
    # 2-day overlap so nothing slips through. First run: 14 days.
    if days is None:
        days = 14 if gap_days is None else min(30, int(gap_days) + 2)

    since = (now - timedelta(days=days)).strftime("%Y-%m-%dT00:00:00")
    new_hits = []

    active = [s for s in cfg["sources"] if s.get("verified") is not False]
    log("Scanning %d sources for legislation touched since %s ...\n" % (len(active), since[:10]))

    # Let document-fetching connectors skip anything already in the database.
    KNOWN_IDS.clear()
    KNOWN_IDS.update(r[0] for r in conn.execute("SELECT id FROM hits"))

    for src in active:
        platform = src.get("platform", "legistar")
        if platform not in CONNECTORS:
            log("  %-22s SKIPPED (unknown platform '%s')" % (src["client"], platform))
            continue
        try:
            items = CONNECTORS[platform](src, since, now)
        except ConnectorError as e:
            # Watchdog bookkeeping: count consecutive failures per source.
            src["fail_streak"] = src.get("fail_streak", 0) + 1
            src["last_error"] = str(e)
            log("  %-22s SKIPPED (%s)" % (src["client"], e))
            continue
        except Exception as e:  # a bug in a connector must not stop the scan
            src["fail_streak"] = src.get("fail_streak", 0) + 1
            src["last_error"] = "connector crashed: %s" % str(e)[:90]
            log("  %-22s SKIPPED (connector crashed: %s)" % (src["client"], e))
            continue
        src["fail_streak"] = 0
        src["last_ok"] = now_iso[:10]
        src.pop("last_error", None)
        count = 0
        for it in items:
            hit_id = "%s:%s" % (src["client"], it["uid"])
            if conn.execute("SELECT 1 FROM hits WHERE id=?", (hit_id,)).fetchone():
                continue
            base_text = it["title"] + ("\n" + it["text"] if it.get("text") else "")
            score, tags, snippets, category, relevance = score_text(base_text)
            if not score:
                continue  # no tow/impound language
            # Legistar items carry a lazy full-text fetcher; pull it only for
            # hits, then re-score so repeat mentions raise the rating.
            if it.get("fetch_text"):
                body_text = it["fetch_text"]() or ""
                if body_text:
                    score, tags, snippets, category, relevance = score_text(
                        it["title"] + "\n" + body_text)
            row = {
                "id": hit_id, "client": src["client"], "city": src["name"],
                "state": src["state"], "matter_file": it.get("file", ""),
                "title": it["title"][:600],
                "url": it["url"], "keywords": ", ".join(tags),
                "snippet": "\n---\n".join(snippets),
                "status": it.get("status", ""),
                "body": it.get("meeting_body", ""),
                "intro_date": it.get("date", ""),
                "last_modified": it.get("modified") or it.get("date", ""),
                "first_seen": now_iso,
                "score": score, "category": category, "relevance": relevance,
                "graded_by": "keywords", "summary": "",
            }
            new_hits.append(row)
            count += 1
        log("  %-22s %-10s %d item(s) checked, %d new hit%s" % (
            src["client"], platform, len(items), count, "" if count == 1 else "s"))

    # Optional AI upgrade: if a key is present, Claude refines the keyword
    # grade and writes a summary. Without a key the keyword score stands.
    if new_hits and os.environ.get("ANTHROPIC_API_KEY"):
        log("\nAsking Claude to grade %d new hit(s)..." % len(new_hits))
        for row in new_hits:
            grade = ai_grade(row)
            if grade.get("relevance"):
                row.update(grade)
                row["graded_by"] = "ai"

    for row in new_hits:
        conn.execute("""INSERT OR IGNORE INTO hits
            (id, client, city, state, matter_file, title, url, keywords, snippet,
             status, body, intro_date, last_modified, first_seen, summary, category,
             relevance, score, graded_by, demo)
            VALUES (:id,:client,:city,:state,:matter_file,:title,:url,:keywords,:snippet,
             :status,:body,:intro_date,:last_modified,:first_seen,:summary,:category,
             :relevance,:score,:graded_by,0)""", row)
    conn.commit()
    # a real scan replaces any demo data
    if new_hits:
        conn.execute("DELETE FROM hits WHERE demo=1")
        conn.commit()
    set_meta(conn, "last_scan", now.isoformat())
    save_sources(cfg)  # persist per-source health for the watchdog panel

    failing = [s for s in active if s.get("fail_streak", 0) > 0]
    if failing:
        log("\nWatchdog: %d source(s) had problems this scan:" % len(failing))
        for s in failing:
            log("  %s (%s) - %d scan(s) in a row: %s" % (
                s["name"], s["client"], s["fail_streak"], s.get("last_error", "")))
        log("A source failing 2+ scans in a row has probably changed platforms;")
        log("paste this output to Claude to get it re-verified and fixed.")
        # Third consecutive failure = chronic. File one ticket per source,
        # exactly once, at the moment it crosses the line.
        for s in failing:
            if s.get("fail_streak") == 3:
                err = s.get("last_error", "")
                if "changed" in err or "format" in err:
                    likely = ("%s redesigned or moved its meeting website - "
                              "the connector is reading a page that no longer "
                              "looks the way it did." % s["name"])
                else:
                    likely = ("%s's site is unreachable or refusing this "
                              "network - could be an outage on their side, a "
                              "block, or a changed address." % s["name"])
                file_ticket(
                    summary="Source '%s' (%s, %s / %s connector) has failed 3 "
                            "scans in a row: %s" % (
                                s["name"], s["client"], s["state"],
                                s.get("platform", "legistar"), err),
                    likely=likely,
                    claude_steps="Re-research where this government now "
                                 "publishes meetings, confirm the new platform "
                                 "or URL, and update its one line in "
                                 "sources.json.",
                    operator_steps="Paste this ticket into a Claude chat - "
                                   "nothing else needed. All other sources are "
                                   "unaffected and keep scanning normally.")

    log("\n%d new alert(s) saved." % len(new_hits))
    build_dashboard(conn)
    conn.close()


# ------------------------------------------------------------------ AI pass --
AI_PROMPT = """You grade local-government legislation for a towing & impound company's
business-development team. Given an agenda/legislation item, reply with ONLY a JSON
object, no other text:
{"relevance": "high|medium|low",
 "category": "contract/RFP|dispatch/911|tech/software|ordinance|fees|enforcement|PPI/portal|other",
 "summary": "<max 2 sentences, plain English: what is happening and why a towing
 company should care (new business, rule change, risk). No fluff.>"}

high = money or rules on the table (contracts, RFPs, rotation lists, fee changes,
new PPI/permit requirements). medium = relevant discussion, no action yet.
low = mentions towing only incidentally."""


def ai_grade(row):
    body = {
        "model": "claude-haiku-4-5-20251001",
        "max_tokens": 300,
        "system": AI_PROMPT,
        "messages": [{"role": "user", "content":
            "City: %s, %s\nItem: %s\nStatus: %s\nMatched text:\n%s" % (
                row["city"], row["state"], row["title"], row["status"], row["snippet"][:2000])}],
    }
    req = urllib.request.Request(
        "https://api.anthropic.com/v1/messages",
        data=json.dumps(body).encode(),
        headers={"content-type": "application/json",
                 "x-api-key": os.environ["ANTHROPIC_API_KEY"],
                 "anthropic-version": "2023-06-01"})
    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            out = json.loads(resp.read())
        text = "".join(b.get("text", "") for b in out.get("content", []))
        m = re.search(r"\{.*\}", text, re.S)
        g = json.loads(m.group(0)) if m else {}
        return {"relevance": g.get("relevance", ""),
                "category": g.get("category", ""),
                "summary": g.get("summary", "")}
    except Exception as e:
        log("    (AI grading failed for %s: %s)" % (row["id"], str(e)[:80]))
        return {"relevance": "", "category": "", "summary": ""}


# ------------------------------------------------------------------- report --
# Stage detection: is this item still actionable ("forward looking") or
# already decided ("in the moment" intel)? Derived from the status field.
DECIDED_RX = re.compile(
    r"adopt|passed|approv|award|enact|final|complet|denied|failed|withdrawn|executed|\bheld\b",
    re.IGNORECASE)
UPCOMING_RX = re.compile(
    r"first reading|second reading|introduc|referred|agenda ready|scheduled|"
    r"solicitation|open|pending|hearing|posted|committee|filed|active",
    re.IGNORECASE)


def stage_of(status):
    if not status:
        return ""
    if DECIDED_RX.search(status):
        return "decided"
    if UPCOMING_RX.search(status):
        return "upcoming"
    return ""


CATEGORY_COLORS = {
    "contract/RFP": "#1a7f5a", "ordinance": "#2456a6", "fees": "#a66a00",
    "enforcement": "#a63030", "PPI/portal": "#6a3fa0",
    "dispatch/911": "#8a1f5f", "tech/software": "#0f766e",
    "other": "#5a6472", "": "#5a6472",
}

PAGE = """<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>ToWatch by Autura</title>
<style>
@font-face { font-family: 'Nunito'; font-weight: 900;
             src: url('nunito-black.woff2') format('woff2'); }
  :root { color-scheme: light; --blue: #2B5CF0; --green: #12A150; --ink: #101418; }
  * { box-sizing: border-box; margin: 0; }
  body { font: 15px/1.5 -apple-system, "Segoe UI", system-ui, sans-serif;
         background: #fafbfd; color: #1c2733; padding: 0 16px 60px; }
  .topbar { height: 4px; margin: 0 -16px 22px;
            background: linear-gradient(90deg, var(--blue), var(--green)); }
  .wrap { max-width: 860px; margin: 0 auto; }
  header { display: flex; align-items: baseline; gap: 14px; flex-wrap: wrap;
           margin-bottom: 4px; }
  .logo { font: 900 40px/1.1 "Nunito", "Arial Rounded MT Bold", "Segoe UI",
          system-ui, sans-serif; letter-spacing: -1px;
          background: linear-gradient(90deg, #1B3FD8 0%, #2B5CF0 35%,
                                      #7E8CA6 80%, #AEB8C6 100%);
          -webkit-background-clip: text; background-clip: text;
          color: transparent; }
  .logo .tt { position: relative; -webkit-text-fill-color: #1B3FD8; }
  .logo .tt::after { content: ""; position: absolute; top: -10px; right: 1px;
      width: 0; height: 0; border-left: 14px solid transparent;
      border-bottom: 14px solid var(--blue); }
  .byline { font: 700 13px/1 "Segoe UI", system-ui, sans-serif;
            color: #7d8895; letter-spacing: .4px; }
  .byline b { color: var(--ink); font-weight: 900; }
  .sub { color: #5a6472; font-size: 13px; margin-bottom: 18px; }
  .health { background: #fff; border: 1px solid #e2e8ee; border-radius: 10px;
            padding: 12px 16px; font-size: 13px; color: #3a4754; margin-top: 24px; }
  .health b { color: var(--ink); }
  .health .bad { color: #a63030; }
  .demoflag { background: #fff3cd; border: 1px solid #e6cf87; color: #6b5a12;
              border-radius: 8px; padding: 8px 12px; font-size: 13px; margin-bottom: 16px; }
  .filters { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 18px; align-items: center; }
  .chip { border: 1px solid #c6d0da; background: #fff; border-radius: 999px;
          padding: 4px 12px; font-size: 13px; cursor: pointer; color: #3a4754; }
  .chip.on { background: var(--blue); color: #fff; border-color: var(--blue); }
  #q { flex: 1; min-width: 160px; border: 1px solid #c6d0da; border-radius: 8px;
       padding: 6px 10px; font: inherit; font-size: 13px; }
  .card { background: #fff; border: 1px solid #e2e8ee; border-left: 4px solid var(--cat, #5a6472);
          border-radius: 10px; padding: 14px 16px; margin-bottom: 12px; }
  .hide { display: none; }
  .meta { display: flex; flex-wrap: wrap; gap: 8px; align-items: center;
          font-size: 12.5px; color: #5a6472; margin-bottom: 6px; }
  .loc { font-weight: 600; color: #16324f; font-size: 13.5px; }
  .badge { border-radius: 5px; padding: 1px 7px; font-size: 11.5px; font-weight: 600;
           color: #fff; background: var(--cat, #5a6472); }
  .rel-high .badge.rel { background: #a63030; }
  .rel-medium .badge.rel { background: #a66a00; }
  .rel-low .badge.rel { background: #8a94a0; }
  .badge.stage-upcoming { background: var(--green); }
  .badge.stage-decided { background: #8a94a0; }
  .title { font-size: 15px; font-weight: 600; margin-bottom: 6px; }
  .title a { color: inherit; text-decoration: none; }
  .title a:hover { text-decoration: underline; }
  .summary { background: #f0f5fa; border-radius: 8px; padding: 8px 11px;
             font-size: 13.5px; margin-bottom: 8px; }
  .snippet { color: #3a4754; font-size: 13px; border-left: 3px solid #e2e8ee;
             padding-left: 10px; white-space: pre-wrap; }
  mark { background: #ffe9a8; border-radius: 3px; padding: 0 2px; }
  .tags { margin-top: 8px; font-size: 12px; color: #5a6472; }
  .empty { text-align: center; color: #5a6472; padding: 60px 0; }
  footer { text-align: center; color: #8a94a0; font-size: 12px; margin-top: 30px; }
</style></head><body><div class="topbar"></div><div class="wrap">
<header><h1 class="logo"><span class="tt">T</span>oWatch</h1>
<span class="byline">by <b>autura</b> &middot; keep communities moving</span></header>
<div class="sub">__COUNT__ alerts &middot; generated __WHEN__ &middot; __SCANMETA__</div>
__DEMOFLAG__
<div class="filters" id="statechips"><span class="chip on" data-state="">All states</span>__CHIPS__
<input id="q" placeholder="filter: city, keyword, RFP…"></div>
<div id="cards">__CARDS__</div>
<div class="empty hide" id="empty">Nothing matches that filter.</div>
__HEALTH__
<footer>ToWatch by Autura &middot; public legislative records &middot; polite-guest mode: scans at most once every 3 days</footer>
</div>
<script>
var chips=document.querySelectorAll('.chip'),q=document.getElementById('q'),st='';
function apply(){var t=q.value.toLowerCase(),n=0;
 document.querySelectorAll('.card').forEach(function(c){
  var ok=(!st||c.dataset.state===st)&&(!t||c.textContent.toLowerCase().indexOf(t)>=0);
  c.classList.toggle('hide',!ok); if(ok)n++;});
 document.getElementById('empty').classList.toggle('hide',n>0);}
chips.forEach(function(ch){ch.onclick=function(){st=ch.dataset.state;
 chips.forEach(function(c){c.classList.toggle('on',c===ch)});apply();};});
q.oninput=apply;
</script></body></html>
"""


def esc(s):
    return html.escape(s or "", quote=True)


def highlight(text_escaped):
    for tag, weight, rx in KEYWORDS:
        text_escaped = re.sub("(" + rx.pattern + ")", r"<mark>\1</mark>",
                              text_escaped, flags=re.IGNORECASE)
    return text_escaped


def build_dashboard(conn):
    rows = conn.execute("""SELECT * FROM hits ORDER BY
        CASE relevance WHEN 'high' THEN 0 WHEN 'medium' THEN 1 ELSE 2 END,
        score DESC, last_modified DESC, first_seen DESC""").fetchall()
    cols = [d[0] for d in conn.execute("SELECT * FROM hits LIMIT 0").description]
    cards, states, has_demo = [], [], False
    for r in rows:
        h = dict(zip(cols, r))
        if h["demo"]:
            has_demo = True
        if h["state"] not in states:
            states.append(h["state"])
        color = CATEGORY_COLORS.get(h["category"] or "", "#5a6472")
        badges = ""
        if h["category"]:
            badges += '<span class="badge">%s</span>' % esc(h["category"])
        if h["relevance"]:
            badges += ' <span class="badge rel">%s</span>' % esc(h["relevance"].upper())
        stage = stage_of(h["status"])
        if stage:
            badges += ' <span class="badge stage-%s">%s</span>' % (stage, stage.upper())
        summary = ('<div class="summary">%s</div>' % esc(h["summary"])) if h["summary"] else ""
        snippet = ('<div class="snippet">%s</div>' % highlight(esc(h["snippet"]))) if h["snippet"] else ""
        cards.append(
            '<div class="card rel-%s" data-state="%s" style="--cat:%s">'
            '<div class="meta"><span class="loc">%s, %s</span>%s'
            '<span>%s</span><span>%s</span></div>'
            '<div class="title"><a href="%s" target="_blank">%s %s</a></div>%s%s'
            '<div class="tags">matched: %s &middot; score %s%s</div></div>' % (
                esc(h["relevance"] or "none"), esc(h["state"]), color,
                esc(h["city"]), esc(h["state"]), badges,
                esc(h["last_modified"] or h["intro_date"]), esc(h["status"]),
                esc(h["url"]), esc(h["matter_file"]), esc(h["title"]),
                summary, snippet, esc(h["keywords"]), h["score"] or 0,
                " &middot; AI graded" if h["graded_by"] == "ai" else ""))
    chips = "".join('<span class="chip" data-state="%s">%s</span>' % (esc(s), esc(s))
                    for s in sorted(states))

    # Scan status for the header + watchdog panel for the footer.
    last_scan = get_meta(conn, "last_scan")
    if last_scan:
        last_dt = datetime.fromisoformat(last_scan)
        due = last_dt + timedelta(days=MIN_SCAN_GAP_DAYS)
        scanmeta = "last scan %s, next due %s" % (last_dt.strftime("%b %d"),
                                                  due.strftime("%b %d"))
    else:
        scanmeta = "no live scan yet"
    health = ""
    try:
        act = [s for s in load_sources()["sources"] if s.get("verified") is not False]
        bad = [s for s in act if s.get("fail_streak", 0) > 0]
        tickets = 0
        try:
            with open(TICKETS_FILE, encoding="utf-8") as f:
                tickets = f.read().count("## Ticket")
        except OSError:
            pass
        if last_scan:
            status = ("all sources healthy" if not bad else
                      '<span class="bad">%d source(s) failing</span>' % len(bad))
            if tickets:
                status += (' &middot; <span class="bad">%d ticket(s) filed - '
                           'paste tickets.md to Claude</span>' % tickets)
            items = "".join(
                '<div class="bad">%s, %s (%s) &mdash; %d scan(s) in a row: %s%s</div>' % (
                    esc(s["name"]), esc(s["state"]), esc(s["client"]),
                    s.get("fail_streak", 0), esc(s.get("last_error", "")),
                    " &mdash; likely changed platforms; ask Claude to re-verify this source"
                    if s.get("fail_streak", 0) >= 2 else "")
                for s in bad)
            health = ('<div class="health"><b>Watchdog</b> &middot; %d sources watched '
                      '&middot; %s%s</div>' % (len(act), status, items))
    except Exception:
        pass  # a broken sources.json should never take the dashboard down

    page = (PAGE
            .replace("__COUNT__", str(len(rows)))
            .replace("__WHEN__", datetime.now().strftime("%b %d, %Y %H:%M"))
            .replace("__SCANMETA__", scanmeta)
            .replace("__HEALTH__", health)
            .replace("__DEMOFLAG__", '<div class="demoflag">Sample data — run '
                     '<b>python3 towwatch.py scan</b> to replace with live alerts.</div>'
                     if has_demo else "")
            .replace("__CHIPS__", chips)
            .replace("__CARDS__", "".join(cards) if cards else
                     '<div class="empty">No alerts yet. Run a scan.</div>'))
    with open(DASH_FILE, "w", encoding="utf-8") as f:
        f.write(page)
    log("Dashboard written to %s — open it in a browser." % DASH_FILE)


# -------------------------------------------------------------------- demo --
DEMO_HITS = [
    dict(id="demo:0", client="demo", city="Harris County", state="TX", matter_file="RFP 26-0331",
         title="Request for Proposals: towing dispatch and management software for "
               "law-enforcement initiated tows, Sheriff's Office",
         url="#", keywords="tow software, police tow, towing, rotation list",
         snippet="…solicit proposals for a digital towing dispatch platform integrated "
                 "with the Sheriff's Office computer-aided dispatch (CAD) system, "
                 "replacing the manual rotation list call-out process and providing "
                 "real-time tow truck status to deputies on scene…",
         status="Solicitation Open", body="Commissioners Court", intro_date="2026-07-06",
         last_modified="2026-07-11", first_seen="2026-07-14 09:00",
         summary="", category="contract/RFP", relevance="high",
         score=27, graded_by="keywords", demo=1),
    dict(id="demo:1", client="demo", city="Fort Worth", state="TX", matter_file="M&C 26-0412",
         title="Authorize execution of a Non-Consent Tow Rotation Services Agreement with "
               "qualified wrecker operators for police-initiated tows, citywide",
         url="#", keywords="towing, wrecker, rotation list, non-consent",
         snippet="…authorize a rotation list of qualified wrecker companies to perform "
                 "non-consent tows initiated by the Police Department, with annual "
                 "performance reviews and updated per-tow fee caps…",
         status="Agenda Ready", body="City Council", intro_date="2026-07-08",
         last_modified="2026-07-10", first_seen="2026-07-14 09:00",
         summary="", category="contract/RFP", relevance="high",
         score=18, graded_by="keywords", demo=1),
    dict(id="demo:2", client="demo", city="Tulsa", state="OK", matter_file="ORD 77123",
         title="An ordinance amending Title 37, private property impound; requiring use of "
               "the city vehicle-release portal and signage updates",
         url="#", keywords="impound, PPI",
         snippet="…all private property impound operators shall register releases through "
                 "the city's online vehicle portal within two hours of tow completion; "
                 "updated signage requirements take effect January 1…",
         status="First Reading", body="City Council", intro_date="2026-07-02",
         last_modified="2026-07-09", first_seen="2026-07-14 09:00",
         summary="Tulsa would require PPI operators to log every release in a city portal "
                 "within 2 hours. A compliance change for every operator in the city.",
         category="PPI/portal", relevance="high",
         score=13, graded_by="ai", demo=1),
    dict(id="demo:3", client="demo", city="Columbus", state="OH", matter_file="0455-2026",
         title="To amend impound lot storage fee schedule and abandoned vehicle auction procedures",
         url="#", keywords="impound, veh storage, abandoned veh, veh auction",
         snippet="…increase daily storage fees at the city impound lot from $18 to $25 and "
                 "authorize monthly auctions of abandoned vehicles held over 30 days…",
         status="Referred to Committee", body="Public Service Committee", intro_date="2026-06-28",
         last_modified="2026-07-07", first_seen="2026-07-14 09:00",
         summary="", category="fees", relevance="medium",
         score=9, graded_by="keywords", demo=1),
    dict(id="demo:4", client="demo", city="Nashville", state="TN", matter_file="RS2026-1099",
         title="A resolution accepting a report on booting and immobilization enforcement in "
               "the downtown entertainment district",
         url="#", keywords="immobilize",
         snippet="…report finds vehicle immobilization complaints doubled year-over-year; "
                 "Council requests recommendations on licensing booting operators…",
         status="Adopted", body="Metro Council", intro_date="2026-06-20",
         last_modified="2026-07-01", first_seen="2026-07-14 09:00",
         summary="", category="ordinance", relevance="low",
         score=4, graded_by="keywords", demo=1),
]


def cmd_demo():
    conn = db()
    for h in DEMO_HITS:
        conn.execute("""INSERT OR REPLACE INTO hits
            (id, client, city, state, matter_file, title, url, keywords, snippet,
             status, body, intro_date, last_modified, first_seen, summary, category,
             relevance, score, graded_by, demo)
            VALUES (:id,:client,:city,:state,:matter_file,:title,:url,:keywords,:snippet,
             :status,:body,:intro_date,:last_modified,:first_seen,:summary,:category,
             :relevance,:score,:graded_by,:demo)""", h)
    conn.commit()
    build_dashboard(conn)
    conn.close()


# -------------------------------------------------------------------- main --
def main():
    # Windows consoles sometimes can't print every character — never crash over it.
    if hasattr(sys.stdout, "reconfigure"):
        try:
            sys.stdout.reconfigure(errors="replace")
        except Exception:
            pass
    args = sys.argv[1:]
    cmd = args[0] if args else "report"
    try:
        if cmd == "probe":
            cmd_probe()
        elif cmd == "scan":
            days = None
            if "--days" in args:
                days = int(args[args.index("--days") + 1])
            cmd_scan(days, force="--force" in args)
        elif cmd == "report":
            conn = db()
            build_dashboard(conn)
            conn.close()
        elif cmd == "demo":
            cmd_demo()
        else:
            print(__doc__)
    except KeyboardInterrupt:
        log("\nStopped by you. Nothing was harmed; run the command again anytime.")
    except Exception:
        import traceback
        tb = traceback.format_exc()
        file_ticket(
            summary="The '%s' command crashed before finishing." % cmd,
            likely="An update or an unusual website response broke an "
                   "assumption in the code - a genuine bug, not operator error.",
            claude_steps="Read the traceback below, reproduce the crash, and "
                         "ship a fix to towwatch.py.",
            operator_steps="Paste this ticket (or all of tickets.md) into a "
                           "Claude chat, or send it to the app's creator. Your "
                           "saved alerts and dashboard are safe - this crash "
                           "did not lose data.",
            details=tb)
        log("=" * 62)
        log("ToWatch hit an unexpected error - that's a bug, not your fault.")
        log("What happened:   the '%s' command crashed before finishing." % cmd)
        log("Likely reason:   a code assumption broke (details in the ticket).")
        log("Claude's next    read the ticket, reproduce the crash, ship the")
        log("steps:           fix - usually a small one.")
        log("Your next step:  paste tickets.md into a Claude chat. Done.")
        log("=" * 62)
        sys.exit(1)


if __name__ == "__main__":
    main()
