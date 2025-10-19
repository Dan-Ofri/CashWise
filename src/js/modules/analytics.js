/**
 * ===========================================
 * 📊 Analytics Module
 * ===========================================
 * ניתוח נתונים ותצוגת דשבורד
 */

import { getUserXP, getUserLevel, getUnlockedAchievements, getUserProfile } from '../core/state.js';
import { createProgressChart, createXPChart, createBarChart, createDoughnutChart } from '../components/charts.js';
import { formatCurrency } from '../utils/format.js';
import { 
    XP_CONFIG, 
    LESSON_CONSTANTS,
    MATH_CONSTANTS,
    TIME_CALCULATIONS 
} from '../config/index.js';

/**
 * עדכון גרף התקדמות
 */
export function updateProgressChart() {
    const xp = getUserXP();
    const level = getUserLevel();
    const nextLevelXP = level * XP_CONFIG.XP_PER_LEVEL;
    const progress = (xp / nextLevelXP) * MATH_CONSTANTS.PERCENT_TO_DECIMAL;
    
    const canvas = document.getElementById('progress-chart');
    if (!canvas) return;
    
    createProgressChart(canvas, progress, level);
}

/**
 * עדכון גרף XP
 */
export function updateXPChart() {
    const xp = getUserXP();
    const level = getUserLevel();
    const nextLevelXP = level * XP_CONFIG.XP_PER_LEVEL;
    
    const canvas = document.getElementById('xp-chart');
    if (!canvas) return;
    
    createXPChart(canvas, xp, nextLevelXP, level);
}

/**
 * עדכון גרף הישגים
 */
export function updateAchievementsChart() {
    const achievements = getUnlockedAchievements();
    const total = LESSON_CONSTANTS.TOTAL_ACHIEVEMENTS;
    const unlocked = achievements.length;
    const locked = total - unlocked;
    
    const canvas = document.getElementById('achievements-chart');
    if (!canvas) return;
    
    createDoughnutChart(canvas, {
        labels: ['נפתחו', 'נעולים'],
        datasets: [{
            data: [unlocked, locked],
            backgroundColor: ['#4CAF50', '#e0e0e0']
        }]
    });
}

/**
 * עדכון גרף פעילות לפי קטגוריה
 */
export function updateActivityChart() {
    const profile = getUserProfile();
    const canvas = document.getElementById('activity-chart');
    
    if (!canvas) return;
    
    // אם אין פרופיל, הצג נתוני 0
    if (!profile) {
        createBarChart(canvas, {
            labels: ['תקציב', 'השקעות', 'חיסכון', 'מנטור', 'סימולציה'],
            datasets: [{
                label: 'פעולות שבוצעו',
                data: [0, 0, 0, 0, 0],
                backgroundColor: '#2196F3'
            }]
        });
        return;
    }
    
    // נתוני דוגמה - בעתיד אפשר לשלוף מהיסטוריה
    const data = {
        labels: ['תקציב', 'השקעות', 'חיסכון', 'מנטור', 'סימולציה'],
        datasets: [{
            label: 'פעולות שבוצעו',
            data: [
                profile.budgetChecks || 0,
                profile.investmentCalcs || 0,
                profile.savingActions || 0,
                profile.mentorQuestions || 0,
                profile.simulationRuns || 0
            ],
            backgroundColor: '#2196F3'
        }]
    };
    
    createBarChart(canvas, data);
}

/**
 * עדכון סטטיסטיקות טקסט
 */
export function updateTextStats() {
    const xp = getUserXP();
    const level = getUserLevel();
    const achievements = getUnlockedAchievements();
    const profile = getUserProfile();
    
    // XP ורמה
    const xpEl = document.getElementById('stat-xp');
    if (xpEl) xpEl.textContent = xp.toLocaleString();
    
    const levelEl = document.getElementById('stat-level');
    if (levelEl) levelEl.textContent = level;
    
    // הישגים
    const achievementsEl = document.getElementById('stat-achievements');
    if (achievementsEl) achievementsEl.textContent = `${achievements.length}/${LESSON_CONSTANTS.TOTAL_ACHIEVEMENTS}`;
    
    // הכנסה חודשית (אם אין פרופיל, הצג 0)
    const incomeEl = document.getElementById('stat-income');
    if (incomeEl) incomeEl.textContent = formatCurrency(profile?.income || MATH_CONSTANTS.ZERO);
    
    // יעד חיסכון (אם אין פרופיל, הצג 0%)
    const savingGoalEl = document.getElementById('stat-saving-goal');
    if (savingGoalEl) {
        if (!profile || !profile.income) {
            savingGoalEl.textContent = '0%';
        } else {
            const savingRate = ((profile.savingsGoal || MATH_CONSTANTS.ZERO) / profile.income) * MATH_CONSTANTS.PERCENT_TO_DECIMAL;
            savingGoalEl.textContent = `${savingRate.toFixed(MATH_CONSTANTS.ONE)}%`;
        }
    }
    
    // ימים פעילים
    const activeDaysEl = document.getElementById('stat-active-days');
    if (activeDaysEl) {
        const firstVisit = localStorage.getItem('first-visit') || new Date().toISOString();
        const days = Math.floor((Date.now() - new Date(firstVisit).getTime()) / TIME_CALCULATIONS.MILLISECONDS_PER_DAY) + MATH_CONSTANTS.ONE;
        activeDaysEl.textContent = days;
    }
}

/**
 * עדכון כל הגרפים
 */
export function updateAllCharts() {
    updateProgressChart();
    updateXPChart();
    updateAchievementsChart();
    updateActivityChart();
    updateTextStats();
}

/**
 * רענון דשבורד מלא
 */
export function refreshDashboard() {
    console.log('📊 Refreshing Analytics Dashboard...');
    
    updateAllCharts();
    
    // הוספת תאריך עדכון אחרון
    const lastUpdateEl = document.getElementById('last-dashboard-update');
    if (lastUpdateEl) {
        const now = new Date();
        lastUpdateEl.textContent = `עודכן לאחרונה: ${now.toLocaleTimeString('he-IL')}`;
    }
}

/**
 * אתחול מודול Analytics
 */
export function initAnalytics() {
    console.log('📊 Initializing Analytics Module...');
    
    // לא מריץ updateAllCharts כאן - רק כשנכנסים למסך
    // הגרפים דורשים canvas elements שאולי עדיין לא קיימים
    
    // כפתור רענון ידני (אם קיים)
    const refreshBtn = document.getElementById('refresh-dashboard-btn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', refreshDashboard);
    }
    
    console.log('✅ Analytics Module initialized');
}

/**
 * אקטיבציה מלאה של מסך Analytics (רץ כשנכנסים למסך)
 */
export function activateAnalyticsScreen() {
    console.log('🎯 Activating Analytics Screen...');
    
    // עדכון ראשוני
    updateAllCharts();
    
    // רענון אוטומטי כל 30 שניות (אופציונלי)
    const autoRefresh = localStorage.getItem('analytics-auto-refresh') === 'true';
    if (autoRefresh) {
        // נקה interval קודם אם קיים
        if (window._analyticsInterval) {
            clearInterval(window._analyticsInterval);
        }
        window._analyticsInterval = setInterval(refreshDashboard, 30000);
    }
    
    console.log('✅ Analytics Screen activated');
}

// האזנה לאירוע כניסה למסך Analytics
if (typeof window !== 'undefined') {
    window.addEventListener('app:analytics:refresh', activateAnalyticsScreen);
}

// חשיפה גלובלית (תאימות לאחור)
if (typeof window !== 'undefined') {
    window.AnalyticsModule = {
        init: initAnalytics,
        refresh: refreshDashboard,
        updateCharts: updateAllCharts,
        activate: activateAnalyticsScreen
    };
    window.updateProgressChart = updateProgressChart;
    window.updateXPChart = updateXPChart;
    window.refreshDashboard = refreshDashboard;
}
