# 🚀 CashWise - Quick Start Guide

## ⚡ הרצה מהירה (5 שניות)

### Option 1: Python Server (Recommended)
```powershell
# Open terminal in project folder
python -m http.server 8000

# Open browser to:
# http://localhost:8000
```

### Option 2: Node.js Server
```powershell
npx http-server -p 8000

# Open browser to:
# http://localhost:8000
```

### Option 3: VS Code Live Server
1. Install "Live Server" extension
2. Right-click `index.html`
3. Select "Open with Live Server"

---

## ⚠️ למה צריך server?

**שגיאה נפוצה:**
```
Access to script at 'file:///...' has been blocked by CORS policy
```

**סיבה:** דפדפנים חוסמים ES6 modules כשפותחים HTML ישירות מהדיסק (`file://`)

**פתרון:** הרצת local server (http://) פותרת את הבעיה

---

## 📁 מבנה הפרויקט

```
CashWise/
├── index.html              # Main HTML file
├── start-server.bat        # Quick server launcher (Windows)
├── src/
│   ├── css/               # 11 modular CSS files
│   │   ├── main.css
│   │   ├── simulation-compact.css
│   │   ├── fullscreen-layout.css
│   │   └── ... (8 more)
│   └── js/                # ES6 Modules
│       ├── core/          # App, Router, State
│       ├── modules/       # Simulation, Lessons, Profile, Mentor
│       └── utils/         # Format, Storage, Notifications
└── archive/               # Old code (archived)
```

---

## 🧪 Testing Checklist

### ✅ After Starting Server
1. Open http://localhost:8000
2. Check console - should be NO errors
3. Click through sections:
   - Opening (מסך פתיחה)
   - Simulation (סימולטור החיים)
   - Academy (אקדמיית הכסף)
   - Profile (פרופיל פיננסי)
   - Mentor (מנטור AI)

### ✅ Visual Tests
- [ ] Opening screen - light background
- [ ] Simulation - dark background, cards visible
- [ ] Academy - dark background, lesson cards
- [ ] Profile - dark background
- [ ] Mentor - dark background

### ✅ Functional Tests
- [ ] Navigation works
- [ ] XP bar updates
- [ ] FAB button animates
- [ ] Simulation actions work
- [ ] Academy lessons open

---

## 🐛 Troubleshooting

### Problem: CORS Error
**Error:** `Access to script at 'file://...' blocked by CORS policy`

**Solution:** 
```powershell
# Run local server
python -m http.server 8000
```

### Problem: Port 8000 Already in Use
**Error:** `OSError: [Errno 48] Address already in use`

**Solution:**
```powershell
# Use different port
python -m http.server 8080

# Or kill existing server
# Windows: Ctrl+C in terminal
# Find process: netstat -ano | findstr :8000
```

### Problem: Python Not Found
**Error:** `'python' is not recognized`

**Solutions:**
1. Install Python from python.org
2. Use Node.js instead: `npx http-server`
3. Use VS Code Live Server extension

### Problem: Unicode/Encoding Issues in Terminal
**Error:** `The term 'בpython' is not recognized`

**Solution:**
- Run `start-server.bat` by double-clicking it
- Or use VS Code integrated terminal (not external)

---

## 📚 Development

### CSS Architecture
```
Base Styles (main.css, themes.css)
    ↓
Component Styles (components.css, utilities.css)
    ↓
Module Styles (simulation-compact.css, floating-academy.css, etc.)
    ↓
Layout Override (fullscreen-layout.css) ← LAST!
```

### JavaScript Architecture
```
app.js (Entry Point)
    ↓
router.js (Navigation)
    ↓
state.js (Global State)
    ↓
modules/ (Simulation, Lessons, Profile, Mentor)
    ↓
utils/ (Format, Storage, Notifications)
```

---

## 🔧 Making Changes

### Edit Simulation
```javascript
// src/js/modules/simulation.js
export function renderSimulationUI() {
    // Edit UI here
}
```

### Edit Styles
```css
/* src/css/simulation-compact.css */
.sim-actions-card {
    /* Edit styles here */
}
```

### Add New Lesson
```javascript
// src/js/data/lessons.js
export const lessons = [
    {
        id: 'lesson-5',
        title: 'השיעור החדש שלי',
        // ...
    }
];
```

---

## 📊 Project Status

**Version:** 7.1 (Code Cleanup Complete)  
**Last Updated:** October 19, 2025  
**Status:** ✅ Production Ready  

**Recent Changes:**
- ✅ Removed 144 lines of inline CSS
- ✅ Archived old directories (js/, css/)
- ✅ Optimized CSS load order
- ✅ Fixed CORS issues with server setup

---

## 🎯 Next Steps

1. **Start Server:** `python -m http.server 8000`
2. **Open Browser:** http://localhost:8000
3. **Test All Features:** Use checklist above
4. **Start Developing!** 🚀

---

## 📞 Need Help?

Check these files:
- `README.md` - Full project documentation
- `CODE_CLEANUP_REPORT_2025-10-19.md` - Recent changes
- `CODE_AUDIT_REPORT_2025-10-19.md` - Code quality analysis
- `.github/copilot-instructions.md` - AI agent instructions

---

**Happy Coding! 💰✨**
