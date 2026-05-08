// One-shot: update Sheet1 header row to include Phone column.
// Run once after deploying the phone-field changes:
//   cd backend && node update-sheet-headers.js
//
// Behaviour:
//   - Reads existing rows so it can warn about historical data alignment.
//   - Writes the new 9-column header (adds "Phone" between Email and Interest).
//   - Old rows (if any) keep their A-H values as-is. Their column F was
//     "Interest" under the old schema and is now labeled "Phone" in the
//     header. Sort by Timestamp to distinguish old vs new leads.
//   - Re-runnable: writing the same header twice is a no-op.

require('dotenv').config();
const { google } = require('googleapis');

const HEADERS = [
  'Timestamp', 'First Name', 'Last Name', 'Organisation',
  'Email', 'Phone', 'Interest', 'Message', 'Status',
];

async function main() {
  const auth = new google.auth.OAuth2(
    process.env.GMAIL_CLIENT_ID,
    process.env.GMAIL_CLIENT_SECRET
  );
  auth.setCredentials({ refresh_token: process.env.GMAIL_REFRESH_TOKEN });

  const sheets = google.sheets({ version: 'v4', auth });

  // First, peek at what's there.
  const peek = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.SHEET_ID,
    range: 'Sheet1!A1:I50',
  });
  const rows = peek.data.values || [];
  const currentHeader = rows[0] || [];
  const dataRowCount = Math.max(0, rows.length - 1);

  console.log('Current header row:', currentHeader.length ? currentHeader.join(' | ') : '(empty)');
  console.log('Data rows below header (visible in first 50):', dataRowCount);

  if (currentHeader.length === HEADERS.length &&
      currentHeader.every((h, i) => h === HEADERS[i])) {
    console.log('Header already matches new 9-column schema. Nothing to do.');
    return;
  }

  await sheets.spreadsheets.values.update({
    spreadsheetId: process.env.SHEET_ID,
    range: 'Sheet1!A1:I1',
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: [HEADERS] },
  });

  console.log('\nUpdated Sheet1 header row to:');
  console.log('  ' + HEADERS.join(' | '));

  if (dataRowCount > 0) {
    console.log('\nNote: ' + dataRowCount + ' existing data row(s) detected.');
    console.log('Their column F was "Interest" under the old schema; the header now labels it "Phone".');
    console.log('New leads from today onward will populate Phone correctly.');
    console.log('To migrate old rows manually: shift columns F-H one column right for all rows ' +
                'where Timestamp is before ' + new Date().toISOString().slice(0, 10) + '.');
  }
}

main().catch(err => { console.error('Failed:', err.message); process.exit(1); });
