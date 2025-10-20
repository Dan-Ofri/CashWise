/**
 * ===========================================
 * 💾 Storage Utilities
 * ===========================================
 * ניהול localStorage עם אנקפסולציה
 */

/**
 * שמירה ל-localStorage עם טיפול בשגיאות
 * @param {string} key - מפתח
 * @param {any} value - ערך (יומר ל-JSON אוטומטית)
 * @returns {boolean} - האם ההשמירה הצליחה
 */
export function saveToStorage(key, value) {
    try {
        const serialized = JSON.stringify(value);
        localStorage.setItem(key, serialized);
        return true;
    } catch (error) {
        console.error(`Failed to save ${key} to localStorage:`, error);
        return false;
    }
}

/**
 * קריאה מ-localStorage
 * @param {string} key - מפתח
 * @param {any} defaultValue - ערך ברירת מחדל אם לא נמצא
 * @returns {any}
 */
export function loadFromStorage(key, defaultValue = null) {
    try {
        const serialized = localStorage.getItem(key);
        if (serialized === null) {
            return defaultValue;
        }
        return JSON.parse(serialized);
    } catch (error) {
        console.error(`Failed to load ${key} from localStorage:`, error);
        return defaultValue;
    }
}

/**
 * מחיקה מ-localStorage
 */
export function removeFromStorage(key) {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (error) {
        console.error(`Failed to remove ${key} from localStorage:`, error);
        return false;
    }
}

/**
 * ניקוי כל ה-localStorage
 */
export function clearStorage() {
    try {
        localStorage.clear();
        return true;
    } catch (error) {
        console.error('Failed to clear localStorage:', error);
        return false;
    }
}

/**
 * בדיקה אם מפתח קיים
 */
export function hasKey(key) {
    return localStorage.getItem(key) !== null;
}

/**
 * קבלת כל המפתחות של CashWise
 */
export function getAllKeys() {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) keys.push(key);
    }
    return keys;
}

/**
 * קבלת כל נתוני CashWise
 */
export function exportAllData() {
    const data = {};
    const keys = getAllKeys();
    keys.forEach(key => {
        data[key] = loadFromStorage(key);
    });
    return data;
}

/**
 * ייבוא נתונים
 */
export function importAllData(data) {
    try {
        Object.entries(data).forEach(([key, value]) => {
            saveToStorage(key, value);
        });
        return true;
    } catch (error) {
        console.error('Failed to import data:', error);
        return false;
    }
}

// ===== Keys מיוחדים למערכת =====

export const STORAGE_KEYS = {
    APP_STATE: 'cashwise-app-state',        // New state system (Phase 2)
    USER_PROFILE: 'user-profile',
    USER_LEVEL: 'user-level',
    USER_XP: 'user-xp',
    ACHIEVEMENTS: 'achievements',
    COMPLETED_LESSONS: 'completed-lessons',
    SIMULATION: 'simulation-character',
    BUDGET_DATA: 'budget-data',
    TASKS: 'daily-tasks',
    THEME: 'theme-preference'
};
