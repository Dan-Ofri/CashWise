# 🏗️ CashWise State Management System

מערכת ניהול state מודרנית, immutable ו-event-driven.

## 📚 תוכן עניינים

- [מושגי יסוד](#מושגי-יסוד)
- [התחלה מהירה](#התחלה-מהירה)
- [Store - החנות המרכזית](#store)
- [Actions - פעולות](#actions)
- [Selectors - שאילתות](#selectors)
- [Middleware - תוספים](#middleware)
- [דוגמאות מתקדמות](#דוגמאות-מתקדמות)
- [Migration Guide](#migration-guide)

---

## 🎯 מושגי יסוד

### State Structure

```javascript
{
  user: {
    xp: 0,
    level: 1,
    achievements: [],
    lessonsCompleted: [],
    actionsCompleted: [],
    lastLogin: null,
    createdAt: '2025-01-01T00:00:00.000Z'
  },
  
  simulation: {
    character: null,
    isActive: false,
    currentMonth: 0,
    events: [],
    history: []
  },
  
  ui: {
    currentSection: 'opening',
    modalsOpen: [],
    loading: false,
    errors: []
  },
  
  meta: {
    version: '1.0.0',
    lastSaved: null,
    isDirty: false
  }
}
```

### עקרונות

1. **Immutability** - State לעולם לא משתנה ישירות, רק נוצר state חדש
2. **Single Source of Truth** - כל הנתונים במקום אחד
3. **Event-Driven** - UI מקשיב לשינויים במקום לבדוק כל הזמן
4. **Time Travel** - אפשר לחזור אחורה עם undo/redo
5. **Predictable** - כל שינוי עובר דרך actions וניתן לעקוב

---

## 🚀 התחלה מהירה

### Basic Usage

```javascript
import { 
  store,
  addXP, 
  getUserXP, 
  subscribe 
} from './state/index.js';

// 1. קריאת state
const currentXP = getUserXP();
console.log('Current XP:', currentXP);

// 2. שינוי state
addXP(50, 'Completed lesson');

// 3. האזנה לשינויים
const unsubscribe = subscribe((newState, oldState) => {
  console.log('State changed!');
  console.log('Old XP:', oldState.user.xp);
  console.log('New XP:', newState.user.xp);
});

// 4. הפסקת האזנה
unsubscribe();
```

### Specific Path Subscription

```javascript
import { subscribe, getUserXP } from './state/index.js';

// האזנה רק לשינויים ב-XP
subscribe((newXP, oldXP) => {
  console.log(`XP changed: ${oldXP} → ${newXP}`);
  
  // עדכון UI
  document.getElementById('xp-display').textContent = newXP;
}, 'user.xp');
```

---

## 🏪 Store

### Core Methods

```javascript
import { store } from './state/index.js';

// קריאת state מלא (clone)
const state = store.getState();

// קריאת ערך ספציפי
const xp = store.get('user.xp');
const character = store.get('simulation.character');

// עדכון state (immutable)
store.setState(state => {
  state.user.xp += 100;
  state.user.level = Math.floor(state.user.xp / 100) + 1;
  return state;
});

// עדכון ערך ספציפי
store.update('user.xp', 500);
store.update('ui.loading', true);
```

### Time Travel

```javascript
// Undo/Redo
if (store.canUndo()) {
  store.undo();
  console.log('Undone!');
}

if (store.canRedo()) {
  store.redo();
  console.log('Redone!');
}
```

### Middleware

```javascript
import { developmentMiddleware } from './state/index.js';

// הוספת middleware
developmentMiddleware.forEach(mw => store.use(mw));

// Middleware מותאם אישית
store.use((oldState, newState, options) => {
  console.log('Custom middleware:', options.reason);
  return true; // אשר את העדכון
});
```

---

## ⚡ Actions

### User Actions

```javascript
import { 
  addXP, 
  unlockAchievement, 
  completeLesson 
} from './state/index.js';

// הוספת XP
const result = addXP(50, 'Completed budget lesson');
console.log(result);
// { oldXP: 0, newXP: 50, oldLevel: 1, newLevel: 1, leveledUp: false, reason: '...' }

// פתיחת הישג
unlockAchievement('first-lesson');

// סימון שיעור כהושלם
completeLesson('budget-basics');
```

### Simulation Actions

```javascript
import { 
  startSimulation, 
  updateSimCharacter, 
  advanceMonth,
  endSimulation 
} from './state/index.js';

// התחלת סימולציה
startSimulation({
  name: 'דני',
  age: 25,
  salary: 6000,
  expenses: 4000,
  savings: 0
});

// עדכון דמות
updateSimCharacter({
  salary: 6500,
  expenses: 4200
});

// התקדמות חודש
advanceMonth();

// סיום סימולציה
endSimulation({
  finalSavings: 12000,
  monthsPlayed: 24,
  rating: '⭐⭐⭐⭐'
});
```

### UI Actions

```javascript
import { 
  setCurrentSection, 
  openModal, 
  closeModal,
  setLoading 
} from './state/index.js';

// מעבר בין sections
setCurrentSection('academy');
setCurrentSection('simulation');

// פתיחת modal
openModal('settings');
openModal('achievement-unlocked');

// סגירת modal
closeModal('settings');

// loading state
setLoading(true);
setTimeout(() => setLoading(false), 2000);
```

### Complex Actions

```javascript
import { resetAll, exportState, importState } from './state/index.js';

// איפוס מלא
resetAll(); // יבקש אישור

// ייצוא state (להורדה)
const json = exportState();

// ייבוא state (מקובץ)
const success = importState(jsonString);
```

---

## 🔍 Selectors

### User Selectors

```javascript
import { 
  getUserXP,
  getUserLevel,
  getNextLevelXP,
  getLevelProgress,
  getAchievementCount,
  getAcademyCompletion
} from './state/index.js';

// בסיסי
const xp = getUserXP(); // 350
const level = getUserLevel(); // 4

// מחושב
const nextXP = getNextLevelXP(); // 400
const progress = getLevelProgress(); // 0.875 (87.5%)

// סטטיסטיקות
const achievementsCount = getAchievementCount(); // 5
const academyPercent = getAcademyCompletion(); // 0.75 (3/4 lessons)
```

### Simulation Selectors

```javascript
import { 
  isSimulationActive,
  getCurrentSavings,
  getMonthlyBalance,
  getSavingsRate,
  hasEmergencyFund,
  getEmergencyFundMonths
} from './state/index.js';

// סטטוס
const active = isSimulationActive(); // true

// פיננסים
const savings = getCurrentSavings(); // 12000
const balance = getMonthlyBalance(); // 2000 (salary - expenses)
const rate = getSavingsRate(); // 0.33 (33%)

// קרן חירום
const hasEmergency = hasEmergencyFund(); // true (>= 3 months)
const months = getEmergencyFundMonths(); // 5.2
```

### Complex Selectors

```javascript
import { 
  getUserStatus,
  getSimulationStatus,
  getFinancialHealth,
  getRecommendations
} from './state/index.js';

// סטטוס מלא של משתמש
const userStatus = getUserStatus();
console.log(userStatus);
/*
{
  xp: 350,
  level: 4,
  nextLevelXP: 400,
  levelProgress: 0.875,
  achievements: ['first-lesson', 'level-5'],
  achievementCount: 2,
  lessonsCompleted: ['budget-basics', 'compound-interest'],
  lessonsCount: 2,
  academyCompletion: 0.5,
  lastLogin: '2025-01-15T10:30:00.000Z',
  accountCreated: '2025-01-01T00:00:00.000Z'
}
*/

// סטטוס סימולציה
const simStatus = getSimulationStatus();
console.log(simStatus);
/*
{
  active: true,
  character: { name: 'דני', age: 25, ... },
  currentMonth: 12,
  currentAge: 26,
  savings: 24000,
  monthlyBalance: 2000,
  savingsRate: 0.33,
  isHealthySavingsRate: true,
  emergencyFundMonths: 6,
  hasEmergencyFund: true,
  events: [...],
  history: [...]
}
*/

// בריאות פיננסית
const health = getFinancialHealth();
console.log(health);
/*
{
  score: 80,
  rating: '⭐⭐⭐⭐⭐ מצוין',
  savingsRate: 0.33,
  emergencyMonths: 6,
  recommendations: []
}
*/

// המלצות
const recommendations = getRecommendations();
console.log(recommendations);
/*
[
  {
    type: 'warning',
    message: 'שיעור החיסכון נמוך מדי...',
    action: 'הקטנת הוצאות'
  }
]
*/
```

---

## 🔌 Middleware

### Development Environment

```javascript
import { store, developmentMiddleware } from './state/index.js';

// כל ה-middleware לפיתוח
developmentMiddleware.forEach(mw => store.use(mw));

// כולל:
// - structureValidation
// - financialValidation
// - xpValidation
// - detailedLogger
// - performanceMonitor
// - devTools (Redux DevTools)
// - memoryHistory
// - achievementTriggers
```

### Production Environment

```javascript
import { store, productionMiddleware } from './state/index.js';

// רק validation חיוני
productionMiddleware.forEach(mw => store.use(mw));

// כולל:
// - structureValidation
// - financialValidation
// - xpValidation
// - rateLimiter
// - achievementTriggers
```

### Custom Middleware

```javascript
// לוג פשוט
store.use((oldState, newState, options) => {
  console.log('State updated:', options.reason);
  return true;
});

// בדיקה מותאמת אישית
store.use((oldState, newState, options) => {
  if (newState.user.xp > 1000000) {
    console.error('XP too high!');
    return false; // בטל עדכון
  }
  return true;
});

// שינוי העדכון
store.use((oldState, newState, options) => {
  // הגבל XP מקסימלי
  return (state) => {
    if (state.user.xp > 1000000) {
      state.user.xp = 1000000;
    }
    return state;
  };
});
```

---

## 🎓 דוגמאות מתקדמות

### React-Style Component

```javascript
import { subscribe, getUserXP, getUserLevel } from './state/index.js';

class UserProfile {
  constructor(element) {
    this.element = element;
    
    // האזנה לשינויים
    subscribe(() => this.render(), 'user');
    
    // רינדור ראשוני
    this.render();
  }
  
  render() {
    const xp = getUserXP();
    const level = getUserLevel();
    
    this.element.innerHTML = `
      <div class="profile">
        <h3>Level ${level}</h3>
        <p>XP: ${xp}</p>
      </div>
    `;
  }
}

// שימוש
const profile = new UserProfile(document.getElementById('user-profile'));
```

### Event-Driven UI Updates

```javascript
import { subscribe, getSimulationStatus } from './state/index.js';

// עדכון אוטומטי של UI
subscribe((newStatus, oldStatus) => {
  // עדכן תצוגת חיסכון
  document.getElementById('savings').textContent = 
    `₪${newStatus.savings.toLocaleString()}`;
  
  // עדכן progress bar
  const progress = (newStatus.savings / 100000) * 100;
  document.getElementById('progress').style.width = `${progress}%`;
  
  // הצג התראה אם עברת יעד
  if (newStatus.savings >= 100000 && oldStatus.savings < 100000) {
    showSuccess('🎉 הגעת ליעד!');
  }
}, 'simulation');
```

### Time Travel Debugger

```javascript
import { store } from './state/index.js';

// כפתורי undo/redo
document.getElementById('undo-btn').addEventListener('click', () => {
  if (store.canUndo()) {
    store.undo();
    updateDebugger();
  }
});

document.getElementById('redo-btn').addEventListener('click', () => {
  if (store.canRedo()) {
    store.redo();
    updateDebugger();
  }
});

function updateDebugger() {
  document.getElementById('undo-btn').disabled = !store.canUndo();
  document.getElementById('redo-btn').disabled = !store.canRedo();
}
```

---

## 🔄 Migration Guide

### מ-state.js הישן למערכת החדשה

#### Before (Old)

```javascript
// src/js/core/state.js
let gameState = {
  xp: 0,
  level: 1
};

function addXP(amount) {
  gameState.xp += amount; // מוטציה ישירה
  saveGameState();
}

function getUserXP() {
  return gameState.xp;
}
```

#### After (New)

```javascript
// שימוש במערכת החדשה
import { addXP, getUserXP, subscribe } from './state/index.js';

// פעולות זהות, אבל immutable
addXP(50, 'Completed lesson');

const xp = getUserXP();

// בונוס: event-driven UI
subscribe((newXP) => {
  updateXPDisplay(newXP);
}, 'user.xp');
```

### המרת קוד קיים

```javascript
// ❌ לפני
gameState.xp += 50;
saveGameState(gameState);

// ✅ אחרי
addXP(50, 'Manual addition');

// ❌ לפני
if (gameState.achievements.includes('level-5')) { ... }

// ✅ אחרי
if (isAchievementUnlocked('level-5')) { ... }

// ❌ לפני
gameState.simulation.character.savings = 10000;

// ✅ אחרי
updateSimCharacter({ savings: 10000 });
```

---

## 🎯 Best Practices

### 1. תמיד דרך Actions

```javascript
// ❌ לא נכון
const state = store.getState();
state.user.xp += 50; // לא יעבוד! state הוא clone

// ✅ נכון
addXP(50, 'Completed task');
```

### 2. השתמש ב-Selectors

```javascript
// ❌ לא נכון
const state = store.getState();
const xp = state.user.xp; // חוזר על קוד

// ✅ נכון
const xp = getUserXP(); // נקי ופשוט
```

### 3. Subscribe לנתונים הספציפיים

```javascript
// ❌ לא יעיל
subscribe(() => {
  updateXPDisplay();
}); // נקרא בכל שינוי

// ✅ יעיל
subscribe((newXP) => {
  updateXPDisplay(newXP);
}, 'user.xp'); // נקרא רק כש-XP משתנה
```

### 4. Unsubscribe כשצריך

```javascript
class Component {
  constructor() {
    this.unsubscribe = subscribe(() => {
      this.render();
    }, 'user');
  }
  
  destroy() {
    this.unsubscribe(); // נקה listeners
  }
}
```

### 5. השתמש ב-Middleware בפיתוח

```javascript
if (process.env.NODE_ENV === 'development') {
  developmentMiddleware.forEach(mw => store.use(mw));
}
```

---

## 🐛 Debugging

### הפעלת Debug Mode

```javascript
// בקונסול או בקוד
window.CASHWISE_DEBUG = true;

// יפעיל:
// - Detailed logging
// - Performance monitoring
// - Memory history
```

### צפייה בהיסטוריה

```javascript
// צפייה ב-50 שינויים אחרונים
console.log(window._CASHWISE_HISTORY);

// סינון לפי reason
window._CASHWISE_HISTORY.filter(h => h.reason?.includes('XP'));
```

### Redux DevTools

1. התקן את [Redux DevTools Extension](https://github.com/reduxjs/redux-devtools)
2. הפעל את ה-middleware:

```javascript
import { devTools } from './state/index.js';
store.use(devTools);
```

3. פתח את DevTools בדפדפן

---

## 📊 Performance Tips

- **Path Subscriptions**: האזן רק למה שצריך
- **Batch Updates**: עדכן כמה ערכים בקריאה אחת
- **Skip Options**: השתמש ב-`skipHistory`, `skipPersist` כשצריך

```javascript
// עדכונים מרובים
store.setState(state => {
  state.user.xp += 50;
  state.user.level = 5;
  state.user.achievements.push('level-5');
  return state;
}, { reason: 'Level up' });

// דלג על history אם לא צריך undo
store.setState(updater, { skipHistory: true });
```

---

**נבנה עם ❤️ על ידי CashWise Team**  
גרסה: 1.0.0 | עדכון אחרון: 2025-01-16
