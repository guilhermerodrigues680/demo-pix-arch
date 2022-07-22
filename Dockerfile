FROM node:14.19.3-alpine3.16

RUN apk add --no-cache nginx
COPY nginx.conf /etc/nginx/

WORKDIR /usr/src/app/backend
COPY backend/package*.json ./
RUN npm ci --only=production
COPY backend/ ./

WORKDIR /usr/src/app/bank-api
COPY bank-api/package*.json ./
RUN npm ci --only=production
COPY bank-api/ ./

WORKDIR /usr/src/app/frontend
COPY frontend/ ./

WORKDIR /root

EXPOSE 80 12001 12002

ENTRYPOINT []

COPY start.sh /root/
RUN chmod +x /root/start.sh

# CMD ["sh","-c","nginx -g 'daemon off' && node /usr/src/app/bank-api/index.js"]
CMD ["/root/start.sh"]
