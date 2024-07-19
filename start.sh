#!/bin/bash

# Start the Python server in the background
python3 ./app.py &

# Start the Next.js application
npm run start -p $PORT