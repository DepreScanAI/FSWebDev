# install production dependensi
FROM node:20-alpine AS deps

WORKDIR /app

COPY package.json package-lock.json .npmrc ./

RUN npm ci --omit=dev

# step 2 build the final image
FROM node:20-alpine AS runner

RUN apk add --no-cache dumb-init

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules

COPY src/ ./src/
COPY migrations/ ./migrations/
COPY package.json ./

RUN chown -R appuser:appgroup /app

USER appuser

ENV NODE_ENV=production

EXPOSE 8080

CMD ["dumb-init", "sh", "-c", "npm run migrate up && node src/server.js"]
