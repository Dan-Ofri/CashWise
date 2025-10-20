/**
 * ===========================================
 * ⏱️ Performance Utilities
 * ===========================================
 * פונקציות לשיפור ביצועים
 */

import { MATH_CONSTANTS } from '../config/index.js';

/**
 * Debounce - עיכוב ביצוע פונקציה
 * שימושי לאירועי input, scroll, resize
 * @param {Function} func - פונקציה לביצוע
 * @param {number} wait - זמן המתנה במילישניות
 * @returns {Function}
 */
export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle - הגבלת תדירות ביצוע
 * שימושי לאירועי scroll, mousemove
 * @param {Function} func - פונקציה לביצוע
 * @param {number} limit - הגבלת זמן במילישניות
 * @returns {Function}
 */
export function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * מדידת זמן ביצוע פונקציה
 */
export function measureTime(func, label = 'Function') {
    const start = performance.now();
    const result = func();
    const end = performance.now();
    console.log(`⏱️ ${label} took ${(end - start).toFixed(MATH_CONSTANTS.TWO)}ms`);
    return result;
}

/**
 * מטמון פשוט לתוצאות פונקציות (Memoization)
 */
export function memoize(func) {
    const cache = new Map();
    return function(...args) {
        const key = JSON.stringify(args);
        if (cache.has(key)) {
            return cache.get(key);
        }
        const result = func.apply(this, args);
        cache.set(key, result);
        return result;
    };
}

/**
 * טעינה עצלה של קומפוננטה
 */
export async function lazyLoad(importFunction) {
    try {
        const module = await importFunction();
        return module;
    } catch (error) {
        console.error('Failed to lazy load module:', error);
        return null;
    }
}
