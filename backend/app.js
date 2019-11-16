'use strict';

const express = require ('express');
const logger = require ('morgan');
const cors = require('cors');
//const cipher = require('ci')
const crypto = require('crypto');
const app = express();

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
let n;
let d;
let e;

app.get('/getiv', (req,res) => {	
	res.json (buf2hex(iv));
})

app.get('/getkey', (req,res) => {
	res.json (buf2hex(key));
})

app.post( '/post/:mns',	(req, res) => {  //por	que encripto y desncripto, ademas el mensage viene cifrado, tendria colo que descifrarlo
	let mns = req.params.mns;
	console.log('este mensaje recibo d frontend: '+ mns);
	let denmns =  decrypt(mns);
	console.log('este mensaje recibo del servidor tras deseencriptar: '+ denmns);
	res.json (denmns);
}) 

app.get('/get', (req,res) => {
	//let emns = req.params.mns;
	let emns = 'hola'
	let emns1 = ascii_to_hexa(emns)
	//let emns1 = toHex(emns)
	console.log('emns en hexa: '+ emns1);
	console.log('este mensaje envio al backend: '+ emns);
	let demns = encrypt(emns);
	console.log('este mnesage que me enviare encryptado: '+ demns);
	res.json (demns);
})

//funcion de encriptar
function encrypt (msg){
	console.log('encrypt del server 1 '+ msg);
	let cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
	let encrypted = cipher.update(msg, 'utf8');
	encrypted = Buffer.concat([encrypted, cipher.final()]);
	//let encryptedhex = buf2hex(encrypted);
	console.log('encrypt del server 2 - final: ' + encrypted);
	return encrypted; 
	}

//funcion de desencriptar
function decrypt (msg){
	console.log('decrypted del server 1: ' + msg);
	let decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
	let decrypted = decipher.update(msg,'hex');
	decrypted = Buffer.concat([decrypted, decipher.final()]); //saltaaaaaaaaaaaathfrdckytcuytcoucvout
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
 
/* 
//funcion para crear key RSA
async function KeyRSA(){
	let p = await bigintCryptoUtils.prime(1024);
	let q = await bigintCryptoUtils.prime(1025);	
	n = p * q;
	let r = BigInt('1');
	let phi_n = (p-r)*(q-r);
	e = BigInt('65537');
	d = bigintCryptoUtils.modIvn(e, phi_n);
}
//funcion para encriptar RSA
function encryptRSA(msg){
	let msgbuf = Buffer.from(msg,'utf8');
	let msgbig = BigInt('0x' + buf.toString('hex'));
	let cryptoRSA = bigintCryptoUtils.modPow(big,e,n)
	return cryptoRSA;
}
//funcion para desencryptar RSA
function decryptRSA(msg){
	let msgbig = BigInt('0x' + mns);
	let decrypto = bigintCryptoUtils.modPow(msgbig, d, n);
	let decryptoHex = decrypto.toString(16);
    let decryptobuf = Buffer.from(decryptoHex, 'hex');
    let decryptedRSA = decryptobuf.toString('utf8');	
	return decryptedRSA;
} 
*/