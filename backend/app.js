'use strict';

const express = require ('express');
const logger = require ('morgan');
const cors = require('cors');
const crypto = require('crypto');
const app = express();
const bigintCryptoUtils = require('bigint-crypto-utils');
const moment = require('moment')
const jwt = require('jwt-simple')


app.use(logger('dev')); // Log requests (GET..)
app.use(express.json()); // Needed to retrieve JSON

//conexion al puerto
const PORT = process.env.port || 3000;
app.listen(PORT, () => {
	console.log('Connected to Port: ', PORT )
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
KeyRSA();
let n;
let d;
let e;
let nfront;
let dfront;



//Funciones del pryecto



app.post('/login/:name',(req,res) => {
	let name = req.params.name;
	let password = req.params.pass;
	console.log('usuario logeandose ',name, password)
	let token = createToken(name)	
	return res.json(token)
		  
})




//funiones de ENTREGAS
console.log (key);
 app.get('/getiv', (req,res) => {
	//res.json (buf2hex(iv));
	res.json(d.toString(16));
 })

app.get('/getkey', (req,res) => {
	//res.json (buf2hex(key));	
	res.json(n.toString(16));
	
})

app.post('/postd/:d', (req,res) => {
	dfront = req.params.d
 })
app.post('/postn/:n', (req,res) => {
	nfront = req.params.n
	
})

app.post( '/post/:mns',	(req, res) => {  //por	que encripto y desncripto, ademas el mensage viene cifrado, tendria colo que descifrarlo
	let mns = req.params.mns;
	console.log('este mensaje recibo de frontend1: '+ mns);
	//Como me está llegando el mensaje + "a" + d + "a" + n, lo que hago es dividirlo con el separador "a"  y guardar cada valor
	/*let cadena = mns.split("a", 3);
	let mensaje = cadena[0];
	let d = cadena[1];
	let n = cadena[2];

	console.log('este mensaje recibo de frontend2(mensaje): '+ mensaje);
	console.log('este mensaje recibo de frontend2(d): '+ d );
	console.log('este mensaje recibo de frontend2(n): '+ n + "\n");*/
	//let denmns =  decrypt(mns);

	//Faltaría pasar los valores de string a hexa
	console.log('valores   ', dfront, nfront)
	let denmnsRSA = decryptRSA(mns, dfront, nfront);
	console.log('este mensaje recibo del servidor tras deseencriptar: '+ denmnsRSA);
	res.json (denmnsRSA);
})

app.get('/get', (req,res) => {
	let emns = 'hola'
	let emns1 = ascii_to_hexa(emns)
	console.log('este mensaje envio al backend: '+ emns);
	//let demns = encrypt(emns1);
	let demnsRSA = 	encryptRSA(emns);	
	let demnsRSAhex = demnsRSA.toString(16);
	console.log('este mnesage que me enviare encryptado: '+ demnsRSAhex);
	res.json (demnsRSAhex);
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



//funcion de encriptar
function encrypt (msg){
	console.log('encrypt del server 1 '+ msg);
	let cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
	let encrypted = cipher.update(msg, 'hex');
	encrypted = Buffer.concat([encrypted, cipher.final()]);
	let encryptedhex = buf2hex(encrypted);
	console.log('encrypt del server 2 - final: ' + encrypted.toString());
	return encrypted;
	}
//funcion de desencriptar
function decrypt (msg){
	console.log('decrypted del server 1: ' + msg);
	let decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
	let decrypted = decipher.update(msg,'hex');
	decrypted = Buffer.concat([decrypted, decipher.final()]);
	console.log('decrypted del server 3.º: ', decrypted.toString());
	return decrypted;
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
async function KeyRSA(){
	console.log('Voy a crear la Key')
	let r = BigInt('1')
	let p = await bigintCryptoUtils.prime(1024);
	let q = await bigintCryptoUtils.prime(1025);
	n = p * q;
	let phi_n = (p-r)*(q-r);	
	e = BigInt('65537');
	d = bigintCryptoUtils.modInv(e, phi_n);
	//return d;
}
//funcion para encriptar RSA
function encryptRSA(msg){
	let msgbuf = Buffer.from(msg,'utf8');
	let msgbig = BigInt('0x' + msgbuf.toString('hex'));
	let cryptoRSA = bigintCryptoUtils.modPow(msgbig,e,n)
	console.log('3', cryptoRSA)
	return cryptoRSA;
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
