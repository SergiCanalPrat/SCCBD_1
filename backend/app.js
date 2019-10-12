'use strict';

const express = require ('express');
const logger = require ('morgan');
const cors = require('cors');
const crypto = require('crypto');
const app = express();
const routes = require('./routes')

app.use(logger('dev')); // Log requests (GET..)
app.use(express.json()); // Needed to retrieve JSON

//conexion al puerto
const PORT = process.env.port || 3000;
app.listen(PORT, () => {
	console.log('Connected to Port ',PORT )
});

//implementacion del cors
app.unsubscribe((req, res, next) =>{
	res.header("Access-Control-Allow-Headers" ,"http://localhost:4200"); ///¿Añadir local host?
	res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
	if(req.method == 'OPTIONS'){
		res.header("Access-Control-Allow-Headers", "POST", "GET" )
	} next()
})

app.use(cors());
//funciones


app.post( '/post/:mns',	(req, res) => {
	let mns = req.params.mns;
	console.log('este mensaje recibo del frontend: '+mns);
	let enmns = encrypt(mns);
	console.log('este mensaje recibo del frontend y lo encripto: '+enmns);
	res.json (enmns)
}) 

app.get('/get/:mns', (req,res) => {
	let emns = req.params.mns;
	console.log('este mensaje recibo del server: '+emns);
	let demns = decrypt(emns);
	console.log('este mensaje recibo del server y lo desencripto: '+demns);
	res.json (demns)
})

function encrypt (msg){
	const algorithm = 'aes-256-cbc';
	const password = 'MyPassword';
	// Use the async `crypto.scrypt()` instead.
	const key = crypto.scryptSync(password, 'salt', 32);
	// Use `crypto.randomBytes` to generate a random iv instead of the static iv
	// shown here.
	const iv = Buffer.alloc(16, 0); // Initialization vector.
	
	const cipher = crypto.createCipheriv(algorithm, key, iv);
	
	let encrypted = cipher.update(msg, 'utf8', 'hex');
	encrypted += cipher.final('');
	console.log('Mensaje de la función encrypt: '+encrypted);
	return encrypted;
	// Prints encrypted message
	}

function decrypt (msg){
	console.log('decript del server 1')
	const algorithm = 'aes-256-cbc';
	const password = 'MyPassword';
	// Use the async `crypto.scrypt()` instead.
	const key = crypto.scryptSync(password, 'salt', 32);
	// The IV is usually passed along with the ciphertext.
	const iv = Buffer.alloc(16, 0); // Initialization vector.

	const decipher = crypto.createDecipheriv(algorithm, key, iv);
	console.log('decript del server 2')
	// Encrypted using same algorithm, key and iv.
	const encrypted = msg;
	let decrypted = decipher.update(encrypted, 'hex', 'utf8');
	console.log('decript del server 3')
	decrypted += decipher.final('hex');
	console.log('Mensaje de la función decrypt: '+decrypted);
	console.log('decript del server 4')
	return decrypted;
	// Prints: some clear text data
}
