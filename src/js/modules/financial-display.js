/**
 * ===========================================
 * 💎 Stage D - Financial Display Update
 * ===========================================
 * פונקציה מעודכנת להצגת מידע פיננסי מחודש
 */

import { formatCurrency } from '../utils/format.js';
import { MATH_CONSTANTS, FINANCIAL_RULES } from '../config/index.js';

/**
 * רינדור UI פיננסי מחודש - Stage D - קומפקטי ללא גלילה
 */
export function renderFinancialUI(simCharacter) {
    const monthlySavings = simCharacter.salary - simCharacter.expenses;
    const goalProgress = Math.min((simCharacter.savings / simCharacter.goalAmount) * MATH_CONSTANTS.PERCENT_TO_DECIMAL, MATH_CONSTANTS.PERCENT_TO_DECIMAL).toFixed(MATH_CONSTANTS.ONE);
    
    return `
        <!-- כרטיס סטטוס קומפקטי -->
        <div class="sim-status-card">
            <!-- שורת פרטי דמות -->
            <div class="sim-character-info">
                <div class="sim-info-item">
                    <span class="sim-info-icon"><i class="fas fa-user"></i></span>
                    <span class="sim-info-text">${simCharacter.name}, ${simCharacter.age}</span>
                </div>
                <div class="sim-info-divider">|</div>
                <div class="sim-info-item">
                    <span class="sim-info-icon"><i class="fas fa-calendar-alt"></i></span>
                    <span class="sim-info-text">חודש ${simCharacter.month + MATH_CONSTANTS.ONE}/${FINANCIAL_RULES.MONTHS_PER_YEAR}</span>
                </div>
            </div>
            
            <div class="sim-divider"></div>
            
            <!-- Progress bar ליעד - במיקום בולט -->
            <div class="sim-goal-progress-bar" style="margin-bottom: 12px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                    <span style="font-size: 11px; font-weight: 600; color: rgba(255,255,255,0.95);"><i class="fas fa-bullseye"></i> יעד: ${formatCurrency(simCharacter.goalAmount)}</span>
                    <span style="font-size: 11px; font-weight: 700; color: #4CAF50;">${goalProgress}%</span>
                </div>
                <div class="sim-progress-bar" style="background: rgba(255,255,255,0.2); height: 12px; border-radius: 6px; overflow: hidden;">
                    <div class="sim-progress-fill" 
                         style="width: ${goalProgress}%; 
                                background: linear-gradient(90deg, #66bb6a 0%, #43a047 100%);
                                height: 100%;
                                transition: width 0.5s ease;"></div>
                </div>
                <div style="text-align: left; margin-top: 3px; font-size: 10px; color: rgba(255,255,255,0.85);">
                    ${formatCurrency(simCharacter.savings)} / ${formatCurrency(simCharacter.goalAmount)}
                </div>
            </div>
            
            <div class="sim-divider" style="margin: 8px 0; opacity: 0.3;"></div>
            
            <!-- מידע פיננסי - מוכן להרחבה עתידית -->
            <div class="sim-financial-display">
                <div class="sim-finance-row">
                    <span class="sim-finance-icon"><i class="fas fa-money-bill-wave"></i></span>
                    <span class="sim-finance-label">משכורת:</span>
                    <span class="sim-finance-value positive">${formatCurrency(simCharacter.salary)}</span>
                </div>
                <div class="sim-finance-row">
                    <span class="sim-finance-icon"><i class="fas fa-shopping-cart"></i></span>
                    <span class="sim-finance-label">הוצאות:</span>
                    <span class="sim-finance-value negative">${formatCurrency(simCharacter.expenses)}</span>
                </div>
                <div class="sim-finance-row highlight">
                    <span class="sim-finance-icon"><i class="fas fa-piggy-bank"></i></span>
                    <span class="sim-finance-label">חיסכון:</span>
                    <span class="sim-finance-value accent">${formatCurrency(monthlySavings)}</span>
                </div>
                <div class="sim-finance-row major">
                    <span class="sim-finance-icon"><i class="fas fa-gem"></i></span>
                    <span class="sim-finance-label">סה"כ:</span>
                    <span class="sim-finance-value total">${formatCurrency(simCharacter.savings)}</span>
                </div>
                
                <div class="sim-divider" style="margin: 8px 0; opacity: 0.3;"></div>
                
                <!-- שדות עתידיים - מוצגים אבל כבויים -->
                <div class="sim-finance-row disabled-field">
                    <span class="sim-finance-icon" style="opacity: 0.3;"><i class="fas fa-hospital"></i></span>
                    <span class="sim-finance-label" style="opacity: 0.4;">קרן חירום:</span>
                    <span class="sim-finance-value" style="opacity: 0.3; color: #999;"><i class="fas fa-lock"></i> לא פעיל</span>
                </div>
                <div class="sim-finance-row disabled-field">
                    <span class="sim-finance-icon" style="opacity: 0.3;"><i class="fas fa-chart-line"></i></span>
                    <span class="sim-finance-label" style="opacity: 0.4;">השקעות:</span>
                    <span class="sim-finance-value" style="opacity: 0.3; color: #999;"><i class="fas fa-lock"></i> לא פעיל</span>
                </div>
                <div class="sim-finance-row disabled-field">
                    <span class="sim-finance-icon" style="opacity: 0.3;"><i class="fas fa-credit-card"></i></span>
                    <span class="sim-finance-label" style="opacity: 0.4;">חובות:</span>
                    <span class="sim-finance-value" style="opacity: 0.3; color: #999;"><i class="fas fa-lock"></i> לא פעיל</span>
                </div>
            </div>
        </div>
    `;
}
