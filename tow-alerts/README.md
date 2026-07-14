# toWatch (by Autura)

Your own government-meeting alert system for the towing industry. It watches
city and county legislative records for anything mentioning **towing, impound,
wrecker rotation, private property impound (PPI), vehicle storage, tow
dispatch software, consolidated dispatch, predatory towing** — scores every
hit, and turns them into a clean color-coded dashboard in Autura's style.

This is the do-it-yourself version of the alert services vendors keep
pitching. It runs on your own computer and costs nothing to operate.

## Polite-guest rule (built in)

toWatch contacts the government sites **at most once every 3 days** — the
industry moves slowly and there's no reason to knock more often. Double-click
the launcher as often as you like: if a scan isn't due yet it just says so,
tells you when the next one is, and opens the dashboard with what it already
has. The lookback window automatically covers the gap since the last scan
(plus a 2-day overlap), so nothing slips through between scans.
`python3 towwatch.py scan --force` overrides the rule when truly needed.

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

## Quick start — Windows (work computer)

1. **One-time:** install Python from the Microsoft Store (open the Store,
   search "Python", install the newest version — no admin rights needed on
   most work machines).
2. **Every time:** double-click **`TowWatch.bat`**.

That's it — it scans all the cities, then opens `dashboard.html` in your
browser with anything new. Run it with your morning coffee.

## Quick start — Mac

```
cd tow-alerts
python3 towwatch.py scan
```

Then open `dashboard.html`. Other commands: `probe` (test which city feeds
respond), `demo` (fill the dashboard with sample alerts to see the look),
`scan --days 30` (look further back on a first run).

## How the rating system works (free, built in)

Every agenda item that mentions tow language gets a **relevance score**.
Keywords are weighted by business value, repeat mentions count extra
(up to 5× per keyword, total score capped at 100), and contract/fee/portal
language adds boosts:

| Signal | Weight |
|---|---|
| tow/impound dispatch or management software, vehicle release system | 7 |
| predatory towing / predator towing / predatory booting | 7 |
| vendor watch (Autura, AutoReturn — add competitors in towwatch.py) | 6 |
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

Tuning is easy: the weights live at the top of `towwatch.py` in plain lists
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

89 sources across **six platform connectors** — cities AND county
commissions (counties matter: sheriffs, commissioners courts, and consolidated
dispatch centers often control tow dispatch, not the city):

**Legistar** (legislation-level detail):
- **TX**: Fort Worth, Dallas, San Antonio, Austin, El Paso, Corpus Christi,
  Boerne + Harris, Galveston, and Brazoria Counties
- **OK**: Oklahoma County (OKC area)
- **OH**: Columbus, Cleveland, Cincinnati, Toledo + Knox County
- **AR**: Fayetteville, Jonesboro
- **GA**: Fulton and DeKalb Counties (Atlanta metro)
- **AL**: Huntsville + Baldwin County
- **TN**: Metro Nashville / Davidson County + Blount County
- **MS**: Harrison County (Gulfport/Biloxi), Vicksburg
- **LA**: New Orleans + St. Charles Parish
- **KY**: Louisville Metro (legislation archive) + Lexington-Fayette Urban
  County — both consolidated city-county governments

**CivicClerk** (meeting agendas): Travis County TX (Austin), Cobb County GA,
Tulsa County OK, Lake Charles LA, Ascension / West Baton Rouge / Washington
Parishes LA, Bentonville + Rogers AR, Jackson + Gulfport + Hattiesburg +
Rankin County MS

**PrimeGov** (meeting agendas): Oklahoma City, Tarrant County TX (Fort Worth),
Shreveport LA, Louisville Metro Council KY

**iQM2** (meeting agendas): Butler County OH, Atlanta, Jefferson County AL
(Birmingham)

**CivicPlus Agenda Center** (agenda/minutes PDFs): Bexar County TX (San
Antonio), Hidalgo County TX, Montgomery County OH (Dayton), Baton Rouge /
East Baton Rouge, Jefferson Parish, Kenner, Bossier City, Livingston Parish
LA, Kenton County, Hardin County, Frankfort KY, Hot Springs AR, Southaven +
Olive Branch + Pascagoula + DeSoto County + Jackson County MS

**Page watcher** (generic — any body that posts agendas/PDFs on its own
website): Summit County Council OH (Akron), Lafayette Consolidated Govt,
Caddo Parish, St. Tammany Parish LA; Bowling Green, Covington KY; Little
Rock, North Little Rock, Fort Smith, Springdale, Conway, Texarkana, Pine
Bluff + Pulaski / Benton / Washington / Sebastian Counties AR; Biloxi,
Meridian, Tupelo + Madison / Hinds Counties MS.
Adding an own-site body = one line with the URL of its agenda page.

Legistar sources alert per piece of legislation; the other three alert per
meeting whose agenda contains tow language (agenda PDFs are read with a
built-in extractor — no extra installs). Each source declares its platform
in `sources.json`; adding a body on any of the four platforms is one line.

Adding a city that uses Legistar = adding one line to `sources.json`. If a
city's agenda site looks like `something.legistar.com`, the `something` part
is the "client" value.

## Known coverage gaps (the phase-2 list)

Remaining bodies not yet watched (the page watcher can take any of them —
each just needs its agenda-page URL added to sources.json):

- **Platform connectors not built yet**: CivicWeb (Dallas County TX),
  NovusAGENDA (El Paso County TX), OnBase (Hamilton County OH, Akron city),
  Municode Meetings (Norman OK)
- **Own-site bodies with known agenda pages, ready for pagewatch**:
  Owensboro, Florence, Elizabethtown, Boone / Campbell / Warren / Daviess
  Counties KY; Calcasieu Parish LA; Cuyahoga (Cleveland) and Franklin
  (Columbus) Counties OH; Memphis, Chattanooga, Knoxville + Shelby / Knox /
  Hamilton Counties TN; Gwinnett, Chatham Counties GA; Birmingham,
  Montgomery, Mobile + Madison / Mobile Counties AL; Houston, Fort Bend
  County TX; Tulsa
- **Puerto Rico**: San Juan's municipal legislature, Spanish-language
  (a good fit for the AI pass later)
- **Puerto Rico**: San Juan's municipal legislature, Spanish-language
  (a good fit for the AI pass later)

Also on the roadmap: meeting *video* transcripts (catches discussion that
never becomes a written agenda item), email digests, Salesforce push and
ZoomInfo contact lookup, and more cities per state.

## Files

- `towwatch.py` — the whole program (no installs needed, plain Python 3)
- `TowWatch.bat` — Windows double-click launcher (scan + open dashboard)
- `sources.json` — which cities to watch; edit this to add/remove
- `towwatch.db` — memory of everything already seen (auto-created)
- `dashboard.html` — the output; open in a browser (auto-generated)
