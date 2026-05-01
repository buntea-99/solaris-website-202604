# IndexNow + Bing Webmaster Tools — Setup and Operation

## Why this exists

The single highest-leverage indirect signal for AI search citations is Bing's index. SearchGPT (ChatGPT's web search) uses Bing as its primary index; 87% of SearchGPT-cited URLs sit in the Bing top-10 for the underlying query. Perplexity, Claude search, and Google AI Overviews all cross-reference Bing as a secondary signal.

IndexNow is a free, open protocol Microsoft (Bing) and Yandex co-published. When you push a URL through IndexNow, Bing crawls it within minutes (vs days for organic discovery), then re-evaluates ranking — which directly feeds into SearchGPT's index in close to real time.

## Files in this repo

- `b3ebb527682d352bfa2973e03befa11e.txt` (root) — the IndexNow key file. Bing/Yandex fetch this to verify ownership of the domain. Do not delete or rename.
- `scripts/indexnow-ping.sh` — submits every URL in `sitemap.xml` to IndexNow in one call.

## How to use

### After every deploy

```bash
./scripts/indexnow-ping.sh
```

Run from the repo root. It posts the full `sitemap.xml` URL list to `api.indexnow.org`. Expected response: `HTTP 200` (success) or `HTTP 202` (accepted, processing). Other codes mean the key file isn't reachable — check that `https://solariswireless.com/b3ebb527682d352bfa2973e03befa11e.txt` returns 200.

### Verify the key file is live

```bash
curl -sI https://solariswireless.com/b3ebb527682d352bfa2973e03befa11e.txt
```

Should return `200 OK` and the body should be exactly `b3ebb527682d352bfa2973e03befa11e`.

## Bing Webmaster Tools — manual setup (one time, ~10 minutes)

1. Go to https://www.bing.com/webmasters
2. Sign in with the Microsoft account you want tied to the property
3. Add `https://solariswireless.com/` as a new site
4. Verification options:
   - **Recommended:** XML file upload — Bing gives you a `BingSiteAuth.xml` file. Drop it at the repo root and deploy. The file format is `<?xml version="1.0"?><users><user>YOUR_VERIFICATION_CODE</user></users>`.
   - Alternative: meta tag in `<head>` of `index.html` — `<meta name="msvalidate.01" content="YOUR_CODE">`
5. Once verified, submit `https://solariswireless.com/sitemap.xml` under "Sitemaps"
6. Enable "IndexNow" under Configure My Site, paste the key `b3ebb527682d352bfa2973e03befa11e`, confirm key file location

After verification, Bing Webmaster Tools shows: indexed pages, search performance for Bing organic + SearchGPT (separate report from late 2025), backlinks, crawl errors, and AI search appearance.

## Yandex Webmaster (optional, ~5 minutes)

If you want Yandex coverage (Russia and CIS markets), the same IndexNow key works — Yandex co-authored the protocol. Add the property at https://webmaster.yandex.com and verify via DNS or HTML meta tag.

## Naver and Seznam

Naver (Korea) and Seznam (Czech) both consume IndexNow signals automatically once the key file is live; no additional account creation required.

## What to watch in Bing Webmaster Tools

Weekly check:
- **AI Search Appearance** report (introduced Q4 2025) — shows how often Solaris is cited in SearchGPT and Bing Copilot answers
- **Indexed pages** — should match sitemap count (~67 URLs after Phase 5)
- **Crawl errors** — fix any 404 / 5xx within a week of detection
- **Search performance** — top queries Bing serves Solaris pages for; cross-reference these against Otterly.AI prompt monitoring

## Submission cadence

- After every deploy: `./scripts/indexnow-ping.sh`
- Manual sitemap re-submission in Bing Webmaster Tools UI: monthly or after major content batches
- IndexNow is rate-limit-tolerant; daily pings of the same URL set are fine
