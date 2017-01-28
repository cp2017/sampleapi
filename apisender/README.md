# How To
First of all, you will have to download or clone this repository.
Then, follow these steps to set up the sender:

1. Required software
--------------------
In order to run this project you need to have [Node.js](https://docs.npmjs.com/getting-started/installing-node) installed.
This way you will have **npm** installed automatically which you will need for running the sample.

2. Installation
---------------
From this folder in your command line, run ```npm install``` to install the project dependencies on your machine.

3. Configuration
----------------
TBD
One way to get your ethereum public key is to use our [cp2017sign](https://www.npmjs.com/package/cp2017sign) project built upon the libraries ethereumjs-util and keythereum.

4. Run sender
-------------
Start the client by running ```npm run start```.
If everything is set up correctly, you should receive ```{message:'Pong!'}``` as a response, otherwise there will be an error.
