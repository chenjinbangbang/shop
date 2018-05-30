
//为了防止底部菜单，被过快点击，导致产生多次请求的问题，可以使用标识位的点击方案
/*var runFlag = true;
mui('.mui-bar-tab').on('tap','a',function(e){
if(runFlag){
	runFlag = false;
	//....
	}
});
setTimeout(function(){
	runFlag = true;
},1000);*/

//使用不响应已打开链接的点击方案
/*mui('.mui-bar-tab').on('tap','a',function(e){
	if(this.getAttribute('href') != plus.webview.currentWebview().href){
		//......
	}
});*/

//判断是否已经登录
function judge_login_status(){
	return false;
}
