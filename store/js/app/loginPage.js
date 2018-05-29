
var vm = new Vue({
	el: '#loginPage',
	data: {
		form: {
			mobile: '13360502844',
			code: ''
		}
	},
	mounted: function(){
		mui.plusReady(function(){
			
			plus.navigator.setStatusBarStyle( "light" );  
			
		});
	},
	methods: {
		getCode: function(){
			var self = this;
			app.ajax('http://test.wx.nuozhe8.com/plugin.php?mod=wechat&act=app&do=sms_code&'+self.form.mobile,{},function(data){
				console.log(JSON.stringify(data));
				
				if(data.code === '10000'){
					
				}
				mui.toast(data.msg);
				
			});
		}
	}
});
