import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders, HttpRequest, HttpEvent, HttpEventType } from '@angular/common/http';
import { ConstantService } from './constant.service';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  private headers;




  constructor(private http: HttpClient,
              public constant: ConstantService) {

  }

  private create_headers() {
    this.headers = new HttpHeaders();

    this.headers = this.headers.append('Access-Control-Allow-Origin', '*');

    // this.headers.append('cmy', this.lcCmy);
    // this.headers.append('etp', this.lcEtp);
    /* if (this.lcMch !== undefined) {
       this.headers.append('mch', this.lcMch);
     }*/
  }

  public getBy(id) {
    this.create_headers();
    const url = `${this.constant.API_URL_CONS}getBy/${id}`;
    return this.http.get(url, { headers: this.headers, reportProgress: true }).pipe(res => res);
  }

  public getAll(data: any) {
    this.create_headers();
    const url = `${this.constant.API_URL_CONS}getAll`;
    const body = JSON.stringify(data);
    return this.http.post(url, body, { headers: this.headers, reportProgress: true }).pipe(res => res);
  }


  public save(data: any) {
    this.create_headers();
    const url = `${this.constant.API_URL_CONS}save`;
    const body = data;
    return this.http.post(url, body, { headers: this.headers }).pipe(res => res);
  }

  public update( data: any) {
    this.create_headers();
    const url = `${this.constant.API_URL_CONS}update`;
    const body = data;
    return this.http.put(url, body, { headers: this.headers }).pipe(res => res);
  }

  public delete( id: any) {
    this.create_headers();
    const url = `${this.constant.API_URL_CONS}delete/${id}`;
    return this.http.delete(url, { headers: this.headers }).pipe(res => res);
  }


}
