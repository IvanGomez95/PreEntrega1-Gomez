
FROM node:20.12.2


WORKDIR /app


COPY package.json .


RUN npm install

RUN npm install bcryptjs

COPY . .

EXPOSE 8080

CMD ["npm", "start"]
