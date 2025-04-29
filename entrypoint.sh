#!/bin/bash

set -e

echo "Starting Firebase emulators..."
firebase emulators:start --project demo-project &

EMULATOR_PID=$!

echo "Waiting for emulators to initialize (15 seconds)..."
sleep 15

export FIRESTORE_EMULATOR_HOST="localhost:5003"
export FIREBASE_AUTH_EMULATOR_HOST="localhost:9099"

echo "Running database seed script with emulator ENV VARS set..."
cd /app/functions
node lib/scripts/seedDatabase.js
SEED_EXIT_CODE=$?

unset FIRESTORE_EMULATOR_HOST
unset FIREBASE_AUTH_EMULATOR_HOST

if [ $SEED_EXIT_CODE -ne 0 ]; then
  echo "Seed script failed with exit code $SEED_EXIT_CODE"
  exit $SEED_EXIT_CODE
fi

echo "Seed script completed successfully."

echo "Emulators are running. Access UI at http://localhost:5000, Admin at http://localhost:5001 (check logs for exact ports)."
echo "Press Ctrl+C to stop." 

wait $EMULATOR_PID 