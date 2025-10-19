#!/usr/bin/env python3
"""
🎨 Design System Gradient Replacer
===================================
Automatically replaces hardcoded gradients with CSS variables
"""

import re
from pathlib import Path

# Define replacements
REPLACEMENTS = {
    r'linear-gradient\(90deg, #1e293b 0%, #64748b 100%\)': 'var(--gradient-primary-h)',
    r'linear-gradient\(90deg, #1e293b, #64748b\)': 'var(--gradient-primary-h)',
    r'linear-gradient\(90deg, #0f172a 0%, #475569 100%\)': 'var(--gradient-primary-h)',
    
    r'linear-gradient\(90deg, #fbbf24 0%, #f59e0b 100%\)': 'var(--gradient-gold)',
    
    r'linear-gradient\(135deg, #4caf50 0%, #388e3c 100%\)': 'var(--gradient-success)',
    r'linear-gradient\(135deg, #388e3c 0%, #2e7d32 100%\)': 'var(--gradient-success)',
    r'linear-gradient\(90deg, #4caf50, #8bc34a\)': 'var(--gradient-success-h)',
    r'linear-gradient\(90deg, #43a047 0%, #66bb6a 100%\)': 'var(--gradient-success-h)',
    r'linear-gradient\(135deg, #4caf50 0%, #66bb6a 100%\)': 'var(--gradient-success-light)',
    r'linear-gradient\(135deg, #4CAF50, #45a049\)': 'var(--gradient-success)',
    r'linear-gradient\(135deg, #4CAF50 0%, #45a049 100%\)': 'var(--gradient-success)',
    r'linear-gradient\(135deg, #10b981, #059669\)': 'var(--gradient-success-h)',
    r'linear-gradient\(135deg, #059669, #047857\)': 'var(--gradient-success-h)',
    
    r'linear-gradient\(135deg, #ffc107 0%, #ffa000 100%\)': 'var(--gradient-warning-h)',
    r'linear-gradient\(135deg, #FFC107, #FFA000\)': 'var(--gradient-warning-h)',
    r'linear-gradient\(135deg, #ffd700 0%, #ffed4e 100%\)': 'var(--gradient-gold)',
    
    r'linear-gradient\(135deg, #0ea5e9, #0284c7\)': 'var(--gradient-info-h)',
    r'linear-gradient\(135deg, #0284c7, #0369a1\)': 'var(--gradient-info-h)',
    
    r'linear-gradient\(135deg, #f5f7fa 0%, #c3cfe2 100%\)': 'var(--gradient-bg-soft)',
    r'linear-gradient\(135deg, #e8f5e9 0%, #c8e6c9 100%\)': 'var(--gradient-bg-success)',
    r'linear-gradient\(135deg, #e3f2fd 0%, #bbdefb 100%\)': 'var(--gradient-bg-info)',
}

def replace_in_file(file_path):
    """Replace gradients in a single file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        replacements_made = 0
        
        for pattern, replacement in REPLACEMENTS.items():
            matches = len(re.findall(pattern, content))
            if matches > 0:
                content = re.sub(pattern, replacement, content)
                replacements_made += matches
                print(f"  ✅ {file_path.name}: {matches} × {replacement}")
        
        if replacements_made > 0:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            return replacements_made
        return 0
    
    except Exception as e:
        print(f"  ❌ Error in {file_path.name}: {e}")
        return 0

def main():
    """Main function"""
    print("🎨 Design System Gradient Replacer")
    print("=" * 50)
    print()
    
    css_dir = Path('src/css')
    files_to_process = [
        'modals-sidebars.css',
        'simulation-compact.css',
        'lesson-player.css',
    ]
    
    total_replacements = 0
    
    for filename in files_to_process:
        file_path = css_dir / filename
        if file_path.exists():
            print(f"📄 Processing {filename}...")
            count = replace_in_file(file_path)
            total_replacements += count
            if count == 0:
                print(f"  ℹ️  No replacements needed")
            print()
        else:
            print(f"  ⚠️  File not found: {filename}")
            print()
    
    print("=" * 50)
    print(f"✨ Total replacements: {total_replacements}")
    print("🎉 Done!")

if __name__ == '__main__':
    main()
