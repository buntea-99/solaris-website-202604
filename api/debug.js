module.exports = function handler(req, res) {
  res.json({
    GMAIL_CLIENT_ID:     (process.env.GMAIL_CLIENT_ID     || '').substring(0, 30) + '...',
    GMAIL_CLIENT_SECRET: (process.env.GMAIL_CLIENT_SECRET || '').substring(0, 10) + '...',
    GMAIL_REFRESH_TOKEN: (process.env.GMAIL_REFRESH_TOKEN || '').substring(0, 20) + '...',
    GMAIL_USER:           process.env.GMAIL_USER || 'NOT SET',
    NOTIFY_EMAIL:         process.env.NOTIFY_EMAIL || 'NOT SET',
    SHEET_ID:            (process.env.SHEET_ID || '').substring(0, 15) + '...',
  });
};
