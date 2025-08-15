FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN apk add --no-cache mysql-client
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
