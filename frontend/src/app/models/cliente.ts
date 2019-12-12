import { NgIf } from '@angular/common';

export class Cliente {
   name: string;
   pass: string;
   token: string;

constructor(name = "", pass = "",token = "" ){
    this.name = name,
    this.pass = pass,
    this.token = token
}}