var vip = new Vue({
	el:'#vips',
	data:{
		show:false,
		data:'',
		type:'',
		data:'',
		price:0
	},
	methods:{
		showForm:function(price,data){
			if(!zrz_script.is_login){
				signForm.showBox = true;
                signForm.signin = true;
				return;
			}
			this.price = price;
			this.data = data;
			this.show = true;
		},
		closeForm:function(){
			this.show = false
		}
	},
})