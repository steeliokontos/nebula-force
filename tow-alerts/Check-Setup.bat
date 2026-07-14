@echo off
rem ToWatch setup check - double-click me FIRST to make sure everything's ready
rem before the first real scan. It changes nothing; it only checks.
cd /d "%~dp0"

set PY=python
where python >nul 2>nul
if errorlevel 1 (
    where py >nul 2>nul
    if errorlevel 1 (
        echo Python is not installed on this computer yet.
        echo Install it free from the Microsoft Store: search for "Python",
        echo install the newest version, then double-click this file again.
        pause
        exit /b 1
    )
    set PY=py
)

echo ToWatch by Autura - checking that everything is ready...
echo.
%PY% ToWatch.py doctor
echo.
pause
