// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express         =   require('express');        // call express
var app             =   express();                 // define our app using express
var bodyParser      =   require('body-parser');
var cp2017sign      =   require('cp2017sign');
var subscribersList =   getSubscribersFromWebapp();

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 3000;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
    var url = req.url;
    if(url.endsWith("monitor")){
        console.log("Monitor request arrived.");
        next();
        return;
    }
    console.log(req.url);

    // do logging
    console.log('Request came in, trying to verify it.');

    if(req.get("marketplace-signature")!=undefined){
    
    /*
        Convert signature string back to object
     */
    var marketplacesignaturestring = req.get('marketplace-signature') || '';
    var marketplacesignature = cp2017sign.signatureFromBase64String(marketplacesignaturestring)
    var body = req.body.message || '';

    if(subscribersList.indexOf(marketplacesignature.publicKey.toString('hex')) !== -1)
    {
    	var result = cp2017sign.verifySignature(body, marketplacesignature);
    	console.log(result);
    	if(result === true)
    	{
    		next() // make sure we go to the next routes and don't stop here
    	}
    	else {
            if(result instanceof Error){
                res.status(500).send(result.message)
            } else {
                res.status(500).send("Verification failed!")
            }
        }
    }
    else res.status(500).send("You are not subscribed to this service!");
	}
	else res.status(500).send("Undefined request!");
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

router.route('/monitor').all(function(req, res){
    res.status(200).send("Thanks for monitoring!");
});

router.route('/ping')
	//return a pong if it was a GET request
	.get(function(req,res)
	{
		res.json({message:'Pong!'});
	})

	//return a pong if it was a POST request
	.post(function(req,res)
	{
		res.json({message:'Pong!'});
	})

	//return a pong if it was a PUT request
	.put(function(req,res)
	{
		res.json({message:'Pong!'});
	});

// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// FUNCTION TO GET THE SUBSCRIBERS FOR OUR MICROSERVICE -----------
// for now a dummy list of hex string public keys, TODO: Query the webapp for the real list
function getSubscribersFromWebapp()
{
	return ["f77b1502bb6d5ddec3f174fb23dda9a033737c442f29c23e9b3211746fcf306f69126abf2a30f10cab88c001ba9d91757a069984765c4a74a00653ce8c2adff2"];
}
// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Connection opened on port ' + port);