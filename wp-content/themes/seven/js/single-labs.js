var vote = new Vue({
    el:'#vote-entry-content',
    data:{
        voteCount:0,
        list:zrz_labs.list,
        path:zrz_labs.path,
        showResout:false,
        total:0,
        locked:false
    },
    mounted:function(){
        if(!this.$refs.listNone) return;
        this.$refs.listNone.className += 'hide';
        for (var i = 0; i < this.list.length; i++) {
            this.total += parseInt(this.list[i].p);
        }
    },
    methods:{
        picked:function(index){
            if(this.locked == true) return;
            if(this.list[index].c == 1){
                this.list[index].c = 0;
                this.list[index].p = parseInt(this.list[index].p) - 1;;
                this.voteCount -=1;
                this.total -=1;
            }else{
                this.list[index].c = 1;
                this.list[index].p = parseInt(this.list[index].p) + 1;
                this.voteCount +=1;
                this.total +=1;
            }
        },
        resout:function(type){
            if(this.voteCount == 0) return;

            if(type == 'next'){
                this.showResout = true;
            }else{
                this.showResout = false;
            }
            if(this.locked == true) return;
            var arr = [];
            for (var i = 0; i < this.list.length; i++) {
                if(this.list[i].c == 1){
                    arr.push(i)
                }
            }
            var data = {
                'pid':zrz_labs.post_id,
                'list':arr
            };
            var that = this;
            axios.post(zrz_script.ajax_url+'zrz_get_vote_resout',Qs.stringify(data)).then(function(resout){
                if(resout.data.status === 200){
                    that.locked = true;
                }
            })
        },
        deletePost:function(id){
            var r = confirm('确认删除这个研究吗？');
            if (r == false) return;
            axios.post(zrz_script.ajax_url+'zrz_del_post','pid='+id).then(function(resout){
                if(resout.data.status == 200){
                    confirm('删除成功！');
                }
            })
        },
        setSwipe:function(id,event){
            var that = this;
            axios.post(zrz_script.ajax_url+'zrz_set_post_swipe','pid='+id).then(function(resout){
                if(resout.data.msg == 'del'){
                    event.target.innerText = '设为幻灯';
                }else{
                    event.target.innerText = '取消幻灯';
                }
            })
        },
    }
})

var youguess = new Vue({
    el:'#youguess-entry-content',
    data:{
        list:zrz_labs.list,
        path:zrz_labs.path,
        thisIndex:0,
        choseLocked:false,
        right:false,
        rightCount:0,
        resout:zrz_labs.resout
    },
    methods:{
        retry:function(){
            this.thisIndex = 0;
            this.rightCount = 0;
        },
        picked:function(key,index){
            if(this.choseLocked == true) return;
            this.choseLocked = true;
            if(this.list[index].a == key){
                this.right = true;
                this.rightCount ++;
            }else{
                this.right = false;
            }
            var that = this;
            setTimeout(function () {
                that.thisIndex = index + 1;
                that.choseLocked = false;
                if(that.thisIndex === that.list.length){
                    axios.post(zrz_script.ajax_url+'zrz_youguess_join','pid='+zrz_single.post_id).then(function(resout){console.log(resout);})
                }
            }, 800);
        },
        deletePost:function(id){
            var r = confirm('确认删除这个研究吗？');
            if (r == false) return;
            axios.post(zrz_script.ajax_url+'zrz_del_post','pid='+id).then(function(resout){
                if(resout.data.status == 200){
                    confirm('删除成功！');
                }
            })
        },
        setSwipe:function(id,event){
            var that = this;
            axios.post(zrz_script.ajax_url+'zrz_set_post_swipe','pid='+id).then(function(resout){
                if(resout.data.msg == 'del'){
                    event.target.innerText = '设为幻灯';
                }else{
                    event.target.innerText = '取消幻灯';
                }
            })
        },
    }
})

var isaid = new Vue({
    el:'#isaid-single',
    data:{
        postID:zrz_single.post_id,
        userLogin:zrz_script.is_login,
        paged:1,
        pages:0,
        locked:false,
        showButton:true,
    },
    mounted:function(){
        if (!window.sessionStorage) return;
        if(!this.$refs.isaidC) return;
        this.isaidUp();
        if(this.userLogin) return;
        this.voteInit();
    },
    methods:{
        isaidUp:function(){
            var that = this,
                button = document.querySelectorAll('.isaid-zan button');

            for (var i = 0; i < button.length; i++) {
                button[i].onclick = function(event){
                    var id = event.currentTarget.getAttribute('data-cid'),
                        ac = 0;
                    if(!zrz_script.is_login){
                        ac = that.commentUp(id);
                    }
                    axios.post(zrz_script.ajax_url+'zrz_isaid_comment_up','cid='+id+'&ac='+ac).then(function(resout){
                        if(resout.data.status == 200){
                            if(resout.data.msg){
                                document.getElementById('isaid'+id).innerText = parseInt(document.getElementById('isaid'+id).innerText) + 1;
                                document.getElementById('isaidI'+id).className = document.getElementById('isaidI'+id).className.replace(' zrz-icon-font-fabulous',' zrz-icon-font-zan');
                            }else{
                                document.getElementById('isaid'+id).innerText = parseInt(document.getElementById('isaid'+id).innerText) - 1;
                                document.getElementById('isaidI'+id).className = document.getElementById('isaidI'+id).className.replace(' zrz-icon-font-zan',' zrz-icon-font-fabulous');
                            }
                        }
                    })
                }
            }
        },
        commentUp:function(id){
            if (!window.sessionStorage) return;
            var upData = JSON.parse(localStorage.getItem('zrz_isaid'));
            upData = upData ? upData : [];
            var  index = upData.indexOf(id)
            if ( index !=-1) {
                upData.splice(index, 1);
                localStorage.setItem("zrz_isaid", JSON.stringify(upData));
                return 'del';
            }else{
                upData.push(id);
                localStorage.setItem("zrz_isaid", JSON.stringify(upData));
                return 'add';
            }
        },
        loadMoreComment:function(){
            if(this.locked == true) return;
            this.locked = true;
            this.paged  =  this.paged + 1;
            var data = {
                'post_id':zrz_single.post_id,
                'paged':this.paged
            },
            that = this;
            axios.post(zrz_script.ajax_url+'zrz_load_more_comments',Qs.stringify(data)).then(function(resout){
                if(resout.data.status === 200){
                    that.$refs.commentList.innerHTML += resout.data.msg;
                    that.locked = false;
                    if(that.paged == that.pages){
                        that.showButton = false;
                    }
                    Vue.nextTick(function(){
                        that.isaidUp();
                        that.voteInit();
                    })
                }
            })
        },
        deletePost:function(id){
            var r = confirm('确认删除这个研究吗？');
            if (r == false) return;
            axios.post(zrz_script.ajax_url+'zrz_del_post','pid='+id).then(function(resout){
                if(resout.data.status == 200){
                    confirm('删除成功！');
                }
            })
        },
        setSwipe:function(id,event){
            var that = this;
            axios.post(zrz_script.ajax_url+'zrz_set_post_swipe','pid='+id).then(function(resout){
                if(resout.data.msg == 'del'){
                    event.target.innerText = '设为幻灯';
                }else{
                    event.target.innerText = '取消幻灯';
                }
            })
        },
        voteInit:function(){
            var upData = JSON.parse(localStorage.getItem('zrz_isaid'));
            upData = upData ? upData : [];
            if(upData.length > 0){
                for (var i = 0; i < upData.length; i++) {
                    var id = upData[i];
                    if(document.getElementById('isaidI'+id))
                    document.getElementById('isaidI'+id).className = document.getElementById('isaidI'+id).className.replace(' zrz-icon-font-fabulous',' zrz-icon-font-zan');
                }
            }
        }
    },
})

var relay = new Vue({
    el:'#relay-single',
    data:{
        title:'',
        des:'',
        post_id:zrz_labs.post_id,
        img:'',
        uploadText:'添加一张图片',
        uploadLocked:false,
        thumbId:0,
        nub:0,
        name:'',
        url:'',
        avatar:'',
        text:'提交',
        submitLocked:false,
        paged:1,
        timeagoInstance:new timeago(),
    },
    mounted:function(){
        if(!this.$refs.relayBox) return;
        this.ac();
        this.timeago();
    },
    methods:{
        timeago:function(){
            //时间 time ago，如果想使用中文，请在最后
            this.timeagoInstance.render(this.$el.querySelectorAll('.timeago'), 'zh_CN');
        },
        imgUpload:function(event){
            var file = event.target.files[0];
            if(!file) return;
            if(this.uploadLocked == true) return;
            this.uploadText = '上传中...';
            if(file.type.indexOf('image') > -1){
                var that = this,
                    width = zrz_script.media_setting.max_width;

                imgcrop(file,width,'',function(resout){
                    if(resout[0] === true){
                        var formData = new FormData(),
                            fileData,key;
                            if(file.type.indexOf('gif') > -1){
                                fileData = file;
                                key = 'default.gif';
                            }else{
                                fileData = resout[2];
                                key = 'default.jpg';
                            }

                            formData.append("security", that.$refs.nonce.value);
                            formData.append("type",'labsThumbnail');
                            formData.append("user_id", zrz_script.current_user);
                            formData.append("file", fileData,key);

                            //开始上传
                            axios.post(zrz_script.ajax_url+'zrz_media_upload',formData)
                            .then(function(resout){
                                console.log(resout);
                                if(resout.data.status == 200){
                                    that.img = resout.data.Turl;
                                    that.thumbId = resout.data.imgdata;
                                    that.uploadText = '修改上传图片';
                                }else{
                                    that.uploadText = '上传失败，请重试!';
                                }
                                that.uploadLocked = false;
                            })
                    }else{
                        that.uploadText = '上传失败，请重试!';
                        that.uploadLocked = false;
                    }
                })
            }else{
                that.uploadText = '文件格式不正确，请重试！';
                that.uploadLocked = false;
            }
        },
        ac:function(){
            var that = this,
                button = this.$el.querySelectorAll('.relay-sh');
            for (var i = 0; i < button.length; i++) {
                button[i].onclick = function(){
                    var id = parseInt(this.getAttribute('data-id'));
                    axios.post(zrz_script.ajax_url+'zrz_relay_check','id='+id).then(function(resout){
                        console.log(resout);
                        if(resout.data.status == 200){
                            that.$el.querySelector('#relay'+id).querySelector('#wating').innerText = '审核成功';
                        }
                    })
                }
            }
            var button = this.$el.querySelectorAll('.relay-del');
            for (var i = 0; i < button.length; i++) {
                button[i].onclick = function(){
                    var r=confirm('确定要删除？');
                    if (r==false) return;
                    var id = parseInt(this.getAttribute('data-id'));
                    axios.post(zrz_script.ajax_url+'zrz_relay_del','id='+id).then(function(resout){
                        console.log(resout);
                        if(resout.data.status == 200){
                            that.$el.querySelector('#relay'+id).remove();
                        }
                    })
                }
            }
        },
        getList:function(paged){
            var that = this;
            axios.post(zrz_script.ajax_url+'zrz_get_relay_list','id='+this.post_id+'&paged='+paged).then(function(resout){
                if(resout.data.status == 200){
                    if(zrz_script.ajax_post == 1){
                        that.$refs.relayBox.insertAdjacentHTML('beforeend', resout.data.msg);
                    }else{
                        that.$refs.relayBox.innerHTML = resout.data.msg;
                        that.$scrollTo(that.$refs.relayBox, 400, {offset: -60});
                    }

                    that.paged = paged;
                    that.ac();
                    setTimeout(function () {
                        that.timeago();
                    }, 10);

                }

            })
        },
        submit:function(event){
            if(this.submitLocked == true) return;
            this.submitLocked = true;

            this.name = event.target.getAttribute('data-name');
            this.url = event.target.getAttribute('data-url');
            this.avatar = event.target.getAttribute('data-avatar');
            var data = {
                'id':this.thumbId,
                'title':this.title,
                'des':this.des,
                'post_id':this.post_id
            },that = this;
            this.text = '提交中...';
            axios.post(zrz_script.ajax_url+'zrz_relay_update',Qs.stringify(data)).then(function(resout){
                console.log(resout);
                if(resout.data.status == 200){
                    that.$refs.relayBox.innerHTML += '<div class="box mar10-b pd20">\
                        <h2 class="pos-r pd10-b b-b"><span class="relay-title-in">'+that.title+'</span></h2>\
                        <div class="clearfix pd10-t att-meta">\
                            <span class="fl">\
                                <a href="'+that.url+'"><img class="avatar" height="30" width="30" src="'+that.avatar+'" />'+that.name+'</a>\
                                刚刚\
                            </span>\
                            <div class="fr"><span class="fs12 red">正在审核中...</span></div>\
                        </div>\
                        <p><img class="relay-img mar20-t mar20-b" src="'+that.img+'" /></p>\
                        <p>'+that.des+'</p></div>';
                        that.thumbId = 0;
                        that.title = '';
                        that.des = '';
                        that.img = '';
                        that.text = '提交成功';
                }else{
                    that.text = '提交失败，请重试...';
                }
                that.submitLocked = false;
            })
        },
        deletePost:function(id){
            var r = confirm('确认删除这个研究吗？');
            if (r == false) return;
            axios.post(zrz_script.ajax_url+'zrz_del_post','pid='+id).then(function(resout){
                if(resout.data.status == 200){
                    confirm('删除成功！');
                }
            })
        },
        setSwipe:function(id,event){
            var that = this;
            axios.post(zrz_script.ajax_url+'zrz_set_post_swipe','pid='+id).then(function(resout){
                if(resout.data.msg == 'del'){
                    event.target.innerText = '设为幻灯';
                }else{
                    event.target.innerText = '取消幻灯';
                }
            })
        },
    },
    components:{
        "page-nav":pageNav
    }
})
