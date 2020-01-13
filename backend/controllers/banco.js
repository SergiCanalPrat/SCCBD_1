'use string'
const moment = require('moment')
const jwt = require('jwt-simple')
const mongoose = require('mongoose')
const app = require('../app')
const Moneda = require('../modelos/moneda')
const Cuentas = require('../modelos/cuenta')
const lista_gastados = []

//get las cunatas de la base de datos 
function getCuentas(){
    Cuentas.find((err, cuentas) => {
        if (err) {console.log(err)}
        console.log('las cuentas', cuentas)
    })
}
function saveMoney(value,id,sign,iden){
  let money = new Moneda();
	money.id = id;
	money.valor = value;
  money.firma = sign;
      if(value ==5){
      money.save((err, moneda) => {
        console.log("la moneda",moneda)
        console.log(err)  
        Cuentas.update({_id:iden},{"$push":{"Monedas5":moneda._id}}, (err,result)=>{
          console.log("el titular", result)
          if (err) {return "Error al salvar en la base"}
          if(!result) {return "El titular no existe"}
          else{
            
            return result}
        })      
      })
    }

    if(value ==10){
      money.save((err, moneda) => {
        console.log("la moneda",moneda)
        console.log(err)  
        Cuentas.update({_id:iden},{"$push":{"Monedas10":moneda._id}}, (err,result)=>{
          console.log("el titular", result)
          if (err) {return "Error al salvar en la base"}
          if(!result) {return "El titular no existe"}
          else{
            
            return result}
        })      
      })
    }

    if(value ==20){
      money.save((err, moneda) => {
        console.log("la moneda",moneda)
        console.log(err)  
        Cuentas.update({_id:iden},{"$push":{"Monedas20":moneda._id}}, (err,result)=>{
          console.log("el titular", result)
          if (err) {return "Error al salvar en la base"}
          if(!result) {return "El titular no existe"}
          else{
            
            return result}
        })      
      })
    }
 

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



 //recibo la moneda, compruevo si el ID esta gastado 
 //si no lo esta la marco como gastada y añado el valor a la cuenta de la tienda
 //si esta gastada informo a la tienda de que lo esta


module.exports = {
    getCuentas,
    getCuenta,
    getInfo,
    getMonedero,
    saveMoney
   
}