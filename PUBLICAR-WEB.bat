@echo off

title LyokFox - Publicar web

cd /d "%~dp0"

echo.

echo  Publicando LyokFox en TODAS las webs...

echo  Mismo contenido que localhost:3000

echo.

echo [0/2] Generando logos oficiales embebidos...

node scripts/build-game-logos.js

if errorlevel 1 goto error

echo.

echo [1/2] https://lyokfox.vercel.app

npx --yes vercel deploy --prod --yes --force --project v0-sports-team-website

if errorlevel 1 goto error

echo.

echo [2/2] https://lyokfox-esports.vercel.app

npx --yes vercel deploy --prod --yes --force --project lyokfox-esports

if errorlevel 1 goto error

echo.

echo  ========================================

echo   TODAS LAS WEBS IGUALES A LOCALHOST

echo  ========================================

echo.

echo   Local:    http://localhost:3000

echo   Online 1: https://lyokfox.vercel.app

echo   Online 2: https://lyokfox-esports.vercel.app

echo.

echo   Comprueba el footer: misma version (v2025.06.22-fix)

echo.

if /i "%~1"=="abrir" (

  start "" "https://lyokfox.vercel.app"

  timeout /t 3 /nobreak >nul

  exit /b 0

)

pause

exit /b 0

:error

echo.

echo  ERROR: No se pudo publicar. Revisa tu conexion.

pause

exit /b 1

