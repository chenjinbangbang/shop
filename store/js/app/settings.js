
var vm = new Vue({
	el: '#settings',
	data: {},
	mounted: function(){
		mui.plusReady(function(){ 
			//app.getDisplayWebview();

		});  
	},
	methods: {
		logout: function(){ 
			mui.confirm('确定要退出当前账号？','提示',['退出','取消'],function(e){
				//e.index为0：退出，为1：取消
				console.log(e.index); 
				if(e.index === 0){   
					localStorage.clear(); 
					
					//plus.webivew.hide(plus.webview.currentWebview()); 
					//var home = plus.webview.getWebviewById('home');
					//mui.fire(home);  
					//plus.webview.show('home');
					
					//app.getDisplayWebview(); 
					
					//var settings = plus.webview.getWebviewById('settings');
					//plus.webview.hide(settings);  
					mui.back();   
					
					var personal = plus.webview.getWebviewById('personal');
					var home = plus.webview.getWebviewById('home');
					var index = plus.webview.getWebviewById('HBuilder');
					personal.hide();
					home.show();
					mui.fire(home,'downCallback');
					mui.fire(index,'tabsPages');

				}
			});
		}
	}
});
