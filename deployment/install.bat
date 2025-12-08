@echo off
REM ==========================================
REM PayGate Optimizer - Windows Installation
REM سكريبت التثبيت لويندوز
REM ==========================================

echo.
echo ========================================
echo   PayGate Optimizer - Installation
echo   سكريبت تثبيت مقارن بوابات الدفع
echo ========================================
echo.

REM Check Node.js
echo [1/6] Checking Node.js...
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed!
    echo Please install Node.js 18+ from https://nodejs.org
    pause
    exit /b 1
)
echo [OK] Node.js found

REM Create logs directory
echo.
echo [2/6] Creating logs directory...
if not exist "logs" mkdir logs
echo [OK] Logs directory created

REM Install dependencies
echo.
echo [3/6] Installing dependencies...
call npm install --production=false
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install dependencies!
    pause
    exit /b 1
)
echo [OK] Dependencies installed

REM Setup environment
echo.
echo [4/6] Setting up environment...
if not exist ".env" (
    if exist "deployment\env-production.txt" (
        copy "deployment\env-production.txt" ".env" >nul
        echo [WARN] Created .env from template. Please edit it!
    ) else (
        echo NODE_ENV=production > .env
        echo DEMO_MODE=true >> .env
        echo NEXTAUTH_SECRET=change-this-to-random-32-character-key >> .env
        echo NEXTAUTH_URL=http://localhost:3000 >> .env
        echo [WARN] Created default .env. Please update settings!
    )
) else (
    echo [OK] .env already exists
)

REM Generate Prisma
echo.
echo [5/6] Generating Prisma client...
call npx prisma generate 2>nul
echo [OK] Prisma client generated

REM Build project
echo.
echo [6/6] Building project...
call npm run build
if %errorlevel% neq 0 (
    echo [ERROR] Build failed!
    pause
    exit /b 1
)
echo [OK] Build completed

echo.
echo ========================================
echo   Installation Complete!
echo ========================================
echo.
echo Next Steps:
echo 1. Edit .env file with your settings
echo 2. Run: npm start
echo.
echo Admin Login:
echo Email: admin@paygate.com
echo Password: admin123
echo.
echo ========================================
pause

