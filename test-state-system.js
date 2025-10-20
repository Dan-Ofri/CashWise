/**
 * ===========================================
 * 🧪 State System Test Suite
 * ===========================================
 * בדיקות לוודא שהמערכת עובדת
 * 
 * להריץ בקונסול:
 * 1. פתח index.html בדפדפן
 * 2. פתח Console (F12)
 * 3. הדבק קוד זה והרץ
 */

console.log('%c🧪 CashWise State System Tests', 'font-size: 20px; font-weight: bold; color: #667eea');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

// ===== Test 1: Check if new state system loaded =====
console.log('\n📦 Test 1: State System Loaded');
try {
    if (window.__CASHWISE__) {
        console.log('✅ PASS: State system loaded');
        console.log('   Available:', Object.keys(window.__CASHWISE__));
    } else {
        console.error('❌ FAIL: State system not found');
    }
} catch (e) {
    console.error('❌ ERROR:', e);
}

// ===== Test 2: Read initial state =====
console.log('\n📊 Test 2: Initial State');
try {
    const state = window.__CASHWISE__.getState();
    console.log('✅ PASS: Can read state');
    console.log('   User XP:', state.user.xp);
    console.log('   User Level:', state.user.level);
    console.log('   Achievements:', state.user.achievements.length);
} catch (e) {
    console.error('❌ ERROR:', e);
}

// ===== Test 3: Add XP =====
console.log('\n⭐ Test 3: Add XP (50 points)');
try {
    const oldState = window.__CASHWISE__.getState();
    const oldXP = oldState.user.xp;
    
    // Add XP using global function
    if (typeof addXP === 'function') {
        addXP(50, 'Test Suite');
        
        const newState = window.__CASHWISE__.getState();
        const newXP = newState.user.xp;
        
        if (newXP === oldXP + 50) {
            console.log('✅ PASS: XP added correctly');
            console.log(`   ${oldXP} → ${newXP}`);
        } else {
            console.error('❌ FAIL: XP not added correctly');
            console.error(`   Expected: ${oldXP + 50}, Got: ${newXP}`);
        }
    } else {
        console.error('❌ FAIL: addXP function not found');
    }
} catch (e) {
    console.error('❌ ERROR:', e);
}

// ===== Test 4: Undo =====
console.log('\n⏪ Test 4: Time Travel (Undo)');
try {
    if (window.__CASHWISE__.store.canUndo()) {
        const beforeUndo = window.__CASHWISE__.getState().user.xp;
        window.__CASHWISE__.undo();
        const afterUndo = window.__CASHWISE__.getState().user.xp;
        
        if (afterUndo === beforeUndo - 50) {
            console.log('✅ PASS: Undo works');
            console.log(`   ${beforeUndo} → ${afterUndo}`);
        } else {
            console.error('❌ FAIL: Undo did not work correctly');
        }
    } else {
        console.log('⚠️ SKIP: No history to undo');
    }
} catch (e) {
    console.error('❌ ERROR:', e);
}

// ===== Test 5: Redo =====
console.log('\n⏩ Test 5: Time Travel (Redo)');
try {
    if (window.__CASHWISE__.store.canRedo()) {
        const beforeRedo = window.__CASHWISE__.getState().user.xp;
        window.__CASHWISE__.redo();
        const afterRedo = window.__CASHWISE__.getState().user.xp;
        
        if (afterRedo === beforeRedo + 50) {
            console.log('✅ PASS: Redo works');
            console.log(`   ${beforeRedo} → ${afterRedo}`);
        } else {
            console.error('❌ FAIL: Redo did not work correctly');
        }
    } else {
        console.log('⚠️ SKIP: No future to redo');
    }
} catch (e) {
    console.error('❌ ERROR:', e);
}

// ===== Test 6: Reactive Updates =====
console.log('\n🔄 Test 6: Reactive Subscriptions');
try {
    let updateCount = 0;
    
    // Subscribe to XP changes
    const unsubscribe = window.__CASHWISE__.store.subscribe((newState, oldState) => {
        updateCount++;
        console.log(`   📡 Update #${updateCount}: XP changed from ${oldState.user.xp} to ${newState.user.xp}`);
    }, 'user.xp');
    
    // Add XP 3 times
    console.log('   Adding XP 3 times...');
    addXP(10, 'Test 1');
    addXP(20, 'Test 2');
    addXP(30, 'Test 3');
    
    // Unsubscribe
    unsubscribe();
    
    if (updateCount === 3) {
        console.log('✅ PASS: Reactive updates working (3 updates received)');
    } else {
        console.error(`❌ FAIL: Expected 3 updates, got ${updateCount}`);
    }
} catch (e) {
    console.error('❌ ERROR:', e);
}

// ===== Test 7: Persistence =====
console.log('\n💾 Test 7: State Persistence');
try {
    const state = window.__CASHWISE__.getState();
    const savedData = localStorage.getItem('cashwise-app-state');
    
    if (savedData) {
        const parsed = JSON.parse(savedData);
        console.log('✅ PASS: State is persisted to localStorage');
        console.log('   Saved XP:', parsed.user.xp);
        console.log('   Current XP:', state.user.xp);
        
        if (parsed.user.xp === state.user.xp) {
            console.log('✅ PASS: Saved state matches current state');
        } else {
            console.warn('⚠️ WARNING: Saved state differs from current state');
        }
    } else {
        console.error('❌ FAIL: No saved state found');
    }
} catch (e) {
    console.error('❌ ERROR:', e);
}

// ===== Test 8: Middleware =====
console.log('\n🔌 Test 8: Middleware Validation');
try {
    // Try to set negative XP (should be blocked)
    console.log('   Attempting to set negative XP...');
    
    const oldXP = window.__CASHWISE__.getState().user.xp;
    
    // Direct state update (should be validated)
    window.__CASHWISE__.store.setState(state => {
        state.user.xp = -100;
        return state;
    });
    
    const newXP = window.__CASHWISE__.getState().user.xp;
    
    if (newXP === oldXP) {
        console.log('✅ PASS: Middleware blocked negative XP');
    } else if (newXP === -100) {
        console.error('❌ FAIL: Middleware did not block negative XP');
    } else if (newXP === 1000000) {
        console.log('✅ PASS: Middleware capped XP at maximum');
    }
} catch (e) {
    console.error('❌ ERROR:', e);
}

// ===== Test 9: History Size =====
console.log('\n📜 Test 9: History Management');
try {
    if (window._CASHWISE_HISTORY) {
        const historyLength = window._CASHWISE_HISTORY.length;
        console.log(`✅ PASS: History is being tracked (${historyLength} entries)`);
        
        if (historyLength <= 50) {
            console.log('✅ PASS: History size under limit (max 50)');
        } else {
            console.error('❌ FAIL: History exceeded limit');
        }
    } else {
        console.log('⚠️ INFO: History not tracked (production mode?)');
    }
} catch (e) {
    console.error('❌ ERROR:', e);
}

// ===== Test 10: UI Updates =====
console.log('\n🎨 Test 10: UI Element Updates');
try {
    const xpText = document.getElementById('xp-text');
    const levelBadge = document.getElementById('level-badge');
    const xpFill = document.getElementById('xp-fill');
    
    if (xpText) {
        console.log('✅ XP Text element found:', xpText.textContent);
    } else {
        console.warn('⚠️ XP Text element not found');
    }
    
    if (levelBadge) {
        console.log('✅ Level Badge element found:', levelBadge.textContent);
    } else {
        console.warn('⚠️ Level Badge element not found');
    }
    
    if (xpFill) {
        console.log('✅ XP Fill element found, width:', xpFill.style.width);
    } else {
        console.warn('⚠️ XP Fill element not found');
    }
} catch (e) {
    console.error('❌ ERROR:', e);
}

// ===== Summary =====
console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('%c🎉 Test Suite Complete!', 'font-size: 16px; font-weight: bold; color: #10b981');
console.log('\n💡 Quick Commands:');
console.log('   __CASHWISE__.getState()  - View current state');
console.log('   __CASHWISE__.undo()      - Undo last action');
console.log('   __CASHWISE__.redo()      - Redo action');
console.log('   __CASHWISE__.history()   - View state history');
console.log('   addXP(50, "test")        - Add 50 XP');
console.log('\n🐛 Debug Mode: ' + (window.CASHWISE_DEBUG ? 'ON ✅' : 'OFF ⚠️'));
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
