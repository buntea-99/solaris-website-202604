// One-shot: shift columns F-H one column right for historical rows logged
// under the OLD 8-column schema, so they line up under the NEW 9-column
// header (Timestamp | First Name | Last Name | Organisation | Email |
// Phone | Interest | Message | Status).
//
// Behaviour:
//   - Identifies rows whose Timestamp (column A) is strictly BEFORE the
//     migration cutoff date passed via --cutoff YYYY-MM-DD (default today).
//   - For each such row, copies columns F-H to G-I and clears F.
//   - Idempotent guard: if the row already has empty F and non-empty G/H,
//     it is treated as already-migrated and skipped.
//   - Dry run by default. Pass --apply to actually write.
//
// Usage:
//   cd backend && node migrate-historical-rows.js              # dry run
//   cd backend && node migrate-historical-rows.js --apply      # write
//   cd backend && node migrate-historical-rows.js --apply --cutoff 2026-05-08

require('dotenv').config();
const { google } = require('googleapis');

function arg(flag, fallback) {
  const i = process.argv.indexOf(flag);
  return i >= 0 ? process.argv[i + 1] : fallback;
}
const APPLY = process.argv.includes('--apply');
const CUTOFF = arg('--cutoff', new Date().toISOString().slice(0, 10));

async function main() {
  const auth = new google.auth.OAuth2(
    process.env.GMAIL_CLIENT_ID,
    process.env.GMAIL_CLIENT_SECRET
  );
  auth.setCredentials({ refresh_token: process.env.GMAIL_REFRESH_TOKEN });
  const sheets = google.sheets({ version: 'v4', auth });

  const resp = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.SHEET_ID,
    range: 'Sheet1!A1:I1000',
  });
  const rows = resp.data.values || [];
  if (rows.length < 2) {
    console.log('No data rows. Nothing to do.');
    return;
  }

  console.log(`Mode: ${APPLY ? 'APPLY (will write)' : 'DRY RUN'}`);
  console.log(`Cutoff: rows with Timestamp < ${CUTOFF} will be shifted.\n`);

  const updates = [];
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const ts = row[0] || '';
    if (!ts) continue;
    const tsDate = ts.slice(0, 10);
    if (tsDate >= CUTOFF) continue;

    const f = row[5] || '';
    const g = row[6] || '';
    const h = row[7] || '';
    const iCol = row[8] || '';

    // Already migrated guard: F empty, G/H non-empty.
    if (f === '' && (g !== '' || h !== '')) {
      console.log(`  row ${i + 1}: already migrated, skipping`);
      continue;
    }

    const sheetRow = i + 1;
    const newG = f;
    const newH = g;
    const newI = h || iCol;
    updates.push({ sheetRow, oldFGH: [f, g, h], newFGHI: ['', newG, newH, newI] });
  }

  console.log(`Rows to migrate: ${updates.length}\n`);
  for (const u of updates) {
    console.log(`  row ${u.sheetRow}: F='${u.oldFGH[0]}' G='${u.oldFGH[1]}' H='${u.oldFGH[2]}'`);
    console.log(`    -> F='' G='${u.newFGHI[1]}' H='${u.newFGHI[2]}' I='${u.newFGHI[3]}'`);
  }

  if (!APPLY) {
    console.log('\nDry run complete. Re-run with --apply to write.');
    return;
  }

  if (!updates.length) {
    console.log('Nothing to apply.');
    return;
  }

  // Batch update: for each row, write F:I as ['', G, H, I].
  const data = updates.map(u => ({
    range: `Sheet1!F${u.sheetRow}:I${u.sheetRow}`,
    values: [u.newFGHI],
  }));

  await sheets.spreadsheets.values.batchUpdate({
    spreadsheetId: process.env.SHEET_ID,
    requestBody: { valueInputOption: 'USER_ENTERED', data },
  });

  console.log(`\nApplied ${updates.length} row migration(s).`);
}

main().catch(err => { console.error('Failed:', err.message); process.exit(1); });
