/**
 * ===========================================
 * ⚡ State Actions
 * ===========================================
 * כל הפעולות המותרות לשינוי ה-state
 * 
 * עקרון: אף פעם לא לשנות state ישירות!
 * תמיד דרך actions.
 */

import { store } from './store.js';
import { showSuccess, showError } from '../utils/notifications.js';
import { 
    XP_CONFIG, 
    ACHIEVEMENT_XP, 
    LEVEL_MILESTONES,
    MATH_CONSTANTS 
} from '../config/index.js';

// ===== User Actions =====

/**
 * הוספת XP למשתמש
 */
export function addXP(amount, reason = '') {
    const oldState = store.getState();
    const oldXP = oldState.user.xp;
    const oldLevel = oldState.user.level;
    
    store.setState(state => {
        state.user.xp += amount;
        
        // חישוב רמה חדשה
        const newLevel = Math.floor(state.user.xp / XP_CONFIG.XP_PER_LEVEL) + MATH_CONSTANTS.ONE;
        const leveledUp = newLevel > oldLevel;
        
        if (leveledUp) {
            state.user.level = newLevel;
            
            // הישגי רמות
            if (newLevel === LEVEL_MILESTONES.LEVEL_5) {
                unlockAchievement('level-5')(state);
            }
            if (newLevel === LEVEL_MILESTONES.LEVEL_10) {
                unlockAchievement('money-master')(state);
            }
            
            showSuccess(`🎉 עלית לרמה ${newLevel}!`);
        }
        
        return state;
    });
    
    const newState = store.getState();
    
    return {
        oldXP,
        newXP: newState.user.xp,
        oldLevel,
        newLevel: newState.user.level,
        leveledUp: newState.user.level > oldLevel,
        reason
    };
}

/**
 * פתיחת הישג
 */
export function unlockAchievement(achievementId) {
    return (state) => {
        // בדיקה אם כבר קיים
        if (state.user.achievements.includes(achievementId)) {
            return state;
        }
        
        // הוספה לרשימה
        state.user.achievements.push(achievementId);
        
        // הוספת XP של ההישג
        const xp = ACHIEVEMENT_XP[achievementId.toUpperCase().replace(/-/g, '_')];
        if (xp) {
            state.user.xp += xp;
        }
        
        showSuccess(`🏆 הישג חדש: ${achievementId}`);
        
        return state;
    };
}

/**
 * השלמת שיעור
 */
export function completeLesson(lessonId) {
    store.setState(state => {
        if (!state.user.lessonsCompleted.includes(lessonId)) {
            state.user.lessonsCompleted.push(lessonId);
        }
        return state;
    });
}

/**
 * הוספת פעולה שהושלמה
 */
export function addCompletedAction(actionId) {
    store.setState(state => {
        if (!state.user.actionsCompleted.includes(actionId)) {
            state.user.actionsCompleted.push(actionId);
        }
        return state;
    });
}

/**
 * עדכון זמן כניסה אחרון
 */
export function updateLastLogin() {
    store.update('user.lastLogin', new Date().toISOString());
}

// ===== Simulation Actions =====

/**
 * התחלת סימולציה
 */
export function startSimulation(characterData) {
    store.setState(state => {
        state.simulation.character = {
            ...characterData,
            createdAt: new Date().toISOString()
        };
        state.simulation.isActive = true;
        state.simulation.currentMonth = MATH_CONSTANTS.ZERO;
        state.simulation.events = [];
        state.simulation.history = [];
        
        return state;
    });
    
    showSuccess('🎮 הסימולציה התחילה!');
}

/**
 * עדכון דמות בסימולציה
 */
export function updateSimCharacter(updates) {
    store.setState(state => {
        if (!state.simulation.character) {
            console.warn('No active simulation character');
            return state;
        }
        
        state.simulation.character = {
            ...state.simulation.character,
            ...updates,
            updatedAt: new Date().toISOString()
        };
        
        return state;
    });
}

/**
 * התקדמות חודש בסימולציה
 */
export function advanceMonth() {
    store.setState(state => {
        if (!state.simulation.isActive) {
            console.warn('No active simulation');
            return state;
        }
        
        state.simulation.currentMonth += MATH_CONSTANTS.ONE;
        
        // שמירת היסטוריה
        state.simulation.history.push({
            month: state.simulation.currentMonth,
            character: { ...state.simulation.character },
            timestamp: new Date().toISOString()
        });
        
        return state;
    });
}

/**
 * הוספת אירוע לסימולציה
 */
export function addSimEvent(event) {
    store.setState(state => {
        state.simulation.events.push({
            ...event,
            id: Date.now(),
            timestamp: new Date().toISOString()
        });
        
        return state;
    });
}

/**
 * סיום סימולציה
 */
export function endSimulation(results = null) {
    store.setState(state => {
        state.simulation.isActive = false;
        
        if (results) {
            // שמירת תוצאות
            state.simulation.lastResults = {
                ...results,
                completedAt: new Date().toISOString()
            };
        }
        
        return state;
    });
    
    showSuccess('✅ הסימולציה הסתיימה!');
}

// ===== UI Actions =====

/**
 * שינוי section נוכחי
 */
export function setCurrentSection(sectionId) {
    store.update('ui.currentSection', sectionId);
}

/**
 * פתיחת modal
 */
export function openModal(modalId) {
    store.setState(state => {
        if (!state.ui.modalsOpen.includes(modalId)) {
            state.ui.modalsOpen.push(modalId);
        }
        return state;
    });
}

/**
 * סגירת modal
 */
export function closeModal(modalId) {
    store.setState(state => {
        state.ui.modalsOpen = state.ui.modalsOpen.filter(id => id !== modalId);
        return state;
    });
}

/**
 * הגדרת loading state
 */
export function setLoading(loading) {
    store.update('ui.loading', loading);
}

/**
 * הוספת שגיאה
 */
export function addError(error) {
    store.setState(state => {
        state.ui.errors.push({
            message: error,
            timestamp: new Date().toISOString(),
            id: Date.now()
        });
        return state;
    });
    
    showError(error);
}

/**
 * ניקוי שגיאות
 */
export function clearErrors() {
    store.update('ui.errors', []);
}

// ===== App Metadata Actions =====

/**
 * סימון ש-state שונה
 */
export function markDirty() {
    store.update('meta.isDirty', true);
}

/**
 * סימון ש-state נשמר
 */
export function markClean() {
    store.update('meta.isDirty', false);
}

// ===== Complex Actions (Composed) =====

/**
 * איפוס מלא של המשחק
 */
export function resetAll() {
    return store.reset();
}

/**
 * ייבוא state מקובץ
 */
export function importState(stateData) {
    try {
        const parsed = typeof stateData === 'string' ? JSON.parse(stateData) : stateData;
        
        store.setState(() => parsed, { skipHistory: true });
        showSuccess('✅ State imported successfully');
        
        return true;
    } catch (error) {
        console.error('Failed to import state:', error);
        showError('❌ Failed to import state');
        return false;
    }
}

/**
 * ייצוא state לקובץ
 */
export function exportState() {
    const state = store.getState();
    const json = JSON.stringify(state, null, 2);
    
    // יצירת קובץ להורדה
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cashwise-save-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    showSuccess('✅ State exported successfully');
    
    return json;
}

console.log('✅ State Actions loaded');
