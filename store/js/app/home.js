
var vm = new Vue({
	el: '#refreshContainer',
	data: {},
	mounted: function(){
		mui.plusReady(function(){
			
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
			
			mui.init({
				statusBarBackground:"#FF0000",
				//配置下拉刷新和上拉加载
				pullRefresh: {
					container: '#refreshContainer',
					//下拉刷新
					down: {
						auto: true,
						callback: function pulldownRefresh(){
							//获取首页数据
							initData();
							//加载首页栏目板块
							initColumn();
						}
					},
					//上拉加载
					/*up: {
						callback: function pullupRefresh(){
							//获取首页数据
							initData();
						}
					}*/
				}
			});
			
			
			
		});
	},
	methods: {
		
	}
});

//获取首页数据
function initData(){   
	app.ajax('/plugin.php?mod=wechat&act=app&do=config',{},function(data){
		//console.log(JSON.stringify(data));
		
		//轮播图  
		var sliders = data.slides;
		var banner = document.querySelector('.banner');
		banner.innerHTML = ''; //初始化
		var bannerImg = document.createElement('div');
		bannerImg.className = 'mui-slider-group mui-slider-loop';
		var bannerIndex = document.createElement('div');
		bannerIndex.className = 'mui-slider-indicator';
		
		var str = '',strIndex = '';
		str += '<div class="mui-slider-item mui-slider-item-duplicate">'+
			'<a href="'+sliders[sliders.length-1].url+'">'+
				'<img src="'+sliders[sliders.length-1].img+'"/>'+
			'</a>'+ 
		'</div>';
		mui.each(sliders,function(index,item){
			str += '<div class="mui-slider-item">'+
				'<a href="'+item.url+'">'+
					'<img src="'+item.img+'"/>'+
				'</a>'+
			'</div>';
			
			if(index == 0){
				strIndex += '<div class="mui-indicator mui-active"></div>';
			}else{
				strIndex += '<div class="mui-indicator"></div>';
			}
			
		});
		str += '<div class="mui-slider-item mui-slider-item-duplicate">'+
			'<a href="'+sliders[0].url+'">'+
				'<img src="'+sliders[0].img+'"/>'+
			'</a>'+
		'</div>';
		bannerImg.innerHTML = str;
		bannerIndex.innerHTML = strIndex;
		banner.appendChild(bannerImg);
		banner.appendChild(bannerIndex);

		//必须在这里，不然轮播图无效
		var gallery = mui('.mui-slider'); 
		gallery.slider({ 
			interval: 2000 //自动轮播周期
		});
		
		//分类
		var icon = data.icon;
		var classify = document.querySelector('.classify');
		classify.innerHTML = ''; //初始化
		var classifyUl = document.createElement('ul');
		
		var classifyStr = '';
		mui.each(icon,function(index,item){
			classifyStr += '<li>'+
				'<a href="../goodsList.html" title="'+item.type+'">'+
				'<div class="icon">'+
					'<img src="'+item.img+'" alt="" />'+
				'</div>'+
				'<p>'+item.name+'</p>'+
				'</a>'+
			'</li>';
		});
		classifyUl.innerHTML = classifyStr;
		classify.appendChild(classifyUl);
		
		
		//专区栏目
		var type = data.type;
		var column = document.getElementById("column"); //栏目父级
		column.innerHTML = ''; //初始化
		//var columnStr = '';
		
		mui.each(type,function(index,item){
			
			var activity = document.createElement('div');
			activity.className = 'activity';
			
			//标题
			var t = document.createElement('div');
			t.className = 't';
			console.log(JSON.stringify(item));
			t.style.background = '-webkit-linear-gradient(left, '+ item.color[0] +' , '+ item.color[1] +')';
			t.innerHTML = '<div><h4>'+ item.name +'</h4></div>';
			activity.appendChild(t);
			
			//中间内容
			var data = item.data;
			var activityUl = document.createElement('ul');
			activityUl.className = 'tt';
			var dataStr = '';
			mui.each(data,function(index,item){ 
				dataStr += '<li>'+
							'<a href="../../pages/detail.html">'+
								/*'<div class="activity-left">'+
									'<p class="title titleColor0">'+ item.name +'</p>'+
									'<p class="name">'+ item.name +'</p>'+
									'<div class="img">'+
										'<img src="'+ item.img +'" alt="" />'+
									'</div>'+
								'</div>'+*/
								'<div class="activity-right">'+
									'<img src="'+ item.img +'" alt="" />'+
								'</div>'+
							'</a>'+
						'</li>';
			});
			activityUl.innerHTML = dataStr;
			activity.appendChild(activityUl);
			
			//底部内容
			var goodslist = item.goodslist;
			var view = document.createElement('div');
			view.className = 'view';
			
			//今日精选
			var viewTitle = '<div class="view-title">'+
							 '<div>今日精选</div>'+
						'</div>';
			view.innerHTML = viewTitle;
			
			//商品信息
			var goodsWrapper = document.createElement('div');
			goodsWrapper.className = 'made scrollbox';
			goodsWrapper.id = 'horizontal';
			var goodsWrapperScroll = document.createElement('div');
			goodsWrapperScroll.className = 'madegame';
			var goodsWrapperScrollUl = document.createElement('ul');
			//goodsWrapperScrollUl.id = 'ho';
			
			var goodsStr = '';
			mui.each(goodslist,function(index,item){
				goodsStr += '<li>'+
								'<a href="../../pages/detail.html">'+
						            '<span class="img">'+
					            		'<img src="'+ item.pic +'" alt="" />'+
						            '</span>'+
						            '<span class="title">'+ item.title +'</span>'+
						            '<div class="title1">#'+ item.title +'</div>'+
						        '</a>'+
						       '</li>';
			});
			goodsWrapperScrollUl.innerHTML = goodsStr;
			goodsWrapperScroll.appendChild(goodsWrapperScrollUl);
			
			goodsWrapper.appendChild(goodsWrapperScroll);
			view.appendChild(goodsWrapper);
			activity.appendChild(view);
			
			column.appendChild(activity);
			
		});
		


		//滚动到底部  
		//mui('.mui-content.mui-scroll-wrapper').scroll().scrollToBottom(500);
		
		//下拉刷新结束
		mui('#refreshContainer').pullRefresh().endPulldownToRefresh();

		
	});
}

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