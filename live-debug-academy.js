/**
 * 🔍 LIVE CSS DEBUGGER FOR ACADEMY
 * הדבק בקונסול (F12) כדי לבדוק למה האקדמיה לא נראית
 */

console.log('%c🔍 === LIVE ACADEMY DEBUG === ', 'background: #667eea; color: white; font-size: 18px; padding: 10px; font-weight: bold;');

const academy = document.getElementById('academy');
const academyBox = document.querySelector('#academy .box');
const lessonsList = document.getElementById('academy-lessons-list');

if (!academy) {
    console.error('❌ CRITICAL: #academy not found!');
} else {
    const computed = window.getComputedStyle(academy);
    
    console.log('\n%c📊 #academy Styles:', 'color: #3498db; font-size: 16px; font-weight: bold;');
    console.table({
        'display': computed.display,
        'visibility': computed.visibility,
        'opacity': computed.opacity,
        'position': computed.position,
        'z-index': computed.zIndex,
        'width': computed.width,
        'height': computed.height,
        'top': computed.top,
        'left': computed.left,
        'background': computed.background.substring(0, 50),
        'classList': Array.from(academy.classList).join(', ')
    });
    
    // בדיקות קריטיות
    console.log('\n%c🎯 Critical Checks:', 'color: #e74c3c; font-size: 16px; font-weight: bold;');
    
    const checks = {
        'Has .active class': academy.classList.contains('active'),
        'display is flex': computed.display === 'flex',
        'visibility is visible': computed.visibility === 'visible',
        'opacity is 1': computed.opacity === '1',
        'Not hidden (display)': computed.display !== 'none',
        'z-index > 0': parseInt(computed.zIndex) > 0 || computed.zIndex === 'auto'
    };
    
    Object.entries(checks).forEach(([check, result]) => {
        const icon = result ? '✅' : '❌';
        const color = result ? 'green' : 'red';
        console.log(`%c${icon} ${check}`, `color: ${color}; font-weight: bold;`);
    });
    
    // בדיקת .box
    if (academyBox) {
        console.log('\n%c📦 #academy .box Styles:', 'color: #9b59b6; font-size: 16px; font-weight: bold;');
        const boxComputed = window.getComputedStyle(academyBox);
        console.table({
            'display': boxComputed.display,
            'visibility': boxComputed.visibility,
            'opacity': boxComputed.opacity,
            'width': boxComputed.width,
            'height': boxComputed.height,
            'min-height': boxComputed.minHeight,
            'background': boxComputed.background.substring(0, 50)
        });
    } else {
        console.error('❌ #academy .box not found!');
    }
    
    // בדיקת תוכן
    if (lessonsList) {
        const items = lessonsList.querySelectorAll('.lesson-item');
        console.log('\n%c📚 Content:', 'color: #f39c12; font-size: 16px; font-weight: bold;');
        console.log(`  Lessons: ${items.length}`);
        console.log(`  HTML length: ${lessonsList.innerHTML.length}`);
        console.log(`  Children: ${lessonsList.childElementCount}`);
        
        if (items.length > 0) {
            console.log('\n%c🎓 Lesson Items:', 'color: #27ae60; font-size: 14px;');
            items.forEach((item, i) => {
                const itemStyles = window.getComputedStyle(item);
                const classes = Array.from(item.classList).join(' ');
                console.log(`  ${i + 1}. display: ${itemStyles.display}, opacity: ${itemStyles.opacity}, classes: ${classes}`);
            });
        }
    } else {
        console.error('❌ #academy-lessons-list not found!');
    }
    
    // המלצות
    console.log('\n%c💡 Recommendations:', 'color: #1abc9c; font-size: 16px; font-weight: bold;');
    
    if (computed.display === 'none') {
        console.log('❌ Problem: display is none!');
        console.log('   Fix: Check CSS specificity for #academy.active');
        console.log('   Try: academy.style.display = "flex"');
    } else if (computed.display !== 'flex') {
        console.log('⚠️ Warning: display is not flex!');
        console.log(`   Current: ${computed.display}`);
        console.log('   Expected: flex');
    }
    
    if (computed.visibility === 'hidden') {
        console.log('❌ Problem: visibility is hidden!');
        console.log('   Try: academy.style.visibility = "visible"');
    }
    
    if (computed.opacity !== '1') {
        console.log('⚠️ Warning: opacity is not 1!');
        console.log(`   Current: ${computed.opacity}`);
        console.log('   Try: academy.style.opacity = "1"');
    }
    
    if (parseInt(computed.zIndex) < 1 && computed.zIndex !== 'auto') {
        console.log('⚠️ Warning: z-index might be too low');
        console.log(`   Current: ${computed.zIndex}`);
    }
    
    // Quick fixes
    console.log('\n%c🔧 Quick Fixes:', 'color: #e67e22; font-size: 16px; font-weight: bold;');
    console.log('// Force academy to show:');
    console.log('academy.style.display = "flex";');
    console.log('academy.style.visibility = "visible";');
    console.log('academy.style.opacity = "1";');
    console.log('academy.style.zIndex = "100";');
    console.log('');
    console.log('// Or all at once:');
    console.log('Object.assign(academy.style, {display:"flex", visibility:"visible", opacity:"1", zIndex:"100"});');
}

console.log('\n%c🔍 === DEBUG COMPLETED === ', 'background: #667eea; color: white; font-size: 18px; padding: 10px; font-weight: bold;');

// Return the academy element for inspection
academy;
