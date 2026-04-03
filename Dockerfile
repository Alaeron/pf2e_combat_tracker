FROM node:24-alpine AS dev

WORKDIR /app

CMD ["npm", "run", "dev"]
