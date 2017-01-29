#!/bin/bash

docker-compose ps geth >>/dev/null
WAIT=0
if [ $? -ne 0 ]; then
    WAIT=1
    echo "[II] Start geth"
    docker-compose up -d geth
fi
docker-compose ps apireceiver >>/dev/null
if [ $? -ne 0 ]; then
    echo "[II] Start apireceiver"
    docker-compose up -d apireceiver
    WAIT=1
fi
if [ ${WAIT} -eq 1 ];then
    echo "[II] Wait for dependencies to settle"
    sleep 10
fi
docker-compose up apisender
docker-compose rm -f
