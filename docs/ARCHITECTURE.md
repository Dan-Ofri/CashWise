# 🏗️ ארכיטקטורת CashWise

## 📋 סקירה כללית

CashWise היא אפליקציית חינוך פיננסי אינטראקטיבית הבנויה כ-**Single Page Application (SPA)** על בסיס HTML, CSS ו-JavaScript vanilla.

---

## 🎯 עקרונות תכנון

### 1. **פשטות (Simplicity)**
- אין תלות בספריות כבדות
- קוד ברור וקריא
- HTML/CSS/JS טהורים

### 2. **מודולריות (Modularity)**
- כל מודול עצמאי ופונקציונלי
- הפרדה ברורה בין תוכן ופונקציונליות
- קל להוסיף תכונות חדשות

### 3. **נגישות (Accessibility)**
- תמיכה מלאה ב-RTL
- סמנטיקה תקינה
- ניווט מקלדת

### 4. **ביצועים (Performance)**
- טעינה מהירה
- מעט HTTP requests
- CSS/JS ממוטבים

---

## 📂 מבנה הפרויקט

```
CashWise/
│
├── index.html                  # דף ראשי - כל האפליקציה
│
├── css/                        # עיצוב
│   ├── style.css              # (לאחד - ישן)
│   ├── style_v2.css           # (לאחד - ישן)
│   ├── premium-*.css          # (לאחד - ישן)
│   └── [קבצים נוספים]
│
├── js/                         # לוגיקה
│   ├── app.js                 # ✅ קובץ ראשי (3849 שורות)
│   ├── analytics-dashboard.js # אנליטיקה
│   ├── realistic_simulation.js# סימולציה
│   ├── smart-ai-assistant.js  # AI עוזר
│   └── [קבצים נוספים]
│
├── assets/                     # משאבים
│   └── images/
│
├── docs/                       # 📚 דוקומנטציה
│   ├── ARCHITECTURE.md        # ⬅️ מסמך זה
│   ├── API_REFERENCE.md       # תיעוד פונקציות
│   ├── DEVELOPMENT_GUIDE.md   # מדריך פיתוח
│   └── ROADMAP.md             # תוכנית עבודה
│
└── archive/                    # ארכיון
    └── old_reports/           # דוחות ישנים

```

---

## 🧩 מודולים עיקריים

### 1. **מסך פתיחה (Opening)**
- **קובץ:** `index.html` (section#opening)
- **מטרה:** קבלת פנים למשתמש
- **תכונות:**
  - הצגת לוגו ושם המערכת
  - 4 כפתורי ניווט ראשיים
  - אנימציות כניסה

### 2. **אקדמיית הכסף (Academy)**
- **קובץ:** `index.html` (section#academy) + `app.js`
- **מטרה:** למידה פיננסית אינטראקטיבית
- **תכונות:**
  - רשימת שיעורים
  - תוכן לימודי
  - בדיקות הבנה
  - מעקב אחר התקדמות
  
**שיעורים נוכחיים:**
1. בניית תקציב אישי ✅
2. ריבית דריבית (בפיתוח)
3. קרן חירום (בפיתוח)
4. השקעות בסיסיות (מתוכנן)

### 3. **סימולטור החיים (Life Simulator)**
- **קובץ:** `realistic_simulation.js` + `app.js`
- **מטרה:** תרגול החלטות פיננסיות
- **תכונות:**
  - בחירת תרחיש חיים
  - אירועים אקראיים
  - החלטות כספיות
  - מעקב אחר תוצאות

**תרחישים נוכחיים:**
- צעיר מתחיל (גיל 25, משכורת 6000₪)
- משפחה צעירה
- עצמאי מתחיל
- פנסיונר

### 4. **פרופיל פיננסי (Financial Profile)**
- **קובץ:** `index.html` (section#profile) + `app.js`
- **מטרה:** מעקב אחר המצב הפיננסי
- **תכונות:**
  - הכנסות והוצאות
  - חיסכון והשקעות
  - דירוג פיננסי (1-5 כוכבים)
  - גרפים ויזואליים

### 5. **מנטור פיננסי AI (AI Mentor)**
- **קובץ:** `smart-ai-assistant.js` + `quick-mentor.js`
- **מטרה:** ליווי אישי והמלצות
- **תכונות:**
  - צ'אט אינטראקטיבי
  - ניתוח מצב פיננסי
  - המלצות מותאמות
  - תחזיות עתידיות

### 6. **דשבורד אנליטיקה (Analytics Dashboard)**
- **קובץ:** `analytics-dashboard.js`
- **מטרה:** תובנות מבוססות נתונים
- **תכונות:**
  - 4 KPI cards
  - גרפים דינמיים (Chart.js)
  - מדד בריאות פיננסית
  - מעקב יעדים

---

## 🔄 זרימת נתונים

```
[User Action]
     ↓
[Event Handler]
     ↓
[Business Logic]
     ↓
[State Update]
     ↓
[UI Render]
```

### דוגמה: בניית תקציב

1. **משתמש** ממלא טופס הכנסות והוצאות
2. **Event Handler** `handleBudgetSubmit()` מופעל
3. **Validation** בדיקת תקינות קלט
4. **Calculation** חישוב יתרה, אחוזים
5. **State** עדכון `userData` ב-localStorage
6. **Render** עדכון UI + הודעת הצלחה

---

## 💾 ניהול State

### localStorage Structure

```javascript
{
  // פרטי משתמש
  "userData": {
    "name": "דני",
    "age": 28,
    "income": 10000,
    "expenses": 7000,
    "savings": 3000,
    "financialRating": 4
  },
  
  // התקדמות באקדמיה
  "academyProgress": {
    "completedLessons": ["budget-basics"],
    "currentLesson": "compound-interest",
    "totalXP": 150
  },
  
  // הישגים
  "achievements": [
    {
      "id": "first-budget",
      "unlocked": true,
      "date": "2025-10-15"
    }
  ],
  
  // העדפות
  "preferences": {
    "theme": "premium-dark",
    "soundEnabled": true
  }
}
```

---

## 🎨 מערכת עיצוב

### CSS Variables (Design Tokens)

```css
:root {
  /* צבעים ראשיים */
  --primary-color: #667eea;
  --secondary-color: #764ba2;
  --success-color: #10B981;
  --warning-color: #F59E0B;
  --error-color: #EF4444;
  
  /* טיפוגרפיה */
  --font-family: 'Heebo', sans-serif;
  --font-size-base: 16px;
  
  /* מרווחים */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  
  /* Border Radius */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  
  /* Shadows */
  --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.1);
  --shadow-md: 0 4px 16px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 40px rgba(0, 0, 0, 0.2);
}
```

### Component Structure

```css
/* Block */
.card { }

/* Elements */
.card__header { }
.card__body { }
.card__footer { }

/* Modifiers */
.card--highlighted { }
.card--success { }
```

---

## 🔌 תלויות חיצוניות

### Libraries בשימוש

1. **Chart.js** (v4.4.0)
   - מטרה: גרפים אינטראקטיביים
   - שימוש: דשבורד אנליטיקה, פרופיל
   - CDN: `https://cdn.jsdelivr.net/npm/chart.js@4.4.0`

2. **GSAP** (v3.12.2)
   - מטרה: אנימציות מתקדמות
   - שימוש: אפקטים ויזואליים
   - CDN: `https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js`

3. **Google Fonts**
   - פונט: Heebo (עברית)
   - משקלים: 300, 400, 500, 700

---

## 🚀 תהליך טעינה

### Loading Sequence

```
1. HTML Parse
2. CSS Load (11 קבצים - צריך לצמצם!)
3. External Libraries (Chart.js, GSAP)
4. app.js Load
5. DOMContentLoaded Event
6. Initialize App
7. Show Opening Section
```

### Performance Metrics (יעד)

- **First Contentful Paint:** < 1.5s
- **Time to Interactive:** < 3s
- **Total Bundle Size:** < 500KB

---

## 🔒 אבטחה

### נקודות תשומת לב

1. **Input Validation**
   - כל קלט משתמש נבדק
   - Sanitization של HTML
   
2. **XSS Protection**
   - שימוש ב-`textContent` במקום `innerHTML`
   - Escape של תווים מיוחדים

3. **localStorage**
   - אין שמירת מידע רגיש
   - רק העדפות ותוצאות למידה

---

## 📱 Responsive Design

### Breakpoints

```css
/* Mobile */
@media (max-width: 768px) { }

/* Tablet */
@media (min-width: 769px) and (max-width: 1024px) { }

/* Desktop */
@media (min-width: 1025px) { }
```

### Mobile-First Approach

```css
/* Base styles (mobile) */
.container {
  padding: 16px;
}

/* Tablet and up */
@media (min-width: 769px) {
  .container {
    padding: 32px;
  }
}
```

---

## 🧪 Testing Strategy

### Manual Testing Checklist

- [ ] כל הלינקים עובדים
- [ ] טפסים מאומתים כראוי
- [ ] Responsive בכל המסכים
- [ ] תמיכה בדפדפנים שונים
- [ ] אין שגיאות ב-console

### Automated Testing (עתידי)

- Unit Tests (Jest)
- Integration Tests (Cypress)
- E2E Tests (Playwright)

---

## 🔮 תוכנית עתידית

### Phase 1: ניקוי וארגון (שבוע 1-2) 🔄
- ✅ ניקוי קבצים ישנים
- 🔄 מיזוג CSS (11 → 4 קבצים)
- 🔄 פירוק app.js (3849 → קבצים קטנים)
- ⏳ תיעוד מלא

### Phase 2: שיפורים טכנולוגיים (שבוע 3-4)
- ⏳ ES6 Modules
- ⏳ Build Process (Vite/Webpack)
- ⏳ TypeScript (אופציונלי)
- ⏳ Unit Tests

### Phase 3: תכונות חדשות (חודש 2)
- ⏳ אקדמיה מורחבת (10 שיעורים)
- ⏳ סימולציות נוספות
- ⏳ מערכת Gamification מלאה
- ⏳ Community Features

### Phase 4: Backend & Database (חודש 3)
- ⏳ Node.js + Express
- ⏳ MongoDB/PostgreSQL
- ⏳ Authentication
- ⏳ API RESTful

---

## 📊 מטריקות טכניות (נוכחי)

| מדד | ערך נוכחי | יעד |
|-----|----------|-----|
| **קבצי CSS** | 11 | 4 |
| **גודל app.js** | 3,849 שורות | <500 שורות |
| **קבצי JS** | 8 | 15-20 מודולרים |
| **קבצי דוקומנטציה** | 30+ | 6 |
| **תלויות** | 2 (Chart.js, GSAP) | 2-3 |

---

## 🤝 תרומה לפרויקט

ראה [`../CONTRIBUTING.md`](../CONTRIBUTING.md) למדריך מפורט.

---

**עדכון אחרון:** 17 באוקטובר 2025  
**גרסה:** 5.0 (בתהליך ארגון מחדש)
