@echo off
echo ========================================
echo GitHub Push Script - Live Visit Tracker
echo ========================================
echo.

cd /d "d:\LVT Native"

echo [1/7] Configuring Git...
git config --global user.name "Yash Khandelwal"
git config --global user.email "yash.khandelwal@pw.live"
echo Done!
echo.

echo [2/7] Initializing Git repository...
if exist .git (
    echo Git already initialized
) else (
    git init
    echo Git initialized
)
echo.

echo [3/7] Adding all files...
git add .
echo Done!
echo.

echo [4/7] Creating commit...
git commit -m "Initial commit - Live Visit Tracker v1.0"
echo.

echo [5/7] Setting branch to main...
git branch -M main
echo Done!
echo.

echo [6/7] Adding remote repository...
git remote remove origin 2>nul
git remote add origin https://github.com/yashkhandelwal-pw/LVT-Web-APP-New.git
echo Done!
echo.

echo [7/7] Pushing to GitHub...
echo NOTE: You may need to authenticate with GitHub
echo.
git push -u origin main
echo.

echo ========================================
echo Push Complete!
echo ========================================
echo.
echo Your repository: https://github.com/yashkhandelwal-pw/LVT-Web-APP-New
echo.
pause

