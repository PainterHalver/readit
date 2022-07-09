FROM node:16

WORKDIR /home/app

COPY . .

# Node.js Backend Api
RUN npm install
RUN npm run build

# Next.js Frontend App
WORKDIR /home/app/client

RUN npm install

# Next.js needs to have env variables set before build time.
ENV NEXT_PUBLIC_SERVER_BASE_URL=http://localhost
ENV NEXT_PUBLIC_CLIENT_BASE_URL=http://localhost
ENV APP_DOMAIN=localhost
RUN npm run build

WORKDIR /home/app

CMD [ "npm", "run", "start:both" ]