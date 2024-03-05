FROM node:20.11.1
WORKDIR /app
COPY package.json ./
RUN apt-get update
RUN npm install
COPY . ./
EXPOSE 3000
CMD ["npm","run","start"]
