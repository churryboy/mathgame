// Mixpanel Integration for Math Game
// Add this script tag to your HTML: <script src="https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js"></script>

class MixpanelTracker {
    constructor(token) {
        this.token = token;
        this.isInitialized = false;
        
        // Initialize Mixpanel if available
        if (typeof mixpanel !== 'undefined') {
            mixpanel.init(token);
            this.isInitialized = true;
        } else {
            console.warn('Mixpanel library not loaded');
        }
    }

    // Identify user
    identifyUser(username, properties = {}) {
        if (!this.isInitialized) return;
        
        mixpanel.identify(username);
        mixpanel.people.set({
            $name: username,
            grade: properties.grade,
            school: properties.schoolName,
            ...properties
        });
    }

    // Track user signup
    trackSignup(username, grade, schoolName) {
        if (!this.isInitialized) return;
        
        mixpanel.track('User Signup', {
            username: username,
            grade: grade,
            school: schoolName,
            timestamp: new Date().toISOString()
        });
        
        // Set user profile
        this.identifyUser(username, { grade, schoolName });
    }

    // Track user login
    trackLogin(username) {
        if (!this.isInitialized) return;
        
        mixpanel.track('User Login', {
            username: username,
            timestamp: new Date().toISOString()
        });
        
        mixpanel.identify(username);
    }

    // Track game started
    trackGameStart(username, grade) {
        if (!this.isInitialized) return;
        
        mixpanel.track('Game Started', {
            username: username,
            grade: grade,
            timestamp: new Date().toISOString()
        });
    }

    // Track question answered
    trackAnswer(username, grade, stage, question, answer, isCorrect, timeSpent) {
        if (!this.isInitialized) return;
        
        mixpanel.track('Question Answered', {
            username: username,
            grade: grade,
            stage: stage,
            question: question,
            answer: answer,
            is_correct: isCorrect,
            time_spent_ms: timeSpent,
            timestamp: new Date().toISOString()
        });
    }

    // Track stage completed
    trackStageComplete(username, grade, stage, score, accuracy) {
        if (!this.isInitialized) return;
        
        mixpanel.track('Stage Completed', {
            username: username,
            grade: grade,
            stage: stage,
            score: score,
            accuracy: accuracy,
            timestamp: new Date().toISOString()
        });
    }

    // Track game over
    trackGameOver(username, grade, finalScore, finalStage, totalCorrect, totalAnswered) {
        if (!this.isInitialized) return;
        
        const accuracy = totalAnswered > 0 ? (totalCorrect / totalAnswered * 100).toFixed(1) : 0;
        
        mixpanel.track('Game Over', {
            username: username,
            grade: grade,
            final_score: finalScore,
            final_stage: finalStage,
            total_correct: totalCorrect,
            total_answered: totalAnswered,
            accuracy: accuracy,
            timestamp: new Date().toISOString()
        });
        
        // Update user profile with best scores
        mixpanel.people.set_once({
            best_score: finalScore,
            best_stage: finalStage
        });
        
        mixpanel.people.increment('games_played');
    }

    // Track tier change
    trackTierChange(username, oldTier, newTier, grade) {
        if (!this.isInitialized) return;
        
        mixpanel.track('Tier Changed', {
            username: username,
            old_tier: oldTier,
            new_tier: newTier,
            grade: grade,
            timestamp: new Date().toISOString()
        });
        
        mixpanel.people.set({
            current_tier: newTier
        });
    }

    // Track grade change
    trackGradeChange(username, oldGrade, newGrade) {
        if (!this.isInitialized) return;
        
        mixpanel.track('Grade Changed', {
            username: username,
            old_grade: oldGrade,
            new_grade: newGrade,
            timestamp: new Date().toISOString()
        });
        
        mixpanel.people.set({
            grade: newGrade
        });
    }

    // Track combo achievement
    trackCombo(username, comboCount, grade, stage) {
        if (!this.isInitialized) return;
        
        mixpanel.track('Combo Achieved', {
            username: username,
            combo_count: comboCount,
            grade: grade,
            stage: stage,
            timestamp: new Date().toISOString()
        });
        
        mixpanel.people.set_once({
            highest_combo: comboCount
        });
    }

    // Track custom event
    trackCustom(eventName, properties = {}) {
        if (!this.isInitialized) return;
        
        mixpanel.track(eventName, {
            ...properties,
            timestamp: new Date().toISOString()
        });
    }
}

// Initialize Mixpanel tracker
const MIXPANEL_TOKEN = '2cba60b3b4875bb5319ca4eaac64f462';
const tracker = new MixpanelTracker(MIXPANEL_TOKEN);

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { tracker, MixpanelTracker };
}
