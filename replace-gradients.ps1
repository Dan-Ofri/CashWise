# 🎨 Design System Gradient Replacer
# Automatically replaces hardcoded gradients with CSS variables

Write-Host "🎨 Design System Gradient Replacer" -ForegroundColor Cyan
Write-Host ("=" * 50)
Write-Host ""

$replacements = @{
    'linear-gradient\(90deg, #1e293b 0%, #64748b 100%\)' = 'var(--gradient-primary-h)'
    'linear-gradient\(90deg, #1e293b, #64748b\)' = 'var(--gradient-primary-h)'
    'linear-gradient\(90deg, #0f172a 0%, #475569 100%\)' = 'var(--gradient-primary-h)'
    
    'linear-gradient\(90deg, #fbbf24 0%, #f59e0b 100%\)' = 'var(--gradient-gold)'
    
    'linear-gradient\(135deg, #4caf50 0%, #388e3c 100%\)' = 'var(--gradient-success)'
    'linear-gradient\(135deg, #388e3c 0%, #2e7d32 100%\)' = 'var(--gradient-success)'
    'linear-gradient\(90deg, #4caf50, #8bc34a\)' = 'var(--gradient-success-h)'
    'linear-gradient\(90deg, #43a047 0%, #66bb6a 100%\)' = 'var(--gradient-success-h)'
    'linear-gradient\(135deg, #4caf50 0%, #66bb6a 100%\)' = 'var(--gradient-success-light)'
    'linear-gradient\(135deg, #4CAF50, #45a049\)' = 'var(--gradient-success)'
    'linear-gradient\(135deg, #4CAF50 0%, #45a049 100%\)' = 'var(--gradient-success)'
    'linear-gradient\(135deg, #10b981, #059669\)' = 'var(--gradient-success-h)'
    'linear-gradient\(135deg, #059669, #047857\)' = 'var(--gradient-success-h)'
    
    'linear-gradient\(135deg, #ffc107 0%, #ffa000 100%\)' = 'var(--gradient-warning-h)'
    'linear-gradient\(135deg, #FFC107, #FFA000\)' = 'var(--gradient-warning-h)'
    'linear-gradient\(135deg, #ffd700 0%, #ffed4e 100%\)' = 'var(--gradient-gold)'
    
    'linear-gradient\(135deg, #0ea5e9, #0284c7\)' = 'var(--gradient-info-h)'
    'linear-gradient\(135deg, #0284c7, #0369a1\)' = 'var(--gradient-info-h)'
    
    'linear-gradient\(135deg, #f5f7fa 0%, #c3cfe2 100%\)' = 'var(--gradient-bg-soft)'
    'linear-gradient\(135deg, #e8f5e9 0%, #c8e6c9 100%\)' = 'var(--gradient-bg-success)'
    'linear-gradient\(135deg, #e3f2fd 0%, #bbdefb 100%\)' = 'var(--gradient-bg-info)'
}

$filesToProcess = @(
    'src\css\modals-sidebars.css',
    'src\css\simulation-compact.css',
    'src\css\lesson-player.css'
)

$totalReplacements = 0

foreach ($file in $filesToProcess) {
    if (Test-Path $file) {
        Write-Host "📄 Processing $(Split-Path $file -Leaf)..." -ForegroundColor Yellow
        
        $content = Get-Content $file -Raw -Encoding UTF8
        $originalContent = $content
        $fileReplacements = 0
        
        foreach ($pattern in $replacements.Keys) {
            $replacement = $replacements[$pattern]
            $matches = ([regex]::Matches($content, $pattern)).Count
            
            if ($matches -gt 0) {
                $content = $content -replace $pattern, $replacement
                $fileReplacements += $matches
                Write-Host "  ✅ $matches × $replacement" -ForegroundColor Green
            }
        }
        
        if ($fileReplacements -gt 0) {
            Set-Content -Path $file -Value $content -Encoding UTF8 -NoNewline
            $totalReplacements += $fileReplacements
        } else {
            Write-Host "  ℹ️  No replacements needed" -ForegroundColor Gray
        }
        
        Write-Host ""
    } else {
        Write-Host "  ⚠️  File not found: $file" -ForegroundColor Red
        Write-Host ""
    }
}

Write-Host ("=" * 50)
Write-Host "✨ Total replacements: $totalReplacements" -ForegroundColor Cyan
Write-Host "🎉 Done!" -ForegroundColor Green
