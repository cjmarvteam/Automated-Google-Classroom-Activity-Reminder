#!/bin/sh
# startup.sh - Railway startup script
# Pushes Prisma schema to database, then starts the server

echo "Running prisma db push..."
npm run db:push

echo "Starting server..."
npm run start
