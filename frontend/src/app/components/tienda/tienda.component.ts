import { Component, OnInit } from '@angular/core';
import { MainService } from 'src/app/services/main.service';
import { Router } from "@angular/router";
import * as bigintCryptoUtils from 'bigint-crypto-utils';
import {Moneda} from '../../models/moneda';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-tienda',
  templateUrl: './tienda.component.html',
  styleUrls: ['./tienda.component.css']
})
export class TiendaComponent implements OnInit {

  money : Moneda;
  respuesta;
  constructor(private mainService: MainService) { }

  ngOnInit() {
   
  }
  //consulta al banco si la moneda está gastada
  async ask_money(money: Moneda, value: Number){
    this.mainService.ask_money(money, value).subscribe(res =>{
      console.log('mensaje de salida ', res)
       //recibimos respuesta del banco
      this.respuesta = res;
    })
  }

}
//recibir moneda del comprador
function wastedMoney(money: Moneda){
}