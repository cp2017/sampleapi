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
    // do logging
    console.log('Request came in, trying to verify it.');

    if(req.get("marketplace-signature")!=undefined){
    
    /*
        Convert signature string back to object
     */
    var marketplacesignaturestring = Buffer.from(req.get("marketplace-signature"),'base64').toString('utf-8');
    var marketplacesignature = JSON.parse(marketplacesignaturestring);
    var s = Buffer.from(marketplacesignature.s, 'hex');
    var r = Buffer.from(marketplacesignature.r, 'hex');
    var publicKey = Buffer.from(marketplacesignature.publicKey, 'hex');
    var body = req.body.message || '';
    marketplacesignature.s = s;
    marketplacesignature.r = r;
    marketplacesignature.publicKey = publicKey;

    if(subscribersList.indexOf(marketplacesignature.publicKey.toString('hex')) !== -1)
    {
    	var result = cp2017sign.verify(body, marketplacesignature.v, marketplacesignature.r, marketplacesignature.s, marketplacesignature.publicKey);
    	console.log(result);
    	if(result === true)
    	{
    		next(); // make sure we go to the next routes and don't stop here
    	}
    	else res.status(500).send("Verification failed!");
    }
    else res.status(500).send("You are not subscribed to this service!");
	}
	else res.status(500).send("Undefined request!");
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
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
	return ["f77b1502bb6d5ddec3f174fb23dda9a033737c442f29c23e9b3211746fcf306f69126abf2a30f10cab88c001ba9d91757a069984765c4a74a00653ce8c2adff2","so0FuKNLdsNKme8","4vL9yf3FkncwbEM","7GGCeU3sCCGFO2Y","bJzkEzJ0r1btUD6","zlvVs2EDe8y0FJb","M2i0lf4mbcfoW0g","lNVypbDMKxg313R","cV4WUQhmxeuptNh","fV28H9UgPIRLjdO"];
}
// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Connection opened on port ' + port);