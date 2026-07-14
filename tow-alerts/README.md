# TowWatch

Your own government-meeting alert system for the towing industry. It watches
city and county legislative records for anything mentioning **towing, impound,
wrecker rotation, private property impound (PPI), vehicle storage, abandoned
vehicle auctions, booting** — and turns the hits into a clean dashboard.

This is the do-it-yourself version of the alert services vendors keep
pitching. It runs on your own computer, costs nothing to operate (a few
dollars a month if you turn on AI summaries), and you own it.

## Quick start (3 commands, Mac Terminal)

```
cd tow-alerts
python3 towwatch.py probe     # checks which city feeds respond (one-time)
python3 towwatch.py scan      # pulls the last 14 days and finds tow/impound hits
```

Then open `dashboard.html` in any browser. That's the product.

Want to see the look before scanning? `python3 towwatch.py demo` fills the
dashboard with realistic sample alerts.

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

## AI summaries (optional, recommended)

Set an Anthropic API key before scanning and every alert gets a relevance
grade (HIGH / MEDIUM / LOW), a category badge (contract/RFP, ordinance, fees,
enforcement, PPI/portal), and a two-sentence "why this matters" summary:

```
export ANTHROPIC_API_KEY=sk-ant-...
python3 towwatch.py scan
```

Without a key everything still works — you get the raw matched text with the
keywords highlighted.

## Routine use

Run `python3 towwatch.py scan` every morning (or a couple times a week).
It remembers what it has already seen, so you only ever get new alerts.
`--days 30` looks further back on a first run.

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
- `sources.json` — which cities to watch; edit this to add/remove
- `towwatch.db` — memory of everything already seen (auto-created)
- `dashboard.html` — the output; open in a browser (auto-generated)
