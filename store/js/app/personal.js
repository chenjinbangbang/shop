



//上拉加载的回调 page = {num:1, size:10}; num:当前页 默认从1开始, size:每页数据条数,默认10
/*function upCallback(page) {
	setTimeout(function(){
		mescroll.endErr();
	},1000);
}*/

var vm = new Vue({
	el: '#personal',
	data: {
		mescroll: null,
		
		datas: {}, //个人中心数据
		inviteCode: '888888888'
	},
	mounted: function(){
		var self = this;
		
		self.mescroll = new MeScroll("mescroll", { //第一个参数"mescroll"对应上面布局结构div的id
			//如果您的下拉刷新是重置列表数据,那么down完全可以不用配置,具体用法参考第一个基础案例
			//解析: down.callback默认调用mescroll.resetUpScroll(),而resetUpScroll会将page.num=1,再触发up.callback
			down: {
				//callback: downCallback //下拉刷新的回调,别写成downCallback(),多了括号就自动执行方法了
				callback: self.downCallback
			},
			/*up: {
				callback: upCallback , //上拉加载的回调
				isBounce: false //如果您的项目是在iOS的微信,QQ,Safari等浏览器访问的,建议配置此项.解析(必读)
			}*/
		});
		
		mui.plusReady(function(){
			mui.init();
			
			//获取数据 
			//self.initData(); 
		}); 
	},
	methods: {
		downCallback: function(){
			setTimeout(function(){
				//获取数据 
				vm.initData(); 
			},500);
		},
		//获取数据
		initData: function(){   
			var self = this;
			
			var sign = localStorage.getItem('sign');
			var timestamp = localStorage.getItem('timestamp');
			var uid = localStorage.getItem('uid'); 
			
			app.ajax('/plugin.php?mod=wechat&act=app&do=user&get=userinfo&sign='+ sign +'&timestamp='+ timestamp +'&uid='+uid,{},function(data){
				  self.datas = data;
				  
				  self.inviteCode = data.rec;
				  
				  self.mescroll.endSuccess();
			}); 
		},
		//复制到粘贴板
		copyFn: function(){
			if(mui.os.ios){
				//ios复制
				var UIPasteboard  = plus.ios.importClass("UIPasteboard");
				//这步会有异常因为UIPasteboard是不允许init的，init的问题会在新版中修改 
				var generalPasteboard = UIPasteboard.generalPasteboard();
				// 设置/获取文本内容: www.bcty365.com
				generalPasteboard.setValueforPasteboardType(this.inviteCode, "public.utf8-plain-text");
				var value = generalPasteboard.valueForPasteboardType("public.utf8-plain-text"); 
			}else{
				//安卓复制
				var Context = plus.android.importClass("android.content.Context");
				var main = plus.android.runtimeMainActivity();
				var clip = main.getSystemService(Context.CLIPBOARD_SERVICE);
				plus.android.invoke(clip,"setText",this.inviteCode);
			}
		
			mui.toast('复制成功');
		},
		//跳转到设置页面
		toSettings: function(){
			mui.openWindow({
				url: '../personal/settings.html',
				id: 'settings',
				extras: {},
				waiting: {
					autoShow: false
				}
			});
			plus.navigator.setStatusBarStyle( "dark" );
		}
	}
});

window.addEventListener('downCallback',function(){
	vm.downCallback();
});

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