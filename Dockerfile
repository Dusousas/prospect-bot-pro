# 1) Build
FROM node:20-alpine AS builder
WORKDIR /app

# Instala deps
COPY package*.json ./
RUN npm ci

# Copia o resto e builda
COPY . .
RUN npm run build

# 2) Serve com Nginx
FROM nginx:alpine

# SPA fallback (React Router etc.)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia o build
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]