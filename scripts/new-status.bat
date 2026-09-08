@echo off
chcp 65001 >nul
setlocal
cd /d "%~dp0.."

for /f %%i in ('powershell -NoProfile -Command "Get-Date -Format yyyy-MM-dd-HHmmss"') do set "ts=%%i"

hugo new "statuses/%ts%/index.md"
if errorlevel 1 (
    echo Failed to create status.
    pause
    exit /b 1
)
notepad content/statuses/%ts%/index.md
echo Created status "%ts%" successfully!
pause