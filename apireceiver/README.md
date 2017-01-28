# How To
First of all, you will have to download or clone this repository.
Then, follow these steps to set up the receiver:

1. Required software
--------------------
In order to run this project you need to have [Node.js](https://docs.npmjs.com/getting-started/installing-node) installed.
This way you will have **npm** installed automatically which you will need for running the sample.

2. Installation
---------------
From this folder in your command line, run ```npm install``` to install the project dependencies on your machine.

3. Configuration
----------------
In case you do not want to use the sample server to run on the default port 3000, change the following line in the server.js file.
```javascript
var port = process.env.PORT || 3000;        // set our port
```
Then, enter all "authorized" ethereum public keys as hex strings into the subscribersList array, e.g. like this:
```javascript
subscribersList.push("2bb6d5d74fb23d033737c442f29c23e9b3211746fcf306f69a74a00653ce8c2adff2");
```
One way to get your ethereum public key is to use our [cp2017sign](https://www.npmjs.com/package/cp2017sign) project built upon the libraries ethereumjs-util and keythereum.


4. Run server
-------------
Start the server by running ```npm run start```.
After a short time, the server will be ready to listen for requests at the specified port.

5. Sign your request
-------------------
Before sending your request, you need to sign it so this receiver can verify the integrity of your message and identify you as an authorized user.
For this receiver, we created the [apisender](https://github.com/cp2017/sampleapi/tree/master/apisender) in this project which performs the signature process for you. If you want to do it yourself, please follow this description:

We recommend to use the [cp2017sign](https://www.npmjs.com/package/cp2017sign) package to open your ethereum private key and sign the message.
The signature object you get from the library looks similar to this:
```javascript
{
  s: <Buffer>,
  r: <Buffer>,
  v: <Number>
}
```
Now convert the "r" and "s" Buffers into hex strings and add the public key as hex string to the object, so it finally looks like this:
```javascript
{
  s: <String>,
  r: <String>,
  v: <Number>,
  publicKey: <String>
}
```
Finally, convert this object into a base64-encoded string and add that string to your request header using the key 'marketplace-signature'.

6. Make calls to the sample api
-------------------------------
The API currently has one single endpoint, which is ```/api/ping```.
So if you run the sample using the default configuration, you can call it using HTTP GET / POST / PUT to:
```
http://localhost:3000/api/ping
```
**NOTE: in the current version it is assumed that you send either no body at all or a form containing "message" as a key and the message you used to sign the request as a value.**
If your request is signed correctly, you should receive ```{message:'Pong!'}``` as a response, otherwise there will be an error.
