/**
 * 🚀 Quick Test - Copy & Paste to Console
 * =====================================
 * בדיקה מהירה של 30 שניות
 */

console.clear();
console.log('%c🚀 CashWise Quick Test', 'font-size: 24px; font-weight: bold; color: #667eea; background: #1e293b; padding: 10px;');

// Test 1: System loaded?
console.log('\n1️⃣ מערכת נטענה?');
if (window.__CASHWISE__) {
    console.log('   ✅ כן!');
} else {
    console.log('   ❌ לא! רענן את הדף.');
}

// Test 2: Current state
console.log('\n2️⃣ מצב נוכחי:');
const state = __CASHWISE__.getState();
console.log(`   XP: ${state.user.xp}`);
console.log(`   Level: ${state.user.level}`);
console.log(`   Achievements: ${state.user.achievements.length}`);

// Test 3: Add XP
console.log('\n3️⃣ מוסיף 50 XP...');
const oldXP = state.user.xp;
addXP(50, 'Quick Test');
const newXP = __CASHWISE__.getState().user.xp;
console.log(`   ${oldXP} → ${newXP} ${newXP === oldXP + 50 ? '✅' : '❌'}`);

// Test 4: Undo
console.log('\n4️⃣ בודק Undo...');
if (__CASHWISE__.store.canUndo()) {
    __CASHWISE__.undo();
    const afterUndo = __CASHWISE__.getState().user.xp;
    console.log(`   ${newXP} → ${afterUndo} ${afterUndo === oldXP ? '✅' : '❌'}`);
} else {
    console.log('   ⚠️ אין היסטוריה');
}

// Test 5: Redo
console.log('\n5️⃣ בודק Redo...');
if (__CASHWISE__.store.canRedo()) {
    __CASHWISE__.redo();
    const afterRedo = __CASHWISE__.getState().user.xp;
    console.log(`   ${oldXP} → ${afterRedo} ${afterRedo === newXP ? '✅' : '❌'}`);
} else {
    console.log('   ⚠️ אין עתיד');
}

// Test 6: UI Elements
console.log('\n6️⃣ בודק UI...');
const xpText = document.getElementById('xp-text');
const levelBadge = document.getElementById('level-badge');
const xpFill = document.getElementById('xp-fill');
console.log(`   XP Text: ${xpText ? '✅' : '❌'}`);
console.log(`   Level Badge: ${levelBadge ? '✅' : '❌'}`);
console.log(`   XP Fill: ${xpFill ? '✅' : '❌'}`);

// Summary
console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('%c🎉 Quick Test Complete!', 'font-size: 18px; font-weight: bold; color: #10b981;');
console.log('\n💡 Commands:');
console.log('   __CASHWISE__.getState()');
console.log('   addXP(100, "test")');
console.log('   __CASHWISE__.undo()');
console.log('   __CASHWISE__.redo()');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
