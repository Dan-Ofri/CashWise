/**
 * 🎨 VISUAL HIGHLIGHTER FOR ACADEMY
 * מדגיש בצבע את האקדמיה כדי לראות איפה היא
 */

console.log('%c🎨 Highlighting Academy...', 'background: #e74c3c; color: white; padding: 8px; font-size: 14px;');

const academy = document.getElementById('academy');

if (!academy) {
    console.error('❌ Academy not found!');
} else {
    // הדגשה חזותית
    const originalStyle = {
        outline: academy.style.outline,
        background: academy.style.background,
        opacity: academy.style.opacity,
        zIndex: academy.style.zIndex
    };
    
    // צביעה באדום בוהק!
    academy.style.outline = '10px solid red';
    academy.style.background = 'rgba(255, 0, 0, 0.3)';
    academy.style.opacity = '1';
    academy.style.zIndex = '9999';
    
    console.log('✅ Academy highlighted in RED');
    console.log('📍 If you see a red box - the academy IS there but maybe has content issues');
    console.log('❌ If you see NOTHING - the academy is hidden or has display/visibility issues');
    
    // הסרת ההדגשה אחרי 5 שניות
    setTimeout(() => {
        Object.assign(academy.style, originalStyle);
        console.log('🎨 Highlight removed');
    }, 5000);
    
    // הדגשת ה-.box
    const box = document.querySelector('#academy .box');
    if (box) {
        box.style.outline = '5px solid blue';
        box.style.background = 'rgba(0, 0, 255, 0.2)';
        console.log('✅ .box highlighted in BLUE');
        
        setTimeout(() => {
            box.style.outline = '';
            box.style.background = '#f5f7fa';
        }, 5000);
    }
    
    // הדגשת הפריטים
    const items = document.querySelectorAll('#academy-lessons-list .lesson-item');
    if (items.length > 0) {
        items.forEach((item, i) => {
            item.style.outline = '2px solid green';
            item.style.background = 'rgba(0, 255, 0, 0.1)';
        });
        console.log(`✅ ${items.length} lesson items highlighted in GREEN`);
        
        setTimeout(() => {
            items.forEach(item => {
                item.style.outline = '';
                item.style.background = '';
            });
        }, 5000);
    } else {
        console.warn('⚠️ No lesson items found!');
    }
}

console.log('\n%c🔍 Look at the page NOW!', 'background: #f39c12; color: white; padding: 10px; font-size: 16px; font-weight: bold;');
console.log('RED = #academy');
console.log('BLUE = .box');
console.log('GREEN = lesson items');
console.log('\n(Colors will disappear after 5 seconds)');
