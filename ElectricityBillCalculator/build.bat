@echo off
REM ============================================================
REM  ElectroBill — Build & Deploy Helper Script
REM  Author: Senior Full Stack Java Developer
REM ============================================================

setlocal

SET JAVA_HOME=C:\Program Files\Amazon Corretto\jdk17.0.14_7
SET MVN=d:\tools\apache-maven-3.9.6\bin\mvn.cmd
SET TOMCAT_WEBAPPS=C:\Program Files\Apache Software Foundation\Tomcat 10.1\webapps

echo.
echo ========================================
echo   ElectroBill Build Script
echo ========================================
echo.

REM 1. Check Java
echo [1/3] Checking Java...
"%JAVA_HOME%\bin\java" -version 2>&1
if errorlevel 1 (
    echo ERROR: Java not found at %JAVA_HOME%
    pause
    exit /b 1
)

REM 2. Build
echo.
echo [2/3] Building with Maven...
call "%MVN%" clean package -DskipTests
if errorlevel 1 (
    echo.
    echo ERROR: Build failed! Check errors above.
    pause
    exit /b 1
)

echo.
echo [3/3] Build SUCCESS! WAR file created:
echo       target\ElectricityBillCalculator.war
echo.

REM 3. Optional deploy
echo Do you want to deploy to Tomcat? (Y/N)
set /p deploy=^> 

if /i "%deploy%"=="Y" (
    if exist "%TOMCAT_WEBAPPS%" (
        echo Copying WAR to Tomcat webapps...
        copy /Y "target\ElectricityBillCalculator.war" "%TOMCAT_WEBAPPS%\"
        echo Done! Restart Tomcat and open:
        echo   http://localhost:8080/ElectricityBillCalculator/
    ) else (
        echo Tomcat webapps dir not found at: %TOMCAT_WEBAPPS%
        echo Please copy target\ElectricityBillCalculator.war manually.
    )
)

echo.
echo ========================================
echo   Done!
echo ========================================
pause
