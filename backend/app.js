'use strict';

const express = require ('express');
const logger = require ('morgan');
const cors = require('cors');
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

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY; // Must be 256 bits (32 characters)
const IV_LENGTH = 16; // For AES, this is always 16
let iv = crypto.randomBytes(IV_LENGTH);
let key = Buffer.from(ENCRYPTION_KEY);

app.post( '/post/:mns',	(req, res) => {
	let mns = req.params.mns;
	console.log('este mensaje recibo del frontend: '+ mns);
	let enmns = encrypt(mns);
	res.json (enmns)
}) 

app.get('/get/:mns', (req,res) => {
	let emns = req.params.mns;
	console.log('este mensaje recibo del server: '+ emns);
	let demns = decrypt(emns);
	console.log('este mensaje recibo del server y lo desencripto: '+ demns);
	res.json (demns)
})

//funcion de encriptar
function encrypt (msg){
	console.log('encrypt del server 1')	
	let encrypted = crypto.createCipher('aes-256-cbc', key,iv);
	let cipher = cipher.update(msg);
	cipher = Buffer.concat([encrypted, cipher.final()]);
	return {cipherData: cipher.toString('hex')};
	}

//funcion de encriptar
function decrypt (msg){
	console.log('decrypt del server 1')
	let descrypted = crypto.createDecipher('aes-256-cbc',key,iv);
	let decipher = decipher.update(msg);
	decipher = Buffer.concat([descrypted, decipher.final()]);
	return {decipher: decipher.toString('hex')}
}
//funcion para key
function key(){
	console.log('crear key')
}
//funcion de iv
function iv(){
	console.log("crear iv")

}



