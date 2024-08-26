# Development
FROM node:20-alpine AS development
ENV NODE_ENV=development
EXPOSE 9229
# Set global npm dependencies to be stored under the node user directory
ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
ENV PATH=$PATH:/home/node/.npm-global/bin

RUN apk update && \
    apk add --no-cache git

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

# Install Chromium
RUN apk add --no-cache \
    chromium \
    chromium-chromedriver \
    freetype \
    harfbuzz \
    nss \
    ttf-freefont

USER node
WORKDIR /home/node
COPY --chown=node:node package*.json ./
RUN npm install --production=false
COPY --chown=node:node ./app ./app
CMD [ "npm", "run", "start:watch" ]

# Production
FROM development AS production
ENV NODE_ENV=production
RUN npm ci
CMD [ "node", "app" ]
