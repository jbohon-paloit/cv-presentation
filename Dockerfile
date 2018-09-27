FROM node:8

COPY package.json /cvfactory/package.json
WORKDIR /cvfactory
ADD https://github.com/jgm/pandoc/releases/download/2.2.1/pandoc-2.2.1-linux.tar.gz /pandoc
#COPY pandoc-2.2.1-linux /pandoc
ENV PATH /pandoc/bin:$PATH
# Getting last version of yarn can cause a 'yarn: Permission denied' error
# Not needed, yarn is included in the node image
# RUN apt-get update && apt-get -y install libssl-dev && apt-get -y install nodejs npm && npm install -g yarn && apt-get -y clean
RUN apt-get update && apt-get -y install libssl-dev && apt-get -y clean
# RUN echo $(ls -l /usr/lib/x86_64-linux-gnu/libcurl*)
RUN yarn install
RUN yarn global add nodemon
VOLUME /keys
COPY config ./config
COPY encrypted ./encrypted
COPY src ./src
COPY index.js .
