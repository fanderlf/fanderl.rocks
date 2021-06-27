docker container stop nginx_fanderl_rocks
docker container rm nginx_fanderl_rocks
docker run --name nginx_fanderl_rocks --mount type=bind,source="$(pwd)"/content,target=/usr/share/nginx/html,readonly --mount type=bind,source="$(pwd)"/nginx_conf,target=/etc/nginx/conf,readonly -p 80:80 -d nginx