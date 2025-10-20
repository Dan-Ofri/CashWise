/**
 * ===========================================
 * 📅 Date & Time Utilities
 * ===========================================
 * פונקציות עזר לתאריכים ושעות
 */

import { TIME_CALCULATIONS, MATH_CONSTANTS } from '../config/index.js';

/**
 * פורמט תאריך לעברית
 */
export function formatDate(date = new Date()) {
    return date.toLocaleDateString('he-IL', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

/**
 * פורמט שעה
 */
export function formatTime(date = new Date()) {
    return date.toLocaleTimeString('he-IL', {
        hour: '2-digit',
        minute: '2-digit'
    });
}

/**
 * פורמט תאריך + שעה
 */
export function formatDateTime(date = new Date()) {
    return `${formatDate(date)} ${formatTime(date)}`;
}

/**
 * חישוב הפרש זמן בימים
 */
export function daysBetween(date1, date2) {
    return Math.round(Math.abs((date1 - date2) / TIME_CALCULATIONS.MILLISECONDS_PER_DAY));
}

/**
 * בדיקה אם תאריך עבר
 */
export function isPast(date) {
    return date < new Date();
}

/**
 * בדיקה אם תאריך בעתיד
 */
export function isFuture(date) {
    return date > new Date();
}

/**
 * הוספת ימים לתאריך
 */
export function addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

/**
 * הוספת חודשים לתאריך
 */
export function addMonths(date, months) {
    const result = new Date(date);
    result.setMonth(result.getMonth() + months);
    return result;
}

/**
 * קבלת תחילת החודש
 */
export function getMonthStart(date = new Date()) {
    return new Date(date.getFullYear(), date.getMonth(), MATH_CONSTANTS.ONE);
}

/**
 * קבלת סוף החודש
 */
export function getMonthEnd(date = new Date()) {
    return new Date(date.getFullYear(), date.getMonth() + MATH_CONSTANTS.ONE, MATH_CONSTANTS.ZERO);
}
