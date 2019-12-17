import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Script } from 'vm';

@Injectable({
  providedIn: 'root'
})
export class MainService {

  constructor(private http: HttpClient) { }
 
  //RUTAS DEL PROYECTO
  login(name:String, pass:String){
    return this.http.post('http://localhost:3000/login' + `/${name}`, pass )
  }
  post_money(moneyblind: Object, value:Number){
    return this.http.post('http://localhost:3000/postMoney' + `/${value}`, moneyblind );
  }
  post_compra(user: Script, moneyblind: Object){
    return this.http.post('http://localhost:3000/postCompra' +`/${user}` , moneyblind );
  }

  //Esto para la tienda
  compra(money: Object, value:Number){
    return this.http.post('http://localhost:3010/compra' + `/${value}`, money );
  }
}