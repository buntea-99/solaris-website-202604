#!/usr/bin/env node
/**
 * Weekly AI SEO report. Reads the two newest snapshots in
 *   data/semrush/ and data/ai-monitoring/
 * and prints week-over-week deltas to stdout.
 *
 * Usage: node scripts/report.js
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');
const SEMRUSH_DIR = path.join(PROJECT_ROOT, 'data', 'semrush');
const AIM_DIR = path.join(PROJECT_ROOT, 'data', 'ai-monitoring');

function listSnapshots(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter(f => /^\d{4}-\d{2}-\d{2}\.json$/.test(f))
    .sort()
    .reverse()
    .map(f => path.join(dir, f));
}

function loadJson(p) { return JSON.parse(fs.readFileSync(p, 'utf8')); }

function aioPresenceCount(snap) {
  if (!snap?.aio_features) return 0;
  // Fk column is the SERP-features bitmask. AI Overview = bit 52.
  // SEMrush returns this as a comma list of feature codes; "13" or "AIO" depending on output.
  return snap.aio_features.filter(row => {
    const fk = String(row.Fk || row['SERP Features'] || '');
    return /\b(13|aio|52)\b/i.test(fk);
  }).length;
}

function refdomainSet(snap) {
  return new Set((snap?.backlinks?.refdomains || []).map(r => r.domain).filter(Boolean));
}

function authorityScore(snap) {
  const ov = snap?.backlinks?.overview?.[0];
  return ov?.ascore ?? ov?.AS ?? null;
}

function competitorGapsForBrand(aimSnap) {
  if (!aimSnap?.results) return [];
  const gaps = aimSnap.results
    .filter(r => r.tier === 'unbranded' || r.tier === 'competitive')
    .map(r => {
      const oai = r.openai || {};
      const ppx = r.perplexity || {};
      const competitorsCited = new Set([
        ...(oai.competitors_cited || []),
        ...(ppx.competitors_cited || []),
      ]);
      const solarisCited = oai.cited_in_text || ppx.cited_in_text || oai.cited_as_source || ppx.cited_as_source;
      if (competitorsCited.size > 0 && !solarisCited) {
        return { tier: r.tier, prompt: r.prompt, competitors: [...competitorsCited] };
      }
      return null;
    })
    .filter(Boolean);
  return gaps.slice(0, 5);
}

function pad(label, val, width = 36) {
  return `${label}${' '.repeat(Math.max(1, width - label.length))}${val}`;
}

function delta(now, then) {
  if (now == null || then == null) return '';
  const d = now - then;
  if (d === 0) return ` (=)`;
  return ` (${d > 0 ? '+' : ''}${d})`;
}

(async () => {
  const semrushSnaps = listSnapshots(SEMRUSH_DIR);
  const aimSnaps = listSnapshots(AIM_DIR);

  console.log('============================================================');
  console.log(' Solaris Wireless: AI SEO weekly report');
  console.log(`  generated ${new Date().toISOString()}`);
  console.log('============================================================\n');

  if (semrushSnaps.length === 0) {
    console.log('No SEMrush snapshots found. Run `npm run semrush` first.\n');
  } else {
    const cur = loadJson(semrushSnaps[0]);
    const prev = semrushSnaps[1] ? loadJson(semrushSnaps[1]) : null;
    console.log('SEMrush');
    console.log(`  current snapshot: ${path.basename(semrushSnaps[0])}`);
    if (prev) console.log(`  previous snapshot: ${path.basename(semrushSnaps[1])}`);
    console.log('');
    const aioNow = aioPresenceCount(cur);
    const aioPrev = prev ? aioPresenceCount(prev) : null;
    console.log(pad('  AIO presence (priority kw):', `${aioNow}${delta(aioNow, aioPrev)}`));

    const orgNow = cur.organic?.length || 0;
    const orgPrev = prev?.organic?.length ?? null;
    console.log(pad('  organic keywords (top 500):', `${orgNow}${delta(orgNow, orgPrev)}`));

    const asNow = authorityScore(cur);
    const asPrev = prev ? authorityScore(prev) : null;
    console.log(pad('  authority score:', `${asNow ?? 'n/a'}${delta(Number(asNow), Number(asPrev))}`));

    if (prev) {
      const a = refdomainSet(cur);
      const b = refdomainSet(prev);
      const newDomains = [...a].filter(d => !b.has(d));
      const lostDomains = [...b].filter(d => !a.has(d));
      console.log(pad('  new referring domains:', newDomains.length));
      console.log(pad('  lost referring domains:', lostDomains.length));
      if (newDomains.length) console.log(`    + ${newDomains.slice(0, 10).join(', ')}${newDomains.length > 10 ? '...' : ''}`);
      if (lostDomains.length) console.log(`    - ${lostDomains.slice(0, 10).join(', ')}${lostDomains.length > 10 ? '...' : ''}`);
    } else {
      console.log(pad('  referring domains:', refdomainSet(cur).size));
    }
    console.log('');
  }

  if (aimSnaps.length === 0) {
    console.log('No AI monitoring snapshots found. Run `npm run ai-monitor` first.\n');
  } else {
    const cur = loadJson(aimSnaps[0]);
    const prev = aimSnaps[1] ? loadJson(aimSnaps[1]) : null;
    console.log('AI prompt monitor');
    console.log(`  current snapshot: ${path.basename(aimSnaps[0])}`);
    if (prev) console.log(`  previous snapshot: ${path.basename(aimSnaps[1])}`);
    console.log('');
    const s = cur.summary || {};
    const ps = prev?.summary || {};
    console.log(pad('  prompts run:', s.total_prompts ?? 'n/a'));
    console.log(pad('  OpenAI text mentions:', `${s.openai_cited_in_text ?? 0}${delta(s.openai_cited_in_text, ps.openai_cited_in_text)}`));
    console.log(pad('  OpenAI source citations:', `${s.openai_cited_as_source ?? 0}${delta(s.openai_cited_as_source, ps.openai_cited_as_source)}`));
    console.log(pad('  Perplexity text mentions:', `${s.perplexity_cited_in_text ?? 0}${delta(s.perplexity_cited_in_text, ps.perplexity_cited_in_text)}`));
    console.log(pad('  Perplexity source citations:', `${s.perplexity_cited_as_source ?? 0}${delta(s.perplexity_cited_as_source, ps.perplexity_cited_as_source)}`));
    console.log('');

    const gaps = competitorGapsForBrand(cur);
    if (gaps.length) {
      console.log('  Top citation gaps (competitors cited, Solaris not):');
      gaps.forEach((g, i) => {
        console.log(`    ${i + 1}. [${g.tier}] ${g.prompt}`);
        console.log(`       competitors cited: ${g.competitors.join(', ')}`);
      });
    } else {
      console.log('  No competitor citation gaps in unbranded/competitive prompts.');
    }
    console.log('');
  }

  console.log('============================================================');
  console.log('Next steps:');
  console.log('  - For each citation gap, target the playbook in /docs');
  console.log('    (Reddit, Quora, Wikipedia, LinkedIn) for the relevant tag.');
  console.log('  - Log completions in data/offsite-progress.md');
  console.log('============================================================');
})();
