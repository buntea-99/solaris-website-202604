#!/usr/bin/env node
/**
 * SEMrush snapshot for solariswireless.com.
 * Writes data/semrush/YYYY-MM-DD.json with: organic, gap, backlinks, aio_features.
 *
 * Usage:
 *   node scripts/semrush-pull.js          # skip if today's snapshot exists
 *   node scripts/semrush-pull.js --force  # overwrite
 *
 * Env: SEMRUSH_API_KEY (in ../../.env, ie. /Users/vasugupta/Documents/Client Work/Bivek/.env).
 *
 * Cost guard: ~6,000 API units per full run (500 organic + 200 backlinks + 50 phrases).
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');
const ENV_PATH = path.resolve(PROJECT_ROOT, '..', '..', '.env');
dotenv.config({ path: ENV_PATH });

const KEY = process.env.SEMRUSH_API_KEY;
if (!KEY) {
  console.error(`Missing SEMRUSH_API_KEY. Looked in ${ENV_PATH}`);
  process.exit(1);
}

const DOMAIN = 'solariswireless.com';
const DATABASE = 'us';
const COMPETITORS = ['apple.com', 'cdw.com', 'brightstar.com', 'mobilesentrix.com', 'insight.com'];
const PRIORITY_KEYWORDS_PATH = path.join(PROJECT_ROOT, 'data', 'priority-keywords.json');
const OUT_DIR = path.join(PROJECT_ROOT, 'data', 'semrush');
const TODAY = new Date().toISOString().slice(0, 10);
const OUT_PATH = path.join(OUT_DIR, `${TODAY}.json`);

const FORCE = process.argv.includes('--force');

if (!FORCE && fs.existsSync(OUT_PATH)) {
  console.log(`Snapshot already exists for ${TODAY}: ${OUT_PATH} (use --force to overwrite)`);
  process.exit(0);
}

fs.mkdirSync(OUT_DIR, { recursive: true });

async function semrush(params) {
  const url = `https://api.semrush.com/?${new URLSearchParams({ key: KEY, ...params })}`;
  const res = await fetch(url);
  const text = await res.text();
  if (!res.ok) throw new Error(`SEMrush ${params.type} ${res.status}: ${text.slice(0, 200)}`);
  if (text.startsWith('ERROR')) {
    console.warn(`SEMrush ${params.type}: ${text.trim()}`);
    return [];
  }
  return parseCsv(text);
}

function parseCsv(text) {
  const lines = text.trim().split('\n').filter(Boolean);
  if (lines.length < 2) return [];
  const headers = lines[0].split(';').map(h => h.trim());
  return lines.slice(1).map(line => {
    const cells = line.split(';');
    return Object.fromEntries(headers.map((h, i) => [h, cells[i]]));
  });
}

async function backlinks(type, target, opts = {}) {
  const url = `https://api.semrush.com/analytics/v1/?${new URLSearchParams({
    key: KEY, type, target, target_type: 'root_domain', ...opts,
  })}`;
  const res = await fetch(url);
  const text = await res.text();
  if (!res.ok) throw new Error(`SEMrush ${type} ${res.status}: ${text.slice(0, 200)}`);
  if (text.startsWith('ERROR')) {
    console.warn(`SEMrush ${type}: ${text.trim()}`);
    return [];
  }
  return parseCsv(text);
}

function loadPriorityKeywords() {
  if (!fs.existsSync(PRIORITY_KEYWORDS_PATH)) {
    console.warn(`No ${PRIORITY_KEYWORDS_PATH}; aio_features section will be empty.`);
    return [];
  }
  const arr = JSON.parse(fs.readFileSync(PRIORITY_KEYWORDS_PATH, 'utf8'));
  return Array.isArray(arr) ? arr.slice(0, 50) : [];
}

async function pullOrganic() {
  console.log('  organic: domain_organic top 500');
  return semrush({
    type: 'domain_organic',
    domain: DOMAIN,
    database: DATABASE,
    display_limit: 500,
    export_columns: 'Ph,Po,Pp,Pd,Nq,Cp,Co,Tr,Ur',
    display_sort: 'tr_desc',
  });
}

async function pullGap() {
  console.log(`  gap: domain_domains vs ${COMPETITORS.length} competitors`);
  const domains = [`*|or|${DOMAIN}`, ...COMPETITORS.map(d => `*|or|${d}`)].join('|');
  return semrush({
    type: 'domain_domains',
    domains,
    database: DATABASE,
    display_limit: 500,
    export_columns: 'Ph,P0,P1,P2,P3,P4,P5,Nq,Cp',
  });
}

async function pullBacklinks() {
  console.log('  backlinks: overview + 200 referring domains');
  const overview = await backlinks('backlinks_overview', DOMAIN, {
    export_columns: 'ascore,total,domains_num,urls_num,ips_num,follows_num,nofollows_num,sponsored_num,ugc_num,texts_num,images_num,forms_num,frames_num',
  });
  const refdomains = await backlinks('backlinks_refdomains', DOMAIN, {
    display_limit: 200,
    export_columns: 'domain_ascore,domain,backlinks_num,first_seen,last_seen',
  });
  return { overview, refdomains };
}

async function pullAioFeatures(keywords) {
  if (keywords.length === 0) return [];
  console.log(`  aio_features: phrase_these for ${keywords.length} priority keywords`);
  return semrush({
    type: 'phrase_these',
    phrase: keywords.join(';'),
    database: DATABASE,
    export_columns: 'Ph,Nq,Cp,Kd,Co,Fk',
  });
}

(async () => {
  console.log(`SEMrush snapshot for ${DOMAIN} on ${TODAY}`);
  const priorityKeywords = loadPriorityKeywords();

  const out = {
    domain: DOMAIN,
    database: DATABASE,
    snapshot_date: TODAY,
    snapshot_iso: new Date().toISOString(),
    priority_keywords_count: priorityKeywords.length,
    competitors: COMPETITORS,
  };

  try {
    out.organic = await pullOrganic();
    out.gap = await pullGap();
    out.backlinks = await pullBacklinks();
    out.aio_features = await pullAioFeatures(priorityKeywords);
  } catch (err) {
    console.error('SEMrush pull failed:', err.message);
    out.error = err.message;
  }

  fs.writeFileSync(OUT_PATH, JSON.stringify(out, null, 2));
  console.log(`\nWrote ${OUT_PATH}`);
  console.log(`  organic: ${out.organic?.length || 0}`);
  console.log(`  gap: ${out.gap?.length || 0}`);
  console.log(`  refdomains: ${out.backlinks?.refdomains?.length || 0}`);
  console.log(`  aio_features: ${out.aio_features?.length || 0}`);
})();
