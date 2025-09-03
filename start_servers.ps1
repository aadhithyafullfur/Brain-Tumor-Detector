Write-Host "Starting Brain Tumor Detection App..." -ForegroundColor Green
Write-Host ""

Write-Host "Starting Backend Server..." -ForegroundColor Yellow
Set-Location "backend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "python app.py" -WindowStyle Normal

Write-Host ""
Write-Host "Starting Frontend Server..." -ForegroundColor Yellow
Set-Location "../frontend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm start" -WindowStyle Normal

Write-Host ""
Write-Host "Both servers are starting..." -ForegroundColor Green
Write-Host "Backend: http://localhost:5000" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown") 