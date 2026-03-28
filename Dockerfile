FROM node:20-alpine AS node_modules
WORKDIR /app
COPY package.json package-lock.json ./
COPY apps/web/package.json ./apps/web/
RUN npm install

FROM node_modules AS prod_builder
COPY . .
RUN npm run build

## Production image
FROM nginx:1.26-alpine AS prod
COPY docker/etc/nginx/nginx.conf /etc/nginx/nginx.conf
COPY docker/etc/nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf
COPY --from=prod_builder /app/apps/web/dist /usr/share/nginx/html
COPY docker/build_system.sh .
RUN ./build_system.sh && rm ./build_system.sh
# port used by Nginx within docker network.
EXPOSE 8080
USER reactle

## Development image
FROM node_modules AS dev
EXPOSE 3000
CMD npm run web
