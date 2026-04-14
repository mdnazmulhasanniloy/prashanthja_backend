# ---------- STAGE 1: BUILD ----------
FROM node:22-alpine AS builder
WORKDIR /app

# copy package.json + package-lock.json
COPY ./package*.json ./

# install dev dependencies
RUN npm ci

# copy all source files
COPY . .

# build the app
RUN npm run build

# ---------- STAGE 2: PRODUCTION ---------- 
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

# IMPORTANT: install ALL deps (not only production)
RUN npm ci

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/firebase.json ./firebase.json

EXPOSE 2000
EXPOSE 2005

CMD ["node", "dist/server.js"]
