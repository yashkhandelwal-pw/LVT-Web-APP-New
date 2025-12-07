@echo off
echo ========================================
echo Pushing Updates to GitHub
echo ========================================
echo.

cd /d "d:\LVT Native"

echo [1/5] Adding changes...
git add .
echo Done!
echo.

echo [2/5] Creating commit...
git commit -m "Update UI with compact dropdowns - Mobile optimized

- Replace school/district selects with searchable modals
- Convert subject checkboxes to multi-select dropdown
- Replace large status cards with compact dropdown
- Reduce form height by ~40 percent
- Improve mobile UX and touch targets"
echo Done!
echo.

echo [3/5] Pushing to GitHub...
git push origin main
echo.

if %ERRORLEVEL% EQU 0 (
    echo ========================================
    echo ✓ Successfully pushed to GitHub!
    echo ========================================
    echo.
    echo Your repository: https://github.com/yashkhandelwal-pw/LVT-Web-APP-New
    echo GitHub Pages: https://yashkhandelwal-pw.github.io/LVT-Web-APP-New/
    echo.
    echo GitHub Pages will update in 1-2 minutes!
) else (
    echo ========================================
    echo ✗ Push failed!
    echo ========================================
    echo.
    echo Please check your authentication.
    echo You may need to use GitHub Desktop instead.
)

echo.
pause

