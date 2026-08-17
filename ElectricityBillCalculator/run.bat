@echo off
REM ============================================================
REM  ElectroBill — One-Click Build & Run Script
REM ============================================================

setlocal
set JAVA_HOME=C:\Program Files\Amazon Corretto\jdk17.0.14_7
set MVN=d:\tools\apache-maven-3.9.6\bin\mvn.cmd

echo.
echo ============================================================
echo   Starting ElectroBill Application (Servlet + MySQL + JSP)
echo ============================================================
echo.

REM 1. Check if MySQL is running
tasklist /FI "IMAGENAME eq mysqld.exe" 2>NUL | find /I /N "mysqld.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo [OK] MySQL daemon is running.
) else (
    echo [INFO] Starting MySQL from XAMPP...
    start "" /B "C:\xampp\mysql\bin\mysqld.exe" --defaults-file="C:\xampp\mysql\bin\my.ini" --standalone
    timeout /t 2 /nobreak >nul
)

REM 2. Compile & Run via Embedded Tomcat
echo.
echo [INFO] Building and starting server...
echo.
call "%MVN%" compile exec:java

pause
