# Google Sheets API Setup Guide

To connect your Math Monster Game to Google Sheets, follow these steps:

## 1. Enable Google Sheets API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Sheets API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Sheets API"
   - Click on it and press "Enable"

## 2. Create Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "API Key"
3. Copy the API key
4. Click "Create Credentials" > "OAuth client ID"
   - Choose "Web application"
   - Add your domain to "Authorized JavaScript origins":
     - For local testing: `http://localhost:8000`
     - For production: `https://mathgame-three.vercel.app`
   - Copy the Client ID

## 3. Set up Google Sheet

1. Open your Google Sheet: https://docs.google.com/spreadsheets/d/1-wkdWGG1aE9yfYNN0GFoIQXRxKTSf0x8ZcltGCgYltI/
2. Create a sheet named "Mathgame DB" if it doesn't exist
3. Add these headers in row 1:
   - A1: username
   - B1: password
   - C1: grade
   - D1: schoolName
   - E1: bestScore
   - F1: bestStage
   - G1: playCount
   - H1: correctAnswers
   - I1: totalAnswers
   - J1: tier
   - K1: gradeRank
   - L1: lastPlayed
   - M1: gradeHistory
   - N1: createdAt

4. Share the sheet:
   - Click "Share" button
   - Change to "Anyone with the link can edit"
   - Copy the link

## 4. Update the Code

1. Open `googleSheets.js`
2. Replace these values:
   ```javascript
   this.apiKey = 'YOUR_API_KEY'; // Replace with your API key
   this.clientId = 'YOUR_CLIENT_ID'; // Replace with your Client ID
   ```

## 5. Alternative: Public Sheet Access (No Auth Required)

For simpler setup without authentication, you can use the Google Sheets API v4 with just an API key:

1. Make your sheet public:
   - In Google Sheets, go to File > Share > Publish to web
   - Choose "Entire Document" and "Web page"
   - Click "Publish"

2. Use this simplified approach in your code (already implemented as fallback)

## 6. Test the Integration

1. Open your game in a browser
2. Check the browser console for any errors
3. Try creating a new account - it should save to Google Sheets
4. Try logging in - it should retrieve from Google Sheets

## Troubleshooting

- **CORS errors**: Make sure your domain is added to authorized origins
- **Permission errors**: Check that the sheet is shared properly
- **API quota**: Google Sheets API has usage limits (300 requests per minute)

## Security Note

For production use, consider:
- Using environment variables for API keys
- Implementing server-side proxy for API calls
- Using service account authentication for better security
