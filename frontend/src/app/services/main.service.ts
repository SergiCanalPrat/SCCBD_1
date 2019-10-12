import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MainService {

  constructor(private http: HttpClient) { }
  get(mens: Object){
    console.log("recibo", mens)
  return this.http.get('http://localhost:3000/get'+  `/${mens}` , mens);
  } 
  post(mens: Object){
    console.log("envio", mens)
    return this.http.post('http://localhost:3000/post' +  `/${mens}` , mens);
  }
}