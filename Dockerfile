# ========== BASE ==========
FROM node:24-alpine@sha256:01743339035a5c3c11a373cd7c83aeab6ed1457b55da6a69e014a95ac4e4700b AS base

WORKDIR /app

EXPOSE 5173
USER node

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
