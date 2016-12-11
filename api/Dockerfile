FROM node:alpine

RUN mkdir -p /app/service

WORKDIR /app/service
ADD . .
RUN npm install --loglevel=warn

EXPOSE 9000

CMD npm start
