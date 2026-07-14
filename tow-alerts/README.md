# TowWatch

Your own government-meeting alert system for the towing industry. It watches
city and county legislative records for anything mentioning **towing, impound,
wrecker rotation, private property impound (PPI), vehicle storage, abandoned
vehicle auctions, booting** — scores every hit, and turns them into a clean
color-coded dashboard.

This is the do-it-yourself version of the alert services vendors keep
pitching. It runs on your own computer and costs nothing to operate.

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
(up to 3×), and contract/fee/portal language adds boosts:

| Signal | Weight |
|---|---|
| predatory towing / predator towing / predatory booting | 7 |
| rotation list, non-consent tow | 5 each |
| private property impound / PPI | 4 |
| wrecker, impound, vehicle auction, vehicle storage | 3 each |
| towing, tow truck, abandoned vehicle, immobilization/booting | 2 each |
| **Boosts:** RFP/solicitation +6, contract/award +4, portal/permit +3, fees +2 | |

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

16 confirmed feeds via the Legistar legislative platform (the system most big
cities use to publish agendas and legislation):

- **TX**: Fort Worth, Dallas, San Antonio, Austin, El Paso, Corpus Christi,
  Harris County (Houston area), Boerne
- **OH**: Columbus, Cleveland, Cincinnati, Toledo
- **AR**: Fayetteville
- **GA**: Fulton County (Atlanta area)
- **AL**: Huntsville
- **TN**: Metro Nashville / Davidson County

Adding a city that uses Legistar = adding one line to `sources.json`. If a
city's agenda site looks like `something.legistar.com`, the `something` part
is the "client" value.

## Known coverage gaps (the phase-2 list)

These places don't use Legistar, so they need their own connectors later:

- **Oklahoma**: OKC uses PrimeGov (okc.primegov.com); Tulsa runs its own site
- **Mississippi**: Jackson, Gulfport, Biloxi publish PDF agendas on city sites
- **Puerto Rico**: San Juan's municipal legislature has its own site
  (Spanish-language — a good fit for the AI pass later)
- **Atlanta proper** uses Granicus iQM2 (Fulton County covers the metro for now);
  Memphis, Chattanooga, Knoxville, Birmingham, Montgomery, Mobile, Little Rock
  publish on their own sites

Also on the roadmap: meeting *video* transcripts (catches discussion that
never becomes a written agenda item), email digests, Salesforce push and
ZoomInfo contact lookup, and more cities per state.

## Files

- `towwatch.py` — the whole program (no installs needed, plain Python 3)
- `TowWatch.bat` — Windows double-click launcher (scan + open dashboard)
- `sources.json` — which cities to watch; edit this to add/remove
- `towwatch.db` — memory of everything already seen (auto-created)
- `dashboard.html` — the output; open in a browser (auto-generated)
