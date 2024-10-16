
FROM node


WORKDIR /app


COPY package.json .


RUN npm install

RUN npm install bcryptjs

COPY . .

EXPOSE 8080

CMD ["npm", "start"]
