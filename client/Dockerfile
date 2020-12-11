# Build
FROM node:14 AS Build

# Create svaefh directory
WORKDIR /usr/src/svaefh

# Install Expo and Sharp CLI
RUN npm i -g expo-cli@3.28.5
RUN npm install -g sharp-cli@1.14.1 --unsafe-perm

# Install svaefh Client Dependencies
COPY package*.json ./
RUN npm install

# Bundle svaefh Source
COPY . .

# Image Optimization and Build
RUN npx expo-optimize@0.1.61
RUN expo build:web --no-pwa
COPY ./docker/email/* ./web-build/static/email/

# Serve
FROM nginx:1.19.4-alpine

# Nginx Config
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY docker/ssl.* /etc/nginx/

# Let's Encrypt
WORKDIR /usr/src/svaefh-letsencrypt
COPY ./docker/letsencrypt/* ./

# Create svaefh directory
WORKDIR /usr/src/svaefh

# Bundle svaefh Source
COPY --from=Build /usr/src/svaefh/web-build .
