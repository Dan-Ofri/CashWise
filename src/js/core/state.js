/**
 * ===========================================
 * 🗄️ State Management (Legacy Wrapper)
 * ===========================================
 * Wrapper layer for backward compatibility
 * Uses new state management system under the hood
 * 
 * ⚠️ DEPRECATED: Use src/js/state/ directly for new code
 */

import { saveToStorage, loadFromStorage, STORAGE_KEYS } from '../utils/storage.js';
import { showSuccess } from '../utils/notifications.js';
import { 
    ACHIEVEMENT_XP, 
    LEVEL_MILESTONES, 
    XP_CONFIG, 
    XP_REWARDS,
    UI_TIMING,
    MATH_CONSTANTS,
    SIMULATION_CONFIG
} from '../config/index.js';

// ===== NEW STATE SYSTEM =====
import {
    store,
    getState,
    subscribe,
    // Actions
    addXP as stateAddXP,
    unlockAchievement as stateUnlockAchievement,
    completeLesson as stateCompleteLesson,
    addCompletedAction,
    updateLastLogin,
    // Selectors
    getUserXP as stateGetUserXP,
    getUserLevel as stateGetUserLevel,
    isAchievementUnlocked,
    isLessonCompleted as stateIsLessonCompleted,
    getUnlockedAchievements as stateGetUnlockedAchievements
} from '../state/index.js';

// ===== הגדרות קבועות =====

export const ACHIEVEMENTS = [
    { id: 'first-budget', icon: '📝', title: 'תקציבן ראשון', desc: 'השלמת שיעור התקציב', xp: ACHIEVEMENT_XP.FIRST_BUDGET },
    { id: 'compound-master', icon: '📈', title: 'מומחה ריבית', desc: 'חישוב ריבית דריבית', xp: ACHIEVEMENT_XP.COMPOUND_MASTER },
    { id: 'emergency-ready', icon: '🆘', title: 'מוכן לחירום', desc: 'תכנון קרן חירום', xp: ACHIEVEMENT_XP.EMERGENCY_READY },
    { id: 'investor', icon: '💎', title: 'משקיע חכם', desc: 'חישוב השקעה עם מיסוי ואינפלציה', xp: ACHIEVEMENT_XP.INVESTOR },
    { id: 'simulation-done', icon: '🎮', title: 'סימולטור הצלחה', desc: 'השלמת סימולציה', xp: ACHIEVEMENT_XP.SIMULATION_DONE },
    { id: 'ask-mentor', icon: '💬', title: 'שואל חכם', desc: 'שאלת המנטור', xp: ACHIEVEMENT_XP.ASK_MENTOR },
    { id: 'level-5', icon: '⭐', title: 'רמה 5', desc: 'הגעה לרמה 5', xp: ACHIEVEMENT_XP.LEVEL_5 },
    { id: 'all-lessons', icon: '🎓', title: 'בוגר אקדמיה', desc: 'סיום כל השיעורים', xp: ACHIEVEMENT_XP.ALL_LESSONS },
    { id: 'money-master', icon: '💰', title: 'מאסטר כסף', desc: 'הגעה לרמה 10', xp: ACHIEVEMENT_XP.MONEY_MASTER }
];

// ===== מבנה המצב המרכזי (Legacy) =====

/**
 * @deprecated Legacy variable - use getState() from ../state/index.js
 */
let gameState = null;

/**
 * אתחול מצב המשחק
 * @deprecated This function is kept for backward compatibility only
 */
function initGameState() {
    return {
        xp: MATH_CONSTANTS.ZERO,
        level: MATH_CONSTANTS.ONE,
        achievements: [],
        lessonsCompleted: [],
        actionsCompleted: [],
        lastLogin: new Date().toISOString()
    };
}

/**
 * טעינת מצב המשחק
 * @deprecated Use getState() from ../state/index.js
 */
export function loadGameState() {
    // Return state from new system
    const state = getState();
    
    // Convert to old format for backward compatibility
    gameState = {
        xp: state.user.xp,
        level: state.user.level,
        achievements: state.user.achievements,
        lessonsCompleted: state.user.lessonsCompleted,
        actionsCompleted: state.user.actionsCompleted,
        lastLogin: state.user.lastLogin
    };
    
    return gameState;
}

/**
 * שמירת מצב המשחק
 * @deprecated State is automatically saved by the new system
 */
export function saveGameState(state = null) {
    // New system auto-saves - this is a no-op for compatibility
    console.warn('saveGameState is deprecated - new system auto-saves');
    return true;
}

/**
 * קבלת XP הנוכחי
 * @deprecated Use stateGetUserXP from ../state/index.js
 */
export function getUserXP() {
    return stateGetUserXP();
}

/**
 * קבלת רמה נוכחית
 * @deprecated Use stateGetUserLevel from ../state/index.js
 */
export function getUserLevel() {
    return stateGetUserLevel();
}

/**
 * הוספת XP למשתמש
 * @param {number} amount - כמות ה-XP להוספה
 * @param {string} reason - סיבת ההוספה (לתצוגה)
 * @returns {Object} - מידע על שינוי הרמה
 * @deprecated Use stateAddXP from ../state/index.js
 */
export function addXP(amount, reason = '') {
    // Delegate to new state system
    return stateAddXP(amount, reason);
}

/**
 * בדיקה ופתיחת הישג
 * @deprecated Use stateUnlockAchievement from ../state/index.js
 */
export function checkAchievement(achievementId) {
    // Check if already unlocked
    if (isAchievementUnlocked(achievementId)) {
        return false;
    }
    
    // Find achievement
    const achievement = ACHIEVEMENTS.find(a => a.id === achievementId);
    if (!achievement) {
        console.warn(`Achievement ${achievementId} not found`);
        return false;
    }
    
    // Unlock via new state system
    stateUnlockAchievement(achievementId)(getState());
    
    return true;
}

/**
 * סימון שיעור כהושלם
 * @deprecated Use stateCompleteLesson from ../state/index.js
 */
export function markLessonComplete(lessonId) {
    // Check if already completed
    if (stateIsLessonCompleted(lessonId)) {
        return false;
    }
    
    // Complete via new state system
    stateCompleteLesson(lessonId);
    
    // Add XP
    addXP(XP_REWARDS.COMPLETE_LESSON, `השלמת שיעור: ${lessonId}`);
    
    return true;
}

/**
 * בדיקה אם שיעור הושלם
 * @deprecated Use stateIsLessonCompleted from ../state/index.js
 */
export function isLessonComplete(lessonId) {
    return stateIsLessonCompleted(lessonId);
}

/**
 * קבלת רשימת כל ההישגים
 */
export function getAllAchievements() {
    return ACHIEVEMENTS;
}

/**
 * קבלת הישגים שנפתחו
 * @deprecated Use stateGetUnlockedAchievements from ../state/index.js
 */
export function getUnlockedAchievements() {
    const unlockedIds = stateGetUnlockedAchievements();
    return ACHIEVEMENTS.filter(a => unlockedIds.includes(a.id));
}

/**
 * קבלת הישגים נעולים
 */
export function getLockedAchievements() {
    const unlockedIds = stateGetUnlockedAchievements();
    return ACHIEVEMENTS.filter(a => !unlockedIds.includes(a.id));
}

/**
 * איפוס מצב המשחק
 * @deprecated Use store.reset() from ../state/index.js
 */
export function resetGameState() {
    // Reset via new system
    store.reset();
    return loadGameState(); // Return in old format
}

// ===== פעולות מנטור =====

/**
 * בדיקה אם פעולה מהמנטור בוצעה
 * @deprecated Use isActionCompleted from ../state/index.js
 */
export function mentorActionDone(actionId) {
    const state = getState();
    return state.user.actionsCompleted.includes(actionId);
}

/**
 * סימון פעולת מנטור כבוצעה
 * @deprecated Use addCompletedAction from ../state/index.js
 */
export function markMentorActionDone(actionId, xp = XP_REWARDS.COMPLETE_LESSON) {
    const state = getState();
    
    if (state.user.actionsCompleted.includes(actionId)) {
        return false; // כבר בוצעה
    }
    
    // Add action via new state system
    addCompletedAction(actionId);
    
    // Add XP
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
export function getUserIncome(defaultIncome = SIMULATION_CONFIG.DEFAULT_SALARY) {
    const profile = getUserProfile();
    return profile.income && profile.income > MATH_CONSTANTS.ZERO ? profile.income : defaultIncome;
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
 * @deprecated Use store.reset() from ../state/index.js
 */
export function fullGameReset() {
    console.log('🔄 Starting full game reset...');
    
    // Reset via new state system
    store.reset();
    
    // Clear additional localStorage items
    clearSimulation();
    saveToStorage(STORAGE_KEYS.USER_PROFILE, null);
    localStorage.removeItem('lessons-state');
    localStorage.removeItem('simulation-completed');
    localStorage.removeItem('trigger-shown');
    
    const state = getState();
    
    console.log('✅ Full game reset completed!');
    console.log('📊 New state:', {
        xp: state.user.xp,
        level: state.user.level,
        achievements: state.user.achievements.length,
        simulationCompleted: localStorage.getItem('simulation-completed'),
        lessonsState: localStorage.getItem('lessons-state')
    });
    
    return loadGameState(); // Return in old format
}

// ===== אירועי מצב (Legacy) =====

/**
 * @deprecated Legacy map - use subscribe() from ../state/index.js
 */
const stateListeners = new Map();

/**
 * הרשמה לאירועי שינוי מצב
 * @deprecated Use subscribe() from ../state/index.js
 */
export function onStateChange(event, callback) {
    // Use new state system's subscribe
    return subscribe((newState, oldState) => {
        callback({ newState, oldState });
    });
}

/**
 * פליטת אירוע שינוי מצב
 * @deprecated State changes are automatically broadcast by new system
 */
export function emitStateChange(event, data) {
    // No-op - new system handles this automatically
    console.warn('emitStateChange is deprecated - state changes broadcast automatically');
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

/**
 * @deprecated Use getState() from ../state/index.js
 */
export function getGameState() {
    return loadGameState(); // Return in old format
}

// ===== Re-export new state system for convenience =====

/**
 * Modern state management - use these in new code!
 */
export {
    store,
    getState,
    subscribe,
    // Import more as needed from ../state/index.js
} from '../state/index.js';

console.log('✅ State Management (Legacy Wrapper) loaded - delegates to new system');
