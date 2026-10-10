@echo off
setlocal
title Bosfor Hotels Web Project

set "TARGET=%USERPROFILE%\Desktop\Bosfor Hotels Web Project"
set "REPO=https://github.com/rdmrcn/HotelManagment-WebAPI.git"
set "URL=http://localhost:43123/HotelManagment-WebAPI/"

where git >nul 2>nul
if errorlevel 1 (
  echo Git is not installed. Download it from https://git-scm.com/download/win and run this file again.
  start https://git-scm.com/download/win
  pause
  exit /b 1
)

where npm >nul 2>nul
if errorlevel 1 (
  echo Node.js is not installed. Download the LTS version from https://nodejs.org and run this file again.
  start https://nodejs.org
  pause
  exit /b 1
)

if exist "%TARGET%\package.json" (
  echo Updating existing project...
  cd /d "%TARGET%"
  git pull
) else (
  echo Downloading project to the Desktop...
  git clone %REPO% "%TARGET%"
  if errorlevel 1 (
    echo Download failed. Check your internet connection and try again.
    pause
    exit /b 1
  )
  cd /d "%TARGET%"
)

echo Installing packages (first run takes a minute)...
call npm install
if errorlevel 1 (
  echo npm install failed.
  pause
  exit /b 1
)

echo Starting Bosfor Hotels at %URL%
start "" cmd /c "timeout /t 8 >nul & start %URL%"
call npm run dev

pause
