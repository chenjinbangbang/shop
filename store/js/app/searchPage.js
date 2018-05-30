
mui.plusReady(function(){
	setTimeout(function(){ //必须加上setTimeout，否则会出现一闪一闪的异常情况
		//弹出软键盘
		var webView = plus.webview.currentWebview().nativeInstanceObject();
		webView.plusCallMethod({"setKeyboardDisplayRequiresUserAction": false});
		//获取焦点
		document.querySelector('.searchIndex').focus();
	},300);
});

//tabs切换
mui('.tabs').on('tap','li',function(){
	var tabs = document.querySelector('.tabs').children;
	for(var i=0;i<tabs.length;i++){
		tabs[i].classList.remove("active");
	}
	this.classList.add('active');
});