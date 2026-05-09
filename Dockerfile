# ---------------------
# Stage 1: Build React app
# ---------------------
FROM node:18 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_PUBLISHABLE_KEY

ENV VITE_SUPABASE_URL=${VITE_SUPABASE_URL}
ENV VITE_SUPABASE_PUBLISHABLE_KEY=${VITE_SUPABASE_PUBLISHABLE_KEY}

RUN npm run build

# ---------------------
# Stage 2: Production image
# ---------------------
FROM node:18-alpine

WORKDIR /app

RUN npm install -g serve

COPY --from=build /app/dist ./dist

EXPOSE 3002

CMD ["serve", "dist", "-l", "3002"]