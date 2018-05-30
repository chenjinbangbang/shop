
var vm = new Vue({
	el: '#loginPage',
	data: {
		form: {
			mobile: '13360502844',
			code: ''
		},
		codeTip: '获取验证码',
		isCode: false //是否发送验证码，发送了就等待60秒
	},
	mounted: function(){
		mui.plusReady(function(){
			
			plus.navigator.setStatusBarStyle( "light" );  
			
		});
	},
	computed: {
		isLogin: function(){
			var phoneReg = /^1[34578]\d{9}$/;
			var valid = phoneReg.test(this.form.mobile) && this.form.code !== '';
			return valid;
		}
	},
	methods: {
		//获取验证码
		getCode: function(){
			var self = this;
			
			if(!self.isCode){
				app.ajax('/plugin.php?mod=wechat&act=app&do=sms_code&mobile='+self.form.mobile,{},function(data){
					console.log(JSON.stringify(data));

					mui.toast(data.msg);
					
					//60秒后可重发
					var time = 60;
					var timeInter = setInterval(function(){
						self.codeTip = time+'秒后重发';
						if(time > 0){
							self.isCode = true;
							time--;
						}else{ 
							clearInterval(timeInter);
							self.codeTip = '获取验证码';
							self.isCode = false;
						}
					},1000);
					
				});
			}
			
		},
		login: function(){
			var self = this;
			
			app.ajax('/plugin.php?mod=wechat&act=app&do=register&mobile='+ this.form.mobile + '&vcode='+ this.form.vcode,{},function(data){
				var uid = data.uid;
				var token = data.token;
				
				plus.storage.setItem('uid',uid); //用户id
				plus.storage.setItem('token',token); //登录token
				
				var timestamp = Math.floor(new Date().getTime()/1000); //时间戳，单位秒
				var sign = hex_md5(data.token + timestamp + '123'); //签名
				plus.storage.setItem('sign',sign);
				plus.storage.setItem('timestamp',timestamp);
				
				mui.toast('登录成功');
				
				
				
			});
		}
	}
});
