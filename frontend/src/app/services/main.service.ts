import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MainService {

  constructor(private http: HttpClient) { }
  get(){
  return this.http.get('http://localhost:3000/get');
  } 
  post(mens: string){
    return this.http.post('http://localhost:3000/post', mens);
  }
}