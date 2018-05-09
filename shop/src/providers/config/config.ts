//import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the ConfigProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ConfigProvider {

  //api请求地址
  public apiUrl = 'http://www.mjpai.cn:3100';

  constructor() {
    console.log('Hello ConfigProvider Provider');
  }

}
