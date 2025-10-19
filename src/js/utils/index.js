/**
 * ===========================================
 * 🛠️ Utilities - Index
 * ===========================================
 * ייצוא מרכזי של כל פונקציות העזר
 */

// Notifications
export {
    showNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo
} from './notifications.js';

// UI Effects
export {
    addRippleEffect,
    smoothScrollTo,
    setButtonLoading,
    celebrateAchievement,
    animateProgressBar,
    animateNumber,
    setupLazyLoading,
    initUIEffects
} from './ui-effects.js';

// Format & Math
export {
    formatCurrency,
    formatPercent,
    roundTo,
    calculatePercent,
    calculateCompoundInterest,
    calculateMonthlyPayment,
    calculateROI,
    randomBetween,
    randomNormal,
    clamp,
    lerp
} from './format.js';

// Validation
export {
    validateInput,
    isNotEmpty,
    isPositiveNumber,
    isInRange,
    isValidEmail,
    isValidIsraeliPhone,
    validateBudget,
    sanitizeNumber,
    sanitizeText
} from './validation.js';

// Performance
export {
    debounce,
    throttle,
    measureTime,
    memoize,
    lazyLoad
} from './performance.js';

// Storage
export {
    saveToStorage,
    loadFromStorage,
    removeFromStorage,
    clearStorage,
    hasKey,
    getAllKeys,
    exportAllData,
    importAllData,
    STORAGE_KEYS
} from './storage.js';

// Error Handling
export {
    handleError,
    tryCatch,
    assertElement,
    assert
} from './errors.js';

// Date & Time
export {
    formatDate,
    formatTime,
    formatDateTime,
    daysBetween,
    isPast,
    isFuture,
    addDays,
    addMonths,
    getMonthStart,
    getMonthEnd
} from './date.js';
