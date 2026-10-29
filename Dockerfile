# ========== BUILDER ==========
FROM node:26-alpine@sha256:c6ad9e9c1d80f6eb607c26b4b0a132ff7a2344fad1c78ea3baa2a7d4c8de6d94 AS builder

WORKDIR /app

RUN --mount=type=bind,source=./package.json,target=./package.json \
    --mount=type=bind,source=./package-lock.json,target=./package-lock.json \
    npm ci

COPY src/ src/
COPY static/ static/
COPY package.json package-lock.json vite.config.ts svelte.config.js  tsconfig.json drizzle.config.ts /app/

ENV DB_URL /data/data.db
RUN npm run build && \
    npm prune --production && \
    find build -name "*.map" -delete

# ========== PROD ==========
FROM node:26-alpine@sha256:c6ad9e9c1d80f6eb607c26b4b0a132ff7a2344fad1c78ea3baa2a7d4c8de6d94 AS prod

WORKDIR /app
COPY --from=builder --chown=node:node /app/build/ build/
COPY --from=builder --chown=node:node /app/node_modules/ node_modules/
COPY --from=builder --chown=node:node /app/package*.json ./
COPY --from=builder --chown=node:node /app/src/lib/server/db/migrations/ src/lib/server/db/migrations/

EXPOSE 3000
ENV NODE_ENV=production
USER node

CMD ["node", "build"]

# ========== LOCAL ==========
FROM node:26-bookworm-slim@sha256:bc0a2afd3b74ce12222fc8bab99271e66257f021078f5f4a5d687a77d280c1d9 AS local

WORKDIR /app
RUN apt-get update && \
    DEBIAN_FRONTEND=noninteractive \
    apt-get install -y --no-install-recommends \
        nano \
        sqlite3 \
        openssh-client \
        ca-certificates \
        lsb-release \
        wget \
    && rm -rf /var/lib/apt/lists/*

RUN chown -R node:node /app
EXPOSE 4173 5173
USER node

CMD ["bash", "sleep", "infinity"]

# ========== DEV ==========
FROM local AS dev

RUN --mount=type=bind,source=./package.json,target=./package.json \
    --mount=type=bind,source=./package-lock.json,target=./package-lock.json \
    npm ci

COPY --chown=node:node src/ src/
COPY --chown=node:node static/ static/
COPY --chown=node:node \
    package.json \
    package-lock.json \
    vite.config.ts \
    svelte.config.js \
    tsconfig.json \
    .pa11yci \
    .prettierignore \
    eslint.config.js \
    /app/

CMD ["npm", "run", "dev"]
