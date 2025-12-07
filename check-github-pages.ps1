# GitHub Pages Status Checker
Write-Host "======================================" -ForegroundColor Cyan
Write-Host "Checking GitHub Pages Status..." -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

$url = "https://yashkhandelwal-pw.github.io/LVT-Web-APP-New/"

Write-Host "Your GitHub Pages URL:" -ForegroundColor Yellow
Write-Host $url -ForegroundColor Green
Write-Host ""

Write-Host "Checking if site is live..." -ForegroundColor Yellow

try {
    $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 10
    if ($response.StatusCode -eq 200) {
        Write-Host "✓ SUCCESS! Your site is LIVE!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Your Live Visit Tracker is now accessible at:" -ForegroundColor Cyan
        Write-Host $url -ForegroundColor Green
        Write-Host ""
        Write-Host "Opening in browser..." -ForegroundColor Yellow
        Start-Process $url
    }
} catch {
    Write-Host "✗ Site not yet published" -ForegroundColor Red
    Write-Host ""
    Write-Host "This means:" -ForegroundColor Yellow
    Write-Host "1. You haven't enabled GitHub Pages yet, OR" -ForegroundColor White
    Write-Host "2. It's still deploying (wait 1-2 minutes)" -ForegroundColor White
    Write-Host ""
    Write-Host "To enable GitHub Pages:" -ForegroundColor Yellow
    Write-Host "1. Go to: https://github.com/yashkhandelwal-pw/LVT-Web-APP-New/settings/pages" -ForegroundColor Cyan
    Write-Host "2. Under 'Source', select 'main' branch" -ForegroundColor White
    Write-Host "3. Click 'Save'" -ForegroundColor White
    Write-Host ""
    Write-Host "Then run this script again to verify!" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

