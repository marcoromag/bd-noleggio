#! /bin/bash
pushd webapp;
npm run build && cp -fr build ../html/noleggio/webapp
popd;

pushd dockerimage
rm -fr build
mkdir build
cp -fr ../html build/html
cp -fr ../db build/db
docker build -t romagnuolo/noleggio . 
popd
