# ========== BASE ==========
FROM node:24-alpine AS base

WORKDIR /app

EXPOSE 5173

# ========== LOCAL ==========
FROM base AS local

EXPOSE 4173

CMD ["npm", "run", "dev"]
