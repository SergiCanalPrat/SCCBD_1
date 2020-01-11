'use string'
const moment = require('moment')
const jwt = require('jwt-simple')
const mongoose = require('mongoose')
const Moneda = require('../modelos/moneda')
const Cuentas = require('../modelos/cuenta')
const lista_gastados = []

//get las cunatas de la base de datos 
function getCuentas(){
    Cuentas.find((err, cuenta) => {
        if (err) {console.log(err)}
        console.log('las cuentas', cuenta)
    })
}

//para comprobar si el usuario esta en el banco
function getCuenta(req, res){
    let name = req.params.name;
	let pass = req.params.pass;
    Cuentas.find({titular: name, password: pass},(err, user) =>{
        if (err) {
            return res.status(500).send({message:`Error al realizar la petición: ${err}`})
          } if (user.length === 0) {
            return res.status(404).send({message:'El usuario no esta registrado'}) 
          } else {
            res.user = user
            return res.status(200).send( { message: 'Te has logueado correctamente',
            token: createToken(user)})  
          }       
    })
}

function createToken(user) {
    const payload = {
      sub: user,
      ///libreria moment para las fechas, ayuda para el manejo de fechas
      iat: moment().unix(), //fecha en la que fue creado el Token-tiempo en formato unix
      exp:moment().add(365, 'days').unix(), //fecha en la que el token va a expirar - caduca en 14 días
    }
    //codificarlo
    return jwt.encode(payload, 'miclavedetokens')
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
function gastado (moneda){
  console.log("recibimos de la tienda: ", moneda)
  let _id = moneda[0]
  let valor = moneda[1]
  let firma = moneda[2]
  if (lista_gastados.indexOf(_id) >= 0)
    return "Pago denegado"
  else
    lista_gastados.push(_id)
    console.log("Hemos añadido la moneda a la lista de gastadas ", lista_gastados)
    return "Pago aceptado"
}

module.exports = {
    getCuentas,
    getCuenta,
    firma,
    getMoneda,
    gastado,
}