From node:latest

LABEL autor="kg"

WORKDIR /app

COPY package.json package-lock.json .

RUN npm ci

COPY server.js .

COPY ../ .

EXPOSE 4000

ENTRYPOINT ["node","server.js"]


# docker build -f Dockerfile -t chat_node .

# docker run --name chat_server -p 4000:4000 chat_node

# network로 묶을 경우
# docker run --name chat_server --network chat -p 4000:4000 chat_node