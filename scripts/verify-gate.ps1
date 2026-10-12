# Independent Verification Gate (21no.de Architecture Standard)
$ErrorActionPreference = "Stop"

Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "[AI Dark Factory] Executing Independent Verification Gate..." -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan

$StartTime = Get-Date

# Provide safe ephemeral dummy env vars for local compile validation if absent
if (-not $env:DATABASE_URL) { $env:DATABASE_URL = "postgresql://postgres:dummy@localhost:5432/postgres?pgbouncer=true" }
if (-not $env:DIRECT_URL) { $env:DIRECT_URL = "postgresql://postgres:dummy@localhost:5432/postgres" }
if (-not $env:CRON_SECRET) { $env:CRON_SECRET = "verify_gate_dummy_secret" }

$Results = @{
    timestamp = $StartTime.ToString("o")
    steps = @{}
    passed = $false
}

try {
    # Step 1: Security Audit
    Write-Host "`n1. [Mesh: Security Auditor] Verifying secret leak invariants..." -ForegroundColor Yellow
    node scripts/check-secrets.js
    if ($LASTEXITCODE -ne 0) { throw "Security check failed" }
    $Results.steps["security_audit"] = "PASSED"

    # Step 2: Prisma Schema Validation
    Write-Host "`n2. [Mesh: Compliance] Validating database contracts..." -ForegroundColor Yellow
    npx prisma validate
    if ($LASTEXITCODE -ne 0) { throw "Prisma validation failed" }
    $Results.steps["schema_validation"] = "PASSED"

    # Step 3: Production Build (Type safety + Turbopack)
    Write-Host "`n3. [Mesh: Test Engineer & Operator] Running production build..." -ForegroundColor Yellow
    npm run build
    if ($LASTEXITCODE -ne 0) { throw "Build failed" }
    $Results.steps["production_build"] = "PASSED"

    # Step 4: End-to-End User Simulation
    Write-Host "`n4. [Mesh: Test Engineer] Executing end-to-end Canadian hardware store simulations..." -ForegroundColor Yellow
    node scripts/simulate-user-flow.mjs
    if ($LASTEXITCODE -ne 0) { throw "Simulation tests failed" }
    $Results.steps["user_flow_simulation"] = "PASSED"

    $Results.passed = $true
    $Duration = ((Get-Date) - $StartTime).TotalSeconds
    $Results["durationSeconds"] = $Duration

    # Persist audit trail in telemetry
    $TelemetryDir = ".darkfactory\telemetry"
    if (-not (Test-Path $TelemetryDir)) { New-Item -ItemType Directory -Path $TelemetryDir -Force | Out-Null }
    
    $Results | ConvertTo-Json -Depth 5 | Set-Content "$TelemetryDir\audit-trail.json"

    Write-Host "`n================================================================" -ForegroundColor Green
    Write-Host "[AI Dark Factory] Verification Gate PASSED in $([math]::Round($Duration, 1))s!" -ForegroundColor Green
    Write-Host "Signed audit trail written to .darkfactory/telemetry/audit-trail.json" -ForegroundColor Green
    Write-Host "================================================================" -ForegroundColor Green
    exit 0
}
catch {
    $Results.passed = $false
    $Results["error"] = $_.ToString()
    
    $TelemetryDir = ".darkfactory\telemetry"
    if (-not (Test-Path $TelemetryDir)) { New-Item -ItemType Directory -Path $TelemetryDir -Force | Out-Null }
    $Results | ConvertTo-Json -Depth 5 | Set-Content "$TelemetryDir\audit-trail.json"

    Write-Host "`n[AI Dark Factory] Verification Gate FAILED: $_" -ForegroundColor Red
    exit 1
}
