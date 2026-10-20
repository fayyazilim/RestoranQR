Write-Host "=============================================" -ForegroundColor Cyan
Write-Host " RestoranQR - Servisleri Baslatma Araci" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan

# 1. Backend Baslat
Write-Host "[1/3] NestJS Backend baslatiliyor (Port 3001)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; npm run start:dev"

Start-Sleep -Seconds 3

# 2. Next.js Baslat
Write-Host "[2/3] Next.js Landing & Menu baslatiliyor (Port 3000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend-nextjs; npm run dev"

Start-Sleep -Seconds 2

# 3. Angular Baslat
Write-Host "[3/3] Angular Yonetim Paneli baslatiliyor (Port 4200)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend-angular; npm start"

Write-Host "`nTum servisler ayri pencerelerde baslatildi!" -ForegroundColor Green
Write-Host "• Backend API Docs : http://localhost:3001/api/docs" -ForegroundColor White
Write-Host "• Next.js Landing  : http://localhost:3000" -ForegroundColor White
Write-Host "• Ornek Menu       : http://localhost:3000/m/bella-italia" -ForegroundColor White
Write-Host "• Angular Dashboard: http://localhost:4200" -ForegroundColor White
