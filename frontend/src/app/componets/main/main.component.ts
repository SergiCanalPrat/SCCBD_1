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
  iv
  key: CryptoKey;
  menshex
  postencrypt

  //Parametros de RSA
  n
  e
  d
  
  constructor(private mainService: MainService) { }
  ngOnInit() {

    //llamar a la funcion para generar las claves
  }
  async get() {
    console.log('empezamos en GET')
    this.mainService.get(this.postres).subscribe(async res =>{
      this.getres = res;
      console.log('getres: ', this.getres)
      let decmens = await decrypt(this.key, this.getres,this.iv)
      let decmenshex = buf2hex(decmens);
      this.enmens = decmenshex.toString();
      console.log('respuesta del get'+ this.enmens)
    })
    //console.log('este es el postres que tengo: ' + this.postres)
    //let enmens = ab2str(this.postres)
    //console.log('empezamos get2')
    /* this.mainService.get(enmens).subscribe(res => {
      console.log('empezamos get3')
      this.getres = str2ab(res);
      console.log("respuesta",res)
    })
    console.log('llega hasta antes cambiar de nuevo a ArrayBuffer')
     //enmens = str2ab(this.getres);
     console.log('llega hasta antesdnyjsrhsede final 1  '+ this.getres)
     enmens = await decrypt(this.key, this.getres, this.iv)
     console.log("respuesta final1:",enmens)
     enmens = ab2str(enmens);
     this.mens = enmens;
  }*/
/*
  async get(){    
    const key = await genkey(); //epera a que le pase la clave   
    this.mens = String(this.postres); //this.postres.toString()    
    var buf =  new TextEncoder().encode(this.mens); //encripted message    
    console.log("get1");
    let enmens = await decrypt(key, buf, this.iv)

    console.log("get11");
    this.mainService.get(enmens).subscribe(res =>{
      this.getres = res;
      console.log("respuesta get: ",res)
    })
    //desencriptar
    self.crypto.subtle.decrypt(
      {
        name: "AES-CBC",
        iv: new ArrayBuffer(16),
      },
      this.key,
      data = this.getres,
    )*/
  }

  async post(){
    this.iv = genIv() //como lo genero
    console.log('este es mi iv ' + this.iv)    
    console.log('este es mi mens1: ' + this.mens)
    this.key = await genkey();
    console.log('esta es la key '+ this.key)
    this.menshex = stringToHex(this.mens)
    console.log('este es mi mens to hex: ' + this.menshex)
    let cipher = await encrypt(hex2ab2(this.menshex), this.key, this.iv)
    // let cipherRSA = await encryptRSA(this.menshex)  --> encriptar mensahe RSA
    console.log('este es el mensaje que envio al server: '+ cipher)
    //var mens1 = new TextDecoder().decode(mens)
    this.postencrypt = buf2hex(cipher)
    console.log('decoded msg - comprobación: ' + this.postencrypt)
    //si aquí enviamos mens, estaremos enviando un Object ArrayBuffer que siempre es el mismo
    //si ponemos mens1, estaremos enviando un string cifrado
      this.mainService.post(this.postencrypt).subscribe(res => {
     // this.postres = JSON.stringify(res);
     this.postres = res;
      console.log("respuesta post: ", this.postres)
    })
  }
}

async function genkey() {
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
}

async function encrypt(msg, key, iv) {
  // iv will be needed for decryption
  console.log('entra en encrypt: ',msg)
  const ret = await window.crypto.subtle.encrypt({
      name: "AES-CBC",
      iv
    },
    key,
    msg
  );
console.log('Elresultado de la encriptacion'+ ret)
  return ret;
}

async function decrypt(key, ciphertext1, iv) {
  console.log('func dec 1: ', ciphertext1)
  let ciphertext2 = hex2ab2(ciphertext1)
  console.log('Hace de hex2ab correctamente: ', ciphertext2)
  const ret = await self.crypto.subtle.decrypt(
    {
      name: "AES-CBC",
      iv
    },
    key,
    ciphertext2
  )
  console.log('func dec 2')
  return ret
}

function hex2ab(hex) {
  var typedArray = new Uint8Array(hex.match(/[\da-f]{2}/gi).map(function(h){
    return parseInt(h,16)
  }))
  return typedArray.buffer;
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