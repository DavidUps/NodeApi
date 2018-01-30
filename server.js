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
  console.log('Mongoose connection open');
});

// If the connection throws an error
mongoose.connection.on('error',function (err) {
  console.log('Mongoose connection error: ' + err);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
  console.log('Mongoose connection disconnected');
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

//Create a bear POST(http://localhost:8080/api/bears)

.post(function(req, res) {
  var bear = new Bear();          // create a new instance of the Bear model
  bear.name= req.body.name;       // set the bears name (comes from the request)

  // save the bear and check for errors
  bear.save(function(err){
    if(err)
      res.send(err);
    res.json({ message: 'Bear created: ' + req.body.name});
  });
})

//get all bears GET(http://localhost:8080/api/bears)

.get(function(req, res) {
  Bear.find(function(err, bears){
    if (err)
      res.send(err);
    res.json(bears);
  });
});

//En rutas que terminen en /bears/:bear_id
//------------------------------------------------------------------------------
router.route('/bears/:bear_id')

//Coge el bear con la id que le pongas GET(http://localhost:8080/api/bears/:bear_id)
.get(function(req, res){
  Bear.findById(req.params.bear_id, function(err, bear){
    if(err)
      res.send(err);
    res.json(bear);
  });
})

// Actualiza el oso con el id PUT(http://localhost:8080/api/bears/:bear_id)
.put(function(req, res){
  //Usa tú modelo oso con ese id
  Bear.findById(req.params.bear_id, function(err, bear) {
    if(err)
      res.send(err);

    bear.name = req.body.name;           //Actualiza la información Bear

    //Guardamos el bear
    bear.save(function(err){
      if(err)
        res.send(err);
      res.json({ message: 'Bear Updated'});
    });
  });
})

.delete(function(req,res){
  Bear.remove({
    _id: req.params.bear_id
  },function(err,bear){
    if(err)
      res.send(err);
    res.json({ message: 'Bear Deleted'});
  });
});

//REGISTER OUR RUTES------------------------------------------------------------
//all of our routers will be prefixed with /api
app.use('/api', router);

//START THE SERVER
//==============================================================================
app.listen(port);
console.log('Magic happend on port: ' + port);
