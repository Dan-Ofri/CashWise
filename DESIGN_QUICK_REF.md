# 🚀 Quick Design Reference
**התבניות הכי נפוצות - העתק והדבק**

---

## 📄 דף חדש (Fullscreen Section)

```html
<section id="MY-SECTION" class="hidden">
    <header class="minimal-header">
        <button class="back-btn" onclick="showSection('home')">
            <span class="icon">←</span>
            <span>חזרה</span>
        </button>
        <h1>כותרת הדף</h1>
    </header>
    <main class="main-content">
        <div class="container">
            <!-- תוכן כאן -->
        </div>
    </main>
</section>
```

---

## 🪟 פופאפ חדש (Modal)

```html
<div id="MY-MODAL" class="modal hidden">
    <div class="modal-overlay" onclick="closeModal('MY-MODAL')"></div>
    <div class="modal-content">
        <div class="modal-header">
            <h2>כותרת</h2>
            <button class="modal-close" onclick="closeModal('MY-MODAL')">✕</button>
        </div>
        <div class="modal-body">
            <p>תוכן</p>
        </div>
        <div class="modal-footer">
            <button class="btn-secondary" onclick="closeModal('MY-MODAL')">ביטול</button>
            <button class="btn-primary" onclick="confirm()">אישור</button>
        </div>
    </div>
</div>
```

```javascript
// פתיחה/סגירה
openModal('MY-MODAL');
closeModal('MY-MODAL');
```

---

## 🎴 כרטיס (Card)

```html
<div class="lesson-card" onclick="handleClick()">
    <div class="lesson-icon">📚</div>
    <h3 class="lesson-title">כותרת</h3>
    <p class="lesson-description">תיאור</p>
</div>
```

---

## 🔘 כפתורים

```html
<!-- ראשי -->
<button class="btn-primary">שמור</button>

<!-- משני -->
<button class="btn-secondary">ביטול</button>

<!-- אייקון -->
<button class="icon-btn">⚙️</button>
```

---

## 📝 שדה טקסט

```html
<div class="form-group">
    <label for="my-input">שם השדה</label>
    <input 
        type="text" 
        id="my-input" 
        class="form-input"
        placeholder="הזן ערך"
    />
</div>
```

---

## 📊 Grid של כרטיסים

```html
<div class="lesson-grid">
    <div class="lesson-card">1</div>
    <div class="lesson-card">2</div>
    <div class="lesson-card">3</div>
</div>
```

---

## 💬 הודעה (Notification)

```javascript
showNotification('הפעולה בוצעה!', 'success');
showNotification('שגיאה!', 'error');
showNotification('אזהרה!', 'warning');
```

---

## 🎨 Classes שימושיים

```html
<!-- Spacing -->
<div class="p-4">פדינג 16px</div>
<div class="mb-4">מרווח תחתון 16px</div>

<!-- Text -->
<h1 class="text-2xl font-bold">כותרת גדולה</h1>
<p class="text-gray">טקסט אפור</p>

<!-- Colors -->
<div class="text-primary">טקסט כחול</div>
<div class="bg-success">רקע ירוק</div>

<!-- Effects -->
<div class="hover-lift">אפקט hover</div>
<div class="glass">אפקט זכוכית</div>

<!-- Visibility -->
<div class="hidden">מוסתר</div>
```

---

**למדריך המלא ראה:** [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)
