/**
 * ========================================
 * 🎨 Design System Upgrade - Quick Script
 * ========================================
 * 
 * Purpose: Replace hardcoded gradients with CSS variables
 * Run: Open in browser console or use Node.js
 */

const replacements = {
    // Gradient replacements
    'linear-gradient(90deg, #1e293b 0%, #64748b 100%)': 'var(--gradient-primary-h)',
    'linear-gradient(90deg, #1e293b, #64748b)': 'var(--gradient-primary-h)',
    'linear-gradient(90deg, #0f172a 0%, #475569 100%)': 'var(--gradient-primary-h)',
    
    'linear-gradient(90deg, #fbbf24 0%, #f59e0b 100%)': 'var(--gradient-gold)',
    
    'linear-gradient(135deg, #4caf50 0%, #388e3c 100%)': 'var(--gradient-success)',
    'linear-gradient(135deg, #388e3c 0%, #2e7d32 100%)': 'var(--gradient-success)',
    'linear-gradient(90deg, #4caf50, #8bc34a)': 'var(--gradient-success-h)',
    'linear-gradient(90deg, #43a047 0%, #66bb6a 100%)': 'var(--gradient-success-h)',
    'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)': 'var(--gradient-success-light)',
    'linear-gradient(135deg, #4CAF50, #45a049)': 'var(--gradient-success)',
    'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)': 'var(--gradient-success)',
    'linear-gradient(135deg, #10b981, #059669)': 'var(--gradient-success-h)',
    'linear-gradient(135deg, #059669, #047857)': 'var(--gradient-success-h)',
    
    'linear-gradient(135deg, #ffc107 0%, #ffa000 100%)': 'var(--gradient-warning-h)',
    'linear-gradient(135deg, #FFC107, #FFA000)': 'var(--gradient-warning-h)',
    'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)': 'var(--gradient-gold)',
    
    'linear-gradient(135deg, #0ea5e9, #0284c7)': 'var(--gradient-info-h)',
    'linear-gradient(135deg, #0284c7, #0369a1)': 'var(--gradient-info-h)',
    
    'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)': 'var(--gradient-bg-soft)',
    'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)': 'var(--gradient-bg-success)',
    'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)': 'var(--gradient-bg-info)',
    
    'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)': 'var(--gradient-shimmer)',
    'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)': 'var(--gradient-shimmer)',
};

console.log('📋 Design System Gradient Replacements:');
console.log('=======================================');
console.log(`Total replacements defined: ${Object.keys(replacements).length}`);
console.log('');
console.log('Manual replacements needed in files:');
console.log('- src/css/floating-academy.css');
console.log('- src/css/minimal-ui.css');
console.log('- src/css/fullscreen-layout.css');
console.log('- src/css/simulation-compact.css');
console.log('- src/css/modals-sidebars.css');
console.log('- src/css/lesson-player.css');
console.log('');
console.log('Use Find & Replace in VS Code:');
Object.entries(replacements).forEach(([old, newVal]) => {
    console.log(`\nFind:    ${old}`);
    console.log(`Replace: ${newVal}`);
});
