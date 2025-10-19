/**
 * ===========================================
 * ✅ Validation Utilities
 * ===========================================
 * פונקציות אימות קלטים
 */

import { showError } from './notifications.js';

/**
 * אימות קלט עם feedback ויזואלי
 * @param {HTMLInputElement} input - שדה קלט
 * @param {Function} validationFn - פונקציית אימות
 * @param {string} errorMessage - הודעת שגיאה
 * @returns {boolean}
 */
export function validateInput(input, validationFn, errorMessage) {
    const isValid = validationFn(input.value);
    
    if (!isValid) {
        // סטייל שגיאה
        input.style.borderColor = '#EF4444';
        input.style.boxShadow = '0 0 0 4px rgba(239, 68, 68, 0.1)';
        input.classList.add('shake');
        setTimeout(() => input.classList.remove('shake'), 500);
        
        showError(errorMessage);
        return false;
    } else {
        // סטייל הצלחה
        input.style.borderColor = '#10B981';
        input.style.boxShadow = '0 0 0 4px rgba(16, 185, 129, 0.1)';
        return true;
    }
}

/**
 * בדיקה שהשדה לא ריק
 */
export function isNotEmpty(value) {
    return value && value.trim().length > 0;
}

/**
 * בדיקת מספר חיובי
 */
export function isPositiveNumber(value) {
    const num = parseFloat(value);
    return !isNaN(num) && num > 0;
}

/**
 * בדיקת מספר בטווח
 */
export function isInRange(value, min, max) {
    const num = parseFloat(value);
    return !isNaN(num) && num >= min && num <= max;
}

/**
 * בדיקת אימייל (פשוטה)
 */
export function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

/**
 * בדיקת טלפון ישראלי
 */
export function isValidIsraeliPhone(phone) {
    const cleaned = phone.replace(/\D/g, '');
    return /^0(5[0-9]|[2-4]|[8-9])[0-9]{7}$/.test(cleaned);
}

/**
 * בדיקת תקציב (סכום כל הקטגוריות לא עולה על הכנסה)
 */
export function validateBudget(categories, income) {
    const total = Object.values(categories).reduce((sum, val) => sum + val, 0);
    return total <= income;
}

/**
 * ניקוי ואימות מספר
 */
export function sanitizeNumber(value, defaultValue = 0) {
    const num = parseFloat(value);
    return isNaN(num) ? defaultValue : num;
}

/**
 * הסרת תווים מיוחדים משדה טקסט
 */
export function sanitizeText(text) {
    return text.trim().replace(/<[^>]*>/g, '');
}
