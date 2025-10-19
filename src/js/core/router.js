/**
 * ===========================================
 * 🧭 Router - Navigation System
 * ===========================================
 * ניהול ניווט בין מסכים באפליקציה
 */

import { smoothScrollTo } from '../utils/ui-effects.js';
import { emitAppEvent } from './state.js';

// מפת כותרות המסכים
const SECTION_TITLES = {
    opening: 'ברוכים הבאים לCashWise',
    academy: 'אקדמיית הכסף',
    simulation: 'סימולטור החיים',
    profile: 'הפרופיל הפיננסי שלי',
    mentor: 'המנטור הפיננסי',
    analytics: 'דשבורד אנליטיקס'
};

// מסך נוכחי
let currentSection = 'opening';

// היסטוריית ניווט
const navigationHistory = [];

/**
 * קבלת כותרת מסך
 */
export function getSectionTitle(sectionId) {
    return SECTION_TITLES[sectionId] || 'CashWise';
}

/**
 * קבלת המסך הנוכחי
 */
export function getCurrentSection() {
    return currentSection;
}

/**
 * קבלת היסטוריית ניווט
 */
export function getNavigationHistory() {
    return [...navigationHistory];
}

/**
 * הצגת מסך
 * @param {string} sectionId - ID של המסך להצגה
 * @param {boolean} addToHistory - האם להוסיף להיסטוריה
 */
export function showSection(sectionId, addToHistory = true) {
    console.log(`🧭 Navigating to: ${sectionId}`);
    
    // בדיקה שהמסך קיים
    const section = document.getElementById(sectionId);
    if (!section) {
        console.error(`❌ Section not found: ${sectionId}`);
        return false;
    }
    
    // הסתרת כל המסכים
    const allSections = document.querySelectorAll('section');
    allSections.forEach(s => {
        s.classList.remove('active');
    });
    
    // הצגת המסך הנבחר
    section.classList.add('active');
    
    // עדכון כותרת הדף
    document.title = getSectionTitle(sectionId) + ' | CashWise';
    
    // גלילה לראש הדף
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // שמירת המסך הקודם והוספה להיסטוריה
    if (addToHistory && currentSection !== sectionId) {
        navigationHistory.push({
            from: currentSection,
            to: sectionId,
            timestamp: new Date().toISOString()
        });
    }
    
    // עדכון מסך נוכחי
    const previousSection = currentSection;
    currentSection = sectionId;
    
    // פליטת אירוע ניווט
    emitAppEvent('navigation:change', {
        from: previousSection,
        to: sectionId,
        timestamp: new Date().toISOString()
    });
    
    // אירועים ספציפיים למסכים מסוימים
    handleSectionEntry(sectionId);
    
    return true;
}

/**
 * טיפול באירועים בכניסה למסך
 */
function handleSectionEntry(sectionId) {
    // הצגת/הסתרת כפתורים צפים בסימולטור
    const goalBtn = document.getElementById('sim-goal-btn');
    const tipsBtn = document.getElementById('sim-tips-btn');
    
    if (sectionId === 'simulation') {
        if (goalBtn) goalBtn.style.display = 'flex';
        if (tipsBtn) tipsBtn.style.display = 'flex';
    } else {
        if (goalBtn) goalBtn.style.display = 'none';
        if (tipsBtn) tipsBtn.style.display = 'none';
    }
    
    switch (sectionId) {
        case 'profile':
            // טעינת נתוני פרופיל
            emitAppEvent('profile:entered');
            break;
            
        case 'analytics':
            // רענון דשבורד
            emitAppEvent('analytics:refresh');
            break;
            
        case 'simulation':
            // טעינת סימולציה
            emitAppEvent('simulation:entered');
            break;
            
        case 'academy':
            // אתחול אקדמיה + רינדור רשימת שיעורים
            emitAppEvent('academy:entered');
            // ייבוא דינמי כדי למנוע circular dependencies
            import('../modules/floating-academy.js').then(module => {
                if (module.renderAcademySection) {
                    module.renderAcademySection();
                }
            });
            break;
            
        case 'mentor':
            // אתחול מנטור
            emitAppEvent('mentor:entered');
            break;
    }
}

/**
 * חזרה למסך הקודם
 */
export function goBack() {
    if (navigationHistory.length === 0) {
        return showSection('opening', false);
    }
    
    const lastNav = navigationHistory.pop();
    return showSection(lastNav.from, false);
}

/**
 * ניווט למסך הבית
 */
export function goHome() {
    navigationHistory.length = 0; // ניקוי היסטוריה
    return showSection('opening', false);
}

/**
 * בדיקה אם ניתן לחזור אחורה
 */
export function canGoBack() {
    return navigationHistory.length > 0;
}

/**
 * אתחול Router
 */
export function initRouter() {
    console.log('🧭 Initializing Router...');
    
    // וידוא שמסך הפתיחה מוצג
    showSection('opening', false);
    
    // הוספת event listeners לכפתורי ניווט
    setupNavigationButtons();
    
    // תמיכה בכפתור Back של הדפדפן (אופציונלי - עתידי)
    // window.addEventListener('popstate', handlePopState);
    
    console.log('✅ Router initialized');
}

/**
 * הגדרת כפתורי ניווט
 */
function setupNavigationButtons() {
    // כפתורים עם data-navigate
    document.querySelectorAll('[data-navigate]').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const target = button.getAttribute('data-navigate');
            if (target) {
                showSection(target);
            }
        });
    });
    
    // לינקים עם data-section
    document.querySelectorAll('[data-section]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = link.getAttribute('data-section');
            if (target) {
                showSection(target);
            }
        });
    });
}

/**
 * רישום מסך חדש (למטרות עתידיות)
 */
export function registerSection(sectionId, title) {
    SECTION_TITLES[sectionId] = title;
    console.log(`✅ Registered section: ${sectionId} - ${title}`);
}

/**
 * קבלת כל המסכים הרשומים
 */
export function getAllSections() {
    return Object.keys(SECTION_TITLES);
}

// ===== פונקציות עזר למעבר בין טאבים באקדמיה =====

/**
 * מעבר בין שיעורים באקדמיה
 */
export function switchLessonTab(evt, tabId) {
    console.log('🔄 switchLessonTab called:', { evt, tabId });
    
    try {
        // הסרת active מכל הכפתורים
        const buttons = document.querySelectorAll('#academy .tab-button');
        buttons.forEach(btn => btn.classList.remove('active'));
        
        // הסרת active מכל התוכן
        const contents = document.querySelectorAll('#academy .tab-content');
        contents.forEach(tc => tc.classList.remove('active'));
        
        // הוספת active לתוכן הנבחר
        const target = document.getElementById(tabId);
        if (target) {
            target.classList.add('active');
        } else {
            console.error('❌ Tab content not found:', tabId);
            return false;
        }
        
        // הוספת active לכפתור שנלחץ
        if (evt && evt.currentTarget) {
            evt.currentTarget.classList.add('active');
        } else if (evt && evt.target) {
            evt.target.classList.add('active');
        } else {
            // אם אין event, מצא את הכפתור לפי data-tab
            const button = document.querySelector(`#academy .tab-button[data-tab="${tabId}"]`);
            if (button) {
                button.classList.add('active');
            }
        }
        
        console.log('✅ Switched to tab successfully:', tabId);
        
        // פליטת אירוע
        emitAppEvent('academy:tab-changed', { tabId });
        
        return true;
    } catch (error) {
        console.error('❌ Error in switchLessonTab:', error);
        return false;
    }
}

// הערה: חשיפה גלובלית נעשית דרך global-bridge.js
