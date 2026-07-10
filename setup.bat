@echo off
echo 📦 Business Finder Kurulumu Baslaniyor...

REM Backend baglantilinklerini yukle
echo 📥 Backend baglantiliklari yukleniyor...
call npm install

REM Frontend baglantiliklari yukle
echo 📥 Frontend baglantiliklari yukleniyor...
cd frontend
call npm install
cd ..

echo ✅ Kurulum tamamlandi!
echo.
echo 🚀 Basmak icin:
echo    npm run dev          # Backend + Frontend dev mode
echo    npm start            # Production mode
echo.
echo 🌐 Acilacak adres: http://localhost:5000
