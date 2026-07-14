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

import json
import os
import re
import sqlite3
import sys
import html
import urllib.request
import urllib.parse
import urllib.error
from datetime import datetime, timedelta, timezone

ROOT = os.path.dirname(os.path.abspath(__file__))
SOURCES_FILE = os.path.join(ROOT, "sources.json")
DB_FILE = os.path.join(ROOT, "towwatch.db")
DASH_FILE = os.path.join(ROOT, "dashboard.html")
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
def log(msg):
    print(msg, flush=True)


def http_get_json(url, timeout=30):
    """GET a URL, return (parsed_json, None) or (None, 'error string')."""
    req = urllib.request.Request(url, headers={
        "Accept": "application/json",
        "User-Agent": USER_AGENT,
    })
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            return json.loads(resp.read().decode("utf-8", "replace")), None
    except urllib.error.HTTPError as e:
        return None, "HTTP %d" % e.code
    except Exception as e:  # timeouts, DNS, bad JSON, etc.
        return None, str(e)[:120]


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
def cmd_probe():
    cfg = load_sources()
    ok = blocked = 0
    for src in cfg["sources"]:
        url = "%s/%s/bodies?%s" % (API, src["client"],
                                   urllib.parse.urlencode({"$top": 1}, quote_via=urllib.parse.quote))
        data, err = http_get_json(url, timeout=20)
        if data is not None:
            src["verified"] = True
            src.pop("error", None)
            ok += 1
            log("  OK      %-22s (%s, %s)" % (src["client"], src["name"], src["state"]))
        else:
            src["verified"] = False
            src["error"] = err
            blocked += 1
            log("  FAILED  %-22s (%s, %s) — %s" % (src["client"], src["name"], src["state"], err))
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

    for src in active:
        flt = "MatterLastModifiedUtc ge datetime'%s' and MatterRestrictViewViaWeb eq false" % since
        qs = urllib.parse.urlencode(
            {"$filter": flt, "$top": 1000, "$orderby": "MatterLastModifiedUtc desc"},
            quote_via=urllib.parse.quote)
        data, err = http_get_json("%s/%s/matters?%s" % (API, src["client"], qs))
        if data is not None and not isinstance(data, list):
            # The endpoint answered but not in the shape we expect - that
            # usually means the platform changed, not a network blip.
            data, err = None, "unexpected response format (site may have changed platforms)"
        if data is None:
            # Watchdog bookkeeping: count consecutive failures per source.
            src["fail_streak"] = src.get("fail_streak", 0) + 1
            src["last_error"] = err
            log("  %-22s SKIPPED (%s)" % (src["client"], err))
            continue
        src["fail_streak"] = 0
        src["last_ok"] = now_iso[:10]
        src.pop("last_error", None)
        count = 0
        for m in data:
            title = " ".join(filter(None, [m.get("MatterName"), m.get("MatterTitle")]))
            score, tags, snippets, category, relevance = score_text(title)
            matter_id = m.get("MatterId")
            hit_id = "%s:%s" % (src["client"], matter_id)
            already = conn.execute("SELECT 1 FROM hits WHERE id=?", (hit_id,)).fetchone()
            if already:
                continue
            if not score:
                continue  # no tow/impound language in the title/name
            # Pull the full legislation text and re-score title + body together,
            # so repeat mentions and contract/fee language raise the rating.
            body_text = fetch_matter_text(src["client"], matter_id)
            if body_text:
                score, tags, snippets, category, relevance = score_text(
                    title + "\n" + body_text)
            guid = m.get("MatterGuid") or ""
            url = "https://%s.legistar.com/LegislationDetail.aspx?ID=%s&GUID=%s" % (
                src["client"], matter_id, guid)
            row = {
                "id": hit_id, "client": src["client"], "city": src["name"],
                "state": src["state"], "matter_file": m.get("MatterFile") or "",
                "title": (m.get("MatterTitle") or m.get("MatterName") or "")[:600],
                "url": url, "keywords": ", ".join(tags),
                "snippet": "\n---\n".join(snippets),
                "status": m.get("MatterStatusName") or "",
                "body": m.get("MatterBodyName") or "",
                "intro_date": (m.get("MatterIntroDate") or "")[:10],
                "last_modified": (m.get("MatterLastModifiedUtc") or "")[:10],
                "first_seen": now_iso,
                "score": score, "category": category, "relevance": relevance,
                "graded_by": "keywords", "summary": "",
            }
            new_hits.append(row)
            count += 1
        log("  %-22s %d matters checked, %d new hit%s" % (
            src["client"], len(data), count, "" if count == 1 else "s"))

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
    r"adopt|passed|approv|award|enact|final|complet|denied|failed|withdrawn|executed",
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
        if last_scan:
            status = ("all sources healthy" if not bad else
                      '<span class="bad">%d source(s) failing</span>' % len(bad))
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


if __name__ == "__main__":
    main()
