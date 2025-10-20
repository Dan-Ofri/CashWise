/**
 * ===========================================
 * 🎮 Simulation Module - MVP Version
 * ===========================================
 * סימולציית החיים הפיננסיים - גרסת MVP פשוטה
 * 
 * Stage 1 MVP:
 * - דמות אחת קבועה (דני, 25, 6000₪)
 * - התקדמות חודשית
 * - חישוב חיסכון פשוט
 * - טריגר אחד אחרי 6 חודשים → למד על השקעות
 * 
 * מה הוסר (יחזור בהדרגה):
 * ❌ תרחישים מרובים
 * ❌ השקעות
 * ❌ קרן חירום
 * ❌ חובות
 * ❌ החלטות מורכבות
 * ❌ אירועים אקראיים
 * ❌ גרפים
 */

import { saveSimulation, loadSimulation, clearSimulation, addXP } from '../core/state.js';

// New State System
import {
    startSimulation as stateStartSimulation,
    updateSimCharacter,
    advanceMonth as stateAdvanceMonth,
    endSimulation as stateEndSimulation,
    addSimEvent,
    subscribe,
    isSimulationActive,
    getCurrentMonth,
    getCurrentSavings,
    getSimCharacter
} from '../state/index.js';

import { formatCurrency } from '../utils/format.js';
import { showSuccess, showNotification } from '../utils/notifications.js';
import { showSection } from '../core/router.js';
import { unlockLesson, completeLesson } from './lessons.js';
import { renderFinancialUI } from './financial-display.js';
import { openLesson } from './lesson-player.js';
import { 
    SIMULATION_CONFIG, 
    XP_REWARDS, 
    FINANCIAL_RULES, 
    MATH_CONSTANTS,
    UI_TIMING
} from '../config/index.js';

/**
 * דמות סימולציה גלובלית - MVP
 */
let simCharacter = null;

/**
 * התחלת סימולציה חדשה - MVP
 */
export function startSimulation() {
    console.log('🎮 Starting new simulation...');
    
    // דמות קבועה פשוטה
    simCharacter = {
        name: 'דני',
        age: SIMULATION_CONFIG.STARTING_AGE,
        month: MATH_CONSTANTS.ZERO,
        monthsSinceStart: MATH_CONSTANTS.ZERO, // ספירת חודשים מתחילת הסימולציה
        salary: SIMULATION_CONFIG.DEFAULT_SALARY,
        expenses: SIMULATION_CONFIG.DEFAULT_EXPENSES,
        savings: MATH_CONSTANTS.ZERO,
        bankInterest: SIMULATION_CONFIG.BANK_INTEREST_RATE, // 2% ריבית שנתית בבנק
        goalAmount: SIMULATION_CONFIG.DEFAULT_GOAL_AMOUNT, // יעד: 50,000 ₪
        status: 'ongoing',
        history: []
    };
    
    saveSimulation(simCharacter);
    renderSimulationUI();
    
    showSuccess('✅ הסימולציה החלה! התחל לחסוך כסף...');
    addXP(XP_REWARDS.START_SIMULATION, 'התחלת סימולציה');
}

/**
 * התקדמות חודש אחד
 */
export function advanceMonth() {
    if (!simCharacter || simCharacter.status !== 'ongoing') {
        startSimulation();
        return;
    }
    
    // חישוב חיסכון חודשי
    const monthlySavings = simCharacter.salary - simCharacter.expenses;
    simCharacter.savings += monthlySavings;
    
    // העלאת גיל כל 12 חודשים
    simCharacter.month++;
    simCharacter.monthsSinceStart++;
    
    if (simCharacter.month >= FINANCIAL_RULES.MONTHS_PER_YEAR) {
        simCharacter.month = MATH_CONSTANTS.ZERO;
        simCharacter.age++;
        
        // ריבית שנתית מהבנק
        const yearlyInterest = simCharacter.savings * simCharacter.bankInterest;
        simCharacter.savings += yearlyInterest;
        
        showNotification(`🎂 יום הולדת ${simCharacter.age}! קיבלת ריבית: ${formatCurrency(yearlyInterest)}`, 'success');
    }
    
    // שמירת היסטוריה
    simCharacter.history.push({
        month: simCharacter.monthsSinceStart,
        savings: simCharacter.savings
    });
    
    // בדיקת טריגר אחרי 6 חודשים
    const triggerMonth = 6;
    if (simCharacter.monthsSinceStart === triggerMonth && !localStorage.getItem('trigger-shown')) {
        showInvestmentTrigger();
        localStorage.setItem('trigger-shown', 'true');
    }
    
    // בדיקת השגת יעד
    if (simCharacter.savings >= simCharacter.goalAmount && simCharacter.status === 'ongoing') {
        simCharacter.status = 'success';
        showSuccess('🎉 מזל טוב! הגעת ליעד של ' + formatCurrency(simCharacter.goalAmount) + '!');
        addXP(XP_REWARDS.GOAL_ACHIEVED, 'השגת יעד הסימולציה!');
        
        // שמירת ההצלחה - פתיחת שיעור investments
        localStorage.setItem('simulation-completed', 'true');
        unlockLesson('investments', 'הצלחה בסימולטור הראשון! 🎉');
        
        // הצגת מודאל ניצחון
        setTimeout(() => {
            showVictoryModal();
        }, UI_TIMING.SHORT_DELAY);
    }
    
    saveSimulation(simCharacter);
    renderSimulationUI();
    
    addXP(XP_REWARDS.MONTH_PROGRESS, 'התקדמת חודש');
}

/**
 * טריגר ללימוד על השקעות - פורמט קומפקטי
 */
function showInvestmentTrigger() {
    const triggerBox = document.getElementById('trigger-box');
    if (!triggerBox) return;
    
    triggerBox.style.display = 'block';
    triggerBox.innerHTML = `
        <div class="sim-events-card">
            <h3><i class="fas fa-lightbulb"></i> רגע של למידה!</h3>
            <div class="sim-event-item">
                <strong>שמת לב?</strong> חסכת ${formatCurrency(simCharacter.savings)} אחרי 6 חודשים.
            </div>
            <div class="sim-event-item">
                אבל... הכסף בבנק מרוויח רק <strong>2%</strong> בשנה. זה מאוד איטי! <i class="fas fa-snail"></i>
            </div>
            <div class="sim-event-item">
                <strong>רוצה ללמוד איך להשקיע ולהרוויח יותר?</strong>
            </div>
            <div style="display: flex; gap: 8px; margin-top: 10px;">
                <button class="sim-action-button" onclick="goToInvestmentLesson()" style="flex: 1;">
                    <span>📚 למד עכשיו</span>
                    <span>→</span>
                </button>
                <button class="sim-action-button" onclick="dismissTrigger()" style="flex: 1; opacity: 0.7;">
                    <span>אחר כך</span>
                    <span>✕</span>
                </button>
            </div>
        </div>
    `;
}

/**
 * מעבר לשיעור השקעות (עם lesson-player!)
 */
export function goToInvestmentLesson() {
    console.log('📚 User clicked "Learn Now" for investments');
    
    // פתיחת השיעור במערכת הנעילה
    unlockLesson('compound-interest', 'slow-savings-trigger');
    
    // שמירה שהמשתמש הגיע מהסימולטור
    localStorage.setItem('came-from-simulator', 'true');
    localStorage.setItem('trigger-reason', 'slow-savings');
    
    // פתיחת lesson-player!
    openLesson('compound-interest');
    
    addXP(XP_REWARDS.LEARN_FROM_SIM, 'עבר ללמידה מתוך הסימולטור');
}

/**
 * סגירת טריגר
 */
export function dismissTrigger() {
    const triggerBox = document.getElementById('trigger-box');
    if (triggerBox) {
        triggerBox.style.display = 'none';
    }
}

/**
 * רינדור UI של הסימולציה - MVP קומפקטי (Stage D - Fixed)
 */
export function renderSimulationUI() {
    const container = document.getElementById('scenario-content');
    if (!container || !simCharacter) return;
    
    // Stage D: סדר ההצגה - ימין לפני שמאל (RTL Grid הופך את הסדר!)
    container.innerHTML = `
        <!-- עמודה ימנית: מצב נוכחי Stage D - FIRST in HTML = RIGHT in RTL Grid -->
        <div class="sim-column-right">
            ${renderFinancialUI(simCharacter)}
        </div>
        
        <!-- עמודה שמאלית: פעולות וטריגרים - SECOND in HTML = LEFT in RTL Grid -->
        <div class="sim-column-left">
            <!-- כרטיס פעולות -->
            <div class="sim-actions-card">
                <h3><i class="fas fa-gamepad"></i> פעולות</h3>
                <div class="sim-actions-list">
                    <button class="sim-action-button" onclick="advanceMonth()" 
                            ${simCharacter.status !== 'ongoing' ? 'disabled' : ''}>
                        <span><i class="fas fa-forward"></i> התקדם חודש קדימה</span>
                        <span>→</span>
                    </button>
                    <button class="sim-action-button" onclick="resetSimulation()">
                        <span><i class="fas fa-redo"></i> התחל מחדש</span>
                        <span>→</span>
                    </button>
                </div>
            </div>
            
            <!-- טריגרים ואירועים -->
            <div id="trigger-box" style="display: none;"></div>
            
            <!-- מטרת הסימולציה -->
            <div class="sim-events-card" style="background: linear-gradient(90deg, #f0f9ff 0%, #e0f2fe 100%); 
                                                 border-right: 4px solid #0ea5e9;
                                                 padding: 16px;">
                <h3 style="margin: 0 0 12px 0; font-size: 18px; color: #0369a1; display: flex; align-items: center; gap: 8px;">
                    <i class="fas fa-bullseye"></i> המטרה
                </h3>
                <div class="sim-event-item" style="background: white; 
                                                   padding: 12px; 
                                                   border-radius: 8px;
                                                   font-size: 15px;
                                                   font-weight: 500;
                                                   color: #2c3e50;">
                    <i class="fas fa-gem"></i> לחסוך <strong style="color: #0369a1;">${formatCurrency(50000)}</strong> בחיסכון לטווח ארוך
                </div>
            </div>
        </div>
    `;
    
    // הוספת כפתורים צפים ל-.box (מחוץ ל-scenario-content)
    addFloatingButtons();
}

/**
 * הוספת כפתורים צפים לסימולטור
 */
function addFloatingButtons() {
    // מחיקת כפתורים קיימים אם יש
    const existingButtons = document.querySelector('.sim-floating-buttons');
    if (existingButtons) {
        existingButtons.remove();
    }
    
    // יצירת כפתורים חדשים
    const floatingButtons = document.createElement('div');
    floatingButtons.className = 'sim-floating-buttons';
    floatingButtons.innerHTML = `
        <button class="sim-float-btn sim-float-goal" onclick="openGoalModal()" title="המטרה שלך">
            <i class="fas fa-bullseye"></i>
        </button>
        <button class="sim-float-btn sim-float-tips" onclick="openTipsModal()" title="טיפים והמלצות">
            <i class="fas fa-lightbulb"></i>
        </button>
    `;
    
    // הוספה ישירות ל-.box
    const simulationBox = document.querySelector('#simulation .box');
    if (simulationBox) {
        simulationBox.appendChild(floatingButtons);
    }
}

/**
 * איפוס סימולציה
 */
export function resetSimulation() {
    if (confirm('האם אתה בטוח שברצונך להתחיל מחדש?')) {
        clearSimulation();
        startSimulation();
        showNotification('🔄 הסימולציה אופסה והחלה מחדש', 'info');
    }
}

/**
 * עדכון מצב סימולציה (מהיר/מציאותי) - לעתיד
 */
export function updateSimulationMode(mode) {
    console.log(`🎮 Changing simulation mode to: ${mode}`);
    localStorage.setItem('simulation-mode', mode);
    
    const modeText = mode === 'fast' ? 'מהיר <i class="fas fa-bolt"></i>' : 'מציאותי <i class="fas fa-bullseye"></i>';
    showNotification(`מצב סימולציה שונה ל: ${modeText}`, 'info', UI_TIMING.NOTIFICATION_INFO);
    
    if (simCharacter && simCharacter.age) {
        renderSimulationUI();
    }
}

/**
 * אתחול מודול הסימולציה
 */
/**
 * מודאל ניצחון
 */
/**
 * הצגת מודאל ניצחון - בנוי כמו מודאל הפרופיל
 */
function showVictoryModal() {
    console.log('🎉 Opening Victory Modal');
    
    // ✅ עדכון כפתור האקדמיה (עכשיו יש שיעור חדש!)
    import('./floating-academy.js').then(module => {
        module.updateFloatingButton();
    });
    
    // הסרת מודאל קיים אם יש
    let modalOverlay = document.getElementById('victory-modal-overlay');
    if (modalOverlay) {
        modalOverlay.remove();
    }
    
    // יצירת המודאל
    modalOverlay = createVictoryModalHTML();
    document.body.appendChild(modalOverlay);
    
    // הצגת המודל
    setTimeout(() => {
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }, UI_TIMING.SIM_SHORT_DELAY);
}

/**
 * סגירת מודאל ניצחון
 */
function closeVictoryModal() {
    console.log('🎉 Closing Victory Modal');
    
    const modalOverlay = document.getElementById('victory-modal-overlay');
    if (modalOverlay) {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
        
        // הסרה לאחר אנימציה
        setTimeout(() => {
            modalOverlay.remove();
        }, 300);
    }
}

/**
 * יצירת HTML למודאל ניצחון
 */
function createVictoryModalHTML() {
    const overlay = document.createElement('div');
    overlay.id = 'victory-modal-overlay';
    overlay.className = 'profile-modal-overlay'; // שימוש באותו CSS!
    
    overlay.innerHTML = `
        <div class="profile-modal" style="max-width: 700px;">
            <div class="profile-modal-header">
                <h2 class="profile-modal-title">
                    <span style="font-size: 32px; margin-left: 12px;">🎉</span>
                    מזל טוב - הגעת ליעד!
                </h2>
                <button class="profile-modal-close" onclick="closeVictoryModal()">×</button>
            </div>
            <div class="profile-modal-content">
                ${renderVictoryContent()}
            </div>
        </div>
    `;
    
    // סגירה בלחיצה על הרקע
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closeVictoryModal();
        }
    });
    
    return overlay;
}

/**
 * רינדור תוכן מודאל הניצחון
 */
function renderVictoryContent() {
    return `
        <!-- סטטיסטיקות הצלחה -->
        <div style="text-align: center; margin-bottom: 32px;">
            <div style="font-size: 24px; color: #2c3e50; margin-bottom: 24px; line-height: 1.6;">
                הצלחת לחסוך <strong style="color: #27ae60; font-size: 28px;">${formatCurrency(simCharacter.goalAmount)}</strong>!
            </div>
            
            <div style="background: linear-gradient(135deg, #4CAF50, #45a049);
                        padding: 32px;
                        border-radius: 16px;
                        color: white;
                        margin-bottom: 24px;
                        box-shadow: 0 8px 24px rgba(76, 175, 80, 0.3);">
                <div style="font-size: 18px; margin-bottom: 12px; opacity: 0.95; font-weight: 600;">
                    סך הכל חסכת:
                </div>
                <div style="font-size: 52px; font-weight: 800; margin-bottom: 16px; text-shadow: 0 2px 8px rgba(0,0,0,0.2);">
                    ${formatCurrency(simCharacter.savings)}
                </div>
                <div style="font-size: 16px; opacity: 0.9; background: rgba(255,255,255,0.2); padding: 12px 24px; border-radius: 50px; display: inline-block;">
                    ⏱️ בזמן: ${simCharacter.monthsSinceStart} חודשים (${(simCharacter.monthsSinceStart / 12).toFixed(1)} שנים)
                </div>
            </div>
        </div>
        
        <!-- הנחיות לשלב הבא -->
        <div class="profile-section" style="margin-bottom: 24px;">
            <h3 style="color: #e65100; font-size: 22px; margin-bottom: 16px;">
                <i class="fas fa-graduation-cap"></i> מה הלאה?
            </h3>
            
            <!-- שיעור חדש נפתח! -->
            <div style="background: linear-gradient(135deg, #ffd700 0%, #ff8c00 100%);
                        padding: 24px;
                        border-radius: 12px;
                        border: 3px solid #ff6b00;
                        text-align: center;
                        margin-bottom: 20px;
                        box-shadow: 0 8px 24px rgba(255, 140, 0, 0.4);
                        animation: pulse 2s infinite;">
                <div style="font-size: 42px; margin-bottom: 12px;">🎉</div>
                <div style="font-size: 22px; font-weight: 800; color: white; margin-bottom: 8px; text-shadow: 0 2px 8px rgba(0,0,0,0.3);">
                    שיעור חדש נפתח!
                </div>
                <div style="font-size: 18px; color: white; font-weight: 600; opacity: 0.95;">
                    📈 ריבית דריבית והשקעות
                </div>
            </div>
            
            <div style="background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
                        padding: 24px;
                        border-radius: 12px;
                        border-right: 4px solid #ff9800;
                        text-align: right;
                        line-height: 2;">
                <div style="margin-bottom: 16px;">
                    💡 <strong style="color: #e65100;">השלב הבא:</strong> 
                    עבור לאקדמיה ולמד על השקעות וריבית דריבית
                </div>
                <div style="margin-bottom: 16px;">
                    🎓 לאחר השלמת השיעור תוכל להתקדם לשלב הבא בסימולטור
                </div>
                <div>
                    🚀 או התחל סימולציה חדשה ונסה להגיע ליעד מהר יותר!
                </div>
            </div>
        </div>
        
        <!-- כפתורי פעולה -->
        <div style="display: flex; gap: 16px; margin-top: 32px;">
            <button onclick="closeVictoryModal(); showSection('academy');" 
                    style="flex: 1;
                           padding: 18px 32px;
                           background: linear-gradient(90deg, #1e293b 0%, #64748b 100%);
                           color: white;
                           border: none;
                           border-radius: 12px;
                           font-size: 18px;
                           font-weight: 700;
                           cursor: pointer;
                           box-shadow: 0 4px 12px rgba(30, 41, 59, 0.4);
                           transition: all 0.3s;
                           font-family: inherit;">
                🎓 עבור לאקדמיה
            </button>
            <button onclick="closeVictoryModal(); resetSimulation();" 
                    style="flex: 1;
                           padding: 18px 32px;
                           background: linear-gradient(135deg, #4CAF50, #45a049);
                           color: white;
                           border: none;
                           border-radius: 12px;
                           font-size: 18px;
                           font-weight: 700;
                           cursor: pointer;
                           box-shadow: 0 4px 12px rgba(76, 175, 80, 0.4);
                           transition: all 0.3s;
                           font-family: inherit;">
                🔄 התחל מחדש
            </button>
        </div>
        
        <style>
            #victory-modal-overlay button:hover {
                transform: translateY(-3px);
                box-shadow: 0 8px 20px rgba(0,0,0,0.3) !important;
            }
            #victory-modal-overlay button:active {
                transform: translateY(-1px);
            }
        </style>
    `;
}

/**
 * אתחול מודול הסימולציה
 */
export function initSimulation() {
    console.log('🎮 Initializing Simulation Module (MVP)...');
    
    // טעינת סימולציה שמורה
    const saved = loadSimulation();
    if (saved) {
        simCharacter = saved;
        renderSimulationUI();
    } else {
        startSimulation();
    }
    
    console.log('✅ Simulation Module initialized (MVP)');
}

// חשיפה גלובלית (תאימות לאחור)
if (typeof window !== 'undefined') {
    window.SimulationModule = {
        init: initSimulation,
        start: startSimulation,
        advanceMonth: advanceMonth,
        reset: resetSimulation,
        updateMode: updateSimulationMode
    };
    window.startSimulation = startSimulation;
    window.advanceMonth = advanceMonth;
    window.resetSimulation = resetSimulation;
    window.updateSimulationMode = updateSimulationMode;
    window.goToInvestmentLesson = goToInvestmentLesson;
    window.dismissTrigger = dismissTrigger;
    window.showVictoryModal = showVictoryModal;
    window.closeVictoryModal = closeVictoryModal;
}
