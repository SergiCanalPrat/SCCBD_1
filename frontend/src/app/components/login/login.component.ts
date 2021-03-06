import { Component, OnInit, } from '@angular/core';
import { Router } from "@angular/router";
import { MainService } from 'src/app/services/main.service';

import { Cliente } from '../../models/cliente';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  
  name: string;
  password: string;
  token: string;
  error;
  

  constructor(private mainService: MainService, private router: Router) { }

  ngOnInit() {
    
  }
  goBANK(){
    console.log('el nombre', this.name,this.password);  
    this.mainService.login(this.name, this.password).subscribe(res => {
      let token = res['token'];
      this.error = res['message'];
       
      //console.log('el token ', token)
      this.router.navigateByUrl('/bank/'+this.name);
          
    })  
  

  }
  goAutoBANK(){
    console.log('el nombre', this.name,this.password); 

    //console.log('el token ', token)
    this.router.navigateByUrl('/bank/'+this.name);
      
  }
}

