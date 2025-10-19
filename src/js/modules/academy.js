/**
 * ===========================================
 * 🎓 Academy Module
 * ===========================================
 * מודול הלמידה - שיעורים ומחשבונים פיננסיים
 */

import { getUserIncome } from '../core/state.js';
import { markLessonComplete, checkAchievement, emitAppEvent } from '../core/state.js';
import { formatCurrency, calculateCompoundInterest } from '../utils/format.js';
import { validateInput, isPositiveNumber } from '../utils/validation.js';
import { showSuccess, showError } from '../utils/notifications.js';
import { 
    FINANCIAL_RULES, 
    SIMULATION_CONFIG,
    MATH_CONSTANTS,
    VALIDATION
} from '../config/index.js';

/**
 * בדיקת תקציב - שיעור 1
 */
export function checkBudget() {
    const categories = ['housing', 'food', 'transport', 'entertainment', 'savings'];
    const values = {};
    let total = MATH_CONSTANTS.ZERO;
    const income = getUserIncome(SIMULATION_CONFIG.DEFAULT_SALARY);
    
    // איסוף הנתונים
    categories.forEach(category => {
        const element = document.getElementById(category);
        const value = parseFloat(element?.value) || MATH_CONSTANTS.ZERO;
        values[category] = value;
        total += value;
    });
    
    const feedbackDiv = document.getElementById('budget-feedback');
    if (!feedbackDiv) return;
    
    let feedback = "";
    let feedbackClass = "";
    
    // בדיקת התקציב
    if (total > income) {
        feedback = `⚠️ התקציב שלך חורג מההכנסה ב-${formatCurrency(total - income)}. נסה לצמצם הוצאות.`;
        feedbackClass = "feedback-error";
    } else if (values.savings < Math.max(FINANCIAL_RULES.ABSOLUTE_MIN_SAVINGS, income * FINANCIAL_RULES.LOW_SAVINGS_THRESHOLD)) {
        feedback = `💡 נסה להגדיל את החיסכון שלך לפחות ל-${formatCurrency(Math.max(FINANCIAL_RULES.ABSOLUTE_MIN_SAVINGS, Math.round(income * FINANCIAL_RULES.LOW_SAVINGS_THRESHOLD)))} כדי לבנות עתיד בטוח.`;
        feedbackClass = "feedback-warning";
    } else if (values.savings >= Math.max(FINANCIAL_RULES.ABSOLUTE_GOOD_SAVINGS, income * FINANCIAL_RULES.GOOD_SAVINGS_THRESHOLD)) {
        feedback = `🎉 מצוין! התקציב שלך מאוזן והחיסכון שלך (${formatCurrency(values.savings)}) מרשים!`;
        feedbackClass = "feedback-success";
        
        // הישג + XP (רק בפעם הראשונה)
        if (markLessonComplete('budget')) {
            checkAchievement('first-budget');
        }
    } else {
        feedback = "✅ התקציב שלך מאוזן – כל הכבוד!";
        feedbackClass = "feedback-success";
        
        if (markLessonComplete('budget')) {
            checkAchievement('first-budget');
        }
    }
    
    feedbackDiv.textContent = feedback;
    feedbackDiv.className = feedbackClass;
    
    // שדר אירוע
    emitAppEvent('budget:checked', { total, values, income });
}

/**
 * חישוב ריבית דריבית - שיעור 2
 */
export function calculateCompoundInterestLesson() {
    const principal = parseFloat(document.getElementById('ci-principal')?.value) || MATH_CONSTANTS.ZERO;
    const ratePercent = parseFloat(document.getElementById('ci-rate')?.value) || MATH_CONSTANTS.ZERO;
    const years = parseFloat(document.getElementById('ci-years')?.value) || MATH_CONSTANTS.ZERO;
    const compounds = parseFloat(document.getElementById('ci-compounds')?.value) || MATH_CONSTANTS.ONE;
    
    const output = document.getElementById('compound-feedback');
    if (!output) return;
    
    // ולידציה
    if (!principal || !years || !ratePercent) {
        output.textContent = 'אנא מלא סכום התחלתי, ריבית ושנים.';
        output.className = 'feedback-warning';
        return;
    }
    
    // חישוב
    const rate = ratePercent / MATH_CONSTANTS.PERCENT_TO_DECIMAL;
    const futureValue = calculateCompoundInterest(principal, rate, years, compounds);
    const interest = futureValue - principal;
    
    // הצגת תוצאה
    output.className = 'feedback-success';
    output.textContent = `לאחר ${years} שנים: סכום עתידי ≈ ${formatCurrency(futureValue)} (רווח ריבית ≈ ${formatCurrency(interest)})`;
    
    // הישג + XP
    if (markLessonComplete('compound')) {
        checkAchievement('compound-master');
    }
    
    emitAppEvent('compound:calculated', { principal, rate: ratePercent, years, futureValue, interest });
}

/**
 * חישוב קרן חירום - שיעור 3
 */
export function calculateEmergencyFund() {
    const monthlyExpense = parseFloat(document.getElementById('ef-monthly-expense')?.value) || MATH_CONSTANTS.ZERO;
    const monthlySaving = parseFloat(document.getElementById('ef-monthly-saving')?.value) || MATH_CONSTANTS.ZERO;
    let months = parseFloat(document.getElementById('ef-months')?.value) || FINANCIAL_RULES.EMERGENCY_FUND_MONTHS_DEFAULT;
    
    // הגבלה לטווח סביר
    months = Math.min(Math.max(months, VALIDATION.MIN_EMERGENCY_MONTHS), VALIDATION.MAX_EMERGENCY_MONTHS);
    
    const output = document.getElementById('emergency-feedback');
    if (!output) return;
    
    // ולידציה
    if (!monthlyExpense) {
        output.textContent = 'אנא הזן הוצאות חודשיות.';
        output.className = 'feedback-warning';
        return;
    }
    
    // חישוב
    const target = monthlyExpense * months;
    const neededMonths = monthlySaving > 0 ? Math.ceil(target / monthlySaving) : Infinity;
    
    // הצגת תוצאה
    output.className = 'feedback-success';
    output.textContent = `יעד קרן: ${formatCurrency(target)} (${months} חודשים). בקצב חיסכון של ${formatCurrency(monthlySaving)}/חודש תגיע ליעד בכ-${isFinite(neededMonths) ? neededMonths : '∞'} חודשים.`;
    
    // הישג + XP
    if (markLessonComplete('emergency')) {
        checkAchievement('emergency-ready');
    }
    
    emitAppEvent('emergency:calculated', { monthlyExpense, monthlySaving, months, target, neededMonths });
}

/**
 * מחשבון השקעות מתקדם - שיעור 4
 */
export function calculateInvestment() {
    const initial = parseFloat(document.getElementById('inv-initial')?.value) || MATH_CONSTANTS.ZERO;
    const monthly = parseFloat(document.getElementById('inv-monthly')?.value) || MATH_CONSTANTS.ZERO;
    const returnRate = parseFloat(document.getElementById('inv-return')?.value) || MATH_CONSTANTS.ZERO;
    const inflation = parseFloat(document.getElementById('inv-inflation')?.value) || MATH_CONSTANTS.ZERO;
    const years = parseInt(document.getElementById('inv-years')?.value) || MATH_CONSTANTS.ZERO;
    const includeTax = document.getElementById('inv-tax')?.checked || false;
    const feedback = document.getElementById('investment-feedback');
    
    if (!feedback) return;
    
    // ולידציה
    if (initial < MATH_CONSTANTS.ZERO || monthly < MATH_CONSTANTS.ZERO || returnRate <= MATH_CONSTANTS.ZERO || inflation < MATH_CONSTANTS.ZERO || years <= MATH_CONSTANTS.ZERO) {
        feedback.innerHTML = '<div class="tip-box error">❌ נא למלא ערכים חוקיים (תשואה חייבת להיות חיובית)</div>';
        return;
    }
    
    // חישוב
    const monthlyRate = returnRate / MATH_CONSTANTS.PERCENT_TO_DECIMAL / FINANCIAL_RULES.MONTHS_PER_YEAR;
    const months = years * FINANCIAL_RULES.MONTHS_PER_YEAR;
    
    let futureValue = initial;
    let totalDeposited = initial;
    const yearlyData = [];
    
    // חישוב שנתי לצורך הגרף
    for (let year = MATH_CONSTANTS.ONE; year <= years; year++) {
        const monthsInYear = year * FINANCIAL_RULES.MONTHS_PER_YEAR;
        
        // FV = PV * (1+r)^n + PMT * [((1+r)^n - 1) / r]
        const pvPart = initial * Math.pow(MATH_CONSTANTS.ONE + monthlyRate, monthsInYear);
        const pmtPart = monthly * ((Math.pow(MATH_CONSTANTS.ONE + monthlyRate, monthsInYear) - MATH_CONSTANTS.ONE) / monthlyRate);
        futureValue = pvPart + pmtPart;
        totalDeposited = initial + (monthly * monthsInYear);
        
        yearlyData.push({
            year,
            value: futureValue,
            deposited: totalDeposited
        });
    }
    
    const profit = futureValue - totalDeposited;
    const taxAmount = includeTax ? profit * FINANCIAL_RULES.INVESTMENT_TAX_RATE : MATH_CONSTANTS.ZERO;
    const afterTax = futureValue - taxAmount;
    
    // התאמה לאינפלציה (ערך ריאלי)
    const inflationFactor = Math.pow(MATH_CONSTANTS.ONE + inflation / MATH_CONSTANTS.PERCENT_TO_DECIMAL, years);
    const realValue = afterTax / inflationFactor;
    const realProfit = realValue - totalDeposited;
    
    // תשואה שנתית ממוצעת
    const avgReturn = (Math.pow(afterTax / totalDeposited, MATH_CONSTANTS.ONE / years) - MATH_CONSTANTS.ONE) * MATH_CONSTANTS.DECIMAL_TO_PERCENT;
    const realAvgReturn = (Math.pow(realValue / totalDeposited, MATH_CONSTANTS.ONE / years) - MATH_CONSTANTS.ONE) * MATH_CONSTANTS.DECIMAL_TO_PERCENT;
    
    // הצגת תוצאות
    feedback.innerHTML = `
        <div class="tip-box success">
            <h3 style="margin-top: 0;">📊 תוצאות ההשקעה</h3>
            
            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 10px 0;">
                <strong>💵 ערכים נומינליים (לא מותאמים לאינפלציה):</strong><br>
                סה"כ הופקד: <strong>${formatCurrency(totalDeposited)}</strong><br>
                ערך עתידי (ברוטו): <strong>${formatCurrency(futureValue)}</strong><br>
                רווח: <strong>${formatCurrency(profit)}</strong><br>
                ${includeTax ? `מס רווחי הון (25%): <strong style="color: red;">-${formatCurrency(taxAmount)}</strong><br>` : ''}
                <strong style="color: #27ae60; font-size: 1.1em;">ערך סופי: ${formatCurrency(afterTax)}</strong>
            </div>
            
            <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 10px 0;">
                <strong>📉 ערכים ריאליים (מותאמים לאינפלציה של ${inflation}%):</strong><br>
                ערך ריאלי: <strong>${formatCurrency(realValue)}</strong><br>
                רווח ריאלי: <strong>${formatCurrency(realProfit)}</strong><br>
                כוח קנייה של הכסף היום: <strong style="color: #2196F3;">${formatCurrency(realValue)}</strong>
            </div>
            
            <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 10px 0;">
                <strong>📈 תשואות:</strong><br>
                תשואה ממוצעת נומינלית: <strong>${avgReturn.toFixed(2)}%</strong> לשנה<br>
                תשואה ממוצעת ריאלית: <strong style="color: ${realAvgReturn > 0 ? '#27ae60' : '#e74c3c'};">${realAvgReturn.toFixed(2)}%</strong> לשנה
            </div>
            
            <div class="tip-box info" style="margin-top: 15px;">
                💡 <strong>מסקנות:</strong><br>
                ${realAvgReturn > 3 ? '✅ תשואה ריאלית טובה! ההשקעה מנצחת את האינפלציה.' : '⚠️ תשואה נמוכה - שקול השקעות תוקפניות יותר.'}<br>
                ${includeTax ? '💰 זכור: מס רווחי הון יחול רק בעת המימוש.' : '⚠️ לא כללת מס - התוצאה אופטימית מדי!'}<br>
                ⏳ ככל שתשקיע לזמן ארוך יותר, כך תהנה יותר מריבית דריבית.
            </div>
        </div>
    `;
    
    // יצירת גרף (אם יש Chart.js)
    createInvestmentChart(yearlyData, totalDeposited);
    
    // הישג + XP
    if (markLessonComplete('investment')) {
        checkAchievement('investor');
    }
    
    emitAppEvent('investment:calculated', { 
        initial, monthly, returnRate, inflation, years, 
        includeTax, futureValue, afterTax, realValue 
    });
}

/**
 * יצירת גרף השקעה
 */
function createInvestmentChart(data, totalDeposited) {
    const container = document.getElementById('investment-chart-container');
    const canvas = document.getElementById('investmentChart');
    
    if (!container || !canvas || typeof Chart === 'undefined') return;
    
    container.style.display = 'block';
    
    // הרס גרף קיים
    if (window.investmentChart) {
        window.investmentChart.destroy();
    }
    
    const ctx = canvas.getContext('2d');
    window.investmentChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.map(d => `שנה ${d.year}`),
            datasets: [
                {
                    label: 'ערך ההשקעה',
                    data: data.map(d => d.value),
                    borderColor: '#2196F3',
                    backgroundColor: 'rgba(33, 150, 243, 0.1)',
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'סה"כ הופקד',
                    data: data.map(d => d.deposited),
                    borderColor: '#4CAF50',
                    backgroundColor: 'rgba(76, 175, 80, 0.1)',
                    tension: 0.4,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'גרף צמיחת ההשקעה לאורך זמן',
                    font: { size: 16, family: 'Heebo' }
                },
                legend: {
                    display: true,
                    position: 'top',
                    labels: { font: { family: 'Heebo' } }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + formatCurrency(context.parsed.y);
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return formatCurrency(value);
                        }
                    }
                }
            }
        }
    });
}

/**
 * אתחול מודול האקדמיה
 */
export function initAcademy() {
    console.log('🎓 Initializing Academy Module...');
    
    // רישום event listeners לכפתורים
    const checkBudgetBtn = document.getElementById('check-budget-btn');
    if (checkBudgetBtn) {
        checkBudgetBtn.addEventListener('click', checkBudget);
    }
    
    const calcCompoundBtn = document.getElementById('calc-compound-btn');
    if (calcCompoundBtn) {
        calcCompoundBtn.addEventListener('click', calculateCompoundInterestLesson);
    }
    
    const calcEmergencyBtn = document.getElementById('calc-emergency-btn');
    if (calcEmergencyBtn) {
        calcEmergencyBtn.addEventListener('click', calculateEmergencyFund);
    }
    
    const calcInvestmentBtn = document.getElementById('calc-investment-btn');
    if (calcInvestmentBtn) {
        calcInvestmentBtn.addEventListener('click', calculateInvestment);
    }
    
    console.log('✅ Academy Module initialized');
}

// חשיפה גלובלית (תאימות לאחור)
if (typeof window !== 'undefined') {
    window.AcademyModule = {
        init: initAcademy,
        checkBudget,
        calculateCompoundInterest: calculateCompoundInterestLesson,
        calculateEmergencyFund,
        calculateInvestment
    };
}
