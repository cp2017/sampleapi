#!/bin/bash

if [ ! -d ${ETH_DATADIR} ];then
    echo "[EE] Missing data directory '${ETH_DATADIR}'"
    exit 1
else
    echo "[II] Content of '${ETH_DATADIR}'"
    find ${ETH_DATADIR} -type f
fi

mv server.js server.js.orig
set -x
cat server.js.orig \
  |sed -e "s#ethAddress = ''.*#ethAddress = '${ETH_ADDR}';#" \
  |sed -e "s#ethDataDir = ''.*#ethDataDir = '${ETH_DATADIR}';#" \
  |sed -e "s#ethPassword = ''.*#ethPassword = '${ETH_PW}';#" > server.js

ln -s ${ETH_DATADIR} ${HOME}/.ethereum
npm start
if [ "X${HANG_IN_THERE}" == "Xtrue" ];then
    tail -f /dev/null
fi
