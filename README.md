# sampleapi [![Build Status](http://ec2-54-194-144-141.eu-west-1.compute.amazonaws.com/api/badges/cp2017/sampleapi/status.svg)](http://ec2-54-194-144-141.eu-west-1.compute.amazonaws.com/cp2017/sampleapi)
A Sample API Server that replies with Pong! on every GET, POST and PUT request.
It checks if the public key sent is in the list of subscribers, and then verifies the message.

# How To Use
The local setup of the sender and receiver can be found in a readme file in their respective folder.

# Testcase

In order to run a test a compose file can be found in the sender directory.

```
geth:
    image: cp2017/geth:2017-01-26.02
    container_name: geth
    net: host
    environment:
      - GETH_TEST_DATABASE=true
      - GETH_BOOTSTRAP=false
apireceiver:
    image: cp2017/apireceiver
    container_name: apireceiver
    net: host
    volumes_from:
      - geth
apisender:
    image: cp2017/apisender
    container_name: apisender
    net: host
    volumes_from:
      - geth
    environment:
      - ETH_PW=pw0
      - ETH_DATADIR=/data/db
      # if you want the container to stick around and not exit after it failed
      - HANG_IN_THERE=false
```

## Start geth and receiver

```
$ docker-compose up -d geth apireceiver
Creating geth
Creating apireceiver
```

Now the apisender can be started without detaching.

```
$  compose up apisender ; compose rm -fgeth is up-to-date
Creating apisender
Attaching to apisender
apisender      | [II] Content of '/data/db'
apisender      | /data/db/history
apisender      | /data/db/geth/chaindata/CURRENT
apisender      | /data/db/geth/chaindata/000025.ldb
apisender      | /data/db/geth/chaindata/000014.ldb
apisender      | /data/db/geth/chaindata/LOCK
apisender      | /data/db/geth/chaindata/000020.ldb
apisender      | /data/db/geth/chaindata/000015.ldb
apisender      | /data/db/geth/chaindata/MANIFEST-000029
apisender      | /data/db/geth/chaindata/LOG
apisender      | /data/db/geth/chaindata/000028.log
apisender      | /data/db/geth/nodekey
apisender      | /data/db/geth/LOCK
apisender      | /data/db/keystore/UTC--2017-01-25T15-14-16.777862486Z--d377309039bd53fb811040417311029970ec8335
apisender      | + cat server.js.orig
apisender      | + sed -e 's#ethPassword = '\'''\''.*#ethPassword = '\''pw0'\'';#'
apisender      | + sed -e 's#ethDataDir = '\'''\''.*#ethDataDir = '\''/data/db'\'';#'
apisender      | + sed -e 's#ethAddress = '\'''\''.*#ethAddress = '\''http://localhost:8545'\'';#'
apisender      | + ln -s /data/db /root/.ethereum
apisender      | + npm start
apisender      | npm info it worked if it ends with ok
apisender      | npm info using npm@3.10.9
apisender      | npm info using node@v6.9.2
apisender      | npm info lifecycle apisender@1.0.0~prestart: apisender@1.0.0
apisender      | npm info lifecycle apisender@1.0.0~start: apisender@1.0.0
apisender      |
apisender      | > apisender@1.0.0 start /opt/apisender
apisender      | > node server.js
apisender      |
apisender      | Private key: Error: could not find key file for address http://localhost:8545
apisender      | Public key: Error: invalid type
apisender      |
apisender      | unable to sign body. Check private key and public key.
apisender      | npm info lifecycle apisender@1.0.0~poststart: apisender@1.0.0
apisender      | npm info ok
apisender      | + '[' Xfalse == Xtrue ']'
apisender exited with code 0
Going to remove apisender
Removing apisender ... done
```
To let the container stick around for debugging, set `HANG_IN_THERE=true` and exec the container like this.

```
$ docker exec -ti apisender bash
```
