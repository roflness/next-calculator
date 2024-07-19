#!/bin/bash

# Start the Python server in the background
echo "Starting Flask app..."
python3 ./app.py &

# Start the Next.js application
echo "Starting Next.js app..."
npm run serve