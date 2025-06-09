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
RUN npm run deploy

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

CMD ["pm2-runtime", "dist/index.js", "--name", "reso"]