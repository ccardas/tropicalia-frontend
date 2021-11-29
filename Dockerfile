FROM mhart/alpine-node:16.4.2 AS builder

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm i

COPY . .

RUN npm run build

# Stage 2: And then copy over node_modules, etc from that stage to the smaller base image
FROM mhart/alpine-node:16.4.2 as production

WORKDIR /app

COPY next.config.js .env* ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

CMD ["node_modules/.bin/next", "start", "-p", "3000"]