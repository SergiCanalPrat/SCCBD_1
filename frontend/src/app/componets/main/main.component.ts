import { Component, OnInit } from '@angular/core';
import { MainService } from 'src/app/services/main.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  getres: Object;
  mens: string;
  name: string;
  postres: Object;
    
  constructor(private mainService: MainService) { 
    this.mens = "";
    this.name = "";
   }

  ngOnInit() {
  }

  get(){
    this.mainService.get().subscribe(res =>{
      this.getres = res;
      console.log("respuesta",res)
    })
  }

  post(){
    this.mainService.post(this.mens).subscribe(res =>{
      this.postres = res;
      console.log(this.postres, this.mens, res.toString())
    })
    
  }

}
