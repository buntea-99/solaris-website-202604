# Wikipedia Strategy for Solaris Wireless

Status: Internal strategy memo. Not for external distribution.
Owner: Solaris Wireless marketing / SEO.
Last updated: 2026-04-30.

## 0. Executive summary

Solaris Wireless does not qualify for its own Wikipedia article under the WP:NCORP notability standard, and an attempt to create one would be both deleted and counter-productive (it would log a permanent conflict-of-interest flag against the brand). The high-leverage alternative is to become a cited source on existing Wikipedia articles where the company has direct, verifiable subject-matter relevance. Wikipedia is reportedly the single largest source of citations in ChatGPT answers (around 47.9% of all cited sources in published audits), so a single durable footnote on a well-trafficked article is worth more than a dozen press placements for downstream AI visibility.

This memo defines who we are not (a Wikipedia subject), what we can be (a cited primary source), which articles we plausibly fit, the precise outreach workflow, and the anti-patterns that get brands blacklisted.

---

## 1. Why Solaris cannot have its own Wikipedia page

The relevant policy is WP:NCORP (Wikipedia notability for organisations and companies). It requires:

1. **Multiple independent reliable sources** with significant coverage of the company itself (not press releases, not interviews, not "founder profiles", not company blog posts, not vendor directory entries, not local-business mentions).
2. **Sustained coverage over time**, not a single news cycle.
3. **Coverage that is intellectually independent** of the company's own communications.

Solaris Wireless has institutional clients (Google, Republic Wireless, Ritual.co, U.S. Government, Pacific MVNOs) and verifiable trade history, but we do not yet have multiple long-form independent journalism pieces written about Solaris as a subject. The company is referenced inside client case studies and trade-press coverage of those clients, but none of that constitutes coverage of Solaris itself in the WP:NCORP sense.

If a draft article were created today:

- It would be tagged for **A7 (no indication of importance)** or **G11 (unambiguous advertising)** within hours and likely speedy-deleted within a day.
- A surviving draft would go to **AfD (Articles for Deletion)** and almost certainly be deleted with consensus citing WP:NCORP.
- The submitting account, plus any IPs from the Solaris office or Vercel deploy node, would be permanently linked to a deleted-COI history. Future legitimate edits (correcting a factual error in a third-party article) would be reverted on sight.
- The deletion record would be publicly archived. Competitors would find it.

The conclusion: do not attempt a Solaris Wireless Wikipedia article. Not now, not via an agency, not via a sympathetic editor. The cost of a failed attempt is permanent reputational damage in the editor community.

---

## 2. The viable alternative: become a cited source

Wikipedia articles about industries, technologies and clients that Solaris is genuinely connected to already exist. Many of these articles are thinly cited, and the citations they do have are often broken, paywalled, or out of date. A well-written primary-research page on solariswireless.com, written in academic tone and offering original data that Wikipedia cannot get elsewhere, is exactly the kind of source a working editor will accept.

Once a citation lands, the URL is propagated to:

- Every Wikipedia mirror (DBpedia, Wikidata, hundreds of clones).
- AI training corpora (Common Crawl, the Pile, RedPajama, etc.).
- Search-engine knowledge panels.
- ChatGPT, Claude, Gemini, and Perplexity citation surfaces.

A single durable Wikipedia footnote is worth significantly more than a homepage backlink because it travels through the entire downstream ecosystem.

---

## 3. Specific target articles

The following Wikipedia articles are plausible homes for a Solaris citation. For each, the rationale notes what we would actually be a source for, not just what the article is about.

| # | Article | URL | Solaris-relevant section | What we cite |
|---|---|---|---|---|
| 1 | Mobile virtual network operator | https://en.wikipedia.org/wiki/Mobile_virtual_network_operator | "Wholesale handset procurement" / "MVNO operations" | The MVNO procurement survey research page. Cite as a primary source on how MVNOs source devices, average launch volumes, custom-OS adoption rates. |
| 2 | Telecommunications in the Cook Islands | https://en.wikipedia.org/wiki/Telecommunications_in_the_Cook_Islands | "Mobile" | Solaris has supplied handsets to Pacific MVNO operators serving the Cook Islands. Citation footnote on the existence of the supply chain. |
| 3 | Republic Wireless | https://en.wikipedia.org/wiki/Republic_Wireless | "Devices" / "History" | Solaris is on record as a historical handset supplier to Republic Wireless. Citation in the devices section. |
| 4 | Starlink | https://en.wikipedia.org/wiki/Starlink | "Maritime" or "Distribution" | Solaris is an authorised distributor of Starlink Maritime kits to commercial vessels. Citation in the distribution / maritime subsection. |
| 5 | Mobile device management | https://en.wikipedia.org/wiki/Mobile_device_management | "Provisioning" / "Zero-touch enrolment" | Cite the wholesale-pricing research page where it discusses the cost component of MDM pre-provisioning at scale. |
| 6 | Bring your own device | https://en.wikipedia.org/wiki/Bring_your_own_device | "Corporate-liable alternatives" | Cite institutional procurement data as context for why some organisations choose corporate-liable over BYOD. |
| 7 | Apple Business Manager | https://en.wikipedia.org/wiki/Apple_Business_Manager | "Authorised resellers" / "DEP enrolment" | Cite Solaris as an example of an authorised supplier executing DEP/ABM enrolment at scale. |
| 8 | Android (operating system) | https://en.wikipedia.org/wiki/Android_(operating_system) | "Custom Android distributions" / "OEM customisation" | Cite the wholesale pricing research as a source on the prevalence of custom Android distributions in MVNO supply. |
| 9 | Telecommunications in Miami | https://en.wikipedia.org/wiki/Telecommunications_in_Florida (or city stub) | "Companies" | Light touch: include Solaris in the list of Miami telecom companies. Lower priority. |
| 10 | List of mobile network operators of the Americas | https://en.wikipedia.org/wiki/List_of_mobile_network_operators_of_the_Americas | (depending on article scope) | Where MVNO supplier examples are listed. |

The two highest-leverage targets are **(1) Mobile virtual network operator** and **(3) Republic Wireless**, in that order. The MVNO article is broad, gets significant traffic, and currently lacks data citations on procurement specifically. The Republic Wireless article is narrower but has a near-perfect content fit because Solaris is an actual historical supplier.

---

## 4. The viable workflow (3 steps)

### Step A: Publish primary research worth citing

The output of this step is two pages on solariswireless.com that read like academic working papers, not marketing collateral. The drafts are:

- `/research/wholesale-android-handset-pricing-trends-2024-2026`
- `/research/mvno-handset-procurement-survey-2026`

Constraints on these pages:

- Academic tone. No "we are the leading supplier" copy. No CTA above the fold.
- Original methodology section (sample size, time period, anonymisation note, inclusion criteria).
- Findings presented as bullets, tables, or numbered claims that can be lifted as discrete facts.
- Limitations section that openly acknowledges sample bias and methodology constraints. This is the single most important credibility signal for a Wikipedia editor; a source that admits its limitations is more trusted than one that does not.
- Author byline ("Solaris Wireless Research Team") and dated publication / last-updated.
- ScholarlyArticle JSON-LD schema in addition to BreadcrumbList.
- Three or more discrete factual claims per page that are quotable in a single Wikipedia sentence with a footnote.

### Step B: Identify a non-conflicted Wikipedia editor

Wikipedia editors organise themselves into WikiProjects. The relevant ones for this strategy:

- **WikiProject Telecommunications**: https://en.wikipedia.org/wiki/Wikipedia:WikiProject_Telecommunications/Members
- **WikiProject Computing**: https://en.wikipedia.org/wiki/Wikipedia:WikiProject_Computing/Members
- **WikiProject Companies**: https://en.wikipedia.org/wiki/Wikipedia:WikiProject_Companies
- **WikiProject Cook Islands** (small project, but on-topic for the Pacific MVNO claim).

Selection criteria for an editor to approach:

1. Active in the last 90 days (check contributions tab).
2. Has edited at least one of the target articles in the last 12 months.
3. Lists a real-world identity, an academic affiliation, or a professional background relevant to telecoms (i.e. they are reachable and not anonymous-only).
4. Has no record of conflict with the brand or industry.
5. Has email-this-user enabled on their user profile.

Do **not** approach administrators or arbitrators directly; they are oversight roles, not topic editors, and an unsolicited brand pitch to an admin will be logged.

### Step C: Send a polite, transparent email

Email is sent from a real, named human at Solaris (not a generic marketing@ inbox), discloses the conflict of interest up front, and asks a question rather than makes a request. Template in section 5.

---

## 5. Email outreach template

Subject: Primary research on MVNO handset procurement, possibly useful for [Article name]

Hello [editor handle / first name],

I work at Solaris Wireless, a Miami-based electronic device supplier (founded 2013) that has spent more than a decade on the wholesale handset side of the MVNO and enterprise procurement market. I am reaching out because we have just published two pieces of primary research on solariswireless.com that may be useful as a citation on Wikipedia, and you appeared to me as the most active editor with relevant subject expertise on [specific article URL].

The two pages are:

- [Title 1] - [URL]
- [Title 2] - [URL]

Each page sets out methodology, sample size, anonymisation approach and limitations, and presents original quantitative findings on [topic]. They are written in working-paper style rather than as marketing material, and they contain data that to my knowledge is not currently published elsewhere.

I want to be completely transparent: I have a conflict of interest because I work for the company that produced the research. For that reason I will not be editing the article myself, and I am not asking you to edit it on our behalf. I am asking only whether the methodology and findings look credible enough to be cited as a source in your judgment, and if not, what would need to change.

If the answer is no, that is a useful answer too. We are happy to address methodology gaps or republish with stronger sourcing if you can point at what is missing.

Thank you for your time and for your work on Wikipedia. I appreciate that unsolicited messages from people with COI are a category you probably get a lot of, and that most of them are bad-faith. I have tried to make this one as honest as I can.

Best regards,
[Real name]
[Title]
Solaris Wireless
[Direct email]
[Direct phone]

Notes on the template:

- Subject line is specific. Generic subject lines get ignored.
- The COI disclosure is not buried; it is the third paragraph.
- The ask is "would this be cite-worthy in your judgment", not "please cite this".
- The closing acknowledges the editor's likely skepticism, which is disarming.
- No attachment. URLs only. Editors are wary of opening attachments from unknown senders.

---

## 6. Finding editors in detail

1. Open WikiProject Telecommunications members page: https://en.wikipedia.org/wiki/Wikipedia:WikiProject_Telecommunications/Members
2. For each active member listed, click through to their user page.
3. Skip anyone whose user page indicates retirement, hiatus, "semi-retired" status, or whose last contribution was more than 90 days ago.
4. Click "User contributions" and filter for the namespaces "Article" and "Article talk". Look for edits to one of the target articles in section 3 within the last 12 months.
5. Click "Email this user" in the sidebar. If absent, the editor has not enabled email; move on.
6. Build a shortlist of 5 to 10 candidates.
7. Send the outreach email **one at a time, sequentially**, waiting at least a week between sends. Sending the same email to multiple editors at once is meatpuppetry-adjacent and will be detected (Wikipedia editors talk to each other on noticeboards).

For Republic Wireless and other narrower articles, also check the "View history" tab on the article itself. The editors who have actually worked on the page are the highest-priority targets, ahead of generic WikiProject members.

---

## 7. After a citation lands

If an editor decides a Solaris research page is citable and adds a footnote to a target article:

- **Do not touch the article.** Do not log in to a Wikipedia account and verify the citation. Do not "fix" anything.
- **Do not thank the editor publicly on the article talk page.** A private email thank-you is fine; a public one creates a record that other editors will use to argue undue influence.
- **Monitor the citation for reverts.** Add the article to a private monitoring list (Visualping, ChangeDetection, or just a manual weekly check). Citations on contested topics are sometimes removed within days.
- **If the citation is reverted with a hostile edit summary**, do not retaliate. Read the reverter's reasoning. If there is a legitimate problem (broken link, factual inaccuracy in the cited page, methodology concern), fix the problem on solariswireless.com and let the original editor know via email. The original editor may re-add the citation; if they do not, accept the loss.
- **Do not ask the original editor to add a second citation to a second article.** One ask per editor per year, maximum. Burning a relationship by treating an editor as a placement channel is the single most common way brands lose Wikipedia presence.
- **Do not link to the Wikipedia citation in marketing material.** "As cited on Wikipedia" pull-quotes are a fast track to removal.

---

## 8. Realistic timeline

| Phase | Duration | Output |
|---|---|---|
| Publish 2 research pages | Week 0 to 2 | Two academic-tone pages live, indexed by Google, ScholarlyArticle schema validating in Google Rich Results test |
| Index check + minor revisions | Week 2 to 4 | Pages indexed, any methodology gaps closed |
| Editor research + shortlist | Week 4 to 6 | 5 to 10 candidate editors per target article |
| Outreach round 1 | Week 6 to 12 | 5 outreach emails sent, one per week, per target article |
| Editor decisions + first citation | Week 8 to 20 | Optimistically: one citation lands within 4 months. Realistically: 0 to 1 citations within 6 months. |
| Stabilisation | Month 6 to 12 | Citation survives reverts, propagates to Wikipedia mirrors and AI training data |

The honest answer is that this is a 3 to 6 month effort to land the first citation and a 9 to 12 month effort before that citation visibly affects AI answer surfaces. Anyone promising faster results is selling something that will harm the brand in the medium term.

---

## 9. Anti-patterns (do not do these)

| Anti-pattern | Why it backfires |
|---|---|
| Pay an "SEO agency" or "Wikipedia consultant" for placement | Wikipedia community actively hunts paid editors. Caught accounts are blocked, and the edits they made are reverted, often along with everything else they touched. The brand gets logged in the WP:COIN noticeboard. |
| Use a "meatpuppet" (friend/contractor with a clean account) | Sockpuppet investigations check IP ranges, behavioural patterns, and timing. Meatpuppetry is detected and treated identically to sockpuppetry. |
| Add the citation yourself with a clean-looking account | This is sockpuppetry. Same outcome as above. |
| Cite the homepage URL (solariswireless.com or solariswireless.com/about) | Homepage and About-page URLs are flagged as promotional. Cite the specific research page only. |
| Use marketing copy on the cited page | "Trusted by Fortune 500" sentences make the page un-citeable on sight. The research pages must read as research. |
| Edit the Wikipedia article yourself "just to fix a typo" after a citation lands | Logged as undisclosed paid editing. Triggers a sweep of all related edits. |
| Send the same outreach email to 20 editors in a single day | Editors share notes. Mass-outreach is treated as spam and the brand gets a noticeboard mention. |
| Add the citation to multiple articles in a single editing session | Single-purpose-account behaviour, immediately reverted. |
| Use a lobby firm, a PR firm, or a "reputation management" service | All three are domains Wikipedia community actively hunts. |
| Threaten or pressure an editor who reverts the citation | Permanent ban for the brand, and a noticeboard log entry that survives forever. |

---

## 10. Success metric

The metric for this strategy is not "how many Wikipedia articles cite Solaris". It is:

- One durable, surviving citation on a Wikipedia article with non-trivial monthly traffic, that has not been reverted for 90 consecutive days, and that has propagated to at least one Wikipedia mirror (DBpedia or Wikidata).

That single citation, achieved within 6 to 12 months, is the realistic ceiling and the realistic floor. Anything more is a bonus; anything less is the failure mode to design against.
