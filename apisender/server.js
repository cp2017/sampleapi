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

    if(signature.s === undefined || signature.v === undefined || signature.r === undefined){
      console.error("unable to sign body. Check private key and public key.");
      return;
    }

    /*
      prepare signature data for sending
     */
    var s = signature.s.toString('hex');
    var r = signature.r.toString('hex');
    signature.publicKey = publicKey.toString('hex');
    if(logging == true){
      console.log("Signature object:");
      console.log(signature);
      console.log();
    }
    signature.s = s;
    signature.r = r;

    /*
      convert signature object to base64-encoded string
     */
    var signatureString = Buffer.from(JSON.stringify(signature), 'utf-8').toString('base64');
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