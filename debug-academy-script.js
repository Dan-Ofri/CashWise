/**
 * 🔍 ACADEMY COMPREHENSIVE DEBUG SCRIPT
 * הדבק בקונסול (F12) כדי לבדוק למה האקדמיה לא עובדת
 */

console.log('%c🔍 ==== ACADEMY DEBUG STARTED ==== ', 'background: #667eea; color: white; font-size: 16px; padding: 10px;');

// ===================================
// 1. בדיקת HTML Structure
// ===================================
console.log('\n%c1️⃣ בדיקת HTML Structure', 'color: #3498db; font-size: 14px; font-weight: bold;');

const academySection = document.getElementById('academy');
const academyBox = document.querySelector('#academy .box');
const academyList = document.getElementById('academy-lessons-list');

console.log('academy section:', academySection);
console.log('academy .box:', academyBox);
console.log('academy-lessons-list:', academyList);

if (!academySection) {
    console.error('❌ CRITICAL: #academy section לא קיים ב-DOM!');
}
if (!academyBox) {
    console.error('❌ CRITICAL: #academy .box לא קיים ב-DOM!');
}
if (!academyList) {
    console.error('❌ CRITICAL: #academy-lessons-list לא קיים ב-DOM!');
}

// ===================================
// 2. בדיקת CSS Visibility
// ===================================
console.log('\n%c2️⃣ בדיקת CSS Visibility', 'color: #e74c3c; font-size: 14px; font-weight: bold;');

if (academySection) {
    const styles = window.getComputedStyle(academySection);
    console.log('academy section CSS:', {
        display: styles.display,
        visibility: styles.visibility,
        opacity: styles.opacity,
        position: styles.position,
        width: styles.width,
        height: styles.height,
        top: styles.top,
        left: styles.left,
        zIndex: styles.zIndex,
        classList: Array.from(academySection.classList)
    });
    
    if (styles.display === 'none') {
        console.warn('⚠️ #academy has display: none - missing "active" class?');
    }
}

if (academyBox) {
    const boxStyles = window.getComputedStyle(academyBox);
    console.log('academy .box CSS:', {
        display: boxStyles.display,
        flex: boxStyles.flex,
        width: boxStyles.width,
        height: boxStyles.height,
        background: boxStyles.background
    });
}

if (academyList) {
    const listStyles = window.getComputedStyle(academyList);
    console.log('academy-lessons-list CSS:', {
        display: listStyles.display,
        width: listStyles.width,
        height: listStyles.height,
        minHeight: listStyles.minHeight,
        childElementCount: academyList.childElementCount,
        innerHTML: academyList.innerHTML.substring(0, 200)
    });
}

// ===================================
// 3. בדיקת localStorage
// ===================================
console.log('\n%c3️⃣ בדיקת localStorage', 'color: #f39c12; font-size: 14px; font-weight: bold;');

const lessonsStateRaw = localStorage.getItem('lessons-state');
console.log('lessons-state (raw):', lessonsStateRaw);

if (lessonsStateRaw) {
    try {
        const lessonsState = JSON.parse(lessonsStateRaw);
        console.log('lessons-state (parsed):', lessonsState);
        
        const unlockedCount = Object.values(lessonsState).filter(l => l.unlocked).length;
        console.log(`🔓 Unlocked lessons: ${unlockedCount}/4`);
        
        Object.entries(lessonsState).forEach(([id, state]) => {
            const icon = state.unlocked ? '🔓' : '🔒';
            console.log(`  ${icon} ${id}: ${state.unlocked ? 'UNLOCKED' : 'LOCKED'}`);
        });
        
        if (unlockedCount === 0) {
            console.error('❌ PROBLEM: אין שיעורים פתוחים! זו הסיבה שלא רואים כלום.');
            console.log('💡 FIX: הרץ את הקוד הזה:');
            console.log(`
const state = JSON.parse(localStorage.getItem('lessons-state'));
state.investments.unlocked = true;
state.investments.unlockedAt = new Date().toISOString();
state.investments.unlockedReason = 'debug-unlock';
localStorage.setItem('lessons-state', JSON.stringify(state));
console.log('✅ Fixed! Refresh the page.');
            `);
        }
    } catch (e) {
        console.error('❌ Failed to parse lessons-state:', e);
    }
} else {
    console.warn('⚠️ lessons-state not found in localStorage');
    console.log('💡 המערכת צריכה ליצור אותו אוטומטית בטעינה');
}

// ===================================
// 4. בדיקת Global Functions
// ===================================
console.log('\n%c4️⃣ בדיקת Global Functions', 'color: #9b59b6; font-size: 14px; font-weight: bold;');

const functionsToCheck = [
    'showSection',
    'openLesson',
    'attemptOpenLockedLesson',
    'getAllLessons',
    'renderAcademySection'
];

functionsToCheck.forEach(funcName => {
    const exists = typeof window[funcName] === 'function';
    const icon = exists ? '✅' : '❌';
    console.log(`${icon} window.${funcName}: ${exists ? 'EXISTS' : 'MISSING'}`);
});

// ===================================
// 5. בדיקת Router State
// ===================================
console.log('\n%c5️⃣ בדיקת Router State', 'color: #1abc9c; font-size: 14px; font-weight: bold;');

const allSections = document.querySelectorAll('section');
console.log(`Total sections: ${allSections.length}`);

allSections.forEach(section => {
    const isActive = section.classList.contains('active');
    const icon = isActive ? '✅' : '⚪';
    console.log(`${icon} #${section.id}: ${isActive ? 'ACTIVE' : 'inactive'}`);
});

// ===================================
// 6. Test Commands
// ===================================
console.log('\n%c6️⃣ פקודות בדיקה', 'color: #27ae60; font-size: 14px; font-weight: bold;');

console.log('הדבק את הפקודות הבאות כדי לבדוק:');
console.log('\n// פתח אקדמיה:');
console.log('showSection("academy")');

console.log('\n// אפס שיעורים עם שיעור ראשון פתוח:');
console.log(`
const resetState = {
    investments: { id: 'investments', unlocked: true, completed: false, unlockedAt: new Date().toISOString(), completedAt: null, unlockedReason: 'debug-reset' },
    emergencyFund: { id: 'emergencyFund', unlocked: false, completed: false, unlockedAt: null, completedAt: null, unlockedReason: null },
    insurance: { id: 'insurance', unlocked: false, completed: false, unlockedAt: null, completedAt: null, unlockedReason: null },
    debtManagement: { id: 'debtManagement', unlocked: false, completed: false, unlockedAt: null, completedAt: null, unlockedReason: null }
};
localStorage.setItem('lessons-state', JSON.stringify(resetState));
location.reload();
`);

console.log('\n// מחק הכל והתחל מחדש:');
console.log('localStorage.clear(); location.reload();');

// ===================================
// 7. Final Summary
// ===================================
console.log('\n%c7️⃣ סיכום', 'color: #e67e22; font-size: 14px; font-weight: bold;');

const issues = [];

if (!academySection) issues.push('❌ #academy section missing');
if (!academyBox) issues.push('❌ #academy .box missing');
if (!academyList) issues.push('❌ #academy-lessons-list missing');
if (academySection && window.getComputedStyle(academySection).display === 'none') {
    issues.push('⚠️ #academy is hidden (display: none)');
}
if (!lessonsStateRaw) issues.push('⚠️ lessons-state missing in localStorage');
if (lessonsStateRaw) {
    try {
        const parsed = JSON.parse(lessonsStateRaw);
        const unlocked = Object.values(parsed).filter(l => l.unlocked).length;
        if (unlocked === 0) {
            issues.push('❌ No unlocked lessons (empty academy)');
        }
    } catch (e) {
        issues.push('❌ lessons-state parsing error');
    }
}

if (issues.length === 0) {
    console.log('%c✅ NO ISSUES FOUND!', 'background: #2ecc71; color: white; padding: 8px; font-size: 14px;');
    console.log('האקדמיה צריכה לעבוד. נסה: showSection("academy")');
} else {
    console.log('%c⚠️ ISSUES FOUND:', 'background: #e74c3c; color: white; padding: 8px; font-size: 14px;');
    issues.forEach(issue => console.log(issue));
}

console.log('%c\n🔍 ==== DEBUG COMPLETED ==== ', 'background: #667eea; color: white; font-size: 16px; padding: 10px;');
