FROM node:20.6.1

WORKDIR /frontend

COPY package.json ./

RUN npm install

COPY . .

RUN npm run build

CMD ["npm", "run", "start"]