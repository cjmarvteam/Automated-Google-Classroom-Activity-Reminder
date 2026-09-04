#!/bin/sh
# startup.sh - Railway startup script
# Pushes Prisma schema to database, then starts the server

echo "Running prisma db push..."
npx prisma db push --accept-data-loss --skip-generate

echo "Starting server..."
node dist/server.js
