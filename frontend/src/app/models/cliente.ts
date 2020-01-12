import { NgIf } from '@angular/common';
import { Moneda } from './moneda';

export class Cliente {
    _id: number;
   Titular: string;
   Password: String;
   Saldo: Number;
   Monedas5: Moneda;
   Monedas10: Moneda;
   Monedas20: Moneda;


constructor(id: 0, name = "", pass = "",saldo = null, monedas5 = null, monedas10 = null, monedas20 = null ){
    this._id = id,
    this.Titular = name,
    this.Password = pass,
    this.Saldo = saldo,
    this.Monedas5 = monedas5,
    this.Monedas10 = monedas10,
    this.Monedas20 = monedas20

}}