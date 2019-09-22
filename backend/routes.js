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
