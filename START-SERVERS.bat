@echo off
echo ========================================
echo  Draw and Guess Game - Server Startup
echo ========================================
echo.

echo [1/3] Stopping old processes...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 /nobreak >nul

echo [2/3] Starting Backend Server...
start "Backend Server" cmd /k "cd /d "%~dp0backend" && npm run dev"
timeout /t 4 /nobreak >nul

echo [3/3] Starting Frontend (Next.js)...
start "Frontend (Next.js)" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo.
echo ========================================
echo  Servers are starting!
echo ========================================
echo  Backend:  http://localhost:4000
echo  Frontend: http://localhost:3000
echo ========================================
echo.
echo Wait 10-15 seconds, then open: http://localhost:3000
echo.
pause
