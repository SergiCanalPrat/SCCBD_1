import { Component, OnInit } from '@angular/core';
import { MainService } from 'src/app/services/main.service';
import { invalid } from '@angular/compiler/src/render3/view/util';
import { Buffer } from 'buffer';
import { toBase64String } from '@angular/compiler/src/output/source_map';
import { ThrowStmt } from '@angular/compiler';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})

export class MainComponent implements OnInit {
  getres: Object;
  mens: string;
  postres: string;
  enmens: string;
  iv: Object;
  key: CryptoKey;
  menshex: string;
  cipher: void | ArrayBuffer;

  constructor(private mainService: MainService) { }
  ngOnInit() {

  }
  async get() {
    var util = require('util')
    console.log('emepazmo en GET')
    this.mainService.get(this.postres).subscribe(res =>{
      this.getres = res.toString();
      console.log('respuesta del get', util.inspect(this.getres))
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
    genkey().then(key => console.log('esta es la key ', key))
    //var buf = new TextEncoder().encode(this.mens);
    this.menshex = await stringToHex(this.mens);
    stringToHex(this.mens).then(mensHex =>
      console.log('este es mi mens to hex: ' + mensHex)
    )
    let mensHexToAb = hex2ab(this.menshex);
    this.cipher = await encrypt(mensHexToAb, this.key, this.iv).then(
      ret => console.log('El resultado de la encriptacion'+ ret + '\n' +
        'este es el mensaje que envio al server: '+ this.cipher)
    )
    //var mens1 = new TextDecoder().decode(mens)
    var cipherhex = ab2hex(this.cipher)
    console.log('decoded msg - comprobación: ' + cipherhex)
    //si aquí enviamos mens, estaremos enviando un Object ArrayBuffer que siempre es el mismo
    //si ponemos mens1, estaremos enviando un string cifrado
      this.mainService.post(cipherhex).subscribe(res => {
      this.postres = res.toString();
      console.log("respuesta post: ", res.toString())
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
}function genIv() {
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
  return ret;
}

async function decrypt(key, ciphertext, iv) {
  console.log('func dec 1')
  ciphertext = hex2ab(ciphertext)
  const ret = self.crypto.subtle.decrypt(
    {
      name: "AES-CBC",
      iv
    },
    key,
    ciphertext
  ).then(
    function(ciphertext){
      console.log("respuesta final2:", ciphertext)
      ciphertext = ab2hex(ciphertext);
      this.mens = ciphertext;
      console.log("respuesta final1:", ciphertext)
    });
}

function ab2hex(buf) {
  return buf.toString('hex');
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
async function stringToHex (tmp) {
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
