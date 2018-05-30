
var vm = new Vue({
	el: '#refreshContainer',
	data: {
		types: [], //类别
		typeIndex: null, //类别索引
		lists: [], //数据列表
		page: 1, //加载的页数，用于下拉加载更多数据
		type: 1, //1代表下拉加载,2代表下拉加载
	},
	mounted: function(){
		var self = this;
		
		mui.plusReady(function(){
			//状态栏初始化
			plus.navigator.setStatusBarStyle( "dark" );
			plus.navigator.setStatusBarBackground('#ffffff');
			
			mui.init({
				//swipeBack: true, //启动右滑关闭功能
				pullRefresh: {
					container: '#refreshContainer',
					//下拉刷新
					down: {
						auto: true,
						callback: function pulldownRefresh(){
							self.page = 1; //刷新并显示第一页
							self.type = 1; //代表下拉加载
							//获取数据
							self.initData();
						}
					},
					//上拉加载
					up: {
						callback: function pullupRefresh(){
							self.page++; //翻下一页
							self.type = 2; //代表下拉加载
							//获取数据
							self.initData();
						}
					}  
				}
			});

		});
	},
	methods: {
		//获取数据
		initData: function(){
			var self = this;
			var sign = localStorage.getItem('sign');
			var uid = localStorage.getItem('uid');
			var timestamp = localStorage.getItem('timestamp');
			
			app.ajax('/plugin.php?mod=wechat&act=app&do=tb&sign='+ sign +'&timestamp='+ timestamp +'&uid='+ uid +'&get=ppq&page='+self.page,{},function(data){
				console.log(JSON.stringify(data));
				
				//类别
				self.types = data.type;
				//self.typeIndex = self.types.
				
				//数据
				var list = data.list; 
				if(self.type === 1){
					//下拉刷新
					self.lists = list;
					
					 //有重新触发上拉加载的需求（比如当前类别已无更多数据，但切换到另外一个类别后，应支持继续上拉加载）
					//mui('#refreshContainer').pullRefresh().refresh(true);
					
					//结束下拉刷新
					mui('#refreshContainer').pullRefresh().endPulldownToRefresh();
				}else if(self.type === 2){
					//下拉加载
					if(list.length > 0){
						self.lists.push(list);
						mui('#refreshContainer').pullRefresh().endPullupToRefresh(false);	
					}else{
						mui('#refreshContainer').pullRefresh().endPullupToRefresh(true);	
					}
				}

			},function(){
				 mui('#refreshContainer').pullRefresh().endPullupToRefresh(true);
			});
		},
		//点击切换类别
		typeFn: function(index){
			this.typeIndex = index;
			
			this.initData();
		}
	}
});

//var page = 1; //页数
 
/*mui.plusReady(function(){ 
	
	
	//获取数据
	initData();
});
*/
/*//获取数据
function initData(){
	var sign = localStorage.getItem('sign');
	var uid = localStorage.getItem('uid');
	var timestamp = localStorage.getItem('timestamp');
	
	app.ajax('/plugin.php?mod=wechat&act=app&do=tb&sign='+ sign +'&timestamp='+ timestamp +'&uid='+ uid +'&get=ppq&page='+page,{},function(data){
		console.log(JSON.stringify(data)); 
		
		var listData = data.list;
		var list = document.getElementById("list");
		var str = '';
		mui.each(listData,function(index,item){
			str += '<li>'+
				'<a href="detail.html">'+
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
		
		if(page == 1){
			list.innerHTML = str;
			//结束下拉刷新
			mui('#refreshContainer').pullRefresh().endPulldownToRefresh();	
		}else{
			//判断是否有数据，没有就不添加数据
			if(str){ 
				list.appendChild(str);
				return;
			}

			//上拉加载结束
			mui('#refreshContainer').pullRefresh().endPullupToRefresh(true);	
		}
		
	});
}*/



var likeLi = document.querySelectorAll('.like ul li');
var likeLeft = document.querySelectorAll('.like .like-left');

/*document.querySelector('.menuIcon').addEventListener('tap',function(){
	
	if(this.classList.contains('mui-icon-list')){
		this.classList.remove('mui-icon-list');
		this.classList.add('mui-icon-bars'); 
		
		for(var i=0;i<likeLi.length;i++){
			likeLi[i].style.width = '50%';
			likeLi[i].querySelector('.name').style.marginBottom = '20px';
			likeLeft[i].style.width = '100%';
		}	
	}else{
		this.classList.add('mui-icon-list');
		this.classList.remove('mui-icon-bars');
		
		for(var i=0;i<likeLi.length;i++){
			likeLi[i].style.width = '100%';
			likeLi[i].querySelector('.name').style.marginBottom = '40px';
			likeLeft[i].style.width = '140px';
		}	
	}
});*/

//分类栏目跳转
mui('#list').on('tap','a',function(){
	var page = this.getAttribute('href');
	//var title =  this.getAttribute('title');
	
	//叮咚抢
	/*if(title == 'ddq'){
		page = '../ddq.html';
	}*/
	
	mui.openWindow({ 
		url: page,
		id: page,
		extras: {},
		waiting: {
			autoShow: true,
			title: '正在加载...'
		}
	});
});
