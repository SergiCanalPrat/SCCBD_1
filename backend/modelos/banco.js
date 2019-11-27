'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema


const BancoSchema = Schema({
    Titular: String,
    Saldo: Number
})



module.exports = mongoose.model('Banco',BancoSchema)