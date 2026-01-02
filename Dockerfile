FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN npm install -g knex nodemon

COPY . .

EXPOSE 4000

# Only run migrations on startup, NOT seeds
CMD ["sh", "-c", "npm run db:migrate && npm start"]
