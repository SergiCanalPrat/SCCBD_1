'use string'

const Moneda = require('../modelos/moneda')

 //recivir moneda por parte del cliente, hacer un hash y enviarla otra vez al cliente
function makehash (){
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
    makehash,
    firma,
    getMoneda,
    gastado,
}