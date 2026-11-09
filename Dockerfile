FROM node:24-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
ENV PORT=8787 DATABASE_PATH=/data/cc.sqlite
VOLUME ["/data"]
EXPOSE 8787
CMD ["node", "server/index.mjs"]
