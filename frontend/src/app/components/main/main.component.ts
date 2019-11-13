import { Component, OnInit } from '@angular/core';
import { MainService } from 'src/app/services/main.service';
import * as arrToString from 'arraybuffer-to-string'; 
//@ts-ignore
import * as hexToArrayBuffer from 'hex-to-array-buffer';

// mport * as bigintCryptoUtils from 'bigint-crypto-utils/test/modInv.js';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})

export class MainComponent implements OnInit {
  
  getres: Object;
  mens
  postres: Object;
  enmens: string;
  iv;
  key;
  menshex
  postencrypt

  //Parametros de RSA
  n
  e
  d
  
  constructor(private mainService: MainService) { }
  ngOnInit() {
    this.mainService.getiv().subscribe(res => {
      this.iv = res;
      console.log('valor iv '+ this.iv)
    })
    this.mainService.getkey().subscribe(res => {
      this.key = res;
      console.log('valor key '+ this.key)
    })
    
  }

  async get() {
    console.log('empezamos en GET  ', this.postres)
    console.log('este es mi iv ' + this.iv)    
    console.log('esta es la key '+ this.key)

    this.mainService.get(this.postres).subscribe(async res =>{
      this.getres = res;
      console.log('getres: ', this.getres)
      let decmens = await decrypt( hex2ab2(this.getres), this.key, this.iv)
      console.log('mensaje desen ', decmens)
      let decmenshex = buf2hex(decmens);
      console.log('comprovacion ' + decmenshex);
      this.enmens = decmenshex.toString();
      console.log('respuesta del get'+ this.enmens)
    })
  }

  async post(){
    //encripto el mensaje y lo envio, espero que mjuetre por pantalla el mensaje encriptado
        
    this.menshex = stringToHex(this.mens) 
    console.log('este es mi mens to hex: ' + this.menshex)
    let cipher = await encrypt(hex2ab2(this.menshex), this.key, this.iv) //los datos han de estar en arraybuffer
    this.postencrypt = buf2hex(cipher) 
    console.log('decoded msg - comprobación: ' + this.postencrypt)
      this.mainService.post(this.postencrypt).subscribe(res => { //envio el mensage al serve en formato hexa
        this.postres = res; //recibo la respuesta del server que es el buffer 
        console.log("respuesta post: ", this.postres) //la respuesta esta en hex e de pasarla a utf8

    })
  }
}

async function encrypt(msg, key, iv) {
  // iv will be needed for decryption
  console.log('entra en encrypt: ',msg)
  iv = hex2ab2(iv); 
  key = hex2ab2(key);
  console.log('este es el iv '+ iv)
  const result = await window.crypto.subtle.importKey(
    "raw",
    key,
    "AES-CBC",
    true,
    ["encrypt", "decrypt"] 
  );
  console.log ('Importo la key')
  const ret = await window.crypto.subtle.encrypt({
      name: "AES-CBC",
      iv
    },
    result,
    msg
  );
console.log('Elresultado de la encriptacion'+ ret)
  return ret;
}

async function decrypt(msg, key, iv) {
  console.log('entra en decrypt ', msg)
  iv = hex2ab2(iv);
  key = hex2ab2(key);
  const result = await window.crypto.subtle.importKey(
    "raw",
    key,
    "AES-CBC",
    true,
    ["encrypt", "decrypt"]  
  );
  const ret = await window.crypto.subtle.decrypt(
    {
      name: "AES-CBC",
      iv
    },
    result,
    msg
  );
  console.log('func dec 2' + ret)
  return ret
}

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
  var typedArray = new Uint8Array(hex.match(/[\da-f]{2}/gi).map(function (h) {
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