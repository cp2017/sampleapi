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
Before running this application, make sure the following variable are set up for your needs:
```javascript
var logging = true;         // set to true to enable logging
var ethAddress = '';        // your ethereum account address or '' if your default account should be used
var ethDataDir = '';        // your ethereum data directory or '' if your the default location ~/.ethereum/ should be used.
var ethPassword = '';       // your ethereum account password
var requestUrl = 'http://localhost:3000/api/ping';    // the url of the message receiver
var messageBody = 'Ping!';  // The message to sign and send in the request
```

4. Run sender
-------------
Start the client by running ```npm run start```.
If everything is set up correctly, you should receive ```{message:'Pong!'}``` as a response, otherwise there will be an error.
