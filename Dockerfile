FROM node:24-bookworm-slim

WORKDIR /usr/src/app

COPY fe /usr/src/app/fe
COPY be /usr/src/app/be

WORKDIR /usr/src/app/fe
RUN npm i


WORKDIR /usr/src/app/be
RUN npm i
RUN npm run build

EXPOSE 3000
CMD ["npm", "run", "start"]