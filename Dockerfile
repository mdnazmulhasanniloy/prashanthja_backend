# ---------- STAGE 1: BUILD ----------
FROM node:22-alpine AS builder
WORKDIR /app

# copy package.json + package-lock.json
COPY ./package*.json ./
COPY ./public ./public

# install dev dependencies
RUN npm ci

# copy all source files
COPY . .

# build the app
RUN npm run build

# ---------- STAGE 2: PRODUCTION ---------- 
FROM node:22-alpine
WORKDIR /app

# install pm2 only once (correct place)
RUN npm install -g pm2

COPY package*.json ./
COPY ./public ./public
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/firebase.json ./firebase.json

EXPOSE 2000
EXPOSE 2005

CMD ["pm2-runtime", "dist/server.js", "-i", "max"]