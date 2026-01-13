# ==========================================
# 6. FRONTEND Dockerfile
# Ubicación: carpeta payment-challenge-front/Dockerfile
# Ejecutar build desde su carpeta con argumentos: 
# docker build --build-arg VITE_API_URL=http://localhost:3000 --build-arg VITE_WOMPI_PUBLIC_KEY=... -t mi-front .
# ==========================================

# Build Stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .

# Build Args (Necesarios para que Vite compile bien)
ARG VITE_API_URL
ARG VITE_WOMPI_PUBLIC_KEY
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_WOMPI_PUBLIC_KEY=$VITE_WOMPI_PUBLIC_KEY

RUN yarn run build

# Production Stage
FROM nginx:alpine AS production
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
