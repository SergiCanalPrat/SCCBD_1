'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema


const CuentaSchema = Schema({
    Titular: String,
    Saldo: Number,
    Monedas5: Number,
    Monedas10: Number,
    Monedas20: Number,

})



module.exports = mongoose.model('cuenta',CuentaSchema)