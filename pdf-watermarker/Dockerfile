# Stage 1: Build & Security Audit
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies using clean install
COPY package*.json ./
RUN npm ci || npm install --legacy-peer-deps --no-audit --no-fund

# Run security audit (handled gracefully if warnings are found, but logs issues)
RUN npm audit --audit-level=high || true

# Stage 2: Production Release
FROM node:20-alpine AS runner

WORKDIR /app

# Set node environment to production
ENV NODE_ENV=production

# Copy built node_modules and package file
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./

# Copy application source files
COPY server.js ./
COPY public/ ./public/

# Use built-in non-privileged system user for running the app
USER node

# Port exposed by the microservice
EXPOSE 8999

# Healthcheck configuration using built-in fetch utility in Node.js 18+
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD node -e "fetch('http://localhost:8999/health').then(r => r.ok ? process.exit(0) : process.exit(1)).catch(() => process.exit(1))"

# Start the microservice
CMD ["npm", "start"]
