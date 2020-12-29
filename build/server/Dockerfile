FROM debian:stable-20201209-slim

# Create svaefh directory
WORKDIR /usr/src/svaefh

# Bundle svaefh Source
COPY . .

# Expose Port and Start Server
EXPOSE 3000
CMD [ "./server" ]
