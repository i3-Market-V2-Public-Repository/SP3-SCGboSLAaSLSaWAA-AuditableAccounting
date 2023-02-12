FROM node:16-alpine as builder

WORKDIR /app

COPY --chown=node package*.json ./

RUN apk update &&\
    apk upgrade &&\
    npm ci

COPY . .

RUN npm run build &&\
    npm prune --omit=dev

FROM node:16-alpine

WORKDIR /app

COPY --from=builder /app/dist dist
COPY --from=builder /app/public public
COPY --from=builder /app/node_modules node_modules

RUN apk update &&\
    apk upgrade &&\
    npm i -g npm

EXPOSE 3000

CMD ["dist"]
