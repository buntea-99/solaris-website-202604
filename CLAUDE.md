# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Repo Is

A static-HTML marketing site for **Solaris Wireless** — a Miami-based electronic device supplier and distributor (mobile phones, laptops, IoT, Starlink, components) for institutional buyers. The site is hand-written HTML/CSS/vanilla-JS, deployed on Vercel, with one serverless function (`api/contact.js`) handling lead form submissions via Gmail API + Google Sheets.

There is **no build step**. Files in the repo are exactly what ships. Static-site-generation is a deliberate constraint (see `youtubeseovideo1.txt` — Google must crawl pre-rendered HTML).

## Repository Layout

| Path | Purpose |
|------|---------|
| `index.html` | Homepage. Single source of truth for the hero, about, capabilities, 9-card flip-card grid, presence/map, contact form, footer. |
| `products/*.html` | 6 product category pages (mobile-devices, laptops, iot-smart-cameras, starlink-connectivity, consumer-electronics, specialist-hardware). |
| `case-studies/*.html` | 5 case studies (google-fortune-500, ritual-kiosk, mvno-network-operator, government-military, specialist-hardware). |
| `blog/*.html` | 5 long-form posts + `blog/index.html`. |
| `legal/*.html` | privacy-policy, terms. |
| `css/styles.css` | Global styles (~2700 lines) — used by every page. Includes responsive breakpoints, flip-card animation, navigation, footer. |
| `css/blog.css`, `css/case-study.css` | Per-template overlays loaded *in addition to* `styles.css` on those page types. |
| `js/main.js` | Single shared vanilla-JS bundle. Self-guards each feature (e.g. `if (!document.getElementById('ctrack')) return;`) so it's safe to load on any page. Handles the client ticker, mobile nav, reveal-on-scroll, flip-card tap (mobile), and contact form POST to `/api/contact`. |
| `api/contact.js` | Vercel serverless function. POST handler that runs three Gmail-API + Sheets-API operations in parallel: (1) append lead row to Google Sheet, (2) email notification to `NOTIFY_EMAIL`, (3) confirmation email to lead. |
| `backend/server.js` | Local-dev Express equivalent of `api/contact.js`. Same logic, also serves the static site at `http://localhost:3001`. Used for local testing only — production runs on Vercel. |
| `llms.txt` | AI-crawler manifest at the root. Hand-written summary of company facts, products, services, FAQ, and full URL map. Update when facts change. |
| `robots.txt` | Explicitly allow-lists 21 named AI crawlers (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, Applebot-Extended, etc.) and disallows `/api`, `/backend`, `/node_modules`. |
| `sitemap.xml` | Manually maintained. Update `<lastmod>` on touched pages. |
| `vercel.json` | Old `/pages/*.html` URLs → hash-anchor redirects on the homepage. |
| `pages/` | Empty placeholder folder (paths redirected by `vercel.json`). |
| `design-aesthetic-test-4/`, `design-aesthetic-solaris-wireless-test-5/` | Old design experiments. Ignore — not deployed. |

## Common Commands

```bash
# Local preview of static site only (no contact form)
open index.html

# Local dev with working contact form (requires backend/.env)
cd backend && npm install && npm start
# → serves site at http://localhost:3001 and handles /api/contact

# One-time Gmail OAuth setup for the contact form (see backend/GMAIL_SETUP.md)
cd backend && node get-token.js

# Deploy to your Vercel (linked to origin remote, Vdebug/solaris-wireless-website)
vercel --prod
# → aliased https://solaris-wireless.vercel.app

# Deploy to client's Vercel (linked to client remote, buntea-99/solaris-website-202604)
# Requires VERCEL_TOKEN; .vercel/project.json must point at client's project ID before deploy
cat > .vercel/project.json <<EOF
{"projectId":"prj_LaSpx4qm8mcpzEZQTUOxaUDo30Ak","orgId":"team_hbUHsfafdI1514PgLuQfXpMq"}
EOF
vercel --token $VERCEL_TOKEN --prod
# → aliased https://solaris-wireless-six.vercel.app (which is mapped to the live solariswireless.com)
# After deploying, restore your own project link:
cat > .vercel/project.json <<EOF
{"projectId":"prj_4NdOrHstG6ORqFvx6HUMjxHnNFWT","orgId":"team_p6wEdA4fOFJsjgZx3MiUNsue"}
EOF
```

There is no test suite, no linter, and no build step.

## Two-Remote Deploy Workflow

The repo has **two GitHub remotes** and **two Vercel projects** that must stay in sync:

- `origin` → `Vdebug/solaris-wireless-website` (your account) → `solaris-wireless.vercel.app`
- `client` → `buntea-99/solaris-website-202604` (client's account) → `solaris-wireless-six.vercel.app` → `solariswireless.com` (production domain)

**Always push to both** after a commit:
```bash
git push origin main && git push client main
```

The client's Vercel is the one that serves `solariswireless.com`. Your own deployment is for staging/preview only.

## Architectural Conventions

**One stylesheet, one script.** Every page links `css/styles.css` and `js/main.js`. Don't fragment styles into per-page files unless adding a per-template overlay (`css/blog.css`, `css/case-study.css`) which loads *in addition to* `styles.css`. `js/main.js` self-guards every feature — keep it that way so the file remains safe to load on any page.

**Nav and footer are duplicated, not templated.** Editing the navigation, phone number, footer copy, or logo means touching every HTML file (~17 pages). Use a single `perl -i -pe 's|...|...|g'` sweep across `index.html`, `products/*.html`, `case-studies/*.html`, `blog/*.html`, `legal/*.html`. Verify with `grep -rn` afterwards.

**Logo asset rules.**
- Top nav: `images/logo-transparent.png` (dark text, transparent background — works on light header).
- Footer: `images/logo-footer.png` (white-on-dark variant — needed because footers have a dark background).
- Avoid `images/logo-main.jpg`; it has a white rectangle background and renders poorly on dark backgrounds.

**SEO files are first-class.** `llms.txt`, `robots.txt`, `sitemap.xml` are not "extras". Update `llms.txt` whenever company facts change (founding year is **2013**, Google-vendor-since is **2016** — these are separate facts; do not conflate). Refresh `<lastmod>` in `sitemap.xml` when touching a listed page.

**Schema.org JSON-LD lives inside `<head>`.** Homepage has 4 blocks: Organization, WebSite, FAQPage, BreadcrumbList. Product pages have a WebPage block with publisher Organization sub-block. When adding new content, mirror this pattern — don't strip schema.

**Punctuation.** No em-dashes (`—`) anywhere in the visible copy. Replace with commas or colons. There is enforcement history for this — a sweeping `perl -i -pe` was run across all HTML.

**Contact form contract.** The form on the homepage POSTs to `/api/contact` (production) or `http://localhost:3001/api/contact` (local). Field names: `firstName`, `lastName`, `organisation`, `email`, `interest`, `message`. The serverless function (`api/contact.js`) and the local Express server (`backend/server.js`) implement the same handler — keep them in sync if you change the schema.

**Environment variables (Vercel + `backend/.env`).** Both deployments share the same six vars: `GMAIL_CLIENT_ID`, `GMAIL_CLIENT_SECRET`, `GMAIL_REFRESH_TOKEN`, `GMAIL_USER`, `NOTIFY_EMAIL`, `SHEET_ID`. They are configured per-Vercel-project; pushing code does not propagate them.

## Memory About Past Decisions

- **Founding year is 2013** (not 2016). The Google-approved-vendor relationship started 2016 — that's a separate stat.
- The company is positioned as an **"electronic device supplier and distributor"**, not "hardware/technology supplier". Titles, meta tags, hero, about, capabilities, footer all use this framing.
- Phone number is `+1 (305) 222-7353`. Both `tel:+1-305-222-7353` href and `+1 (305) 222-7353` display string must match across all pages.
- Em-dashes were scrubbed site-wide. Don't reintroduce them.
- The 9-card flip grid on `index.html` uses a mix of inline brand SVGs (Republic Wireless wordmark, Ritual sky-blue square, Google G in colour) and PNG icons in `images/icon-*.png` (body cam, capitol, laptop). Card icons were upscaled 4× via `ffmpeg ... -vf scale=iw*4:ih*4:flags=lanczos` to fix pixelation.
- The `youtubeseovideo1.txt` file is a transcript of an SEO masterclass — kept in the repo as reference for the AI-SEO strategy used here.
