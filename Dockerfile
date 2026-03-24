FROM node:20
WORKDIR /usr/src/app

COPY build/bundle.js ./

EXPOSE 8080
CMD [ "node",  "./bundle.js" ]