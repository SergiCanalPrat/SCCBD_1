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
  mens: string;
  postres: Object;
  enmens: string;
  iv: Object;
  key: CryptoKey;

  constructor(private mainService: MainService) {}
  ngOnInit() {
    
  }
   async get(){
    console.log('empezamos get1')
    var buf  = str2ab(this.postres);
    console.log('este es el postres que tengo: '+this.postres)
    console.log('empezamos get2')
    let enmens = decrypt(this.key, buf, this.iv)
    console.log('empezamos get3')
    this.mainService.get(enmens).subscribe(res =>{
      console.log('empezamos get4')
      this.getres = res;
      console.log("respuesta",res)
    })
  }
  
  async post(){
    this.iv = genIv()
    console.log('este es mi iv'+this.iv)
    this.key = await genkey();
    console.log('este es mi mens1: '+this.mens)

    //var buf = new TextEncoder().encode(this.mens);
    var buf = str2ab(this.mens);

    console.log('este es mi buf: '+buf)
    let mens = await encrypt(buf, this.key, this.iv)
    console.log('este es el mensaje que envio al server: '+mens)

    //var mens1 = new TextDecoder().decode(mens)
    var mens1 = ab2str(mens);
  
    console.log('decoded msg - comprobación: '+ mens1)
    //si aquí enviamos mens, estaremos enviando un Object ArrayBuffer que siempre es el mismo
    //si ponemos mens1, estaremos enviando un string cifrado
    this.mainService.post(mens1).subscribe(res =>{
      console.log('este es mi mens2: '+mens)
      console.log('esta es mi res: '+res)
      this.postres = res;
      console.log("Respuesta", res)
    })
  }
}

 async function genkey(){
  let key = await window.crypto.subtle.generateKey(
    {
      name: "AES-CBC",
      length: 256
    },
    true,
    ["encrypt", "decrypt"]
  );
  return key;
}

async function encrypt(msg, key, iv){
  // iv will be needed for decryption
  const ret = await window.crypto.subtle.encrypt(
    {
      name: "AES-CBC",
      iv
    },
    key,
    msg
  );
  
  return ret;
}

async function decrypt(key, ciphertext,iv) {
  console.log('func dec 1')
  const ret = window.crypto.subtle.decrypt(
    {
      name: "AES-CBC",
      iv: iv
    },
    key,
    ciphertext
  );
  console.log('func dec 2')
  return ret;
}

function genIv(){
  let iv = window.crypto.getRandomValues(new Uint8Array(16));
  return iv;
}

function ab2str(buf) {
  return String.fromCharCode.apply(null, new Uint16Array(buf));
}
function str2ab(str) {
  var buf = new ArrayBuffer(str.length*2); // 2 bytes for each char
  var bufView = new Uint16Array(buf);
  for (var i=0, strLen=str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}