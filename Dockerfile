# Multi-stage Dockerfile for Next.js Production Build
FROM node:20-alpine AS base

# Install dependencies required for native modules
RUN apk add --no-cache libc6-compat python3 make g++

WORKDIR /app

# Stage 1: Dependencies
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

# Stage 2: Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set environment
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Seed the sqlite database during build to package static defaults
RUN node scripts/seed.js
RUN npm run build

# Stage 3: Runner
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application & assets
COPY --from=builder /app/public ./public
COPY --from=builder /app/data ./data
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/scripts ./scripts

# Ensure correct permissions on database directory
RUN chown -R nextjs:nodejs /app/data /app/public

USER nextjs

EXPOSE 3000

CMD ["npm", "run", "start"]
