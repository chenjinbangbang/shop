
//onload从服务器获取列表数据
window.onload = function(){
	//从服务器获取数据
	//....
	//业务数据获取完毕，并已插入当前页面DOM
	//注意：若为ajax请求，则需将如下代码放在处理完ajax响应数据之后
	mui.plusReady(function(){ 
		
		//获取传过来的参数
		var self = plus.webview.currentWebview();
		
		//关闭等待框
		plus.nativeUI.closeWaiting(); 
		//显示当前页面
		mui.currentWebview.show();
	});
};