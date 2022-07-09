FROM node:16

WORKDIR /home/app

COPY . .

RUN npm install
RUN npm run build

WORKDIR /home/app/client

RUN npm install
RUN npm run build

WORKDIR /home/app

CMD [ "npm", "run", "start:both" ]