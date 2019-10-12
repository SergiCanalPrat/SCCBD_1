
'use strict'

function encript(){
    window.crypto.subtle.encrypt({
        name:"AES-CBC",
        iv: window.crypto.getRandomValues(new Uint8Array(16)),
    },
    key, data
   ).then(function(encripted){
       console.log(new Uint8Array(encripted));
   }).catch(function(err){
       console.error(err);       
   });
}


function decrypt(){
	   //desencriptacion
	   window.crypto.subtle.decrypt({
		name:"AES-CBC",
		iv: ArrayBuffer(16),  
	  },
	 key, data 
	  )
	  .then(function(decrypted){
		  console-log(new Uint8Array(decrypted));
	  })
	  .catch(function(err){
		  console.error(err);
	  })
}



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
	console.log("encripted men",encrypted);
	return encrypted;
	// Prints encrypted message*/
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
