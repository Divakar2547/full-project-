@echo off
echo Starting Vehicle Service Backend...
echo.
echo Make sure MongoDB is running on your system!
echo.
cd BackEnd
echo Installing dependencies...
call npm install
echo.
echo Seeding database with initial data...
call node utils/seedData.js
echo.
echo Starting backend server...
call npm startgit init
