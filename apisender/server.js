var request = require('request');
var cp2017sign = require('cp2017sign');

var sendTestMessage = function(){
    var logging = true;
    var ethAddress = '';
    var ethDataDir = '';
    var ethPassword = '';
    var requestUrl = 'http://localhost:3000/api/ping';
    var messageBody = 'Ping!';

    var privateKey = cp2017sign.getPrivateKey(ethAddress, ethDataDir, ethPassword);
    var publicKey = cp2017sign.getPublicKey(privateKey);
    var signature = cp2017sign.sign(messageBody, privateKey);

    if(logging == true){
      console.log("Private key: " + privateKey.toString('hex'));
      console.log("Public key: " + publicKey.toString('hex'));
      console.log();
    }

    if(signature.signature === undefined || signature.recovery === undefined){
      console.error("unable to sign body. Check private key and public key.");
      return;
    }

    /*
      prepare signature data for sending
     */
    var signatureString = cp2017sign.signatureToBase64String(signature, publicKey)
    if(logging == true){
      console.log("Signature string: " + signatureString);
      console.log();
    }

    var options = {
      url: requestUrl,
      headers: {
        'marketplace-signature': signatureString,
        'Content-Type': 'x-www-form-unencoded'
      },
      form: {
        message: messageBody
      }
    };

    if(logging == true) {
      console.log("Message body: '" + messageBody + "'");
      console.log();
    }

    function callback(error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log("Response: ");
        console.log(body);
      }
      else {
        console.error("Error: ");
        console.error(error);
      }
    }

    request.post(options, callback);
}
sendTestMessage();