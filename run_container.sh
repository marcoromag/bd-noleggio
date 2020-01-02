#! /bin/bash
docker run --name=noleggio -dP -v $PWD/html/noleggio:/usr/share/noleggio -p 8090:80 -p 3309:3306 romagnuolo/noleggio
