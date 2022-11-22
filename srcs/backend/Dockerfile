FROM node:18-alpine

ENV TZ=Europe/Paris

RUN apk add --update tzdata
RUN npm install -g npm

# Create app directory
WORKDIR /usr/src/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
# COPY package*.json ./

# Install app dependencies
# RUN npm install

COPY entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh

CMD [ "/entrypoint.sh" ]
