'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema


const BancoSchema = Schema({
   cuentas: [{type: Schema.Types.ObjectId, ref: "Cuenta"}],
   lista_id: String(),
})



module.exports = mongoose.model('Banco',BancoSchema)