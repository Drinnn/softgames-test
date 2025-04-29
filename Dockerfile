FROM node:20-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    openjdk-17-jdk-headless \
    && rm -rf /var/lib/apt/lists/*

RUN npm install -g firebase-tools

COPY . .

RUN npm install -C functions
RUN npm install -C admin
RUN cd functions && npm run build
RUN cd admin && npm run build

RUN chmod +x entrypoint.sh

EXPOSE 5000 5001 5002 5003 5004 9099

ENTRYPOINT ["/app/entrypoint.sh"] 