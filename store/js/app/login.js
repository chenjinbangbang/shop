
 mui.plusReady(function(){
 	
 	
 	
 	var settings  = app.getSettings(); //获取应用本地配置
 	var state = app.getState();
 	
 	var mainPage = plus.webview.getWebviewById('pages/index/home.html');
 	var main_loaded_flag = false;
 	if(!mainPage){
 		mainPage = mui.preload({ //页面预加载
 			url: 'pages/index/home.html',
 			id: 'pages/index/home.html'
 		});
 	}else{
 		main_loaded_flag = true;
 	}
 	
 	mainPage.addEventListener('loaded',function(){ //目标webview必须触发loaded事件后才能使用自定义事件
 		main_loaded_flag = true;
 	});
 	
 	var toMain = function(){
 		//使用定时器的原因，可能执行太快，main页面loaded事件尚未触发就执行自定义事件，此时必然会失败
 		var id = setInterval(function(){
 			if(main_loaded_flag){
 				clearInterval(id);
 				mui.fire(mainPage,'show','null'); //通过mui.fire()方法可触发目标窗口的自定义事件
 				mainPage.show("pop-in");
 			}
 		},20);
 	};
 	
 	//检查登录状态，锁屏状态开始
 	if(settings.autoLogin && state.token && settings.gestures){
 		mui.openWindow({
 			url: 'unlock.html',
 			id: 'unlock',
 			show: {
 				aniShow: 'pop-in'
 			},
 			waiting: {
 				autoShow: false
 			}
 		});
 	}else if(settings.autoLogin && state.token){
 		toMain();
 	}else{
 		app.setState(null);
 		//第三方登录
 		var authBtns = ['qihoo','weixin','sinaweibo','qq']; //配置业务支持的第三方登录
 		var auths = {};
 		var oauthArea = document.querySelector('.oauth-area');
 		//获取登录授权认证服务列表
 		//[{"id":"xiaomi","description":"小米"},{"id":"qq","description":"QQ"},{"id":"sinaweibo","description":"新浪微博"},{"id":"weixin","description":"微信"}]
 		plus.oauth.getServices(function(services){
 			for(var i in services){
 				var service = services[i];
 				auths[service.id] = service;
 				if(~authBtns.indexOf(service.id)){
 					var isInstalled = app.isInstalled(service.id);
 					var btn = document.createElement('div');
 					//如果微信未安装，则为不启用状态
 					btn.setAttribute('class','oauth-btn' + (!isInstalled && service.id === 'weixin' ? ('disabled') : ''));
 					btn.authId = service.id;
 					btn.style.backgroundImage = 'url("../imgs/'+ service.id +'.png")';
 					oauthArea.appendChild(btn);
 				}
 			}
 			mui(oauthArea).on('tap','.oauth-btn',function(){
 				if(this.classList.contains('disabled')){
 					plus.nativeUI.toast('您尚未安装微信客户端');
 					return;
 				}
 				var auth = auths[this.authId];
 				var waiting = plus.nativeUI.showWaiting();
 				auth.login(function(){
 					waiting.close();
 					plus.nativeUI.toast('登录认证成功');
 					auth.getUserInfo(function(){
 						plus.nativeUI.toast('获取用户信息成功');
 						var name = auth.userInfo.nickname || auth.userInfo.name;
 						app.createState(name,function(){
 							toMain();
 						});
 					},function(e){
 						waiting.close();
 						plus.nativeUI.toast('登录认证失败：'+e.message);
 					});
 				});
 			});
 		},function(e){
 			oauthArea.style.display = 'none';
 			plus.nativeUI.toast('获取登录认证失败：' + e.message);
 		});
 	}
 	
 	
 	
 });

//账号密码登录
/*var check = true;
document.getElementById('login').addEventListener('tap',function(){
	 
	mui('#normalLogin input').each(function(){
		if(!this.value || this.value.trim() == ""){
			var label = this.previousElementSibling;
			mui.alert(label.innerText + '不允许为空');
			check = false;
			return false;
		}else{ 
			check = true; 
		}
	});
	if(check){
		console.log('验证通过');
		
		var username = document.getElementById("usernamee").value;
		var password = document.getElementById("password").value;
		//mui.ajax();
	}
});

//手机号快捷登录
//点击获取验证码
document.querySelector('.sendCode').addEventListener('tap',function(){
	mui.ajax(
			'GEThttp://test.wx.nuozhe8.com/plugin.php?mod=wechat&act=app&do=sms_code',
			{mobile: '13360502844'},
			function(result){
				console.log(result);
			}
		);
});

var check1 = true;
document.getElementById('loginBtn').addEventListener('tap',function(){
	 
	mui('#phoneLogin input').each(function(){
		if(!this.value || this.value.trim() == ""){
			var label = this.previousElementSibling;
			mui.alert(label.innerText + '不允许为空');
			check1 = false;
			return false;
		}else{ 
			check1 = true; 
		}
	});
	if(check1){
		console.log('验证通过');
		
		var user = document.getElementById("user").value;
		var pwd = document.getElementById("pwd").value;
		//mui.ajax();
	}
});

//跳转到注册页面
mui('.login-foot').on('tap','a',function(){
	var page = this.getAttribute('href');
	console.log(page);
	mui.openWindow({ 
		url: page,
		id: page,
		show: {
			autoShow: true,
			aniShow: 'slide-in-bottom',
			duration: 500
		},
		waiting: {
			autoShow: false,
		}
	}); 
});*/

/*mui.plusReady(function(){
	console.log(plus.runtime.appid);
});*/ 