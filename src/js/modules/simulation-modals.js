/**
 * ===========================================
 * 🎯 Simulation Modals - Info Popups
 * ===========================================
 * מודאלים למידע על יעד והמתנה בסימולטור
 * משודרג להיות כמו הפרופיל - עם overlay ואנימציה
 */

import { formatCurrency } from '../utils/format.js';
import { MATH_CONSTANTS, FINANCIAL_RULES } from '../config/index.js';

/**
 * פתיחת מודאל יעד - גרסה משודרגת
 */
export function openGoalModal() {
    console.log('🎯 Opening Goal Modal');
    
    // יצירת HTML למודל אם לא קיים
    let modalOverlay = document.getElementById('goal-modal-overlay');
    if (!modalOverlay) {
        modalOverlay = createGoalModalHTML();
        document.body.appendChild(modalOverlay);
    }
    
    // עדכון תוכן
    updateGoalModalContent();
    
    // הצגת המודל
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // מניעת גלילה ברקע
}

/**
 * סגירת מודאל יעד
 */
export function closeGoalModal() {
    console.log('🎯 Closing Goal Modal');
    
    const modalOverlay = document.getElementById('goal-modal-overlay');
    if (modalOverlay) {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = ''; // החזרת גלילה
    }
}

/**
 * יצירת HTML למודל יעד
 */
function createGoalModalHTML() {
    const overlay = document.createElement('div');
    overlay.id = 'goal-modal-overlay';
    overlay.className = 'sim-modal-overlay';
    
    overlay.innerHTML = `
        <div class="sim-modal">
            <div class="sim-modal-header">
                <h2 class="sim-modal-title"><i class="fas fa-bullseye"></i> היעד שלך</h2>
                <button class="sim-modal-close" onclick="closeGoalModal()">×</button>
            </div>
            <div class="sim-modal-content">
                <div id="goal-modal-body"></div>
            </div>
        </div>
    `;
    
    // סגירה בלחיצה על הרקע
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closeGoalModal();
        }
    });
    
    return overlay;
}

/**
 * עדכון תוכן מודל יעד
 */
function updateGoalModalContent() {
    const simCharacter = JSON.parse(localStorage.getItem('simCharacter') || '{}');
    const goalAmount = simCharacter.goalAmount || 50000;
    const currentSavings = simCharacter.savings || MATH_CONSTANTS.ZERO;
    const progressPercent = Math.min(((currentSavings / goalAmount) * MATH_CONSTANTS.PERCENT_TO_DECIMAL).toFixed(MATH_CONSTANTS.ONE), MATH_CONSTANTS.PERCENT_TO_DECIMAL);
    
    document.getElementById('goal-modal-body').innerHTML = `
        <div style="text-align: center; padding: 12px;">
            <div style="font-size: 48px; margin-bottom: 12px; color: #667eea;"><i class="fas fa-bullseye"></i></div>
            
            <div style="background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
                        padding: 20px;
                        border-radius: 12px;
                        margin-bottom: 16px;
                        color: white;">
                <div style="font-size: 16px; margin-bottom: 6px;"><i class="fas fa-piggy-bank"></i> יעד החיסכון</div>
                <div style="font-size: 32px; font-weight: bold;">${formatCurrency(goalAmount)}</div>
            </div>
            
            <div style="background: #f5f5f5; padding: 18px; border-radius: 12px; margin-bottom: 16px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                    <span style="font-size: 15px; color: #546e7a;">התקדמות</span>
                    <span style="font-size: 17px; font-weight: bold; color: #4CAF50;">${progressPercent}%</span>
                </div>
                <div style="width: 100%; 
                            height: 20px; 
                            background: #e0e0e0; 
                            border-radius: 10px; 
                            overflow: hidden;
                            margin-bottom: 10px;">
                    <div style="width: ${progressPercent}%; 
                                height: 100%; 
                                background: linear-gradient(90deg, #4CAF50, #66BB6A);
                                transition: width 0.5s ease;"></div>
                </div>
                <div style="font-size: 15px; color: #546e7a;">
                    ${formatCurrency(currentSavings)} / ${formatCurrency(goalAmount)}
                </div>
            </div>
            
            <div style="text-align: right; background: #e3f2fd; padding: 14px; border-radius: 8px;">
                <div style="font-size: 14px; color: #1976d2; margin-bottom: 6px;">
                    <strong>💡 איך משיגים את היעד?</strong>
                </div>
                <div style="font-size: 13px; color: #546e7a; line-height: 1.5;">
                    1️⃣ לחץ "התקדם חודש" כדי לצבור חיסכון<br>
                    2️⃣ למד באקדמיה על השקעות חכמות<br>
                    3️⃣ השתמש בכלים שרכשת להצלחה
                </div>
            </div>
        </div>
    `;
}

/**
 * פתיחת מודאל המתנה - גרסה משודרגת
 */
export function openTipsModal() {
    console.log('⏸️ Opening Tips Modal');
    
    // יצירת HTML למודל אם לא קיים
    let modalOverlay = document.getElementById('tips-modal-overlay');
    if (!modalOverlay) {
        modalOverlay = createTipsModalHTML();
        document.body.appendChild(modalOverlay);
    }
    
    // עדכון תוכן
    updateTipsModalContent();
    
    // הצגת המודל
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

/**
 * סגירת מודאל המתנה
 */
export function closeTipsModal() {
    console.log('⏸️ Closing Tips Modal');
    
    const modalOverlay = document.getElementById('tips-modal-overlay');
    if (modalOverlay) {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

/**
 * יצירת HTML למודל המתנה
 */
function createTipsModalHTML() {
    const overlay = document.createElement('div');
    overlay.id = 'tips-modal-overlay';
    overlay.className = 'sim-modal-overlay';
    
    overlay.innerHTML = `
        <div class="sim-modal">
            <div class="sim-modal-header">
                <h2 class="sim-modal-title">💡 טיפים וסטטיסטיקות</h2>
                <button class="sim-modal-close" onclick="closeTipsModal()">×</button>
            </div>
            <div class="sim-modal-content">
                <div id="tips-modal-body"></div>
            </div>
        </div>
    `;
    
    // סגירה בלחיצה על הרקע
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closeTipsModal();
        }
    });
    
    return overlay;
}

/**
 * עדכון תוכן מודאל המתנה
 */
function updateTipsModalContent() {
    const simCharacter = JSON.parse(localStorage.getItem('simCharacter') || '{}');
    const monthlySavings = (simCharacter.salary || MATH_CONSTANTS.ZERO) - (simCharacter.expenses || MATH_CONSTANTS.ZERO);
    const savingsRate = simCharacter.salary ? ((monthlySavings / simCharacter.salary) * MATH_CONSTANTS.PERCENT_TO_DECIMAL).toFixed(MATH_CONSTANTS.ONE) : '0';
    
    document.getElementById('tips-modal-body').innerHTML = `
        <div style="text-align: center; padding: 12px;">
            <div style="font-size: 48px; margin-bottom: 12px;">💡</div>
            
            <!-- סטטיסטיקות -->
            <div style="background: #f5f5f5; 
                        padding: 14px; 
                        border-radius: 12px; 
                        margin-bottom: 14px;
                        text-align: right;">
                <h3 style="margin: 0 0 10px 0; font-size: 15px; color: #2c3e50;">📊 המצב הנוכחי שלך</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; text-align: center;">
                    <div style="background: white; padding: 10px; border-radius: 8px;">
                        <div style="font-size: 11px; color: #666;">שיעור חיסכון</div>
                        <div style="font-size: 18px; font-weight: bold; color: #4CAF50;">${savingsRate}%</div>
                    </div>
                    <div style="background: white; padding: 10px; border-radius: 8px;">
                        <div style="font-size: 11px; color: #666;">ריבית בבנק</div>
                        <div style="font-size: 18px; font-weight: bold; color: #FF9800;">${((simCharacter.bankInterest || FINANCIAL_RULES.BANK_SAVINGS_RETURN) * MATH_CONSTANTS.PERCENT_TO_DECIMAL).toFixed(MATH_CONSTANTS.ONE)}%</div>
                    </div>
                    <div style="background: white; padding: 10px; border-radius: 8px;">
                        <div style="font-size: 11px; color: #666;">חודשים</div>
                        <div style="font-size: 18px; font-weight: bold; color: #2196F3;">${simCharacter.monthsSinceStart || MATH_CONSTANTS.ZERO}</div>
                    </div>
                    <div style="background: white; padding: 10px; border-radius: 8px;">
                        <div style="font-size: 11px; color: #666;">שנים</div>
                        <div style="font-size: 18px; font-weight: bold; color: #9C27B0;">${((simCharacter.monthsSinceStart || MATH_CONSTANTS.ZERO) / FINANCIAL_RULES.MONTHS_PER_YEAR).toFixed(MATH_CONSTANTS.ONE)}</div>
                    </div>
                </div>
            </div>
            
            <!-- טיפים -->
            <div style="text-align: right;">
                <div style="background: #e8f5e9; 
                            padding: 10px; 
                            border-radius: 8px; 
                            border-right: 3px solid #4CAF50;
                            margin-bottom: 10px;">
                    <div style="font-size: 13px; font-weight: bold; color: #2e7d32; margin-bottom: 4px;">
                        ✅ טיפ 1: חסכו באופן קבוע
                    </div>
                    <div style="font-size: 12px; color: #4CAF50; line-height: 1.4;">
                        כל חודש, הפריש חלק קבוע מההכנסה לחיסכון לפני שמוציא על הוצאות אחרות
                    </div>
                </div>
                
                <div style="background: #fff3e0; 
                            padding: 10px; 
                            border-radius: 8px; 
                            border-right: 3px solid #FF9800;
                            margin-bottom: 10px;">
                    <div style="font-size: 13px; font-weight: bold; color: #e65100; margin-bottom: 4px;">
                        📚 טיפ 2: למדו באקדמיה
                    </div>
                    <div style="font-size: 12px; color: #FF9800; line-height: 1.4;">
                        השקיעו זמן בלימוד על השקעות, ריבית דריבית וניהול כסף חכם
                    </div>
                </div>
                
                <div style="background: #e3f2fd; 
                            padding: 10px; 
                            border-radius: 8px; 
                            border-right: 3px solid #2196F3;">
                    <div style="font-size: 13px; font-weight: bold; color: #0d47a1; margin-bottom: 4px;">
                        <i class="fas fa-bullseye"></i> טיפ 3: הגדירו יעדים ברורים
                    </div>
                    <div style="font-size: 12px; color: #2196F3; line-height: 1.4;">
                        יעד ברור עוזר להישאר ממוקדים ומוטיבציה להמשיך לחסוך
                    </div>
                </div>
            </div>
        </div>
    `;
}

/**
 * אתחול מודולים
 */
export function initSimulationModals() {
    console.log('🎯 Simulation Modals initialized');
}
