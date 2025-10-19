/**
 *  BUTTON STYLE DEBUG - Comprehensive Check
 */

console.log('%c === BUTTON STYLE DEBUG === ', 'background: #667eea; color: white; font-size: 18px; padding: 10px; font-weight: bold;');

const btn = document.getElementById('floating-academy-btn');

if (!btn) {
    console.error(' Button not found!');
} else {
    const computed = window.getComputedStyle(btn);
    
    console.log('\n%c Computed Styles:', 'color: #3498db; font-size: 16px; font-weight: bold;');
    console.table({
        'background': computed.background.substring(0, 100),
        'background-image': computed.backgroundImage.substring(0, 100),
        'background-color': computed.backgroundColor,
        'width': computed.width,
        'height': computed.height,
        'border-radius': computed.borderRadius,
        'box-shadow': computed.boxShadow.substring(0, 80),
        'position': computed.position,
        'bottom': computed.bottom,
        'left': computed.left,
        'z-index': computed.zIndex,
        'display': computed.display
    });
    
    console.log('\n%c Background Analysis:', 'color: #9b59b6; font-size: 16px; font-weight: bold;');
    console.log('Full background:', computed.background);
    console.log('Background-image:', computed.backgroundImage);
    
    if (computed.backgroundImage.includes('linear-gradient')) {
        const gradient = computed.backgroundImage.match(/linear-gradient\([^)]+\)/);
        console.log('%c Has gradient!', 'color: green; font-weight: bold;');
        console.log('Gradient:', gradient ? gradient[0] : 'N/A');
    } else {
        console.log('%c NO gradient found!', 'color: red; font-weight: bold;');
    }
    
    console.log('\n%c CSS Classes:', 'color: #e74c3c; font-size: 16px; font-weight: bold;');
    console.log('classList:', Array.from(btn.classList));
    console.log('has-unlocked:', btn.classList.contains('has-unlocked'));
    
    console.log('\n%c All CSS Rules Applied:', 'color: #f39c12; font-size: 16px; font-weight: bold;');
    
    // Get all matching CSS rules
    const sheets = document.styleSheets;
    let rulesFound = 0;
    
    for (let sheet of sheets) {
        try {
            const rules = sheet.cssRules || sheet.rules;
            if (!rules) continue;
            
            for (let rule of rules) {
                if (rule.selectorText && rule.selectorText.includes('floating-academy-button')) {
                    rulesFound++;
                    console.log(`\n${rulesFound}. ${rule.selectorText}`);
                    console.log('   Source:', sheet.href || 'inline');
                    if (rule.style.background) {
                        console.log('   background:', rule.style.background);
                    }
                    if (rule.style.backgroundImage) {
                        console.log('   background-image:', rule.style.backgroundImage);
                    }
                }
            }
        } catch (e) {
            // Cross-origin or other errors
        }
    }
    
    console.log(`\n%cTotal rules found: ${rulesFound}`, 'color: #27ae60; font-weight: bold;');
    
    console.log('\n%c Recommendations:', 'color: #1abc9c; font-size: 16px; font-weight: bold;');
    
    if (!computed.backgroundImage.includes('667eea')) {
        console.log(' Gradient colors not matching expected (667eea, 764ba2)');
        console.log('Expected: linear-gradient(135deg, #667eea 0%, #764ba2 100%)');
        console.log('Got:', computed.backgroundImage);
        console.log('\n Quick Fix:');
        console.log('btn.style.background = "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";');
    }
}

console.log('\n%c === DEBUG COMPLETED === ', 'background: #667eea; color: white; font-size: 18px; padding: 10px; font-weight: bold;');
btn;
