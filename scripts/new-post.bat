@echo off
chcp 65001 >nul
setlocal

:input
set "title="
set /p "title=Enter post title (filename): "
if not defined title (
    echo Title cannot be empty, please try again.
    goto input
)

hugo new "posts/%title%/index.md"
if errorlevel 1 (
    echo Failed to create. Check the title for invalid Windows characters (e.g. / : * ? " < > |).
    pause
    exit /b 1
)
echo Created post "%title%" successfully!
pause