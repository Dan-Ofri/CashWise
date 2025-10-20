/**
 * ===========================================
 * 🔍 State Selectors
 * ===========================================
 * כל השאילתות והחישובים על ה-state
 * 
 * עקרון: Selectors הם pure functions
 * קלט: state
 * פלט: ערך מחושב
 */

import { store } from './store.js';
import { 
    XP_CONFIG, 
    LEVEL_MILESTONES,
    FINANCIAL_RULES,
    BUDGET_RULES,
    MATH_CONSTANTS 
} from '../config/index.js';

// ===== User Selectors =====

/**
 * קבלת XP נוכחי
 */
export function getUserXP() {
    return store.get('user.xp') || MATH_CONSTANTS.ZERO;
}

/**
 * קבלת רמה נוכחית
 */
export function getUserLevel() {
    return store.get('user.level') || MATH_CONSTANTS.ONE;
}

/**
 * חישוב XP הנדרש לרמה הבאה
 */
export function getNextLevelXP() {
    const currentLevel = getUserLevel();
    return currentLevel * XP_CONFIG.XP_PER_LEVEL;
}

/**
 * חישוב התקדמות ברמה הנוכחית (0-100%)
 */
export function getLevelProgress() {
    const xp = getUserXP();
    const level = getUserLevel();
    const xpInCurrentLevel = xp - ((level - MATH_CONSTANTS.ONE) * XP_CONFIG.XP_PER_LEVEL);
    const xpNeededForLevel = XP_CONFIG.XP_PER_LEVEL;
    
    return Math.min(
        (xpInCurrentLevel / xpNeededForLevel) * MATH_CONSTANTS.PERCENT_TO_DECIMAL, 
        MATH_CONSTANTS.PERCENT_TO_DECIMAL
    );
}

/**
 * בדיקה אם הישג פתוח
 */
export function isAchievementUnlocked(achievementId) {
    const achievements = store.get('user.achievements') || [];
    return achievements.includes(achievementId);
}

/**
 * קבלת כל ההישגים הפתוחים
 */
export function getUnlockedAchievements() {
    return store.get('user.achievements') || [];
}

/**
 * ספירת הישגים
 */
export function getAchievementCount() {
    return getUnlockedAchievements().length;
}

/**
 * בדיקה אם שיעור הושלם
 */
export function isLessonCompleted(lessonId) {
    const lessons = store.get('user.lessonsCompleted') || [];
    return lessons.includes(lessonId);
}

/**
 * קבלת כל השיעורים שהושלמו
 */
export function getCompletedLessons() {
    return store.get('user.lessonsCompleted') || [];
}

/**
 * ספירת שיעורים שהושלמו
 */
export function getCompletedLessonsCount() {
    return getCompletedLessons().length;
}

/**
 * חישוב אחוז השלמת האקדמיה
 */
export function getAcademyCompletion(totalLessons = 4) {
    return (getCompletedLessonsCount() / totalLessons) * MATH_CONSTANTS.PERCENT_TO_DECIMAL;
}

/**
 * בדיקה אם פעולה הושלמה
 */
export function isActionCompleted(actionId) {
    const actions = store.get('user.actionsCompleted') || [];
    return actions.includes(actionId);
}

/**
 * קבלת כל הפעולות שהושלמו
 */
export function getCompletedActions() {
    return store.get('user.actionsCompleted') || [];
}

/**
 * קבלת זמן כניסה אחרון
 */
export function getLastLogin() {
    return store.get('user.lastLogin');
}

/**
 * קבלת זמן יצירת החשבון
 */
export function getAccountCreatedAt() {
    return store.get('user.createdAt');
}

// ===== Simulation Selectors =====

/**
 * בדיקה אם סימולציה פעילה
 */
export function isSimulationActive() {
    return store.get('simulation.isActive') || false;
}

/**
 * קבלת דמות הסימולציה
 */
export function getSimCharacter() {
    return store.get('simulation.character');
}

/**
 * קבלת חודש נוכחי בסימולציה
 */
export function getCurrentMonth() {
    return store.get('simulation.currentMonth') || MATH_CONSTANTS.ZERO;
}

/**
 * חישוב גיל נוכחי בסימולציה
 */
export function getCurrentAge() {
    const character = getSimCharacter();
    const month = getCurrentMonth();
    
    if (!character) return null;
    
    return character.age + Math.floor(month / FINANCIAL_RULES.MONTHS_PER_YEAR);
}

/**
 * קבלת כל אירועי הסימולציה
 */
export function getSimEvents() {
    return store.get('simulation.events') || [];
}

/**
 * קבלת אירועים לפי סוג
 */
export function getSimEventsByType(type) {
    return getSimEvents().filter(event => event.type === type);
}

/**
 * קבלת היסטוריית הסימולציה
 */
export function getSimHistory() {
    return store.get('simulation.history') || [];
}

/**
 * קבלת חיסכון נוכחי
 */
export function getCurrentSavings() {
    const character = getSimCharacter();
    return character ? character.savings : MATH_CONSTANTS.ZERO;
}

/**
 * קבלת משכורת נוכחית
 */
export function getCurrentSalary() {
    const character = getSimCharacter();
    return character ? character.salary : MATH_CONSTANTS.ZERO;
}

/**
 * קבלת הוצאות נוכחיות
 */
export function getCurrentExpenses() {
    const character = getSimCharacter();
    return character ? character.expenses : MATH_CONSTANTS.ZERO;
}

/**
 * חישוב יתרה חודשית
 */
export function getMonthlyBalance() {
    return getCurrentSalary() - getCurrentExpenses();
}

/**
 * חישוב שיעור חיסכון חודשי
 */
export function getSavingsRate() {
    const salary = getCurrentSalary();
    if (salary === MATH_CONSTANTS.ZERO) return MATH_CONSTANTS.ZERO;
    
    const balance = getMonthlyBalance();
    return (balance / salary) * MATH_CONSTANTS.PERCENT_TO_DECIMAL;
}

/**
 * בדיקה אם שיעור החיסכון בריא
 */
export function isHealthySavingsRate() {
    const rate = getSavingsRate();
    return rate >= BUDGET_RULES.MIN_SAVINGS_RATE;
}

/**
 * חישוב זמן עד למטרה
 */
export function getMonthsToGoal(goalAmount) {
    const savings = getCurrentSavings();
    const monthlyBalance = getMonthlyBalance();
    
    if (monthlyBalance <= MATH_CONSTANTS.ZERO) return Infinity;
    
    const remaining = goalAmount - savings;
    if (remaining <= MATH_CONSTANTS.ZERO) return MATH_CONSTANTS.ZERO;
    
    return Math.ceil(remaining / monthlyBalance);
}

/**
 * בדיקה אם יש קרן חירום מספקת
 */
export function hasEmergencyFund() {
    const savings = getCurrentSavings();
    const expenses = getCurrentExpenses();
    const monthsCovered = savings / expenses;
    
    return monthsCovered >= FINANCIAL_RULES.EMERGENCY_FUND_MONTHS_MIN;
}

/**
 * חישוב כמה חודשים מכסה קרן החירום
 */
export function getEmergencyFundMonths() {
    const savings = getCurrentSavings();
    const expenses = getCurrentExpenses();
    
    if (expenses === MATH_CONSTANTS.ZERO) return MATH_CONSTANTS.ZERO;
    
    return savings / expenses;
}

// ===== UI Selectors =====

/**
 * קבלת section נוכחי
 */
export function getCurrentSection() {
    return store.get('ui.currentSection') || 'opening';
}

/**
 * בדיקה אם modal פתוח
 */
export function isModalOpen(modalId) {
    const modals = store.get('ui.modalsOpen') || [];
    return modals.includes(modalId);
}

/**
 * קבלת כל המודלים הפתוחים
 */
export function getOpenModals() {
    return store.get('ui.modalsOpen') || [];
}

/**
 * בדיקה אם יש מודל פתוח כרגע
 */
export function hasOpenModal() {
    return getOpenModals().length > MATH_CONSTANTS.ZERO;
}

/**
 * בדיקה אם באמצע טעינה
 */
export function isLoading() {
    return store.get('ui.loading') || false;
}

/**
 * קבלת כל השגיאות
 */
export function getErrors() {
    return store.get('ui.errors') || [];
}

/**
 * בדיקה אם יש שגיאות
 */
export function hasErrors() {
    return getErrors().length > MATH_CONSTANTS.ZERO;
}

// ===== Metadata Selectors =====

/**
 * קבלת גרסת האפליקציה
 */
export function getAppVersion() {
    return store.get('meta.version') || '1.0.0';
}

/**
 * קבלת זמן שמירה אחרון
 */
export function getLastSaved() {
    return store.get('meta.lastSaved');
}

/**
 * בדיקה אם יש שינויים שלא נשמרו
 */
export function isDirty() {
    return store.get('meta.isDirty') || false;
}

// ===== Complex Selectors (Composed) =====

/**
 * קבלת סטטוס מלא של המשתמש
 */
export function getUserStatus() {
    return {
        xp: getUserXP(),
        level: getUserLevel(),
        nextLevelXP: getNextLevelXP(),
        levelProgress: getLevelProgress(),
        achievements: getUnlockedAchievements(),
        achievementCount: getAchievementCount(),
        lessonsCompleted: getCompletedLessons(),
        lessonsCount: getCompletedLessonsCount(),
        academyCompletion: getAcademyCompletion(),
        lastLogin: getLastLogin(),
        accountCreated: getAccountCreatedAt()
    };
}

/**
 * קבלת סטטוס מלא של הסימולציה
 */
export function getSimulationStatus() {
    if (!isSimulationActive()) {
        return { active: false };
    }
    
    return {
        active: true,
        character: getSimCharacter(),
        currentMonth: getCurrentMonth(),
        currentAge: getCurrentAge(),
        savings: getCurrentSavings(),
        salary: getCurrentSalary(),
        expenses: getCurrentExpenses(),
        monthlyBalance: getMonthlyBalance(),
        savingsRate: getSavingsRate(),
        isHealthySavingsRate: isHealthySavingsRate(),
        emergencyFundMonths: getEmergencyFundMonths(),
        hasEmergencyFund: hasEmergencyFund(),
        events: getSimEvents(),
        history: getSimHistory()
    };
}

/**
 * קבלת מצב כספי מפורט
 */
export function getFinancialHealth() {
    if (!isSimulationActive()) {
        return null;
    }
    
    const savingsRate = getSavingsRate();
    const emergencyMonths = getEmergencyFundMonths();
    
    let score = MATH_CONSTANTS.ZERO;
    let rating = '';
    
    // ציון לפי שיעור חיסכון (50 נקודות)
    if (savingsRate >= BUDGET_RULES.IDEAL_SAVINGS_RATE) {
        score += 50;
    } else if (savingsRate >= BUDGET_RULES.MIN_SAVINGS_RATE) {
        score += 30;
    } else if (savingsRate > MATH_CONSTANTS.ZERO) {
        score += 10;
    }
    
    // ציון לפי קרן חירום (50 נקודות)
    if (emergencyMonths >= FINANCIAL_RULES.EMERGENCY_FUND_MONTHS_MAX) {
        score += 50;
    } else if (emergencyMonths >= FINANCIAL_RULES.EMERGENCY_FUND_MONTHS_MIN) {
        score += 30;
    } else if (emergencyMonths > MATH_CONSTANTS.ZERO) {
        score += 10;
    }
    
    // דירוג
    if (score >= 80) rating = '⭐⭐⭐⭐⭐ מצוין';
    else if (score >= 60) rating = '⭐⭐⭐⭐ טוב מאוד';
    else if (score >= 40) rating = '⭐⭐⭐ בסדר';
    else if (score >= 20) rating = '⭐⭐ צריך שיפור';
    else rating = '⭐ מצריך תשומת לב';
    
    return {
        score,
        rating,
        savingsRate,
        emergencyMonths,
        recommendations: getRecommendations()
    };
}

/**
 * קבלת המלצות פיננסיות
 */
export function getRecommendations() {
    const recommendations = [];
    
    if (!isSimulationActive()) {
        return recommendations;
    }
    
    const savingsRate = getSavingsRate();
    const emergencyMonths = getEmergencyFundMonths();
    
    // המלצות לפי שיעור חיסכון
    if (savingsRate < BUDGET_RULES.MIN_SAVINGS_RATE) {
        recommendations.push({
            type: 'warning',
            message: 'שיעור החיסכון נמוך מדי. מומלץ לחסוך לפחות 20% מההכנסה.',
            action: 'הקטנת הוצאות'
        });
    }
    
    // המלצות לפי קרן חירום
    if (emergencyMonths < FINANCIAL_RULES.EMERGENCY_FUND_MONTHS_MIN) {
        recommendations.push({
            type: 'critical',
            message: 'אין לך קרן חירום מספקת. מומלץ לחסוך לפחות 3-6 חודשי הוצאות.',
            action: 'בניית קרן חירום'
        });
    }
    
    return recommendations;
}

console.log('✅ State Selectors loaded');
