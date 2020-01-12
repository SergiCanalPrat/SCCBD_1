'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema


const MonedaSchema = Schema({
    Valor: Number,
    firma: String
})



module.exports = mongoose.model('Moneda',MonedaSchema)