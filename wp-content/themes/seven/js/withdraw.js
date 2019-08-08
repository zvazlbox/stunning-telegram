var gold = new Vue({
    el:'#withdraw',
    data:{
        pages:0,
        paged:1,
        data:[],
        locked:false,
        count:0,
        pages:0,
        show:false,
        payData:{
            'user_id':0,
            'user':'',
            'price':'',
            'weixin':'',
            'alipay':'',
            'msg_id':0
        }
    },
    mounted:function(){
        this.getList(1);
    },
    methods:{
        getList:function(paged){
            if(this.locked == true) return;
            this.locked = true;
            var that = this;
            axios.post(zrz_script.ajax_url+'zrz_get_tx_message','paged='+paged+'&uid='+this.$refs.withdraw.getAttribute('data-uid')+'&edit=1').then(function(resout){
                if(resout.data.status == 200){
                    that.data = resout.data.msg;
                    if(paged == 1){
                        that.count = resout.data.count;
                        that.pages = resout.data.pages;
                    }
                    that.paged = paged;
                    setTimeout(function () {
                        if(paged != 1){
                            that.$scrollTo(that.$refs.withdraw, 400, {offset: -60});
                        }
                    }, 0);
                }
                that.locked = false;
            })
        },
        pay:function(userId,user,price,weixin,weibo,msg_id){
            this.show = true;
            this.payData.user_id = userId;
            this.payData.user = user;
            this.payData.price = price;
            this.payData.weixin = weixin;
            this.payData.alipay = weibo;
            this.payData.msg_id = msg_id;
        },
        payed:function(){
            var that = this;
            axios.post(zrz_script.ajax_url+'zrz_withdraw_payed','id='+this.payData.msg_id).then(function(resout){
                if(resout.data.status == 200){
                    for (var i = 0; i < that.data.length; i++) {
                        if(that.data[i].id == that.payData.msg_id){
                            that.data[i].status = 1;
                        }
                    }
                    that.show = false;
                }
            })
        },
        closeForm:function(){
            this.show = false;
        }
    },
    components:{
        "page-nav":pageNav
    }
})
