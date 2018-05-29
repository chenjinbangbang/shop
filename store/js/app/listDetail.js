
mui.plusReady(function(){
	var cw = plus.webview.currentWebview();
	//console.log(cw.title);
	var title = cw.title;
	
	document.querySelector('.mui-title').innerHTML = title;
	document.querySelector('.title').innerHTML = title;
	
});