var dmsg = new Vue({
    el:'#directmessage',
    data:{
        show:false,
        userId:0,
        userName:'',
        //联系人列表
        paged:1,
        contextUsers:[],
        showList:false,
        timeAgo:new timeago(),
        //联系人列表分页
        pages:0,
        paged:1,
        type:zrz_dmsg.type,
        mtype:'',
        //私信对话
        duserData:zrz_dmsg.duserData,
        cuserData:zrz_dmsg.cuserData,
        msgData:[],
        countDh:0,
        dmsgContent:'',
        //表情
        smiles:'',
        smileShow:false,
        smily:false,
        //发布私信
        sedLocked:false,
        sedErrorMsg:'',
        security:''
    },
    mounted:function(){
        if(this.$refs.nologin) return;
        if(this.type === 'index'){
            this.getList(this.paged);
        }else{
            this.pages = zrz_dmsg.pages;
            this.paged = zrz_dmsg.pages;
            this.countDh = zrz_dmsg.count;
            this.getDList(this.paged,'last');
            axios.post(zrz_script.ajax_url+'zrz_dmsg_read','cuser_id='+this.duserData.id).then(function(resout){
                console.log(resout);
            });
        }
        var that = this;
        document.body.onclick = function(){
            that.smileShow = false;
        };
        this.security = document.querySelector('#security').value;
    },
    methods:{
        timeago:function(){
            var that = this;
            setTimeout(function () {
                that.timeAgo.render(that.$el.querySelectorAll('.timeago'), 'zh_CN');
            }, 10);
        },
        reply:function(name,id){
            this.userId = id;
            this.userName = name;
            this.show = true;
            this.mtype = 'reply';
        },
        showBox:function(){
            this.show = true;
        },
        closeForm:function(){
            this.show = false;
            this.mtype = '';
        },
		getList:function(paged){
			var that = this;
			axios.post(zrz_script.ajax_url+'zrz_get_dmsg_user_list','paged='+paged).then(function(resout){
                console.log(resout);
				if(resout.data.status == 200){
					that.contextUsers = resout.data.msg;
					that.paged = paged;
				}
				that.$refs.loading.style.display = 'none';
				that.showList = true;
				that.timeago();
				if(paged == 1){
					that.pages = resout.data.pages
				}
			})
		},
        getDList:function(paged,type){
            var that = this;
            if(type == 'last'){
                paged = this.pages;
            }
			axios.post(zrz_script.ajax_url+'zrz_get_dmsg_data','paged='+paged+'&duser_id='+this.duserData.id).then(function(resout){
                if(resout.data.status == 200){
                    that.msgData = resout.data.msg;
                    that.paged = paged;
                }else{
                    that.$refs.showTips.className = 'loading-dom pos-r';
                }
                that.$refs.loading.style.display = 'none';
                that.timeago();
                setTimeout(function () {
                    autosize(that.$refs.msgContent);
                }, 10);

            })
        },
        content:function(event){
            if(this.smily == false && event.type == 'focus'){
                this.smily = true;
                this.sedErrorMsg = '';
            }else{
                this.smily = false;
            }
            this.dmsgContent = this.$refs.msgContent.value;
        },
        removeDmsg:function(id){
            console.log(id);
            var r = confirm('确认删除此条消息？');
            if (r == false) return;
            var that = this;

			axios.post(zrz_script.ajax_url+'zrz_dmsg_delete','user_id='+id).then(function(resout){
                console.log(resout);
                if(resout.data.status == 200){
                    that.$el.querySelector('#dmsg'+id).style.display = 'none';
                };
            })
        },
        //加载表情，添加表情
        smiley:function(){
            if(this.smileShow == true){
                this.smileShow = false;
                return
            }
            this.smileShow = true;
            if(this.smiles != '<b class="loading"></b>' && this.smiles != '') return;
            this.smiles = '<b class="loading"></b>';
            var that = this;
            axios.get(zrz_script.ajax_url+'zrz_smiley').then(function(resout){
                if(resout.data.status === 200){
                    that.smiles = resout.data.html;
                    setTimeout(function () {
                        addSmily();
                    }, 0);
                }
            })
        },
        msgSubmit:function(){
            if(this.sedLocked == true) return;
            this.sedLocked = true;
            var that = this;
            axios.post(zrz_script.ajax_url+'zrz_send_msg','to_id='+this.duserData.id+'&content='+this.dmsgContent+'&security='+this.security).then(function(resout){
                if(resout.data.status == 200){
                    that.sedErrorMsg = '<span class="green">发送成功</span>';
                    that.msgData.push(resout.data.msgData);
                    that.timeago();
                    that.dmsgContent = '';
                }else{
                    that.sedErrorMsg = '<span class="red">发送失败</span>';
                }
                that.sedLocked = false;
            })
        }
    },
    components:{
        "page-nav":pageNav,
        'msg-box':dmsg
    }
})
