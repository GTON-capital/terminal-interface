# build stage
FROM node:8.3.0
WORKDIR /app
COPY . .
RUN npm i
EXPOSE 3000
CMD ["npm", "run", "dev"]

