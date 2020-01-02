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
    return this.http.post('http://localhost:3000/login' + `/${name}`+ `/${pass}`, name )
  }

  post_money( value:Number, moneyblind: Object){
    return this.http.post('http://localhost:3000/postMoney' + `/${value}`+ `/${moneyblind}`, value );
  }

  post_compra(user: String, money: Object){
    return this.http.post('http://localhost:3000/postCompra' +`/${user}`+ `/${money}` , money );
  }

  //Esto para la tienda
  compra(money: Object, value:Number){
    return this.http.post('http://localhost:3010/compra' + `/${value}` + `/${money}`, money );
  }
}