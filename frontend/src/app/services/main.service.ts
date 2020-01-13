import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Moneda } from '../models/moneda';


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
  monedero(id: Number){
    return this.http.post('http://localhost:3000/monedero' + `/${id}`, id)
  }

  post_money( value:Number, moneyblind: Object){
    return this.http.post('http://localhost:3000/postMoney' + `/${value}`+ `/${moneyblind}`, value );
  }



  //Esto para la tienda
  compra(money: string){
    return this.http.post('http://localhost:3010/compracliente' + `/${money}`, money );
  }
}