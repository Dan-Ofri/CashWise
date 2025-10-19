@echo off
echo Starting CashWise Local Server...
echo.
echo Server will run on: http://localhost:8000
echo Press Ctrl+C to stop the server
echo.
python -m http.server 8000
