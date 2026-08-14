# ========== BUILDER ==========
FROM node:25-alpine@sha256:ad82ecad30371c43f4057aaa4800a8ed88f9446553a2d21323710c7b937177fc AS builder

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
FROM node:25-alpine@sha256:ad82ecad30371c43f4057aaa4800a8ed88f9446553a2d21323710c7b937177fc AS prod

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
FROM node:25-bookworm-slim@sha256:435f3537a088a01fd208bb629a4b69c28d85deb9a60af8a710cafc3befd6e3be AS local

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
