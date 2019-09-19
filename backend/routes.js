'use strict'
const api = express.Router()
const funciones = require('../backend/app')

//get
api.get('/get',funciones.get)

//post
api.post('/post/:post', funciones.post)