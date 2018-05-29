
/*mui.init({
	subpages: [{
		url: 'friends_sub.html',
		id: 'friends_sub.html',
		styles: {
			top: '64px',
			bottom: '0px'
		} 
	}]
});*/

mui.plusReady(function(){ 
	
	app.androidTop();
	
});

mui.init({
	//配置下拉刷新和上拉加载
	pullRefresh: {
		container: '#refreshContainer',
		//下拉刷新
		down: {
			style: 'circle',
			callback: function(){
				setTimeout(function(){
					//结束下拉刷新
					mui('#refreshContainer').pullRefresh().endPulldownToRefresh();	
				},1000);
			}
		},
		//上拉加载
		up: {
			//callback: pullupRefresh
		}
	}
});


//var tabsBtn = document.getElementById('friends-tabs').getElementsByTagName('li')[0];
//var tabsContent = document.getElementById('firends-content').getElementsByTagName('div');
mui('.friends-tabs').on('tap','li',function(){
	var id = this.getAttribute('id');
	
	console.log(this.index);
});