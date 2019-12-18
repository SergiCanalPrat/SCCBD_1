'use strict';

const express = require ('express');
const logger = require ('morgan');
const cors = require('cors');
const crypto = require('crypto');
const app = express();
const bigintCryptoUtils = require('bigint-crypto-utils');
const moment = require('moment')
const jwt = require('jwt-simple')
const moneyInBank = require('./modelos/cuenta')
const mongoose = require('mongoose')
const config = require('./config')
var secrets = require('secrets.js');
const paillier = require('paillier.js');

var server;

app.use(logger('dev')); // Log requests (GET..)
app.use(express.json()); // Needed to retrieve JSON

mongoose.connect(config.db, (err, res) => {
	if (err) {return console.log(`Error al conectar a la base de datos: ${err}`)}
	console.log('Conexión a la base de datos establecida...')
	server = app.listen(config.port, (err, res) => {
	  console.log(`API REST corriendo en http://localhost:${config.port}`)
	})


//conexion al puerto
const PORT = process.env.port || 3000;
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
	res.header("Access-Control-Allow-Headers" ,"http://localhost:4200");
	res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
	if(req.method == 'OPTIONS'){
		res.header("Access-Control-Allow-Headers", "POST", "GET" )
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
secretKeySharing();
paillier();
//FUNCIONES DEL PROYECTO


//Funciones del proyecto
app.post('/login/:name',(req,res) => {
	let name = req.params.name;
	let password = req.params.pass;
	console.log('usuario logeandose ',name, password)
	let token = createToken(name)	
	return res.json(token)
		  
})

// FUNCIONES TIENDA
app.post('/compra/:Money',(req,res) => {
	let money = req.params.Money;
	console.log('Consultando si la moneda está gastada ', money)
	// wasted = askWasted(money)
	let wasted = app.post('./askWasted/:Money',(res) => {
		return res.json()
	})
	return res.json(wasted)
})

app.post('/postMoney/:value',(req,res) => {
	let value = req.params.value;
	let moneyBlind = req.params.pass;
	console.log('cuerpo PostMoney', value, moneyBlind)
	moneyInBank = moneyInBank - value; //El banco resta de la cuenta del cliente el valor de la moneda
	let signMoney = signMoney(value, moneyBlind) //El banco firma la moneda
	return res.json(signMoney)
})


//FUNCIONES DEL PROYECTO
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

//funcion para crear key RSA
async function KeyRSA5(){
	console.log('Voy a crear la Key de 5')
	let r = BigInt('1')
	let p = await bigintCryptoUtils.prime(1024);
	let q = await bigintCryptoUtils.prime(1025);
	n5 = p * q;
	let phi_n = (p-r)*(q-r);	
	e5 = BigInt('65537');
	d5 = bigintCryptoUtils.modInv(e5, phi_n);
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
function signMoney(msg, value){
	let msgbuf = Buffer.from(msg,'utf8');
	let msgbig = BigInt('0x' + msgbuf.toString('hex'));
	let signMoney;
	if (value == 5){
		signMoney = bigintCryptoUtils.modPow(msgbig,e5,n5)
	}
	else if (value == 10){
		signMoney = bigintCryptoUtils.modPow(msgbig,e10,n10)
	}
	else if (value == 20){
		signMoney = bigintCryptoUtils.modPow(msgbig,e20,n20)
	}
	else {
		signMoney = 'Valor incorrecto' 
	}
	console.log('3', signMoney)
	return signMoney;
}


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


//KEY SECRET SHARING
function secretKeySharing(){
	//Generamos una clave random de 512 bits (En hexadecimal)
	var keyToShare = secrets.random(512);

	// Dividimos 10 veces con un umbral de 5. 
	//Forma: '80IDxxx...xxx' -> ['801xxx...xxx','802xxx...xxx'...]
	var shares = secrets.share(keyToShare, 10, 5); 

	// Si combinamos 4 trozos la keyToShare no se descubre
	var comb = secrets.combine( shares.slice(0,4) );
	console.log(comb === keyToShare); //false

	// Si combinamos 5 trozos la keyToShare se puede descubrir
	var comb = secrets.combine( shares.slice(4,9) );
	console.log(comb === keyToShare); //true

	// Si los combinamos todos la keyToShare se puede descubrir
	var comb = secrets.combine( shares );
	console.log(comb === keyToShare); //true

	// Se puede crear nuevos trozos con la ID que queramos (ID = 8)
	var newShare = secrets.newShare(8, shares); //newShare = '808xxx...xxx'

	// Podemos utilizar el nuevo share y reconstruir los 4 previos y tambien se descubre
	var comb = secrets.combine( shares.slice(1,5).concat(newShare) );
	console.log(comb === keyToShare); //true

	var pw = '<<SCCBD_SECRET>>';
	var pwHex = secrets.str2hex(pw); // convertimos el string a hex
	var shares = secrets.share(pwHex, 5, 3); //dividimos en 5 trozos, con un umbral de 3
	var comb = secrets.combine( shares.slice(1,3) ); //combinamos 2 trozos
	comb = secrets.hex2str(comb); //lo pasamos de nuevo a string 
	console.log( comb === pw  ); //falso, falta un trozo
	var comb = secrets.combine( [ shares[1], shares[3], shares[4] ] );//combinamos 3 trozos
	comb = secrets.hex2str(comb); //Lo pasamos a string
	console.log( comb === pw  ); //verdadero, tiene el mínimo de 3 trozos

	}

//PAILLIER
function paillier(){
	const {publicKey, privateKey} = paillier.generateRandomKeys(2048);//Creamos RANDOM claves Pub y Priv
	//También podemos crear las claves segun los parámetros
	// const publicKey = new paillier.PublicKey(n, g);	
	// const privateKey = new paillier.PrivateKey(lambda, mu, p, q, publicKey);

	//M es el texto a encriptar
	//Cn son los textos a desencriptar

	let c = publicKey.encrypt(m); //Para encriptar m
	let d = privateKey.decrypt(c); //Para desencriptar c

	//Suma homomorfica de los dos ciphertexts 
	let c1 = publicKey.encrypt(m1);
	let c2 = publicKey.encrypt(m2);
	let encryptedSum = publicKey.addition(c1, c2);
	let sum = privateKey.decrypt(encryptedSum); // m1 + m2

	// Se multiplica el mensaje encriptado c1 por un numero k a escoger
	let c1 = publicKey.encrypt(m1);
	let encryptedMul = publicKey.multiply(c1, k);
	let mul = privateKey.decrypt(encryptedMul); // k · m1

}


})

