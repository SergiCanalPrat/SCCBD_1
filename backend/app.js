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

app.post( '/post/:mns',	(req, res) => {
	let mns = req.params.mns;
	console.log('este mensaje recibo del frontend: '+mns);
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
<<<<<<< HEAD
	console.log('encrypt del server 1')
	let encrypted = crypto.createCipher('aes-256-cbc', key,iv);
	let cipher = cipher.update(msg);
	cipher = Buffer.concat([encrypted, cipher.final()]);
	return {cipherData: cipher.toString('hex')};
=======
	const algorithm = 'aes-256-cbc';
	const password = 'MyPassword';
	// Use the async `crypto.scrypt()` instead.
	const key = crypto.scryptSync(password, 'salt', 32);
	// Use `crypto.randomBytes` to generate a random iv instead of the static iv
	// shown here.
	const iv = Buffer.alloc(16, 0); // Initialization vector.	
	const cipher = crypto.createCipheriv(algorithm, key, iv);	
	let encrypted = cipher.update(msg, 'utf8', 'hex');
	encrypted += cipher.final('hex');
	console.log('Mensaje de la función encrypt: '+encrypted);
	return encrypted;
	// Prints encrypted message
>>>>>>> explicacion
	}

//funcion de encriptar
function decrypt (msg){
<<<<<<< HEAD
	console.log('decrypt del server 1')
	let descrypted = crypto.createCipher('aes-256-cbc',key,iv);
	let decipher = decipher.update(msg);
	decipher = Buffer.concat([descrypted, decipher.final()]);
	return {decipher: decipher.toString('hex')}
}
=======
	console.log('decript del server 1')
	const algorithm = 'aes-256-cbc';
	const password = 'MyPassword';
	// Use the async `crypto.scrypt()` instead.
	const key = crypto.scryptSync(password, 'salt', 32);
	// The IV is usually passed along with the ciphertext.
	const iv = Buffer.alloc(16, 0); // Initialization vector
	const decipher = crypto.createDecipheriv(algorithm, key, iv);
	console.log('decript del server 2')
	// Encrypted using same algorithm, key and iv.
	console.log('men', msg)
	let decrypted = decipher.update(msg, 'hex', 'utf8');
	console.log('Mensaje de la función decrypt antes de decript del server 4: '+decrypted);
	decrypted += decipher.final('utf8');
	console.log('Mensaje de la función decrypt: '+decrypted);
	return decrypted;
	// Prints: some clear text data
}

>>>>>>> explicacion



