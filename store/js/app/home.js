
var vm = new Vue({
	el: '#refreshContainer',
	data: {
		sliders: [],
		icons: [],
		types: []
	},
	mounted: function(){
		var self = this;
		mui.plusReady(function(){
			
			mui.init({
				//statusBarBackground:"#FF0000",
				//配置下拉刷新和上拉加载
				pullRefresh: {
					container: '#refreshContainer',
					//下拉刷新
					down: { 
						auto: true,
						callback: function(){
							//获取首页数据
							self.initData();
							//加载首页栏目板块
							//self.initColumn();
						}
					},
				}
			});

			//设置状态栏样式
			plus.navigator.setStatusBarStyle( "dark" );  
			var height = plus.navigator.getStatusbarHeight();
			if(mui.os.android){
				document.querySelector('.topStatus').style.height = height+'px';
				/*document.querySelector('.topStatus').style.background = 'rgba(188,188,188,1)';*/
				document.querySelector('.search').style.marginTop = height+'px';
			}else{
				document.querySelector('.topStatus_search').style.background = '-webkit-linear-gradient(top,rgba(0,0,0,0.4),rgba(0,0,0,0.05))';
				document.querySelector('.topStatus').style.height = height+'px';
				document.querySelector('.search').style.marginTop = height+'px';
			}
			
			//判断用户是否联网
			//app.CheckNetwork();
			if(plus.networkinfo.getCurrentType() == plus.networkinfo.CONNECTION_NONE){ //正常：3 1，断网：1 1
				mui.alert('网络异常，请检查网络设置！');  
			}	
			
			
		});
	},
	methods: {
		initData: function(){

			var self = this;
			app.ajax('/plugin.php?mod=wechat&act=app&do=config',{},function(data){
				
				//轮播图  
				self.sliders = data.slides;
				//console.log(JSON.stringify(self.sliders));
				
				//dom还没有更新
				self.$nextTick(function(){ //dom现在更新了
					//必须在这里，不然轮播图无效
					var gallery = mui('.mui-slider'); 
					gallery.slider({  
						interval: 2000 //自动轮播周期
					});	
				});
				
				//分类栏目
				self.icons = data.icon;
				
				//专区栏目
				self.types = data.type;
				
				
				//结束下拉刷新
				mui('#refreshContainer').pullRefresh().endPulldownToRefresh();
				
			});
		}
	}
});

//加载首页栏目板块
function initColumn(title){ 
	var sign = plus.storage.getItem('sign');
	var uid = plus.storage.getItem('uid');
	var timestamp = plus.storage.getItem('timestamp');
	var doC = title; 
	
	//console.log(title);
	mui.toast(sign); 
	mui.toast(timestamp); 
	document.querySelector('.goods').classList.remove('hide');
	
	app.ajax('/plugin.php?mod=wechat&act=app&do='+ doC +'&sign='+ sign +'&timestamp='+ timestamp +'&uid='+ uid +'&get=new&page=1',{},function(data){
		//console.log(JSON.stringify(data));
		
		if(data.code){
			mui.toast(data.msg);
			return;
		}
		
		var listData = data.list;
		var list = document.getElementById("list");
		var str = '';
		

		
		if(listData.length > 0){
			//有数据
			document.querySelector('.nodata').classList.add('hide');
			
			mui.each(listData,function(index,item){
				str += '<li>'+
					'<a href="../detail.html">'+
						'<div class="like-left">'+
							'<img src="'+ item.pic +'" alt="" />'+
						'</div>'+
						'<div class="like-right">'+
							'<div class="name">'+ item.title +'</div>'+
							'<div class="commission">预估佣金:￥'+ item.yongjin +'</div>'+
							'<div class="price">'+
								'<p><span>￥</span>'+ item.price +'</p>'+
								'<p>月销'+ item.sales +'</p>'+
							'</div>'+
							'<div class="price1">'+
								'<p>天猫价  ￥'+ item.o_price +'</p>'+ 
								'<div class="ticket">'+
									'<span class="coupon">券￥'+ item.coupon +'</span>'+
									'<span class="iconfont icon-couponss"></span>'+
								'</div>'+
							'</div>'+
						'</div>'+
					'</a>'+
				'</li>';
			});
			list.innerHTML = str;
		}else{
			//没有数据
			document.querySelector('.nodata').classList.remove('hide');
		}

		
	});
}
//tabs切换
function tabsAct(ele){
	mui('.goodsTab').on('tap','li',function(){			
		//获取当前的class列表
		var tabs = ele.children;
		for(var i=0;i<tabs.length;i++){
			tabs[i].classList.remove("active");
		}
		this.classList.add('active');
		
		var title = this.getAttribute('title');
		//加载首页栏目板块
		initColumn(title);
		
	});
}
var ele = document.querySelector('.goodsTab');
tabsAct(ele);

var search = document.getElementById('search');
search.addEventListener('focus',function(){
	mui.openWindow({
		url: "../searchPage.html",
		id: "../searchPage.html",
		styles: {},
		extras: {},
		show: {
			autoShow: true,
			aniShow: 'slide-in-right',
			duration: 100
		},
		waiting: {
			autoShow: true,
			title: '正在加载...'
		}
	});
	
	setTimeout(function(){
		search.blur();
	},500);
	
});

//跳转页面
mui('.mui-content').on('tap','a',function(){
	var page = this.getAttribute('href');
	var title = "";
	
	if(this.getAttribute('title')){
		title =  this.getAttribute('title');
		
		//主题推荐
		if(title == 'zhuti'){
			page = '../theme.html';
		}
		//叮咚抢
		if(title == 'ddq'){
			page = '../ddq.html';
		}
		//拼购
		if(title == 'haiwai'){
			page = '../haiwai.html';
		}
	}

	
	mui.openWindow({ 
		url: page,
		id: page,
		extras: {
			title: title
		},
		waiting: {
			autoShow: true,
			title: '正在加载...'
		}
	});
});

//搜索和状态栏的状态变化
var topStatus_search = document.querySelector('.topStatus_search');
//Android上监听原生滚动，IOS上监听div滚动，上拉超过一定距离后显示按钮，否则隐藏，可自行在条件判断中修改
if(mui.os.android){ //android设备
	window.addEventListener('scroll',function(e){
		//返回按钮的显示与隐藏 
		if(window.pageYOffset < 0 && !topStatus_search.classList.contains('hide')){ //上面
			topStatus_search.classList.add('hide');
		}else if(window.pageYOffset >= 0 && topStatus_search.classList.contains('hide')){ //开始
			topStatus_search.classList.remove('hide');
		}
		//返回按钮的变化
		if(window.pageYOffset >= 100 && !topStatus_search.classList.contains('topStatus_searchbg')){ //下面
			topStatus_search.classList.add('topStatus_searchbg');  
			plus.navigator.setStatusBarStyle( "dark" );
		}else if(window.pageYOffset < 100 && topStatus_search.classList.contains('topStatus_searchbg')){ //开始
			topStatus_search.classList.remove('topStatus_searchbg'); 
			plus.navigator.setStatusBarStyle( "light" );
		}
	});
}else{ //ios设备
	//console.log(scrollToTopBox.classList);
	document.querySelector('.wrapper').addEventListener('scroll',function(){
		//mui('.wrapper').pullRefresh().y：获取距离顶部的距离大小
		//搜索的显示与隐藏
		if(mui('.wrapper').pullRefresh().y > 0 && !topStatus_search.classList.contains('hide')){ //上面
			topStatus_search.classList.add('hide');
		}else if(mui('.wrapper').pullRefresh().y <= 0 && topStatus_search.classList.contains('hide')){ //开始
			topStatus_search.classList.remove('hide');
		}
		//搜索的变化
		if(mui('.wrapper').pullRefresh().y <= -100 && !topStatus_search.classList.contains('topStatus_searchbg')){ //下面
			topStatus_search.classList.add('topStatus_searchbg');  
			plus.navigator.setStatusBarStyle( "dark" );
		}else if(mui('.wrapper').pullRefresh().y > -100 && topStatus_search.classList.contains('topStatus_searchbg')){ //开始
			topStatus_search.classList.remove('topStatus_searchbg'); 
			plus.navigator.setStatusBarStyle( "light" );
		}
	});
}
		/*(function($){
			//$(window).load(function(){
				$.mCustomScrollbar.defaults.theme="light-2"; //set "light-2" as the default theme
				$(".madegame ul").mCustomScrollbar({
					axis:"y",
					advanced:{autoExpandHorizontalScroll:false}
				});
			//});
		})(jQuery);*/