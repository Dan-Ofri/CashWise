# 📂 src/ - CashWise v7.0 Source Code

> **קוד המקור המודולרי של CashWise**  
> **גרסה:** 7.0  
> **ארכיטקטורה:** ES6 Modules

---

## 📊 סיכום

```
src/
├── js/ (22 קבצים, ~3,876 שורות)
│   ├── utils/       9 modules + index.js
│   ├── components/  2 modules + index.js
│   ├── core/        3 modules + index.js
│   └── modules/     5 modules + index.js
└── css/ (5 קבצים, ~2,000 שורות)
    ├── main.css
    ├── components.css
    ├── themes.css
    ├── utilities.css
    └── README.md
```

---

## 📁 js/ - JavaScript Modules

### 🛠️ utils/ (9 modules + index)
**תפקיד:** פונקציות עזר כלליות

| קובץ | תיאור | Exports |
|------|-------|---------|
| `index.js` | Re-exports all utils | All |
| `notifications.js` | מערכת התראות | 5 |
| `ui-effects.js` | אפקטים ויזואליים | 8 |
| `format.js` | פורמט מספרים/תאריכים | 11 |
| `validation.js` | ולידציות קלט | 9 |
| `performance.js` | אופטימיזציות | 5 |
| `storage.js` | localStorage wrapper | 9 |
| `errors.js` | טיפול בשגיאות | 4 |
| `date.js` | עבודה עם תאריכים | 10 |

**סה"כ:** ~1,000 שורות, 61 exports

---

### 🧩 components/ (2 modules + index)
**תפקיד:** קומפוננטות UI לשימוש חוזר

| קובץ | תיאור | Exports |
|------|-------|---------|
| `index.js` | Re-exports all components | All |
| `modal.js` | חלונות מודאליים (Promise-based) | 5 |
| `charts.js` | גרפים (Chart.js wrappers) | 11 |

**סה"כ:** ~645 שורות, 16 exports

---

### ⚙️ core/ (3 modules + index)
**תפקיד:** ליבת המערכת

| קובץ | תיאור | Exports |
|------|-------|---------|
| `index.js` | Re-exports all core | All |
| `state.js` | ניהול state מרכזי | 24 |
| `router.js` | ניווט SPA | 11 |
| `app.js` | נקודת כניסה ראשית | 3 |

**סה"כ:** ~866 שורות, 38 exports

---

### 🎮 modules/ (5 modules + index)
**תפקיד:** מודולי פיצ'רים עיקריים

| קובץ | תיאור | Exports |
|------|-------|---------|
| `index.js` | Re-exports all modules | All |
| `profile.js` | פרופיל משתמש | 8 |
| `academy.js` | אקדמיית הכסף | 5 |
| `mentor.js` | מנטור AI | 4 |
| `analytics.js` | אנליטיקס | 7 |
| `simulation.js` | סימולטור החיים | 8 |

**סה"כ:** ~1,365 שורות, 32 exports

---

## 🎨 css/ - Stylesheets

### קבצי CSS (5 קבצים)

| קובץ | תיאור | גודל משוערך |
|------|-------|--------------|
| `main.css` | Base styles, Reset, Layout | ~600 שורות |
| `components.css` | Component-specific styles | ~800 שורות |
| `themes.css` | CSS Variables, Themes | ~300 שורות |
| `utilities.css` | Utility classes | ~250 שורות |
| `README.md` | תיעוד CSS | ~50 שורות |

**סה"כ:** ~2,000 שורות CSS

---

## 🔄 Import Flow

```
index.html
    ↓
src/js/core/app.js (Entry Point)
    ↓
src/js/core/state.js
src/js/core/router.js
    ↓
src/js/modules/*.js (Features)
    ↓
src/js/components/*.js (UI)
src/js/utils/*.js (Helpers)
```

---

## 📋 Naming Conventions

### JavaScript
- **Files:** `kebab-case.js`
- **Functions:** `camelCase()`
- **Classes:** `PascalCase`
- **Constants:** `UPPER_SNAKE_CASE`

### CSS
- **Files:** `kebab-case.css`
- **Classes:** BEM methodology
- **Variables:** `--kebab-case`

---

## 🎯 Design Patterns

### 1. Module Pattern
```javascript
// Each file exports specific functions
export function doSomething() { ... }
export function doSomethingElse() { ... }
```

### 2. Index Re-exports
```javascript
// utils/index.js
export * from './notifications.js';
export * from './ui-effects.js';
// ... etc
```

### 3. Centralized State
```javascript
// core/state.js
const state = { ... };
export function getState() { return state; }
export function updateState(updates) { ... }
```

---

## ✅ Quality Standards

### Code Quality
- ✅ ESLint compliant (future)
- ✅ Consistent naming
- ✅ Error handling
- ✅ Comments in Hebrew
- ✅ JSDoc ready

### Architecture
- ✅ Single Responsibility
- ✅ DRY principle
- ✅ Modularity
- ✅ Reusability
- ✅ No circular dependencies

---

## 📚 Documentation

### Each module includes:
- **Header comment** - תיאור קצר
- **Function docs** - מה הפונקציה עושה
- **Parameter types** - סוגי פרמטרים
- **Return values** - מה מוחזר
- **Usage examples** - דוגמאות שימוש

### Example:
```javascript
/**
 * מציג התראה למשתמש
 * @param {string} message - הטקסט להצגה
 * @param {string} type - סוג: 'success', 'error', 'info'
 * @returns {void}
 */
export function showNotification(message, type = 'info') {
    // ...
}
```

---

## 🚀 Usage

### Import from utils:
```javascript
import { showNotification, formatCurrency } from './utils/index.js';
```

### Import from components:
```javascript
import { showModal, createChart } from './components/index.js';
```

### Import from core:
```javascript
import { getState, updateState } from './core/state.js';
import { navigateTo } from './core/router.js';
```

### Import from modules:
```javascript
import { loadProfile } from './modules/profile.js';
import { startSimulation } from './modules/simulation.js';
```

---

## 🔧 Development

### Adding a new utility:
1. Create `src/js/utils/my-utility.js`
2. Export functions: `export function myFunction() { ... }`
3. Add to `src/js/utils/index.js`: `export * from './my-utility.js';`

### Adding a new component:
1. Create `src/js/components/my-component.js`
2. Export component: `export function MyComponent() { ... }`
3. Add to `src/js/components/index.js`

### Adding a new module:
1. Create `src/js/modules/my-module.js`
2. Export module functions
3. Add to `src/js/modules/index.js`
4. Import in relevant files

---

## 📊 Statistics

| Category | Files | Lines | Exports |
|----------|-------|-------|---------|
| **utils** | 10 | ~1,000 | 61 |
| **components** | 3 | ~645 | 16 |
| **core** | 4 | ~866 | 38 |
| **modules** | 6 | ~1,365 | 32 |
| **TOTAL** | **22** | **~3,876** | **147** |

---

## 🎯 Next Steps

1. ✅ **Testing** - פתח index.html ובדוק
2. 🔄 **Stage 2** - טריגרים אוטומטיים
3. 📊 **Charts** - השלמת Chart.js
4. 🧪 **Unit Tests** - כתיבת טסטים

---

**📅 עודכן:** 17 אוקטובר 2025  
**✅ סטטוס:** מוכן לשימוש!  
**📝 לתיעוד מלא:** ראה `../README.md`
