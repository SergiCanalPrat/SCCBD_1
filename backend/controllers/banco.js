'use string'
const moment = require('moment')
const jwt = require('jwt-simple')
const mongoose = require('mongoose')
const moneda = require('../modelos/moneda')
const Cuentas = require('../modelos/cuenta')
const lista_gastados = []
const app = require('../app');
const CryptoJS = require ('crypto-js');


//get las cunatas de la base de datos 
function getCuentas(){
    Cuentas.find((err, cuentas) => {
        if (err) {console.log(err)}
        console.log('las cuentas', cuentas)
    })
}

//para comprobar si el usuario esta en el banco
function getCuenta(req, res){
  let name = req.params.name;
	let pass = req.params.pass;
    Cuentas.find({titular: name, password: pass},(err, cuenta) =>{
        if (err) {
            return res.status(500).send({message:`Error al realizar la petición: ${err}`})
          } if (cuenta.length === 0) {
            return res.status(404).send({message:'El usuario no esta registrado'}) 
          } else {
            console.log('la cuenta es ', cuenta)
            return res.status(200).send( { message: 'Te has logueado correctamente',
            token: createToken(cuenta), res: cuenta})  
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

//para comprobar si el usuario esta en el banco
function getInfo(req, res){
  let name = req.params.name;
    Cuentas.find({titular: name},(err, cuenta) =>{
        if (err) {
            return res.status(500).send({message:`Error al realizar la petición: ${err}`})
          } if (cuenta.length === 0) {
            return res.status(404).send({message:'El usuario no esta registrado'}) 
          } else {
            console.log('la cuenta es ', cuenta)
            return res.status(200).send( { message: 'Te has logueado correctamente',
            token: createToken(cuenta), res: cuenta})  
          }       
    })
}

function getMonedero(req,res){
  let id = req.params.id;
    Moneda.find({_id:id},(err,moneda) => {
      if(err){ return res.status(500).send({message:'Eror al reliazar la peticion:'})
      } if (moneda.length === 0) {
        return res.status(404).send({message:'La moneda no existe'})
      }else {
        return res.status(200).send({message:'La moneda del cliente', res:moneda})
      }
    })
}

function firma(req,res){
	let value = req.params.value;
	moneyBlind = req.params.moneyblind;
	console.log('cuerpo PostMoney', value, moneyBlind)
	//moneyInBank = moneyInBank - value; //El banco resta de la cuenta del cliente el valor de la moneda
	let sign = signMoney(moneyBlind,value) //El banco firma la moneda
	return res.json(sign.toString(16))
}

function signMoney(msg, value){
	console.log("La moneda que quiero firmar es: ", msg)
	//let msgbuf = Buffer.from(msg,'utf8');
	//let msgbig = BigInt('0x' + msgbuf.toString('hex'));
	let signMoney;
	if (value == 5){
		signMoney = bigintCryptoUtils.modPow(msg,d5,n5)
	}
	else if (value == 10){
		signMoney = bigintCryptoUtils.modPow(msg,d10,n10)
	}
	else if (value == 20){
		signMoney = bigintCryptoUtils.modPow(msg,d20,n20)
	}
	else {
		signMoney = 'Valor incorrecto' 
	}
	console.log('3', signMoney)
	//Restar saldo a la base de datos
	return signMoney;
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
    console.log("La moneda no estaba gastada")
    // let coinSignedByBank = app.signMoney(moneda, valor);
    // let hashedCoinSignedByBank = CryptoJS.SHA256(coinSignedByBank);
    // if(hashedCoinSignedByBank == )
    return "Pago aceptado"
}

module.exports = {
    getCuentas,
    getCuenta,
    getInfo,
    gastado,
    getMonedero,
    signMoney,
    firma
   
}