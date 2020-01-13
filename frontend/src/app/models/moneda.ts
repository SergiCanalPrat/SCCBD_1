import { NgIf } from '@angular/common';

export class Moneda {
    _id: number;
    id: string;
    valor: number;
    firma: string

constructor(_id= 0 , id = "", valor = 0, firma = ''){
    this._id =_id;
    this.id = id;
    this.valor = valor;
    this.firma = firma;
}}