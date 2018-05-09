import { HttpClient, Jsonp, Headers } from '@angular/common/http';
import { Injectable } from '@angular/core';

//引入config
import { ConfigProvider } from '../../providers/config/config';
import { Observable } from 'rxjs';
import 'rxjs/Rx';

/*
  Generated class for the HttpServicesProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class HttpServicesProvider {

  //设置post的格式
  private headers = new Headers({ "Content-Type": "application/json" });

  constructor(public http: HttpClient, public jsonp: Jsonp, public config: ConfigProvider) {
    console.log('Hello HttpServicesProvider Provider');
  }

  requestData(apiUrl, callback) {
    let api = '';

    console.log(apiUrl);
    api = this.config.apiUrl + apiUrl;

    this.http.get(api).map(res => res.json()).subscribe(res => {
      callback(res);
    }, err => {
      console.log(err);
    });
  }

  doPost(apiUrl,json,callback){
    let api = this.config.apiUrl + apiUrl;

    this.http.post(api,JSON.stringify(json),{headers: this.headers}).subscribe(res => {
      callback(res.json());
    });
  }

}
