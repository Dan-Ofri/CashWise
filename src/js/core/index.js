/**
 * ===========================================
 * 🎯 Core - Index
 * ===========================================
 * ייצוא מרכזי של כל ה-Core modules
 */

// App
export { default as App } from './app.js';

// State Management
export {
    loadGameState,
    saveGameState,
    getUserXP,
    getUserLevel,
    addXP,
    checkAchievement,
    markLessonComplete,
    isLessonComplete,
    getAllAchievements,
    getUnlockedAchievements,
    getLockedAchievements,
    resetGameState,
    mentorActionDone,
    markMentorActionDone,
    getUserProfile,
    saveUserProfile,
    updateUserProfile,
    getUserIncome,
    saveSimulation,
    loadSimulation,
    clearSimulation,
    onStateChange,
    emitStateChange,
    emitAppEvent,
    getGameState,
    ACHIEVEMENTS
} from './state.js';

// Router
export {
    showSection,
    getCurrentSection,
    getNavigationHistory,
    goBack,
    goHome,
    canGoBack,
    initRouter,
    registerSection,
    getAllSections,
    getSectionTitle,
    switchLessonTab
} from './router.js';
