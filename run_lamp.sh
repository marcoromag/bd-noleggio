sudo docker run --name=lamp -dP -v $PWD/html:/var/www/html linuxconfig/lamp -P 80:8090 -P 3306:3309
