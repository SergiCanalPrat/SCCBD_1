'use strict';

const express = require ('express');
const logger = require ('morgan');
const cors = require('cors');
const crypto = require('crypto');
const cryptojs = require('crypto-js');
const app = express();
const bigintCryptoUtils = require('bigint-crypto-utils');
const Moneda = require('./modelos/moneda')
const moneyInBank = require('./modelos/cuenta')
const mongoose = require('mongoose')
const banco = require('./controllers/banco')
const tienda = require('./controllers/tienda')
const lista_gastados = []

app.use(logger('dev')); // Log requests (GET..)
app.use(express.json()); // Needed to retrieve JSON

const PORT = process.env.port || 3000;
const db =  process.env.MONGODB || 'mongodb://localhost:27017/SCCBD';

mongoose.connect(db, (err, res) => {
	if (err) {return console.log(`Error al conectar a la base de datos: ${err}`)}
	console.log('Conexión a la base de datos establecida...')


//conexion al puerto
app.listen(PORT, () => {
	console.log('Connected to Port: ', PORT )
});
// TIENDA
const PORT2 = process.env.port || 3010;
app.listen(PORT2, () => {
	console.log('Connected to Port: ', PORT2 )
});

//implementacion del cors
app.unsubscribe((req, res, next) =>{
	res.header("Access-Control-Allow-Headers" ,"http://localhost:4200"); //http://localhost:4200
	res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
	if(req.method == 'OPTIONS'){
		res.header("Access-Control-Allow-Headers", 'PUT, POST, PATCH, DELETE, GET' )
	} next()
})
app.use(cors());

//FUNCIONES POST, GET, ENCRIPTAR, DESENCRIPTAR

const KEY_LENGTH = 32;
const IV_LENGTH = 16; // For AES, this is always 16
let iv = crypto.randomBytes(IV_LENGTH);
let key = crypto.randomBytes(KEY_LENGTH);
KeyRSA5();
KeyRSA10();
KeyRSA20();
let n5;
let d5;
let e5;
let n10;
let d10;
let e10;
let n20;
let d20;
let e20;
let nfront;
let dfront;
let moneyBlind;
//banco.getMonedero()
//FUNCIONES DEL PROYECTO


//Funciones del proyecto
app.post('/login/:name/:pass', banco.getCuenta)

app.post('/cuenta/:name', banco.getInfo)

app.post('/monedero/:id',banco.getMonedero)

// FUNCIONES 	FIRMA POR PARTE DEL BANCO 
app.post('/postMoney/:value/:moneyblind',(req,res) => {
	let value = req.params.value;
	moneyBlind = req.params.moneyblind;
	console.log('cuerpo PostMoney', value, moneyBlind)
	//moneyInBank = moneyInBank - value; //El banco resta de la cuenta del cliente el valor de la moneda
  let sign = signMoney(moneyBlind,value) //El banco firma la moneda
	return res.json(sign.toString(16))
})


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


	
app.post('/compracliente/:money',(req,res)=> {
	let money = req.params.money.split(',');
    console.log("recibimos de la tienda: ",lista_gastados, money)    
	let _id = money[0]
	let id = money[1]
	let valor = money[2]
    let firma = money[3]
    res = "GASTADO"
	
	if (lista_gastados.indexOf(id)){
		   res = "NO-GASTADO"
		   lista_gastados.push(id);
		   console.log('resultado', res)
		   let msgbig = BigInt('0x' + firma.toString())
			console.log("La moneda que quiero VERFICAR  es: ", msgbig, valor)
			res = verify(valor,id, msgbig );
    } else{	console.log('resiltadooo', res)
    }     
})
//FUNCIONES DEL PROYECTO
function verify(valor,id, firma){
	console.log('datos', valor,id,firma)		
	let verification;
	if (valor == 5){
		verification = bigintCryptoUtils.modPow(firma, e5, n5)
		//let hash = crypto.subtle.digest('SHA-256', id2);
		let hash = cryptojs.SHA256(id)
		console.log('El hash el libro',hash )
	}
	else if (valor == 10){
		verification = bigintCryptoUtils.modPow(firma, e1s0, n10)
	}
	else if (valor == 20){
		verification = bigintCryptoUtils.modPow(firma, e20, n20)
	}
	else {
		verification = 'Valor incorrecto' 
	}
		return verification;
}


//funcion para crear key RSA
async function KeyRSA5(){
	console.log('Voy a crear la Key de 5')
	let r = BigInt('1')
	let p = await bigintCryptoUtils.prime(1024);
	let q = await bigintCryptoUtils.prime(1025);
	//n5 = p * q;
	n5 = BigInt('22905916875747722246660110056226373270193310829822604418085419486125339615418903270281743525388994061770052154256452342574385083107021263069629382773402334528553635733772627951247006546252761379017505197872333080673239391807329440139656465341307740256513769162069010086366999935138332706269245682944572754037644695327638767285967207236831067450541220303518679268482175663401177536958317225194230283047500203330722933357386762837989818161370714793314381591333109542090092117938349414232263823892283531249019378010835235507398464702439940727421467225154092517928460592147475100536723795095674704641392930047567957349031')
	let phi_n = (p-r)*(q-r);	
	d5 = BigInt ('10946341923364556098740375465019054647743782929935977352793341973022254778450411699070050894481863756665338105484807527306516416952695407755584214094026087783996388567466086863986831835788794629437558101410861036568734981949337789885620349390793248349691849434469678607426767642226489494905877680457467904904011936204147995786166438164128967181428394863931870094513811532909687250909168551770810358668991016894240993582284757181549552616216782945644796769638688895710268758529449490314109812858138653022870752847373168370626415182549517830193697214608955128665805482953179588656658740569096005335988851805163827200897')
	e5 = BigInt('65537');
//	d5 = bigintCryptoUtils.modInv(e5, phi_n);
	//console.log('hol ahola hola hola hola jola hola hola hola hila jola hola hila hjola ',e5,d5,'separacion seprcios',n5)
	//return d;
}
//funcion para crear key RSA
async function KeyRSA10(){
	console.log('Voy a crear la Key de 10')
	let r = BigInt('1')
	let p = await bigintCryptoUtils.prime(1024);
	let q = await bigintCryptoUtils.prime(1025);
	n10 = p * q;
	let phi_n = (p-r)*(q-r);	
	e10 = BigInt('65537');
	d10 = bigintCryptoUtils.modInv(e10, phi_n);
	//return d;
}
//funcion para crear key RSA
async function KeyRSA20(){
	console.log('Voy a crear la Key de 20')
	let r = BigInt('1')
	let p = await bigintCryptoUtils.prime(1024);
	let q = await bigintCryptoUtils.prime(1025);
	n20 = p * q;
	let phi_n = (p-r)*(q-r);	
	e20 = BigInt('65537');
	d20 = bigintCryptoUtils.modInv(e20, phi_n);
	//return d;
}


//funcion para encriptar RSA
//funcion para desencryptar RSA
function decryptRSA(msg, d, n){
	let msgbig = BigInt('0x' + msg);
	//let dbig = BigInt('0x' + d);
	//let nbig = BigInt('0x' + n);
	let decrypto = bigintCryptoUtils.modPow(msgbig, d, n);
	console.log('1', decrypto)
	let decryptoHex = decrypto.toString(16);
	console.log('2', decryptoHex)
	let decryptobuf = Buffer.from(decryptoHex, 'hex');
	console.log('1', decryptobuf)
	let decryptedRSA = decryptobuf.toString('utf8');
	console.log('1', decryptedRSA)
	return decryptedRSA;
}




function buf2hex(buffer) { // buffer is an ArrayBuffer
	return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
}

function hex2ab2(hex){
	var typedArray = new Uint8Array(hex.match(/[\da-f]{2}/gi).map(function(h){
	  return parseInt(h, 16)
	}))
	var buffer = typedArray.buffer
	return buffer
  }

function d2h(d) {
	return d.toString(16);
}

function ascii_to_hexa(str)
{
	var arr1 = [];
	for (var n = 0, l = str.length; n < l; n ++)
		{
		var hex = Number(str.charCodeAt(n)).toString(16);
		arr1.push(hex);
		}
	return arr1.join('');
}
}) //cierra la conxion de mongo
