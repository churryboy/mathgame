// Google Apps Script - Deploy this as a Web App
// This script should be added to your Google Sheet via Tools > Script Editor

function doPost(e) {
  try {
    // Parse the incoming data
    const data = JSON.parse(e.postData.contents);
    
    // Open the spreadsheet
    const sheet = SpreadsheetApp.openById('1-wkdWGG1aE9yfYNN0GFoIQXRxKTSf0x8ZcltGCgYltI');
    const worksheet = sheet.getSheetByName('Mathgame DB');
    
    if (!worksheet) {
      return ContentService
        .createTextOutput(JSON.stringify({error: 'Sheet not found'}))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Get all usernames to check if user exists
    const lastRow = worksheet.getLastRow();
    const usernames = lastRow > 1 ? worksheet.getRange(2, 1, lastRow - 1, 1).getValues().flat() : [];
    
    // Format user data
    const rowData = [
      data.username,
      data.password,
      data.grade,
      data.schoolName || '',
      data.stats?.bestScore || 0,
      data.stats?.bestStage || 1,
      data.stats?.playCount || 0,
      data.stats?.correctAnswers || 0,
      data.stats?.totalAnswers || 0,
      data.stats?.tier || '브론즈',
      data.stats?.gradeRank || 0,
      data.stats?.lastPlayed || new Date().toISOString(),
      JSON.stringify(data.stats?.gradeHistory || {}),
      data.createdAt || new Date().toISOString()
    ];
    
    // Check if user exists
    const userIndex = usernames.indexOf(data.username);
    
    if (userIndex >= 0) {
      // Update existing user (userIndex + 2 because row 1 is header)
      worksheet.getRange(userIndex + 2, 1, 1, rowData.length).setValues([rowData]);
    } else {
      // Append new user
      worksheet.appendRow(rowData);
    }
    
    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({success: true, message: 'User saved successfully'}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  try {
    const sheet = SpreadsheetApp.openById('1-wkdWGG1aE9yfYNN0GFoIQXRxKTSf0x8ZcltGCgYltI');
    const worksheet = sheet.getSheetByName('Mathgame DB');
    
    if (!worksheet) {
      return ContentService
        .createTextOutput(JSON.stringify({error: 'Sheet not found'}))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Get all data
    const lastRow = worksheet.getLastRow();
    const lastColumn = worksheet.getLastColumn();
    
    if (lastRow <= 1) {
      return ContentService
        .createTextOutput(JSON.stringify({users: []}))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    const data = worksheet.getRange(2, 1, lastRow - 1, lastColumn).getValues();
    
    // Convert to user objects
    const users = data.map(row => ({
      username: row[0] || '',
      password: row[1] || '',
      grade: parseInt(row[2]) || 1,
      schoolName: row[3] || '',
      stats: {
        bestScore: parseInt(row[4]) || 0,
        bestStage: parseInt(row[5]) || 1,
        playCount: parseInt(row[6]) || 0,
        correctAnswers: parseInt(row[7]) || 0,
        totalAnswers: parseInt(row[8]) || 0,
        tier: row[9] || '브론즈',
        gradeRank: parseInt(row[10]) || 0,
        lastPlayed: row[11] || '',
        gradeHistory: row[12] ? JSON.parse(row[12]) : {}
      },
      createdAt: row[13] || ''
    })).filter(user => user.username); // Filter out empty rows
    
    return ContentService
      .createTextOutput(JSON.stringify({users}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
