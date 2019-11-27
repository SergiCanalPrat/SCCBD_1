'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema


const TiendaSchema = Schema({
    Saldo: Number
})



module.exports = mongoose.model('Tienda',TiendaSchema)