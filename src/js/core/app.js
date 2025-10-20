/**
 * ===========================================
 * 🚀 CashWise v7.0 - Main Application Entry
 * ===========================================
 * נקודת כניסה ראשית של האפליקציה המודולרית
 */

// ===== State System Initialization (MUST BE FIRST!) =====
import '../state-init.js';

// ===== Global Bridge =====
import './global-bridge.js';

// ===== Core Imports =====
import { initRouter, showSection } from './router.js';
import { loadGameState, addXP, emitAppEvent } from './state.js';

// ===== New State System =====
import { 
    subscribe, 
    getUserXP, 
    getUserLevel,
    getLevelProgress 
} from '../state/index.js';

// ===== Utils Imports =====
import { initUIEffects } from '../utils/ui-effects.js';
import { showNotification } from '../utils/notifications.js';
import { initResponsive } from '../utils/responsive.js';

// ===== Config Imports =====
import { XP_CONFIG, UI_TIMING } from '../config/index.js';

// ===== Modules Imports =====
import { initProfile } from '../modules/profile.js';
import { initAcademy } from '../modules/academy.js';
import { initMentor } from '../modules/mentor.js';
import { initAnalytics } from '../modules/analytics.js';
import { initSimulation } from '../modules/simulation.js';
import { initLessonsState } from '../modules/lessons.js';
import { initFloatingAcademy } from '../modules/floating-academy.js';
import { initModals } from '../modules/modals-sidebars.js';
import { initLessonPlayer } from '../modules/lesson-player.js';
import { initSimulationModals } from '../modules/simulation-modals.js';

/**
 * אתחול ראשוני של האפליקציה
 */
function initializeApp() {
    console.log(`
    ╔═══════════════════════════════════════╗
    ║  💰 CashWise v7.0 - Modular Edition  ║
    ║     חינוך פיננסי חכם ומאורגן 🎓      ║
    ╚═══════════════════════════════════════╝
    `);
    
    try {
        // 1. אתחול Router
        initRouter();
        
        // 2. טעינת מצב משתמש
        const gameState = loadGameState();
        console.log('📊 Game State Loaded:', {
            level: gameState.level,
            xp: gameState.xp,
            achievements: gameState.achievements.length
        });
        
        // 3. אתחול UI Effects
        initUIEffects();
        
        // 4. אתחול מערכת רספונסיבית
        const device = initResponsive();
        console.log('📱 Device detected:', {
            type: device.isMobile ? 'Mobile' : device.isTablet ? 'Tablet' : 'Desktop',
            width: device.width,
            height: device.height,
            touch: device.isTouch,
            orientation: device.orientation
        });
        
        // 5. אתחול כל המודולים
        console.log('🔧 Initializing modules...');
        initLessonsState(); // קודם - מערכת השיעורים
        initFloatingAcademy(); // כפתור צף ו-Modal
        initModals(); // Modal פרופיל ו-Sidebar מנטור
        initLessonPlayer(); // מנוע הצגת שיעורים
        initSimulationModals(); // מודאלים בסימולטור (יעד וטיפים)
        initProfile();
        initAcademy();
        initMentor();
        initAnalytics();
        initSimulation();
        console.log('✅ All modules initialized!');
        
        // 6. הצגת מסך ראשי - סימולטור (לפי אפיון חדש)
        showSection('simulation', false);
        
        // 7. עדכון UI של גיימיפיקציה
        updateXPBar();
        
        // 8. רישום event listeners גלובליים
        registerGlobalListeners();
        
        console.log('✅ CashWise initialized successfully!');
        emitAppEvent('app:initialized', { timestamp: Date.now() });
        
        // הודעת ברוך הבא (רק בפעם הראשונה)
        if (!localStorage.getItem('visited-before')) {
            setTimeout(() => {
                showNotification('🎉 ברוך הבא ל-CashWise! התחל את המסע הפיננסי שלך.', 'success', UI_TIMING.WELCOME_MESSAGE_DURATION);
            }, UI_TIMING.WELCOME_MESSAGE_DELAY);
            localStorage.setItem('visited-before', 'true');
            localStorage.setItem('first-visit', new Date().toISOString());
        }
        
    } catch (error) {
        console.error('❌ Failed to initialize CashWise:', error);
        alert('שגיאה באתחול האפליקציה. נא לרענן את הדף.');
    }
}

/**
 * עדכון פס ה-XP
 * Updated to use new state system selectors
 */
function updateXPBar() {
    // Use new state system selectors
    const xp = getUserXP();
    const level = getUserLevel();
    const progress = getLevelProgress();
    
    const xpFill = document.getElementById('xp-fill');
    const xpText = document.getElementById('xp-text');
    const levelBadge = document.getElementById('level-badge');
    
    if (xpFill) {
        const currentXP = xp % XP_CONFIG.XP_PER_LEVEL;
        const percentage = progress * 100; // getLevelProgress returns 0-1
        xpFill.style.width = percentage + '%';
    }
    
    if (xpText) {
        xpText.textContent = `${xp % XP_CONFIG.XP_PER_LEVEL}/${XP_CONFIG.XP_PER_LEVEL} XP`;
    }
    
    if (levelBadge) {
        levelBadge.textContent = `רמה ${level}`;
    }
}

/**
 * רישום event listeners גלובליים
 * Updated to use new state system subscriptions
 */
function registerGlobalListeners() {
    // Subscribe to XP changes - REACTIVE UPDATE!
    subscribe((newXP, oldXP) => {
        console.log(`🎯 XP changed: ${oldXP} → ${newXP}`);
        updateXPBar();
    }, 'user.xp');
    
    // Subscribe to level changes
    subscribe((newLevel, oldLevel) => {
        console.log(`⭐ Level changed: ${oldLevel} → ${newLevel}`);
        updateXPBar();
        
        // Show celebration for level up
        if (newLevel > oldLevel) {
            showNotification(`🎉 עלית לרמה ${newLevel}!`, 'success', 3000);
        }
    }, 'user.level');
    
    // Legacy event listener for backward compatibility
    document.addEventListener('xp:changed', () => {
        updateXPBar();
    });
    
    console.log('✅ Reactive state subscriptions registered');
}

/**
 * טעינה דינמית של מודול (עתידי - לשימוש עם ES modules)
 */
async function loadModuleIfNeeded(moduleName) {
    // כל המודולים כבר נטענים בצורה סטטית
    console.log(`📦 Module already loaded: ${moduleName}`);
}

/**
 * הפיכת פונקציות מרכזיות לגלובליות (תאימות לאחור)
 * הערה: global-bridge.js כבר עושה את זה, אבל נשאיר לתאימות
 */
function exposeGlobalFunctions() {
    // הפונקציות כבר חשופות דרך global-bridge.js
    console.log('✅ Global functions already exposed via global-bridge.js');
    console.log('   - window.showSection:', typeof window.showSection);
    console.log('   - window.addXP:', typeof window.addXP);
    console.log('   - window.updateXPBar:', typeof window.updateXPBar);
}

// ===== אתחול =====

// חשיפת פונקציות גלובליות מיד (לפני DOMContentLoaded)
exposeGlobalFunctions();

document.addEventListener('DOMContentLoaded', () => {
    console.log('📄 DOM Content Loaded');
    
    // אתחול האפליקציה
    initializeApp();
    
    // רישום listeners
    registerGlobalListeners();
    
    console.log('💰 CashWise is ready!');
});

// טיפול בשגיאות גלובליות
window.addEventListener('error', (event) => {
    console.error('❌ Global Error:', event.error);
    // שליחה לאנליטיקס בעתיד
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('❌ Unhandled Promise Rejection:', event.reason);
    // שליחה לאנליטיקס בעתיד
});

// Logging למצב הטעינה
console.log(`
╔══════════════════════════════════════╗
║        🏦 CashWise v6.0              ║
║   Financial Education & Simulation   ║
║                                      ║
║   Status: Loading...                 ║
╚══════════════════════════════════════╝
`);
