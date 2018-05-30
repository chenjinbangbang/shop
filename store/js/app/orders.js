
mui.init({ 
				//配置下拉刷新和上拉加载
	pullRefresh: {
		container: '#refreshContainer',
		//下拉刷新
		down: {
			contentdown: "下拉可以刷新",
			contentover: '释放立即刷新',
			contentrefresh: '正在刷新...',
			callback: pulldownRefresh
		},
		//上拉加载
		up: {
			callback: pullupRefresh
		}
	},
	swipeBack: true, //启动右滑关闭功能，默认为false关闭（ios无效）
	/*keyEventBind: {
		backbutton: false //关闭back按键监听（Android手机）
	}*/
	beforeback: function(){
		
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
		/*var table =document.querySelector(".mui-table-view");
		for(var i=0;i<3;i++){
			var li = document.createElement("li");
			li.className = "mui-table-view-cell mui-media";
		
            var str = `<a href="../detail.html">
	        	<div class="price">￥200</div>
	            <img class="mui-media-object mui-pull-left" src="../../imgs/3.jpg">
	            <div class="mui-media-body">
	               蓝牙耳机
	                <p class='mui-ellipsis'>2018-10-10 15:15:15</p>
	            </div>
	        </a>`;
                
            li.innerHTML = str;
            table.appendChild(li);    
		}*/
		//结束上拉加载
		mui('#refreshContainer').pullRefresh().endPullupToRefresh();	
	},1000);
}

//onload从服务器获取列表数据
window.onload = function(){
	//从服务器获取数据
	//....
	//业务数据获取完毕，并已插入当前页面DOM
	//注意：若为ajax请求，则需将如下代码放在处理完ajax响应数据之后
	mui.plusReady(function(){ 
		
		//获取传过来的参数
		var self = plus.webview.currentWebview();
		var name = self.name; 
		console.log(name);
		
		//关闭等待框
		plus.nativeUI.closeWaiting(); 
		//显示当前页面
		mui.currentWebview.show();
	});
};

mui('#orders-tabs1').on('tap','li',function(){
	
	//tabs切换
	//console.log(this.classList); //获取当前的class列表
	var tabs1 = document.getElementById('orders-tabs1').children;
	for(var i=0;i<tabs1.length;i++){
		tabs1[i].classList.remove("active");
	}
	this.classList.add('active');
});

mui('#orders-tabs2').on('tap','li',function(){
	//tabs切换
	var tabs1 = document.getElementById('orders-tabs2').children;
	for(var i=0;i<tabs1.length;i++){
		tabs1[i].classList.remove("active");
	}
	this.classList.add('active');
});
