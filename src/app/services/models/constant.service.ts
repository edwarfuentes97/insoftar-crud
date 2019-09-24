import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConstantService {

  public IP = 'localhost';
  public API_URL_CONS = `http://${this.IP}:8080/wsinsoftar/`;

  constructor() { }
}
