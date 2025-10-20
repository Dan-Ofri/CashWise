/**
 * ===========================================
 * 🔢 Format & Math Utilities
 * ===========================================
 * פונקציות עזר לפורמט מספרים וחישובים
 */

import { MATH_CONSTANTS, FINANCIAL_RULES } from '../config/index.js';

/**
 * פורמט מספר למטבע ישראלי
 * @param {number} amount - סכום
 * @param {boolean} withSymbol - האם להוסיף ₪
 * @returns {string}
 */
export function formatCurrency(amount, withSymbol = true) {
    const formatted = Math.round(amount).toLocaleString('he-IL');
    return withSymbol ? `${formatted}₪` : formatted;
}

/**
 * פורמט אחוז
 * @param {number} value - ערך (0-1 או 0-100)
 * @param {boolean} isDecimal - האם הערך בעשרוני (0-1)
 * @returns {string}
 */
export function formatPercent(value, isDecimal = false) {
    const percent = isDecimal ? value * MATH_CONSTANTS.PERCENT_TO_DECIMAL : value;
    return `${Math.round(percent * MATH_CONSTANTS.TEN) / MATH_CONSTANTS.TEN}%`;
}

/**
 * עיגול למספר עשרוני
 */
export function roundTo(value, decimals = MATH_CONSTANTS.TWO) {
    const multiplier = Math.pow(MATH_CONSTANTS.TEN, decimals);
    return Math.round(value * multiplier) / multiplier;
}

/**
 * חישוב אחוז מתוך סכום
 */
export function calculatePercent(part, total) {
    if (total === MATH_CONSTANTS.ZERO) return MATH_CONSTANTS.ZERO;
    return (part / total) * MATH_CONSTANTS.PERCENT_TO_DECIMAL;
}

/**
 * חישוב ריבית דריבית
 * @param {number} principal - קרן
 * @param {number} rate - ריבית שנתית (0-1)
 * @param {number} years - שנים
 * @param {number} compoundsPerYear - תדירות הצטברות (12 = חודשי)
 * @returns {number}
 */
export function calculateCompoundInterest(principal, rate, years, compoundsPerYear = FINANCIAL_RULES.MONTHS_PER_YEAR) {
    return principal * Math.pow((MATH_CONSTANTS.ONE + rate / compoundsPerYear), compoundsPerYear * years);
}

/**
 * חישוב החזר חודשי להלוואה
 * @param {number} principal - סכום ההלוואה
 * @param {number} annualRate - ריבית שנתית (0-1)
 * @param {number} months - מספר חודשים
 * @returns {number}
 */
export function calculateMonthlyPayment(principal, annualRate, months) {
    if (annualRate === MATH_CONSTANTS.ZERO) return principal / months;
    
    const monthlyRate = annualRate / FINANCIAL_RULES.MONTHS_PER_YEAR;
    return (principal * monthlyRate * Math.pow(MATH_CONSTANTS.ONE + monthlyRate, months)) / 
           (Math.pow(MATH_CONSTANTS.ONE + monthlyRate, months) - MATH_CONSTANTS.ONE);
}

/**
 * חישוב ROI (תשואה על השקעה)
 */
export function calculateROI(initialInvestment, finalValue) {
    if (initialInvestment === MATH_CONSTANTS.ZERO) return MATH_CONSTANTS.ZERO;
    return ((finalValue - initialInvestment) / initialInvestment) * MATH_CONSTANTS.PERCENT_TO_DECIMAL;
}

/**
 * מחולל מספר רנדומלי בטווח
 */
export function randomBetween(min, max) {
    return Math.random() * (max - min) + min;
}

/**
 * מחולל נורמלי (Box-Muller transform)
 * @param {number} mean - ממוצע
 * @param {number} std - סטיית תקן
 * @returns {number}
 */
export function randomNormal(mean = MATH_CONSTANTS.ZERO, std = MATH_CONSTANTS.ONE) {
    let u = MATH_CONSTANTS.ZERO, v = MATH_CONSTANTS.ZERO;
    while (u === MATH_CONSTANTS.ZERO) u = Math.random();
    while (v === MATH_CONSTANTS.ZERO) v = Math.random();
    const z = Math.sqrt(MATH_CONSTANTS.NEGATIVE_TWO * Math.log(u)) * Math.cos(MATH_CONSTANTS.TWO * Math.PI * v);
    return mean + std * z;
}

/**
 * Clamp - הגבלת ערך לטווח
 */
export function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

/**
 * Linear interpolation
 */
export function lerp(start, end, t) {
    return start + (end - start) * clamp(t, MATH_CONSTANTS.ZERO, MATH_CONSTANTS.ONE);
}
