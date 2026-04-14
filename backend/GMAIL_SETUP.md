# Gmail OAuth2 Setup for Solaris Wireless Contact Form

## Step 1: Create a Google Cloud Project

1. Go to https://console.cloud.google.com/
2. Create a new project (e.g. "Solaris Wireless")
3. Go to **APIs & Services → Library**
4. Search for "Gmail API" and **Enable** it

## Step 2: Configure OAuth2 Credentials

1. Go to **APIs & Services → Credentials**
2. Click **Create Credentials → OAuth Client ID**
3. Choose **Desktop Application** as the application type
4. Name it (e.g. "Solaris Mailer")
5. Download the JSON — you'll get your **Client ID** and **Client Secret**

## Step 3: Get a Refresh Token

Run this one-time script to authorise your Gmail account:

```bash
cd backend
npm install
node get-token.js
```

The script will print a URL — open it in a browser, log in with the Gmail account that should send emails, and approve access. The script will then print your **Refresh Token**.

## Step 4: Create your .env file

Copy `.env.example` to `.env` and fill in your credentials:

```
GMAIL_CLIENT_ID=123456789-abc.apps.googleusercontent.com
GMAIL_CLIENT_SECRET=GOCSPX-your-secret-here
GMAIL_REFRESH_TOKEN=1//your-refresh-token-here
GMAIL_USER=youraddress@gmail.com
NOTIFY_EMAIL=youraddress@gmail.com
PORT=3001
```

- `GMAIL_USER` — the Gmail address that **sends** both emails
- `NOTIFY_EMAIL` — where lead notifications are sent (can be the same address)

## Step 5: Run the server

```bash
cd backend
npm install
npm start
```

The server will:
- Serve the website at `http://localhost:3001`
- Handle form submissions at `http://localhost:3001/api/contact`
- Send a **notification email** to you when a lead submits the form
- Send a **confirmation email** to the lead

## Deployment notes

For production, set the environment variables on your hosting platform rather than using a `.env` file. The server works on any Node.js host: Railway, Render, Heroku, DigitalOcean, AWS EC2, etc.
