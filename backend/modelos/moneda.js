'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema


const MonedaSchema = Schema({
    id: String,
    valor: Number,
    firma: String
})



module.exports = mongoose.model('Moneda',MonedaSchema)