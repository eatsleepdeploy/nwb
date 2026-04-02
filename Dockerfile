FROM node:24-bookworm-slim

WORKDIR /usr/src/app

COPY fe /usr/src/app/fe

WORKDIR /usr/src/app/fe
RUN npm i


WORKDIR /usr/src/app/be
COPY be /usr/src/app/be
RUN npm i
RUN npm run build

WORKDIR /usr/src/app
COPY docker_run.sh .
EXPOSE 3000
CMD ["sh", "docker_run.sh"]

ENV NEXT_TELEMETRY_DISABLED=1