//BASE SETUP
//========================================================================================
//Llamar a los paquetes que necesites

var express     = require('express');    // Llama a express
var app         = express();              // Define tus aplicaciones usando express
var bodyParser  = require('body-parser');

var mongoose    = require('mongoose');
mongoose.connect('mongodb://<davidups>:<1234>@ds119018.mlab.com:19018/node_api');

var Bear        = require('./app/models/bear');
//Configura tu app usando bodyParser()
//Esto lo usaremos para coger los datos desde el POST

app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

var port = process.env.PORT || 8080       //Ponemos el puerto

//Rutas para la aplicaciones
//========================================================================================

var router = express.Router();            //coge la instancia de la express ruta

//Puente que usamos para usar las peticiones
router.use(function(req,res,next){
  //hacer loggin
  console.log('Something is happening');
  next();                                 //Nos aseguramos que valla a otras rutas y no se pare ahi
})

//Testeamos la ruta para estar seguros de que nos funciona
router.get('/', function(req, res){
  res.json({message: 'Wellcome to your api'});
});

//mas rutas de tu api aparecerán ahí
//Tus rutas que acaben en /Bears
router.route('/bears')

    // create a bear (accessed at POST http://localhost:8080/api/bears)
    .post(function(req, res) {

        var bear = new Bear();      // create a new instance of the Bear model
        bear.name = req.body.name;  // set the bears name (comes from the request)

        // save the bear and check for errors
        bear.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Bear created!' });
        });

    });
//registrar tus Rutas
//========================================================================================
//todas tus rutas deberán estar prefijadas con /api
app.use('/api', router);

//Empezamos el server
//========================================================================================
app.listen(port);
console.log('Magic thinks in the port: ' +  port);

//
