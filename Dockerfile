FROM node:20-alpine AS node_modules
WORKDIR /app
COPY package.json package-lock.json ./
COPY packages/game-core/package.json ./packages/game-core/
COPY apps/web/package.json ./apps/web/
RUN npm install

FROM node_modules AS prod_builder
COPY . .
RUN npm run build

## Development image
FROM node_modules AS dev
EXPOSE 3000
CMD npm run web

## Production image
FROM nginx:1.26-alpine AS prod
COPY docker/etc/nginx/nginx.conf /etc/nginx/nginx.conf
COPY docker/etc/nginx/conf.d/default.conf.template /etc/nginx/templates/default.conf.template
COPY --from=prod_builder /app/apps/web/dist /usr/share/nginx/html
# Default port for local Docker; Heroku overrides via $PORT env var
ENV PORT=8080
EXPOSE 8080
