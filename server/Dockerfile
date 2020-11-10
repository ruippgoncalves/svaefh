FROM node:14

# Create svaefh directory
WORKDIR /usr/src/svaefh

# Install svaefh Server Dependencies
COPY package*.json ./
RUN npm install --only=production

# Bundle svaefh Source
COPY . .

# Expose Port and Start Server
EXPOSE 3000
CMD [ "npm", "start" ]
