/**
 * ===========================================
 * 🗄️ State Management
 * ===========================================
 * ניהול מצב גלובלי של האפליקציה
 */

import { saveToStorage, loadFromStorage, STORAGE_KEYS } from '../utils/storage.js';
import { showSuccess } from '../utils/notifications.js';

// ===== הגדרות קבועות =====

export const ACHIEVEMENTS = [
    { id: 'first-budget', icon: '📝', title: 'תקציבן ראשון', desc: 'השלמת שיעור התקציב', xp: 50 },
    { id: 'compound-master', icon: '📈', title: 'מומחה ריבית', desc: 'חישוב ריבית דריבית', xp: 50 },
    { id: 'emergency-ready', icon: '🆘', title: 'מוכן לחירום', desc: 'תכנון קרן חירום', xp: 50 },
    { id: 'investor', icon: '💎', title: 'משקיע חכם', desc: 'חישוב השקעה עם מיסוי ואינפלציה', xp: 50 },
    { id: 'simulation-done', icon: '🎮', title: 'סימולטור הצלחה', desc: 'השלמת סימולציה', xp: 100 },
    { id: 'ask-mentor', icon: '💬', title: 'שואל חכם', desc: 'שאלת המנטור', xp: 30 },
    { id: 'level-5', icon: '⭐', title: 'רמה 5', desc: 'הגעה לרמה 5', xp: 0 },
    { id: 'all-lessons', icon: '🎓', title: 'בוגר אקדמיה', desc: 'סיום כל השיעורים', xp: 200 },
    { id: 'money-master', icon: '💰', title: 'מאסטר כסף', desc: 'הגעה לרמה 10', xp: 0 }
];

// ===== מבנה המצב המרכזי =====

let gameState = null;

/**
 * אתחול מצב המשחק
 */
function initGameState() {
    return {
        xp: 0,
        level: 1,
        achievements: [],
        lessonsCompleted: [],
        actionsCompleted: [],
        lastLogin: new Date().toISOString()
    };
}

/**
 * טעינת מצב המשחק
 */
export function loadGameState() {
    if (gameState) return gameState;
    
    const saved = loadFromStorage(STORAGE_KEYS.USER_LEVEL, null);
    gameState = saved || initGameState();
    
    return gameState;
}

/**
 * שמירת מצב המשחק
 */
export function saveGameState(state = null) {
    if (state) {
        gameState = state;
    }
    
    if (!gameState) {
        console.warn('No game state to save');
        return false;
    }
    
    return saveToStorage(STORAGE_KEYS.USER_LEVEL, gameState);
}

/**
 * קבלת XP הנוכחי
 */
export function getUserXP() {
    const state = loadGameState();
    return state.xp || 0;
}

/**
 * קבלת רמה נוכחית
 */
export function getUserLevel() {
    const state = loadGameState();
    return state.level || 1;
}

/**
 * הוספת XP למשתמש
 * @param {number} amount - כמות ה-XP להוספה
 * @param {string} reason - סיבת ההוספה (לתצוגה)
 * @returns {Object} - מידע על שינוי הרמה
 */
export function addXP(amount, reason = '') {
    const state = loadGameState();
    const oldXP = state.xp;
    const oldLevel = state.level;
    
    state.xp += amount;
    
    // חישוב רמה חדשה
    const newLevel = Math.floor(state.xp / 100) + 1;
    const leveledUp = newLevel > oldLevel;
    
    if (leveledUp) {
        state.level = newLevel;
        
        // בדיקת הישגי רמות
        if (newLevel === 5) checkAchievement('level-5');
        if (newLevel === 10) checkAchievement('money-master');
        
        showSuccess(`🎉 עלית לרמה ${newLevel}!`);
    }
    
    saveGameState(state);
    
    return {
        oldXP,
        newXP: state.xp,
        oldLevel,
        newLevel,
        leveledUp,
        reason
    };
}

/**
 * בדיקה ופתיחת הישג
 */
export function checkAchievement(achievementId) {
    const state = loadGameState();
    
    // בדיקה אם ההישג כבר נפתח
    if (state.achievements.includes(achievementId)) {
        return false;
    }
    
    // מציאת ההישג
    const achievement = ACHIEVEMENTS.find(a => a.id === achievementId);
    if (!achievement) {
        console.warn(`Achievement ${achievementId} not found`);
        return false;
    }
    
    // פתיחת ההישג
    state.achievements.push(achievementId);
    
    // הוספת XP אם יש
    if (achievement.xp > 0) {
        state.xp += achievement.xp;
    }
    
    saveGameState(state);
    
    // הצגת הודעה
    showSuccess(`🏆 הישג חדש: ${achievement.title}! +${achievement.xp} XP`);
    
    // בדיקת הישג "כל השיעורים"
    const lessonCount = state.lessonsCompleted.filter(l => !l.startsWith('scenario-')).length;
    if (lessonCount >= 4 && !state.achievements.includes('all-lessons')) {
        setTimeout(() => checkAchievement('all-lessons'), 1000);
    }
    
    return true;
}

/**
 * סימון שיעור כהושלם
 */
export function markLessonComplete(lessonId) {
    const state = loadGameState();
    
    if (state.lessonsCompleted.includes(lessonId)) {
        return false; // כבר הושלם
    }
    
    state.lessonsCompleted.push(lessonId);
    saveGameState(state);
    
    // הוספת XP בסיסי
    addXP(30, `השלמת שיעור: ${lessonId}`);
    
    return true;
}

/**
 * בדיקה אם שיעור הושלם
 */
export function isLessonComplete(lessonId) {
    const state = loadGameState();
    return state.lessonsCompleted.includes(lessonId);
}

/**
 * קבלת רשימת כל ההישגים
 */
export function getAllAchievements() {
    return ACHIEVEMENTS;
}

/**
 * קבלת הישגים שנפתחו
 */
export function getUnlockedAchievements() {
    const state = loadGameState();
    return ACHIEVEMENTS.filter(a => state.achievements.includes(a.id));
}

/**
 * קבלת הישגים נעולים
 */
export function getLockedAchievements() {
    const state = loadGameState();
    return ACHIEVEMENTS.filter(a => !state.achievements.includes(a.id));
}

/**
 * איפוס מצב המשחק
 */
export function resetGameState() {
    gameState = initGameState();
    saveGameState(gameState);
    return gameState;
}

// ===== פעולות מנטור =====

/**
 * בדיקה אם פעולה מהמנטור בוצעה
 */
export function mentorActionDone(actionId) {
    const state = loadGameState();
    return state.actionsCompleted.includes(actionId);
}

/**
 * סימון פעולת מנטור כבוצעה
 */
export function markMentorActionDone(actionId, xp = 20) {
    const state = loadGameState();
    
    if (state.actionsCompleted.includes(actionId)) {
        return false; // כבר בוצעה
    }
    
    state.actionsCompleted.push(actionId);
    saveGameState(state);
    
    addXP(xp, 'ביצוע צעד מהמנטור');
    
    return true;
}

// ===== פרופיל משתמש =====

/**
 * קבלת פרופיל המשתמש
 */
export function getUserProfile() {
    return loadFromStorage(STORAGE_KEYS.USER_PROFILE, {});
}

/**
 * שמירת פרופיל משתמש
 */
export function saveUserProfile(profile) {
    return saveToStorage(STORAGE_KEYS.USER_PROFILE, profile);
}

/**
 * עדכון חלקי של פרופיל
 */
export function updateUserProfile(updates) {
    const profile = getUserProfile();
    const updated = { ...profile, ...updates };
    return saveUserProfile(updated);
}

/**
 * קבלת הכנסה מהפרופיל
 */
export function getUserIncome(defaultIncome = 6000) {
    const profile = getUserProfile();
    return profile.income && profile.income > 0 ? profile.income : defaultIncome;
}

// ===== סימולציה =====

/**
 * שמירת מצב סימולציה
 */
export function saveSimulation(character) {
    return saveToStorage(STORAGE_KEYS.SIMULATION, character);
}

/**
 * טעינת מצב סימולציה
 */
export function loadSimulation() {
    return loadFromStorage(STORAGE_KEYS.SIMULATION, null);
}

/**
 * מחיקת סימולציה
 */
export function clearSimulation() {
    return saveToStorage(STORAGE_KEYS.SIMULATION, null);
}

/**
 * איפוס מלא של כל המשחק - מחזיר למצב התחלתי
 */
export function fullGameReset() {
    console.log('🔄 Starting full game reset...');
    
    // איפוס מצב משחק (XP, רמה, הישגים)
    gameState = initGameState();
    saveGameState(gameState);
    
    // מחיקת סימולציה
    clearSimulation();
    
    // מחיקת פרופיל משתמש
    saveToStorage(STORAGE_KEYS.USER_PROFILE, null);
    
    // מחיקת שיעורים
    localStorage.removeItem('lessons-state');
    
    // מחיקת הצלחת סימולציה
    localStorage.removeItem('simulation-completed');
    
    // מחיקת טריגר השקעות
    localStorage.removeItem('trigger-shown');
    
    console.log('✅ Full game reset completed!');
    console.log('📊 New state:', {
        xp: gameState.xp,
        level: gameState.level,
        achievements: gameState.achievements.length,
        simulationCompleted: localStorage.getItem('simulation-completed'),
        lessonsState: localStorage.getItem('lessons-state')
    });
    
    return gameState;
}

// ===== אירועי מצב =====

const stateListeners = new Map();

/**
 * הרשמה לאירועי שינוי מצב
 */
export function onStateChange(event, callback) {
    if (!stateListeners.has(event)) {
        stateListeners.set(event, []);
    }
    stateListeners.get(event).push(callback);
    
    // החזרת פונקציה להסרת ההרשמה
    return () => {
        const listeners = stateListeners.get(event);
        const index = listeners.indexOf(callback);
        if (index > -1) {
            listeners.splice(index, 1);
        }
    };
}

/**
 * פליטת אירוע שינוי מצב
 */
export function emitStateChange(event, data) {
    const listeners = stateListeners.get(event);
    if (listeners) {
        listeners.forEach(callback => callback(data));
    }
}

// ===== אירועי אפליקציה (תאימות לאחור) =====

/**
 * פליטת אירוע אפליקציה
 */
export function emitAppEvent(type, detail = {}) {
    try {
        document.dispatchEvent(new CustomEvent(type, { detail }));
    } catch (e) {
        console.error('Failed to emit app event:', e);
    }
}

// ===== ייצוא המצב הגלובלי (למטרות debug) =====

export function getGameState() {
    return gameState;
}
