import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MainService {

  constructor(private http: HttpClient) { }
  getiv(){
    return this.http.get('http://localhost:3000/getiv')
  }

  getkey(){
    return this.http.get('http://localhost:3000/getkey')
  }
  postn(n: Object){
    return this.http.post('http://localhost:3000/postn'+  `/${n}` , n)
  }

  postd(d: Object){
    return this.http.post('http://localhost:3000/postd'+  `/${d}` , d)
  }
  get() {
  return this.http.get('http://localhost:3000/get');
  } 

  post(mens: Object){
    console.log("envio", mens)
    return this.http.post('http://localhost:3000/post' +  `/${mens}` , mens);
  }

  //RUTAS DEL PROYECTO
  post_money(moneyblind: Object, id:Number){
    return this.http.post('http://localhost:3000/postMoney' + `/${id}`, moneyblind );
  }
}