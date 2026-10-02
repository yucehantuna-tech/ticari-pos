FROM node:22-alpine
WORKDIR /app
COPY ai-ortak/core ./core
COPY ai-ortak/server ./server
COPY ai-ortak/index.html ./index.html
COPY ai-ortak/app.js ./app.js
COPY ai-ortak/style.css ./style.css
WORKDIR /app/server
ENV PORT=8787
EXPOSE 8787
CMD ["npm","start"]