@echo off
:: run-app.bat
:: Script to start the StockFlow API application on Windows

echo Starting StockFlow API...

:: Check if node is installed
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Error: Node.js is not installed. Please install Node.js first.
    exit /b 1
)

:: Check if npm is installed
where npm >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Error: npm is not installed. Please install npm first.
    exit /b 1
)

:: Install dependencies if node_modules doesn't exist
if not exist "node_modules\" (
    echo Installing dependencies...
    npm install
)

:: Check if .env file exists
if not exist ".env" (
    echo Creating default .env file...
    (
        echo PORT=5000
        echo DB_HOST=localhost
        echo DB_USER=root
        echo DB_PASS=
        echo DB_NAME=stockflow
        echo JWT_SECRET=stockflow_secret_key_change_this_in_production
    ) > .env
    echo .env file created with default JWT secret.
    echo WARNING: Please change the JWT_SECRET in the .env file for production use.
)

:: Start the server
echo Starting server...
npm run dev
