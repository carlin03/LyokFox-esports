@echo off
title LyokFox Sports - Servidor local
cd /d "%~dp0"
echo.
echo  LyokFox Sports - Servidor local
echo  =================================
echo.
echo  Carpeta: %~dp0
echo  URL: http://localhost:3000
echo.
echo  IMPORTANTE: usa LyokFox (sin guion bajo al final).
echo.
echo  Paginas: index  noticias  historia  equipos  contactanos
echo.
echo  Se abrira el navegador en unos segundos.
echo  Pulsa Ctrl+C aqui para cerrar el servidor.
echo.
start "" cmd /c "timeout /t 3 /nobreak >nul && start http://localhost:3000"
npx --yes serve . -l 3000 -c serve.json
