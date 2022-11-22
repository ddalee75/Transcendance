FROM nginx:alpine

RUN apk add openssl \
    && openssl req -new				\
		-newkey rsa:4096			\
		-x509						\
		-sha256						\
		-days 365					\
		-nodes						\
		-out /etc/nginx/cert.crt	\
		-keyout /etc/nginx/cert.key	\
		-subj "/C=FR/ST=France/L=Paris/O=42/CN=anclarma"

COPY nginx.conf /etc/nginx/conf.d/default.conf
