@echo off
cd /d C:\Project\Sikuy\backend

start cmd /k "cd laporan_service && npm start"
start cmd /k "cd post_service && npm start"
start cmd /k "cd user_service && npm start"
start cmd /k "cd notification_service && npm start"
start cmd /k "cd artikel_service && npm start"
start cmd /k "cd ../frontend && npm run dev"
