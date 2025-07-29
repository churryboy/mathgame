// Vercel Serverless Function for saving user data to Google Sheets
const { google } = require('googleapis');

// You'll need to create a service account and add these credentials
const GOOGLE_SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
const SPREADSHEET_ID = '1-wkdWGG1aE9yfYNN0GFoIQXRxKTSf0x8ZcltGCgYltI';

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const userData = req.body;

    // Initialize Google Sheets API
    const auth = new google.auth.JWT(
      GOOGLE_SERVICE_ACCOUNT_EMAIL,
      null,
      GOOGLE_PRIVATE_KEY,
      ['https://www.googleapis.com/auth/spreadsheets']
    );

    const sheets = google.sheets({ version: 'v4', auth });

    // Format user data for Google Sheets
    const values = [[
      userData.username,
      userData.password,
      userData.grade,
      userData.schoolName || '',
      userData.stats?.bestScore || 0,
      userData.stats?.bestStage || 1,
      userData.stats?.playCount || 0,
      userData.stats?.correctAnswers || 0,
      userData.stats?.totalAnswers || 0,
      userData.stats?.tier || '브론즈',
      userData.stats?.gradeRank || 0,
      userData.stats?.lastPlayed || new Date().toISOString(),
      JSON.stringify(userData.stats?.gradeHistory || {}),
      userData.createdAt || new Date().toISOString()
    ]];

    // Check if user exists
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Mathgame DB!A:A',
    });

    const usernames = response.data.values?.flat() || [];
    const userIndex = usernames.indexOf(userData.username);

    if (userIndex > 0) {
      // Update existing user (userIndex + 1 because of 0-based index)
      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `Mathgame DB!A${userIndex + 1}:N${userIndex + 1}`,
        valueInputOption: 'USER_ENTERED',
        resource: { values },
      });
    } else {
      // Append new user
      await sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: 'Mathgame DB!A:N',
        valueInputOption: 'USER_ENTERED',
        insertDataOption: 'INSERT_ROWS',
        resource: { values },
      });
    }

    res.status(200).json({ success: true, message: 'User saved successfully' });
  } catch (error) {
    console.error('Error saving to Google Sheets:', error);
    res.status(500).json({ error: 'Failed to save user data' });
  }
};
