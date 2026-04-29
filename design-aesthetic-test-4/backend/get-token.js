/**
 * One-time script to obtain a Gmail + Google Sheets OAuth2 refresh token.
 * Run: node get-token.js
 */
require('dotenv').config();
const { google } = require('googleapis');
const http = require('http');
const url = require('url');

const CLIENT_ID = process.env.GMAIL_CLIENT_ID;
const CLIENT_SECRET = process.env.GMAIL_CLIENT_SECRET;
const REDIRECT_URI = 'http://localhost:9999/oauth2callback';

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('Error: GMAIL_CLIENT_ID and GMAIL_CLIENT_SECRET must be set in your .env file.');
  process.exit(1);
}

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

const authUrl = oAuth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: [
    'https://www.googleapis.com/auth/gmail.send',
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/drive.file',
  ],
  prompt: 'consent',
});

const server = http.createServer(async (req, res) => {
  const parsed = url.parse(req.url, true);
  if (!parsed.pathname.startsWith('/oauth2callback')) return;

  const code = parsed.query.code;
  if (!code) {
    res.end('No code received. Please try again.');
    server.close();
    return;
  }

  try {
    const { tokens } = await oAuth2Client.getToken(code);
    res.end('<h2 style="font-family:sans-serif;color:green">✅ Authorisation successful! You can close this tab.</h2>');
    server.close();

    console.log('\n=== SUCCESS ===\n');
    console.log(`GMAIL_REFRESH_TOKEN=${tokens.refresh_token}\n`);

    const fs = require('fs');
    const envPath = require('path').join(__dirname, '.env');
    let envContent = fs.readFileSync(envPath, 'utf8');
    if (envContent.includes('GMAIL_REFRESH_TOKEN=')) {
      envContent = envContent.replace(/GMAIL_REFRESH_TOKEN=.*/, `GMAIL_REFRESH_TOKEN=${tokens.refresh_token}`);
    } else {
      envContent += `\nGMAIL_REFRESH_TOKEN=${tokens.refresh_token}`;
    }
    fs.writeFileSync(envPath, envContent);
    console.log('✅ Refresh token written to .env');
    process.exit(0);
  } catch (err) {
    res.end(`<h2 style="color:red">Error: ${err.message}</h2>`);
    server.close();
    console.error('Error:', err.message);
    process.exit(1);
  }
});

server.listen(9999, () => {
  console.log('\n=== GMAIL + SHEETS OAUTH2 SETUP ===\n');
  console.log('Opening browser...\nIf it does not open, paste this URL:\n');
  console.log(authUrl + '\n');
  console.log('⚠️  Make sure you are logged in as solariswarehouse@gmail.com\n');
  const { exec } = require('child_process');
  exec(`open "${authUrl}"`);
});
