@echo off
echo ========================================
echo Starting Local Server
echo ========================================
echo.

cd /d "d:\LVT Native"

echo Starting HTTP server on port 8000...
echo.
echo ✓ Desktop URL: http://localhost:8000
echo ✓ Mobile URL: http://YOUR_LOCAL_IP:8000
echo.
echo Press Ctrl+C to stop the server
echo.
echo ========================================

npx http-server -p 8000

