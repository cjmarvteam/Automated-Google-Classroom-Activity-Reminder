FROM node:20-slim

WORKDIR /app

# Prisma's native query engine requires OpenSSL at build time and runtime.
RUN apt-get update \
    && apt-get install -y --no-install-recommends openssl \
    && rm -rf /var/lib/apt/lists/*

# Install build and runtime dependencies.
COPY package*.json ./
RUN npm ci

# Generate Prisma Client and compile TypeScript inside the image. Build output is
# intentionally not committed to Git, so Railway must create dist/ here.
COPY prisma ./prisma/
COPY tsconfig.json ./
COPY src ./src/
RUN npm run build

# Keep Prisma because Railway runs `npm run db:push` before starting this image.
RUN npm prune --omit=dev

CMD ["npm", "run", "start"]
