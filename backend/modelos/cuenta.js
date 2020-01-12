'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema


const CuentaSchema = Schema({
    Titular: String,
    Password: String,
    Saldo: Number,
    Monedas5:  [{type: Schema.Types.ObjectId, ref: "Moneda"}],
    Monedas10: [{type: Schema.Types.ObjectId, ref: "Moneda"}],
    Monedas20: [{type: Schema.Types.ObjectId, ref: "Moneda"}],

})



module.exports = mongoose.model('Cuenta',CuentaSchema)