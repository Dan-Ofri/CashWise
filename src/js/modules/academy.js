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

/**
 * בדיקת תקציב - שיעור 1
 */
export function checkBudget() {
    const categories = ['housing', 'food', 'transport', 'entertainment', 'savings'];
    const values = {};
    let total = 0;
    const income = getUserIncome(6000);
    
    // איסוף הנתונים
    categories.forEach(category => {
        const element = document.getElementById(category);
        const value = parseFloat(element?.value) || 0;
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
    } else if (values.savings < Math.max(1000, income * 0.1)) {
        feedback = `💡 נסה להגדיל את החיסכון שלך לפחות ל-${formatCurrency(Math.max(1000, Math.round(income * 0.1)))} כדי לבנות עתיד בטוח.`;
        feedbackClass = "feedback-warning";
    } else if (values.savings >= Math.max(1200, income * 0.2)) {
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
    const principal = parseFloat(document.getElementById('ci-principal')?.value) || 0;
    const ratePercent = parseFloat(document.getElementById('ci-rate')?.value) || 0;
    const years = parseFloat(document.getElementById('ci-years')?.value) || 0;
    const compounds = parseFloat(document.getElementById('ci-compounds')?.value) || 1;
    
    const output = document.getElementById('compound-feedback');
    if (!output) return;
    
    // ולידציה
    if (!principal || !years || !ratePercent) {
        output.textContent = 'אנא מלא סכום התחלתי, ריבית ושנים.';
        output.className = 'feedback-warning';
        return;
    }
    
    // חישוב
    const rate = ratePercent / 100;
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
    const monthlyExpense = parseFloat(document.getElementById('ef-monthly-expense')?.value) || 0;
    const monthlySaving = parseFloat(document.getElementById('ef-monthly-saving')?.value) || 0;
    let months = parseFloat(document.getElementById('ef-months')?.value) || 3;
    
    // הגבלה לטווח סביר
    months = Math.min(Math.max(months, 1), 12);
    
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
    const initial = parseFloat(document.getElementById('inv-initial')?.value) || 0;
    const monthly = parseFloat(document.getElementById('inv-monthly')?.value) || 0;
    const returnRate = parseFloat(document.getElementById('inv-return')?.value) || 0;
    const inflation = parseFloat(document.getElementById('inv-inflation')?.value) || 0;
    const years = parseInt(document.getElementById('inv-years')?.value) || 0;
    const includeTax = document.getElementById('inv-tax')?.checked || false;
    const feedback = document.getElementById('investment-feedback');
    
    if (!feedback) return;
    
    // ולידציה
    if (initial < 0 || monthly < 0 || returnRate <= 0 || inflation < 0 || years <= 0) {
        feedback.innerHTML = '<div class="tip-box error">❌ נא למלא ערכים חוקיים (תשואה חייבת להיות חיובית)</div>';
        return;
    }
    
    // חישוב
    const monthlyRate = returnRate / 100 / 12;
    const months = years * 12;
    
    let futureValue = initial;
    let totalDeposited = initial;
    const yearlyData = [];
    
    // חישוב שנתי לצורך הגרף
    for (let year = 1; year <= years; year++) {
        const monthsInYear = year * 12;
        
        // FV = PV * (1+r)^n + PMT * [((1+r)^n - 1) / r]
        const pvPart = initial * Math.pow(1 + monthlyRate, monthsInYear);
        const pmtPart = monthly * ((Math.pow(1 + monthlyRate, monthsInYear) - 1) / monthlyRate);
        futureValue = pvPart + pmtPart;
        totalDeposited = initial + (monthly * monthsInYear);
        
        yearlyData.push({
            year,
            value: futureValue,
            deposited: totalDeposited
        });
    }
    
    const profit = futureValue - totalDeposited;
    const taxAmount = includeTax ? profit * 0.25 : 0;
    const afterTax = futureValue - taxAmount;
    
    // התאמה לאינפלציה (ערך ריאלי)
    const inflationFactor = Math.pow(1 + inflation / 100, years);
    const realValue = afterTax / inflationFactor;
    const realProfit = realValue - totalDeposited;
    
    // תשואה שנתית ממוצעת
    const avgReturn = (Math.pow(afterTax / totalDeposited, 1 / years) - 1) * 100;
    const realAvgReturn = (Math.pow(realValue / totalDeposited, 1 / years) - 1) * 100;
    
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
