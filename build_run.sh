#!/usr/bin/env bash

docker build -t cvfactory . && docker run -p 80:80 -v "$(PWD)/index.js":/cvfactory/index.js -ti --rm cvfactory yarn run serve
