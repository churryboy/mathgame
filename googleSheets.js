// Google Sheets Database Integration
class GoogleSheetsDB {
    constructor() {
        // Google Sheets configuration
        this.spreadsheetId = '1-wkdWGG1aE9yfYNN0GFoIQXRxKTSf0x8ZcltGCgYltI';
        this.apiKey = 'YOUR_API_KEY'; // You'll need to add your API key
        this.clientId = 'YOUR_CLIENT_ID'; // You'll need to add your client ID
        this.discoveryDocs = ['https://sheets.googleapis.com/$discovery/rest?version=v4'];
        this.scopes = 'https://www.googleapis.com/auth/spreadsheets';
        
        this.isInitialized = false;
        this.isSignedIn = false;
    }

    // Initialize Google API
    async init() {
        return new Promise((resolve, reject) => {
            gapi.load('client:auth2', async () => {
                try {
                    await gapi.client.init({
                        apiKey: this.apiKey,
                        clientId: this.clientId,
                        discoveryDocs: this.discoveryDocs,
                        scope: this.scopes
                    });

                    // Listen for sign-in state changes
                    gapi.auth2.getAuthInstance().isSignedIn.listen((isSignedIn) => {
                        this.isSignedIn = isSignedIn;
                    });

                    // Handle initial sign-in state
                    this.isSignedIn = gapi.auth2.getAuthInstance().isSignedIn.get();
                    this.isInitialized = true;
                    
                    resolve();
                } catch (error) {
                    console.error('Error initializing Google API:', error);
                    reject(error);
                }
            });
        });
    }

    // Sign in user
    async signIn() {
        if (!this.isInitialized) {
            await this.init();
        }
        return gapi.auth2.getAuthInstance().signIn();
    }

    // Sign out user
    signOut() {
        return gapi.auth2.getAuthInstance().signOut();
    }

    // Get all users from sheet
    async getAllUsers() {
        try {
            const response = await gapi.client.sheets.spreadsheets.values.get({
                spreadsheetId: this.spreadsheetId,
                range: 'Mathgame DB!A2:Z1000', // Adjust range as needed
            });

            const rows = response.result.values || [];
            return rows.map(row => this.parseUserFromRow(row));
        } catch (error) {
            console.error('Error fetching users:', error);
            return [];
        }
    }

    // Get specific user by username
    async getUser(username) {
        const users = await this.getAllUsers();
        return users.find(user => user.username === username);
    }

    // Save or update user data
    async saveUser(userData) {
        try {
            const users = await this.getAllUsers();
            const existingUserIndex = users.findIndex(u => u.username === userData.username);
            
            if (existingUserIndex >= 0) {
                // Update existing user
                const rowNumber = existingUserIndex + 2; // +2 because sheet starts at row 1 and we skip header
                await this.updateUserRow(rowNumber, userData);
            } else {
                // Add new user
                await this.appendUserRow(userData);
            }
            
            return true;
        } catch (error) {
            console.error('Error saving user:', error);
            return false;
        }
    }

    // Update specific user row
    async updateUserRow(rowNumber, userData) {
        const values = [this.formatUserToRow(userData)];
        
        return gapi.client.sheets.spreadsheets.values.update({
            spreadsheetId: this.spreadsheetId,
            range: `Mathgame DB!A${rowNumber}:Z${rowNumber}`,
            valueInputOption: 'USER_ENTERED',
            resource: { values }
        });
    }

    // Append new user row
    async appendUserRow(userData) {
        const values = [this.formatUserToRow(userData)];
        
        return gapi.client.sheets.spreadsheets.values.append({
            spreadsheetId: this.spreadsheetId,
            range: 'Mathgame DB!A:Z',
            valueInputOption: 'USER_ENTERED',
            insertDataOption: 'INSERT_ROWS',
            resource: { values }
        });
    }

    // Parse row data to user object
    parseUserFromRow(row) {
        return {
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
                gradeHistory: JSON.parse(row[12] || '{}')
            },
            createdAt: row[13] || new Date().toISOString()
        };
    }

    // Format user object to row data
    formatUserToRow(userData) {
        return [
            userData.username,
            userData.password,
            userData.grade,
            userData.schoolName || '',
            userData.stats.bestScore,
            userData.stats.bestStage,
            userData.stats.playCount,
            userData.stats.correctAnswers,
            userData.stats.totalAnswers,
            userData.stats.tier,
            userData.stats.gradeRank,
            userData.stats.lastPlayed || new Date().toISOString(),
            JSON.stringify(userData.stats.gradeHistory || {}),
            userData.createdAt || new Date().toISOString()
        ];
    }

    // Sync local storage with Google Sheets
    async syncWithLocalStorage() {
        try {
            const localUsers = JSON.parse(localStorage.getItem('mathGameUsers') || '[]');
            const sheetUsers = await this.getAllUsers();
            
            // Merge users (sheet data takes precedence)
            const mergedUsers = [...sheetUsers];
            
            // Add local users that don't exist in sheet
            localUsers.forEach(localUser => {
                if (!mergedUsers.find(u => u.username === localUser.username)) {
                    mergedUsers.push(localUser);
                    this.saveUser(localUser); // Save to sheet
                }
            });
            
            // Update local storage with merged data
            localStorage.setItem('mathGameUsers', JSON.stringify(mergedUsers));
            
            return mergedUsers;
        } catch (error) {
            console.error('Error syncing data:', error);
            return [];
        }
    }

    // Get leaderboard data
    async getLeaderboard(grade = null) {
        const users = await this.getAllUsers();
        let filteredUsers = users;
        
        if (grade) {
            filteredUsers = users.filter(user => {
                return user.stats.gradeHistory && 
                       user.stats.gradeHistory[grade.toString()] &&
                       user.stats.gradeHistory[grade.toString()].playCount > 0;
            });
        }
        
        return filteredUsers.sort((a, b) => b.stats.bestScore - a.stats.bestScore);
    }
}

// Export for use in game
window.GoogleSheetsDB = GoogleSheetsDB;
