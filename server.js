// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var cp2017sign = require('cp2017sign');
var subscribersList=getSubscribersFromWebapp();

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Request came in, trying to verify it.');
    if(req.get("marketplace-signature")!=undefined){
    var marketplacesignaturestring = new Buffer(req.get("marketplace-signature"),'base64').toString('utf-8');
    var marketplacesignature = JSON.parse(marketplacesignaturestring);
    if(subscribersList.indexOf(marketplacesignature.publicKey)==-1)
    {
    	if(cp2017sign.verify(req.body,marketplacesignature.v,marketplacesignature.r,marketplacesignature.s,marketplacesignature.publicKey))
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
// for now a dummy list, TODO: Query the webapp for the real list
function getSubscribersFromWebapp()
{
	return ["2bxvlZHLtq99aum","so0FuKNLdsNKme8","4vL9yf3FkncwbEM","7GGCeU3sCCGFO2Y","bJzkEzJ0r1btUD6","zlvVs2EDe8y0FJb","M2i0lf4mbcfoW0g","lNVypbDMKxg313R","cV4WUQhmxeuptNh","fV28H9UgPIRLjdO"];
}
// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Connection opened on port ' + port);