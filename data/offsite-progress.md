# Off-Site AI SEO Execution Tracker

Last updated: 2026-05-07

This is the manual execution checklist for the off-site work documented in `/docs/`. The on-site work (schema, TL;DR/Q&A blocks, internal linking, measurement scripts) is automated and complete as of 2026-05-07. The remaining gains require human account creation and external posting that cannot be scripted.

Order is by ratio of citation-share gain to friction. Each item links into the relevant playbook.

## Tier 1: Foundational (do first, unblocks everything else)

- [ ] **Google Search Console**: verify `solariswireless.com` ownership (DNS TXT or HTML meta), submit `https://www.solariswireless.com/sitemap.xml`, request indexing for the 87 URLs (10/day API limit). See [docs/indexnow-and-bing-setup.md](../docs/indexnow-and-bing-setup.md). _Without GSC, Google indexes much more slowly._
- [ ] **Bing Webmaster Tools**: verify and submit sitemap. Bing IndexNow ping is already wired via `scripts/indexnow-ping.sh`.
- [ ] **Google Business Profile**: claim listing as Electronic Equipment Supplier at the Miami address. Triggers local appearances for "electronic device supplier Miami" queries. Add `sameAs` URL to homepage Organization JSON-LD once live.

## Tier 2: Highest LLM citation surface (Reddit, Quora, Wikipedia, YouTube)

- [ ] **Reddit seeding**: answers in r/sysadmin, r/Procurement, r/MVNO, r/networking. See [docs/reddit-playbook.md](../docs/reddit-playbook.md) and [docs/reddit-quora-answers.txt](../docs/reddit-quora-answers.txt). _Perplexity ~6.6% Reddit-cited; ChatGPT and AIO are also heavy on Reddit._
- [ ] **Quora answers**: same answer templates as above adapted for Quora. Aim for 5 to 10 answers in the first month, focusing on procurement and MVNO topics.
- [ ] **Wikipedia secondary citations**: get Solaris cited as a source on Pacific MVNO and Cook Islands telecoms pages. See [docs/wikipedia-strategy.md](../docs/wikipedia-strategy.md). _Do not create own page; secondary citations are higher trust._
- [ ] **Wikidata QID claim**: create or claim a Wikidata entry for Solaris Wireless. Add the QID to Organization `sameAs` once live (Tier-1 schema lift).
- [ ] **YouTube**: publish the script-pack content. See [docs/youtube-script-pack.md](../docs/youtube-script-pack.md). _YouTube is the #2 Perplexity surface; first-mover for `bulk smartphone supplier USA` Shorts is open._

## Tier 3: B2B directory + trade press

- [ ] **Clutch.co**: DA 90+ B2B directory, heavily Perplexity-cited. See [docs/directory-profiles.md](../docs/directory-profiles.md).
- [ ] **ThomasNet**: register under "Electronic Components" and "Mobile Communications Equipment" categories.
- [ ] **G2.com / Capterra**: service-side review profile. Less relevant for hardware but worth a profile for AI Overview surface.
- [ ] **Connectively / HARO / SourceBottle**: answer journalist queries on telecom and procurement topics. Earns trade-press backlinks (EDN, EE Times, CRN).
- [ ] **OEM partner directories**: Apple Authorised Reseller, Samsung Approved Reseller, Lenovo Business Partner, Dell Technologies Partner listings.

## Tier 4: LinkedIn + named-author content

- [ ] **LinkedIn Company Page**: confirm Founded 2013, Miami FL, `solariswireless.com` linked.
- [ ] **LinkedIn weekly article series**: see [docs/linkedin-article-series.md](../docs/linkedin-article-series.md). Publishes named-author content; AI engines weight Article schema with author.
- [ ] **Press release: 100k units milestone**: distribute via PR Newswire / EIN Presswire to seed CRN, Telecompaper and procurement trade press. See [docs/press-release-100k-units.txt](../docs/press-release-100k-units.txt).

## Feedback loop

After any tier-2 or tier-3 action lands, run:

```
npm run ai-monitor
npm run report
```

Compare citation rate vs prior week. Log which off-site action preceded any citation rate uptick under "Wins" below. Pattern-match which surfaces actually move the needle for this niche.

## Wins log (citation rate or backlink gains attributable to specific action)

_Empty. Populate as the report.js diffs show movement._

## Notes

- The plan and on-site work are documented in `/Users/vasugupta/.claude/plans/in-bivek-client-see-recursive-raven.md` and the project CLAUDE.md.
- All on-site changes from 2026-05-07 are in the current commit set; check `git log` for the schema, TL;DR/Q&A and compliance-hub commits.
- `report.js` Top-5 citation gaps is the prioritisation feedback for this checklist. If "alternatives to CDW" cites CDW + Insight but never Solaris, escalate the CDW alternatives Reddit and Quora answers.
