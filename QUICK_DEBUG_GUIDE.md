# 🚨 QUICK DEBUG GUIDE - Academy Not Showing

## המצב כרגע

✅ **עובד:**
- Auto-unlock של שיעור ראשון
- HTML נוצר (2158 תווים)
- יש שיעור אחד פתוח
- הכפתור משנה צבע (class "active" מתווסף)

❌ **לא עובד:**
- האקדמיה לא נראית על המסך

---

## 🔍 בדיקות מהירות

### 1️⃣ בדיקה בסיסית (F12 → Console):

```javascript
window.getComputedStyle(document.getElementById('academy')).display
```

**תוצאות אפשריות:**
- `"flex"` ✅ → CSS תקין, הבעיה במקום אחר
- `"block"` ⚠️ → CSS specificity נכשל
- `"none"` ❌ → CSS לא עובד בכלל

---

### 2️⃣ הדגשה חזותית:

**הדבק בקונסול:**
```javascript
fetch('highlight-academy.js').then(r=>r.text()).then(eval)
```

**מה תראה:**
- 🔴 **קופסה אדומה** = האקדמיה קיימת ונראית
- 🔵 **קופסה כחולה** בתוך האדומה = ה-.box
- 🟢 **קופסאות ירוקות** = פריטי שיעורים

**אם לא רואה כלום** → הבעיה ב-CSS (display/visibility/z-index)

---

### 3️⃣ דוח מפורט:

**הדבק בקונסול:**
```javascript
fetch('live-debug-academy.js').then(r=>r.text()).then(eval)
```

**תקבל:**
- טבלה עם כל ה-styles
- בדיקות קריטיות (✅/❌)
- המלצות לתיקון

---

## ⚡ תיקון מהיר

אם הבדיקות מצאו בעיה, הדבק את זה:

```javascript
const academy = document.getElementById('academy');
Object.assign(academy.style, {
    display: 'flex',
    flexDirection: 'column',
    visibility: 'visible',
    opacity: '1',
    zIndex: '100'
});
console.log('✅ Forced academy to show!');
```

---

## 🎯 תוצאה צפויה

אחרי התיקון, כשלוחצים על 🎓 תראה:

```
┌──────────────────────────────────────────┐
│  רקע כהה (#2c3e50)                      │ ← #academy
│  ┌────────────────────────────────────┐  │
│  │ 🎓 אקדמיית הכסף             [X]  │  │
│  │ ─────────────────────────────────  │  │ ← .box (בהיר)
│  │                                    │  │
│  │ ┌────────────────────────────────┐ │  │
│  │ │ 📈 ריבית דריבית והשקעות      │ │  │
│  │ │ למד איך להשקיע...      פתוח  │ │  │ ← lesson-item
│  │ └────────────────────────────────┘ │  │
│  │                                    │  │
│  │ ┌────────────────────────────────┐ │  │
│  │ │ 🛡️ קרן חירום          🔒     │ │  │
│  │ └────────────────────────────────┘ │  │
│  └────────────────────────────────────┘  │
└──────────────────────────────────────────┘
```

---

## 📋 Checklist

לפני שמדווחים שזה לא עובד:

- [ ] רענון עם Cache Clear (Ctrl+Shift+R)
- [ ] בדיקת display בקונסול
- [ ] הרצת highlight-academy.js
- [ ] הרצת live-debug-academy.js
- [ ] צילום מסך של הקונסול + הדף

---

## 🆘 אם כלום לא עובד

1. **פתח DevTools (F12)**
2. **Elements tab**
3. **חפש:** `<section id="academy">`
4. **לחץ ימני** → Inspect
5. **Styles tab** → תראה איזה כללים חלים
6. **צלם מסך ושלח**

---

**המטרה: לזהות האם זו בעיית CSS או משהו אחר!** 🎯
