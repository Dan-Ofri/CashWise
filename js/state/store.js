/**
 * Simplified State Store for Lesson Module
 * Standalone version without external dependencies
 */

const initialState = {
    user: {
        xp: 0,
        level: 1,
        achievements: [],
        lessonsCompleted: [],
        actionsCompleted: []
    },
    ui: {
        currentSection: 'academy',
        loading: false,
        errors: []
    }
};

class Store {
    constructor(initialState = {}) {
        this.state = { ...initialState };
        this.listeners = [];
        this.history = [{ ...this.state }];
    }

    getState() {
        return { ...this.state };
    }

    setState(updates) {
        const newState = {
            ...this.state,
            ...updates
        };

        // Deep merge for nested objects
        if (updates.user) {
            newState.user = { ...this.state.user, ...updates.user };
        }
        if (updates.ui) {
            newState.ui = { ...this.state.ui, ...updates.ui };
        }

        this.state = newState;
        this.history.push({ ...this.state });
        this.notifyListeners();
        this.saveToLocalStorage();
    }

    subscribe(listener) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    notifyListeners() {
        this.listeners.forEach(listener => listener(this.state));
    }

    saveToLocalStorage() {
        try {
            localStorage.setItem('cashwise_state', JSON.stringify(this.state));
        } catch (error) {
            console.warn('Could not save to localStorage:', error);
        }
    }

    loadFromLocalStorage() {
        try {
            const saved = localStorage.getItem('cashwise_state');
            if (saved) {
                this.state = { ...initialState, ...JSON.parse(saved) };
                this.notifyListeners();
            }
        } catch (error) {
            console.warn('Could not load from localStorage:', error);
        }
    }

    reset() {
        this.state = { ...initialState };
        this.history = [{ ...this.state }];
        this.notifyListeners();
        localStorage.removeItem('cashwise_state');
    }

    // Helper methods for XP
    addXP(amount) {
        const currentXP = this.state.user.xp;
        this.setState({
            user: {
                ...this.state.user,
                xp: currentXP + amount
            }
        });
        return this.state.user.xp;
    }

    addAchievement(achievement) {
        if (!this.state.user.achievements.includes(achievement)) {
            this.setState({
                user: {
                    ...this.state.user,
                    achievements: [...this.state.user.achievements, achievement]
                }
            });
        }
    }

    completeLesson(lessonId) {
        if (!this.state.user.lessonsCompleted.includes(lessonId)) {
            this.setState({
                user: {
                    ...this.state.user,
                    lessonsCompleted: [...this.state.user.lessonsCompleted, lessonId]
                }
            });
        }
    }
}

// Create singleton instance
const store = new Store(initialState);

// Try to load saved state
store.loadFromLocalStorage();

// Export as default
export default store;
