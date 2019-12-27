import { NgIf } from '@angular/common';

export class Moneda {
    _id: number;
    valor: number;
    firma: string

constructor(_id= 0 , valor = 0, firma = ''){
    this._id =_id;
    this.valor = valor;
    this.firma = firma;
}}