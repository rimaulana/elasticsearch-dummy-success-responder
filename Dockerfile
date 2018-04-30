FROM node:alpine
WORKDIR /usr/local/data
COPY . .
RUN npm install --only=prod
EXPOSE 3000
CMD ["npm","run","server"]