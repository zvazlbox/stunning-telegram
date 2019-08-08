var message = new Vue({
    el:'#notifications',
    data:{
        ac:0,
        msg:'',
        pages:0,
        paged:1,
        data:'',
        timeAgo:new timeago(),
        count:0,
        countNew:0,
        locked:false,
        msgContent:'',
    },
    mounted:function(){
        if(!this.$refs.notifications) return;
        this.getList(1);
    },
    methods:{
        timeago:function(){
            this.timeAgo.render(this.$el.querySelectorAll('.timeago'), 'zh_CN');
        },
        getList:function(paged){
            if(this.locked == true) return;
            this.locked = true;
            var that = this;
            axios.post(zrz_script.ajax_url+'zrz_get_message','paged='+paged).then(function(resout){
                console.log(resout);
                if(resout.data.status == 401){
                    that.msg = resout.data.msg
                    that.ac = 1;
                }else{
                    that.data = resout.data.msg;
                    if(paged == 1){
                        that.count = resout.data.count;
                        that.countNew = resout.data.countNew;
                        that.pages = resout.data.pages
                        axios.get(zrz_script.ajax_url+'zrz_msg_read');
                    }
                    that.paged = paged;
                    setTimeout(function () {
                        that.timeago();
                    }, 0);
                }
                that.locked = false;
            })
        }
    },
    components:{
        "page-nav":pageNav
    }
})
