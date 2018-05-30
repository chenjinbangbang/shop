
mui.init({ 
				swipeBack: true, //启动右滑关闭功能，默认为false关闭（ios无效）
	/*keyEventBind: {
		backbutton: false //关闭back按键监听（Android手机）
	}*/
	beforeback: function(){
		
	}
});

//onload从服务器获取列表数据
window.onload = function(){
	//从服务器获取数据
	//....
	//业务数据获取完毕，并已插入当前页面DOM
	//注意：若为ajax请求，则需将如下代码放在处理完ajax响应数据之后
	mui.plusReady(function(){ 
		
		//获取传过来的参数
		var self = plus.webview.currentWebview();
		var name = self.name; 
		console.log(name);
		
		//关闭等待框
		plus.nativeUI.closeWaiting(); 
		//显示当前页面
		mui.currentWebview.show();
	});
};

mui('#fans-tabs1').on('tap','li',function(){
	
	//tabs切换
	//console.log(this.classList); //获取当前的class列表
	var tabs1 = document.getElementById('fans-tabs1').children;
	for(var i=0;i<tabs1.length;i++){
		tabs1[i].classList.remove("active");
	}
	this.classList.add('active');
});