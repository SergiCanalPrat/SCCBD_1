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

  constructor(private mainService: MainService, private router: Router) { }

  ngOnInit() {
    
  }
  


  goBANK(){
    console.log('el nombre', this.name,this.password);
      
    this.mainService.login(this.name, this.password).subscribe(res => {
      console.log('el token ', res)
      this.token = res.toString();
      this.router.navigateByUrl('/bank');

      //Creamos un cliente
      let cliente = new Cliente (this.name, this.password, this.token);
      console.log('el nuevo cliente es: ', cliente)


    })  
  

  }

}
