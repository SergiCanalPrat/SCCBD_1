'use string'

const mongoose = require('mongoose')

const Moneda = require('../modelos/moneda')
const Cuentas = require('../modelos/cuenta')

let id  = '5df206267540b66f19fc554f'
//get las cunatas de la base de datos 
function getCuentas(){
    Cuentas.find((err, cuenta) => {
        if (err) {console.log(err)}
        console.log('las cuentas', cuenta)
    })
}

// recive el hash de la moneda cegada y su valor, con ello firma la moneda
function firma (){
    
}

//se recive del cliente la cantidad que quiere gastar y se le descuenta su valor de la cuenta
function getMoneda (){ 
}

 //recibo la moneda, compruevo si el ID esta gastado 
 //si no lo esta la marco como gastada y añado el valor a la cuenta de la tienda
 //si esta gastada informo a la tienda de que lo esta
function gastado (){
}

module.exports = {
    getCuentas,
    firma,
    getMoneda,
    gastado,
}