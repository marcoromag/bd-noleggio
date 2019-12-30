#! /bin/bash
cp -fr html dockerimage/
docker build -t romagnuolo/lamp ./dockerimage
docker run --name=mr-lamp -dP -v $PWD/html:/var/www/html -p 8090:80 -p 3309:3306 romagnuolo/lamp
