# build stage
FROM node:8.3.0
WORKDIR /app
COPY ./package*.json .
RUN npm i
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]

