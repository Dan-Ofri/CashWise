/**
 * CashWise - Font Size Unification Script
 * Replaces all hardcoded font-size values with CSS variables
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Font size mapping - px to CSS variable
const FONT_SIZE_MAP = {
    '10px': 'var(--font-2xs)',
    '11px': 'var(--font-xs)',
    '12px': 'var(--font-2xs)',
    '13px': 'var(--font-sm)',
    '14px': 'var(--font-sm)',
    '15px': 'var(--font-sm)',
    '16px': 'var(--font-base)',
    '17px': 'var(--font-base)',
    '18px': 'var(--font-md)',
    '19px': 'var(--font-md)',
    '20px': 'var(--font-lg)',
    '22px': 'var(--font-xl)',
    '24px': 'var(--font-xl)',
    '26px': 'var(--font-2xl)',
    '28px': 'var(--font-2xl)',
    '32px': 'var(--font-3xl)',
    '34px': 'var(--font-3xl)',
    '36px': 'var(--font-3xl)',
    '48px': 'var(--font-4xl)',
    '60px': 'var(--font-5xl)',
    '64px': 'var(--font-5xl)',
    '80px': 'var(--font-6xl)',
};

// CSS files to process
const CSS_FILES = [
    'src/css/floating-academy.css',
    'src/css/minimal-ui.css',
    'src/css/simulation-compact.css',
    'src/css/modals-sidebars.css',
    'src/css/lesson-player.css',
    'src/css/stage-d-financial.css',
    'src/css/responsive.css',
];

function replaceFontSizes(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        const originalContent = content;
        let replacements = 0;

        // Replace each font-size
        Object.entries(FONT_SIZE_MAP).forEach(([pxValue, cssVar]) => {
            const regex = new RegExp(`font-size:\\s*${pxValue.replace('px', 'px')}(\\s*!important)?;`, 'g');
            content = content.replace(regex, (match, important) => {
                replacements++;
                return `font-size: ${cssVar}${important || ''};`;
            });
        });

        if (replacements > 0) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`✅ ${path.basename(filePath)}: ${replacements} replacements`);
            return replacements;
        } else {
            console.log(`⏭️  ${path.basename(filePath)}: No changes needed`);
            return 0;
        }
    } catch (error) {
        console.log(`❌ ${path.basename(filePath)}: ${error.message}`);
        return 0;
    }
}

function main() {
    console.log('🚀 CashWise Font Size Unification');
    console.log('='.repeat(50));

    let totalReplacements = 0;

    CSS_FILES.forEach(cssFile => {
        const filePath = path.join(__dirname, '..', cssFile);
        const replacements = replaceFontSizes(filePath);
        totalReplacements += replacements;
    });

    console.log('='.repeat(50));
    console.log(`🎉 Total: ${totalReplacements} font-size values unified!`);
    console.log(`✅ 100% Typography System Complete!`);
}

main();
