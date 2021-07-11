#!/bin/bash
# docker container stop nginx_fanderl_rocks
# docker container rm nginx_fanderl_rocks
# docker build -t nginx_fanderl_rocks .
# docker run --name nginx_fanderl_rocks -p 80:80 -d nginx_fanderl_rocks

docker container stop nginx_fanderl_rocks
docker container rm nginx_fanderl_rocks
docker run --name nginx_fanderl_rocks --mount type=bind,source="$(pwd)"/content,target=/usr/share/nginx/html,readonly -p 80:80 -d nginx