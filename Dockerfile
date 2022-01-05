# build stage
FROM node:8.3.0
WORKDIR /app
COPY . .
RUN npm cache clean --force
RUN npm install
EXPOSE 3000
CMD ["npm", "run", "dev"]

