FROM node:6.9.2

ENV ETH_ADDR=http://localhost:8545 \
    ETH_SRV_URL=http://localhost:3000/api/ping \
    ETH_DATADIR=/var/lib/ \
    HANG_IN_THERE=false
WORKDIR /opt/apisender/
RUN npm install request
COPY . /opt/apisender/
RUN npm install
CMD ["/opt/apisender/start.sh"]
