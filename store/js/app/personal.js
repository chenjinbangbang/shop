
//获取数据
function initData(){
	
}

//跳转页面
mui('.mui-content').on('tap','a',function(){
	var page = this.getAttribute('href');
	
	//获取title，新手攻略，官方公告，常见问题列表页面需要
	//console.log(this.getAttribute('title'));
	if(this.getAttribute('title')){
		var title = this.getAttribute('title');
	}
	
	
	mui.openWindow({
		url: page,
		id: page,
		styles: {},
		extras: {
			title: title ? title : ''
		},
		show: {
			autoShow: true,
			aniShow: 'slide-in-right',
			duration: 200
		},
		waiting: {
			autoShow: true,
			title: '正在加载...'
		}
	});
	plus.navigator.setStatusBarStyle( "dark" );
});

//复制邀请码
document.querySelector('.copy').addEventListener('tap',function(){
	var inviteCode = document.getElementById("inviteCode").innerHTML;
	
	if(mui.os.ios){
		//ios复制
		var UIPasteboard  = plus.ios.importClass("UIPasteboard");
		//这步会有异常因为UIPasteboard是不允许init的，init的问题会在新版中修改 
		var generalPasteboard = UIPasteboard.generalPasteboard();
		// 设置/获取文本内容: www.bcty365.com
		generalPasteboard.setValueforPasteboardType(inviteCode, "public.utf8-plain-text");
		var value = generalPasteboard.valueForPasteboardType("public.utf8-plain-text"); 
	}else{
		//安卓复制
		var Context = plus.android.importClass("android.content.Context");
		var main = plus.android.runtimeMainActivity();
		var clip = main.getSystemService(Context.CLIPBOARD_SERVICE);
		plus.android.invoke(clip,"setText",inviteCode);
	}

	mui.toast('复制成功');
});
