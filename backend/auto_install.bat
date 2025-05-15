@echo off
@REM cd /d C:\Project\Sikuy1\backend

@REM start cmd /k "cd laporan_service && npm start"
@REM start cmd /k "cd post_service && npm start"
@REM start cmd /k "cd user_service && npm start"
@REM start cmd /k "cd notification_service && npm start"
@REM start cmd /k "cd artikel_service && npm start"
@REM start cmd /k "cd ../frontend && bun dev"

start cmd /k "cd laporan_service && npm install"
start cmd /k "cd post_service && npm install"
start cmd /k "cd user_service && npm install"
start cmd /k "cd notification_service && npm install"
start cmd /k "cd artikel_service && npm install"
start cmd /k "cd ../frontend && npm install"