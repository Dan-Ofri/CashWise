# ⚙️ Configuration Constants

## 🎯 מטרה

ריכוז כל הערכים הקבועים (Magic Numbers) במקום אחד מרכזי.

## 📚 פילוסופיה

> **"בעיניי עם בסיס חזק בונים גבוה"**

השאיפה היא ש**אף מספר לא יופיע בקוד ישירות** - כל ערך צריך להיות קבוע מוגדר עם שם תיאורי.

## 🗂️ מבנה

```
config/
├── constants.js  - כל הקבועים המרוכזים
├── index.js      - ייצוא מרכזי
└── README.md     - תיעוד זה
```

## 💡 שימוש

### ייבוא בסיסי

```javascript
import { XP_CONFIG, FINANCIAL_RULES } from '../config/index.js';

// שימוש:
const newLevel = Math.floor(xp / XP_CONFIG.XP_PER_LEVEL) + 1;
const emergencyMonths = FINANCIAL_RULES.EMERGENCY_FUND_MONTHS_DEFAULT;
```

### ייבוא כולל

```javascript
import * as CONFIG from '../config/index.js';

// שימוש:
const xpPerLevel = CONFIG.XP_CONFIG.XP_PER_LEVEL;
const bankRate = CONFIG.FINANCIAL_RULES.BANK_SAVINGS_RETURN;
```

### ייבוא סלקטיבי

```javascript
import { 
    XP_CONFIG, 
    FINANCIAL_RULES, 
    UI_TIMING, 
    SIMULATION_CONFIG 
} from '../config/index.js';
```

## 📋 קטגוריות קבועים

### 1. **XP_CONFIG** - מערכת XP

```javascript
XP_CONFIG.XP_PER_LEVEL          // 100 - XP לעליית רמה
XP_CONFIG.MAX_LEVEL             // 50 - רמה מקסימלית
XP_CONFIG.LEVEL_UP_BONUS_XP     // 50 - בונוס לעליית רמה
```

### 2. **ACHIEVEMENT_XP** - XP להישגים

```javascript
ACHIEVEMENT_XP.FIRST_BUDGET     // 50
ACHIEVEMENT_XP.SIMULATION_DONE  // 100
ACHIEVEMENT_XP.ALL_LESSONS      // 200
```

### 3. **XP_REWARDS** - XP לפעולות

```javascript
XP_REWARDS.START_SIMULATION     // 10
XP_REWARDS.MONTH_PROGRESS       // 5
XP_REWARDS.COMPLETE_LESSON      // 30
```

### 4. **FINANCIAL_RULES** - כללים פיננסיים

```javascript
FINANCIAL_RULES.EMERGENCY_FUND_MONTHS_DEFAULT  // 3
FINANCIAL_RULES.DEFAULT_SAVING_RATE            // 0.20 (20%)
FINANCIAL_RULES.INVESTMENT_TAX_RATE            // 0.25 (25%)
FINANCIAL_RULES.BANK_SAVINGS_RETURN            // 0.02 (2%)
FINANCIAL_RULES.MONTHS_PER_YEAR                // 12
```

### 5. **BUDGET_RULES** - כללי תקציב 50/30/20

```javascript
BUDGET_RULES.NEEDS_PERCENTAGE      // 0.50 (50%)
BUDGET_RULES.WANTS_PERCENTAGE      // 0.30 (30%)
BUDGET_RULES.SAVINGS_PERCENTAGE    // 0.20 (20%)
```

### 6. **MENTOR_ACTION_XP** - XP פעולות מנטור

```javascript
MENTOR_ACTION_XP.RAISE_SAVING_10   // 20
MENTOR_ACTION_XP.RAISE_SAVING_20   // 30
MENTOR_ACTION_XP.SET_EMERGENCY_3   // 25
```

### 7. **SIMULATION_CONFIG** - הגדרות סימולציה

```javascript
SIMULATION_CONFIG.STARTING_AGE         // 25
SIMULATION_CONFIG.DEFAULT_SALARY       // 6000
SIMULATION_CONFIG.DEFAULT_GOAL_AMOUNT  // 50000
SIMULATION_CONFIG.BANK_INTEREST_RATE   // 0.02
```

### 8. **UI_TIMING** - זמני ממשק

```javascript
UI_TIMING.NOTIFICATION_DURATION    // 3000ms (3 שניות)
UI_TIMING.ANIMATION_DURATION       // 1000ms (שנייה)
UI_TIMING.MODAL_CLOSE_DELAY        // 300ms
UI_TIMING.DEBOUNCE_DELAY           // 300ms
```

### 9. **VISUAL_EFFECTS** - אפקטים ויזואליים

```javascript
VISUAL_EFFECTS.CONFETTI_PARTICLE_COUNT  // 50
VISUAL_EFFECTS.PROGRESS_BAR_MAX         // 100
VISUAL_EFFECTS.EASING_CUBIC_POWER       // 3
```

### 10. **CHART_CONFIG** - תרשימים

```javascript
CHART_CONFIG.TITLE_FONT_SIZE      // 16
CHART_CONFIG.FONT_FAMILY          // 'Heebo'
CHART_CONFIG.POINT_RADIUS         // 4
CHART_CONFIG.LINE_TENSION         // 0.4
```

### 11. **MATH_CONSTANTS** - קבועים מתמטיים

```javascript
MATH_CONSTANTS.HOURS_PER_DAY             // 24
MATH_CONSTANTS.DEFAULT_DECIMALS          // 2
MATH_CONSTANTS.FULL_PERCENT              // 100
```

### 12. **VALIDATION** - ולידציה

```javascript
VALIDATION.MIN_AGE                 // 18
VALIDATION.MAX_AGE                 // 120
VALIDATION.MIN_SALARY              // 0
VALIDATION.MAX_SALARY              // 1000000
```

### 13. **BREAKPOINTS** - Responsive

```javascript
BREAKPOINTS.MOBILE           // 768
BREAKPOINTS.TABLET           // 1024
BREAKPOINTS.LAPTOP           // 1440
```

## 🔄 דוגמאות המרה

### לפני (❌ Magic Number)

```javascript
const newLevel = Math.floor(state.xp / 100) + 1;
const emergencyTarget = income * 0.5 * 3;
const profit = futureValue * 0.25;
setTimeout(() => checkAchievement('all-lessons'), 1000);
```

### אחרי (✅ קבועים)

```javascript
import { XP_CONFIG, FINANCIAL_RULES, UI_TIMING } from '../config/index.js';

const newLevel = Math.floor(state.xp / XP_CONFIG.XP_PER_LEVEL) + 1;
const emergencyTarget = income * FINANCIAL_RULES.MIN_INCOME_MULTIPLIER * 
                        FINANCIAL_RULES.EMERGENCY_FUND_MONTHS_DEFAULT;
const profit = futureValue * FINANCIAL_RULES.INVESTMENT_TAX_RATE;
setTimeout(() => checkAchievement('all-lessons'), UI_TIMING.ACHIEVEMENT_CHECK_DELAY);
```

## ✅ יתרונות

1. **קריאות** - `XP_CONFIG.XP_PER_LEVEL` מובן יותר מ-`100`
2. **תחזוקה** - שינוי במקום אחד משפיע על כל הקוד
3. **תיעוד** - שמות משתנים מתעדים את המשמעות
4. **בדיקות** - קל לבדוק עם ערכים קבועים
5. **עקביות** - אותו ערך תמיד באותו מקום

## 🚫 כללי זהב

1. **אף מספר בקוד ישירות** - רק קבועים
2. **שמות תיאוריים** - `XP_PER_LEVEL` לא `CONST_A`
3. **ארגון לוגי** - קטגוריות ברורות
4. **תיעוד** - הערה ליד כל קבוע
5. **ייצוא נכון** - דרך index.js

## 🔧 הוספת קבוע חדש

1. פתח את `constants.js`
2. מצא את הקטגוריה המתאימה (או צור חדשה)
3. הוסף את הקבוע עם:
   - שם תיאורי (UPPER_SNAKE_CASE)
   - הערה מסבירה
   - ערך ברור
4. עדכן את ה-README אם צריך

## 📦 דוגמה מלאה

```javascript
// academy.js
import { FINANCIAL_RULES, XP_REWARDS } from '../config/index.js';

export function calculateInvestment(principal, years) {
    const monthlyRate = FINANCIAL_RULES.BANK_SAVINGS_RETURN / 
                        FINANCIAL_RULES.MONTHS_PER_YEAR;
    const months = years * FINANCIAL_RULES.MONTHS_PER_YEAR;
    
    const future = principal * Math.pow(1 + monthlyRate, months);
    const profit = future - principal;
    const tax = profit * FINANCIAL_RULES.INVESTMENT_TAX_RATE;
    const afterTax = future - tax;
    
    addXP(XP_REWARDS.LESSON_INVESTMENT, 'השקעה חושבה');
    
    return afterTax;
}
```

## 🎓 עקרונות נוספים

- **DRY** (Don't Repeat Yourself) - ערך מופיע פעם אחת
- **Single Source of Truth** - מקור אמת יחיד
- **Self-Documenting Code** - קוד שמתעד את עצמו
- **Maintainability** - קל לתחזק ולעדכן

## 📈 מדדי הצלחה

✅ **100% מהמספרים הקבועים הוחלפו בקבועים**  
✅ **אפס magic numbers נותרו בקוד**  
✅ **כל הקבצים מיובאים מ-config/**  
✅ **קל לשנות ערך במקום אחד ולקבל את השינוי בכל מקום**

---

**Created**: 2025-01-XX  
**Philosophy**: בעיניי עם בסיס חזק בונים גבוה 🏗️
