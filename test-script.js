/**
 * 🧪 Quick Test Script - CashWise
 * 
 * Copy-paste this into the browser console (F12) to test all functions
 */

console.log('%c🧪 CashWise Quick Test Script', 'font-size: 16px; font-weight: bold; color: #0ea5e9;');
console.log('=====================================\n');

// Test 1: Check Global Functions
console.log('%c1️⃣ Testing Global Functions...', 'font-weight: bold; color: #10b981;');
const functionTests = {
    'showSection': typeof window.showSection === 'function',
    'addXP': typeof window.addXP === 'function',
    'advanceMonth': typeof window.advanceMonth === 'function',
    'resetSimulation': typeof window.resetSimulation === 'function',
    'goToInvestmentLesson': typeof window.goToInvestmentLesson === 'function',
    'dismissTrigger': typeof window.dismissTrigger === 'function',
    'openLesson': typeof window.openLesson === 'function',
    'openGoalModal': typeof window.openGoalModal === 'function'
};

let passedTests = 0;
let totalTests = Object.keys(functionTests).length;

for (const [funcName, isAvailable] of Object.entries(functionTests)) {
    const status = isAvailable ? '✅' : '❌';
    const color = isAvailable ? 'color: green;' : 'color: red;';
    console.log(`%c${status} ${funcName}: ${isAvailable ? 'Available' : 'MISSING'}`, color);
    if (isAvailable) passedTests++;
}

console.log(`\n📊 Result: ${passedTests}/${totalTests} tests passed\n`);

// Test 2: Check CSS
console.log('%c2️⃣ Testing CSS...', 'font-weight: bold; color: #10b981;');
const simulationSection = document.getElementById('simulation');
if (simulationSection) {
    const styles = window.getComputedStyle(simulationSection);
    console.log('✅ #simulation found');
    console.log('   - Background:', styles.backgroundColor);
    console.log('   - Padding:', styles.padding);
} else {
    console.log('❌ #simulation NOT FOUND');
}

const simulationBox = document.querySelector('#simulation .box');
if (simulationBox) {
    const styles = window.getComputedStyle(simulationBox);
    console.log('✅ #simulation .box found');
    console.log('   - Background:', styles.backgroundColor);
    console.log('   - Padding:', styles.padding);
    console.log('   - Margin:', styles.margin);
} else {
    console.log('❌ #simulation .box NOT FOUND');
}

// Test 3: Check Simulation Buttons
console.log('\n%c3️⃣ Testing Simulation Buttons...', 'font-weight: bold; color: #10b981;');
const buttons = document.querySelectorAll('.sim-action-button');
console.log(`Found ${buttons.length} simulation buttons`);
buttons.forEach((btn, index) => {
    const onclick = btn.getAttribute('onclick');
    console.log(`   Button ${index + 1}: ${onclick || 'NO ONCLICK'}`);
});

// Test 4: Try calling a function
console.log('\n%c4️⃣ Testing Function Execution...', 'font-weight: bold; color: #10b981;');
console.log('Try running these commands manually:');
console.log('%c  window.showSection("academy")', 'background: #f0f0f0; padding: 2px 6px; border-radius: 3px;');
console.log('%c  window.addXP(10, "Test")', 'background: #f0f0f0; padding: 2px 6px; border-radius: 3px;');

// Summary
console.log('\n%c✅ Quick Test Complete!', 'font-size: 14px; font-weight: bold; color: #10b981;');
console.log('=====================================');

if (passedTests === totalTests) {
    console.log('%c🎉 All tests passed! The app should work correctly.', 'color: green; font-weight: bold;');
} else {
    console.log(`%c⚠️ ${totalTests - passedTests} functions are missing. Check global-bridge.js`, 'color: orange; font-weight: bold;');
}
