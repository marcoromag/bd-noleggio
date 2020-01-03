#! /bin/bash
rm -fr dockerimage/build
rm -fr server/webapp

pushd webapp;
npm run build && cp -fr build ../server/webapp
popd;

pushd dockerimage
rm -fr build
mkdir build
cp -fr ../server build/server
cp -fr ../db build/db
docker build -t romagnuolo/noleggio . 
popd
