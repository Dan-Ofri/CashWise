# 🐛 תיקון: כפתור איפוס חסר במודאל פרופיל
**תאריך:** 19 אוקטובר 2025, 02:15  
**בעיה:** כפתור "🔄 אפס את כל המשחק" לא מופיע במודאל הפרופיל

---

## 🎯 הבעיה

המשתמש לחץ על אייקון הפרופיל (👤) בתפריט העליון, והמודאל נפתח - אבל **כפתור האיפוס לא היה שם**.

### למה זה קרה?
1. ✅ הכפתור **קיים** ב-`index.html` בסקשן `#profile` (שורה 261)
2. ❌ אבל המשתמש רואה **מודאל** שנוצר דינמית ב-`modals-sidebars.js`
3. ❌ המודאל לא כלל את כפתור האיפוס בתוכנו

**בעצם:** יש לנו שני מסכי פרופיל!
- 📄 `index.html #profile` - מסך מלא (לא בשימוש)
- 🪟 מודאל דינמי - מוצג בפועל (היה חסר כפתור)

---

## ✅ הפתרון

### שינוי 1: הוספת כפתור למודאל
**קובץ:** `modals-sidebars.js` (שורות 131-150)

הוספתי סקשן חדש במודאל **לפני כפתור הסגירה**:

```javascript
<!-- ניהול נתונים -->
<div class="profile-section" style="margin-top: 24px; border-top: 2px solid #f0f0f0; padding-top: 20px;">
    <h3><i class="fas fa-database"></i> ניהול נתונים</h3>
    <div class="tip-box warn" style="padding: 16px; margin: 12px 0;">
        <p style="margin: 0 0 8px 0; font-weight: 600;">
            <i class="fas fa-exclamation-triangle"></i> 
            איפוס מלא של המשחק
        </p>
        <p style="margin: 0 0 12px 0; font-size: 13px; opacity: 0.9;">
            פעולה זו תמחק את כל ההתקדמות שלך ותחזיר אותך למצב ההתחלתי. 
            שימושי לבדיקות או התחלה מחדש.
        </p>
        <button class="btn-secondary" onclick="resetGameData()" style="width: 100%; font-size: 14px;">
            🔄 אפס את כל המשחק
        </button>
    </div>
</div>
```

**תוצאה:** המודאל עכשיו מכיל את הכפתור! ✅

---

### שינוי 2: ייבוא resetGameData
**קובץ:** `global-bridge.js` (שורה 18)

הוספתי ייבוא מ-`profile.js`:

```javascript
// לפני
import { advanceMonth, resetSimulation, goToInvestmentLesson, dismissTrigger } from '../modules/simulation.js';

// אחרי
import { advanceMonth, resetSimulation, goToInvestmentLesson, dismissTrigger } from '../modules/simulation.js';
import { resetGameData } from '../modules/profile.js';
```

---

### שינוי 3: חשיפה גלובלית
**קובץ:** `global-bridge.js` (שורות 54-57)

הוספתי חשיפה ל-`window`:

```javascript
// חשיפה גלובלית של פונקציות סימולטור
window.advanceMonth = advanceMonth;
window.resetSimulation = resetSimulation;
window.goToInvestmentLesson = goToInvestmentLesson;
window.dismissTrigger = dismissTrigger;

// חשיפה גלובלית של פונקציות פרופיל
window.resetGameData = resetGameData;  // ← חדש!
```

**תוצאה:** `onclick="resetGameData()"` עובד! ✅

---

## 📋 מה קורה כשלוחצים על הכפתור?

```javascript
// 1. אישור מהמשתמש
confirm('⚠️ האם אתה בטוח שברצונך לאפס את כל המשחק?')

// 2. אם אישר - ביצוע איפוס
fullGameReset() // מנקה את כל ה-localStorage

// 3. הודעת הצלחה
showSuccess('🔄 המשחק אופס בהצלחה! טוען מחדש...')

// 4. טעינה מחדש של הדף
setTimeout(() => location.reload(), 1500)
```

**מה נמחק:**
- ✗ התקדמות בסימולציה
- ✗ שיעורים שנלמדו
- ✗ נקודות XP והישגים
- ✗ פרופיל פיננסי
- ✗ דגל "השלמת סימולטור"

---

## 🧪 בדיקה

רענן דפדפן (Ctrl+Shift+R) ובדוק:

1. **לחץ על 👤** בתפריט העליון
2. **גלול למטה** במודאל
3. **צפוי לראות:**
   ```
   🛠️ ניהול נתונים
   ⚠️ איפוס מלא של המשחק
   פעולה זו תמחק את כל ההתקדמות...
   [🔄 אפס את כל המשחק]
   ```
4. **לחץ על הכפתור** → חלון אישור
5. **לחץ OK** → המשחק נטען מחדש במצב התחלתי

---

## 📁 קבצים ששונו

1. **`modals-sidebars.js`** (שורות 131-150)
   - הוספת סקשן "ניהול נתונים"
   - כפתור איפוס עם אזהרה ויזואלית

2. **`global-bridge.js`** (שורה 18 + שורות 54-57)
   - ייבוא `resetGameData` מ-`profile.js`
   - חשיפה גלובלית ל-`window`

---

## ✅ תוצאה

**עכשיו המודאל כולל את כפתור האיפוס!** 🎉

```
[הישגים אחרונים]
📝 תקציבן ראשון
💎 משקיע חכם
────────────────
🛠️ ניהול נתונים
⚠️ איפוס מלא
[🔄 אפס את כל המשחק]  ← כאן!
────────────────
[סגור]
```

**רענן דפדפן ובדוק!** ✨
