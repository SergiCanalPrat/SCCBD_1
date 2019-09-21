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
	let enmns = encrypt(mns);
	res.json (enmns)
}) 

app.get('/get/:mns', (req, res) => {
	let mns = req.params.mns;
	let demns = decrypt(mns);
	res.json (demns)
})

function encrypt (msg){
	const algorithm = 'aes-192-cbc';
	const password = 'MyPassword';
	// Use the async `crypto.scrypt()` instead.
	const key = crypto.scryptSync(password, 'salt', 24);
	// Use `crypto.randomBytes` to generate a random iv instead of the static iv
	// shown here.
	const iv = Buffer.alloc(16, 0); // Initialization vector.
	
	const cipher = crypto.createCipheriv(algorithm, key, iv);
	
	let encrypted = cipher.update(msg, 'utf8', 'hex');
	encrypted += cipher.final('hex');
	console.log(encrypted);
	return encrypted;
	// Prints encrypted message
	}

function decrypt (msg){
	const algorithm = 'aes-192-cbc';
	const password = 'MyPassword';
	// Use the async `crypto.scrypt()` instead.
	const key = crypto.scryptSync(password, 'salt', 24);
	// The IV is usually passed along with the ciphertext.
	const iv = Buffer.alloc(16, 0); // Initialization vector.

	const decipher = crypto.createDecipheriv(algorithm, key, iv);

	// Encrypted using same algorithm, key and iv.
	const encrypted = msg;
	let decrypted = decipher.update(encrypted, 'hex', 'utf8');
	decrypted += decipher.final('utf8');
	console.log(decrypted);
	return decrypted;
	// Prints: some clear text data
}
