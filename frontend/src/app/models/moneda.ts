import { NgIf } from '@angular/common';

export class Moneda {
    _id: number;
    valor: number;

constructor(_id= 0 , valor = 0){
    this._id =_id;
    this.valor = valor;
}}