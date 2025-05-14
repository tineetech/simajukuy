@echo off
@REM cd /d C:\Project\Sikuy1\backend

start cmd /k "cd laporan_service && npm start"
start cmd /k "cd post_service && npm start"
start cmd /k "cd user_service && npm start"
start cmd /k "cd notification_service && npm start"
start cmd /k "cd artikel_service && npm start"
start cmd /k "cd ../frontend && bun dev"

@REM start cmd /k "cd laporan_service && npm install"
@REM start cmd /k "cd post_service && npm install"
@REM start cmd /k "cd user_service && npm install"
@REM start cmd /k "cd notification_service && npm install"
@REM start cmd /k "cd artikel_service && npm install"
@REM start cmd /k "cd ../frontend && npm install"