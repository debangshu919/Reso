# Stage 1

FROM node:18 AS builder

WORKDIR /build

COPY package*.json ./
RUN npm install

COPY locales locales
COPY src src
COPY scripts scripts
COPY prisma prisma
COPY tsconfig.json ./
    
RUN npm run prisma
RUN npm run build

# Stage 2

FROM node:18 AS runner

WORKDIR /reso

RUN npm install -g pm2

COPY --from=builder build/package*.json ./
COPY --from=builder build/node_modules ./node_modules
COPY --from=builder build/dist ./dist
COPY --from=builder build/locales ./locales
COPY --from=builder build/scripts ./scripts
COPY --from=builder build/src ./src

# ENV TOKEN=${TOKEN}
# ENV CLIENT_ID=${CLIENT_ID}
# ENV DEFAULT_LANGUAGE=${DEFAULT_LANGUAGE}
# ENV PREFIX=${PREFIX}
# ENV OWNER_IDS=${OWNER_IDS}
# ENV GUILD_ID=${GUILD_ID}
# ENV TOPGG=${TOPGG}
# ENV KEEP_ALIVE=${KEEP_ALIVE}
# ENV LOG_CHANNEL_ID=${LOG_CHANNEL_ID}
# ENV LOG_COMMANDS_ID=${LOG_COMMANDS_ID}
# ENV BOT_STATUS=${BOT_STATUS}
# ENV BOT_ACTIVITY_TYPE=${BOT_ACTIVITY_TYPE}
# ENV BOT_ACTIVITY=${BOT_ACTIVITY}
# ENV DATABASE_URL=${DATABASE_URL}
# ENV AUTO_NODE=${AUTO_NODE}
# ENV SEARCH_ENGINE=${SEARCH_ENGINE}
# ENV GENIUS_API=${GENIUS_API}
# ENV NODES=${NODES}

CMD ["pm2-runtime", "dist/index.js", "--name", "reso"]