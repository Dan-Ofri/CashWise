/**
 * ===========================================
 * 🏪 Central State Store
 * ===========================================
 * מערכת ניהול state מרכזית עם immutability
 * 
 * תכונות:
 * - Single source of truth
 * - Immutable state updates
 * - Event-driven architecture
 * - State validation
 * - Time travel support
 * - Middleware system
 */

import { saveToStorage, loadFromStorage, STORAGE_KEYS } from '../utils/storage.js';
import { MATH_CONSTANTS } from '../config/index.js';

// ===== State Structure =====

/**
 * מבנה ה-state הראשוני
 */
const initialState = {
    // User Progress
    user: {
        xp: MATH_CONSTANTS.ZERO,
        level: MATH_CONSTANTS.ONE,
        achievements: [],
        lessonsCompleted: [],
        actionsCompleted: [],
        lastLogin: null,
        createdAt: null
    },
    
    // Simulation State
    simulation: {
        character: null,
        isActive: false,
        currentMonth: MATH_CONSTANTS.ZERO,
        events: [],
        history: []
    },
    
    // UI State
    ui: {
        currentSection: 'welcome',
        modalsOpen: [],
        loading: false,
        errors: []
    },
    
    // App Metadata
    meta: {
        version: '7.0',
        lastSaved: null,
        isDirty: false
    }
};

// ===== Store Implementation =====

class Store {
    constructor(initialState) {
        this._state = this._deepClone(initialState);
        this._listeners = new Map();
        this._history = [];
        this._historyIndex = -1;
        this._maxHistory = 50;
        this._middleware = [];
        
        // Save initial state to history
        this._saveToHistory();
    }
    
    /**
     * קבלת state נוכחי (read-only)
     */
    getState() {
        return this._deepClone(this._state);
    }
    
    /**
     * קבלת ערך ספציפי מה-state
     */
    get(path) {
        return this._getByPath(this._state, path);
    }
    
    /**
     * עדכון state (immutable)
     * @param {Function} updater - פונקציה שמחזירה state חדש
     * @param {Object} options - אפשרויות (skipHistory, skipSave)
     */
    setState(updater, options = {}) {
        const oldState = this._deepClone(this._state);
        
        // Run middleware (can modify or cancel)
        for (const middleware of this._middleware) {
            const result = middleware(oldState, updater);
            if (result === false) {
                console.warn('State update cancelled by middleware');
                return false;
            }
            if (typeof result === 'function') {
                updater = result;
            }
        }
        
        // Apply update
        const newState = updater(this._deepClone(this._state));
        
        // Validate state structure
        if (!this._validateState(newState)) {
            console.error('Invalid state structure', newState);
            return false;
        }
        
        // Update state
        this._state = newState;
        this._state.meta.lastSaved = new Date().toISOString();
        this._state.meta.isDirty = true;
        
        // Save to history (unless skipped)
        if (!options.skipHistory) {
            this._saveToHistory();
        }
        
        // Persist to storage (unless skipped)
        if (!options.skipSave) {
            this._persist();
        }
        
        // Notify listeners
        this._notify(oldState, newState);
        
        return true;
    }
    
    /**
     * עדכון חלקי של state (helper)
     */
    update(path, value) {
        return this.setState(state => {
            const newState = this._deepClone(state);
            this._setByPath(newState, path, value);
            return newState;
        });
    }
    
    /**
     * הרשמה לשינויי state
     * @param {Function} listener - פונקציה שתקרא כשה-state משתנה
     * @param {String} path - (אופציונלי) האזן רק לשינויים בנתיב מסוים
     * @returns {Function} unsubscribe function
     */
    subscribe(listener, path = null) {
        const id = Symbol('listener');
        this._listeners.set(id, { listener, path });
        
        // Return unsubscribe function
        return () => this._listeners.delete(id);
    }
    
    /**
     * הוספת middleware
     */
    use(middleware) {
        this._middleware.push(middleware);
    }
    
    /**
     * Undo - חזרה למצב קודם
     */
    undo() {
        if (!this.canUndo()) {
            console.warn('Cannot undo: no history');
            return false;
        }
        
        this._historyIndex--;
        this._state = this._deepClone(this._history[this._historyIndex]);
        this._notify(this._history[this._historyIndex + 1], this._state);
        this._persist();
        
        return true;
    }
    
    /**
     * Redo - חזרה למצב עתידי
     */
    redo() {
        if (!this.canRedo()) {
            console.warn('Cannot redo: no future history');
            return false;
        }
        
        this._historyIndex++;
        this._state = this._deepClone(this._history[this._historyIndex]);
        this._notify(this._history[this._historyIndex - 1], this._state);
        this._persist();
        
        return true;
    }
    
    /**
     * בדיקה אם ניתן לעשות undo
     */
    canUndo() {
        return this._historyIndex > 0;
    }
    
    /**
     * בדיקה אם ניתן לעשות redo
     */
    canRedo() {
        return this._historyIndex < this._history.length - 1;
    }
    
    /**
     * איפוס state למצב התחלתי
     */
    reset() {
        const confirmed = confirm('האם אתה בטוח שברצונך לאפס את כל ההתקדמות?');
        if (!confirmed) return false;
        
        this._state = this._deepClone(initialState);
        this._state.user.createdAt = new Date().toISOString();
        this._history = [this._deepClone(this._state)];
        this._historyIndex = 0;
        this._persist();
        this._notify(null, this._state);
        
        return true;
    }
    
    // ===== Private Methods =====
    
    _deepClone(obj) {
        return JSON.parse(JSON.stringify(obj));
    }
    
    _getByPath(obj, path) {
        if (!path) return obj;
        return path.split('.').reduce((current, key) => current?.[key], obj);
    }
    
    _setByPath(obj, path, value) {
        const keys = path.split('.');
        const lastKey = keys.pop();
        const target = keys.reduce((current, key) => current[key], obj);
        target[lastKey] = value;
    }
    
    _validateState(state) {
        // Basic structure validation
        return state &&
               state.user &&
               state.simulation &&
               state.ui &&
               state.meta &&
               typeof state.user.xp === 'number' &&
               typeof state.user.level === 'number' &&
               Array.isArray(state.user.achievements);
    }
    
    _saveToHistory() {
        // Remove future history if we're in the middle
        if (this._historyIndex < this._history.length - 1) {
            this._history = this._history.slice(0, this._historyIndex + 1);
        }
        
        // Add current state to history
        this._history.push(this._deepClone(this._state));
        this._historyIndex++;
        
        // Limit history size
        if (this._history.length > this._maxHistory) {
            this._history.shift();
            this._historyIndex--;
        }
    }
    
    _notify(oldState, newState) {
        this._listeners.forEach(({ listener, path }) => {
            if (!path) {
                // Global listener - notify always
                listener(newState, oldState);
            } else {
                // Path-specific listener - notify only if changed
                const oldValue = oldState ? this._getByPath(oldState, path) : null;
                const newValue = this._getByPath(newState, path);
                
                if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
                    listener(newValue, oldValue);
                }
            }
        });
    }
    
    _persist() {
        try {
            saveToStorage(STORAGE_KEYS.APP_STATE, this._state);
            this._state.meta.isDirty = false;
        } catch (error) {
            console.error('Failed to persist state:', error);
        }
    }
    
    _load() {
        try {
            const saved = loadFromStorage(STORAGE_KEYS.APP_STATE, null);
            if (saved) {
                // Merge with initial state to handle new fields
                this._state = this._mergeStates(initialState, saved);
                this._saveToHistory();
            }
        } catch (error) {
            console.error('Failed to load state:', error);
        }
    }
    
    _mergeStates(defaultState, savedState) {
        const merged = this._deepClone(defaultState);
        
        // Recursively merge objects
        const merge = (target, source) => {
            for (const key in source) {
                if (source[key] !== null && typeof source[key] === 'object' && !Array.isArray(source[key])) {
                    if (!target[key]) target[key] = {};
                    merge(target[key], source[key]);
                } else {
                    target[key] = source[key];
                }
            }
        };
        
        merge(merged, savedState);
        return merged;
    }
}

// ===== Create Store Instance =====

export const store = new Store(initialState);

// Load saved state on initialization
store._load();

// ===== Export Helpers =====

/**
 * קיצור דרך לקבלת state
 */
export const getState = () => store.getState();

/**
 * קיצור דרך לעדכון state
 */
export const setState = (updater, options) => store.setState(updater, options);

/**
 * קיצור דרך להרשמה לשינויים
 */
export const subscribe = (listener, path) => store.subscribe(listener, path);

console.log('✅ State Store initialized');
