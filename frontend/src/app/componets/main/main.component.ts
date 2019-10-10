import { Component, OnInit } from '@angular/core';
import { MainService } from 'src/app/services/main.service';
import { invalid } from '@angular/compiler/src/render3/view/util';

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
    this.iv = genIv()
  }
  async get(){
    const key = await genkey();
    var buf = new TextEncoder().encode(this.postres.toString());
    let enmens = await decrypt(key, buf, this.iv)


    this.mainService.get(enmens).subscribe(res =>{

      this.getres = res;
      console.log("respuesta",res)
    })
  }
  async post(){
    const key = await genkey();
    var buf = new TextEncoder().encode(this.mens);
    let mens = await encrypt(buf, key, this.iv)

    this.mainService.post(mens).subscribe(res =>{
     
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
  let encoded = msg
  // iv will be needed for decryption
  const ret = await window.crypto.subtle.encrypt(
    {
      name: "AES-CBC",
      iv
    },
    key,
    encoded
  );
  
  return ret;
}

async function decrypt(key, ciphertext,iv) {
  
  const ret = await window.crypto.subtle.decrypt(
    {
      name: "AES-CBC",
      iv: iv
    },
    key,
    ciphertext
  );
  return ret;
}

function genIv(){
  let iv = window.crypto.getRandomValues(new Uint8Array(16));
  return iv;
}