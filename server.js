//BASE SETUP
//==============================================================================

//call the packages we need

var express     = require('express');     //call express
var app         = express();              //define our app using express
var bodyParser  = require('body-parser');
var mongoose    = require('mongoose');

var Bear        = require('./app/models/bear');

mongoose.connect('mongodb://dbAdmin:Unisys01@ds119018.mlab.com:19018/node_api', {
  useMongoClient: true
});

mongoose.Promise = global.Promise;

mongoose.connection.on('connected', function () {
  console.log('Mongoose default connection open');
});

// If the connection throws an error
mongoose.connection.on('error',function (err) {
  console.log('Mongoose default connection error: ' + err);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
  console.log('Mongoose default connection disconnected');
});
//configura app use bodyParser()
//this will let us get the dat from POST
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;       //Set our port

//ROUTER FOR OUR API
//==============================================================================

var router = express.Router();            //get an instance of the express Router

//middelware to use for all requests
router.use(function(req,res,next){
  //do loggin
  console.log('Something is happening');
  next();                                 //make sure we go to the next routers and don´t stop here
});

//test route to make sure everything is working ==> accessed at GET http://localhost:8080/api
router.get('/', function(req,res){
  res.json({ message: 'Welcome to your api'});
});

//more routers for our API will happend here

//on routers that en in /bears
//------------------------------------------------------------------------------
router.route('/bears')
.post(function(req, res) {

        var bear = new Bear();      // create a new instance of the Bear model
        bear.name = req.body.name;  // set the bears name (comes from the request)

        // save the bear and check for errors
        bear.save(function(err) {
          console.log(err);
            if (err)
                res.send(err);

            res.json({ message: 'Bear created!' });
        });

    });

//REGISTER OUR RUTES------------------------------------------------------------
//all of our routers will be prefixed with /api
app.use('/api', router);

//START THE SERVER
//==============================================================================
app.listen(port);
console.log('Magic happend on port: ' + port);
