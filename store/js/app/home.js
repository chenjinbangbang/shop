
var searchVm = new Vue({
	el: '#topStatus_search',
	data: {
		searchShow: false, //搜索框的显示与隐藏
		topStatus_searchbgShow: false, //搜索框白色背景隐藏与隐藏
		topStatusHeight: 20, //状态栏的高度
	},
	mounted: function(){
		var self = this;
		mui.plusReady(function(){
			mui.init();
			
			//设置状态栏样式
			plus.navigator.setStatusBarStyle( "dark" );  
			self.topStatusHeight = plus.navigator.getStatusbarHeight(); //获取状态栏的高度

			if(mui.os.android){
				document.querySelector('.topStatus').style.background = 'rgba(188,188,188,1)';
				//document.querySelector('.search').style.marginTop = height+'px';
			}else{
				//document.querySelector('.topStatus_search').style.background = '-webkit-linear-gradient(top,rgba(0,0,0,0.4),rgba(0,0,0,0.05))';
				//document.querySelector('.search').style.marginTop = height+'px';
			} 
			
		});
	},
	methods: { 
		//跳转到搜索页面
		toSearch: function(){
			mui.openWindow({
				url: "../searchPage.html",
				id: "searchPage",
				styles: {},
				extras: {},
				waiting: { 
					autoShow: true,
					title: '正在加载...'
				}
			});
		},
	}
});

var vm = new Vue({
	el: '#mescroll',
	data: {
		mescroll: null, //下拉刷新上拉加载的对象
		
		sliders: [], //l轮播图
		icons: [], //栏目分类
		types: [], //商品
		
		columnShow: false, //打开页面隐藏，首页数据加载完毕后才能显示
		columnIndex: 0, //下面栏目当前索引
		columnTypes: [{type: 'tb',name: '淘宝'},{type: 'jd',name: '京东'},{type: 'pdd',name: '拼多多'}], //下面栏目标题
		columnDatas: [], //下面栏目数据列表  
		
	},
	directives: {
		focus: {
			inserted: function(el,binding){
				el.focus();
			}
		}
	},
	mounted: function(){
		var self = this;
		
		mui.plusReady(function(){
			
			mui.init({
				//statusBarBackground:"#FF0000",
				//配置下拉刷新和上拉加载
				/*pullRefresh: {
					container: '#refreshContainer',
					//下拉刷新
					down: {  
						auto: true,
						//style: 'circle',
						callback: function(){
							//获取首页数据
							self.initData(function(){
								//加载首页栏目板块
								console.log(app.judge_login_status());
								if(app.judge_login_status()){
									self.columnShow = true;
									self.initColumn('tb');
								}
							}); 
						}
					},
				}*/
			});

			//下拉刷新
			//var topStatus_search = document.querySelector('.topStatus_search');
			self.mescroll = new MeScroll("mescroll", { //第一个参数"mescroll"对应上面布局结构div的id
				//如果您的下拉刷新是重置列表数据,那么down完全可以不用配置,具体用法参考第一个基础案例
				//解析: down.callback默认调用mescroll.resetUpScroll(),而resetUpScroll会将page.num=1,再触发up.callback
				down: {   
					//callback: downCallback //下拉刷新的回调,别写成downCallback(),多了括号就自动执行方法了
					
					//下拉的距离进入offset范围内部一刻的回调
					inOffset: function( mescroll ){ 
						searchVm.searchShow = false; //搜索的隐藏
					},
					//准备出发下拉刷新的回调
					beforeLoading: function( mescroll , downwarp){
						//topStatus_search.classList.remove('hide');
					},
					/*onMoving: function(mescroll, rate, downHight){ //下拉过程中的回调，滑动过程一直在执行
						
					},*/
					callback: self.downCallback
				},
				up: {
					onScroll: function(mescroll,y,isUp){ //y：当前滚动条的位置，isUp：true为正在上滑，false为正在下滑
						//搜索的变化
						if(y > 150 && !searchVm.topStatus_searchbgShow){ //下面
							searchVm.topStatus_searchbgShow = true;
							plus.navigator.setStatusBarStyle( "dark" ); 
						}else if(y <= 150 && searchVm.topStatus_searchbgShow){ //开始
							searchVm.topStatus_searchbgShow = false;  
							plus.navigator.setStatusBarStyle( "light" );
						}
					}
				}
			});
			
			//回到顶部
			//self.backtop();
			
			

		});
	}, 
	methods: { 
		downCallback: function(){ 
			//获取首页数据
			//console.log('刷新');
			var self = this;
			
			//app.getAll();  
			var sign = localStorage.getItem('sign');
			var timestamp = localStorage.getItem('timestamp');
			var uid = localStorage.getItem('uid');
			console.log("sign: "+sign+", timestamp: "+timestamp+", uid: "+uid);
			
			vm.initData(function(){  
				//加载首页栏目板块
				//console.log(app.judge_login_status());
				if(app.judge_login_status()){
					vm.columnShow = true;
					vm.initColumn('tb');
				}
				vm.mescroll.endSuccess(); //隐藏下拉刷新和上拉加载的状态
				searchVm.searchShow = true; //搜索的显示
				
				//栏目商品的左右轮播
				self.$nextTick(function(){
					var swiper = new Swiper('.swiper-container', {
				        //pagination: '.swiper-pagination',
				        slidesPerView: 1.8, //设置slider容器能够同时显示的sliders数量
				        paginationClickable: true, //点击分页其的指示点分页器会控制Swiper切换
				        spaceBetween: 15, //slide之间的距离
				        freeMode: true //true变为free模式，slide会根据惯性滑动且不会贴合
				    });
				});
				
			}); 
		},
		//跳转到搜索页面
		toSearch: function(){
			mui.openWindow({
				url: "../searchPage.html",
				id: "searchPage",
				styles: {}, 
				extras: {},
				waiting: {
					autoShow: true,
					title: '正在加载...'
				}
			});
		},
		//获取首页数据
		initData: function(callback){

			var self = this;
			app.ajax('/plugin.php?mod=wechat&act=app&do=config',{},function(data){
				
				//轮播图  
				self.sliders = data.slides;
				
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

				callback();
				
			});
		},
		//跳转到栏目列表
		toGoodsList: function(type){
			var page = '../goodsList.html';
			//主题推荐
			if(type == 'zhuti'){
				page = '../theme.html';
			}
			//叮咚抢
			if(type == 'ddq'){
				page = '../ddq.html';
			}
			//拼购
			if(type == 'haiwai'){
				page = '../haiwai.html';
			}
			
			mui.openWindow({ 
				url: page,
				id: page,
				extras: { 
					type: type
				},
				waiting: {
					autoShow: true,
					title: '正在加载...'
				}
			});
			
		},
		//获取下面栏目数据
		initColumn: function(title){
			var self = this;
			
			var sign = localStorage.getItem('sign');
			var uid = localStorage.getItem('uid');
			var timestamp = localStorage.getItem('timestamp');
			var doC = title; 
			
			//console.log(title);
			//mui.toast(sign);  
			//document.querySelector('.goods').classList.remove('hide');
			
			app.ajax('/plugin.php?mod=wechat&act=app&do='+ doC +'&sign='+ sign +'&timestamp='+ timestamp +'&uid='+ uid +'&get=new&page=1',{},function(data){
				//console.log(JSON.stringify(data));
				self.columnDatas = data.list;
			});
		},
		//切换下面栏目数据
		columnTabs: function(index,type){
			this.columnIndex = index;
			//获取下面栏目数据
			this.initColumn(type);
		},
		//跳转到商品详情
		toDetail: function(goods_id){
			var page = '../detail.html';
			mui.openWindow({ 
				url: page,
				id: page,
				extras: {
					goods_id: goods_id
				},
				waiting: {
					autoShow: true,
					title: '正在加载...'
				}
			});
		},
		//回到顶部
		backtop: function(){
			//搜索和状态栏的状态变化
			var topStatus_search = document.querySelector('.topStatus_search');
			//Android上监听原生滚动，IOS上监听div滚动，上拉超过一定距离后显示按钮，否则隐藏，可自行在条件判断中修改
			if(mui.os.android){ //android设备
				/*window.addEventListener('scroll',function(e){
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
				});*/
			}else{ //ios设备
				//console.log(scrollToTopBox.classList);
				/*document.querySelector('.mescroll').addEventListener('scroll',function(){
					//mui('.mescroll').pullRefresh().y：获取距离顶部的距离大小
					//搜索的显示与隐藏
					console.log(mui('.mescroll').pullRefresh().y);
					if(mui('.mescroll').pullRefresh().y > 0 && !topStatus_search.classList.contains('hide')){ //上面
						topStatus_search.classList.add('hide');
					}else if(mui('.mescroll').pullRefresh().y <= 0 && topStatus_search.classList.contains('hide')){ //开始
						topStatus_search.classList.remove('hide');
					}
					//搜索的变化
					if(mui('.mescroll').pullRefresh().y <= -100 && !topStatus_search.classList.contains('topStatus_searchbg')){ //下面
						topStatus_search.classList.add('topStatus_searchbg');  
						plus.navigator.setStatusBarStyle( "dark" );
					}else if(mui('.mescroll').pullRefresh().y > -100 && topStatus_search.classList.contains('topStatus_searchbg')){ //开始
						topStatus_search.classList.remove('topStatus_searchbg'); 
						plus.navigator.setStatusBarStyle( "light" );
					}
				});*/
			}
		}
	}
});


//用于用户退出登录时重新加载首页数据
window.addEventListener('downCallback',function(){
	vm.downCallback();
});

//tabs切换
/*function tabsAct(ele){
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
tabsAct(ele);*/
