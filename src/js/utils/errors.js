/**
 * ===========================================
 * 🛠️ Error Handling Utilities
 * ===========================================
 * ניהול שגיאות מרכזי
 */

import { showError } from './notifications.js';

/**
 * טיפול כללי בשגיאות
 * @param {Error} error - אובייקט השגיאה
 * @param {string} userMessage - הודעה למשתמש
 * @param {boolean} showNotification - האם להציג הודעה למשתמש
 */
export function handleError(error, userMessage = 'אירעה שגיאה. אנא נסה שוב.', showNotification = true) {
    // לוג מפורט ל-console
    console.error('❌ Error:', {
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
    });
    
    // הצגת הודעה למשתמש
    if (showNotification) {
        showError(userMessage);
    }
    
    // שליחה לאנליטיקס (עתידי)
    // sendErrorToAnalytics(error);
    
    return false;
}

/**
 * Wrapper ל-try-catch עם טיפול אוטומטי
 */
export async function tryCatch(fn, errorMessage) {
    try {
        return await fn();
    } catch (error) {
        return handleError(error, errorMessage);
    }
}

/**
 * אימות קיום אלמנט DOM
 */
export function assertElement(elementId, errorMessage = 'אלמנט לא נמצא') {
    const element = document.getElementById(elementId);
    if (!element) {
        throw new Error(`Element not found: ${elementId}`);
    }
    return element;
}

/**
 * בדיקת תנאי עם זריקת שגיאה
 */
export function assert(condition, message) {
    if (!condition) {
        throw new Error(`Assertion failed: ${message}`);
    }
}
