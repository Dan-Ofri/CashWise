/**
 * ===========================================
 * 👤 Profile Module
 * ===========================================
 * ניהול פרופיל משתמש ותצוגה
 */

import { getUserProfile, saveUserProfile, getUserIncome, loadGameState, ACHIEVEMENTS, fullGameReset } from '../core/state.js';

// New State System
import {
    subscribe,
    getUserXP,
    getUserLevel,
    getUnlockedAchievements,
    getCompletedLessonsCount,
    getUserStatus
} from '../state/index.js';

import { createProgressChart, createXPChart, updateChartData } from '../components/charts.js';
import { showSuccess } from '../utils/notifications.js';
import { 
    SIMULATION_CONFIG, 
    FINANCIAL_RULES, 
    LESSON_CONSTANTS,
    MATH_CONSTANTS,
    UI_TIMING 
} from '../config/index.js';

/**
 * טעינת נתוני פרופיל לטופס
 */
export function loadUserProfileToUI() {
    const profile = getUserProfile();
    
    // אם אין פרופיל, לא לעשות כלום (עדיין לא בסקשן פרופיל)
    if (!profile) {
        console.log('⏭️ Profile data not loaded yet - skipping UI update');
        return;
    }
    
    const fields = {
        'pf-income': profile.income || '',
        'pf-savingRate': profile.savingRate || '',
        'pf-risk': profile.risk || 'medium',
        'pf-horizon': profile.horizon || '',
        'pf-debtMonthly': profile.debtMonthly || '',
        'pf-mainGoal': profile.mainGoal || ''
    };
    
    Object.entries(fields).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) {
            element.value = value;
        }
    });
}

/**
 * שמירת נתוני פרופיל מהטופס
 */
export function saveUserProfileFromUI() {
    const profile = {
        income: parseFloat(document.getElementById('pf-income')?.value) || 0,
        savingRate: parseFloat(document.getElementById('pf-savingRate')?.value) || 0,
        risk: document.getElementById('pf-risk')?.value || 'medium',
        horizon: parseInt(document.getElementById('pf-horizon')?.value) || 0,
        debtMonthly: parseFloat(document.getElementById('pf-debtMonthly')?.value) || 0,
        mainGoal: document.getElementById('pf-mainGoal')?.value || ''
    };
    
    saveUserProfile(profile);
    showSuccess('הפרופיל נשמר בהצלחה!');
}

/**
 * הגדרת שמירה אוטומטית
 */
export function setupProfileAutosave() {
    const ids = ['pf-income', 'pf-savingRate', 'pf-risk', 'pf-horizon', 'pf-debtMonthly', 'pf-mainGoal'];
    
    ids.forEach(id => {
        const element = document.getElementById(id);
        if (!element) return;
        
        element.addEventListener('input', saveUserProfileFromUI);
        element.addEventListener('change', saveUserProfileFromUI);
    });
}

/**
 * חישוב תכנית חיסכון מומלצת
 */
export function calculateRecommendedPlan() {
    const profile = getUserProfile();
    const income = getUserIncome(SIMULATION_CONFIG.DEFAULT_SALARY);
    const output = document.getElementById('pf-plan');
    
    if (!output) return;
    
    // אם אין פרופיל, הצג הודעה כללית
    if (!profile) {
        output.innerHTML = '<p style="color: #999;">מלא את הפרטים למעלה כדי לקבל תכנית מותאמת אישית.</p>';
        return;
    }
    
    // פרמטרים בסיסיים
    const hasHighInterestDebt = (profile.debtMonthly || MATH_CONSTANTS.ZERO) > MATH_CONSTANTS.ZERO;
    const targetEmergencyMonths = FINANCIAL_RULES.EMERGENCY_FUND_MONTHS_DEFAULT;
    const emergencyTarget = Math.max(income * FINANCIAL_RULES.MIN_INCOME_MULTIPLIER, FINANCIAL_RULES.MIN_MONTHLY_INCOME) * targetEmergencyMonths;
    const suggestedSavingRate = profile.savingRate && profile.savingRate > MATH_CONSTANTS.ZERO ? profile.savingRate / MATH_CONSTANTS.PERCENT_TO_DECIMAL : FINANCIAL_RULES.DEFAULT_SAVING_RATE;
    const baseMonthlySave = Math.max(Math.round(income * suggestedSavingRate), FINANCIAL_RULES.MIN_MONTHLY_SAVE);
    
    // בניית המלצות
    const steps = [];
    
    if (hasHighInterestDebt) {
        steps.push('📉 שלב 1: תעדף פירעון חוב בריבית גבוהה לפני השקעות. שקול מיקוח ריבית/איחוד חובות.');
    }
    
    steps.push(`🛡️ שלב ${hasHighInterestDebt ? MATH_CONSTANTS.TWO : MATH_CONSTANTS.ONE}: בנה קרן חירום של ${targetEmergencyMonths} חודשים (~${emergencyTarget.toLocaleString()}₪).`);
    steps.push(`💰 חסוך לפחות ${Math.round(suggestedSavingRate * MATH_CONSTANTS.PERCENT_TO_DECIMAL)}% מההכנסה (~${baseMonthlySave.toLocaleString()}₪/חודש).`);
    steps.push('📊 לאחר חירום: הפנה את העודף להשקעות מדדיות בעלות נמוכה בהתאם לרמת הסיכון שלך.');
    
    if (profile.horizon >= FINANCIAL_RULES.LONG_TERM_HORIZON_YEARS && profile.risk === 'high') {
        steps.push('🚀 אופק 10+ ורמת סיכון גבוהה: הגדל רכיב מנייתי (לדוגמה 80/20).');
    }
    
    if (profile.risk === 'low') {
        steps.push('🧯 רמת סיכון נמוכה: העדף אג"ח/פיקדונות ושמור על תנודתיות נמוכה.');
    }
    
    // הערכת זמן להשגת יעד
    const monthlyToEmergency = Math.max(baseMonthlySave - (profile.debtMonthly || MATH_CONSTANTS.ZERO), MATH_CONSTANTS.ZERO);
    const monthsToGoal = monthlyToEmergency > MATH_CONSTANTS.ZERO ? Math.ceil(emergencyTarget / monthlyToEmergency) : Infinity;
    
    // הצגת התוכנית
    const html = `
        <div class="tip-box success">
            <strong>📋 תכנית חיסכון מומלצת:</strong>
            <ul>${steps.map(s => `<li>${s}</li>`).join('')}</ul>
            <div style="margin-top:8px;">
                ⏳ זמן משוער להשלמת קרן חירום: <strong>${isFinite(monthsToGoal) ? monthsToGoal + ' חודשים' : 'לא ניתן להעריך (חסרים נתונים)'}</strong>
            </div>
            ${profile.mainGoal ? `<div>🎯 יעד אישי: <strong>${profile.mainGoal}</strong></div>` : ''}
        </div>
    `;
    
    output.innerHTML = html;
}

/**
 * עדכון תצוגת פרופיל
 */
export function updateProfileDisplay() {
    const state = loadGameState();
    
    // עדכון נתונים בסיסיים
    const elements = {
        'profile-level': state.level,
        'profile-xp': `${state.xp} XP`,
        'profile-lessons': `${state.lessonsCompleted.filter(l => !l.startsWith('scenario-')).length}/${LESSON_CONSTANTS.TOTAL_LESSONS}`,
        'profile-achievements': `${state.achievements.length}/${LESSON_CONSTANTS.TOTAL_ACHIEVEMENTS}`
    };
    
    Object.entries(elements).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    });
    
    // עדכון גרפים
    updateProfileCharts();
}

/**
 * עדכון גרפי פרופיל
 */
export function updateProfileCharts() {
    const state = loadGameState();
    
    // גרף התקדמות
    const lessonsCount = state.lessonsCompleted.filter(l => !l.startsWith('scenario-')).length;
    const scenariosCount = state.lessonsCompleted.filter(l => l.startsWith('scenario-')).length;
    
    createProgressChart('progressChart', lessonsCount, LESSON_CONSTANTS.TOTAL_LESSONS, scenariosCount);
    
    // גרף XP
    createXPChart('xpChart', state.level, state.xp);
}

/**
 * עדכון רשימת הישגים
 */
export function updateAchievementsList() {
    const state = loadGameState();
    const container = document.getElementById('achievements-list');
    
    if (!container) return;
    
    container.innerHTML = '';
    
    // ✅ השתמש ב-import הרגיל מהראש
    ACHIEVEMENTS.forEach(achievement => {
        const unlocked = state.achievements.includes(achievement.id);
        
        const div = document.createElement('div');
        div.className = `achievement ${unlocked ? 'unlocked' : 'locked'}`;
        div.innerHTML = `
            <span class="ach-icon">${achievement.icon}</span>
            <div class="ach-info">
                <h4>${achievement.title}</h4>
                <p>${achievement.desc}</p>
                ${unlocked ? 
                    '<span class="ach-badge">✅ הושג</span>' : 
                    '<span class="ach-badge locked-badge">🔒 נעול</span>'
                }
            </div>
        `;
        
        container.appendChild(div);
    });
}

/**
 * איפוס מלא של המשחק
 */
export function resetGameData() {
    const confirmed = confirm(
        '⚠️ האם אתה בטוח שברצונך לאפס את כל המשחק?\n\n' +
        'פעולה זו תמחק:\n' +
        '✗ את כל ההתקדמות בסימולציה\n' +
        '✗ את כל השיעורים שלמדת\n' +
        '✗ את כל הנקודות וההישגים\n' +
        '✗ את הפרופיל הפיננסי\n\n' +
        'לא ניתן לשחזר נתונים אלו!'
    );
    
    if (!confirmed) {
        console.log('ביטול איפוס');
        return;
    }
    
    // ביצוע איפוס מלא
    fullGameReset();
    
    // הצגת הודעת הצלחה
    showSuccess('🔄 המשחק אופס בהצלחה! טוען מחדש...');
    
    // טעינה מחדש של הדף אחרי רגע
    setTimeout(() => {
        location.reload();
    }, UI_TIMING.PAGE_RELOAD_DELAY);
}

// חשיפה מיידית ל-window (לפני initProfile)
if (typeof window !== 'undefined') {
    window.resetGameData = resetGameData;
}

/**
 * אתחול מודול הפרופיל
 */
export function initProfile() {
    console.log('👤 Initializing Profile Module...');
    
    // רק מה שחיוני - השאר יקרה כשנכנסים למסך הפרופיל בפועל
    // עדכון תצוגה (פועל גם אם אין profile)
    updateProfileDisplay();
    
    // עדכון הישגים (פועל גם אם אין profile)
    updateAchievementsList();
    
    console.log('✅ Profile Module initialized');
}

/**
 * פונקציה שרצה כשנכנסים למסך הפרופיל בפועל
 */
export function activateProfileScreen() {
    console.log('🎯 Activating Profile Screen...');
    
    // טעינת נתונים לטופס
    loadUserProfileToUI();
    
    // הגדרת שמירה אוטומטית
    setupProfileAutosave();
    
    // חישוב תכנית מומלצת
    calculateRecommendedPlan();
    
    console.log('✅ Profile Screen activated');
}

// האזנה לאירוע כניסה למסך פרופיל
if (typeof window !== 'undefined') {
    window.addEventListener('app:profile:entered', activateProfileScreen);
}

// חשיפה גלובלית (תאימות לאחור)
if (typeof window !== 'undefined') {
    window.ProfileModule = {
        init: initProfile,
        update: updateProfileDisplay,
        loadUI: loadUserProfileToUI,
        saveUI: saveUserProfileFromUI,
        calculatePlan: calculateRecommendedPlan,
        activate: activateProfileScreen
    };
}