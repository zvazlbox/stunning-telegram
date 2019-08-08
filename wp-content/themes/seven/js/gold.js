var gold = new Vue({
    el:'#gold',
    data:{
        msg:'',
        pages:0,
        paged:1,
        data:[],
        timeAgo:new timeago(),
        count:0,
        countNew:0,
        locked:false,
        //充值
        show:false,
        price:0,
        type:'cz',
        txAllowed:zrz_gold.tx_allowed,
        //分页动作
        action:'',
        acType:'credit',//当前选项卡类型
    },
    mounted:function(){
        this.getList(1);
    },
    methods:{
        timeago:function(){
            this.timeAgo.render(this.$el.querySelectorAll('.timeago'), 'zh_CN');
        },
        changeType:function(type){
            this.acType = type;
            this.data = '';
            this.pages = 0;
            this.getList(1);
        },
        getList:function(paged){
            if(this.locked == true) return;
            this.locked = true;
            var that = this;
            if(this.acType == 'credit'){
                this.action = 'zrz_get_gold_message';
            }else if(this.acType == 'tx'){
                this.action = 'zrz_get_tx_message';
            }else if(this.acType == 'ye'){
                this.pages = 0;
            }
            axios.post(zrz_script.ajax_url+this.action,'paged='+paged+'&uid='+this.$refs.gold.getAttribute('data-uid')).then(function(resout){
                if(resout.data.status == 401){
                    that.msg = resout.data.msg
                }else{
                    that.data = resout.data.msg;
                    if(paged == 1){
                        that.count = resout.data.count;
                        that.countNew = resout.data.countNew;
                        that.pages = resout.data.pages
                    }
                    that.paged = paged;
                    setTimeout(function () {
                        that.timeago();
                        if(paged != 1){
                            that.$scrollTo(that.$refs.header, 400, {offset: -60});
                        }
                    }, 0);
                }
                that.locked = false;
            })
        },
        closeForm:function(){
            this.show = false;
            // this.acType = 'credit';
        }
    },
    components:{
        "page-nav":pageNav
    }
})
