@echo off
cls
echo ========================================
echo   Live Visit Tracker - Local Server
echo ========================================
echo.
echo Starting server on http://localhost:8000
echo.
echo IMPORTANT: Keep this window open!
echo.
echo ========================================
echo.

cd /d "d:\LVT Native"

echo [INFO] Starting HTTP server...
echo.

call npx -y http-server -p 8000 --cors

echo.
echo [INFO] Server stopped.
pause

