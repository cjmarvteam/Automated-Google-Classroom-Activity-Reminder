FROM node:18-slim

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Copy prisma schema
COPY prisma ./prisma/

# Generate Prisma Client
RUN npx prisma generate

# Copy built source
COPY dist ./dist/

# Push database schema and start server
CMD ["sh", "-c", "npx prisma db push --accept-data-loss --skip-generate && node dist/server.js"]
