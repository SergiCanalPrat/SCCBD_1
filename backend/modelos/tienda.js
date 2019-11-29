'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema


const TiendaSchema = Schema({
    cuenta:  [{type: Schema.Types.ObjectId, ref: "Cuenta"}],
})



module.exports = mongoose.model('Tienda',TiendaSchema)