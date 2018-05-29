//APP的配置
var AppConfig = {
	rootPath: 'http://test.wx.nuozhe8.com', //根路径
	apiPath: 'http://test.wx.nuozhe8.com', //API路径
	serverPath: 'http://test.wx.nuozhe8.com', //服务器路径
	ajaxErrorMsg: '服务器响应失败', //ajax访问失败的消息
	nodataErrorMsg: '暂无相关数据', //没有数据的消息
	TheemColor: '#E7A10E' //系统的主题颜色
};

//错误代码
var ErrorCode = {
	nodata: -2, //没有数据
	server: -1, //服务器错误
	error: 0, //普通错误
	success: 1, //成功
	logout: 2 //登录过期
};

//计算距离的方法，不用管，调用getDistanceMeter就行了

//将值转换成价格的字符串，默认保留两个小数
function parseToMoney(value){
	var val = parseFloat(value);
	if(isNaN(val)){
		val = "";
	}else{
		val = val.toFixed(2);
	}
	return val;
}

//图片的路径，拼接完成的图片路径
function imgPath(img){
	return AppConfig.apiPath + img;
}

//判断是否有图片，如果有返回完整的路径，如果没有返回默认路径，只能在pages的子目录下使用，因为默认图片的路径写死了
function defaultImg(img){
	return img ? imgPath(img) : '../imgs/defualt-img.png';
}

//用户头像，同上
function userImg(img){
	return img ? imgPath(img) : '../imgs/user-photo.png';
}


//拼接人民币的符号路径
function priceText(price){
	return '￥' + price;
}

//根据时间不同，返回不同的时间字符串
function timeText(timestamp){
	var now = new Date().valueOf() / 1000;
	//一个小时内用多少分钟前表示
	//不超过24小时的用小时表示
	//不超过5天的
	//其他的用完整的时间格式表示
	var passTime = now - timestamp;
	if(passTime < 60){
		return parseInt(passTime) + '秒前';
	}
	passTime = passTime / 60;
	if(passTime < 60){
		return parseInt(passTime) + '分钟前';
	}else if(passTime < 1440){
		return parseInt(passTime / 60) + '小时前';
	}else if(passTime < 7200){
		return parseInt(passTime / 1440) + '天前';
	}else{
		var dateTime = new Date(timestamp * 1000);
		return dateTime.Format('yyyy-MM-dd hh:mm:ss');
	}
}

//将手机定位的数据拼接成详细地址
function detailAddress(position){
	var address = position.address;
	return address.province + address.city + (address.district || '') + (address.street || '') + (address.streetNum || '');
}

//判断字符串是否为空
function isTextEmpty(text){
	return !text;
}

//时间格式化
Date.prototype.Format = function(fmt){
	fmt = fmt || 'yyyy-MM-dd hh:mm:ss';
	var o = {
		'M+': this.getMonth() + 1, //月份
		'd+': this.getDate(), //日
		'h+': this.getHours(), //小时
		'm+': this.getMinutes(), //分
		's+': this.getSeconds(), //秒
		'q+': Math.floor((this.getMonth() + 3) / 3), //季度
		'S': this.getMilliseconds() //毫秒
	};
	if(/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1,(this.getFullYear() + '').substr(4 - RegExp.$1.length));
	for(var k in o)
		if(new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
}

//将时间字符串转换成format格式的字符串
String.prototype.timeFormat = function(format){
	var str = this.substr(0,19).replace(/-/g,'/').replace(/[TZ]/g,' ');
	return new Date(str).Format(format);
}

//复写兼容性不高的es6语法
String.prototype.repeat = String.prototype.repeat || function(count){
	'use strict';
	if(this == null){
		//TypeError对象是变量或参数不是预期类型时发生的错误。比如，对字符串，布尔值，数值等原始类型的值使用new命令，就会抛出这种错误，因为new命令的参数应该是一个构造函数
		throw new TypeError('can\'t convert ' + this + ' to object');
	}
	
	var str = '' + this;
	count = +count;
	if(count != count){
		count = 0;
	}
	if(count < 0){
		//RangeError对象是一个超出有效范围时发生的错误。主要有几种情况，一是数组长度为负数，二是Number对象的方法参数超出范围，以及函数堆栈超过最大值
		throw new RangeError('repeat count must be non-negative');
	}
	if(count == Infinity){
		throw new RangeError('repeat count must be less than infinity');
	}
	count = Math.floor(count);
	if(str.length == 0 || count == 0){
		return '';
	}
	
	if(str.length * count >= 1 << 28){
		throw new RangeError('repeat count must not overflow maximum string size');
	}
	var rpt = '';
	for(;;){
		if((count & 1) == 1){
			rpt += str;
		}
		count >>>= 1;
		if(count == 0){
			break;
		}
		str += str;
	}
	return rpt;
};


/**
 * 这个方法主要是用在多个网络请求中，它会在所有的请求结束后，调用回调函数
 * 所有操作放到一个集合里面，全部执行完之后调用回调函数
 * 因为js是单线程的，所以不会有异步的问题出现
 * 调用方法，new SynFinish(fun1,fun2,fun2...,callback)最后一个是回调函数
 */
function SynFinish(){
	this.isStart = false;
	this.length = arguments.length - 1; //所有操作的长度，最后一个为回调返回结果的函数
	this.finishCallback = arguments[this.length];
	this.steps = []; //保存所有的操作步骤
	this.finishStepLength = 0; //已完成的步骤
	
	for(var i=0;i<this.length;i++){
		this.steps.push(arguments[i]);
	}
}

SynFinish.prototype.finishSelf = function(){
	this.finishStepLength++;
	if(this.finishStepLength == this.length){
		this.finishCallback();
		this.isStart = false;
	}
};

SynFinish.prototype.start = function(){
	if(this.isStart){
		return;
	}
	this.finishStepLength = 0;
	if(this.length <= 0){
		this.finishCallback();
	}else{
		this.isStart = true;
		for(var i=0;i<this.length;i++){
			this.steps[i](this);
		}
	}
};

//评分组件
function Star(ele,total,score){
	this.ele = ele; //组件的容器标签
	this.total = parseInt(total); //总分数
	this.score = score || 0; //分数
}

//初始化组件，设置容器的html内容
Star.prototype.initView = function(){
	var halfStarNum = parseInt(this.score / 0.5);
	var fullStarNum = parseInt(halfStarNum / 2);
	halfStarNum = halfStarNum % 2;
	
	var html = '';
	var i = 0;
	for(;i<this.total && i<fullStarNum;i++){
		html += '<i class="iconfont icon-star-full activity"></i>';
	}
	if(halfStarNum > 0){
		i++;
		html += '<i class="iconfont icon-star-half activity"></i>';
	}
	for(;i<this.total && i<fullStarNum;i++){
		html += '<i class="iconfont icon-star-full"></i>';
	}
	this.ele.innerHTML = html;
};

//设置分数
Star.prototype.setScore = function(score){
	this.score = score;
	this.initView();
};

//上传图片组件
function ImagePicker(callback,options){
	var that = this;
	this.ele = null; //容器
	this.closeEle = null; //关闭按钮
	this.imgEle = null; //裁剪容器
	this.saveEle = null; //保存按钮
	this.cropper = null; //裁剪实例
	this.picker_id = new Date().valueOf(); //组件ID
	this.callback = callback; //选择图片后调用回调函数
	this.options = {
		crop: true, //是否裁剪
		backType: 'base64' //返回类型，base64，本地路径locPath
	};
	mui.extend(this.options.options);
	//如果是返回本地路径，就不能裁剪
	if(this.options.backType == 'locPath'){
		this.options.crop = false;
	}
}

//初始化裁剪
//销毁
//弹出选择列表
//选择图片
//拍照
//裁剪
//处理图片、
//上传图片组件
//初始化
//销毁
//重置

//添加一个空白加号

//添加一张图片到容器

//获取列表数据组件

//获取列表数据组件

/*============================= 设置全局的mui方法 ============================*/
function App(){}

/*=============== 登录 ===============*/

//
App.prototype.createState = function(name,callback){
	//var state = 
};

//设置应用本地配置
App.prototype.setSettings = function(settings){
	settings = settings || {};
	localStorage.setItem('$settings',JSON.stringify(settings));
};
//获取应用本地配置
App.prototype.getSettings = function(){
	var settingsText = localStorage.getItem('$settingss') || "{}";
	return JSON.parse(settingsText);
};

//设置当前状态
App.prototype.setState = function(state){
	state = state || {};
	localStorage.setItem('$state',JSON.stringify(state));
};

//获取当前状态
App.prototype.getState = function(){
	var stateText = localStorage.getItem('$state') | "{}";
	return JSON.parse(stateText);
};

//获取本地是否安装客户端
App.prototype.isInstalled = function(id){
	if(id === 'qihoo' && mui.os.plus){ //返回是否在 5+ App(包括流应用)运行
		return true;
	}
	if(mui.os.android){
		var main = plus.android.runtimeMainActivity();
		var packageManager = main.getPackageManager();
		var PackageManager = plus.addroid.importClass(packageManager); //导入Objective-C类对象
		var packageName = {
			'qq': 'com.tencent.mobileqq',
			'weixin': 'com.tencent.mm',
			'sinaweibo': 'com.sina.weibo'
		};
		try{
			return packageManager.getPackageInfo(packageName[id],PackageManager.GET_ACTIVITIES);
		}catch(e){}
	}else{
		switch(id){
			case 'qq':
				var TencentOAuth = plus.ios.import('TencentOAuth');
				return TencentOAuth.iphoneQQInstalled();
			case 'weixin':
				var WXApi = plus.ios.import('WXApi');
				return WXApi.isWXAppInstalled();
			case 'sinaweibo':
				var SinaAPI = plus.ios.import('WeiboSDK');
				return SinaAPI.isWeiboAppInstalled();
			default:
				break;
		}
	}
};


//评分
App.prototype.star = function(selector){
	var eles = document.querySelectorAll(selector);
	var obj = {};
	obj.stars = [];
	mui.each(eles,function(i,n){
		var total = n.getAttribute('data-star-total') || 0;
		var score = n.getAttribute('data-star-num');
		var isInit = n.getAttribute('data-star-init');
		var star = new Star(n,total,score);
		if(isInit != 1){
			n.setAttribute('data-star-init',1);
			star.initView();
		}
		obj.stars.push(star);
	});
	
	obj.setScore = function(score){
		mui.each(obj.start,function(i,n){
			n.setScore(score);
		});
	};
	return obj;
	
};



//获取定位
App.prototype.getLocation = function(callback){
	plus.geolocation.getCurrentPosition(function(position){
		callback(true,position);
	},function(e){
		var code = e.code; //错误编码
		var message = e.message; //错误描述信息
		callback(false,e);
	},{
		provider: 'baidu'
	});
};

//是否不改变状态栏的颜色
App.prototype.keepStatusBarBackground = function(keep){
	this._keepStatusBarBackground = keep;
}
App.prototype.isKeepStatusBarBackground = function(){
	return this._keepStatusBarBackground;
};

//下拉初始化
App.prototype.pullInit = function(callback){
	mui.init({
		pullRefresh: {
			container: '#refreshContainer', //下拉容器
			down: {
				style: 'circle',
				color: AppConfig.ThemeColor,
				offset: '44px',
				auto: true,
				callback: callback
			}
		}
	});
};
App.prototype.pullRefresh = function(){
	mui('#refreshContainer').pullRefresh().pulldownLoading();
};
App.prototype.loadMore = function(){
	mui('#refreshContainer').pullRefresh().pullupLoading();
};
App.prototype.endRefresh = function(){
	mui('#refreshContainer').pullRefresh().endPulldown();
};
App.prototype.endLoadMore = function(more){
	mui('#refreshContainer').pullRefresh().endPullupToRefresh(more);
};

/**
 * ajax接口
 * @param {Object} path    路径
 * @param {Object} data    数据
 * @param {Object} successCallback   成功回调
 * @param {Object} errorCallback     错误回调，如果return true，错误已经被处理，默认处理不执行
 * @param {Object} options           设置，wait 是否显示等待窗口，login 是否需要登录数据，close 是否关闭等待窗口
 */

App.prototype.ajax = function(path,data,successCallback,errorCallback,options){
	
	var that = this;
	if(typeof data === 'function'){
		options = errorCallback;
		errorCallback = successCallback;
		successCallback = data;
		data = null;
	}
	if(typeof errorCallback === "object"){
		options = errorCallback;
	}
	var mOptions = mui.extend({
		close: true,
		wait: true,
		login: false,
	},options);
	
	var mData = {};
	mui.extend(mData,data);
	
	//等待框
	if(mOptions.wait){
		if(typeof mOptions.wait === 'string'){
			app.waiting(mOptions.wait);
		}else{
			//plus.nativeUI.showWaiting('加载中...');
		}
	}
	//登录
	if(mOptions.login){
		mData.userid = this.getUserId();
	}
	//调用数据
	mui.ajax(AppConfig.apiPath + path,{ 
		data: mData, 
		dataType: 'json',
		type: 'get',
		timeout: 10000,
		success: function(data,textStatus,xhr){  
			//console.log(JSON.stringify(data));
			
			if(textStatus == 'success'){
				successCallback(data);  
			}
		},
		error: function error(xhr,type,errorThrown){ 
			//console.log(type);
			mui.toast('网络异常，请稍后重试');
			errorCallback(); 
		} 
	});
};

//显示等待框
App.prototype.waiting = function(msg){
	//mui.showWaiting(msg);
	plus.nativeUI.showWaiting('加载中...'); //显示系统等待对话框
	return this; 
};

//关闭等待框
App.prototype.closeWaiting = function(){
	//mui.closeWaiting();
	plus.nativeUI.closeWaiting(); //关闭系统等待对话框
	return this;
};

//判断用户是否联网
/*App.prototype.CheckNetwork = function(){
	//console.log(plus.networkinfo.CONNECTION_NONE);
	//console.log(plus.networkinfo.getCurrentType());   
	if(plus.networkinfo.getCurrentType() == plus.networkinfo.CONNECTION_NONE){ //正常：3 1，断网：1 1
		mui.alert('网络异常，请检查网络设置！');  
	}
}
*/

//解决安卓无法改变状态栏背景颜色
App.prototype.androidTop = function(){
	console.log(11);
	//设置状态栏样式
	plus.navigator.setStatusBarStyle( "dark" );  
	var height = plus.navigator.getStatusbarHeight();
	
	//var androidTop = document.createElement('div');
	//androidTop.className = 'androidTop';
	//androidTop.style.height = height + 'px'; //android7.0不支持，可能因为渲染完之后div不存在
	//document.body.insertBefore(androidTop);
	
	//android7.0支持
	var androidTop = document.querySelector('.androidTop');
	androidTop.style.height = height + 'px';
	
	
};

//登录函数
App.prototype.login = function(callback){
	var username = '123123';
	var password = '123123';
	app.ajax('/plugin.php?mod=wechat&act=app&do=login&username='+ username +'&password='+password,{},function(data){
		//console.log(JSON.stringify(data));
		plus.storage.setItem('uid',data.uid);
		plus.storage.setItem('token',data.token);
		
		var timestamp = Math.floor(new Date().getTime()/1000);
		var sign = hex_md5(data.token + timestamp + '123');
		plus.storage.setItem('sign',sign);
		plus.storage.setItem('timestamp',timestamp);
		callback();
	});
};

//公共方法，判断是否登录
function judge_login_status(){
	return true;
}

//创建app实例
var app = new App();
mui.plusReady(function(){
	
	judge_login_status(); //公共方法，判断是否登录
	
});


