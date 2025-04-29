FROM node:20-slim

WORKDIR /app

RUN npm install -g firebase-tools

COPY package.json ./
COPY functions/package.json ./functions/
COPY admin/package.json ./admin/

COPY . .

RUN npm install -C functions
RUN npm install -C admin

RUN cd functions && npm run build
RUN cd admin && npm run build

RUN npm run seed

EXPOSE 5000 5001 5002 5003 5004

CMD ["firebase", "emulators:start", "--import=./data"] 