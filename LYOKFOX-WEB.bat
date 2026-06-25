@echo off
title LyokFox Esports - Web
cd /d "%~dp0"
color 0E

:menu
cls
echo.
echo  ========================================
echo       LYOKFOX ESPORTS - WEB
echo  ========================================
echo.
echo   [1] Ver web en tu PC      (localhost)
echo   [2] Ver web publica       (internet)
echo   [3] Publicar cambios      (subir online)
echo   [4] Publicar y abrir web  (recomendado)
echo   [5] Salir
echo.
echo  Web publica: https://lyokfox.vercel.app
echo.
set /p opcion="  Elige opcion (1-5): "

if "%opcion%"=="1" goto local
if "%opcion%"=="2" goto publica
if "%opcion%"=="3" goto publicar
if "%opcion%"=="4" goto publicar_abrir
if "%opcion%"=="5" exit /b 0
goto menu

:local
call "%~dp0INICIAR-WEB.bat"
goto menu

:publica
start "" "https://lyokfox.vercel.app"
echo.
echo  Abriendo https://lyokfox.vercel.app
timeout /t 2 /nobreak >nul
goto menu

:publicar
call "%~dp0PUBLICAR-WEB.bat"
goto menu

:publicar_abrir
call "%~dp0PUBLICAR-WEB.bat" abrir
goto menu
