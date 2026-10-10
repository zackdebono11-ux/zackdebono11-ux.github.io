@echo off

echo 🌴 Starting JungleScript...

powershell -WindowStyle Hidden -Command "Start-Process powershell -ArgumentList '-NoProfile','-Command','cd ''C:\Users\farru\OneDrive\Desktop\JungleScript''; npx.cmd vite' -WindowStyle Hidden"
powershell sf.cmd agent preview start --authoring-bundle Jungle_Helper --target-org JungleHelper --use-live-actions --json

timeout /t 3 /nobreak >nul

npm.cmd start