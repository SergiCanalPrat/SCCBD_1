import { NgIf } from '@angular/common';
import { Moneda } from './moneda';

export class Cliente {
   name: string;
   pass: string;
   token: string;
   monedas: Moneda[];

constructor(name = "", pass = "",token = "", monedas = [] ){
    this.name = name,
    this.pass = pass,
    this.token = token,
    this.monedas = monedas
}}