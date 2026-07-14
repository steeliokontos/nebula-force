@echo off
rem ToWatch by Autura - double-click me anytime; it scans at most once every 3 days
rem and opens the dashboard either way.
cd /d "%~dp0"

set PY=python
where python >/dev/null 2>nul
if errorlevel 1 (
    where py >/dev/null 2>nul
    if errorlevel 1 (
        echo Python is not installed on this computer.
        echo Install it free from the Microsoft Store: search for "Python",
        echo install the newest version, then double-click this file again.
        pause
        exit /b 1
    )
    set PY=py
)

echo ToWatch by Autura - checking for new tow/impound alerts...
echo.
%PY% towwatch.py scan

start "" dashboard.html
echo.
echo Done - the dashboard should now be open in your browser.
pause
