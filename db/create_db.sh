#! /bin/bash 

echo "Create DB"
mysql -u root < 01-schema.sql || exit -1
echo "load dump"
mysql -u root noleggio < 02-video.dump || exit -1
echo "post dump"
mysql -u root noleggio < 03-post-dump.sql || exit -1
