import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  hola: any;
  p: string;
  
  
  constructor() {  }

  ngOnInit() {
  }
  get(){
    this.hola = "Hola mundo";    
    console.log(this.hola)
  }

  post(){
    this.hola = this.p;
    console.log(this.p)
  }

}
