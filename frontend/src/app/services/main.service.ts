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

  get(mens: Object) {
  return this.http.get('http://localhost:3000/get');
  } 

  post(mens: Object){
    console.log("envio", mens)
    return this.http.post('http://localhost:3000/post' +  `/${mens}` , mens);
  }
}