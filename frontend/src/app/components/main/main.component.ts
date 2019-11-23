import { Component, OnInit } from '@angular/core';
import { MainService } from 'src/app/services/main.service';
import * as arrToString from 'arraybuffer-to-string';
//@ts-ignore
import * as hexToArrayBuffer from 'hex-to-array-buffer';
import * as bigintCryptoUtils from 'bigint-crypto-utils';



@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})

export class MainComponent implements OnInit {

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
  d;
  n;
  e;
  nfront;
  dfront;

  constructor(private mainService: MainService) { }
  ngOnInit() {
    this.mainService.getiv().subscribe(res => {
       this.d = res;
      console.log('valor de d ', this.d)
    })
    this.mainService.getkey().subscribe(res => {
      this.n = res;
      console.log('valor de n ', this.n)
    })

  }

  async get() {
    console.log('empezamos en GET  ')
    // mensaje
    this.mainService.get(this.postres[0]).subscribe(async res =>{
      this.postres = res;
      //console.log('El mensaje proveniente del server: ' + JSON.stringify(this.postres[0]))

      //this.getres1 = buf2hex(Object.values(this.postres)[1]);
     // let decmens = await decrypt( hex2ab2(this.getres1), this.key, this.iv)
     let decmens = await decryptRSA(this.postres, this.d, this.n)
      console.log('DECRYPT FET= ', decmens)
     /* this.getres = stringToHex(Object.values(this.postres));
      let decmenshex = buf2hex(decmens);
      console.log('comprobacion ' + decmenshex);
      this.enmens = decmenshex.toString();
      console.log('comprebacion 2.0'+ this.enmens)*/
    })
  }

  async post(){
    //encripto el mensaje y lo envio, espero que mjuetre por pantalla el mensaje encriptado
    let p = await bigintCryptoUtils.prime(1024);
    let q = await bigintCryptoUtils.prime(1025);
    console.log ("initial front_n is: " + this.nfront)
    this.nfront = p * q;
    console.log ("new front_n is: " + this.nfront)
    let r = BigInt('1');
    let phi_n = (p-r)*(q-r);
    this.e = BigInt('65537');
    this.dfront = bigintCryptoUtils.modInv(this.e, phi_n);

    this.menshex = stringToHex(this.mens)
    console.log('este es mi mens to hex: ' + this.menshex)
    //let cipher = await encrypt(hex2ab2(this.menshex), this.key, this.iv) //los datos han de estar en arraybuffer
    let cipher = await encryptRSA(this.menshex, this.e, this.nfront) //los datos han de estar en arraybuffer
    // this.postencrypt = buf2hex(cipher)
    let new_cipher = {mensaje: cipher, d: this.dfront, n: this.nfront};
    new_cipher = JSON.stringify(new_cipher)
    console.log('encrtypted msg - comprobación: ' + cipher);
    console.log('encrtypted msg - comprobación2: ' + new_cipher.mensaje + new_cipher.d + new_cipher.n);
      this.mainService.post(new_cipher).subscribe(res => { //envio el mensage al serve en formato hexa
        console.log("respuesta post1: ")
        this.postres = res; //recibo la respuesta del server que es el buffer
        console.log("respuesta post2: ", this.postres) //la respuesta esta en hex e de pasarla a utf8

    })
  }
}

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


//FUNCIONES RSA
//funcion para crear key RSA
async function KeyRSA(front_n, front_e, front_d){
	let p = await bigintCryptoUtils.prime(1024);
  let q = await bigintCryptoUtils.prime(1025);
  console.log ("initial front_n is: " + front_n)
  front_n = p * q;
  console.log ("new front_n is: " + front_n)
	let r = BigInt('1');
  let phi_n = (p-r)*(q-r);
  front_e = BigInt('65537');
	front_d = bigintCryptoUtils.modInv(front_e, phi_n);
}
//funcion para encriptar RSA
async function encryptRSA(msg,e,nfront){ // MANDAR EN HEXA
  //let msgbuf = .from(msg,'utf8');

  let msghex = msg.toString();
	let msgbig = BigInt('0x' + msghex);
  let cryptedRSA = bigintCryptoUtils.modPow(msgbig, e, nfront)
	return cryptedRSA; //convertir a strng 16 depende de como quiero la respuesta
}
//funcion para desencryptar RSA
async function decryptRSA(msg,d,n){
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
