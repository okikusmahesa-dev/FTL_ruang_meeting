FROM node:18-alpine

# Install MySQL client and dependencies
RUN apk add --no-cache mysql-client

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
  CMD node healthcheck.js || exit 1

CMD ["npm", "start"]