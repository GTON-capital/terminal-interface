FROM node:14.18.1
WORKDIR /app
COPY ./package*.json .
COPY . .
RUN npm i
EXPOSE 3000
CMD ["npm", "run", "dev"]

