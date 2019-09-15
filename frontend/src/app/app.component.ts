import { Component } from '@angular/core';
import { post } from 'selenium-webdriver/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'frontend';
  hola: any;
  p: any;
  
  get(){
    this.hola == "Hola mundo"
  }

  post(){
    this.hola = this.p 
  }
}


