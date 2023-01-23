FROM node:19-alpine

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY package*.json ./

RUN npm install -g npm@9.3.1

USER node

COPY --chown=node:node . .

EXPOSE 80

CMD [ "node", "index.js" ]
