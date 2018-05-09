import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

//引入config以及service
import { ConfigProvider } from '../../providers/config/config';
import { HttpServicesProvider } from '../../providers/http-services/http-services';

/**
 * Generated class for the HomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  public keywords = ''; //搜索关键字
  public list = null; //列表

  constructor(public navCtrl: NavController, public navParams: NavParams,public config: ConfigProvider,public httpService: HttpServicesProvider) {
    //获取列表
    //this.getList();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
  }

  //点击搜索
  getSearchList(){
    console.log('111');
  }

  //获取列表
  getList(){
    // this.httpService.requestData('/api/users/code',res => {
    //   console.log(res);
    // });
  }

}
