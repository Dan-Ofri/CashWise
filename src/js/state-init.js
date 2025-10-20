/**
 * ===========================================
 * 🚀 State System Initialization
 * ===========================================
 * הפעלת מערכת ניהול ה-State החדשה
 * 
 * קובץ זה צריך להיטען לפני כל הקבצים האחרים
 */

import { store, developmentMiddleware, productionMiddleware } from './state/index.js';

// ===== הגדרת סביבה =====

const isDevelopment = window.location.hostname === 'localhost' || 
                      window.location.hostname === '127.0.0.1' ||
                      window.CASHWISE_DEBUG === true;

console.log(`🌍 Environment: ${isDevelopment ? 'DEVELOPMENT' : 'PRODUCTION'}`);

// ===== הוספת Middleware =====

if (isDevelopment) {
    // סביבת פיתוח - כל ה-middleware
    console.log('🔧 Loading development middleware...');
    developmentMiddleware.forEach(middleware => {
        store.use(middleware);
    });
    console.log('✅ Development middleware loaded');
    
    // Debug mode
    window.CASHWISE_DEBUG = true;
    
    // Expose store to console for debugging
    window.__CASHWISE__ = {
        store,
        getState: () => store.getState(),
        history: () => window._CASHWISE_HISTORY,
        undo: () => store.undo(),
        redo: () => store.redo()
    };
    
    console.log('🐛 Debug tools available: window.__CASHWISE__');
} else {
    // סביבת ייצור - רק validation חיוני
    console.log('🔒 Loading production middleware...');
    productionMiddleware.forEach(middleware => {
        store.use(middleware);
    });
    console.log('✅ Production middleware loaded');
}

// ===== בדיקת תקינות =====

const state = store.getState();

console.log('📊 Initial State:', {
    user: {
        xp: state.user.xp,
        level: state.user.level,
        achievements: state.user.achievements.length,
        lessons: state.user.lessonsCompleted.length
    },
    simulation: {
        active: state.simulation.isActive
    },
    meta: {
        version: state.meta.version
    }
});

// ===== אירועים גלובליים =====

// Listen to all state changes for debugging
if (isDevelopment) {
    const unsubscribe = store.subscribe((newState, oldState) => {
        console.log('🔄 State changed', {
            timestamp: new Date().toISOString(),
            user: {
                xp: oldState.user.xp !== newState.user.xp ? 
                    `${oldState.user.xp} → ${newState.user.xp}` : 'unchanged',
                level: oldState.user.level !== newState.user.level ? 
                    `${oldState.user.level} → ${newState.user.level}` : 'unchanged'
            }
        });
    });
    
    // Store unsubscribe function
    window.__CASHWISE__.unsubscribe = unsubscribe;
}

// ===== Custom Events =====

// Achievement unlocked event
document.addEventListener('cashwise:achievement', (event) => {
    console.log('🏆 Achievement Event:', event.detail);
});

console.log('✅ State System Initialization complete!');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

// ===== ייצוא למודולים אחרים =====

export { store };
export { isDevelopment };
