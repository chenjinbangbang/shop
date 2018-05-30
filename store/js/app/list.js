
mui.plusReady(function(){
				var cw = plus.webview.currentWebview();
				var title = cw.title;
				
				document.querySelector(".mui-title").innerHTML = title;
});

mui('.mui-card').on('tap','a',function(){
	var page = this.getAttribute('href');
	var title = this.getAttribute('title');
	
	mui.openWindow({
		url: page,
		id: page,
		styles: {},
		extras: {
			title: title
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
	
});