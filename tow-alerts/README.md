# ToWatch (by Autura)

Your own government-meeting alert system for the towing industry. It watches
city and county legislative records for anything mentioning **towing, impound,
wrecker rotation, private property impound (PPI), vehicle storage, tow
dispatch software, consolidated dispatch, predatory towing** — scores every
hit, and turns them into a clean color-coded dashboard in Autura's style.

This is the do-it-yourself version of the alert services vendors keep
pitching. It runs on your own computer and costs nothing to operate.

## Polite-guest rules (built in — there are two)

1. **The 3-day rule:** ToWatch scans **at most once every 3 days** — the
   industry moves slowly and there's no reason to knock more often.
   Double-click the launcher as often as you like: if a scan isn't due yet
   it just says so, tells you when the next one is, and opens the dashboard
   with what it already has. The lookback window automatically covers the
   gap since the last scan (plus a 2-day overlap), so nothing slips through
   between scans. `python3 ToWatch.py scan --force` overrides it when
   truly needed.
2. **The per-site pause:** during a scan, back-to-back requests to the
   *same* government's website stay at least 1 second apart, so no
   individual site ever sees rapid-fire traffic. Requests to *different*
   sites don't wait on each other — pausing between Houston and Tulsa
   protects nobody — which keeps the overall scan quick.

## The browser fail-safe (automatic)

Some government sites (CivicPlus-hosted ones especially) turn away
anything that doesn't announce itself as a web browser — even for fully
public agenda pages. ToWatch handles that wall by itself:

- Every site is first contacted with the honest ToWatch identity.
- If a site rejects it (HTTP 403/406), the app **immediately retries the
  same request presenting as a normal Chrome browser**, at the same
  gentle pacing — it never knocks faster, it just dresses differently.
- If browser mode works, the site is remembered in `sources.json`
  (`browser_hosts`), so every future scan starts there directly — no
  wasted rejected knock.
- If a site blocks *both* identities, the watchdog records the honest
  diagnosis ("browser mode was tried too") so you know it's a real wall,
  not a costume problem — that's the one to paste to Claude.

You'll see any tactic switches in the scan output as they happen, plus a
summary at the end listing which sites now run in browser mode.

## Built to withstand change (the watchdog)

Scrapers break when websites change — this one is built to notice and tell
you instead of failing silently:

- Every scan records per-source health in `sources.json` (last success,
  consecutive-failure streak, last error).
- The dashboard footer shows a **Watchdog** panel: how many sources are
  watched, which are healthy, and which are failing — with a plain-English
  diagnosis (a "response format changed" error means the site changed
  platforms, not a network blip).
- A source failing 2+ scans in a row gets flagged for re-verification —
  paste the watchdog output to Claude and it will find where that
  government moved its meeting data and fix the source list.
- One broken source never stops the others; a broken `sources.json` never
  takes the dashboard down.

## When something breaks (built-in bug tickets)

ToWatch treats every user as a power user: errors never just print a
cryptic message and vanish. Whenever something goes wrong you get, on the
spot: **what happened, the likely reason, the next steps Claude will take,
and the one step you need to take.** Two flavors:

- **A source going dark** (a government redesigns its site): the watchdog
  flags it each scan, and on the 3rd consecutive failure it files a ticket
  automatically. Other sources keep scanning; nothing else is affected.
- **A genuine crash** (a real bug): the app catches it, explains it in
  plain English, and files a ticket with the full technical traceback,
  app version, Python version, OS, and the recent activity log.

Tickets accumulate in **`tickets.md`** next to the app. The fix procedure
is always the same: paste the ticket (or the whole file) into a Claude
chat — or send it to the app's creator — and delete tickets once fixed.
The dashboard's Watchdog panel shows a count whenever tickets are waiting.

## Quick start — Windows (work computer)

1. **One-time:** install Python from the Microsoft Store (open the Store,
   search "Python", install the newest version — no admin rights needed on
   most work machines).
2. **First time only (optional but recommended):** open a Command Prompt in
   this folder and run `python ToWatch.py doctor`. It confirms Python, file
   access, the database, the scoring brain, and internet reach are all
   working — so your first real scan can't trip over a silent setup problem.
   Every line tells you plainly if something needs fixing.
3. **Every time:** double-click **`ToWatch.bat`**.

That's it — it scans all the cities, then opens `dashboard.html` in your
browser with anything new. Run it with your morning coffee.

Heads-up: it checks many governments at once (12 at a time) while still
pausing politely between requests to any *single* site, so even with
hundreds of sources a full scan is usually just a few minutes. The
console shows a running `[ 37/455]` counter so you can see it working.
Start it, top off your coffee, come back to a full dashboard. (And
remember it only actually scans once every 3 days.)

## Quick start — Mac

```
cd tow-alerts
python3 ToWatch.py scan
```

Then open `dashboard.html`. Other commands: `doctor` (pre-flight check that
everything's ready before a scan), `probe` (test which city feeds respond),
`demo` (fill the dashboard with sample alerts to see the look), `scan --days
30` (look further back on a first run).

## How the rating system works (free, built in)

Every agenda item that mentions tow language gets a **relevance score**.
Keywords are weighted by business value, repeat mentions count extra
(up to 5× per keyword, total score capped at 100), and contract/fee/portal
language adds boosts:

| Signal | Weight |
|---|---|
| tow/impound dispatch or management software, vehicle release system | 7 |
| predatory towing / predator towing / predatory booting | 7 |
| vendor watch (Autura, AutoReturn — add competitors in ToWatch.py) | 6 |
| rotation list, non-consent tow | 5 each |
| private property impound / PPI, police-initiated tow | 4 each |
| wrecker, impound, vehicle auction, vehicle storage | 3 each |
| computer-aided dispatch / CAD system, replacement, integration | 3 |
| scene/quick clearance, secondary crashes, traffic incident mgmt | 3 each |
| towing, tow truck, abandoned vehicle, immobilization/booting | 2 each |
| **Boosts:** RFP/solicitation +6, contract/award +4, PSAP/911/CAD/sheriff +3, software/platform/automation +3, portal/permit +3, fees +2 | |

**Score 10+ = HIGH (red), 5–9 = MEDIUM (amber), under 5 = LOW (gray).**
The boost words also pick the category badge (contract/RFP, fees, PPI/portal,
enforcement, ordinance). HIGH items sort to the top of the feed.

So "Non-Consent Tow Rotation Services Agreement" rates HIGH, while a parks
report that mentions towing one vehicle rates LOW. A passing mention of
"town" scores zero — word boundaries prevent false matches.

Tuning is easy: the weights live at the top of `ToWatch.py` in plain lists
(`KEYWORDS`, `CONTEXT`, and the `HIGH_AT` / `MEDIUM_AT` thresholds).

## Optional AI upgrade (off by default, seamless to enable)

If you ever want plain-English "why this matters" summaries and smarter
grading, set an Anthropic API key and scan — nothing else changes. AI-graded
cards get a summary box and an "AI graded" tag; the keyword score is kept
alongside. Costs roughly a tenth of a cent per alert.

- **Windows:** run `setx ANTHROPIC_API_KEY sk-ant-your-key` once in Command
  Prompt, then close and reopen it (or just double-click the .bat again).
- **Mac:** `export ANTHROPIC_API_KEY=sk-ant-your-key` before scanning.

Remove the key and it silently returns to keyword scoring. No key = no cost,
ever.

## What it covers today

**455 sources, all 11 territories, six platform connectors.** The
authoritative list lives in `sources.json` — every entry is one line
naming the government, its state, and which connector reads it. Every
major metro, every mid-size city, county seats, consolidated dispatch
centers, and Puerto Rico's municipal legislatures (Spanish keyword
support is built in — grúa, remolque, depósito de vehículos, licitación).

| State | Sources | Reach |
|---|---|---|
| TX | 89 | Houston/Harris → DFW suburbs → border cities; Dallas + El Paso Counties |
| OH | 46 | The three C's, every metro county, Summit + Butler consolidated dispatch |
| GA | 42 | Atlanta metro, all four consolidated govts, tier-2 cities statewide |
| AL | 42 | Birmingham metro suburbs, every metro county commission, Gulf Coast |
| TN | 41 | Memphis + Nashville metros, Knoxville, Chattanooga, tier-2 statewide |
| AR | 40 | Little Rock, all of NW Arkansas, Fort Smith, Jonesboro, county seats |
| MS | 39 | Jackson metro, full Gulf Coast, Memphis-metro suburbs, county boards |
| OK | 39 | OKC + Tulsa metros, Norman, Lawton, tier-2 cities and counties |
| LA | 37 | New Orleans, Baton Rouge, Shreveport, Lafayette, parishes incl. Calcasieu |
| KY | 30 | Louisville, Lexington, northern KY, Owensboro, Bowling Green, fiscal courts |
| PR | 10 | San Juan, Bayamón, Ponce, Carolina, Caguas, Guaynabo, Arecibo + more |

By connector: pagewatch 229 · agendacenter 95 · civicclerk 66 ·
legistar 48 · primegov 11 · iqm2 6. Legistar sources alert per piece of
legislation; the rest alert per meeting whose agenda contains tow language
(agenda PDFs are read with a built-in extractor — no installs).

## Known coverage gaps (honest list)

These bodies simply don't publish agendas anywhere a scraper can watch:

- **Laurel County KY** — posts meeting info only on Facebook
- **El Dorado AR** — Facebook is the de facto agenda channel
- **Greenville, Corinth, Grenada, Warren County MS** — no online agendas found
- **Mayagüez PR** — ordinances only appear on the third-party LexJuris
  archive, no official online source
- **Carolina + Caguas PR** — legislature info pages are watched, but their
  document archives aren't online (flagged in their source names)

Watch-list note: a few Texas bodies are mid-migration between platforms
(Odessa, San Angelo, McLennan County, Midland) — both ends are noted in
their source names.

Also on the roadmap: meeting *video* transcripts (catches discussion that
never becomes a written agenda item), email digests, Salesforce push and
ZoomInfo contact lookup, and coworker territories once these 11 are proven.

## Files

- `ToWatch.py` — the whole program (no installs needed, plain Python 3)
- `ToWatch.bat` — Windows double-click launcher (scan + open dashboard)
- `sources.json` — which cities to watch; edit this to add/remove
- `ToWatch.db` — memory of everything already seen (auto-created)
- `dashboard.html` — the output; open in a browser (auto-generated)
- `tickets.md` — auto-filed bug reports; paste to Claude for fixes (auto-created)
