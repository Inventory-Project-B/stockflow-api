#!/bin/bash
# run-app.sh
# Script to start the StockFlow API application

echo "Starting StockFlow API..."

# Check if node is installed
if ! command -v node &> /dev/null
then
    echo "Error: Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null
then
    echo "Error: npm is not installed. Please install npm first."
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "Creating default .env file..."
    cat > .env << EOL
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASS=
DB_NAME=stockflow
JWT_SECRET=$(openssl rand -hex 32)
EOL
    echo ".env file created with random JWT secret."
fi

# Start the server
echo "Starting server..."
npm run dev
