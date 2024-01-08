FROM oven/bun:1 as base
WORKDIR /usr/src/app

COPY ./scripts/prepare ./scripts/
COPY package.json bun.lockb ./

RUN bun install --frozen-lockfile --production

COPY . .

USER bun
EXPOSE 3000/tcp
ENTRYPOINT [ "bun", "run", "." ]
