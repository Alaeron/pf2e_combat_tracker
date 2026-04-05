# ========== BUILDER ==========
FROM node:24-alpine@sha256:01743339035a5c3c11a373cd7c83aeab6ed1457b55da6a69e014a95ac4e4700b AS builder

WORKDIR /app
RUN --mount=type=bind,source=./package.json,target=./package.json \
    --mount=type=bind,source=./package-lock.json,target=./package-lock.json \
    npm ci
COPY . .
RUN npm run build && \
    npm prune --production && \
    find build -name "*.map" -delete

# ========== PROD ==========
FROM node:24-alpine@sha256:01743339035a5c3c11a373cd7c83aeab6ed1457b55da6a69e014a95ac4e4700b AS prod

WORKDIR /app
COPY --from=builder --chown=node:node /app/build build/
COPY --from=builder --chown=node:node /app/node_modules node_modules/
COPY --from=builder --chown=node:node package*.json ./

EXPOSE 3000
ENV NODE_ENV=production
USER node

CMD ["node", "build"]

# ========== LOCAL ==========
FROM node:24-bookworm-slim@sha256:06e5c9f86bfa0aaa7163cf37a5eaa8805f16b9acb48e3f85645b09d459fc2a9f AS local

WORKDIR /app
RUN apt-get update && \
    DEBIAN_FRONTEND=noninteractive \
    apt-get install -y --no-install-recommends \
        nano \
        openssh-client \
    && rm -rf /var/lib/apt/lists/*

EXPOSE 4173 5173
USER node

CMD ["npm", "run", "dev"]
