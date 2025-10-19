/**
 * ===========================================
 * 🌉 Global Bridge
 * ===========================================
 * גשר בין HTML onclick events לבין ES6 modules
 * 
 * קובץ זה חושף פונקציות מרכזיות ל-window scope
 * כדי לאפשר קריאה ישירה מה-HTML
 */

import { showSection, goBack, goHome, switchLessonTab } from './router.js';
import { addXP, loadGameState } from './state.js';
import { openProfileModal, closeProfileModal, openMentorSidebar, closeMentorSidebar } from '../modules/modals-sidebars.js';
import { openLesson, nextStep, previousStep, selectQuizAnswer, finishLesson, calculatePractice } from '../modules/lesson-player.js';
import { openGoalModal, closeGoalModal, openTipsModal, closeTipsModal } from '../modules/simulation-modals.js';
import { attemptOpenLockedLesson } from '../modules/lessons.js';
import { advanceMonth, resetSimulation, goToInvestmentLesson, dismissTrigger } from '../modules/simulation.js';
import { resetGameData } from '../modules/profile.js';
import { XP_CONFIG } from '../config/index.js';

// חשיפה גלובלית של פונקציות ניווט
window.showSection = showSection;
window.goBack = goBack;
window.goHome = goHome;
window.switchLessonTab = switchLessonTab;

// חשיפה גלובלית של פונקציות גיימיפיקציה
window.addXP = addXP;
window.loadGameState = loadGameState;

// חשיפה גלובלית של פונקציות Modals & Sidebars
window.openProfileModal = openProfileModal;
window.closeProfileModal = closeProfileModal;
window.openMentorSidebar = openMentorSidebar;
window.closeMentorSidebar = closeMentorSidebar;

// חשיפה גלובלית של פונקציות Lesson Player
window.openLesson = openLesson;
window.nextStep = nextStep;
window.previousStep = previousStep;
window.selectQuizAnswer = selectQuizAnswer;
window.finishLesson = finishLesson;
window.calculatePractice = calculatePractice;
window.attemptOpenLockedLesson = attemptOpenLockedLesson;

// חשיפה גלובלית של מודאלים בסימולטור
window.openGoalModal = openGoalModal;
window.closeGoalModal = closeGoalModal;
window.openTipsModal = openTipsModal;
window.closeTipsModal = closeTipsModal;

// חשיפה גלובלית של פונקציות סימולטור
window.advanceMonth = advanceMonth;
window.resetSimulation = resetSimulation;
window.goToInvestmentLesson = goToInvestmentLesson;
window.dismissTrigger = dismissTrigger;

// חשיפה גלובלית של פונקציות פרופיל
window.resetGameData = resetGameData;

// פונקציית עזר לעדכון XP bar
window.updateXPBar = function() {
    const state = loadGameState();
    const xpFill = document.getElementById('xp-fill');
    const xpText = document.getElementById('xp-text');
    const userLevel = document.getElementById('user-level');
    
    if (xpFill) {
        const currentXP = state.xp % XP_CONFIG.XP_PER_LEVEL;
        const percentage = currentXP;
        xpFill.style.width = percentage + '%';
    }
    
    if (xpText) {
        xpText.textContent = `${state.xp % XP_CONFIG.XP_PER_LEVEL}/${XP_CONFIG.XP_PER_LEVEL} XP`;
    }
    
    if (userLevel) {
        userLevel.textContent = `רמה ${state.level}`;
    }
};

// אובייקט CashWise גלובלי
window.CashWise = {
    showSection,
    goBack,
    goHome,
    switchLessonTab,
    addXP,
    loadGameState,
    updateXPBar: window.updateXPBar,
    version: '7.0',
    status: 'ready'
};

console.log('🌉 Global Bridge initialized:', Object.keys(window.CashWise));
console.log('✅ Functions available globally:', {
    showSection: typeof window.showSection,
    switchLessonTab: typeof window.switchLessonTab,
    addXP: typeof window.addXP,
    updateXPBar: typeof window.updateXPBar,
    advanceMonth: typeof window.advanceMonth,
    resetSimulation: typeof window.resetSimulation,
    goToInvestmentLesson: typeof window.goToInvestmentLesson,
    dismissTrigger: typeof window.dismissTrigger
});
