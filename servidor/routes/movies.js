const express = require( 'express' )
const router = express.Router()
const appController = require('../controladores/appController.js')

router.get("/peliculas",appController.movies)
router.get("/generos",appController.generos)

module.exports=router