import { Component, OnInit } from '@angular/core';
import { MainService } from 'src/app/services/main.service';
import * as arrToString from 'arraybuffer-to-string';
//@ts-ignore

import * as hexToArrayBuffer from 'hex-to-array-buffer';
import * as bigintCryptoUtils from 'bigint-crypto-utils';
import {Moneda} from '../../models/moneda';
import * as CryptoJS from 'crypto-js';

@Component({
selector: 'app-main',
templateUrl: './main.component.html',
styleUrls: ['./main.component.css']
})

export class MainComponent implements OnInit {

//proyecto
	money : Moneda;
	message;

//------------ENTREGAS------------------//
getres: Object;
getres1: Object;
mens
postres: Object;
enmens: string;
iv;
key;
menshex;
postencrypt;

//Parametros de RSA
e;
d;
n;
dback;
nback;


constructor(private mainService: MainService) { }
ngOnInit() {
//PROYECTO

//ENTREGAS

//this.KeyRSA();
	/*this.mainService.getiv().subscribe(res => {
	this.dback = res;
	// console.log('valor de d ', this.dback)
	})
	this.mainService.getkey().subscribe(res => {
	this.nback = res;
	// console.log('valor de n ', this.nback)
	})*/
}


//PROYECTO
async money_req(value: number){ //peticion de la moneda
	//pasamos a cerar el papel de la moneda
	let id = Math.random()*1024
	//let id = CryptoJS.randomBytes(1024);
	this.money = new Moneda (id, value)
	console.log('papel creado', this.money)

	//MONEY creacion del hash
	let money_string = this.money.toString()
	let money_hash = CryptoJS.SHA256(money_string)
	console.log('hash del mensage ',money_hash)
	let money_hash_hex = money_hash.toString(CryptoJS.enc.Hex)
	console.log('hash en hex',money_hash_hex)

	//MONEY cegar papel  ---- m '\ equiv mr ^ {e} \ ({\ mathrm {mod}} \ N) ----
	//creo el factor de ciegamiento  f ^ {e} {modulo N}
	let f = await bigintCryptoUtils.prime(1024);
	let factor = bigintCryptoUtils.modPow(f,this.e,this.n);
	console.log('factor de cegamiento', factor);
	//ciego el hash con el factor m' = mr ^ {e} {modulo N)
	let money_big = BigInt('0x' + money_hash_hex);
	let product = money_big * factor;
	let money_blind = bigintCryptoUtils.modPow(product,this.e,this.n)
	console.log('money cegado ',money_blind)
	this.mainService.post_money(money_blind, value).subscribe(res =>{
    console.log('mesage de salida ', res)
    let key = this.KeyRSA(value);
    encryptRSA (money_blind, this.e, this.n)
		this.message = res;
	})
}

//ENTREGAS
async KeyRSA(value){
  let r ;
  if (value == 5){
    r = BigInt('5');
  }
  else if (value == 10){
    r = BigInt('10');

  }
  else if (value == 20){
    r = BigInt('20');

  }

  else {
    console.log('Wrong Value!!')
  }
	let p = await bigintCryptoUtils.prime(1024);
	let q = await bigintCryptoUtils.prime(1025);
	this.n = p * q;
	let phi_n = (p-r)*(q-r);
	this.e = BigInt('65537');
	this.d = bigintCryptoUtils.modInv(this.e, phi_n);


	/*this.mainService.postd(this.d).subscribe(res => {
		//console.log('valor de d ', this.dback)
	})
	this.mainService.postn(this.n).subscribe(res => {
	// console.log('valor de n ', this.nback)
	})*/
}
}
async function encryptRSA(msg,e,n){ // MANDAR EN HEXA
	//funcion para encriptar RSA
//let msgbuf = .from(msg,'utf8');
  let msgbig = BigInt('0x' + msg)
  console.log('men en big', msgbig);
  let cryptedRSA = bigintCryptoUtils.modPow(msgbig, e, n)
	return cryptedRSA; //convertir a strng 16 depende de como quiero la respuesta
}


/*
async get() {
	console.log('empezamos en GET  ')
	// mensaje
	this.mainService.get().subscribe(async res =>{
	this.postres = res;
	//console.log('El mensaje proveniente del server: ' + JSON.stringify(this.postres[0]))
	//this.getres1 = buf2hex(Object.values(this.postres)[1]);
	// let decmens = await decrypt( hex2ab2(this.getres1), this.key, this.iv)
	let decmens = await decryptRSA(this.postres, this.dback, this.nback)
	console.log('DECRYPT FET= ', decmens)
	/* this.getres = stringToHex(Object.values(this.postres));
	let decmenshex = buf2hex(decmens);
	console.log('comprobacion ' + decmenshex);
	this.enmens = decmenshex.toString();
	console.log('comprebacion 2.0'+ this.enmens)
	})
}
async post(){
	//encripto el mensaje y lo envio, espero que mjuetre por pantalla el mensaje encriptado
	//creo la clave del cliente
	this.menshex = stringToHex(this.mens)
	console.log('este es mi mens to hex: ' + this.menshex)
	//let cipher = await encrypt(hex2ab2(this.menshex), this.key, this.iv) //los datos han de estar en arraybuffer
	console.log('la e ',this.e)
	let cipher = await encryptRSA(this.menshex, this.e, this.n)
	this.postencrypt = cipher.toString(16)
	console.log('decoded msg - comprobación: ' + this.postencrypt)
	this.mainService.post(this.postencrypt).subscribe(res => { //envio el mensage al serve en formato hexa
		//this.postres = res; //recibo la respuesta del server que es el buffer
		console.log("respuesta post2: ", this.postres) //la respuesta esta en hex e de pasarla a utf8

	})

}*/
//CIERRA EXPORT
/*
async function encrypt(msg, key, iv) {
// iv will be needed for decryption
console.log('entra en encrypt: ',msg)
// iv = hex2ab2(iv);
//key = hex2ab2(key);
// console.log('este es el iv '+ iv)
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
console.log('El resultado de la encriptacion ' + ret)
return ret;
}
async function decrypt(msg, key, iv) {
console.log('entra en decrypt ', msg)

iv = hex2ab2(iv);
console.log ('IV: ', iv)

console.log ('Key: ', key)
key = hex2ab2(key);

console.log ('ENTRA AL CONST RESULT: ', key)

const privateKey = await window.crypto.subtle.importKey(
	"raw",
	key,
	"AES-CBC",
	true,
	["encrypt", "decrypt"]
);

console.log ('importKey fet: ', key)
console.log ('iv: ', iv)
console.log ('privateKey: ', privateKey)
console.log ('msg: ', msg)

//DOM EXCEPTION

const ret = await window.crypto.subtle.decrypt(
	{
	name: "AES-CBC",
	iv
	},
	privateKey,
	msg
);

console.log ('surt del ret: ', ret)

return ret;


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
	//str += d2h(c) + ' ';
	str += d2h(c);
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
async function encryptRSA(msg,e,n){ // MANDAR EN HEXA
	//funcion para encriptar RSA
//let msgbuf = .from(msg,'utf8');
let msgbig = BigInt('0x' + msg)
console.log('men en big', msgbig);
let cryptedRSA = bigintCryptoUtils.modPow(msgbig, e, n)
	return cryptedRSA; //convertir a strng 16 depende de como quiero la respuesta
}
async function decryptRSA(msg,d,n){ //funcion para desencryptar RSA
let msgbig = BigInt('0x' + msg);
let dbig = BigInt('0x' + d);
let nbig = BigInt('0x' + n);
console.log('el message  ', msgbig)
let decryptRSA  = bigintCryptoUtils.modPow(msgbig, dbig, nbig);
let decrypt = decryptRSA.toString(16);
let decryptHex = hexToArrayBuffer(decrypt);
let decryptedRSA = arrToString(decryptHex);
console.log('desencriptado  ', decryptedRSA)
	return decryptedRSA;
}*/


//Funciones de PROYECTO




function crearMoney() {//le llegaria la firma y el hash

}
function compra (moneda: Moneda) {
}


