FROM nginx:latest

EXPOSE 80

# Non-interactive environment
RUN echo 'debconf debconf/frontend select Noninteractive' | debconf-set-selections

RUN apt-get -qq update

RUN apt-get -qq install git -y

RUN apt-get -qq install nodejs -y
RUN ln -s /usr/bin/nodejs /usr/bin/node

RUN apt-get -qq install curl -y
RUN curl -q https://www.npmjs.com/install.sh | npm_install=2.14.18 sh

RUN npm install gulp -g

COPY . /app/
WORKDIR "/app"

RUN mv src/js/config.docker.js src/js/config.local.js

RUN npm install
RUN gulp production

COPY nginx.conf /etc/nginx/nginx.conf

ENTRYPOINT ["nginx", "-g", "daemon off;"]