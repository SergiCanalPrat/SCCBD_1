import { Component, OnInit } from '@angular/core';
import { MainService } from 'src/app/services/main.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  hola: Object;
  mens: string;
  name: string;
    
  constructor(private mainService: MainService) { 
    this.mens = "";
    this.name = "";
   }

  ngOnInit() {
  }

  get(){
    //this.hola = "Hola mundo";    
    console.log(this.hola)
    this.mainService.get().subscribe(res =>{
      this.hola = res;
      console.log("respuesta",res)
    })
  }

  post(){
    this.mainService.post(this.mens).subscribe(res=>{
      this.hola = res;
      console.log(this.hola, this.mens, res)
    })
    
  }

}
