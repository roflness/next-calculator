#!/bin/bash

# Start Gunicorn to serve the Flask app
echo "Starting Gunicorn to serve the Flask app..."
gunicorn --bind 0.0.0.0:$PORT app:app &

echo "Starting Next.js server..."
npm run start