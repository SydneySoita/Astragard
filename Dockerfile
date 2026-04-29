# ---------------------
# Stage 1: Build React app
# ---------------------
FROM node:18 AS build

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Supabase env vars injected at build time
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_PUBLISHABLE_KEY

ENV VITE_SUPABASE_URL=${VITE_SUPABASE_URL}
ENV VITE_SUPABASE_PUBLISHABLE_KEY=${VITE_SUPABASE_PUBLISHABLE_KEY}

# Build Vite app
RUN npm run build


# ---------------------
# Stage 2: Production image
# ---------------------
FROM node:18-alpine

WORKDIR /app

# Install serve (static file server)
RUN npm install -g serve

# Copy built files from build stage
COPY --from=build /app/dist ./dist

# Expose port
EXPOSE 3000

# Run serve in SPA mode
CMD ["serve", "dist", "-l", "3000"]