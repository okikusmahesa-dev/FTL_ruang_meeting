FROM node:18-alpine

WORKDIR /app

# Install dependencies first for better caching
COPY package.json package-lock.json ./
RUN npm install

# Copy all files
COPY . .

EXPOSE 3000

# Special config for Docker development
ENV CHOKIDAR_USEPOLLING=true
ENV WDS_SOCKET_PORT=3000

CMD ["npm", "start"]