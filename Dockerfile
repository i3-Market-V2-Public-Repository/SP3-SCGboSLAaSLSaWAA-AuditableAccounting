FROM node:16 as builder

WORKDIR /app

COPY --chown=node package*.json ./

RUN npm ci

COPY . .

RUN npm run build &&\
  npm prune --production

FROM node:16

WORKDIR /app

COPY --from=builder /app/dist dist
COPY --from=builder /app/public public
COPY --from=builder /app/node_modules node_modules

EXPOSE 3000

CMD ["dist"]
