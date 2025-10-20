/**
 * ===========================================
 * 🔌 State Middleware
 * ===========================================
 * Validation, Logging, Dev Tools Integration
 * 
 * Middleware מקבל: (oldState, newState, options)
 * מחזיר: 
 * - false = בטל את העדכון
 * - updater function = שנה את העדכון
 * - true/undefined = אשר את העדכון
 */

import { 
    FINANCIAL_RULES,
    BUDGET_RULES,
    RISK_THRESHOLDS,
    MATH_CONSTANTS 
} from '../config/index.js';
import { showWarning, showError } from '../utils/notifications.js';

// ===== Validation Middleware =====

/**
 * בדיקת תקינות ערכים פיננסיים
 */
export function financialValidation(oldState, newState, options) {
    // דלג בזמן טעינה מ-localStorage
    if (options.skipValidation) {
        return true;
    }
    
    const char = newState.simulation?.character;
    if (!char) return true; // אין דמות - אין מה לבדוק
    
    // בדיקת ערכים שליליים
    if (char.savings < MATH_CONSTANTS.ZERO) {
        showError('❌ חיסכון לא יכול להיות שלילי');
        return false;
    }
    
    if (char.salary < MATH_CONSTANTS.ZERO) {
        showError('❌ משכורת לא יכולה להיות שלילית');
        return false;
    }
    
    if (char.expenses < MATH_CONSTANTS.ZERO) {
        showError('❌ הוצאות לא יכולות להיות שליליות');
        return false;
    }
    
    // בדיקת הוצאות גבוהות מדי
    if (char.expenses > char.salary) {
        showWarning('⚠️ ההוצאות גבוהות מההכנסה!');
        // לא חוסם - רק אזהרה
    }
    
    // בדיקת חיסכון גבוה מדי (חשוד)
    const maxRealisticSavings = char.salary * FINANCIAL_RULES.MONTHS_PER_YEAR * 50; // 50 שנים
    if (char.savings > maxRealisticSavings) {
        showWarning('⚠️ חיסכון גבוה באופן חשוד');
        // לא חוסם - אולי מקסימום שנים
    }
    
    return true;
}

/**
 * בדיקת מגבלות XP ורמות
 */
export function xpValidation(oldState, newState, options) {
    if (options.skipValidation) {
        return true;
    }
    
    const xp = newState.user?.xp;
    const level = newState.user?.level;
    
    if (xp !== undefined) {
        // XP לא יכול להיות שלילי
        if (xp < MATH_CONSTANTS.ZERO) {
            showError('❌ XP לא יכול להיות שלילי');
            return false;
        }
        
        // הגבלת XP מקסימלי (למנוע overflow)
        const MAX_XP = 1000000;
        if (xp > MAX_XP) {
            showWarning('⚠️ XP חרג מהמקסימום המותר');
            return (state) => {
                state.user.xp = MAX_XP;
                return state;
            };
        }
    }
    
    if (level !== undefined) {
        // רמה לא יכולה להיות קטנה מ-1
        if (level < MATH_CONSTANTS.ONE) {
            showError('❌ רמה לא יכולה להיות קטנה מ-1');
            return false;
        }
        
        // הגבלת רמה מקסימלית
        const MAX_LEVEL = 100;
        if (level > MAX_LEVEL) {
            showWarning('⚠️ רמה חרגה מהמקסימום');
            return (state) => {
                state.user.level = MAX_LEVEL;
                return state;
            };
        }
    }
    
    return true;
}

/**
 * בדיקת מבנה State
 */
export function structureValidation(oldState, newState, options) {
    if (options.skipValidation) {
        return true;
    }
    
    // וידוא קיום השדות החובה
    const requiredFields = {
        user: ['xp', 'level', 'achievements', 'lessonsCompleted'],
        simulation: ['isActive'],
        ui: ['currentSection', 'modalsOpen', 'loading', 'errors'],
        meta: ['version', 'isDirty']
    };
    
    for (const [section, fields] of Object.entries(requiredFields)) {
        if (!newState[section]) {
            showError(`❌ חלק חובה חסר: ${section}`);
            return false;
        }
        
        for (const field of fields) {
            if (newState[section][field] === undefined) {
                showError(`❌ שדה חובה חסר: ${section}.${field}`);
                return false;
            }
        }
    }
    
    return true;
}

// ===== Logging Middleware =====

/**
 * לוג מפורט של כל שינוי
 */
export function detailedLogger(oldState, newState, options) {
    if (options.skipLogging || !window.CASHWISE_DEBUG) {
        return true;
    }
    
    console.group('🔄 State Update');
    
    // הצגת הבדלים
    const changes = findChanges(oldState, newState);
    if (changes.length > MATH_CONSTANTS.ZERO) {
        console.log('📊 Changes:', changes);
    }
    
    // מידע נוסף
    if (options.reason) {
        console.log('💬 Reason:', options.reason);
    }
    
    console.log('⏰ Timestamp:', new Date().toISOString());
    console.log('📦 Old State:', oldState);
    console.log('📦 New State:', newState);
    
    console.groupEnd();
    
    return true;
}

/**
 * לוג פשוט
 */
export function simpleLogger(oldState, newState, options) {
    if (options.skipLogging || !window.CASHWISE_DEBUG) {
        return true;
    }
    
    const changes = findChanges(oldState, newState);
    if (changes.length > MATH_CONSTANTS.ZERO) {
        console.log(`🔄 State updated (${changes.length} changes):`, changes);
    }
    
    return true;
}

/**
 * מציאת הבדלים בין states
 */
function findChanges(oldState, newState, path = '') {
    const changes = [];
    
    if (!oldState || !newState) return changes;
    
    // בדיקת כל השדות ב-newState
    for (const key of Object.keys(newState)) {
        const currentPath = path ? `${path}.${key}` : key;
        const oldValue = oldState[key];
        const newValue = newState[key];
        
        // ערך השתנה
        if (oldValue !== newValue) {
            // אובייקט - חיפוש רקורסיבי
            if (typeof newValue === 'object' && newValue !== null && !Array.isArray(newValue)) {
                changes.push(...findChanges(oldValue, newValue, currentPath));
            } else {
                changes.push({
                    path: currentPath,
                    oldValue,
                    newValue
                });
            }
        }
    }
    
    return changes;
}

// ===== Performance Middleware =====

/**
 * מדידת זמן ביצוע
 */
export function performanceMonitor(oldState, newState, options) {
    if (!window.CASHWISE_DEBUG) {
        return true;
    }
    
    const startTime = performance.now();
    
    // המתנה לסיום העדכון
    setTimeout(() => {
        const endTime = performance.now();
        const duration = endTime - startTime;
        
        if (duration > 100) { // יותר מ-100ms - איטי
            console.warn(`⚠️ Slow state update: ${duration.toFixed(2)}ms`);
        } else if (duration > 50) { // יותר מ-50ms - בינוני
            console.log(`⏱️ State update: ${duration.toFixed(2)}ms`);
        }
    }, 0);
    
    return true;
}

// ===== Dev Tools Middleware =====

/**
 * אינטגרציה עם Redux DevTools
 */
export function devTools(oldState, newState, options) {
    if (!window.__REDUX_DEVTOOLS_EXTENSION__) {
        return true;
    }
    
    // שליחה ל-DevTools
    window.__REDUX_DEVTOOLS_EXTENSION__.send(
        options.reason || 'State Update',
        newState
    );
    
    return true;
}

/**
 * שמירת היסטוריה בזיכרון לדיבאג
 */
export function memoryHistory(oldState, newState, options) {
    if (!window.CASHWISE_DEBUG) {
        return true;
    }
    
    // יצירת היסטוריה גלובלית
    if (!window._CASHWISE_HISTORY) {
        window._CASHWISE_HISTORY = [];
    }
    
    window._CASHWISE_HISTORY.push({
        timestamp: Date.now(),
        oldState: JSON.parse(JSON.stringify(oldState)),
        newState: JSON.parse(JSON.stringify(newState)),
        reason: options.reason
    });
    
    // הגבלה ל-50 שינויים אחרונים
    if (window._CASHWISE_HISTORY.length > 50) {
        window._CASHWISE_HISTORY.shift();
    }
    
    return true;
}

// ===== Business Logic Middleware =====

/**
 * טריגר אוטומטי להישגים
 */
export function achievementTriggers(oldState, newState, options) {
    // דלג אם כבר באמצע בדיקת הישג
    if (options.skipAchievements) {
        return true;
    }
    
    const triggers = [];
    
    // בדיקת שיעורים שהושלמו
    const oldLessons = oldState.user?.lessonsCompleted?.length || MATH_CONSTANTS.ZERO;
    const newLessons = newState.user?.lessonsCompleted?.length || MATH_CONSTANTS.ZERO;
    
    if (newLessons > oldLessons && newLessons === 4) {
        // השלמת כל השיעורים
        if (!newState.user.achievements.includes('knowledge-master')) {
            triggers.push({
                type: 'achievement',
                id: 'knowledge-master',
                message: '🎓 מאסטר הידע - השלמת את כל שיעורי האקדמיה!'
            });
        }
    }
    
    // בדיקת חיסכון
    const savings = newState.simulation?.character?.savings || MATH_CONSTANTS.ZERO;
    const oldSavings = oldState.simulation?.character?.savings || MATH_CONSTANTS.ZERO;
    
    if (savings >= 10000 && oldSavings < 10000) {
        if (!newState.user.achievements.includes('first-10k')) {
            triggers.push({
                type: 'achievement',
                id: 'first-10k',
                message: '💰 חוסך מצטיין - חסכת 10,000 ש"ח!'
            });
        }
    }
    
    // הפעלת טריגרים
    if (triggers.length > MATH_CONSTANTS.ZERO && !options.skipAchievements) {
        // שלח event מותאם
        setTimeout(() => {
            triggers.forEach(trigger => {
                window.dispatchEvent(new CustomEvent('cashwise:achievement', {
                    detail: trigger
                }));
            });
        }, 0);
    }
    
    return true;
}

/**
 * הגנה מפני spam של עדכונים
 */
export function rateLimiter() {
    let lastUpdate = MATH_CONSTANTS.ZERO;
    const MIN_INTERVAL = 10; // ms
    
    return (oldState, newState, options) => {
        if (options.skipRateLimit) {
            return true;
        }
        
        const now = Date.now();
        if (now - lastUpdate < MIN_INTERVAL) {
            console.warn('⚠️ State update rate limit reached');
            return false;
        }
        
        lastUpdate = now;
        return true;
    };
}

// ===== Preset Middleware Stacks =====

/**
 * Development - כל ה-middleware
 */
export const developmentMiddleware = [
    structureValidation,
    financialValidation,
    xpValidation,
    detailedLogger,
    performanceMonitor,
    devTools,
    memoryHistory,
    achievementTriggers
];

/**
 * Production - רק validation חיוני
 */
export const productionMiddleware = [
    structureValidation,
    financialValidation,
    xpValidation,
    rateLimiter(),
    achievementTriggers
];

/**
 * Testing - ללא לוגים
 */
export const testingMiddleware = [
    structureValidation,
    financialValidation,
    xpValidation
];

console.log('✅ State Middleware loaded');
