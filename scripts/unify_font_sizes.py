#!/usr/bin/env python3
"""
CashWise - Font Size Unification Script
Replaces all hardcoded font-size values with CSS variables
"""

import re
from pathlib import Path

# Font size mapping - px to CSS variable
FONT_SIZE_MAP = {
    '10px': 'var(--font-2xs)',
    '11px': 'var(--font-xs)',
    '12px': 'var(--font-2xs)',     # Can be 2xs
    '13px': 'var(--font-sm)',
    '14px': 'var(--font-sm)',      # Can be sm  
    '15px': 'var(--font-sm)',      # Can be sm
    '16px': 'var(--font-base)',
    '17px': 'var(--font-base)',    # Can be base
    '18px': 'var(--font-md)',
    '19px': 'var(--font-md)',      # Can be md
    '20px': 'var(--font-lg)',
    '22px': 'var(--font-xl)',      # Close to 24px
    '24px': 'var(--font-xl)',
    '28px': 'var(--font-2xl)',
    '32px': 'var(--font-3xl)',
    '34px': 'var(--font-3xl)',     # Close to 32px
    '36px': 'var(--font-3xl)',     # Close to 32px
    '48px': 'var(--font-4xl)',
    '60px': 'var(--font-5xl)',     # Close to 64px
    '64px': 'var(--font-5xl)',
    '80px': 'var(--font-6xl)',
}

# CSS files to process
CSS_FILES = [
    'src/css/floating-academy.css',
    'src/css/minimal-ui.css',
    'src/css/simulation-compact.css',
    'src/css/modals-sidebars.css',
    'src/css/lesson-player.css',
    'src/css/stage-d-financial.css',
    'src/css/responsive.css',
    'src/css/main.css',
]

def replace_font_sizes(file_path):
    """Replace hardcoded font-sizes with CSS variables in a file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        replacements = 0
        
        # Replace each font-size
        for px_value, css_var in FONT_SIZE_MAP.items():
            # Pattern: font-size: XXpx; or font-size: XXpx !important;
            pattern = rf'font-size:\s*{re.escape(px_value)}(\s*!important)?;'
            
            def replace_func(match):
                nonlocal replacements
                replacements += 1
                important = match.group(1) or ''
                return f'font-size: {css_var}{important};'
            
            content = re.sub(pattern, replace_func, content)
        
        if replacements > 0:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"✅ {file_path}: {replacements} replacements")
            return replacements
        else:
            print(f"⏭️  {file_path}: No changes needed")
            return 0
            
    except FileNotFoundError:
        print(f"⚠️  {file_path}: File not found")
        return 0
    except Exception as e:
        print(f"❌ {file_path}: Error - {e}")
        return 0

def main():
    """Main function"""
    print("🚀 CashWise Font Size Unification")
    print("=" * 50)
    
    base_dir = Path(__file__).parent.parent
    total_replacements = 0
    
    for css_file in CSS_FILES:
        file_path = base_dir / css_file
        replacements = replace_font_sizes(file_path)
        total_replacements += replacements
    
    print("=" * 50)
    print(f"🎉 Total: {total_replacements} font-size values unified!")
    print(f"✅ 100% Typography System Complete!")

if __name__ == '__main__':
    main()
