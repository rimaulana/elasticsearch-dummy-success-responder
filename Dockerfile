FROM node:alpine
WORKDIR /usr/local/data
COPY . .
RUN npm install
EXPOSE 9200
CMD ["npm","run","server"]