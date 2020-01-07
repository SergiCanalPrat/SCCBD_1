import { Component, OnInit } from '@angular/core';
import { MainService } from 'src/app/services/main.service';
import * as arrToString from 'arraybuffer-to-string';
import { Router, ActivatedRoute} from "@angular/router";
//@ts-ignore

import * as hexToArrayBuffer from 'hex-to-array-buffer';
import * as bigintCryptoUtils from 'bigint-crypto-utils';
import * as CryptoJS from 'crypto-js';

import { Moneda } from '../../models/moneda';
import { Cliente } from '../../models/cliente';

@Component({
selector: 'app-main',
templateUrl: './main.component.html',
styleUrls: ['./main.component.css']
})

export class MainComponent implements OnInit {

//proyecto
	money : Moneda;
	cliente: Cliente;
	user;
	monedero: Number[];
//Parametros de RSA
e;
d;
n;
dback;
nback;

constructor(private mainService: MainService, private activatedRouter: ActivatedRoute) { 
 this.cliente = new Cliente("","","",[])
 this.money =new Moneda(null,null,"")
}
ngOnInit() {
//PROYECTO
this.activatedRouter.params.subscribe(params => {
    if (typeof params['name'] !== 'undefined') {
	  this.cliente.name = params['name'];  
	  this.user = this.cliente.name;    
    } else {
	  this.cliente.name = '';
	}
})
//ENTREGAS
this.KeyRSA();	
}

//PROYECTO
async KeyRSA(){
	let u = BigInt('1');
	let p = await bigintCryptoUtils.prime(1024);
	let q = await bigintCryptoUtils.prime(1025);
	this.n = p * q;
	let phi_n = (p-u)*(q-u);
	this.e = BigInt('65537');
	this.d = bigintCryptoUtils.modInv(this.e, phi_n);
}

async money_req(value: number){ //peticion de la moneda
	//Creamos el papel de la moneda
	let id = bigintCryptoUtils.randBytes(128);
	this.money = new Moneda (id, value)
	//console.log('papel creado', this.money)
	//MONEY creacion del hash
	let money_string = this.money.toString()
	let money_hash = CryptoJS.SHA256(money_string)
	//console.log('hash del mensage ',money_hash)
	let money_hash_hex = money_hash.toString(CryptoJS.enc.Hex)
	//console.log('hash en hex',money_hash_hex)
	//MONEY cegar papel  ---- m '\ equiv mr ^ {e} \ ({\ mathrm {mod}} \ N) ----
	//creo el factor de ciegamiento  f ^ {e} {modulo N}
	let f = await bigintCryptoUtils.prime(1024);
	let factor = await bigintCryptoUtils.modPow(f,this.e,this.n);
	//console.log('factor de cegamiento', factor);
	//ciego el hash con el factor m' = mr ^ {e} {modulo N)
	let money_big = BigInt('0x' + money_hash_hex);
	let product = money_big * factor;
	let money_blind = bigintCryptoUtils.modPow(product,this.e,this.n)
	console.log('money cegado ',money_blind)
	this.mainService.post_money(value, money_blind).subscribe(res =>{
		console.log('mesage de salida ', res) //ya tengo la firma de la moneda
		//descegamos la moneda firmada
		let blind_factor_money = BigInt('0x' + res);	
		let productf = blind_factor_money * factor;
		let blind_money = bigintCryptoUtils.modPow(productf,this.e,this.n)
		this.create_coin(id, value, blind_money);
	})
}
//pasamos a crear la moneda
create_coin(id, value, blind) {
	
	this.money = new Moneda(id,value,blind)
	console.log('creamos la coin con los datos', this.money)
	//sumamos la moneda al monedaro del cliente
	let leng = this.cliente.monedas.push(this.money)
	console.log('monedas  ',leng, this.cliente.monedas)
	//mostramos en la pantalla las monedas del cliente
}
compra_req (){
	//enviar la peticion de compra a la tienda
	this.mainService.post_compra(this.money.toString(), this.money.valor).subscribe(res =>{
		console.log('estado de la compra', res);
	})
}
//ENTREGAS
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
	}
	





//CONVERSIONES
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

