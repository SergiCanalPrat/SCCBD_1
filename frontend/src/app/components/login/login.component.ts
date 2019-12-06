import { Component, OnInit, } from '@angular/core';
import { Router } from "@angular/router";
import { MainService } from 'src/app/services/main.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  name: String;
  password: String;

  constructor(private mainService: MainService, private router: Router) { }

  ngOnInit() {
  }


  goBANK(){
    console.log('el nombre', this.name,this.password);
   
    this.mainService.login(this.name, this.password).subscribe(res => {
      console.log('el token ', res)
      this.router.navigateByUrl('/bank');
    })  
  

  }

}
