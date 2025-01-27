#!/bin/sh
set -e

# Apply database migrations
npx prisma migrate deploy

# Start the application
npm run start:prod