#!/usr/bin/env node
/**
 * AI prompt monitor for Solaris Wireless brand mentions and citations.
 *
 * For each prompt in data/ai-monitoring-prompts.json runs:
 *   - OpenAI gpt-4o-search-preview (web search)
 *   - Perplexity sonar-pro
 *
 * Records: cited_in_text, cited_as_source, competitors_cited, top_3_sources, answer_length.
 *
 * Usage:
 *   node scripts/ai-prompt-monitor.js                # full run, ~75 prompts
 *   node scripts/ai-prompt-monitor.js --limit 5      # smoke test on first 5
 *   node scripts/ai-prompt-monitor.js --tier branded # one tier only
 *
 * Env (in ../../.env): OPENAI_API_KEY, PERPLEXITY_API_KEY
 *
 * Cost: ~$1-3 per full run at 75 prompts.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');
const ENV_PATH = path.resolve(PROJECT_ROOT, '..', '..', '.env');
dotenv.config({ path: ENV_PATH });

const PROMPTS_PATH = path.join(PROJECT_ROOT, 'data', 'ai-monitoring-prompts.json');
const OUT_DIR = path.join(PROJECT_ROOT, 'data', 'ai-monitoring');
const TODAY = new Date().toISOString().slice(0, 10);
const OUT_PATH = path.join(OUT_DIR, `${TODAY}.json`);

const argv = process.argv.slice(2);
const argLimit = (() => {
  const i = argv.indexOf('--limit');
  return i >= 0 ? parseInt(argv[i + 1], 10) : null;
})();
const argTier = (() => {
  const i = argv.indexOf('--tier');
  return i >= 0 ? argv[i + 1] : null;
})();
const FORCE = argv.includes('--force');

if (!FORCE && fs.existsSync(OUT_PATH)) {
  console.log(`Snapshot already exists for ${TODAY}: ${OUT_PATH} (use --force to overwrite)`);
  process.exit(0);
}

const OPENAI_KEY = process.env.OPENAI_API_KEY;
const PERPLEXITY_KEY = process.env.PERPLEXITY_API_KEY;

if (!OPENAI_KEY && !PERPLEXITY_KEY) {
  console.error(`No OPENAI_API_KEY or PERPLEXITY_API_KEY in ${ENV_PATH}. Nothing to call.`);
  process.exit(1);
}

const SOLARIS_RX = /\bsolaris\s+wireless\b/i;
const SOLARIS_URL_RX = /solariswireless\.com/i;
const COMPETITORS_RX = {
  cdw: /\bcdw\b/i,
  brightstar: /\bbrightstar\b/i,
  insight: /\binsight\s+enterprises?\b/i,
  mobile_sentrix: /mobile\s*sentrix/i,
  pc_connection: /\b(pc\s*connection|connection,?\s+inc)\b/i,
};

function loadPrompts() {
  const all = JSON.parse(fs.readFileSync(PROMPTS_PATH, 'utf8'));
  let prompts = all;
  if (argTier) prompts = prompts.filter(p => p.tier === argTier);
  if (argLimit) prompts = prompts.slice(0, argLimit);
  return prompts;
}

function analyse(answerText, citations) {
  const text = answerText || '';
  const cited_in_text = SOLARIS_RX.test(text);
  const citationUrls = (citations || []).map(c => typeof c === 'string' ? c : (c.url || c.source || ''));
  const cited_as_source = citationUrls.some(u => SOLARIS_URL_RX.test(u || ''));
  const competitors_cited = Object.entries(COMPETITORS_RX)
    .filter(([, rx]) => rx.test(text))
    .map(([name]) => name);
  return {
    cited_in_text,
    cited_as_source,
    competitors_cited,
    top_3_sources: citationUrls.slice(0, 3),
    answer_length: text.length,
  };
}

async function callOpenAI(prompt) {
  if (!OPENAI_KEY) return { skipped: true };
  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${OPENAI_KEY}` },
      body: JSON.stringify({
        model: 'gpt-4o-search-preview',
        messages: [{ role: 'user', content: prompt }],
      }),
    });
    if (!res.ok) {
      const text = await res.text();
      return { error: `OpenAI ${res.status}: ${text.slice(0, 200)}` };
    }
    const data = await res.json();
    const msg = data.choices?.[0]?.message;
    const content = msg?.content || '';
    const annotations = msg?.annotations || [];
    const citations = annotations
      .filter(a => a.type === 'url_citation')
      .map(a => ({ url: a.url_citation?.url, title: a.url_citation?.title }));
    return { content, citations, ...analyse(content, citations) };
  } catch (err) {
    return { error: err.message };
  }
}

async function callPerplexity(prompt) {
  if (!PERPLEXITY_KEY) return { skipped: true };
  try {
    const res = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${PERPLEXITY_KEY}` },
      body: JSON.stringify({
        model: 'sonar-pro',
        messages: [{ role: 'user', content: prompt }],
      }),
    });
    if (!res.ok) {
      const text = await res.text();
      return { error: `Perplexity ${res.status}: ${text.slice(0, 200)}` };
    }
    const data = await res.json();
    const content = data.choices?.[0]?.message?.content || '';
    const citations = (data.citations || []).map(u => ({ url: u }));
    return { content, citations, ...analyse(content, citations) };
  } catch (err) {
    return { error: err.message };
  }
}

(async () => {
  const prompts = loadPrompts();
  console.log(`AI prompt monitor: ${prompts.length} prompts on ${TODAY}`);
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const results = [];
  for (let i = 0; i < prompts.length; i++) {
    const p = prompts[i];
    process.stdout.write(`  [${i + 1}/${prompts.length}] ${p.tier} :: ${p.prompt.slice(0, 60)}... `);
    const [openai, perplexity] = await Promise.all([callOpenAI(p.prompt), callPerplexity(p.prompt)]);
    results.push({ ...p, openai, perplexity });
    const oai = openai.cited_in_text ? 'O+' : (openai.error ? 'Oerr' : 'O-');
    const ppx = perplexity.cited_in_text ? 'P+' : (perplexity.error ? 'Perr' : 'P-');
    console.log(`${oai} ${ppx}`);
  }

  const summary = {
    snapshot_date: TODAY,
    snapshot_iso: new Date().toISOString(),
    total_prompts: results.length,
    openai_cited_in_text: results.filter(r => r.openai?.cited_in_text).length,
    openai_cited_as_source: results.filter(r => r.openai?.cited_as_source).length,
    perplexity_cited_in_text: results.filter(r => r.perplexity?.cited_in_text).length,
    perplexity_cited_as_source: results.filter(r => r.perplexity?.cited_as_source).length,
  };

  const out = { summary, results };
  fs.writeFileSync(OUT_PATH, JSON.stringify(out, null, 2));
  console.log(`\nWrote ${OUT_PATH}`);
  console.log(`  OpenAI text mentions: ${summary.openai_cited_in_text}/${summary.total_prompts}`);
  console.log(`  OpenAI source citations: ${summary.openai_cited_as_source}/${summary.total_prompts}`);
  console.log(`  Perplexity text mentions: ${summary.perplexity_cited_in_text}/${summary.total_prompts}`);
  console.log(`  Perplexity source citations: ${summary.perplexity_cited_as_source}/${summary.total_prompts}`);
})();
