const express = require( 'express' )
const router = express.Router()
const appController = require('../controladores/appController.js')

router.get("/peliculas",appController.movies)
router.get("/peliculas/recomendacion",appController.recommended)
router.get("/peliculas/:id([0-9]*)",appController.getMovie)
router.get("/generos",appController.generos)

module.exports=router