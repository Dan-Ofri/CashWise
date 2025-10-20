/**
 * ===========================================
 * 📦 State Management - Main Exports
 * ===========================================
 * מערכת ניהול state מודרנית ל-CashWise
 * 
 * עקרונות:
 * 1. Immutability - כל עדכון יוצר state חדש
 * 2. Single Source of Truth - state אחד מרכזי
 * 3. Event-Driven - subscribe לשינויים
 * 4. Time Travel - undo/redo
 * 5. Middleware - validation, logging, dev tools
 */

// ===== Core Store =====
export { 
    store,
    getState, 
    setState, 
    subscribe 
} from './store.js';

// ===== Actions (כל הפעולות המותרות) =====
export {
    // User Actions
    addXP,
    unlockAchievement,
    completeLesson,
    addCompletedAction,
    updateLastLogin,
    
    // Simulation Actions
    startSimulation,
    updateSimCharacter,
    advanceMonth,
    addSimEvent,
    endSimulation,
    
    // UI Actions
    setCurrentSection,
    openModal,
    closeModal,
    setLoading,
    addError,
    clearErrors,
    
    // Metadata Actions
    markDirty,
    markClean,
    
    // Complex Actions
    resetAll,
    importState,
    exportState
} from './actions.js';

// ===== Selectors (כל השאילתות) =====
export {
    // User Selectors
    getUserXP,
    getUserLevel,
    getNextLevelXP,
    getLevelProgress,
    isAchievementUnlocked,
    getUnlockedAchievements,
    getAchievementCount,
    isLessonCompleted,
    getCompletedLessons,
    getCompletedLessonsCount,
    getAcademyCompletion,
    isActionCompleted,
    getCompletedActions,
    getLastLogin,
    getAccountCreatedAt,
    
    // Simulation Selectors
    isSimulationActive,
    getSimCharacter,
    getCurrentMonth,
    getCurrentAge,
    getSimEvents,
    getSimEventsByType,
    getSimHistory,
    getCurrentSavings,
    getCurrentSalary,
    getCurrentExpenses,
    getMonthlyBalance,
    getSavingsRate,
    isHealthySavingsRate,
    getMonthsToGoal,
    hasEmergencyFund,
    getEmergencyFundMonths,
    
    // UI Selectors
    getCurrentSection,
    isModalOpen,
    getOpenModals,
    hasOpenModal,
    isLoading,
    getErrors,
    hasErrors,
    
    // Metadata Selectors
    getAppVersion,
    getLastSaved,
    isDirty,
    
    // Complex Selectors
    getUserStatus,
    getSimulationStatus,
    getFinancialHealth,
    getRecommendations
} from './selectors.js';

// ===== Middleware =====
export {
    // Validation
    financialValidation,
    xpValidation,
    structureValidation,
    
    // Logging
    detailedLogger,
    simpleLogger,
    
    // Performance
    performanceMonitor,
    
    // Dev Tools
    devTools,
    memoryHistory,
    
    // Business Logic
    achievementTriggers,
    rateLimiter,
    
    // Presets
    developmentMiddleware,
    productionMiddleware,
    testingMiddleware
} from './middleware.js';

console.log('✅ State Management System loaded');
