#!/usr/bin/env bash

docker build -t cvfactory . && docker run -ti --rm cvfactory node .

