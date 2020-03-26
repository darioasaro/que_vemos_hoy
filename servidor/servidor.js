//paquetes necesarios para el proyecto
var express = require('express');
require('dotenv').config()
const routes = require( './routes/routes.js' )
var bodyParser = require('body-parser');
var cors = require('cors');
const morgan = require('morgan')
var app = express();

app.use(cors());

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(morgan("dev"));
routes(app);

app.use(bodyParser.json());

//seteamos el puerto en el cual va a escuchar los pedidos la aplicación
var puerto = '8080';

app.listen(puerto, function () {
  console.log( "Escuchando en el puerto " + puerto );
});

