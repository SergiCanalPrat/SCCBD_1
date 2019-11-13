import { Component, OnInit } from '@angular/core';
import { MainService } from 'src/app/services/main.service';
import * as arrToString from 'arraybuffer-to-string'; 
//@ts-ignore
import * as hexToArrayBuffer from 'hex-to-array-buffer';
import { CheckboxControlValueAccessor } from '@angular/forms';
import { async } from '@angular/core/testing';

// mport * as bigintCryptoUtils from 'bigint-crypto-utils/test/modInv.js';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})

export class MainComponent implements OnInit {
  
  getres;
  mens;
  postres: Object;
  enmens: string;
  iv;
  key;
  menshex;
  gethex;
  postencrypt;

  //Parametros de RSA
  n
  e
  d
  
  constructor(private mainService: MainService) { }
  ngOnInit() {
    this.mainService.getiv().subscribe(res => {
      this.iv = res;
      this.iv = hex2ab2(this.iv); //fundamental
      console.log('valor iv '+ this.iv)
    })
    this.mainService.getkey().subscribe(res => {
      this.key = res;
      this.key = hex2ab2(this.key);     
      console.log('valor key '+ this.key)
    })
    
  }

  async get() {
    console.log('empezamos en GET  ', this.postres)
      this.mainService.get().subscribe(async res =>{
      this.getres = res;
      console.log('getres: ',this.getres)      
      this.gethex = stringToHex(this.getres)
      console.log('mensage en hex'+ this.gethex)
      let decmens = await decrypt(hex2ab2(this.gethex), this.key,this.iv)

      let decmenshex = stringToHex(decmens)
      console.log('respuesta del get '+ decmenshex)
    })
  }

  async post(){   //encripto el mensaje y lo envio, espero que mjuetre por pantalla el mensaje encriptado
    console.log('este es mi mens1: ' + this.mens) 
    this.menshex = stringToHex(this.mens) 
    console.log('este es mi mens to hex: ' + this.menshex)
    let cipher = await encrypt(hex2ab2(this.menshex), this.key, this.iv) //los datos han de estar en arraybuffer
    // let cipherRSA = await encryptRSA(this.menshex)  --> encriptar mensahe RSA
    console.log('este es el mensaje que envio al server: '+ cipher)
    this.postencrypt= stringToHex(cipher)
   // this.postencrypt = buf2hex(cipher) 
    console.log('comprobación: ' + this.postencrypt)
      this.mainService.post(this.postencrypt).subscribe(res => { //envio el mensage al serve en formato hexa
        this.postres = res; //recibo la respuesta del server que es el buffer 
        console.log("respuesta post: ", this.postres)
    })
  }
}

async function encrypt(msg, key, iv) {
  console.log('entra en encrypt: ',msg)//  
  console.log('este es el iv '+ iv)  
  return await window.crypto.subtle.importKey(
    "raw",
    key, {
      name: "AES-CBC",
      length: 256,
    },
    true,
    ["encrypt", "decrypt"] 
  ).then(function encrypt2(key2) {
    return window.crypto.subtle.encrypt({
      name: "AES-CBC",
      length: 256,
      iv
    },
    key2,
    msg
    ).then(function encrypt3(res) {
      var string = new TextDecoder("utf-8").decode(new Uint8Array(res));
      console.log('mensaje encriptado' + string);
      return string;
    });
  });
}

async function decrypt(ciphertext1, key, iv) {
  console.log('func dec 1: ', ciphertext1)
  console.log('este es el iv '+ iv) 
  return await window.crypto.subtle.importKey(
    "raw",
    key,
    {
      name:"AES-CBC",
      length:256,
    },
    true,
    ["encrypt","decrypt"]
  ).then(function decrypt2(key2){
    return window.crypto.subtle.decrypt({
      name:"AES-CBC",
      length:256,
      iv
    },
    key2,
    ciphertext1,
    ).then(function decrypt3 (decrypted){
      var string = new TextDecoder("utf8").decode(new Uint8Array(decrypted));
      console.log(string);
      return string;
    });
  });
}

/*async function genkey() {
  let key = await self.crypto.subtle.generateKey(
    {
      name: "AES-CBC",
      length: 256
    },
    true,
    ["encrypt", "decrypt"]
  );
  return key;
}

function genIv() {
  let iv = self.crypto.getRandomValues(new Uint8Array(16));
  return iv;
}*/

function d2h(d) {
  return d.toString(16);
}
function stringToHex (tmp) {
  var str = '',
      i = 0,
      tmp_len = tmp.length,
      c;

  for (; i < tmp_len; i += 1) {
      c = tmp.charCodeAt(i);
      str += d2h(c) + ' ';
  }
  return str;
}
function hex2ab2(hex){
  var typedArray = new Uint8Array(hex.match(/[\da-f]{2}/gi).map(function(h){
    return parseInt(h, 16)
  }))
  var buffer = typedArray.buffer
  return buffer
}
function buf2hex(buffer) { // buffer is an ArrayBuffer
  return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
}

/* 
//FUNCIONES RSA 
//funcion para crear key RSA
async function KeyRSA(){
	let p = await bigintCryptoUtils.prime(1024);
	let q = await bigintCryptoUtils.prime(1025);	
	this.n = p * q;
	let r = BigInt('1');
  let phi_n = (p-r)*(q-r);
  this.e = BigInt('65537');
	this.d = bigintCryptoUtils.modIvn(this.e, phi_n);
}
//funcion para encriptar RSA
async function encryptRSA(msg){ // MANDAR EN HEXA
  //let msgbuf = Buffer.from(msg,'utf8');
	let msgbig = BigInt('0x' + msg.toString(16));
  let cryptedRSA = bigintCryptoUtils.modPow(msgbig, this.e, this.n)  
	return cryptedRSA; //convertir a strng 16 depende de como quiero la respuesta 
}
//funcion para desencryptar RSA
async function decryptRSA(msg){
	let msgbig = BigInt('0x' + msg);
  let decryptRSA  = bigintCryptoUtils.modPow(msgbig,this.d,this.n);
  let decrypt = decryptRSA.toString(16);
  let decryptHex = hexToArrayBuffer(decrypt);
	let decryptedRSA = arrToString(decryptHex);
	return decryptedRSA;
} */