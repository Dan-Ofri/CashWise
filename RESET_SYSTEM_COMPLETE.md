# 🔄 מערכת איפוס והשחזור משחק
**תאריך:** 19 אוקטובר 2025, 01:20  
**מטרה:** אפשרות לאפס את המשחק ולבדוק את מערכת פתיחת השיעורים

---

## 🎯 הבעיה

**המצב:** המשתמש כבר סיים את הסימולציה ולא יכול לבדוק את מערכת פתיחת השיעורים החדשה  
**הפתרון:** הוספת מערכת מלאה של איפוס, ייצוא וייבוא נתונים

---

## ✅ פונקציות שנוספו

### 1️⃣ איפוס מלא - `fullGameReset()`
**קובץ:** `state.js` (שורות 312-348)

```javascript
export function fullGameReset() {
    console.log('🔄 Starting full game reset...');
    
    // איפוס מצב משחק (XP, רמה, הישגים)
    gameState = initGameState();
    saveGameState(gameState);
    
    // מחיקת סימולציה
    clearSimulation();
    
    // מחיקת פרופיל משתמש
    saveToStorage(STORAGE_KEYS.USER_PROFILE, null);
    
    // מחיקת שיעורים
    localStorage.removeItem('lessons-state');
    
    // מחיקת הצלחת סימולציה
    localStorage.removeItem('simulation-completed');
    
    // מחיקת טריגר השקעות
    localStorage.removeItem('trigger-shown');
    
    console.log('✅ Full game reset completed!');
    return gameState;
}
```

**מה זה מאפס:**
- ✅ XP ורמה (חזרה לרמה 1)
- ✅ כל ההישגים
- ✅ כל השיעורים שנלמדו
- ✅ מצב הסימולציה
- ✅ הצלחת סימולציה (`simulation-completed`)
- ✅ פרופיל פיננסי
- ✅ טריגרים שהוצגו

---

### 2️⃣ איפוס עם אישור - `resetGameData()`
**קובץ:** `profile.js` (שורות 253-280)

```javascript
export function resetGameData() {
    const confirmed = confirm(
        '⚠️ האם אתה בטוח שברצונך לאפס את כל המשחק?\n\n' +
        'פעולה זו תמחק:\n' +
        '• את כל ההתקדמות בסימולציה\n' +
        '• את כל השיעורים שלמדת\n' +
        '• את כל הנקודות וההישגים\n' +
        '• את הפרופיל הפיננסי\n\n' +
        'לא ניתן לשחזר נתונים אלו!\n\n' +
        '💡 מומלץ לייצא נתונים לפני איפוס.'
    );
    
    if (!confirmed) {
        showNotification('ביטול איפוס', 'info');
        return;
    }
    
    fullGameReset();
    showSuccess('🔄 המשחק אופס בהצלחה! טוען מחדש...');
    
    setTimeout(() => {
        location.reload();
    }, 1500);
}
```

**תהליך:**
1. הצגת חלון אישור עם רשימת מה יימחק
2. אם המשתמש מאשר → קריאה ל-`fullGameReset()`
3. הצגת הודעת הצלחה
4. רענון אוטומטי של הדף אחרי 1.5 שניות

---

### 3️⃣ ייצוא נתונים - `exportGameData()`
**קובץ:** `profile.js` (שורות 185-208)

```javascript
export function exportGameData() {
    try {
        const data = {
            gameState: loadGameState(),
            lessonsState: localStorage.getItem('lessons-state'),
            simulationCompleted: localStorage.getItem('simulation-completed'),
            userProfile: getUserProfile(),
            exportDate: new Date().toISOString(),
            version: '7.0'
        };
        
        const jsonString = JSON.stringify(data, null, 2);
        
        // העתקה ללוח
        navigator.clipboard.writeText(jsonString).then(() => {
            showSuccess('📤 הנתונים הועתקו ללוח! שמור אותם במקום בטוח.');
        });
    } catch (error) {
        showNotification('❌ שגיאה בייצוא נתונים', 'error');
    }
}
```

**מה זה מייצא:**
```json
{
  "gameState": {
    "xp": 250,
    "level": 3,
    "achievements": ["first-budget", "investor"],
    "lessonsCompleted": ["investments"],
    "actionsCompleted": [],
    "lastLogin": "2025-10-19T01:20:00.000Z"
  },
  "lessonsState": "{...}",
  "simulationCompleted": "true",
  "userProfile": {
    "income": 8500,
    "savingRate": 20,
    "risk": "medium",
    ...
  },
  "exportDate": "2025-10-19T01:20:00.000Z",
  "version": "7.0"
}
```

**שימוש:**
1. לחץ "📤 ייצוא נתונים ללוח"
2. הנתונים מועתקים ללוח אוטומטית
3. שמור במקום בטוח (קובץ טקסט, מייל לעצמך, וכו')

---

### 4️⃣ ייבוא נתונים - `importGameData()`
**קובץ:** `profile.js` (שורות 223-251)

```javascript
export function importGameData() {
    try {
        const jsonInput = document.getElementById('import-json');
        const data = JSON.parse(jsonInput.value);
        
        // ולידציה
        if (!data.gameState || !data.version) {
            showNotification('❌ פורמט נתונים לא תקין', 'error');
            return;
        }
        
        // אישור
        const confirmed = confirm(
            '⚠️ האם אתה בטוח שברצונך לייבא נתונים?\n\n' +
            'פעולה זו תדרוס את כל הנתונים הקיימים!\n' +
            `תאריך ייצוא: ${new Date(data.exportDate).toLocaleDateString('he-IL')}\n` +
            `גרסה: ${data.version}`
        );
        
        if (!confirmed) return;
        
        // ייבוא
        localStorage.setItem('user-level', JSON.stringify(data.gameState));
        localStorage.setItem('lessons-state', data.lessonsState);
        localStorage.setItem('simulation-completed', data.simulationCompleted);
        localStorage.setItem('user-profile', JSON.stringify(data.userProfile));
        
        showSuccess('📥 הנתונים יובאו בהצלחה! טוען מחדש...');
        setTimeout(() => location.reload(), 1500);
        
    } catch (error) {
        showNotification('❌ שגיאה בייבוא נתונים', 'error');
    }
}
```

**שימוש:**
1. לחץ "📥 ייבוא נתונים"
2. אזור טקסט יופיע
3. הדבק את ה-JSON שיצאת
4. לחץ "✅ ייבא נתונים"
5. אישור → הדף נטען מחדש עם הנתונים החדשים

---

## 🎮 ממשק המשתמש

### מיקום: פרופיל פיננסי → ניהול נתונים

```
┌─────────────────────────────────────────┐
│ 🛠️ ניהול נתונים                        │
├─────────────────────────────────────────┤
│                                         │
│  [📤 ייצוא נתונים ללוח]                │
│  [📥 ייבוא נתונים]                     │
│  [🗑️ איפוס משחק]                       │
│                                         │
└─────────────────────────────────────────┘

↓ (אחרי לחיצה על "ייבוא")

┌─────────────────────────────────────────┐
│ הדבק כאן את ה-JSON לייבוא:             │
│ ┌─────────────────────────────────────┐ │
│ │ { "gameState": {...}, ...          │ │
│ │                                     │ │
│ └─────────────────────────────────────┘ │
│                                         │
│  [✅ ייבא נתונים]  [❌ ביטול]          │
└─────────────────────────────────────────┘
```

---

## 📊 תרחישי שימוש

### תרחיש 1: איפוס לבדיקה
```
1. יצאת נתונים (גיבוי)
   ↓
2. לחצת "🗑️ איפוס משחק"
   ↓
3. אישרת את האזהרה
   ↓
4. הדף נטען מחדש
   ↓
5. אתה במצב התחלתי!
   - אין שיעורים פתוחים
   - צריך לעשות סימולציה
   - כפתור אקדמיה כחול-אפור
```

### תרחיש 2: שחזור אחרי בדיקה
```
1. לחצת "📥 ייבוא נתונים"
   ↓
2. הדבקת את ה-JSON שיצאת
   ↓
3. לחצת "✅ ייבא נתונים"
   ↓
4. אישרת
   ↓
5. הדף נטען עם כל הנתונים הישנים!
   - XP חזר
   - שיעורים חזרו
   - סימולציה חזרה
```

### תרחיש 3: גיבוי לפני שדרוג
```
1. לפני עדכון גרסה
   ↓
2. יצאת נתונים
   ↓
3. שמרת בקובץ
   ↓
4. עדכנת את האפליקציה
   ↓
5. אם משהו השתבש → יבאת את הגיבוי
```

---

## 🧪 בדיקת המערכת החדשה

### בדיקה 1: איפוס מלא
```javascript
// בקונסול (F12):
console.log('Before reset:', {
    xp: getUserXP(),
    level: getUserLevel(),
    simulationCompleted: localStorage.getItem('simulation-completed'),
    lessons: localStorage.getItem('lessons-state')
});

// לחץ "איפוס משחק" בפרופיל

console.log('After reset:', {
    xp: getUserXP(),
    level: getUserLevel(),
    simulationCompleted: localStorage.getItem('simulation-completed'),
    lessons: localStorage.getItem('lessons-state')
});

// ✅ צפוי:
// xp: 0, level: 1, simulationCompleted: null, lessons: null (or all locked)
```

### בדיקה 2: ייצוא וייבוא
```javascript
// 1. יצא נתונים
exportGameData(); // העתק את ה-JSON

// 2. שנה משהו
localStorage.setItem('test', 'changed');

// 3. יבא את הנתונים שיצאת
// (הדבק ב-textarea ולחץ "ייבא")

// 4. בדוק שהכל חזר
console.log(localStorage.getItem('test')); // undefined
```

### בדיקה 3: בדיקת מערכת השיעורים
```javascript
// 1. אפס הכל
resetGameData();

// 2. בדוק שאין שיעורים
// נכנס לאקדמיה → "השלם סימולטור"

// 3. השלם סימולציה (50,000₪)
// מודאל: "שיעור חדש נפתח!"

// 4. בדוק שהשיעור נפתח
console.log(localStorage.getItem('simulation-completed')); // "true"
```

---

## 🔐 אבטחה ושמירת נתונים

### מה נשמר ב-localStorage:
```javascript
{
  "user-level": {...},           // XP, רמה, הישגים
  "lessons-state": {...},         // מצב שיעורים
  "simulation-completed": "true", // הצלחה בסימולציה
  "user-profile": {...},          // פרופיל פיננסי
  "simulation": {...},            // מצב סימולציה נוכחי
  "trigger-shown": "true"         // טריגרים שהוצגו
}
```

### גיבוי אוטומטי:
כרגע אין גיבוי אוטומטי לענן. המשתמש צריך:
1. לייצא נתונים באופן ידני
2. לשמור בקובץ טקסט
3. לייבא בעת הצורך

### עתיד - גיבוי לענן:
```javascript
// רעיון לעתיד
async function cloudBackup() {
    const data = exportGameData();
    await fetch('/api/backup', {
        method: 'POST',
        body: JSON.stringify(data)
    });
}
```

---

## 📁 קבצים ששונו

### 1. `state.js`
- **שורות 312-348:** פונקציה `fullGameReset()` - איפוס מלא
- **Export:** הוספת `fullGameReset` לייצוא

### 2. `profile.js`
- **שורות 1-3:** ייבוא `fullGameReset` + `showNotification`
- **שורות 185-208:** `exportGameData()` - ייצוא נתונים
- **שורות 210-221:** `promptImportGameData()` - פתיחת אזור ייבוא
- **שורות 223-251:** `importGameData()` - ייבוא נתונים
- **שורות 253-280:** `resetGameData()` - איפוס עם אישור
- **שורות 318-325:** חשיפה גלובלית של כל הפונקציות

### 3. `index.html`
- **שורה 260:** הוספת כפתור "✅ ייבא נתונים"
- **שורה 261:** הוספת כפתור "❌ ביטול"
- **שורה 258:** placeholder לתיבת טקסט

---

## ✅ סיכום יכולות

### עכשיו אפשר:
1. ✅ **לאפס את המשחק** - חזרה למצב התחלתי
2. ✅ **לייצא נתונים** - גיבוי ללוח
3. ✅ **לייבא נתונים** - שחזור מגיבוי
4. ✅ **לבדוק את מערכת השיעורים** - מההתחלה
5. ✅ **לשחזר אחרי בדיקה** - חזרה למצב מתקדם

### תהליך בדיקה מלא:
```
1. יצא נתונים → [שמור בקובץ]
2. אפס משחק → [מצב התחלתי]
3. בדוק שאין שיעורים → ✓
4. עשה סימולציה → ✓
5. בדוק שיעור נפתח → ✓
6. יבא נתונים → [חזרה למצב מקורי]
```

---

## 🎯 הוראות שימוש מהירות

### איך לאפס ולבדוק:

**שלב 1: גיבוי**
```
פרופיל → ניהול נתונים → "📤 ייצוא נתונים ללוח"
→ שמור בקובץ טקסט (backup.json)
```

**שלב 2: איפוס**
```
פרופיל → ניהול נתונים → "🗑️ איפוס משחק"
→ אישור → הדף נטען מחדש
```

**שלב 3: בדיקה**
```
אקדמיה → "השלם סימולטור" ← ✓ עובד!
סימולטור → חסוך 50,000₪ → ניצחון!
מודאל: "שיעור חדש נפתח!" ← ✓ עובד!
אקדמיה → שיעור investments פתוח ← ✓ עובד!
```

**שלב 4: שחזור**
```
פרופיל → ניהול נתונים → "📥 ייבוא נתונים"
→ הדבק את התוכן מ-backup.json
→ "✅ ייבא נתונים" → אישור → הדף נטען
```

---

**עכשיו אתה יכול לאפס ולבדוק את המערכת!** 🎮✨

```javascript
// פתוח את הפרופיל:
showSection('profile');

// גלול למטה ל"ניהול נתונים"
// לחץ "🗑️ איפוס משחק"
```
