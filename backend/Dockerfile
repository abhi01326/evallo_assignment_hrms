FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .

EXPOSE 3000
ENV NODE_ENV=production
CMD ["node", "src/index.js"]
