FROM node:24-bookworm-slim

WORKDIR /usr/src/app

WORKDIR /usr/src/app/fe
COPY fe/package.json fe/package-lock.json ./

RUN npm i


WORKDIR /usr/src/app/be
COPY be/package.json be/package-lock.json ./
RUN npm i
COPY be /usr/src/app/be
COPY fe /usr/src/app/fe
RUN npm run build

WORKDIR /usr/src/app
COPY docker_run.sh .
EXPOSE 3000
CMD ["sh", "docker_run.sh"]

ENV NEXT_TELEMETRY_DISABLED=1
ENV CLOUDFLARE_ACCOUNT_ID d6d9543f56b04f6c3aed985ede8f2adc