import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MainService {

  constructor(private http: HttpClient) { }
  get(mens2: Object){
    console.log("recibo", mens2)
  return this.http.get('http://localhost:3000/get'+  `/${mens2}` , mens2);
  } 
  post(mens: Object){
    console.log("envio", mens)
    return this.http.post('http://localhost:3000/post' +  `/${mens}` , mens);
  }
}