/**
 * ===========================================
 * 💬 Mentor Module
 * ===========================================
 * מנטור פיננסי AI - מענה לשאלות והמלצות
 */

import { getUserProfile, getUserIncome, mentorActionDone, markMentorActionDone } from '../core/state.js';
import { showSuccess } from '../utils/notifications.js';
import { 
    SIMULATION_CONFIG, 
    FINANCIAL_RULES, 
    BUDGET_RULES,
    MATH_CONSTANTS 
} from '../config/index.js';

/**
 * ניתוח תקציב נוכחי
 */
function analyzeBudgetSnapshot() {
    const income = getUserIncome(SIMULATION_CONFIG.DEFAULT_SALARY);
    
    const getNumberById = (id) => {
        const el = document.getElementById(id);
        const v = parseFloat(el?.value);
        return isNaN(v) ? MATH_CONSTANTS.ZERO : v;
    };
    
    const housing = getNumberById('housing');
    const food = getNumberById('food');
    const transport = getNumberById('transport');
    const entertainment = getNumberById('entertainment');
    const savings = getNumberById('savings');
    
    const total = housing + food + transport + entertainment + savings;
    const needs = housing + food + transport;
    const wants = entertainment;
    const savingsRate = income > MATH_CONSTANTS.ZERO ? (savings / income) : MATH_CONSTANTS.ZERO;
    const overspend = total > income;
    
    const recs = [];
    if (overspend) recs.push(`⚠️ התקציב חורג ב-${(total - income).toLocaleString()}₪ — מומלץ לצמצם הוצאות קבועות.`);
    if (savingsRate < FINANCIAL_RULES.LOW_SAVINGS_THRESHOLD) recs.push('💡 נסה להעלות חיסכון ל-10%-20% מההכנסה.');
    if (wants > income * BUDGET_RULES.WANTS_PERCENT) recs.push('🎯 הוצאות רצוניות גבוהות — שאף לכלל 50/30/20.');
    if (needs > income * BUDGET_RULES.NEEDS_PERCENT) recs.push('🏠 הוצאות צרכים גבוהות — בדוק דיור/תחבורה.');
    if (recs.length === MATH_CONSTANTS.ZERO) recs.push('✅ התקציב נראה מאוזן ביחס לכלל 50/30/20.');
    
    return { income, total, needs, wants, savings, savingsRate, overspend, recs };
}

/**
 * ניתוח קרן חירום
 */
function analyzeEmergency() {
    const getNumberById = (id) => {
        const el = document.getElementById(id);
        const v = parseFloat(el?.value);
        return isNaN(v) ? MATH_CONSTANTS.ZERO : v;
    };
    
    const monthlyExpense = getNumberById('ef-monthly-expense');
    const monthlySaving = getNumberById('ef-monthly-saving');
    const monthsTarget = parseFloat(document.getElementById('ef-months')?.value) || FINANCIAL_RULES.EMERGENCY_FUND_MONTHS_DEFAULT;
    const target = monthlyExpense * monthsTarget;
    const monthsToGoal = monthlySaving > MATH_CONSTANTS.ZERO ? Math.ceil(target / monthlySaving) : Infinity;
    const adequate = monthsTarget >= FINANCIAL_RULES.EMERGENCY_FUND_MONTHS_MIN;
    
    const recs = [];
    if (!monthlyExpense) recs.push('🔎 הוסף הוצאות חודשיות כדי לחשב קרן חירום מותאמת.');
    if (adequate && isFinite(monthsToGoal) && monthsToGoal <= FINANCIAL_RULES.MONTHS_PER_YEAR) {
        recs.push('🛡️ אתה בדרך טובה ליעד קרן החירום תוך שנה.');
    }
    if (monthlySaving < monthlyExpense * FINANCIAL_RULES.EMERGENCY_SAVING_THRESHOLD) {
        recs.push('💡 שקול לחסוך 15%+ מההוצאות לקרן החירום עד להגעה ל-3–6 חודשים.');
    }
    
    return { monthlyExpense, monthlySaving, monthsTarget, target, monthsToGoal, recs };
}

/**
 * בניית תשובת מנטור
 */
export function buildMentorResponse(question) {
    const budget = analyzeBudgetSnapshot();
    const emergency = analyzeEmergency();
    const profile = getUserProfile();
    
    const focus = {
        saving: question.includes('חיסכון') || question.includes('לחסוך'),
        investing: question.includes('השקעה') || question.includes('להשקיע'),
        debt: question.includes('חוב') || question.includes('הלוואה'),
        pension: question.includes('פנסיה') || question.includes('פנסיוני'),
        budget: question.includes('תקציב') || question.includes('הוצאות'),
        mortgage: question.includes('דירה') || question.includes('משכנתא')
    };
    
    const parts = [];
    
    // תקציר מצב
    parts.push(`
        <div class="tip-box info">
            <strong>📌 תקציר מצב:</strong><br>
            הכנסה: ${budget.income.toLocaleString()}₪ | 
            חיסכון: ${(budget.savingsRate * MATH_CONSTANTS.PERCENT_TO_DECIMAL).toFixed(MATH_CONSTANTS.ONE)}% | 
            ${budget.overspend ? '⚠️ חריגה בתקציב' : '✅ תקציב מאוזן'}
        </div>
    `);
    
    // המלצות ממוקדות
    const recList = [];
    if (focus.budget || focus.saving) recList.push(...budget.recs);
    if (focus.saving || focus.budget) recList.push(...emergency.recs);
    if (focus.debt) recList.push('📉 התחל בפירעון חוב בריבית גבוהה לפני הרחבת השקעות.');
    if (focus.pension) recList.push('🏦 שאף להפקדה פנסיונית של 8–10% לפחות וודא דמי ניהול תחרותיים.');
    if (focus.mortgage) recList.push('🏠 ודא שהחזר המשכנתא לא עובר 30–35% מההכנסה נטו.');
    if (focus.investing) recList.push('📈 שקול השקעות מדדיות בעלות נמוכה עם אופק ארוך.');
    
    // פעולות מוצעות
    const actions = [];
    if ((focus.saving || focus.budget) && !mentorActionDone('raise-saving-10')) {
        actions.push(`<button class="action" onclick="applyMentorAction('raise-saving-10')">⬆️ העלה יעד חיסכון ל-10%</button>`);
    }
    if ((focus.saving || focus.budget) && !mentorActionDone('raise-saving-20')) {
        actions.push(`<button class="action" onclick="applyMentorAction('raise-saving-20')">⬆️ העלה יעד חיסכון ל-20%</button>`);
    }
    
    const actionHtml = actions.length ? `<div style="margin:10px 0; display:flex; gap:8px; flex-wrap:wrap;">${actions.join('')}</div>` : '';
    
    const recHtml = recList.length
        ? `<ul>${recList.map(r => `<li>${r}</li>`).join('')}</ul>${actionHtml}`
        : '<p>אין המלצות כרגע — הזן נתונים בשיעורים כדי לקבל ניתוח מותאם.</p>';
    
    return `
        ${parts.join('\n')}
        <h4>🧭 המלצות מותאמות עבורך</h4>
        ${recHtml}
        <div class="tip-box success" style="margin-top:16px;">
            <strong>💡 טיפ:</strong> המנטור משתמש בנתונים שהזנת בשיעורים ובפרופיל. 
            ככל שתזין יותר מידע, כך ההמלצות יהיו מדויקות יותר.
        </div>
    `;
}

/**
 * סימולציית מנטור
 */
export function simulateMentor() {
    const questionInput = document.getElementById('mentor-question');
    const responseDiv = document.getElementById('mentor-response');
    
    if (!questionInput || !responseDiv) return;
    
    const question = questionInput.value.trim();
    
    if (!question) {
        responseDiv.innerHTML = '<div class="tip-box warn">⚠️ אנא הכנס שאלה</div>';
        return;
    }
    
    // הצגת אנימציית טעינה
    responseDiv.innerHTML = '<div class="tip-box info">🤔 המנטור חושב...</div>';
    
    // סימולציה של זמן תגובה
    setTimeout(() => {
        const response = buildMentorResponse(question);
        responseDiv.innerHTML = response;
        
        // ✅ השתמש ב-import הרגיל מהראש
        checkAchievement('ask-mentor');
    }, 800);
}

/**
 * ביצוע פעולת מנטור
 */
export function applyMentorAction(actionId) {
    switch (actionId) {
        case 'raise-saving-10':
            showSuccess('✅ יעד חיסכון עודכן ל-10%!');
            markMentorActionDone('raise-saving-10', 20);
            break;
            
        case 'raise-saving-20':
            showSuccess('✅ יעד חיסכון עודכן ל-20%!');
            markMentorActionDone('raise-saving-20', 30);
            break;
            
        case 'set-emergency-3':
            showSuccess('✅ יעד קרן חירום: 3 חודשים!');
            markMentorActionDone('set-emergency-3', 25);
            break;
            
        case 'suggest-invest-7':
            showSuccess('✅ תשואת יעד: 7% שנתי!');
            markMentorActionDone('suggest-invest-7', 20);
            break;
            
        default:
            console.warn('⚠️ פעולה לא מוכרת:', actionId);
    }
    
    // רענון תשובת המנטור
    const questionInput = document.getElementById('mentor-question');
    if (questionInput?.value.trim()) {
        simulateMentor();
    }
}

/**
 * אתחול מודול המנטור
 */
export function initMentor() {
    console.log('💬 Initializing Mentor Module...');
    
    const askButton = document.getElementById('ask-mentor-btn');
    if (askButton) {
        askButton.addEventListener('click', simulateMentor);
    }
    
    const questionInput = document.getElementById('mentor-question');
    if (questionInput) {
        questionInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                simulateMentor();
            }
        });
    }
    
    console.log('✅ Mentor Module initialized');
}

// חשיפה גלובלית (תאימות לאחור)
if (typeof window !== 'undefined') {
    window.MentorModule = {
        init: initMentor,
        ask: simulateMentor,
        applyAction: applyMentorAction
    };
    window.applyMentorAction = applyMentorAction;
    window.simulateMentor = simulateMentor;
}
