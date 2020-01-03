#! /bin/bash
docker run --name=noleggio -dP -v $PWD/server/api:/usr/share/noleggio/api -v $PWD/webapp/build:/usr/share/noleggio/webapp -p 8090:80 -p 3309:3306 romagnuolo/noleggio
