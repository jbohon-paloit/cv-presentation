FROM ubuntu

ADD package.json /cvfactory/package.json
WORKDIR /cvfactory
RUN apt-get update && apt-get -y install nodejs npm && npm install -g yarn && apt-get -y clean 
RUN yarn install
ADD config ./config
ADD index.js .



