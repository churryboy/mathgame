// Simplified Google Sheets Integration (Public Read Access)
class SimpleGoogleSheetsDB {
    constructor() {
        this.spreadsheetId = '1-wkdWGG1aE9yfYNN0GFoIQXRxKTSf0x8ZcltGCgYltI';
        this.sheetName = 'Mathgame DB';
        
        // For public read-only access
        this.apiKey = 'AIzaSyDyzmJY9n8OPEi6nMQJpK5U5F-q5zX2lX8'; // This is a demo key - replace with yours
        this.baseUrl = 'https://sheets.googleapis.com/v4/spreadsheets';
    }

    // Get all users from sheet (read-only)
    async getAllUsers() {
        try {
            const range = `${this.sheetName}!A2:N1000`;
            const url = `${this.baseUrl}/${this.spreadsheetId}/values/${range}?key=${this.apiKey}`;
            
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            const rows = data.values || [];
            
            return rows.map(row => this.parseUserFromRow(row));
        } catch (error) {
            console.error('Error fetching users from Google Sheets:', error);
            // Fallback to localStorage
            return JSON.parse(localStorage.getItem('mathGameUsers') || '[]');
        }
    }

    // Parse row data to user object
    parseUserFromRow(row) {
        try {
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
                    gradeHistory: row[12] ? JSON.parse(row[12]) : {}
                },
                createdAt: row[13] || new Date().toISOString()
            };
        } catch (error) {
            console.error('Error parsing user row:', error);
            return null;
        }
    }

    // Save user data locally and try to sync with admin later
    async saveUser(userData) {
        try {
            // For now, save to localStorage
            const users = JSON.parse(localStorage.getItem('mathGameUsers') || '[]');
            const existingUserIndex = users.findIndex(u => u.username === userData.username);
            
            if (existingUserIndex >= 0) {
                users[existingUserIndex] = userData;
            } else {
                users.push(userData);
            }
            
            localStorage.setItem('mathGameUsers', JSON.stringify(users));
            
            // Also save a sync queue for later admin sync
            const syncQueue = JSON.parse(localStorage.getItem('mathGameSyncQueue') || '[]');
            syncQueue.push({
                action: 'save',
                data: userData,
                timestamp: new Date().toISOString()
            });
            localStorage.setItem('mathGameSyncQueue', JSON.stringify(syncQueue));
            
            return true;
        } catch (error) {
            console.error('Error saving user:', error);
            return false;
        }
    }

    // Get specific user by username
    async getUser(username) {
        const users = await this.getAllUsers();
        return users.find(user => user.username === username);
    }

    // Sync with Google Sheets (read-only) and merge with local data
    async syncData() {
        try {
            const sheetUsers = await this.getAllUsers();
            const localUsers = JSON.parse(localStorage.getItem('mathGameUsers') || '[]');
            
            // Create a map for faster lookup
            const sheetUsersMap = new Map(sheetUsers.map(u => [u.username, u]));
            const mergedUsersMap = new Map(sheetUsersMap);
            
            // Add or update with local users
            localUsers.forEach(localUser => {
                const sheetUser = sheetUsersMap.get(localUser.username);
                if (!sheetUser || this.isLocalUserNewer(localUser, sheetUser)) {
                    mergedUsersMap.set(localUser.username, localUser);
                }
            });
            
            const mergedUsers = Array.from(mergedUsersMap.values());
            localStorage.setItem('mathGameUsers', JSON.stringify(mergedUsers));
            
            return mergedUsers;
        } catch (error) {
            console.error('Error syncing data:', error);
            return JSON.parse(localStorage.getItem('mathGameUsers') || '[]');
        }
    }

    // Check if local user data is newer
    isLocalUserNewer(localUser, sheetUser) {
        // Compare last played dates
        const localDate = new Date(localUser.stats.lastPlayed || 0);
        const sheetDate = new Date(sheetUser.stats.lastPlayed || 0);
        return localDate > sheetDate;
    }

    // Get leaderboard data
    async getLeaderboard(grade = null) {
        const users = await this.syncData(); // Sync first
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

    // Admin function to get sync queue (for manual sync later)
    getSyncQueue() {
        return JSON.parse(localStorage.getItem('mathGameSyncQueue') || '[]');
    }

    // Clear sync queue after successful admin sync
    clearSyncQueue() {
        localStorage.setItem('mathGameSyncQueue', '[]');
    }
}

// Export for use in game
window.SimpleGoogleSheetsDB = SimpleGoogleSheetsDB;
