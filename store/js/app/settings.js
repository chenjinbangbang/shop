
document.querySelector('.logout').addEventListener('tap',function(){
	mui.confirm('确定要退出当前账号？','提示',['退出','取消'],function(e){
		//e.index为0：退出，为1：取消
		
	});
});