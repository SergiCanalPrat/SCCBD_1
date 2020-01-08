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

  post_money( value:Number, moneyblind: Object){
    return this.http.post('http://localhost:3000/postMoney' + `/${value}`+ `/${moneyblind}`, value );
  }

<<<<<<< HEAD
  //Esto para la tienda
  compra(money: Object){
    return this.http.post('http://localhost:3010/compra' + `/${money}`, money );
=======
    //Esto para la tienda
  post_compra(money: Object, value:Number){
    return this.http.post('http://localhost:3010/compra' + `/${value}` + `/${money}`, money );
>>>>>>> cb09dd866e0bc94d5ac33373f2ba2428801f0310
  }
}