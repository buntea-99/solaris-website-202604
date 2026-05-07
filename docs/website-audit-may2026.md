# Solaris Wireless Website Audit — May 2026

Five parallel audits run across: Technical SEO, AI SEO, Content Quality, UI/UX, Performance + Security.

---

## TIER 1 — CRITICAL (Fix First)

### 1. All 5 case study pages are broken for search engines
**Files:** `case-studies/google-fortune-500-procurement.html`, `case-studies/government-military-deployment.html`, `case-studies/mvno-network-operator-sourcing.html`, `case-studies/ritual-kiosk-deployment.html`, `case-studies/specialist-hardware-sourcing.html`

Every case study page has the same 4 problems:
- Missing `<meta name="robots" content="index, follow">` — search engines may skip indexing
- Missing `og:title`, `og:description` — broken social sharing and AI citations
- `og:url` is blank: `content=""` — should be the actual page URL
- JSON-LD syntax error: double comma after "description" field + missing comma before "publisher" — schema parser fails silently

**Fix:** Add robots meta, fill OG tags, and fix the double-comma JSON-LD bug on all 5 pages.

---

### 2. Contact form API has no spam protection
**File:** `api/contact.js`

Three separate issues, all exploitable:
- `Access-Control-Allow-Origin: *` on a POST endpoint (line 219) — any site can submit your form programmatically
- No honeypot field, no CAPTCHA — bots can flood the form
- No rate limiting — single attacker can exhaust Gmail API quota and Google Sheets write limits in seconds

**Fix (in order of effort):**
1. Change line 219 to `res.setHeader('Access-Control-Allow-Origin', 'https://www.solariswireless.com');`
2. Add a hidden honeypot input to the form and reject server-side if it has a value
3. Add basic rate limiting (5 requests per IP per hour) — can use Vercel Edge middleware

---

### 3. No Amazon Business comparison page
**Missing file:** `/comparisons/amazon-business-vs-solaris-wholesale.html` or `/alternatives/amazon-business-bulk-electronics.html`

"Why not just use Amazon Business for bulk phones?" is the single most common question a Fortune 500 procurement manager would ask ChatGPT. Every alternative/competitor page exists (CDW, Insight, PC Connection) but Amazon Business — the actual default vendor for most targets — has no page. This is the highest-leverage AI SEO gap on the entire site.

**Fix:** Create a comparison page with a table: Amazon Business vs Solaris on price, MOQ, MDM, TAA compliance, direct-to-employee delivery, speed, provisioning.

---

## TIER 2 — HIGH IMPACT

### 4. Title tags too long on 20+ pages
The homepage title is 116 characters. Google truncates at ~55-60. Most blog and product pages are 80-116 chars.

**Worst offenders:** `index.html` (116), `blog/starlink-terminal-wholesale-guide.html` (115), `blog/mdm-providers-comparison.html` (114), `solutions/silicon-valley-tech.html` (103+)

**Fix:** Trim all titles to under 60 chars. Homepage example: `Solaris Wireless | Bulk Electronics Distributor USA` (51 chars).

### 5. Meta descriptions too long on 15+ pages
Multiple solution and manufacturer pages have 270-291 character descriptions. Google truncates at 155-160. The extra text is invisible in search results.

**Fix:** Trim to under 160 chars. Keep the first 155 chars as the actual value proposition, cut the rest.

### 6. Pricing signals missing across all product pages and homepage
Procurement managers screen suppliers on price before requesting quotes. The site never mentions "15-20% below retail" or "institutional pricing" above the fold anywhere. The laptops page has "15-25% TCO reduction" buried in FAQ — it should be in the hero.

**Fix:** Add one sentence to each product page hero and the homepage capabilities section: "Institutional pricing typically 15-20% below consumer channels for 50+ unit orders."

### 7. Case studies don't link to product pages
The Ritual case study never links to `/products/mobile-devices`. The government case study never links to the government solutions page. All 5 case studies are dead ends — no path for a procurement manager to go from "I see you did this" to "can you do this for me."

**Fix:** Add 1-2 product/solution page links at the bottom of each case study.

### 8. "Google-approved vendor" never explained
This phrase appears 6+ times across the site but is never defined. A procurement manager unfamiliar with the designation doesn't know if it's a quality cert, a security badge, or just a Google Workspace account.

**Fix:** Add one sentence on the homepage About section: "Google-approved vendor status certifies that Solaris meets Google's standards for vendor reliability, security, and fulfilment compliance."

---

## TIER 3 — MEDIUM IMPACT

### 9. FAQ questions written in supplier language, not buyer-intent language
The homepage FAQ schema has questions like "Does Solaris offer custom OS flashing?" — that's supplier framing. An AI engine searching on behalf of a buyer would phrase it: "Can I buy phones with my company branding pre-loaded?" Different phrasing, different match.

**Fix:** Rewrite 3-5 FAQ questions to match how a procurement manager would type them into ChatGPT:
- Add: "How much does staging 1,000 iPhones in-house cost vs using a supplier with MDM pre-enrollment?"
- Add: "Why should I use a wholesale electronics distributor instead of Amazon Business?"
- Add: "Can you handle bulk phone orders under 100 units for a startup?"

### 10. Conflicting ZIP codes in schema
`faq.html` schema: ZIP `33101`. `index.html` schema: ZIP `33122`. These are different Miami ZIP codes. AI engines extracting company location see conflicting data.

**Fix:** Confirm correct ZIP and update the wrong one. Check both `faq.html` and `index.html` LocalBusiness schema blocks.

### 11. Blog H1s don't match target keywords
`bulk-phone-supplier-vs-consumer-store.html` H1 is "What Solaris Does That a Consumer Phone Retailer Cannot" — the URL keyword `bulk-phone-supplier-vs-consumer-store` doesn't appear anywhere in the H1.

**Fix:** Rewrite H1 to include the primary keyword: "Why Bulk Phone Suppliers Beat Consumer Stores: Seven Capabilities Retailers Cannot Match"

### 12. Nav logo missing width/height HTML attributes
The `<img>` for `logo-transparent.png` and `logo-footer.png` use inline CSS for sizing but no HTML `width`/`height` attributes. Browser can't pre-calculate layout, causing Cumulative Layout Shift (CLS) — a Core Web Vitals metric Google measures.

**Fix:** Add `width="160" height="40"` (or actual dimensions) to both logo `<img>` tags.

### 13. Organisation field missing `required` attribute on contact form
`index.html` line 1006: The `organisation` input has no `required` attribute. For a B2B site, knowing which company submitted the form is essential for sales followup. If it's blank, Bivek gets an inquiry with no company context.

**Fix:** Add `required` to the organisation field.

### 14. Form errors not scrolled into view on mobile
`js/main.js` lines 356-360: When form validation fails, the error message appears but the page doesn't scroll to it. On mobile a user can submit, get an error, and not see it because it's above the fold.

**Fix:** After setting the error message, add `msgEl.scrollIntoView({ behavior: 'smooth' });`

### 15. No warehouse capacity details anywhere on the site
The 40,000 sq ft Miami warehouse is mentioned in context notes but appears nowhere on the website. Fortune 500 procurement managers need to validate a supplier has the infrastructure to handle their volume before making contact.

**Fix:** Add to the About section and llms.txt: "40,000+ sq ft Miami warehouse with 100,000+ units in annual throughput capacity."

---

## TIER 4 — LOW IMPACT (Quick Wins)

| Issue | File | Fix |
|-------|------|-----|
| Blog post "Best Wholesale Smartphones" has duplicate FAQ content (verbatim in schema AND visible HTML) | `blog/best-wholesale-smartphone-suppliers-usa-2026.html` | Remove visible duplicate, keep schema version |
| Missing `required` visual indicator (* asterisk) on form fields | `index.html` form labels | Add `*` after required field labels |
| "2 minutes" confirmation email promise may be broken | `js/main.js:304` | Change to "within 1 business day" |
| Favicon paths use relative `../` on inner pages; homepage uses absolute `/` | All product/case-study/blog pages | Standardise to `/favicon.ico` across all pages |
| Flip cards don't auto-close siblings on mobile tap | `js/main.js:525-545` | Close sibling cards when opening a new one |
| No mobile "Call Now" button in hero | `index.html` hero | Add `<a href="tel:+1-305-222-7353">` button visible on mobile only |
| Government Military case study not shown in 9-card homepage grid | `index.html` flip grid | Add to grid (currently shows 4 case studies, 5th missing) |
| "Solaris Wireless, founded 2013" boilerplate on every product page intro | All `products/*.html` | Vary wording or remove from pages 2-6 |
| Images not in WebP format (logo 398K, footer logo 201K, favicon 232K) | `images/` folder | Create WebP variants, use `<picture>` element |
| Legal pages missing from llms.txt URL map | `llms.txt` | Add `/legal/privacy-policy` and `/legal/terms` |
| input sanitization in `clean()` only strips `< >` | `api/contact.js:59` | Use a proper sanitization library or expand strip list |

---

## Missing Content — Build These

These pages don't exist but would have high AI SEO value. Each targets a query a Fortune 500 procurement manager would ask ChatGPT.

| Page to Create | Target Query | Priority |
|----------------|-------------|----------|
| `/comparisons/amazon-business-vs-solaris-wholesale.html` | "Why not just use Amazon Business for bulk devices?" | CRITICAL |
| `/alternatives/staples-costco-business.html` | "Staples vs wholesale distributor for bulk laptops" | High |
| `/alternatives/ingram-micro.html` | "Ingram Micro vs Solaris for device procurement" | Medium |
| `/comparisons/starlink-reseller-vs-direct.html` | "Should I buy Starlink from reseller or SpaceX direct?" | Medium |
| `/blog/mdm-enrollment-labor-cost-savings.html` | "How much does in-house iPhone MDM staging cost?" | Medium |
| `/blog/eol-component-sourcing-defense.html` | "Authenticated EOL component sourcing for defense contractors" | Medium |
| About page warehouse section | "Can Solaris handle 10,000-unit emergency orders?" | High |

---

## What's Already Good — Don't Break

- `robots.txt` — 26 AI crawlers explicitly allowed. Comprehensive.
- `llms.txt` — 213 lines, covers company facts, products, FAQ, full URL map. Strong.
- Schema.org JSON-LD — 7 blocks on homepage, FAQPage on blog posts. Excellent.
- `sitemap.xml` — 321 URLs, all with lastmod. Well-maintained.
- OG + Twitter Card + RSS feed — all correct on 77/82 pages.
- `api/contact.js` uses `Promise.allSettled()` — resilient to partial API failures.
- Custom OS Flashing blog post — best piece of content on the site (2,400 words, specific metrics).
- Enterprise Laptop blog post — "23% TCO reduction" is a strong conversion line.
- Ritual case study — best case study format (problem → solution → result, specific numbers).
- No duplicate IDs, no console.log in production JS. Clean code.
- Canonical tags: all 82 pages correct.
- H1 tags: all 82 pages have exactly one.
- Image alt text: all images have meaningful alt text.

---

## Recommended Order of Work

**This week:**
1. Fix all 5 case study pages (robots meta, OG tags, JSON-LD syntax) — 30 min
2. Fix CORS on `api/contact.js` + add honeypot field — 1 hour
3. Create Amazon Business comparison page — 2-3 hours
4. Fix ZIP code inconsistency (33101 vs 33122) — 5 min
5. Add pricing signal to homepage + product page heroes — 1 hour

**Next week:**
6. Trim 20+ title tags to under 60 chars
7. Trim 15+ meta descriptions to under 160 chars
8. Add product page links to bottom of all 5 case studies
9. Define "Google-approved vendor" on about/homepage
10. Fix nav logo width/height attributes + form organisation required

**Following weeks:**
11. Create 2-3 missing comparison/alternative pages
12. Rewrite FAQ questions in buyer-intent language
13. Add warehouse capacity section to about page + llms.txt
14. Create WebP image variants
15. Add rate limiting to `/api/contact`
