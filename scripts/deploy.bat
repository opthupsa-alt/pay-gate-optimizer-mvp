@echo off
REM PayGate Optimizer - Windows Deployment Script
REM ==============================================

echo.
echo ========================================
echo   PayGate Optimizer - Deployment
echo ========================================
echo.

REM Check Node.js
echo [1/5] Checking Node.js...
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed!
    echo Please install Node.js 18+ from https://nodejs.org
    pause
    exit /b 1
)
echo [OK] Node.js found

REM Install dependencies
echo.
echo [2/5] Installing dependencies...
if exist "pnpm-lock.yaml" (
    call pnpm install
) else (
    call npm install
)
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install dependencies!
    pause
    exit /b 1
)
echo [OK] Dependencies installed

REM Set environment variables
echo.
echo [3/5] Setting environment variables...
set NODE_ENV=production
set DEMO_MODE=true
if "%NEXTAUTH_SECRET%"=="" (
    echo [WARN] NEXTAUTH_SECRET not set. Using default for demo.
    set NEXTAUTH_SECRET=demo-secret-key-change-this-in-production
)
if "%NEXTAUTH_URL%"=="" (
    set NEXTAUTH_URL=http://localhost:3000
)
echo [OK] Environment configured

REM Build project
echo.
echo [4/5] Building project...
if exist "pnpm-lock.yaml" (
    call pnpm build
) else (
    call npm run build
)
if %errorlevel% neq 0 (
    echo [ERROR] Build failed!
    pause
    exit /b 1
)
echo [OK] Build completed

REM Start server
echo.
echo [5/5] Starting server...
echo.
echo ========================================
echo   Deployment Completed Successfully!
echo ========================================
echo.
echo Admin Login:
echo   Email: admin@paygate.com
echo   Password: admin123
echo.
echo Starting server at %NEXTAUTH_URL%
echo Press Ctrl+C to stop
echo.

if exist "pnpm-lock.yaml" (
    call pnpm start
) else (
    call npm start
)

