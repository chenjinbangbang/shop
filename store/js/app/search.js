
//tabs切换
mui('.tabs').on('tap','li',function(){
	var tabs = document.querySelector('.tabs').children;
	for(var i=0;i<tabs.length;i++){
		tabs[i].classList.remove("active");
	}
	this.classList.add('active');
});