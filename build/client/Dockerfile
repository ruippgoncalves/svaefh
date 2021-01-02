FROM nginx:1.19.4-alpine

# Nginx Config
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY docker/ssl/ /etc/nginx/

# Let's Encrypt
WORKDIR /usr/src/svaefh-letsencrypt
COPY ./docker/letsencrypt/* ./

# Create svaefh directory
WORKDIR /usr/src/svaefh

# Bundle svaefh Source
COPY ./web/ .
RUN chown -R nginx .
