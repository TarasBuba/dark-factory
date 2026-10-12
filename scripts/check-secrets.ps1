# Secret Scanner for AI Dark Factory Invariant INV-001
$ErrorActionPreference = "Stop"

Write-Host "[Dark Factory / Security] Scanning workspace for secret leaks..." -ForegroundColor Cyan

$SuspiciousPatterns = @(
    'postgresql://.*:.*@.*',
    'AIzaSy[A-Za-z0-9_-]{33}',
    'sbp_[A-Za-z0-9]{40}',
    'ghp_[A-Za-z0-9]{36}'
)

$FilesToScan = Get-ChildItem -Recurse -File -Include *.ts,*.tsx,*.js,*.json,*.md -Exclude "node_modules*",".next*",".git*","package-lock.json"

$Violations = @()

foreach ($file in $FilesToScan) {
    $content = Get-Content $file.FullName -Raw -ErrorAction SilentlyContinue
    if (-not $content) { continue }
    
    foreach ($pattern in $SuspiciousPatterns) {
        if ($content -match $pattern -and $file.FullName -notmatch "node_modules|\.darkfactory|scripts\\check-secrets") {
            $Violations += "Violation in $($file.FullName): matched pattern $pattern"
        }
    }
}

if ($Violations.Count -gt 0) {
    Write-Host "[Security Auditor] FATAL: Secret patterns detected in source code!" -ForegroundColor Red
    $Violations | ForEach-Object { Write-Host "   - $_" -ForegroundColor Red }
    exit 1
}

Write-Host "[Security Auditor] Invariant INV-001 passed: Zero committed secrets." -ForegroundColor Green
exit 0
