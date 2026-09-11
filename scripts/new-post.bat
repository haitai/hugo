@echo off
chcp 65001 >nul
setlocal
cd /d "%~dp0.."

for /f %%i in ('powershell -NoProfile -Command "Get-Date -Format yyyy-MM-dd"') do set "today=%%i"

:input
set "title="
set /p "title=Enter post title (filename): "
if not defined title goto input

:trim
if "%title:~0,1%"==" " set "title=%title:~1%" & goto trim
if "%title:~-1%"==" " set "title=%title:~0,-1%" & goto trim
if "%title%"=="" goto input
set "title=%title: =-%"

hugo new "posts/%title%/index.md"
if errorlevel 1 (
    echo Failed to create. Check the title for invalid Windows characters (e.g. / : * ? " < > |).
    pause
    exit /b 1
)

notepad content/posts/%title%/index.md
echo Created post "%title%" successfully!
pause