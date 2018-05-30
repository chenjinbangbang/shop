

mui.init({
				//配置下拉刷新和上拉加载
		pullRefresh: {
			container: '#refreshContainer',
			//下拉刷新
			down: {
				//style: 'circle', 
				contentdown: "下拉可以刷新",
				contentover: '释放立即刷新',
				contentrefresh: '正在刷新...',
				callback: pulldownRefresh
			},
			//上拉加载
			up: {
				callback: pullupRefresh
			}
		}
	});
	
	//下拉刷新
	function pulldownRefresh(){
		setTimeout(function(){
			//结束下拉刷新
			mui('#refreshContainer').pullRefresh().endPulldownToRefresh();	
		},1000);
	}
	
	//上拉加载
	function pullupRefresh(){
		setTimeout(function(){
			//创建dom
			/*var table =document.querySelector(".like ul");
			for(var i=0;i<3;i++){
				var li = document.createElement("li");
				//li.className = "mui-table-view-cell mui-media";
			
	            var str = `<a href="detai3.html">
						<div class="like-left">
							<img src="../imgs/${i+1}.jpg" alt="" />
						</div>
						<div class="like-right">
							<div class="name">爱奇艺VIP黄金会员月卡 爱奇艺会员1个月</div>
							<div class="price">
								<p><span>￥</span>19.9</p>
								<p>月销49118</p>
							</div>
							<div class="price1">
								<p>天猫价  ￥69.9</p>
								<div class="ticket">
									<img src="../imgs/ticket.png" alt="" />
								</div>
							</div>
						</div>
					</a>`;
	                
	            li.innerHTML = str;
	            table.appendChild(li);    
			}*/
			//结束下拉刷新
			mui('#refreshContainer').pullRefresh().endPullupToRefresh();	
		},1000);
	}
	
	//关闭页面时触发
	var old_back = mui.back;
	mui.back = function(){
		plus.navigator.setStatusBarStyle( "dark" );
		old_back();
	};
	
	mui.plusReady(function(){
		
		plus.navigator.setStatusBarStyle( "light" );
		
		//滑动到底部（因为dom还没加载完导致失效，所以在plusReady里面才生效）
		//mui('.mui-scroll-wrapper').scroll().scrollToBottom(10); 
		
	});
	
	//回到顶部和返回按钮显示与隐藏
	var scrollToTopBox = document.getElementById('scrollToTop');
	var back = document.querySelector('.back'); //返回按钮
	var backNav = document.querySelector('.mui-bar-nav'); //返回
	var topStatus = document.querySelector('.topStatus'); //顶部状态栏
	scrollToTopBox.addEventListener('tap',function(e){
		e.stopPropagation();
		mui('.mui-scroll-wrapper').pullRefresh().scrollTo(0,0,1000);
	});
	//Android上监听原生滚动，IOS上监听div滚动，上拉超过一定距离后显示按钮，否则隐藏，可自行在条件判断中修改
	if(mui.os.android){ //android设备
		window.addEventListener('scroll',function(e){
			console.log(window.pageYOffset);
			//返回按钮的显示与隐藏
			if(window.pageYOffset > 0 && !back.classList.contains('hide')){
				back.classList.add('hide');
			}else if(window.pageYOffset <= 0 && back.classList.contains('hide')){
				back.classList.remove('hide');
			}
			//返回按钮的变化
			if(window.pageYOffset >= 100 && backNav.classList.contains('hide')){ //下面
				back.classList.add('hide');
				backNav.classList.remove('hide');
				plus.navigator.setStatusBarStyle( "dark" );
				topStatus.classList.remove('hide');
			}else if(window.pageYOffset < 100 && !backNav.classList.contains('hide')){ //开始
				back.classList.remove('hide');
				backNav.classList.add('hide');
				plus.navigator.setStatusBarStyle( "light" );
				topStatus.classList.add('hide');
			}
			
			if(window.pageYOffset >= window.innerHeight && scrollToTopBox.classList.contains('hidden')){
				scrollToTopBox.classList.remove('hide');
			}else if(window.pageYOffset < window.innerHeight && !scrollToTopBox.classList.contains('hide')){
				scrollToTopBox.classList.add('hide');
			}
		});
	}else{ //ios设备
		//console.log(scrollToTopBox.classList);
		document.querySelector('.mui-scroll-wrapper').addEventListener('scroll',function(){
			//mui('.mui-scroll-wrapper').pullRefresh().y：获取距离顶部的距离大小
			//返回按钮的显示与隐藏
			if(mui('.mui-scroll-wrapper').pullRefresh().y > 0 && !back.classList.contains('hide')){
				back.classList.add('hide');
			}else if(mui('.mui-scroll-wrapper').pullRefresh().y <= 0 && back.classList.contains('hide')){
				back.classList.remove('hide');
			}
			//返回按钮的变化
			if(mui('.mui-scroll-wrapper').pullRefresh().y <= -100 && backNav.classList.contains('hide')){ //下面
				back.classList.add('hide');
				backNav.classList.remove('hide');
				//plus.navigator.setStatusBarBackground("#f00"); //无效，因为manifest.json配置优先级高
				plus.navigator.setStatusBarStyle( "dark" );
				topStatus.classList.remove('hide');
			}else if(mui('.mui-scroll-wrapper').pullRefresh().y > -100 && !backNav.classList.contains('hide')){ //开始
				back.classList.remove('hide');
				backNav.classList.add('hide');
				plus.navigator.setStatusBarStyle( "light" );
				topStatus.classList.add('hide');
			}
			
			if(mui('.mui-scroll-wrapper').pullRefresh().y <= window.innerHeight * (-1) && scrollToTopBox.classList.contains('hide')){
				scrollToTopBox.classList.remove('hide');
			}else if(mui('.mui-scroll-wrapper').pullRefresh().y > window.innerHeight * (-1) && !scrollToTopBox.classList.contains('hide')){
				scrollToTopBox.classList.add('hide');
			}
		});
	}
	
	//点击收藏
	document.getElementById("collect").addEventListener('tap',function(){
		
		this.classList.toggle('active');
		if(this.classList.contains('active')){
			var message = '<div class="starToast"><span class="iconfont icon-star1"></span><span class="message">收藏成功!</span></div>';
			mui.toast(message,{duration: 1000,type: 'div'});
			document.getElementById("star").innerHTML = '已收藏';
		}else{ 
			var message = '<div class="starToast"><span class="iconfont icon-star1"></span><span class="message">取消收藏成功!</span></div>';
			mui.toast(message,{duration: 1000,type: 'div'});
			document.getElementById("star").innerHTML = '收藏';
		}
		
	});