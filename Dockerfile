# Build stage
FROM node:20-slim AS builder
WORKDIR /app

# Copy dependency manifests first for better layer caching
COPY package.json package-lock.json ./

# Copy Vite and TypeScript configuration
COPY vite.config.ts tsconfig.json tsconfig.node.json postcss.config.js tailwind.config.js ./

# Copy application source and static entrypoint
COPY index.html ./
COPY public ./public
COPY src ./src

RUN npm ci
RUN npm run build

# Production stage
FROM nginx:stable-alpine AS production
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
