FROM node:18-alpine

WORKDIR /app

# Install dependencies dulu
COPY package*.json ./
RUN npm install

# Copy semua source code
COPY . .

# React dev server akan jalan di port 3000
EXPOSE 3000

CMD ["npm", "start"]
