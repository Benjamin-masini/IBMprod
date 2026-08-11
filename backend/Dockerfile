# Backend Dockerfile

FROM node:18-alpine
WORKDIR /usr/src/app

# install dependencies
COPY backend/package.json backend/package-lock.json ./
RUN npm ci --only=production

# copy source
COPY backend/src ./src
COPY backend/uploads ./uploads

EXPOSE 3000

ENV NODE_ENV=production
CMD ["node", "src/server.js"]
