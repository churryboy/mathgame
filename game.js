class MathMonsterGame {
    constructor() {
        this.monsterSystem = new MonsterAnimationSystem();
        this.currentStage = 1;
        this.score = 0;
        this.currentQuestion = null;
        this.currentAnswer = null;
        this.monsterHP = this.getMonsterHPForStage(1);
        this.maxMonsterHP = this.getMonsterHPForStage(1);
        this.playerHP = 100;
        this.maxPlayerHP = 100;
        this.isTeamPlay = false;
        this.teamMembers = [];
        this.roomCode = null;
        this.selectedGrade = 1;
        this.currentUser = null;
        this.isGuest = false;
        this.gameInProgress = false;
        this.comboCount = 0;
        this.maxCombo = 10;
        
        this.tierSystem = {
            tiers: [
                { name: '챌린저', percentage: 0.1, icon: '👑', class: 'tier-challenger' },
                { name: '그랜드 마스터', percentage: 1.0, icon: '💎', class: 'tier-grandmaster' },
                { name: '마스터', percentage: 5.0, icon: '⚡', class: 'tier-master' },
                { name: '다이어몬드', percentage: 10.0, icon: '💠', class: 'tier-diamond' },
                { name: '골드', percentage: 15.0, icon: '🥇', class: 'tier-gold' },
                { name: '실버', percentage: 30.0, icon: '🥈', class: 'tier-silver' },
                { name: '브론즈', percentage: 100.0, icon: '🥉', class: 'tier-bronze' }
            ]
        };
        
        this.monsters = [
            { 
                name: '수학 고블린', 
                color: '#ff6b6b', 
                difficulty: 1,
                imageUrl: './images/math_goblin.png', // Add this when you have the image
                correctComments: ['아니야! 이럴 수가!', '운이 좋았네...', '흥! 다음은 안 될 거야!'],
                wrongComments: ['하하! 너무 쉬워!', '그것도 몰라?', '공부 좀 더 해와!']
            },
            { 
                name: '숫자 오우거', 
                color: '#4ecdc4', 
                difficulty: 2,
                correctComments: ['으아악! 내 약점을!', '운이 좋은 걸!', '다음엔 틀릴 거야!'],
                wrongComments: ['크크크! 멍청이!', '숫자도 못 세는구나!', '내가 이기고 있다!']
            },
            { 
                name: '계산 트롤', 
                color: '#45b7d1', 
                difficulty: 3,
                correctComments: ['이런! 계산을 제대로 했네!', '날 속일 줄 알았어?', '아직 끝나지 않았다!'],
                wrongComments: ['트롤롤롤! 계산 실수!', '머리가 나쁘구나!', '나를 이길 수 없어!']
            },
            { 
                name: '산수 드래곤', 
                color: '#96ceb4', 
                difficulty: 4,
                correctComments: ['그로오오! 제법이군!', '내 불꽃을 피했네!', '하지만 아직 살아있다!'],
                wrongComments: ['크와아앙! 바보같은 인간!', '내 화염에 타버려라!', '드래곤의 지혜를 모르는구나!']
            },
            { 
                name: '나눗셈 악마', 
                color: '#dfe6e9', 
                difficulty: 5,
                correctComments: ['악! 나눗셈의 힘이!', '이런 악운이!', '아직 내겐 더 많은 힘이!'],
                wrongComments: ['크하하! 분수를 몰라!', '나눗셈은 나의 특기!', '지옥으로 가거라!']
            },
            { 
                name: '분수 불사조', 
                color: '#fdcb6e', 
                difficulty: 6,
                correctComments: ['끼야아! 분수의 비밀을!', '재생할 시간을 줘!', '불사조는 죽지 않는다!'],
                wrongComments: ['분수가 뭔지도 몰라!', '내 날개에 태워버리겠다!', '분모와 분자를 구별 못해!']
            },
            { 
                name: '대수 스핑크스', 
                color: '#e17055', 
                difficulty: 7,
                correctComments: ['놀랍다... 수수께끼를 풀었군', '지혜로운 자여...', '하지만 더 어려운 문제가 있다'],
                wrongComments: ['수수께끼를 못 풀겠나?', '대수의 비밀을 모르는군', '스핑크스의 저주를 받아라!']
            },
            { 
                name: '기하학 거인', 
                color: '#0984e3', 
                difficulty: 8,
                correctComments: ['거대한 실수였다!', '각도를 정확히 계산했군!', '거인도 때론 틀린다...'],
                wrongComments: ['거인의 힘을 봐라!', '도형을 이해 못하는구나!', '각도 계산도 못해!']
            },
            { 
                name: '미적분 히드라', 
                color: '#6c5ce7', 
                difficulty: 9,
                correctComments: ['내 머리 하나가...!', '미분을 완벽히!', '하지만 난 여러 머리가 있다!'],
                wrongComments: ['히드라의 복잡함을 모르는군!', '적분? 그게 뭔가?', '수학의 깊이를 몰라!']
            },
            { 
                name: '수학 대마왕', 
                color: '#2d3436', 
                difficulty: 10,
                correctComments: ['크윽... 완벽한 계산이군!', '내 마법이 통하지 않다니!', '마지막 힘을 보여주겠다!'],
                wrongComments: ['크하하하! 최종 보스의 위엄!', '수학의 모든 영역을 아는가?', '네 한계가 여기까지군!']
            }
        ];
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.checkLoginStatus();
    }
    
    initializeMonsterDisplay() {
        const monsterContainer = document.getElementById('monster-display');
        if (monsterContainer) {
            this.monsterSystem.initializeMonster('monster-display', this.currentStage);
        }
    }

    handleCorrectAnswer() {
        this.monsterSystem.onCorrectAnswer();
        this.advanceStage();
    }

    handleWrongAnswer() {
        this.monsterSystem.onWrongAnswer();
        this.playerHP -= 10;
        // Update player HP display logic
        if (this.playerHP <= 0) {
            this.endGame('lose');
        }
    }

    advanceStage() {
        this.currentStage++;
        if (this.currentStage % 3 === 0) { // Example: evolve every 3 stages
            this.monsterSystem.onLevelUp(this.currentStage);
        }
    }

    endGame(result) {
        if (result === 'win') {
            alert('You defeated the final boss!');
        } else {
            alert('Game Over! Try again.');
        }
        // Reset or redirect logic
    }

    checkLoginStatus() {
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
            this.showDashboard();
            this.initializeMonsterDisplay();
        }
    }
    
    showLoginScreen() {
        document.getElementById('login-screen').classList.remove('hidden');
        document.getElementById('user-dashboard').classList.add('hidden');
        document.getElementById('grade-selection').classList.add('hidden');
        document.getElementById('game-header').classList.add('hidden');
        document.getElementById('battle-area').classList.add('hidden');
        document.getElementById('input-area').classList.add('hidden');
    }
    
    showDashboard() {
        document.getElementById('login-screen').classList.add('hidden');
        document.getElementById('user-dashboard').classList.remove('hidden');
        document.getElementById('grade-selection').classList.add('hidden');
        document.getElementById('game-header').classList.add('hidden');
        document.getElementById('battle-area').classList.add('hidden');
        document.getElementById('input-area').classList.add('hidden');
        
        this.updateDashboard();
    }
    
    updateDashboard() {
        if (!this.currentUser) return;
        
        document.getElementById('welcome-user').textContent = this.currentUser.username;
        
        // Show grade-specific stats based on user's current grade setting
        this.loadGradeSpecificStats();
        
        // Force recalculation of all user tiers FIRST to ensure current data
        const allUsers = JSON.parse(localStorage.getItem('mathGameUsers') || '[]');
        this.recalculateAllUserTiers(allUsers);
        
        // Update tier information (after recalculation)
        this.updateUserTier();
        this.updateTierDisplay();
        this.loadGlobalStats();
        
        // Load user's tier per grade
        this.loadMyTiers();
        
        // Update current grade display
        const currentGradeDisplay = document.getElementById('current-grade-display');
        if (currentGradeDisplay) {
            currentGradeDisplay.textContent = this.getGradeText(this.currentUser.grade.toString());
        }
        
        // Update grade change dropdown
        const gradeChangeSelect = document.getElementById('grade-change-select');
        if (gradeChangeSelect) {
            gradeChangeSelect.value = this.currentUser.grade.toString();
        }
        
        // Load leaderboard for current grade
        this.loadLeaderboard();
    }
    
    loadGradeSpecificStats() {
        const currentGrade = this.currentUser.grade.toString();
        let gradeData = null;
        
        if (this.currentUser.stats.gradeHistory && this.currentUser.stats.gradeHistory[currentGrade]) {
            gradeData = this.currentUser.stats.gradeHistory[currentGrade];
        }
        
        // If no data for current grade, show zeros
        if (!gradeData) {
            document.getElementById('best-score').textContent = '0';
            document.getElementById('best-stage').textContent = '1';
            document.getElementById('play-count').textContent = '0';
            document.getElementById('accuracy-rate').textContent = '0%';
        } else {
            document.getElementById('best-score').textContent = gradeData.bestScore;
            document.getElementById('best-stage').textContent = gradeData.bestStage;
            document.getElementById('play-count').textContent = gradeData.playCount;
            
            const accuracy = gradeData.totalAnswers > 0 ? 
                Math.round((gradeData.correctAnswers / gradeData.totalAnswers) * 100) : 0;
            document.getElementById('accuracy-rate').textContent = accuracy + '%';
        }
        
        // Update grade rank for current grade
        this.updateGradeRank();
    }
    
    updateGradeRank() {
        const currentGrade = this.currentUser.grade;
        const allUsers = JSON.parse(localStorage.getItem('mathGameUsers') || '[]');
        const gradeScores = [];
        
        allUsers.forEach(user => {
            if (user.stats.gradeHistory && user.stats.gradeHistory[currentGrade.toString()]) {
                gradeScores.push({
                    username: user.username,
                    bestScore: user.stats.gradeHistory[currentGrade.toString()].bestScore
                });
            }
        });
        
        if (gradeScores.length === 0) {
            document.getElementById('grade-rank').textContent = '-';
            return;
        }
        
        gradeScores.sort((a, b) => b.bestScore - a.bestScore);
        const userRank = gradeScores.findIndex(user => user.username === this.currentUser.username) + 1;
        
        document.getElementById('grade-rank').textContent = userRank > 0 ? `${userRank}위` : '-';
    }
    
    
    setupEventListeners() {
        // Auth event listeners
        document.getElementById('login-tab').addEventListener('click', () => this.switchTab('login'));
        document.getElementById('signup-tab').addEventListener('click', () => this.switchTab('signup'));
        document.getElementById('login-btn').addEventListener('click', () => this.login());
        document.getElementById('signup-btn').addEventListener('click', () => this.signup());
        document.getElementById('guest-btn').addEventListener('click', () => this.loginAsGuest());
        document.getElementById('logout-btn').addEventListener('click', () => this.logout());
        
        // Dashboard event listeners
        document.getElementById('new-game-btn').addEventListener('click', () => this.startNewGame());
        document.getElementById('grade-change-select').addEventListener('change', (e) => this.changeGrade(parseInt(e.target.value)));
        
        // Game event listeners
        const startGameBtn = document.getElementById('start-game-btn');
        const teamToggleBtn = document.getElementById('team-toggle-btn');
        const createRoomBtn = document.getElementById('create-room');
        const joinRoomBtn = document.getElementById('join-room');
        const playAgainBtn = document.getElementById('play-again');
        const pauseGameBtn = document.getElementById('pause-game-btn');
        
        startGameBtn.addEventListener('click', () => this.startGame());
        
        // Setup multiple choice listeners
        this.setupChoiceListeners();
        
        // Setup text input listeners
        this.setupTextInputListeners();
        
        teamToggleBtn.addEventListener('click', () => this.toggleTeamPanel());
        createRoomBtn.addEventListener('click', () => this.createRoom());
        joinRoomBtn.addEventListener('click', () => this.joinRoom());
        playAgainBtn.addEventListener('click', () => this.resetGame());
        pauseGameBtn.addEventListener('click', () => this.pauseGame());
        
        // Enter key listeners for auth forms
        document.getElementById('login-password').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.login();
        });
        document.getElementById('signup-confirm').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.signup();
        });
    }
    
    switchTab(tab) {
        if (tab === 'login') {
            document.getElementById('login-tab').classList.add('active');
            document.getElementById('signup-tab').classList.remove('active');
            document.getElementById('login-form').classList.remove('hidden');
            document.getElementById('signup-form').classList.add('hidden');
        } else {
            document.getElementById('signup-tab').classList.add('active');
            document.getElementById('login-tab').classList.remove('active');
            document.getElementById('signup-form').classList.remove('hidden');
            document.getElementById('login-form').classList.add('hidden');
        }
    }
    
    login() {
        const username = document.getElementById('login-username').value.trim();
        const password = document.getElementById('login-password').value;
        
        if (!username || !password) {
            alert('사용자 이름과 비밀번호를 입력해주세요.');
            return;
        }
        
        const users = JSON.parse(localStorage.getItem('mathGameUsers') || '[]');
        const user = users.find(u => u.username === username && u.password === password);
        
        if (user) {
            this.currentUser = user;
            this.isGuest = false;
            localStorage.setItem('currentUser', JSON.stringify(user));
            
            // Track login in Mixpanel
            if (typeof tracker !== 'undefined') {
                tracker.trackLogin(username);
            }
            
            this.showDashboard();
        } else {
            alert('사용자 이름 또는 비밀번호가 올바르지 않습니다.');
        }
    }
    
    signup() {
        const username = document.getElementById('signup-username').value.trim();
        const password = document.getElementById('signup-password').value;
        const confirmPassword = document.getElementById('signup-confirm').value;
        const grade = document.getElementById('signup-grade').value;
        const schoolName = document.getElementById('signup-school').value.trim();
        
        if (!username || !password || !confirmPassword || !grade || !schoolName) {
            alert('모든 필드를 입력해주세요.');
            return;
        }
        
        if (password !== confirmPassword) {
            alert('비밀번호가 일치하지 않습니다.');
            return;
        }
        
        if (username.length < 2) {
            alert('사용자 이름은 2글자 이상이어야 합니다.');
            return;
        }
        
        const users = JSON.parse(localStorage.getItem('mathGameUsers') || '[]');
        if (users.find(u => u.username === username)) {
            alert('이미 존재하는 사용자 이름입니다.');
            return;
        }
        
        const newUser = {
            username,
            password,
            grade: parseInt(grade),
            schoolName,
            stats: {
                bestScore: 0,
                bestStage: 1,
                playCount: 0,
                correctAnswers: 0,
                totalAnswers: 0,
                tier: '브론즈',
                gradeRank: 0,
                gradeHistory: {}  // Track performance per grade
            },
            createdAt: new Date().toISOString()
        };
        
        users.push(newUser);
        localStorage.setItem('mathGameUsers', JSON.stringify(users));
        
        // Track signup in Mixpanel
        if (typeof tracker !== 'undefined') {
            tracker.trackSignup(username, parseInt(grade), schoolName);
        }
        
        // Save to backend if available
        if (typeof saveUserToBackend !== 'undefined') {
            saveUserToBackend(newUser);
        }
        
        this.currentUser = newUser;
        this.isGuest = false;
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        this.showDashboard();
    }
    
    loginAsGuest() {
        this.currentUser = {
            username: '게스트' + Math.floor(Math.random() * 1000),
            grade: 1,
            stats: {
                bestScore: 0,
                bestStage: 1,
                playCount: 0,
                correctAnswers: 0,
                totalAnswers: 0,
                tier: '브론즈',
                gradeRank: 0,
                gradeHistory: {}  // Track performance per grade
            }
        };
        this.isGuest = true;
        this.showGradeSelection();
    }
    
    logout() {
        localStorage.removeItem('currentUser');
        this.currentUser = null;
        this.isGuest = false;
        this.gameInProgress = false;
        this.showLoginScreen();
    }
    
    startNewGame() {
        this.selectedGrade = this.currentUser.grade;
        this.resetGameState();
        // Skip grade selection and start game directly
        this.showGameScreen();
        this.playerHP = this.maxPlayerHP;
        this.updatePlayerHealth();
        this.generateQuestion();
        this.updateMonster();
        this.gameInProgress = true;
    }
    
    
    changeGrade(newGrade) {
        if (!this.currentUser || this.isGuest) return;
        
        // Update user's grade
        this.currentUser.grade = newGrade;
        
        // Save to localStorage
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        
        // Update the user in the users array
        const users = JSON.parse(localStorage.getItem('mathGameUsers') || '[]');
        const userIndex = users.findIndex(u => u.username === this.currentUser.username);
        if (userIndex !== -1) {
            users[userIndex].grade = newGrade;
            localStorage.setItem('mathGameUsers', JSON.stringify(users));
        }
        
        // Refresh dashboard to show new grade data
        this.updateDashboard();
    }

    showGradeSelection() {
        document.getElementById('user-dashboard').classList.add('hidden');
        document.getElementById('grade-selection').classList.remove('hidden');
        document.getElementById('grade-select').value = this.currentUser.grade;
    }
    
    showGameScreen() {
        document.getElementById('grade-selection').classList.add('hidden');
        document.getElementById('user-dashboard').classList.add('hidden');
        document.getElementById('game-header').classList.remove('hidden');
        document.getElementById('battle-area').classList.remove('hidden');
        document.getElementById('input-area').classList.remove('hidden');
        
        document.getElementById('current-user').textContent = this.currentUser.username;
        document.getElementById('current-grade').textContent = this.getGradeText(this.selectedGrade.toString());
        
        // Show grade-specific tier
        const gradeKey = this.selectedGrade.toString();
        if (this.currentUser.stats.gradeHistory && 
            this.currentUser.stats.gradeHistory[gradeKey] && 
            this.currentUser.stats.gradeHistory[gradeKey].playCount > 0) {
            const gradeTier = this.calculateGradeTier(this.selectedGrade, 
                this.currentUser.stats.gradeHistory[gradeKey].bestScore, 
                this.currentUser.username);
            const tierData = this.tierSystem.tiers.find(t => t.name === gradeTier);
            if (tierData) {
                document.getElementById('game-tier').textContent = tierData.name;
                document.getElementById('game-tier').className = `tier-indicator ${tierData.class}`;
            } else {
                document.getElementById('game-tier').textContent = '티어 없음';
                document.getElementById('game-tier').className = 'tier-indicator tier-none';
            }
        } else {
            document.getElementById('game-tier').textContent = '티어 없음';
            document.getElementById('game-tier').className = 'tier-indicator tier-none';
        }
    }
    
    resetGameState() {
        this.currentStage = 1;
        this.score = 0;
        this.monsterHP = this.getMonsterHPForStage(1);
        this.maxMonsterHP = this.getMonsterHPForStage(1);
        this.playerHP = this.maxPlayerHP;
        this.gameInProgress = false;
        this.comboCount = 0;
        document.getElementById('score').textContent = '0';
    }
    
    getMonsterHPForStage(stage) {
        if (stage <= 2) return 1;
        if (stage <= 5) return 3;
        if (stage <= 7) return 4;
        if (stage <= 9) return 5;
        if (stage === 10) return 7;
        return 3; // fallback
    }
    
    startGame() {
        const gradeSelect = document.getElementById('grade-select');
        this.selectedGrade = parseInt(gradeSelect.value);
        
        if (!this.isGuest) {
            this.currentUser.grade = this.selectedGrade;
            this.saveUserData();
        }
        
        this.showGameScreen();
        this.playerHP = this.maxPlayerHP;
        this.updatePlayerHealth();
        this.generateQuestion();
        this.updateMonster();
        this.gameInProgress = true;
        
        // Track game start in Mixpanel
        if (typeof tracker !== 'undefined' && this.currentUser) {
            tracker.trackGameStart(this.currentUser.username, this.selectedGrade);
        }
    }
    
    pauseGame() {
        if (this.gameInProgress) {
            // Ending game via pause button - update play count
            this.updatePlayCountOnGameEnd();
            // Save current score as best score when quitting
            this.saveCurrentScoreAsBest();
            // Clear game progress
            this.gameInProgress = false;
            this.clearGameProgress();
            this.showDashboard();
        }
    }
    
    updatePlayCountOnGameEnd() {
        if (!this.currentUser || this.isGuest) return;
        
        // Update global play count
        this.currentUser.stats.playCount++;
        
        // Update grade-specific play count
        const gradeKey = this.selectedGrade.toString();
        if (!this.currentUser.stats.gradeHistory[gradeKey]) {
            this.currentUser.stats.gradeHistory[gradeKey] = {
                bestScore: 0,
                bestStage: 1,
                correctAnswers: 0,
                totalAnswers: 0,
                playCount: 0
            };
        }
        
        this.currentUser.stats.gradeHistory[gradeKey].playCount++;
        
        // Update tier after play count increase
        this.updateUserTier();
        
        // Save user data
        this.saveUserData();
    }
    
    saveCurrentScoreAsBest() {
        if (!this.currentUser || this.isGuest) return;
        
        // Update global best score if current score is higher
        if (this.score > this.currentUser.stats.bestScore) {
            this.currentUser.stats.bestScore = this.score;
        }
        
        // Update grade-specific best score
        const gradeKey = this.selectedGrade.toString();
        if (!this.currentUser.stats.gradeHistory[gradeKey]) {
            this.currentUser.stats.gradeHistory[gradeKey] = {
                bestScore: 0,
                bestStage: 1,
                correctAnswers: 0,
                totalAnswers: 0,
                playCount: 0
            };
        }
        
        const gradeData = this.currentUser.stats.gradeHistory[gradeKey];
        if (this.score > gradeData.bestScore) {
            gradeData.bestScore = this.score;
        }
        
        // Save the user data
        this.saveUserData();
    }
    
    // No game progress saving - always start fresh
    
    saveUserData() {
        if (!this.currentUser || this.isGuest) return;
        
        const users = JSON.parse(localStorage.getItem('mathGameUsers') || '[]');
        const userIndex = users.findIndex(u => u.username === this.currentUser.username);
        
        if (userIndex !== -1) {
            users[userIndex] = this.currentUser;
            localStorage.setItem('mathGameUsers', JSON.stringify(users));
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        }
    }
    
    updateUserStats(isCorrect) {
        if (!this.currentUser) return;
        
        this.currentUser.stats.totalAnswers++;
        if (isCorrect) {
            this.currentUser.stats.correctAnswers++;
        }
        
        if (this.score > this.currentUser.stats.bestScore) {
            this.currentUser.stats.bestScore = this.score;
        }
        
        if (this.currentStage > this.currentUser.stats.bestStage) {
            this.currentUser.stats.bestStage = this.currentStage;
        }
        
        // Update grade-specific stats
        this.updateGradeHistory(isCorrect);
        
        // Update last played timestamp
        this.currentUser.stats.lastPlayed = new Date().toISOString();
        
        this.saveUserData();
    }
    
    updateGradeHistory(isCorrect) {
        if (!this.currentUser.stats.gradeHistory) {
            this.currentUser.stats.gradeHistory = {};
        }
        
        const gradeKey = this.selectedGrade.toString();
        if (!this.currentUser.stats.gradeHistory[gradeKey]) {
            this.currentUser.stats.gradeHistory[gradeKey] = {
                bestScore: 0,
                bestStage: 1,
                correctAnswers: 0,
                totalAnswers: 0,
                playCount: 0
            };
        }
        
        const gradeData = this.currentUser.stats.gradeHistory[gradeKey];
        gradeData.totalAnswers++;
        if (isCorrect) {
            gradeData.correctAnswers++;
        }
        
        if (this.score > gradeData.bestScore) {
            gradeData.bestScore = this.score;
        }
        
        if (this.currentStage > gradeData.bestStage) {
            gradeData.bestStage = this.currentStage;
        }
        
        // Add points to grade-specific tier score
        const basePoints = this.currentStage * 10;
        const difficultyMultiplier = this.selectedGrade / 6;
        const healthBonus = this.playerHP / 20;
        
        // Scoring now handled only by the main game score system
    }

    generateQuestion() {
        const stage = this.currentStage;
        let options = [];

        if (this.selectedGrade === 12) {
            options = this.generateGrade12Question(stage);
        } else if (this.selectedGrade === 11) {
            options = this.generateGrade11Question(stage);
        } else if (this.selectedGrade === 10) {
            options = this.generateGrade10Question(stage);
        } else if (this.selectedGrade === 7) {
            options = this.generateGrade7Question(stage);
        } else if (this.selectedGrade === 8) {
            options = this.generateGrade8Question(stage);
        } else if (this.selectedGrade === 9) {
            options = this.generateGrade9Question(stage);
        } else {
            options = this.generateStandardQuestion(stage);
        }

        document.getElementById('math-question').textContent = this.currentQuestion;

        const inputType = this.getInputType(); // Determine input type

        if (inputType === 'multiple-choice') {
            // Show multiple choice buttons
            document.getElementById('multiple-choice-container').classList.remove('hidden');
            document.getElementById('text-input-container').classList.add('hidden');
            options = this.shuffleArray(options);
            document.getElementById('choice-1').textContent = options[0];
            document.getElementById('choice-2').textContent = options[1];
            document.getElementById('choice-3').textContent = options[2];
            
            // Enable choice buttons
            this.enableChoiceButtons();
        } else {
            // Show text input
            document.getElementById('multiple-choice-container').classList.add('hidden');
            document.getElementById('text-input-container').classList.remove('hidden');
            
            // Clear and focus text input
            const textInput = document.getElementById('text-answer-input');
            textInput.value = '';
            textInput.focus();
        }
    }
    
    getInputType() {
        // Use multiple choice for all grades
        return 'multiple-choice';
    }
    
    enableChoiceButtons() {
        ['choice-1', 'choice-2', 'choice-3'].forEach(choiceId => {
            const btn = document.getElementById(choiceId);
            btn.classList.remove('disabled');
            btn.disabled = false;
        });
    }
    
    disableChoiceButtons() {
        ['choice-1', 'choice-2', 'choice-3'].forEach(choiceId => {
            const btn = document.getElementById(choiceId);
            btn.classList.add('disabled');
            btn.disabled = true;
        });
    }
    
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    
    generateGrade10Question(stage) {
        let answer;
        
        switch(stage) {
            case 1:
            case 2:
                const setProblems = [
                    () => {
                        const a = Math.floor(Math.random() * 5) + 3;
                        const b = Math.floor(Math.random() * 5) + 2;
                        answer = a + b;
                        return `A = {1,2,...,${a}}, B = {1,2,...,${b}}일 때, |A∪B| = ?`;
                    },
                    () => {
                        const n = Math.floor(Math.random() * 5) + 5;
                        answer = Math.pow(2, n);
                        return `원소가 ${n}개인 집합의 부분집합 개수 = ?`;
                    }
                ];
                this.currentQuestion = setProblems[Math.floor(Math.random() * setProblems.length)]();
                break;
                
            case 3:
            case 4:
                const functionProblems = [
                    () => {
                        const a = Math.floor(Math.random() * 5) + 1;
                        const b = Math.floor(Math.random() * 10) + 1;
                        answer = a * 2 + b;
                        return `f(x) = ${a}x + ${b}일 때, f(2) = ?`;
                    },
                    () => {
                        const a = Math.floor(Math.random() * 5) + 2;
                        answer = 1 / a;
                        return `f(x) = ${a}x의 역함수 f⁻¹(1) = ?`;
                    }
                ];
                this.currentQuestion = functionProblems[Math.floor(Math.random() * functionProblems.length)]();
                break;
                
            case 5:
            case 6:
                const expLogProblems = [
                    () => {
                        const n = Math.floor(Math.random() * 4) + 2;
                        answer = Math.pow(2, n);
                        return `2^${n} = ?`;
                    },
                    () => {
                        const n = Math.floor(Math.random() * 3) + 2;
                        answer = n;
                        return `log₂(${Math.pow(2, n)}) = ?`;
                    },
                    () => {
                        answer = 1;
                        return `log₁₀(10) = ?`;
                    }
                ];
                this.currentQuestion = expLogProblems[Math.floor(Math.random() * expLogProblems.length)]();
                break;
                
            case 7:
            case 8:
                const sequenceProblems = [
                    () => {
                        const a = Math.floor(Math.random() * 5) + 1;
                        const d = Math.floor(Math.random() * 3) + 1;
                        answer = a + 4 * d;
                        return `등차수열 ${a}, ${a+d}, ${a+2*d}, ...의 제5항 = ?`;
                    },
                    () => {
                        const a = Math.floor(Math.random() * 3) + 2;
                        answer = a * Math.pow(2, 4);
                        return `등비수열 ${a}, ${2*a}, ${4*a}, ...의 제5항 = ?`;
                    }
                ];
                this.currentQuestion = sequenceProblems[Math.floor(Math.random() * sequenceProblems.length)]();
                break;
                
            case 9:
            case 10:
                const trigProblems = [
                    () => {
                        answer = 0;
                        return `sin(0°) = ?`;
                    },
                    () => {
                        answer = -1;
                        return `cos(180°) = ?`;
                    },
                    () => {
                        answer = 1;
                        return `sin²θ + cos²θ = ?`;
                    }
                ];
                this.currentQuestion = trigProblems[Math.floor(Math.random() * trigProblems.length)]();
                break;
        }
        
        this.currentAnswer = answer;
        
        // Generate multiple choice options
        const options = [answer];
        while (options.length < 3) {
            let fakeAnswer;
            if (typeof answer === 'number') {
                // For numeric answers
                const variation = Math.floor(Math.random() * 5) + 1;
                const operation = Math.random() < 0.5 ? 1 : -1;
                fakeAnswer = answer + (variation * operation);
                // Ensure fake answer is positive for most cases
                if (fakeAnswer < 0 && answer >= 0) {
                    fakeAnswer = answer + variation;
                }
            } else {
                // For non-numeric answers, generate similar values
                fakeAnswer = answer + (Math.random() < 0.5 ? 0.1 : -0.1);
            }
            
            if (!options.includes(fakeAnswer)) {
                options.push(fakeAnswer);
            }
        }
        
        return options;
    }
    
    generateGrade11Question(stage) {
        let answer;
        
        switch(stage) {
            case 1:
            case 2:
                const limitSeqProblems = [
                    () => {
                        answer = 0;
                        return `lim[n→∞] (1/n) = ?`;
                    },
                    () => {
                        const a = Math.floor(Math.random() * 3) + 2;
                        answer = 1/a;
                        return `lim[n→∞] (n/(${a}n)) = ?`;
                    }
                ];
                this.currentQuestion = limitSeqProblems[Math.floor(Math.random() * limitSeqProblems.length)]();
                break;
                
            case 3:
            case 4:
                const limitFuncProblems = [
                    () => {
                        const a = Math.floor(Math.random() * 5) + 1;
                        answer = 2 * a;
                        return `lim[x→${a}] (2x) = ?`;
                    },
                    () => {
                        const a = Math.floor(Math.random() * 3) + 1;
                        answer = a * a;
                        return `lim[x→${a}] (x²) = ?`;
                    }
                ];
                this.currentQuestion = limitFuncProblems[Math.floor(Math.random() * limitFuncProblems.length)]();
                break;
                
            case 5:
            case 6:
                const derivativeProblems = [
                    () => {
                        const n = Math.floor(Math.random() * 4) + 2;
                        answer = n;
                        return `f(x) = x^${n}일 때, f'(1) = ?`;
                    },
                    () => {
                        const a = Math.floor(Math.random() * 5) + 1;
                        answer = a;
                        return `f(x) = ${a}x + 3일 때, f'(x) = ?`;
                    }
                ];
                this.currentQuestion = derivativeProblems[Math.floor(Math.random() * derivativeProblems.length)]();
                break;
                
            case 7:
            case 8:
                const applicationProblems = [
                    () => {
                        answer = 0;
                        return `f(x) = x² - 2x에서 f'(1) = ?`;
                    },
                    () => {
                        answer = 3;
                        return `f(x) = x³의 x=1에서의 접선의 기울기 = ?`;
                    }
                ];
                this.currentQuestion = applicationProblems[Math.floor(Math.random() * applicationProblems.length)]();
                break;
                
            case 9:
            case 10:
                const integralProblems = [
                    () => {
                        answer = 1;
                        return `∫[0→1] 1 dx = ?`;
                    },
                    () => {
                        const a = Math.floor(Math.random() * 3) + 1;
                        answer = a * a / 2;
                        return `∫[0→${a}] x dx = ?`;
                    }
                ];
                this.currentQuestion = integralProblems[Math.floor(Math.random() * integralProblems.length)]();
                break;
        }
        
        this.currentAnswer = answer;
        
        // Generate multiple choice options for Grade 11
        const options = [answer];
        while (options.length < 3) {
            let fakeAnswer;
            if (typeof answer === 'number') {
                if (Math.abs(answer) < 1) {
                    // For small decimal answers
                    fakeAnswer = answer + (Math.random() < 0.5 ? 0.1 : -0.1);
                    fakeAnswer = Math.round(fakeAnswer * 100) / 100;
                } else {
                    // For larger answers
                    const variation = Math.floor(Math.random() * 3) + 1;
                    fakeAnswer = answer + (Math.random() < 0.5 ? variation : -variation);
                }
            }
            
            if (!options.includes(fakeAnswer) && fakeAnswer !== answer) {
                options.push(fakeAnswer);
            }
        }
        
        return options;
    }
    
    generateGrade12Question(stage) {
        let answer;
        
        switch(stage) {
            case 1:
            case 2:
                const calcProblems = [
                    () => {
                        const n = Math.floor(Math.random() * 5) + 2;
                        answer = n * Math.pow(2, n - 1);
                        return `f(x) = x^${n}일 때, f'(2) = ?`;
                    },
                    () => {
                        answer = Math.E;
                        return `d/dx[e^x]를 x=1에서 계산 = ? (e로 답)`;
                    }
                ];
                this.currentQuestion = calcProblems[Math.floor(Math.random() * calcProblems.length)]();
                break;
                
            case 3:
            case 4:
                const vectorProblems = [
                    () => {
                        const a = Math.floor(Math.random() * 5) + 1;
                        const b = Math.floor(Math.random() * 5) + 1;
                        answer = a + b;
                        return `벡터 u=(${a},0), v=(0,${b})일 때, |u+v|² = ?`;
                    },
                    () => {
                        const a = Math.floor(Math.random() * 3) + 1;
                        const b = Math.floor(Math.random() * 3) + 1;
                        answer = a * b;
                        return `벡터 (${a},0)과 (0,${b})의 내적 = ?`;
                    }
                ];
                this.currentQuestion = vectorProblems[Math.floor(Math.random() * vectorProblems.length)]();
                break;
                
            case 5:
            case 6:
                const matrixProblems = [
                    () => {
                        const a = Math.floor(Math.random() * 5) + 1;
                        const b = Math.floor(Math.random() * 5) + 1;
                        const c = Math.floor(Math.random() * 5) + 1;
                        const d = Math.floor(Math.random() * 5) + 1;
                        answer = a * d - b * c;
                        return `행렬식 |${a} ${b}; ${c} ${d}| = ?`;
                    },
                    () => {
                        const n = Math.floor(Math.random() * 3) + 2;
                        answer = n;
                        return `${n}×${n} 단위행렬의 대각합 = ?`;
                    }
                ];
                this.currentQuestion = matrixProblems[Math.floor(Math.random() * matrixProblems.length)]();
                break;
                
            case 7:
            case 8:
                const probabilityProblems = [
                    () => {
                        const n = Math.floor(Math.random() * 4) + 4;
                        const r = Math.floor(Math.random() * 2) + 2;
                        answer = factorial(n) / (factorial(r) * factorial(n - r));
                        return `C(${n},${r}) = ?`;
                    },
                    () => {
                        const n = Math.floor(Math.random() * 3) + 3;
                        answer = factorial(n);
                        return `P(${n},${n}) = ?`;
                    },
                    () => {
                        answer = 0.5;
                        return `정규분포 N(0,1)에서 P(X ≤ 0) = ?`;
                    }
                ];
                this.currentQuestion = probabilityProblems[Math.floor(Math.random() * probabilityProblems.length)]();
                break;
                
            case 9:
            case 10:
                const advancedCalcProblems = [
                    () => {
                        const k = Math.floor(Math.random() * 3) + 1;
                        answer = Math.exp(k) - 1;
                        return `∫[0→${k}] e^x dx = ? (정수로)`;
                    },
                    () => {
                        answer = Math.log(2);
                        return `∫[1→2] (1/x) dx = ? (ln(2)로 답)`;
                    },
                    () => {
                        const n = Math.floor(Math.random() * 3) + 2;
                        answer = 1 / n;
                        return `lim[x→∞] (${n}/x) = ?`;
                    }
                ];
                this.currentQuestion = advancedCalcProblems[Math.floor(Math.random() * advancedCalcProblems.length)]();
                break;
        }
        
        this.currentAnswer = answer;
        
        function factorial(n) {
            if (n <= 1) return 1;
            return n * factorial(n - 1);
        }
        
        // Generate multiple choice options for Grade 12
        const options = [answer];
        while (options.length < 3) {
            let fakeAnswer;
            if (typeof answer === 'number') {
                if (answer === Math.E || answer === Math.log(2)) {
                    // For special constants
                    const fakeConstants = [1, 2, 3, Math.PI, Math.E, Math.log(2), Math.log(10)];
                    fakeAnswer = fakeConstants[Math.floor(Math.random() * fakeConstants.length)];
                } else if (answer > 100) {
                    // For large numbers (like factorials)
                    fakeAnswer = answer + (Math.random() < 0.5 ? 50 : -50);
                } else {
                    // For regular numbers
                    const variation = Math.floor(Math.random() * 5) + 1;
                    fakeAnswer = answer + (Math.random() < 0.5 ? variation : -variation);
                }
            }
            
            if (!options.includes(fakeAnswer) && fakeAnswer !== answer && fakeAnswer > 0) {
                options.push(fakeAnswer);
            }
        }
        
        return options;
    }
    
    generateGrade7Question(stage) {
        let answer;
        
        switch(stage) {
            case 1:
            case 2:
                const variableProblems = [
                    () => {
                        const a = Math.floor(Math.random() * 5) + 2;
                        const b = Math.floor(Math.random() * 10) + 1;
                        answer = a + b;
                        return `x = ${a}일 때, x + ${b} = ?`;
                    },
                    () => {
                        const a = Math.floor(Math.random() * 5) + 1;
                        const b = Math.floor(Math.random() * 5) + 1;
                        answer = 2 * a + 3 * b;
                        return `a = ${a}, b = ${b}일 때, 2a + 3b = ?`;
                    }
                ];
                this.currentQuestion = variableProblems[Math.floor(Math.random() * variableProblems.length)]();
                break;
                
            case 3:
            case 4:
                const equationProblems = [
                    () => {
                        const a = Math.floor(Math.random() * 10) + 1;
                        const b = Math.floor(Math.random() * 20) + 1;
                        answer = b - a;
                        return `x + ${a} = ${b}일 때, x = ?`;
                    },
                    () => {
                        const a = Math.floor(Math.random() * 5) + 2;
                        const b = Math.floor(Math.random() * 30) + 10;
                        answer = b / a;
                        return `${a}x = ${b}일 때, x = ?`;
                    }
                ];
                this.currentQuestion = equationProblems[Math.floor(Math.random() * equationProblems.length)]();
                break;
                
            case 5:
            case 6:
                const inequalityProblems = [
                    () => {
                        const a = Math.floor(Math.random() * 10) + 1;
                        answer = a;
                        return `x > ${a - 1}를 만족하는 가장 작은 자연수 = ?`;
                    },
                    () => {
                        const a = Math.floor(Math.random() * 5) + 2;
                        const b = Math.floor(Math.random() * 20) + 10;
                        answer = Math.floor(b / a);
                        return `${a}x ≤ ${b}를 만족하는 가장 큰 정수 = ?`;
                    }
                ];
                this.currentQuestion = inequalityProblems[Math.floor(Math.random() * inequalityProblems.length)]();
                break;
                
            case 7:
            case 8:
                const functionProblems = [
                    () => {
                        const a = Math.floor(Math.random() * 5) + 1;
                        const b = Math.floor(Math.random() * 10) + 1;
                        const x = Math.floor(Math.random() * 5) + 1;
                        answer = a * x + b;
                        return `f(x) = ${a}x + ${b}일 때, f(${x}) = ?`;
                    },
                    () => {
                        const points = [[0, 3], [1, 5], [2, 7]];
                        answer = 2;
                        return `점 (0,3), (1,5), (2,7)을 지나는 함수 y = ax + b에서 a = ?`;
                    }
                ];
                this.currentQuestion = functionProblems[Math.floor(Math.random() * functionProblems.length)]();
                break;
                
            case 9:
            case 10:
                const geometryProblems = [
                    () => {
                        answer = 180;
                        return `삼각형의 내각의 합 = ?`;
                    },
                    () => {
                        const n = Math.floor(Math.random() * 3) + 5;
                        answer = (n - 2) * 180;
                        return `${n}각형의 내각의 합 = ?`;
                    },
                    () => {
                        const data = [2, 3, 3, 4, 5, 5, 5, 6, 7];
                        answer = 5;
                        return `자료 [2,3,3,4,5,5,5,6,7]의 최빈값 = ?`;
                    }
                ];
                this.currentQuestion = geometryProblems[Math.floor(Math.random() * geometryProblems.length)]();
                break;
        }
        
        this.currentAnswer = answer;
        
        // Generate multiple choice options for Grade 7
        const options = [answer];
        while (options.length < 3) {
            const variation = Math.floor(Math.random() * 5) + 1;
            const fakeAnswer = answer + (Math.random() < 0.5 ? variation : -variation);
            
            if (!options.includes(fakeAnswer)) {
                options.push(fakeAnswer);
            }
        }
        
        return options;
    }
    
    generateGrade8Question(stage) {
        let answer;
        
        switch(stage) {
            case 1:
            case 2:
                const polynomialProblems = [
                    () => {
                        const a = Math.floor(Math.random() * 5) + 1;
                        const b = Math.floor(Math.random() * 5) + 1;
                        answer = a + b;
                        return `(x + ${a}) + (x + ${b})에서 x의 계수 = ?`;
                    },
                    () => {
                        const a = Math.floor(Math.random() * 5) + 1;
                        const b = Math.floor(Math.random() * 5) + 1;
                        answer = a * b;
                        return `(x + ${a})(x + ${b})에서 상수항 = ?`;
                    }
                ];
                this.currentQuestion = polynomialProblems[Math.floor(Math.random() * polynomialProblems.length)]();
                break;
                
            case 3:
            case 4:
                const quadraticEqProblems = [
                    () => {
                        const a = Math.floor(Math.random() * 5) + 1;
                        answer = a;
                        return `x² = ${a * a}일 때, x > 0이면 x = ?`;
                    },
                    () => {
                        const p = Math.floor(Math.random() * 5) + 2;
                        const q = Math.floor(Math.random() * 5) + 1;
                        answer = p + q;
                        return `x² - ${p + q}x + ${p * q} = 0의 두 근의 합 = ?`;
                    }
                ];
                this.currentQuestion = quadraticEqProblems[Math.floor(Math.random() * quadraticEqProblems.length)]();
                break;
                
            case 5:
            case 6:
                const quadraticFuncProblems = [
                    () => {
                        const a = Math.floor(Math.random() * 3) + 1;
                        answer = 0;
                        return `y = ${a}x²의 꼭짓점의 x좌표 = ?`;
                    },
                    () => {
                        const h = Math.floor(Math.random() * 5) - 2;
                        const k = Math.floor(Math.random() * 5) + 1;
                        answer = h;
                        return `y = (x - ${h})² + ${k}의 축의 방정식은 x = ?`;
                    }
                ];
                this.currentQuestion = quadraticFuncProblems[Math.floor(Math.random() * quadraticFuncProblems.length)]();
                break;
                
            case 7:
            case 8:
                const shapeProblems = [
                    () => {
                        const a = Math.floor(Math.random() * 5) + 3;
                        const b = Math.floor(Math.random() * 5) + 4;
                        answer = Math.sqrt(a * a + b * b);
                        return `직각삼각형의 두 변이 ${a}, ${b}일 때, 빗변의 길이 = ?`;
                    },
                    () => {
                        answer = 360;
                        return `사각형의 내각의 합 = ?`;
                    }
                ];
                this.currentQuestion = shapeProblems[Math.floor(Math.random() * shapeProblems.length)]();
                break;
                
            case 9:
            case 10:
                const probabilityProblems = [
                    () => {
                        answer = 0.5;
                        return `동전을 던질 때 앞면이 나올 확률 = ?`;
                    },
                    () => {
                        const n = Math.floor(Math.random() * 4) + 1;
                        answer = n / 6;
                        return `주사위를 던져 ${n} 이하가 나올 확률 = ? (분수로)`;
                    },
                    () => {
                        const ratio = Math.floor(Math.random() * 3) + 2;
                        answer = ratio * ratio;
                        return `닮음비가 1:${ratio}인 두 도형의 넓이비는 1:?`;
                    }
                ];
                this.currentQuestion = probabilityProblems[Math.floor(Math.random() * probabilityProblems.length)]();
                break;
        }
        
        this.currentAnswer = answer;
        
        // Generate multiple choice options for Grade 8
        const options = [answer];
        while (options.length < 3) {
            let fakeAnswer;
            if (typeof answer === 'number') {
                if (answer === 0.5 || answer < 1) {
                    // For probability answers
                    const probOptions = [0.25, 0.5, 0.75, 1/3, 2/3, 1/6, 5/6];
                    fakeAnswer = probOptions[Math.floor(Math.random() * probOptions.length)];
                } else if (answer === 360 || answer === 180) {
                    // For angle sums
                    fakeAnswer = answer + (Math.random() < 0.5 ? 90 : -90);
                } else {
                    // For regular numbers
                    const variation = Math.floor(Math.random() * 5) + 1;
                    fakeAnswer = answer + (Math.random() < 0.5 ? variation : -variation);
                }
            }
            
            if (!options.includes(fakeAnswer) && fakeAnswer !== answer) {
                options.push(fakeAnswer);
            }
        }
        
        return options;
    }
    
    generateGrade9Question(stage) {
        let answer;
        
        switch(stage) {
            case 1:
            case 2:
                const trigProblems = [
                    () => {
                        answer = 0.5;
                        return `sin 30° = ?`;
                    },
                    () => {
                        answer = 1;
                        return `tan 45° = ?`;
                    },
                    () => {
                        answer = Math.sqrt(3)/2;
                        return `cos 30° = ? (√3/2 형태로 답)`;
                    }
                ];
                this.currentQuestion = trigProblems[Math.floor(Math.random() * trigProblems.length)]();
                break;
                
            case 3:
            case 4:
                const circleProblems = [
                    () => {
                        const r = Math.floor(Math.random() * 5) + 1;
                        answer = Math.PI * r * r;
                        return `반지름이 ${r}인 원의 넓이 = ? (π를 사용하여)`;
                    },
                    () => {
                        answer = 90;
                        return `반원에 내접하는 삼각형의 한 각의 크기 = ?`;
                    }
                ];
                this.currentQuestion = circleProblems[Math.floor(Math.random() * circleProblems.length)]();
                break;
                
            case 5:
            case 6:
                const pythagoreanProblems = [
                    () => {
                        answer = 5;
                        return `직각삼각형에서 두 변이 3, 4일 때 빗변 = ?`;
                    },
                    () => {
                        const a = 5;
                        const c = 13;
                        answer = 12;
                        return `직각삼각형에서 한 변이 ${a}, 빗변이 ${c}일 때 나머지 변 = ?`;
                    }
                ];
                this.currentQuestion = pythagoreanProblems[Math.floor(Math.random() * pythagoreanProblems.length)]();
                break;
                
            case 7:
            case 8:
                const combinatoricsProblems = [
                    () => {
                        const n = Math.floor(Math.random() * 3) + 3;
                        answer = factorial(n);
                        return `${n}개를 일렬로 배열하는 경우의 수 = ?`;
                    },
                    () => {
                        answer = 10;
                        return `5C2 (5개 중 2개를 선택) = ?`;
                    }
                ];
                this.currentQuestion = combinatoricsProblems[Math.floor(Math.random() * combinatoricsProblems.length)]();
                break;
                
            case 9:
            case 10:
                const advancedProblems = [
                    () => {
                        const data = [1, 2, 2, 3, 3, 3, 4, 4, 5];
                        answer = 3;
                        return `자료 [1,2,2,3,3,3,4,4,5]의 중앙값 = ?`;
                    },
                    () => {
                        answer = 2;
                        return `y = 2^x 에서 x = 1일 때 y = ?`;
                    },
                    () => {
                        const n = Math.floor(Math.random() * 3) + 2;
                        answer = n * n * n;
                        return `한 변이 ${n}인 정육면체의 부피 = ?`;
                    }
                ];
                this.currentQuestion = advancedProblems[Math.floor(Math.random() * advancedProblems.length)]();
                break;
        }
        
        this.currentAnswer = answer;
        
        function factorial(n) {
            if (n <= 1) return 1;
            return n * factorial(n - 1);
        }
        
        // Generate multiple choice options for Grade 9
        const options = [answer];
        while (options.length < 3) {
            let fakeAnswer;
            if (typeof answer === 'number') {
                if (answer === 0.5 || answer === 1 || answer === Math.sqrt(3)/2) {
                    // For trig values
                    const trigOptions = [0, 0.5, 1, Math.sqrt(2)/2, Math.sqrt(3)/2, -1];
                    fakeAnswer = trigOptions[Math.floor(Math.random() * trigOptions.length)];
                } else if (answer === Math.PI || answer > 10 && answer % Math.PI === 0) {
                    // For circle area
                    fakeAnswer = answer + (Math.random() < 0.5 ? Math.PI : -Math.PI);
                } else {
                    // For regular numbers
                    const variation = Math.floor(Math.random() * 3) + 1;
                    fakeAnswer = answer + (Math.random() < 0.5 ? variation : -variation);
                }
            }
            
            if (!options.includes(fakeAnswer) && fakeAnswer !== answer) {
                options.push(fakeAnswer);
            }
        }
        
        return options;
    }
    
    generateStandardQuestion(stage) {
        let num1, num2, operation, answer;
        
        const gradeAdjustment = Math.floor((this.selectedGrade - 1) / 2);
        
        switch(stage + gradeAdjustment) {
            case 1:
            case 2:
                num1 = Math.floor(Math.random() * 10) + 1;
                num2 = Math.floor(Math.random() * 10) + 1;
                operation = Math.random() < 0.5 ? '+' : '-';
                if (operation === '-' && num1 < num2) {
                    [num1, num2] = [num2, num1];
                }
                answer = operation === '+' ? num1 + num2 : num1 - num2;
                this.currentQuestion = `${num1} ${operation} ${num2} = ?`;
                break;
                
            case 3:
            case 4:
                num1 = Math.floor(Math.random() * 20) + 1;
                num2 = Math.floor(Math.random() * 20) + 1;
                operation = ['+', '-', '×'][Math.floor(Math.random() * 3)];
                if (operation === '-' && num1 < num2) {
                    [num1, num2] = [num2, num1];
                }
                answer = operation === '+' ? num1 + num2 : 
                        operation === '-' ? num1 - num2 : 
                        num1 * num2;
                this.currentQuestion = `${num1} ${operation} ${num2} = ?`;
                break;
                
            case 5:
            case 6:
                num1 = Math.floor(Math.random() * 50) + 10;
                num2 = Math.floor(Math.random() * 10) + 1;
                operation = ['+', '-', '×', '÷'][Math.floor(Math.random() * 4)];
                
                if (operation === '÷') {
                    num1 = num2 * Math.floor(Math.random() * 10 + 2);
                }
                
                answer = operation === '+' ? num1 + num2 : 
                        operation === '-' ? num1 - num2 : 
                        operation === '×' ? num1 * num2 : 
                        num1 / num2;
                this.currentQuestion = `${num1} ${operation} ${num2} = ?`;
                break;
                
            default:
                const operations = ['square', 'sqrt', 'complex'];
                const op = operations[Math.floor(Math.random() * operations.length)];
                
                if (op === 'square') {
                    num1 = Math.floor(Math.random() * 15) + 1;
                    answer = num1 * num1;
                    this.currentQuestion = `${num1}² = ?`;
                } else if (op === 'sqrt') {
                    const squares = [4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144];
                    num1 = squares[Math.floor(Math.random() * squares.length)];
                    answer = Math.sqrt(num1);
                    this.currentQuestion = `√${num1} = ?`;
                } else {
                    num1 = Math.floor(Math.random() * 30) + 10;
                    num2 = Math.floor(Math.random() * 20) + 5;
                    const num3 = Math.floor(Math.random() * 10) + 1;
                    answer = num1 + num2 * num3;
                    this.currentQuestion = `${num1} + ${num2} × ${num3} = ?`;
                }
                break;
        }
        
        this.currentAnswer = answer;
        
        // Generate multiple choice options for standard questions
        const options = [answer];
        while (options.length < 3) {
            let fakeAnswer;
            if (typeof answer === 'number') {
                const variation = Math.floor(Math.random() * 10) + 1;
                fakeAnswer = answer + (Math.random() < 0.5 ? variation : -variation);
                
                // Ensure fake answer is not negative for positive results
                if (fakeAnswer < 0 && answer >= 0) {
                    fakeAnswer = answer + variation;
                }
            }
            
            if (!options.includes(fakeAnswer)) {
                options.push(fakeAnswer);
            }
        }
        
        return options;
    }
    
    updateMonster() {
        const monster = this.monsters[this.currentStage - 1];
        
        // Initialize monster display with animation system
        this.monsterSystem.initializeMonster('monster-display', this.currentStage);
        
        document.getElementById('current-stage').textContent = this.currentStage;
        const hpPercentage = (this.monsterHP / this.maxMonsterHP) * 100;
        document.getElementById('hp-fill').style.width = `${hpPercentage}%`;
    }
    
    darkenColor(color, percent) {
        const num = parseInt(color.replace("#", ""), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) - amt;
        const G = (num >> 8 & 0x00FF) - amt;
        const B = (num & 0x0000FF) - amt;
        return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
            (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
            (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
    }
    
    checkAnswer(userAnswer) {
        let isCorrect = (userAnswer == this.currentAnswer);

        this.updateUserStats(isCorrect);

        if (isCorrect) {
            this.correctAnswer();
        } else {
            this.wrongAnswer();
        }
    }

    // Add event listeners for multiple choice
    setupChoiceListeners() {
        ['choice-1', 'choice-2', 'choice-3'].forEach(choiceId => {
            document.getElementById(choiceId).addEventListener('click', (event) => {
                this.checkAnswer(event.target.textContent);
            });
        });
    }
    
    correctAnswer() {
        // Increase combo count
        this.comboCount++;
        
        // Show combo display
        this.showComboDisplay();
        
        const pointsEarned = this.currentStage * 10;
        this.score += pointsEarned;
        document.getElementById('score').textContent = this.score;
        
        this.animateCorrect();
        
        // Trigger monster animation for correct answer
        this.monsterSystem.onCorrectAnswer();
        
        // Show correct answer feedback
        this.showAnswerFeedback(true, this.currentAnswer);
        
        // Show monster comment
        this.showMonsterComment(true);
        
        // Check for max combo instant defeat (except stage 10)
        if (this.comboCount >= this.maxCombo && this.currentStage < 10) {
            this.monsterHP = 0;
            // Show special combo message
            setTimeout(() => {
                this.showComboMaxMessage();
            }, 500);
        } else {
            this.monsterHP -= 1;
        }
        
        const hpPercentage = (this.monsterHP / this.maxMonsterHP) * 100;
        document.getElementById('hp-fill').style.width = `${hpPercentage}%`;
        
        setTimeout(() => {
            this.hideAnswerFeedback();
            this.hideMonsterComment();
            this.hideComboDisplay();
            this.proceedToNextQuestion();
        }, 2500);
        
        if (this.isTeamPlay) {
            this.broadcastCorrectAnswer();
        }
    }
    
    wrongAnswer() {
        // Reset combo on wrong answer
        this.comboCount = 0;
        this.hideComboDisplay();
        
        this.animateWrong();
        
        const damage = 20;
        this.playerHP -= damage;
        
        // Trigger monster animation for wrong answer
        this.monsterSystem.onWrongAnswer();
        
        // Show correct answer feedback
        this.showAnswerFeedback(false, this.currentAnswer);
        
        // Show monster comment
        this.showMonsterComment(false);
        
        // Update health and check for game over
        if (this.playerHP <= 0) {
            this.playerHP = 0;
            this.updatePlayerHealth();
            this.animatePlayerDamage();
            
            // Game over due to HP loss
            setTimeout(() => {
                this.hideAnswerFeedback();
                this.hideMonsterComment();
                this.gameOver(false, '체력이 모두 소진되었습니다!');
            }, 3000);
        } else {
            this.updatePlayerHealth();
            this.animatePlayerDamage();
            
            // Continue to next question after showing feedback
            setTimeout(() => {
                this.hideAnswerFeedback();
                this.hideMonsterComment();
                this.proceedToNextQuestion();
            }, 3000);
        }
    }
    
    animateCorrect() {
        const monster = document.querySelector('.monster');
        monster.style.animation = 'shake 0.5s';
        setTimeout(() => {
            monster.style.animation = 'float 3s ease-in-out infinite';
        }, 500);
    }
    
    animateWrong() {
        const choiceContainer = document.getElementById('multiple-choice-container');
        if (choiceContainer) {
            choiceContainer.style.animation = 'shake 0.3s';
            setTimeout(() => {
                choiceContainer.style.animation = '';
            }, 300);
        }
    }
    
    gameOver(isVictory = true, customMessage = null) {
        this.gameInProgress = false;
        this.clearGameProgress();
        
        // Update final user stats and score accumulation before showing game over screen
        if (!this.isGuest && this.currentUser) {
            this.currentUser.stats.playCount++;
            
            // Always update best score if current score is higher
            if (this.score > this.currentUser.stats.bestScore) {
                this.currentUser.stats.bestScore = this.score;
            }
            
            // Always update best stage if current stage is higher
            if (this.currentStage > this.currentUser.stats.bestStage) {
                this.currentUser.stats.bestStage = this.currentStage;
            }
            
            // Update grade-specific play count
            if (this.currentUser.stats.gradeHistory && this.currentUser.stats.gradeHistory[this.selectedGrade.toString()]) {
                this.currentUser.stats.gradeHistory[this.selectedGrade.toString()].playCount++;
            }
            
            // Update tier calculation based on final performance
            this.updateUserTier();
            
            this.saveUserData();
        }
        
        document.getElementById('game-over').classList.remove('hidden');
        document.getElementById('final-score').textContent = this.score;
        
        const titleElement = document.getElementById('game-over-title');
        const messageElement = document.getElementById('game-over-message');
        
        if (isVictory) {
            titleElement.textContent = '완료!';
            if (customMessage) {
                messageElement.textContent = customMessage;
            } else if (this.playerHP > 0) {
                messageElement.textContent = '축하합니다! 모든 몬스터를 물리쳤습니다!';
            } else {
                messageElement.textContent = '모든 문제를 완료했습니다! 체력 관리를 더 잘해보세요.';
            }
        } else {
            titleElement.textContent = '패배...';
            messageElement.textContent = '체력이 모두 소진되었습니다. 다시 도전하세요!';
        }
        
        if (this.isTeamPlay) {
            this.displayLeaderboard();
        }
    }
    
    resetGame() {
        this.resetGameState();
        document.getElementById('game-over').classList.add('hidden');
        
        if (this.isGuest) {
            this.showGradeSelection();
        } else {
            this.showDashboard();
        }
    }
    
    toggleTeamPanel() {
        const panel = document.getElementById('team-panel');
        panel.classList.toggle('hidden');
    }
    
    createRoom() {
        this.roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        document.getElementById('room-code').textContent = this.roomCode;
        this.isTeamPlay = true;
        this.addTeamMember(this.currentUser.username, 0);
        alert(`방이 생성되었습니다! 코드: ${this.roomCode}`);
    }
    
    joinRoom() {
        const code = prompt('방 코드를 입력하세요:');
        if (code) {
            this.roomCode = code.toUpperCase();
            document.getElementById('room-code').textContent = this.roomCode;
            this.isTeamPlay = true;
            this.addTeamMember(this.currentUser.username, 0);
            alert(`방에 참가했습니다: ${this.roomCode}`);
        }
    }
    
    addTeamMember(name, score) {
        const member = { name, score };
        this.teamMembers.push(member);
        this.updateTeamDisplay();
    }
    
    updateTeamDisplay() {
        const container = document.getElementById('team-members');
        container.innerHTML = '';
        
        this.teamMembers.sort((a, b) => b.score - a.score).forEach(member => {
            const div = document.createElement('div');
            div.className = 'team-member';
            div.innerHTML = `<span>${member.name}</span><span>${member.score}</span>`;
            container.appendChild(div);
        });
    }
    
    broadcastCorrectAnswer() {
        const memberIndex = this.teamMembers.findIndex(m => m.name === this.currentUser.username);
        if (memberIndex !== -1) {
            this.teamMembers[memberIndex].score = this.score;
            this.updateTeamDisplay();
        }
    }
    
    displayLeaderboard() {
        const container = document.getElementById('leaderboard');
        container.innerHTML = '<h3>최종 순위</h3>';
        
        this.teamMembers.sort((a, b) => b.score - a.score).forEach((member, index) => {
            const div = document.createElement('div');
            div.className = 'leaderboard-item';
            div.innerHTML = `<span>${index + 1}. ${member.name}</span><span>${member.score}</span>`;
            container.appendChild(div);
        });
    }
    
    updatePlayerHealth() {
        const healthFill = document.getElementById('player-hp-fill');
        const healthPercent = (this.playerHP / this.maxPlayerHP) * 100;
        healthFill.style.width = `${healthPercent}%`;
    }
    
    animatePlayerDamage() {
        const healthBar = document.querySelector('.player-health');
        healthBar.style.animation = 'shake 0.3s';
        setTimeout(() => {
            healthBar.style.animation = '';
        }, 300);
    }
    
    showAnswerFeedback(isCorrect, correctAnswer) {
        const feedbackElement = document.getElementById('answer-feedback');
        feedbackElement.classList.remove('hidden', 'correct', 'wrong');
        
        if (isCorrect) {
            feedbackElement.classList.add('correct');
            feedbackElement.textContent = '정답입니다! 🎉';
        } else {
            feedbackElement.classList.add('wrong');
            feedbackElement.textContent = `틀렸습니다. 정답: ${correctAnswer}`;
        }
    }
    
    hideAnswerFeedback() {
        const feedbackElement = document.getElementById('answer-feedback');
        feedbackElement.classList.add('hidden');
    }
    
    showMonsterComment(isCorrect) {
        const monster = this.monsters[this.currentStage - 1];
        const commentElement = document.getElementById('monster-comment');
        const commentText = document.getElementById('monster-comment-text');
        
        let comments;
        if (isCorrect) {
            comments = monster.correctComments;
        } else {
            comments = monster.wrongComments;
        }
        
        const randomComment = comments[Math.floor(Math.random() * comments.length)];
        commentText.textContent = randomComment;
        
        commentElement.classList.remove('hidden');
    }
    
    hideMonsterComment() {
        const commentElement = document.getElementById('monster-comment');
        commentElement.classList.add('hidden');
    }
    
    proceedToNextQuestion() {
        if (this.monsterHP <= 0) {
            // Monster defeated, move to next stage
            if (this.currentStage === 10) {
                // Check if player has any health left for victory condition
                if (this.playerHP > 0) {
                    this.gameOver(true);
                } else {
                    // Completed all stages but with no health - still a completion
                    this.gameOver(true, '모든 문제를 완료했습니다!');
                }
            } else {
                this.currentStage++;
                this.monsterHP = this.getMonsterHPForStage(this.currentStage);
                this.maxMonsterHP = this.getMonsterHPForStage(this.currentStage);
                
                // Check for tier evolution
                const newTier = this.monsterSystem.getTierFromStage(this.currentStage);
                const oldTier = this.monsterSystem.getTierFromStage(this.currentStage - 1);
                if (newTier > oldTier) {
                    this.monsterSystem.onLevelUp(this.currentStage);
                }
                
                this.generateQuestion();
                this.updateMonster();
            }
        } else {
            // Monster still has HP, generate new question for same stage
            this.generateQuestion();
        }
    }
    
    // TierScore system removed - using simple bestScore system only
    
    updateUserTier() {
        if (!this.currentUser || this.isGuest) return;
        
        // Prevent concurrent executions
        if (this.tierUpdateInProgress) {
            return;
        }
        
        // Debounce tier updates to prevent rapid recalculation
        if (this.tierUpdateTimeout) {
            clearTimeout(this.tierUpdateTimeout);
        }
        
        this.tierUpdateTimeout = setTimeout(() => {
            this.tierUpdateInProgress = true;
            // Use ALL users for tier calculation, not just grade-level users
            const allUsers = JSON.parse(localStorage.getItem('mathGameUsers') || '[]');
            if (allUsers.length < 2) {
                this.currentUser.stats.tier = '브론즈';
                this.currentUser.stats.gradeRank = 1;
                return;
            }
            
            // Calculate global ranking based on best score
            allUsers.sort((a, b) => b.stats.bestScore - a.stats.bestScore);
            const globalRank = allUsers.findIndex(user => user.username === this.currentUser.username) + 1;
            const totalUsers = allUsers.length;
            
            // Calculate grade-specific ranking for display
            const gradeUsers = this.getGradeUsers();
            const { rank: gradeRank } = this.calculateUserRanking(gradeUsers);
            this.currentUser.stats.gradeRank = gradeRank;
            
            // Use global percentile for tier calculation
            const percentile = (globalRank / totalUsers) * 100;
            
            // Debug for 디노5 and 디노11
            if (this.currentUser.username === '디노5' || this.currentUser.username === '디노11') {
                console.log(`${this.currentUser.username} updateUserTier:`, { 
                    globalRank, 
                    totalUsers, 
                    percentile, 
                    bestScore: this.currentUser.stats.bestScore 
                });
            }
            
            const newTier = this.getTierFromPercentile(percentile, totalUsers, globalRank, this.currentUser.stats.bestScore, this.currentUser.username);
            
            if (newTier !== this.currentUser.stats.tier) {
                this.showTierUpgrade(this.currentUser.stats.tier, newTier);
                this.currentUser.stats.tier = newTier;
                
                // ALSO update the user in the global mathGameUsers array
                const allUsers = JSON.parse(localStorage.getItem('mathGameUsers') || '[]');
                const userIndex = allUsers.findIndex(user => user.username === this.currentUser.username);
                if (userIndex !== -1) {
                    allUsers[userIndex].stats.tier = newTier;
                    localStorage.setItem('mathGameUsers', JSON.stringify(allUsers));
                }
                
                // Force save the updated current user
                localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
                
                // Update the display immediately after tier change
                this.updateTierDisplay();
                
                // Refresh leaderboard to show updated tier
                setTimeout(() => {
                    this.loadLeaderboard();
                }, 100);
            }
            
            this.tierUpdateInProgress = false;
        }, 300); // 300ms debounce
    }
    
    getGradeUsers() {
        const allUsers = JSON.parse(localStorage.getItem('mathGameUsers') || '[]');
        return allUsers.filter(user => user.grade === this.currentUser.grade);
    }
    
    calculateUserRanking(gradeUsers) {
        gradeUsers.sort((a, b) => b.stats.bestScore - a.stats.bestScore);
        
        const userIndex = gradeUsers.findIndex(user => user.username === this.currentUser.username);
        const rank = userIndex + 1;
        const total = gradeUsers.length;
        
        return { rank, total };
    }
    
    getTierFromPercentile(percentile, totalUsers = 0, userRank = 0, bestScore = 0, debugUsername = null) {
        // Use debugUsername if provided, otherwise fall back to currentUser
        const username = debugUsername || this.currentUser?.username;
        
        if (!this.tierCalcLock) {
            this.tierCalcLock = {};
        }
        
        // Users with 0 best score (haven't played) always get bronze
        if (bestScore === 0) {
            return '브론즈';
        }
        
        // For large populations (100+ users), use standard tier system
        if (totalUsers >= 100) {
            // Use the tier system percentages directly
            for (const tier of this.tierSystem.tiers) {
                if (percentile <= tier.percentage) {
                    return tier.name;
                }
            }
            return '브론즈'; // Default fallback
        }
        
        // For medium populations (10-99 users)
        if (totalUsers >= 10) {
            if (percentile <= 1) return '챌린저';
            else if (percentile <= 5) return '그랜드 마스터';
            else if (percentile <= 15) return '마스터';
            else if (percentile <= 25) return '다이어몬드';
            else if (percentile <= 40) return '골드';
            else if (percentile <= 60) return '실버';
            else return '브론즈';
        }
        
        // For small populations (less than 10 users)
        if (percentile <= 10) return '챌린저';
        else if (percentile <= 20) return '그랜드 마스터';
        else if (percentile <= 40) return '마스터';
        else if (percentile <= 60) return '다이어몬드';
        else if (percentile <= 80) return '골드';
        else return '실버';
    }
    
    recalculateAllUserTiers(allUsers) {
        if (allUsers.length < 2) {
            // If only one user, they get bronze
            allUsers.forEach(user => {
                user.stats.tier = '브론즈';
            });
            localStorage.setItem('mathGameUsers', JSON.stringify(allUsers));
            return;
        }
        
        // Sort all users by best score globally
        allUsers.sort((a, b) => b.stats.bestScore - a.stats.bestScore);
        
        console.log(`🔧 Recalculating tiers for ${allUsers.length} users`);
        
        // Assign tiers based on global ranking
        allUsers.forEach((user, index) => {
            const globalRank = index + 1;
            const totalUsers = allUsers.length;
            const percentile = (globalRank / totalUsers) * 100;
            
            // Debug first few and last few users
            if (index < 5 || index >= allUsers.length - 5) {
                console.log(`User ${user.username}: rank ${globalRank}/${totalUsers}, percentile ${percentile.toFixed(2)}%, score ${user.stats.bestScore}`);
            }
            
            user.stats.tier = this.getTierFromPercentile(percentile, totalUsers, globalRank, user.stats.bestScore, user.username);
            
            // Debug tier assignment for first few users  
            if (index < 5 || index >= allUsers.length - 5) {
                console.log(`→ Assigned tier: ${user.stats.tier}`);
            }
        });
        
        // Show tier distribution
        const tierCounts = {};
        allUsers.forEach(user => {
            tierCounts[user.stats.tier] = (tierCounts[user.stats.tier] || 0) + 1;
        });
        console.log('📊 Tier distribution:', tierCounts);
        
        // Save updated user data
        localStorage.setItem('mathGameUsers', JSON.stringify(allUsers));
        
        // Update current user if they exist
        if (this.currentUser) {
            const updatedCurrentUser = allUsers.find(user => user.username === this.currentUser.username);
            if (updatedCurrentUser) {
                this.currentUser.stats.tier = updatedCurrentUser.stats.tier;
                localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
            }
        }
    }
    
    updateTierDisplay() {
        if (!this.currentUser) return;
        
        // Check if user has played in current grade
        const currentGrade = this.currentUser.grade.toString();
        const hasPlayedInGrade = this.currentUser.stats.gradeHistory && 
                                this.currentUser.stats.gradeHistory[currentGrade] && 
                                this.currentUser.stats.gradeHistory[currentGrade].playCount > 0;
        
        // Use grade-specific tier if available
        let currentTier;
        if (hasPlayedInGrade) {
            currentTier = this.calculateGradeTier(this.currentUser.grade, 
                this.currentUser.stats.gradeHistory[currentGrade].bestScore, 
                this.currentUser.username);
        } else {
            currentTier = '티어 없음';
        }
        
        // Debug logging
        if (this.currentUser.username === '디노11') {
            console.log('디노11 updateTierDisplay:', { 
                username: this.currentUser.username,
                currentTier: currentTier,
                hasPlayedInGrade: hasPlayedInGrade,
                gradeData: this.currentUser.stats.gradeHistory[currentGrade]
            });
        }
        
        // Handle no tier case
        if (currentTier === '티어 없음') {
            const tierBadge = document.getElementById('tier-badge');
            const tierIcon = document.getElementById('tier-icon');
            const tierName = document.getElementById('tier-name');
            const tierRank = document.getElementById('tier-rank');
            const gameTier = document.getElementById('game-tier');
            
            if (tierBadge) {
                tierBadge.className = 'tier-badge tier-none';
            }
            
            if (tierIcon) {
                tierIcon.textContent = '❓';
            }
            
            if (tierName) {
                tierName.textContent = '티어 없음';
            }
            
            if (tierRank) {
                tierRank.textContent = '이 학년에서 플레이하세요';
            }
            
            if (gameTier) {
                gameTier.textContent = '티어 없음';
                gameTier.className = 'tier-indicator tier-none';
            }
            
            return;
        }
        
        const tierData = this.tierSystem.tiers.find(t => t.name === currentTier);
        if (!tierData) {
            if (this.currentUser.username === '디노11') {
                console.log('디노11: No tierData found for tier:', currentTier);
            }
            return;
        }
        
        // Update dashboard tier display
        const tierBadge = document.getElementById('tier-badge');
        const tierIcon = document.getElementById('tier-icon');
        const tierName = document.getElementById('tier-name');
        const tierRank = document.getElementById('tier-rank');
        const gameTier = document.getElementById('game-tier');
        
        if (tierBadge) {
            tierBadge.className = `tier-badge ${tierData.class}`;
        }
        
        if (tierIcon) {
            tierIcon.textContent = tierData.icon;
        }
        
        if (tierName) {
            tierName.textContent = tierData.name;
        }
        
        if (tierRank) {
            // Calculate global percentile
            const allUsers = JSON.parse(localStorage.getItem('mathGameUsers') || '[]');
            allUsers.sort((a, b) => b.stats.bestScore - a.stats.bestScore);
            
            const userRank = allUsers.findIndex(user => user.username === this.currentUser.username) + 1;
            if (allUsers.length > 1) {
                const percentile = Math.round((userRank / allUsers.length) * 100);
                tierRank.textContent = `상위 ${percentile}%`;
            } else {
                tierRank.textContent = '순위 계산 중...';
            }
        }
        
        if (gameTier) {
            gameTier.textContent = tierData.name;
            gameTier.className = `tier-indicator ${tierData.class}`;
        }
    }
    
    showTierUpgrade(oldTier, newTier) {
        const tierData = this.tierSystem.tiers.find(t => t.name === newTier);
        if (tierData) {
            setTimeout(() => {
                alert(`🎉 티어 승급! ${oldTier} → ${newTier} ${tierData.icon}`);
            }, 500);
        }
    }
    
    showUserDashboard() {
        this.hideAllScreens();
        document.getElementById('user-dashboard').classList.remove('hidden');
        this.updateDashboard();
    }
    
    loadGlobalStats() {
        const allUsers = JSON.parse(localStorage.getItem('mathGameUsers') || '[]');
        const totalUsers = allUsers.length;
        const currentGrade = this.currentUser.grade;
        
        // Count users who have played recently (within last 24 hours) or have active game progress
        const now = new Date();
        const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        
        let activePlayers = 0;
        let gradeUsers = 0;
        let activeGradePlayers = 0;
        
        allUsers.forEach(user => {
            // Count users in current grade
            if (user.grade === currentGrade) {
                gradeUsers++;
                
                // Check if this grade user played recently
                if (user.stats && user.stats.lastPlayed) {
                    const lastPlayed = new Date(user.stats.lastPlayed);
                    if (lastPlayed > oneDayAgo) {
                        activeGradePlayers++;
                    }
                }
            }
            
            // Check if user played recently (within 24 hours) globally
            if (user.stats && user.stats.lastPlayed) {
                const lastPlayed = new Date(user.stats.lastPlayed);
                if (lastPlayed > oneDayAgo) {
                    activePlayers++;
                }
            }
        });
        
        document.getElementById('total-users').textContent = totalUsers;
        document.getElementById('active-players').textContent = activePlayers;
        
        // Add grade-specific stats if elements exist
        const gradeUsersElement = document.getElementById('grade-users');
        const activeGradePlayersElement = document.getElementById('active-grade-players');
        
        if (gradeUsersElement) {
            gradeUsersElement.textContent = gradeUsers;
        }
        if (activeGradePlayersElement) {
            activeGradePlayersElement.textContent = activeGradePlayers;
        }
    }
    
    loadLeaderboard() {
        // Use current user's grade
        const selectedGrade = this.currentUser.grade.toString();
        this.loadGlobalLeaderboard(selectedGrade, 'all');
        this.setupTierNavigation();
    }
    
    setupTierNavigation() {
        const tierButtons = document.querySelectorAll('.nav-btn[data-tier]');
        tierButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons
                tierButtons.forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                btn.classList.add('active');
                
                const selectedTier = btn.getAttribute('data-tier');
                const selectedGrade = this.currentUser.grade.toString();
                this.loadGlobalLeaderboard(selectedGrade, selectedTier);
            });
        });
    }
    
    loadGlobalLeaderboard(grade, tierFilter = 'all') {
        console.log(`📋 Loading leaderboard for grade ${grade}, tier filter: ${tierFilter}`);
        const allUsers = JSON.parse(localStorage.getItem('mathGameUsers') || '[]');
        console.log(`Total users in database: ${allUsers.length}`);
        
        // Use existing tiers instead of recalculating every time
        const updatedUsers = allUsers;
        
        // Get all users who have played in this specific grade
        const gradePlayersData = [];
        updatedUsers.forEach(user => {
            if (user.stats.gradeHistory && user.stats.gradeHistory[grade.toString()]) {
                const gradeData = user.stats.gradeHistory[grade.toString()];
                // Calculate global tier for this user
                const gradeTier = this.calculateGradeTier(parseInt(grade), gradeData.bestScore, user.username);
                gradePlayersData.push({
                    username: user.username,
                    schoolName: user.schoolName || '',
                    gradeData: gradeData,
                    gradeTier: gradeTier // Use grade-specific tier instead of global tier
                });
            }
        });
        
        // Filter by tier if specified
        let filteredData = gradePlayersData;
        if (tierFilter !== 'all') {
            filteredData = gradePlayersData.filter(player => player.gradeTier === tierFilter);
        }
        
        // Sort by grade-specific best score
        filteredData.sort((a, b) => b.gradeData.bestScore - a.gradeData.bestScore);
        
        // Debug: Check if sorting is working correctly
        if (filteredData.length > 5) {
            console.log('🔍 Top 5 users after sorting:');
            filteredData.slice(0, 5).forEach((user, index) => {
                console.log(`  ${index + 1}. ${user.username}: ${user.gradeData.bestScore} points → ${user.gradeTier}`);
            });
        }
        
        const leaderboardList = document.getElementById('leaderboard-list');
        const leaderboardTitle = document.getElementById('leaderboard-title');
        
        const gradeText = this.getGradeText(grade);
        const tierText = tierFilter === 'all' ? '전체' : tierFilter;
        leaderboardTitle.textContent = `${tierText} 순위 - ${gradeText}`;
        
        leaderboardList.innerHTML = '';
        
        if (filteredData.length === 0) {
            const message = tierFilter === 'all' 
                ? '이 학년에서 플레이한 사용자가 없습니다.'
                : `이 학년의 ${tierFilter} 티어에는 사용자가 없습니다.`;
            leaderboardList.innerHTML = `<div style="text-align: center; color: #666; padding: 20px;">${message}</div>`;
            return;
        }
        
        // Debug: Check how many users we have at each step
        console.log(`🔍 Leaderboard debug - Grade ${grade}, Tier filter: ${tierFilter}`);
        console.log(`  Total users in grade: ${gradePlayersData.length}`);
        console.log(`  After tier filter: ${filteredData.length}`);
        
        // Limit to top 100 users for performance
        const displayData = filteredData.slice(0, 100);
        console.log(`  Will display: ${displayData.length} users`);
        
        displayData.forEach((playerData, index) => {
            const item = document.createElement('div');
            item.className = 'leaderboard-item';
            
            if (this.currentUser && playerData.username === this.currentUser.username) {
                item.classList.add('current-user');
            }
            
            const rank = index + 1;
            const tierData = this.tierSystem.tiers.find(t => t.name === playerData.gradeTier) || this.tierSystem.tiers[6];
            
            // Calculate accuracy for this specific grade
            const gradeData = playerData.gradeData;
            const accuracy = gradeData.totalAnswers > 0 ? 
                Math.round((gradeData.correctAnswers / gradeData.totalAnswers) * 100) : 0;
            
            const schoolDisplay = playerData.schoolName ? ` (${playerData.schoolName})` : '';
            item.innerHTML = `
                <div class="leaderboard-rank rank-${rank}">${rank}</div>
                <div class="leaderboard-user">
                    <div class="leaderboard-username">${playerData.username}${schoolDisplay}</div>
                    <div class="leaderboard-tier ${tierData.class}">${tierData.icon} ${tierData.name}</div>
                </div>
                <div class="leaderboard-stats">
                    <div class="leaderboard-score">${gradeData.bestScore}</div>
                    <div class="leaderboard-accuracy">${accuracy}% 정답률</div>
                </div>
            `;
            
            leaderboardList.appendChild(item);
        });
        
        // Show total count if more than 100 users
        if (filteredData.length > 100) {
            const moreInfo = document.createElement('div');
            moreInfo.className = 'leaderboard-item';
            moreInfo.style.textAlign = 'center';
            moreInfo.style.color = '#666';
            moreInfo.style.fontStyle = 'italic';
            moreInfo.innerHTML = `상위 100명만 표시됨 (전체 ${filteredData.length}명)`;
            leaderboardList.appendChild(moreInfo);
        }
    }
    
    loadMyTiers() {
        if (!this.currentUser) return;
        
        const myTiersGrid = document.getElementById('my-tiers-grid');
        myTiersGrid.innerHTML = '';
        
        // Show current grade tier prominently, then other grades if any
        const currentGrade = this.currentUser.grade.toString();
        const gradeHistory = this.currentUser.stats.gradeHistory || {};
        
        // Get all played grades except current one
        const otherGrades = Object.keys(gradeHistory)
            .filter(grade => grade !== currentGrade)
            .sort((a, b) => parseInt(a) - parseInt(b));
        
        // Show other grades if any
        if (otherGrades.length > 0) {
            otherGrades.forEach(grade => {
                const gradeData = gradeHistory[grade];
                const tier = this.calculateGradeTier(parseInt(grade), gradeData.bestScore, this.currentUser.username);
                const tierData = this.tierSystem.tiers.find(t => t.name === tier) || this.tierSystem.tiers[6];
                
                const tierItem = document.createElement('div');
                tierItem.className = 'my-tier-item';
                
                const gradeText = this.getGradeText(grade);
                
                tierItem.innerHTML = `
                    <div class="my-tier-grade">${gradeText}</div>
                    <div class="my-tier-badge">
                        <div class="my-tier-icon">${tierData.icon}</div>
                        <div class="my-tier-name">${tierData.name}</div>
                    </div>
                `;
                
                myTiersGrid.appendChild(tierItem);
            });
        } else {
            myTiersGrid.innerHTML = '<div style="text-align: center; color: #666; padding: 20px;">다른 학년에서 플레이한 기록이 없습니다.</div>';
        }
    }
    
    calculateGradeTier(grade, bestScore, username = null) {
        const targetUsername = username || this.currentUser?.username;
        const allUsers = JSON.parse(localStorage.getItem('mathGameUsers') || '[]');

        const gradeUsers = allUsers.filter(user => {
            return user.stats.gradeHistory && user.stats.gradeHistory[grade.toString()];
        });

        // Sort users by best score within the grade
        gradeUsers.sort((a, b) => b.stats.gradeHistory[grade.toString()].bestScore - a.stats.gradeHistory[grade.toString()].bestScore);

        const targetUserIndex = gradeUsers.findIndex(user => user.username === targetUsername);
        const rank = targetUserIndex + 1;

        // If no playing session, return no tier
        if (gradeUsers[targetUserIndex]?.stats?.gradeHistory[grade.toString()]?.playCount === 0) {
            return '티어 없음';
        }

        const percentile = (rank / gradeUsers.length) * 100;

        // Determine tier based on the calculated percentile
        if (percentile <= 0.1) return '챌린저';
        if (percentile <= 1.0) return '그랜드 마스터';
        if (percentile <= 5.0) return '마스터';
        if (percentile <= 10.0) return '다이어몬드';
        if (percentile <= 15.0) return '골드';
        if (percentile <= 30.0) return '실버';
        return '브론즈';
    }
    
    generateTestUsers() {
        console.log('🎲 Generating 100000 test users with random scores...');
        
        const users = [];
        const grades = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
        
        for (let i = 1; i <= 100000; i++) {
            const username = `dino${i}`;
            const randomGrade = grades[Math.floor(Math.random() * grades.length)];
            const randomScore = Math.floor(Math.random() * 1000); // 0-999 points
            
            const user = {
                username: username,
                password: 'test', // Simple password for test users
                grade: randomGrade,
                stats: {
                    bestScore: randomScore,
                    bestStage: Math.min(Math.floor(randomScore / 10) + 1, 10), // Rough stage estimate
                    playCount: Math.floor(Math.random() * 50) + 1, // 1-50 plays
                    tier: '브론즈', // Will be calculated
                    gradeRank: 1,
                    gradeHistory: {},
                    lastPlayed: new Date().toISOString()
                },
                createdAt: new Date().toISOString()
            };
            
            // Create grade-specific history with the same score
            user.stats.gradeHistory[randomGrade.toString()] = {
                bestScore: randomScore,
                bestStage: user.stats.bestStage,
                correctAnswers: Math.floor(Math.random() * 100),
                totalAnswers: Math.floor(Math.random() * 120) + 80, // 80-200 total
                playCount: user.stats.playCount
            };
            
            users.push(user);
        }
        
        // Save all users to localStorage
        localStorage.setItem('mathGameUsers', JSON.stringify(users));
        
        // Recalculate all tiers based on the new population
        this.recalculateAllUserTiers(users);
        
        console.log('✅ Generated 100000 users successfully!');
        console.log('📊 Score distribution:');
        
        // Show score distribution
        const scores = users.map(u => u.stats.bestScore).sort((a, b) => b - a);
        console.log(`🥇 Top score: ${scores[0]}`);
        console.log(`🥈 90th percentile: ${scores[Math.floor(scores.length * 0.1)]}`);
        console.log(`🥉 50th percentile: ${scores[Math.floor(scores.length * 0.5)]}`);
        console.log(`📉 Bottom score: ${scores[scores.length - 1]}`);
        
        // Show tier distribution
        const tiers = {};
        users.forEach(user => {
            tiers[user.stats.tier] = (tiers[user.stats.tier] || 0) + 1;
        });
        console.log('🏆 Tier distribution:', tiers);
        
        console.log('🔄 Refreshing page to show new data...');
        setTimeout(() => {
            location.reload();
        }, 2000);
    }
    
    regenerateAndDebugTiers() {
        console.log('🔄 Regenerating test users and debugging tier system...');
        
        // Clear existing users
        localStorage.removeItem('mathGameUsers');
        
        // Generate new test users
        this.generateTestUsers();
        
        // Load them back and trigger dashboard update
        if (this.currentUser) {
            this.updateDashboard();
            this.loadLeaderboard();
        }
    }
    
    generate100kUsers() {
        console.log('🔄 Clearing all data and generating 100,000 new users...');
        
        // Clear all existing data
        localStorage.removeItem('mathGameUsers');
        
        // Generate new test users (the function already generates 100k now)
        this.generateTestUsers();
        
        // Refresh the page to show new data
        console.log('🔄 Refreshing page to show new data...');
        setTimeout(() => {
            location.reload();
        }, 5000); // Longer timeout for 100k users
    }
    
    testTierCalculation() {
        console.log('🧪 Testing tier calculation with simple data...');
        
        // Create simple test case
        const testUsers = [
            { username: 'test1', stats: { bestScore: 900 } },
            { username: 'test2', stats: { bestScore: 800 } },
            { username: 'test3', stats: { bestScore: 700 } },
            { username: 'test4', stats: { bestScore: 600 } },
            { username: 'test5', stats: { bestScore: 500 } }
        ];
        
        // Test tier calculation manually
        testUsers.forEach((user, index) => {
            const globalRank = index + 1;
            const totalUsers = testUsers.length;
            const percentile = (globalRank / totalUsers) * 100;
            
            console.log(`\n--- Testing ${user.username} ---`);
            console.log(`Rank: ${globalRank}/${totalUsers}`);
            console.log(`Percentile: ${percentile}%`);
            console.log(`Score: ${user.stats.bestScore}`);
            
            const tier = this.getTierFromPercentile(percentile, totalUsers, globalRank, user.stats.bestScore, user.username);
            console.log(`Assigned tier: ${tier}`);
        });
    }
    
    checkCurrentTierDistribution() {
        console.log('📊 Checking current tier distribution...');
        
        const allUsers = JSON.parse(localStorage.getItem('mathGameUsers') || '[]');
        console.log(`Total users: ${allUsers.length}`);
        
        if (allUsers.length === 0) {
            console.log('No users found');
            return;
        }
        
        // Count grades
        const gradeCounts = {};
        allUsers.forEach(user => {
            const grade = user.grade || 'undefined';
            gradeCounts[grade] = (gradeCounts[grade] || 0) + 1;
        });
        
        console.log('Grade distribution:');
        Object.entries(gradeCounts).sort((a, b) => a[0] - b[0]).forEach(([grade, count]) => {
            console.log(`  Grade ${grade}: ${count} users`);
        });
        
        // Count tiers
        const tierCounts = {};
        allUsers.forEach(user => {
            const tier = user.stats?.tier || 'undefined';
            tierCounts[tier] = (tierCounts[tier] || 0) + 1;
        });
        
        console.log('\nCurrent tier distribution:');
        Object.entries(tierCounts).forEach(([tier, count]) => {
            const percentage = ((count / allUsers.length) * 100).toFixed(1);
            console.log(`  ${tier}: ${count} users (${percentage}%)`);
        });
        
        // Show some example users
        allUsers.sort((a, b) => b.stats.bestScore - a.stats.bestScore);
        console.log('\n📋 Top 10 users:');
        allUsers.slice(0, 10).forEach((user, index) => {
            console.log(`  ${index + 1}. ${user.username}: Grade ${user.grade}, ${user.stats.bestScore} points → ${user.stats.tier}`);
        });
        
        console.log('\n📋 Bottom 10 users:');
        allUsers.slice(-10).forEach((user, index) => {
            const rank = allUsers.length - 10 + index + 1;
            console.log(`  ${rank}. ${user.username}: Grade ${user.grade}, ${user.stats.bestScore} points → ${user.stats.tier}`);
        });
        
        // Show current user info
        if (this.currentUser) {
            console.log(`\n👤 Current user: ${this.currentUser.username}, Grade ${this.currentUser.grade}`);
            const currentGradeUsers = allUsers.filter(u => u.grade === this.currentUser.grade);
            console.log(`  Users in your grade: ${currentGradeUsers.length}`);
        }
    }

    clearAllUserData() {
        console.log('🧹 Starting comprehensive data clear...');
        
        // Force clear ALL localStorage
        localStorage.clear();
        sessionStorage.clear();
        
        // Double-check specific keys
        localStorage.removeItem('mathGameUsers');
        localStorage.removeItem('currentUser');
        
        // Clear any possible variations
        const allKeys = Object.keys(localStorage);
        allKeys.forEach(key => {
            if (key.includes('math') || key.includes('game') || key.includes('user')) {
                localStorage.removeItem(key);
                console.log('🗑️ Removed key:', key);
            }
        });
        
        // Reset game state
        this.currentUser = null;
        this.isGuest = true;
        this.gameInProgress = false;
        
        console.log('✅ Complete clear done!');
        console.log('📊 Remaining localStorage keys:', Object.keys(localStorage));
        console.log('📝 mathGameUsers:', localStorage.getItem('mathGameUsers'));
        console.log('👤 currentUser:', localStorage.getItem('currentUser'));
        
        // Force refresh after showing results
        console.log('🔄 Refreshing page in 2 seconds...');
        setTimeout(() => {
            location.reload(true); // Force reload from server
        }, 2000);
    }

    getGradeText(grade) {
        const gradeTexts = {
            '1': '초1', '2': '초2', '3': '초3', '4': '초4', '5': '초5', '6': '초6',
            '7': '중1', '8': '중2', '9': '중3',
            '10': '고1', '11': '고2', '12': '고3'
        };
        return gradeTexts[grade] || grade + '학년';
    }
    
    setupTextInputListeners() {
        const textInput = document.getElementById('text-answer-input');
        const submitButton = document.getElementById('submit-text-answer');

        // Event listener for Enter key in text input
        textInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.checkAnswer(textInput.value.trim());
            }
        });

        // Event listener for clicking the submit button
        submitButton.addEventListener('click', () => {
            this.checkAnswer(textInput.value.trim());
        });
    }
    
    setupLeaderboardEventListeners() {
        // Grade filter
        const gradeFilter = document.getElementById('grade-filter');
        if (gradeFilter) {
            gradeFilter.addEventListener('change', () => {
                this.loadLeaderboard();
            });
        }
    }
    
    clearGameProgress() {
        // Clear any saved game progress (if implemented in future)
        // For now, just ensure game state is reset
        this.gameInProgress = false;
    }
    
    showComboDisplay() {
        const comboDisplay = document.getElementById('combo-display');
        if (!comboDisplay) {
            // Create combo display if it doesn't exist
            const comboDiv = document.createElement('div');
            comboDiv.id = 'combo-display';
            comboDiv.className = 'combo-display';
            document.querySelector('.battle-area').appendChild(comboDiv);
        }
        
        const combo = document.getElementById('combo-display');
        combo.innerHTML = `
            <div class="combo-text">COMBO</div>
            <div class="combo-count">${this.comboCount}</div>
            <div class="combo-progress">
                <div class="combo-fill" style="width: ${(this.comboCount / this.maxCombo) * 100}%"></div>
            </div>
        `;
        
        combo.classList.remove('hidden');
        combo.classList.add('show');
        
        // Add special effect for high combos
        if (this.comboCount >= 5) {
            combo.classList.add('combo-high');
        }
        if (this.comboCount >= 8) {
            combo.classList.add('combo-max');
        }
    }
    
    hideComboDisplay() {
        const comboDisplay = document.getElementById('combo-display');
        if (comboDisplay) {
            comboDisplay.classList.remove('show', 'combo-high', 'combo-max');
            comboDisplay.classList.add('hidden');
        }
    }
    
    showComboMaxMessage() {
        const message = document.createElement('div');
        message.className = 'combo-max-message';
        message.innerHTML = `
            <div class="combo-max-text">MAX COMBO!</div>
            <div class="combo-max-sub">몬스터 즉시 처치!</div>
        `;
        
        document.querySelector('.battle-area').appendChild(message);
        
        setTimeout(() => {
            message.remove();
        }, 2000);
    }
}


const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
`;
document.head.appendChild(style);

const game = new MathMonsterGame();
game.setupLeaderboardEventListeners();

// Make debug functions globally accessible
window.debugTiers = () => game.regenerateAndDebugTiers();
window.testTiers = () => game.testTierCalculation();
window.checkTiers = () => game.checkCurrentTierDistribution();
window.fixTiers = () => {
    console.log('🔧 Force recalculating all tiers...');
    const allUsers = JSON.parse(localStorage.getItem('mathGameUsers') || '[]');
    console.log(`Found ${allUsers.length} users`);
    
    // Check score distribution first
    allUsers.sort((a, b) => b.stats.bestScore - a.stats.bestScore);
    console.log('📊 Top 10 scores before tier calc:');
    allUsers.slice(0, 10).forEach((user, index) => {
        console.log(`  ${index + 1}. ${user.username}: ${user.stats.bestScore} points`);
    });
    
    // Test tier calculation for top user manually
    const topUser = allUsers[0];
    const totalUsers = allUsers.length;
    const percentile = (1 / totalUsers) * 100;
    console.log(`\n🧪 Manual tier test for top user:`);
    console.log(`  User: ${topUser.username}`);
    console.log(`  Score: ${topUser.stats.bestScore}`);
    console.log(`  Rank: 1/${totalUsers}`);
    console.log(`  Percentile: ${percentile.toFixed(4)}%`);
    
    const calculatedTier = game.getTierFromPercentile(percentile, totalUsers, 1, topUser.stats.bestScore, topUser.username);
    console.log(`  Calculated tier: ${calculatedTier}`);
    
    // Clear tier calc cache
    game.tierCalcLock = {};
    
    // Force recalculate
    game.recalculateAllUserTiers(allUsers);
    
    // Check results
    const updated = JSON.parse(localStorage.getItem('mathGameUsers') || '[]');
    updated.sort((a, b) => b.stats.bestScore - a.stats.bestScore);
    
    console.log('\n🏆 Top 10 users after tier recalculation:');
    updated.slice(0, 10).forEach((user, index) => {
        console.log(`  ${index + 1}. ${user.username}: ${user.stats.bestScore} points → ${user.stats.tier}`);
    });
    
    // Refresh page
    location.reload();
};
window.generate100k = () => game.generate100kUsers();
window.forceFixTiers = () => {
    const allUsers = JSON.parse(localStorage.getItem('mathGameUsers') || '[]');
    
    // Sort by score globally
    allUsers.sort((a, b) => b.stats.bestScore - a.stats.bestScore);
    
    // Manually assign tiers based on position
    const totalUsers = allUsers.length;
    allUsers.forEach((user, index) => {
        const rank = index + 1;
        const percentile = (rank / totalUsers) * 100;
        
        // Assign tier based on percentile
        if (percentile <= 0.1) user.stats.tier = '챌린저';
        else if (percentile <= 1.0) user.stats.tier = '그랜드 마스터';
        else if (percentile <= 5.0) user.stats.tier = '마스터';
        else if (percentile <= 10.0) user.stats.tier = '다이어몬드';
        else if (percentile <= 15.0) user.stats.tier = '골드';
        else if (percentile <= 30.0) user.stats.tier = '실버';
        else user.stats.tier = '브론즈';
    });
    
    // Save back to localStorage
    localStorage.setItem('mathGameUsers', JSON.stringify(allUsers));
    
    console.log('✅ Tiers fixed! Top 10 users:');
    allUsers.slice(0, 10).forEach((user, index) => {
        console.log(`${index + 1}. ${user.username}: ${user.stats.bestScore} → ${user.stats.tier}`);
    });
    
    location.reload();
};
window.clearAndGenerate100k = () => {
    console.log('🔄 Starting 100k user generation...');
    localStorage.removeItem('mathGameUsers');
    localStorage.removeItem('currentUser');
    
    const users = [];
    const grades = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    
    console.log('Creating users...');
    for (let i = 1; i <= 100000; i++) {
        if (i % 10000 === 0) console.log(`Progress: ${i}/100000`);
        
        const username = `dino${i}`;
        const randomGrade = grades[Math.floor(Math.random() * grades.length)];
        const randomScore = Math.floor(Math.random() * 1000);
        
        const user = {
            username: username,
            password: 'test',
            grade: randomGrade,
            stats: {
                bestScore: randomScore,
                bestStage: Math.min(Math.floor(randomScore / 10) + 1, 10),
                playCount: Math.floor(Math.random() * 50) + 1,
                tier: '브론즈',
                gradeRank: 1,
                gradeHistory: {},
                lastPlayed: new Date().toISOString()
            },
            createdAt: new Date().toISOString()
        };
        
        user.stats.gradeHistory[randomGrade.toString()] = {
            bestScore: randomScore,
            bestStage: user.stats.bestStage,
            correctAnswers: Math.floor(Math.random() * 100),
            totalAnswers: Math.floor(Math.random() * 120) + 80,
            playCount: user.stats.playCount
        };
        
        users.push(user);
    }
    
    console.log('Saving users to localStorage...');
    localStorage.setItem('mathGameUsers', JSON.stringify(users));
    console.log('✅ Generated 100,000 users successfully!');
    console.log('🔄 Refreshing page...');
    location.reload();
};
