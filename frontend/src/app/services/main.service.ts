import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class MainService {

  constructor(private http: HttpClient) { }
 
  //RUTAS DEL PROYECTO
  login(name:String, pass:String){
    return this.http.post('http://localhost:3000/login' + `/${name}`+ `/${pass}`, name )
  }

  cuenta(name:String){
    return this.http.post('http://localhost:3000/cuenta' + `/${name}`, name)
  }

  post_money( value:Number, moneyblind: Object){
    return this.http.post('http://localhost:3000/postMoney' + `/${value}`+ `/${moneyblind}`, value );
  }

  //Esto para la tienda
  compra(money: Object){
    return this.http.post('http://localhost:3010/compracliente' + `/${money}`, money );
  }
}