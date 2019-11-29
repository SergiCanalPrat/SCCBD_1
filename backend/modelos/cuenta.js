'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema


const CuentaSchema = Schema({
    Titular: String,
    Saldo: Number,
})



module.exports = mongoose.model('Cuenta',CuentaSchema)