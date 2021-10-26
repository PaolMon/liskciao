# Dockerfile - this is a comment. Delete me if you want.
FROM node:12
WORKDIR /usr/src/app
COPY . .
RUN npm install --global lisk-commander@5.1.4
RUN npm install
EXPOSE 5000
ENTRYPOINT ["./bin/run"]
CMD ["start"]