// Backend API Integration for Math Game
// Replace BACKEND_URL with your actual Render backend URL
const BACKEND_URL = 'https://mathgame-backend.onrender.com';

class BackendAPI {
    constructor() {
        this.token = localStorage.getItem('authToken');
    }

    // Register new user
    async register(username, password, grade, schoolName) {
        try {
            const response = await fetch(`${BACKEND_URL}/api/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    password,
                    grade,
                    schoolName
                })
            });

            const data = await response.json();
            
            if (data.success) {
                this.token = data.token;
                localStorage.setItem('authToken', data.token);
                return { success: true, user: data.user };
            } else {
                return { success: false, error: data.error };
            }
        } catch (error) {
            console.error('Registration error:', error);
            return { success: false, error: 'Network error' };
        }
    }

    // Login user
    async login(username, password) {
        try {
            const response = await fetch(`${BACKEND_URL}/api/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    password
                })
            });

            const data = await response.json();
            
            if (data.success) {
                this.token = data.token;
                localStorage.setItem('authToken', data.token);
                return { success: true, user: data.user };
            } else {
                return { success: false, error: data.error };
            }
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, error: 'Network error' };
        }
    }

    // Update user stats
    async updateStats(username, stats) {
        try {
            const response = await fetch(`${BACKEND_URL}/api/stats/update`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                },
                body: JSON.stringify({
                    username,
                    stats
                })
            });

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Stats update error:', error);
            return { success: false, error: 'Network error' };
        }
    }

    // Get leaderboard
    async getLeaderboard(grade = null) {
        try {
            const url = grade 
                ? `${BACKEND_URL}/api/leaderboard/${grade}`
                : `${BACKEND_URL}/api/leaderboard`;
                
            const response = await fetch(url);
            const data = await response.json();
            
            if (data.success) {
                return data.leaderboard;
            } else {
                return [];
            }
        } catch (error) {
            console.error('Leaderboard error:', error);
            return [];
        }
    }

    // Get all users (for compatibility)
    async getAllUsers() {
        try {
            const response = await fetch(`${BACKEND_URL}/api/users`);
            const data = await response.json();
            return data.users || [];
        } catch (error) {
            console.error('Get users error:', error);
            return [];
        }
    }
}

// Create global instance
const backendAPI = new BackendAPI();

// Integration functions to match existing code
async function saveUserToBackend(userData) {
    if (!userData.username || !userData.password) {
        return { success: false, error: 'Username and password required' };
    }

    // Check if it's a new user or existing user
    const existingUsers = await backendAPI.getAllUsers();
    const existingUser = existingUsers.find(u => u.username === userData.username);

    if (!existingUser) {
        // Register new user
        return await backendAPI.register(
            userData.username,
            userData.password,
            userData.grade,
            userData.schoolName
        );
    } else {
        // Update existing user stats
        return await backendAPI.updateStats(userData.username, userData.stats);
    }
}

async function loadUsersFromBackend() {
    return await backendAPI.getAllUsers();
}

// Make functions available globally
window.backendAPI = backendAPI;
window.saveUserToBackend = saveUserToBackend;
window.loadUsersFromBackend = loadUsersFromBackend;

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { backendAPI, saveUserToBackend, loadUsersFromBackend };
}
