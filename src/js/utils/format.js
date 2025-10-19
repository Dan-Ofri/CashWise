/**
 * ===========================================
 * 🔢 Format & Math Utilities
 * ===========================================
 * פונקציות עזר לפורמט מספרים וחישובים
 */

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
    const percent = isDecimal ? value * 100 : value;
    return `${Math.round(percent * 10) / 10}%`;
}

/**
 * עיגול למספר עשרוני
 */
export function roundTo(value, decimals = 2) {
    const multiplier = Math.pow(10, decimals);
    return Math.round(value * multiplier) / multiplier;
}

/**
 * חישוב אחוז מתוך סכום
 */
export function calculatePercent(part, total) {
    if (total === 0) return 0;
    return (part / total) * 100;
}

/**
 * חישוב ריבית דריבית
 * @param {number} principal - קרן
 * @param {number} rate - ריבית שנתית (0-1)
 * @param {number} years - שנים
 * @param {number} compoundsPerYear - תדירות הצטברות (12 = חודשי)
 * @returns {number}
 */
export function calculateCompoundInterest(principal, rate, years, compoundsPerYear = 12) {
    return principal * Math.pow((1 + rate / compoundsPerYear), compoundsPerYear * years);
}

/**
 * חישוב החזר חודשי להלוואה
 * @param {number} principal - סכום ההלוואה
 * @param {number} annualRate - ריבית שנתית (0-1)
 * @param {number} months - מספר חודשים
 * @returns {number}
 */
export function calculateMonthlyPayment(principal, annualRate, months) {
    if (annualRate === 0) return principal / months;
    
    const monthlyRate = annualRate / 12;
    return (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
           (Math.pow(1 + monthlyRate, months) - 1);
}

/**
 * חישוב ROI (תשואה על השקעה)
 */
export function calculateROI(initialInvestment, finalValue) {
    if (initialInvestment === 0) return 0;
    return ((finalValue - initialInvestment) / initialInvestment) * 100;
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
export function randomNormal(mean = 0, std = 1) {
    let u = 0, v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
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
    return start + (end - start) * clamp(t, 0, 1);
}
