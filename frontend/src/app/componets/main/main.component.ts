import { Component, OnInit } from '@angular/core';
import { MainService } from 'src/app/services/main.service';
import { invalid } from '@angular/compiler/src/render3/view/util';
import { Buffer } from 'buffer'
import { toBase64String } from '@angular/compiler/src/output/source_map';

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
  iv: Object;
  key: CryptoKey;

  constructor(private mainService: MainService) { }
  ngOnInit() {

  }
  async get() {
    console.log('empezamos get1')
    console.log('este es el postres que tengo: ' + this.postres)
    //let enmens = ab2str(this.postres)
    let enmens = this.postres
    console.log('empezamos get2')
    /* this.mainService.get(enmens).subscribe(res => {
      console.log('empezamos get3')
      this.getres = str2ab(res);
      console.log("respuesta",res)
    })
    console.log('llega hasta antes cambiar de nuevo a ArrayBuffer')
     //enmens = str2ab(this.getres);
     console.log('llega hasta antes de final 1')
     enmens = await decrypt(this.key, this.getres, this.iv)
     console.log("respuesta final1:",enmens)
     enmens = ab2str(enmens);
     this.mens = enmens;
  }*/
/*
  async get(){    
    const key = await genkey(); //epera a que le pase la clave   
    this.mens = String(this.postres); //this.postres.toString()    
    var buf = new TextEncoder().encode(this.mens); //encripted message    

    let enmens = await decrypt(key, buf, this.iv);
    console.log("get");
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
    this.iv = genIv()
    console.log('este es mi iv' + this.iv)
    this.key = await genkey();
    console.log('este es mi mens1: ' + this.mens)

    //var buf = new TextEncoder().encode(this.mens);
    this.mens = stringToHex(this.mens)
    console.log('este es mi mens to hex: ' + this.mens)
    let mens = await encrypt(hex2ab(this.mens), this.key, this.iv)
    console.log('este es el mensaje que envio al server: ' + mens)

    //var mens1 = new TextDecoder().decode(mens)
    var mens1 = ab2hex(mens);

    console.log('decoded msg - comprobación: ' + mens1)
    //si aquí enviamos mens, estaremos enviando un Object ArrayBuffer que siempre es el mismo
    //si ponemos mens1, estaremos enviando un string cifrado
     this.mainService.post(mens1).subscribe(res => {
      console.log('este es mi mens2: ' + mens)
      console.log('esta es mi res: ' + res)
      this.postres = res;
      console.log("respuesta post: ", res)
    })
  }

  generate() {
    self.crypto.subtle.generateKey(
      {
        name: "AES-CBC",
        length: 256,
      }, false,
      ["encrypt", "decrypt"]
    )
      .then(function (key) {
        console.log(key);
        // return key;
      })
    /*.catch(function (err) {
      console.error(err);
    });*/
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

async function encrypt(msg, key, iv) {
  // iv will be needed for decryption
  const ret = await self.crypto.subtle.encrypt(
    {
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

function genIv() {
  let iv = self.crypto.getRandomValues(new Uint8Array(16));
  return iv;
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