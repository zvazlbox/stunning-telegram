var bubble = new Vue({
    el:'.bubble-ac',
    data:{
        timeagoInstance:new timeago(),
        commentUser:zrz_bubble.comment_user,
        login:zrz_script.is_login,
        userName:zrz_bubble.comment_user.user_name,
        content:'',
        smileShow:false,
        smiles:[],
        smileShowF:false,
        postId:0,
        pid:0,
        nonce:'',
        parentId:0,
        parentName:'',
        showInput:false,
        commentList:[],
        showList:false,
        //clientHeight:0,
        sendCommentLocked:false,
        commentError:'',
        commentPaged:1,
        commentPages:0,

        loadMoreCommentsText:'加载更多',
        //分页
        paged:0,
        pages:0,
        //发表冒泡
        smileShowTopic:false,
        smilesT:'',
        //冒泡图片
        imglist:[],
        imgTrueList:[],
        topicNonce:'',
        uploadLocked:false,
        showupload:true,
        showImgList:false,
        //插入视频
        showBubbleForm:'',
        videoUrl:'',
        videoList:[],
        videolocked:false,
        videoError:'',
        //新建话题
        topic:zrz_bubble.topicName ? zrz_bubble.topicName : zrz_bubble.default_name,
        showTopicBox:false,
        topicBulid:'',
        dou:false,
        //发布冒泡
        bubbleText:'',
        submitError:'',
        submitLocked:false,
        security:'',
        //图片点击放大
        oldId:0,
        oldIndex:0,
        //图片上传
        insertUri:'',
        imageBoxType:'upload'
    },
    mounted:function(){
        //评论框
        this.commentAc();
        this.timeago();
        this.smallImgToBig();
        this.videoAc();
        var that = this;
        document.body.onclick = function(){
            that.smileShow = false;
            that.smileShowTopic = false;
            that.showTopicBox = false;
        }
        if(!this.userName){
            this.showInput = true;
        }

        if(this.$refs.TopicNonce){
            that.topicNonce = this.$refs.TopicNonce.value;
        }
        //输入框自动长高
        autosize(this.$refs.textarea);
        setTimeout(function () {
            that.showAll();
        }, 500);
        if(this.$refs.security){
            this.security = this.$refs.security.value;
        }
        this.gifAc();
    },
    methods:{
        insetImageUri:function(){
            if(!this.insertUri) return;
            var that = this;
            //编辑器插入临时图像
            this.imglist.push(this.insertUri);
            this.imgTrueList.push(this.insertUri);

            Vue.nextTick(function(){
                that.showBubbleForm = '';
                that.insertUri = '';
            })
        },
        //图片上传事件
        imageHandler:function(){
            this.showBubbleForm = 'image';
        },
        imageUpload:function(){
            this.showBubbleForm = '';
            this.insertUri = '';
            this.$refs.getFile.click();
        },
        gifAc:function(){
            var gif = document.querySelectorAll('[data-img-gif]');
                for (var i = 0; i < gif.length; i++) {
                    gif[i].onclick = function(){
                        this.setAttribute('data-gif-text','加载中...');
                        var gifUrl = this.getAttribute('data-img-gif'),
                            that = this;
                        imgload(gifUrl,function(resout){
                            that.firstChild.src = gifUrl;
                            that.removeAttribute('data-img-gif');
                        })
                    }
                }
        },
        showAll:function(){
            var _that = this;
            var content = document.querySelectorAll('.entry-content-in');
            if(content.length > 0){
                for (var i = 0; i < content.length; i++) {
                    if(content[i].offsetHeight > 600){
                        content[i].parentNode.nextElementSibling.querySelectorAll('.bubble-more-content')[0].style.display = 'block';
                    }
                }
            }
            var showButton = document.querySelectorAll('.bubble-show');
            if(showButton.length > 0){
                for (var i = 0; i < showButton.length; i++) {
                    showButton[i].onclick = function(){
                        this.style.display = 'none';
                        this.nextElementSibling.style.display = 'block';
                        this.parentNode.parentNode.previousElementSibling.style = 'max-height:100%';
                    }
                }
            }
            var showButton = document.querySelectorAll('.bubble-hide');
            if(showButton.length > 0){
                for (var i = 0; i < showButton.length; i++) {
                    showButton[i].onclick = function(){
                        this.style.display = 'none';
                        this.previousElementSibling.style.display = 'block';
                        this.parentNode.parentNode.previousElementSibling.style = 'max-height:600px';
                        _that.$scrollTo(this.parentNode.parentNode.previousElementSibling, 400, {offset: -100});
                    }
                }
            }
        },
        //插入话题
        insertPpTopic:function(topicName){
            this.topic = topicName;
        },
        //新建话题
        newTopic:function(){
            if(!this.topicBulid) return;
            this.topic = this.topicBulid;
            this.showTopicBox = false;
        },
        changeText:function(event){
            this.bubbleText = event.currentTarget.value;
            this.submitError = '';
        },
        closeBubbleForm:function(){
            this.showBubbleForm = '';
        },
        submit:function(){
            if(this.submitLocked == true) return;
            this.submitLocked = true
            var data = {
                'text':this.bubbleText,
                'imgs':this.imgTrueList,
                'videos':this.videoList,
                'topic':this.topic,
                'security':this.security
            },that = this;
            axios.post(zrz_script.ajax_url+'zrz_add_bubble',Qs.stringify(data)).then(function(resout){
                if(resout.data.status == 200){
                    document.querySelector('#bubbleListHome').insertAdjacentHTML('afterbegin',resout.data.msg);
                    that.commentAc();
                    that.smallImgToBig();
                    that.videoAc();
                    that.bubbleText = '';
                    that.imgTrueList = [];
                    that.videoList = [];
                    that.imglist = [];
                    that.showImgList = false;
                }else{
                    that.submitError = resout.data.msg;
                }
                that.submitLocked = false;
            })
        },
        videoAc:function(){
            var _that = this;
            var videoBox = document.querySelectorAll('.content-video-box');
            for (var i = 0; i < videoBox.length; i++) {
                videoBox[i].onclick = function(){
                    var url = this.getAttribute('data-video-url');
                    var that = this;
                    that.className += ' ready';
                    axios.post(zrz_script.ajax_url+'zrz_video_upload','url='+url+'&type=url&single=true').then(function(resout){
                        if(resout.data.status == 200){
                            that.innerHTML = resout.data.msg;
                            that.className += ' hide-data';
                            setTimeout(function () {
                                _that.showAll();
                            }, 500);
                        }
                    })
                }
            }
            videoBackground();
            this.gifAc();
            var del = document.querySelectorAll('.delete-bubble'),
                that = this;

            if(del.length > 0){
                for (var i = 0; i < del.length; i++) {
                    del[i].onclick = function(){
                        var r = confirm('确认删除这个冒泡吗？');
                        if (r == false) return;
                        var id = this.getAttribute('data-id');
                        axios.post(zrz_script.ajax_url+'zrz_del_post','pid='+id).then(function(resout){
                            if(resout.data.status == 200){
                                document.querySelector('#bubbleList'+id).style.display = 'none';
                            }
                        })
                    }
                }
            }
            
            var pending = document.querySelectorAll('.pending-bubble');
            if(pending.length > 0){
                for (var i = 0; i < pending.length; i++) {
                    pending[i].onclick = function(){
                        var id = this.getAttribute('data-id');
                        axios.post(zrz_script.ajax_url+'zrz_pending_bubble','pid='+id).then(function(resout){
                            console.log(resout);
                            if(resout.data.status == 200){
                                alert('审核成功');
                                var dom = document.querySelector('#bubbleList'+id);
                                dom.className = dom.className.replace('status-pending','');
                                dom.querySelectorAll('.pending-text')[0].remove();
                                dom.querySelectorAll('.pending-bubble')[0].remove();
                            }
                        })
                    }
                }
            }
        },
        //图片点击放大
        smallImgToBig:function(){
            var small = document.querySelectorAll('.pps-img-small'),
                that = this;
            for (var i = 0; i < small.length; i++) {
                small[i].onclick = function(){
                    var id = this.getAttribute('data-postid'),
                        index = this.getAttribute('data-index');
                    if(that.oldId != 0){
                        document.querySelector('#img-big-'+that.oldIndex+'-in-'+that.oldId).className = 'pps-img-big hide';
                        var small = document.querySelector('#img-small-'+that.oldIndex+'-in-'+that.oldId);
                        small.className = small.className.replace(' picked','');
                        small.parentNode.className = small.parentNode.className.replace(' sm-wh','');
                    }
                    document.querySelector('#img-big-'+index+'-in-'+id).className = 'pps-img-big';
                    this.className += ' picked';
                    this.parentNode.className += ' sm-wh';
                    that.oldIndex = index;
                    that.oldId = id;
                    this.parentNode.parentNode.parentNode.style = 'max-height:100%';
                }
            }
        },
        getVideo:function(){
            if(this.videolocked == true) return;
            this.videolocked = true;
            if(!this.videoUrl) this.videoError = '请输入网址';
            var data = {
                'url':this.videoUrl,
                'type':'url',
                'security':this.topicNonce
            },
            that = this;
            axios.post(zrz_script.ajax_url+'zrz_video_upload',Qs.stringify(data)).then(function(resout){
                if(resout.data.status == 200){
                    if(resout.data.msg.indexOf('smartideo') != -1){
                        that.videoList.push({
                            'title':resout.data.img.title,
                            'img':resout.data.img.url.url,
                            'src':resout.data.src
                        });
                        that.showBubbleForm = '';
                        that.videoUrl = '';
                        that.videolocked = false;
                    }else{
                        that.videoError = '不支持此视频，请重试';
                        that.videolocked = false;
                    }
                }else{
                    that.videoError = resout.data.msg+'，请重试';
                    that.videolocked = false;
                }

            })
        },
        removeVideo:function(index){
            var r = confirm('确认删除这个视频吗？');
            if (r == false) return;
            this.videoList.splice(index, 1);
        },
        timeago:function(){
            //时间 time ago，如果想使用中文，请在最后
            this.timeagoInstance.render(document.querySelectorAll('.timeago'), 'zh_CN');
        },
        imgUpload:function(event){
            if(!event.target.files || this.uploadLocked == true) return;
            this.uploadLocked = true;
            var file = event.target.files[0];
            if(!file.type.match("image.*")) {
                return;
            }
            this.showImgList = true;
            var that = this;

            imgcrop(file,zrz_script.media_setting.max_width,'',function(resout){

                if(resout[0] === true){

                    //上传
                    var formData = new FormData();
                    if(file.type.indexOf('gif') > -1){
                        fileData = file;
                    }else{
                        fileData = resout[2];
                    }

                    formData.append("type", 'small');

                    formData.append('file',fileData,file.name);
                    formData.append("security", that.topicNonce);
                    formData.append("user_id", zrz_script.current_user);

                    axios.post(zrz_script.ajax_url+'zrz_media_upload',formData).then(function(resout){
                        if(resout.data.status == 200){
                            //上传成功，替换网址
                            if(resout.data.status == 200){
                                that.imglist.push(resout.data.url);
                                that.imgTrueList.push(resout.data.Turl);
                            }

                            if(that.imglist.length >= 6){
                                that.showupload = false;
                            }
                            that.$refs.getFile.value = '';
                            that.uploadLocked = false;
                        }
                    })
                }
            })
        },
        removeImg:function(index){
            var r = confirm('确认删除这个图片吗？');
            if (r == false) return;
            this.imglist.splice(index, 1);
            this.imgTrueList.splice(index, 1);
            if(this.imglist.length < 6){
                this.showupload = true;
            }
        },
        commentAc:function(){
            var that = this,
                bubbleList = document.querySelectorAll('.bubble-comment-button');

            for (var i = 0; i < bubbleList.length; i++) {
                bubbleList[i].onclick = function(e){
                    that.postId = this.getAttribute('data-id');
                    that.nonce = this.getAttribute('data-nonce');
                    that.parentId = 0;
                    that.parentName = '';
                    that.commentPaged = 1;
                    that.commentPages = 0;
                    var loadcomments = document.querySelectorAll('#bubbleList'+that.postId+' .load-more-comments')[0];
                    loadcomments.innerText = '加载更多';
                    that.showList = false;
                    that.commentButtonInit();
                    that.loveButtonInit();
                    that.content = '';

                    document.querySelector('#form'+that.postId).appendChild(that.$refs.formInput);
                    that.getComments();
                    this.className += ' picked';
                    document.querySelector('#commentH'+that.postId).className = 'bubble-comment-list pd20 b-t pjt';

                    // if(that.postId != that.pid){
                    //     that.setScroll();
                    // }
                    that.pid = that.postId;
                    that.$scrollTo(this, 400, {offset: -200});

                    //加载更多评论
                    loadcomments.onclick = function(){
                        if(that.commentPaged  > that.commentPages){
                             document.querySelectorAll('#bubbleList'+that.postId+' .load-more-comments')[0].innerText = '没有更多了';
                            return;
                        }
                        that.loadMoreComments();
                        loadcomments.innerText = '加载中...';
                    }
                }
            }

            var bubbleLove = document.querySelectorAll('.bubble-like-button');
            for (var i = 0; i < bubbleLove.length; i++) {
                bubbleLove[i].onclick = function(){

                    that.postId = this.getAttribute('data-id');
                    that.commentButtonInit();
                    that.loveButtonInit();
                    //that.getClientH();
                    that.content = '';

                    this.className += ' picked';
                    document.querySelector('#bubbleList'+that.postId).querySelectorAll('.bubble-like-box')[0].className = 'bubble-like-box b-t pjt';
                    var likeList = document.querySelectorAll('#bubbleList'+that.postId+' .like-list')[0];
                    if(likeList.innerHTML){
                        likeList.className = likeList.className.replace(' hide','');
                    }else{
                        likeList.className += ' hide';
                    }
                    that.$scrollTo(this, 500, {offset: -300});
                    // if(that.postId != that.pid){
                    //     that.setScroll();
                    // }
                    that.pid = that.postId;
                }
            }

            var loveButton = document.querySelectorAll('.bubble-like-button-ac');
            for (var i = 0; i < loveButton.length; i++) {
                loveButton[i].onclick = function(e){
                    that.favorites(e);
                }
            }
        },
        loveButtonInit:function(){
            if(!this.pid) return;
            document.querySelectorAll('#bubbleList'+this.pid+' .bubble-like-button')[0].className = 'bubble-like-button text';
            document.querySelectorAll('#bubbleList'+this.pid+' .bubble-like-box')[0].className = 'bubble-like-box';
        },
        commentButtonInit:function(){
            if(!this.pid) return;
            var button = document.querySelectorAll('#bubbleList'+this.pid+' .bubble-comment-button')[0];
            button.className = button.className.replace(' picked','');
            document.querySelector('#commentH'+this.pid).className = 'bubble-comment-list';
        },
        commentReply:function(){
            var reply = document.querySelectorAll('.bubble-reply'),
                that = this;
            for (var i = 0; i < reply.length; i++) {
                reply[i].onclick = function(){
                    that.parentId = this.getAttribute('data-id');
                    that.parentName = this.getAttribute('data-author-name');
                    that.$scrollTo(document.querySelector('#form'+that.postId), 400, {offset: -200});
                }
            }
        },
        changeAvatar:function(event){

            if(this.smileShowF == false && event.type == 'focus'){
                this.smileShowF = true
            }else{
                this.smileShowF = false;
            }
            this.commentError = '';
            if(event.target.tagName == 'TEXTAREA' && this.commentUser.user_name && this.commentUser.user_email){
                this.showInput = false;
            }

            if(event.target.tagName == 'TEXTAREA'){
                this.content = event.target.value;
            }

            if(this.userName == zrz_bubble.comment_user.user_name) return;
            var that = this;
            axios.post(zrz_script.ajax_url+'zrz_change_avatar','name='+this.commentUser.user_name).then(function(resout){
                if(resout.data.status === 200){
                    that.commentUser.avatar = resout.data.src;
                }
            })
        },
        smiley:function(){
            if(this.smileShow == true){
                this.smileShow = false;
                return
            }
            this.smileShowTopic = false;
            this.smileShow = true;
            if(this.smiles != '<b class="loading"></b>' && this.smiles != '') return;
            this.smiles = '<b class="loading"></b>';
            var that = this;
            axios.get(zrz_script.ajax_url+'zrz_smiley').then(function(resout){
                if(resout.data.status === 200){
                    that.smiles = resout.data.html;
                    setTimeout(function () {
                        addSmily('comments');
                    }, 0);
                }
            })
        },
        smileyTopic:function(){
            this.showTopicBox = false;
            if(this.smileShowTopic == true){
                this.smileShowTopic = false;
                return
            }
            this.smileShow = false;
            this.smileShowTopic = true;
            if(this.smilesT != '<b class="loading"></b>' && this.smilesT != '') return;
            this.smilesT = '<b class="loading"></b>';
            var that = this;
            axios.get(zrz_script.ajax_url+'zrz_smiley').then(function(resout){
                if(resout.data.status === 200){
                    that.smilesT = resout.data.html;
                    setTimeout(function () {
                        addSmily();
                    }, 0);
                }
            })
        },
        getComments:function(){
            var data = {
                pid:this.postId,
                paged:this.commentPaged
            },
            that = this;
            axios.post(zrz_script.ajax_url+'zrz_bubble_comment',Qs.stringify(data)).then(function(resout){
                console.log(resout);
                if(resout.data.status == 200){

                    if(that.commentPaged == 1){
                        document.querySelector('#list'+that.postId).innerHTML = resout.data.msg;
                    }else{
                        document.querySelector('#list'+that.postId).insertAdjacentHTML('beforeend',resout.data.msg);
                    }
                    that.showList = true;
                    that.timeago();
                    that.commentReply();
                    if(that.commentPaged == 1){
                        that.commentPages = resout.data.pages;
                    }
                    that.commentPaged++;
                    if(that.commentPages > 1){
                        document.querySelectorAll('#commentH'+that.postId+' .t-c')[0].style.display = 'block';
                    }
                    document.querySelector('#list'+that.postId).style.display = 'block';
                }

                if(that.commentPaged == 1 && resout.data.status == 401){
                    document.querySelectorAll('#commentH'+that.postId+' .comment-none')[0].style.display = 'block';
                }
                document.querySelectorAll('#bubbleList'+that.postId+' .load-more-comments')[0].innerText = '加载更多';

                //that.getClientH();
            })
        },
        sendComment:function(){
            if(this.sendCommentLocked == true) return;
            this.sendCommentLocked = true;
            var data = {
                'author':this.commentUser.user_name,
                'email':this.commentUser.user_email,
                'comment':this.content,
                'comment_parent':this.parentId,
                'comment_post_ID':this.postId,
                '_wp_unfiltered_html_comment':this.nonce,
                'type':'bubble'
            },
            that = this;
            axios.post(zrz_script.ajax_url+'zrz_save_comment',Qs.stringify(data)).then(function(resout){
                if(resout.data.status == 200){
                    document.querySelector('#list'+that.postId).insertAdjacentHTML('afterbegin',resout.data.msg);
                    that.timeago();
                    document.querySelector('#list'+that.postId).style.display = 'block';
                    document.querySelectorAll('#commentH'+that.postId+' .comment-none')[0].style.display = 'none';
                    that.content = '';
                }else{
                    that.commentError = resout.data.msg;
                }
                that.sendCommentLocked = false;
            })

        },
        loadMoreComments:function(){
            this.getComments();
        },
        showInputAc:function(){
            this.showInput = !this.showInput;
        },
        removeParent:function(){
            this.parentId = 0;
            this.parentName = '';
        },
        favorites:function(e){
            var that = this,
                dom = e.currentTarget,
                parent = dom.parentNode,
                loveButton = parent.parentNode.parentNode;
                if(!this.login){
                    parent.querySelectorAll('.count')[0].style.display = 'none';
                    parent.querySelectorAll('.love-text')[0].innerText = '请先登录！';
                    return;
                }
            axios.post(zrz_script.ajax_url+'zrz_post_favorites','pid='+this.postId+'&type=bubble').then(function(resout){
                if(resout.data.loved == 1){
                    parent.querySelectorAll('.count')[0].innerText ++;
                    parent.querySelectorAll('.love-text')[0].innerText = '个人喜欢，其中包括你！^_^';
                    dom.firstChild.className = 'iconfont zrz-icon-font-love';
                    loveButton.querySelectorAll('.bubble-content-meta .bubble-like-button i')[0].className = 'iconfont zrz-icon-font-love';
                    loveButton.querySelectorAll('.bubble-content-meta .bubble-like-button b')[0].innerText ++;
                    var likeList = parent.parentNode.querySelectorAll('.like-list')[0];
                    likeList.insertAdjacentHTML('afterbegin', '<span class="u'+zrz_script.current_user+'">'+zrz_bubble.user_avatar+'</span>');
                    if(likeList.innerHTML){
                        likeList.className = likeList.className.replace(' hide','');
                    }
                }else{
                    parent.querySelectorAll('.count')[0].innerText --;
                    parent.querySelectorAll('.love-text')[0].innerText = '个人喜欢，你呢？';
                    dom.firstChild.className = 'iconfont zrz-icon-font-xihuan';
                    loveButton.querySelectorAll('.bubble-content-meta .bubble-like-button i')[0].className = 'iconfont zrz-icon-font-xihuan';
                    loveButton.querySelectorAll('.bubble-content-meta .bubble-like-button b')[0].innerText --;
                    parent.parentNode.querySelectorAll('.like-list .u'+zrz_script.current_user)[0].remove();
                    var likeList = parent.parentNode.querySelectorAll('.like-list')[0];
                    if(!likeList.innerHTML){
                        likeList.className += ' hide';
                    }
                }
            })
        },
        listAc:function(){
            var that = this;
            this.commentAc();
            this.timeago();
            if(zrz_script.ajax_post != 1){
                this.$scrollTo(document.querySelector('#bubbleListHome'), 400, {offset: -80});
            }
            this.smallImgToBig();
            this.videoAc();
            this.parentId = 0;
            this.pid = 0;
            this.oldId = 0;
            this.parentName = '';
            this.commentPaged = 1;
            this.commentPages = 0;
            this.loadMoreCommentsText = '加载更多';
            this.showList = false;
            this.content = '';
            setTimeout(function () {
                that.showAll();
            }, 500);
        }
    },
    watch:{
        topic:function(val){
            this.dou = true;
            var that = this;
            setTimeout(function () {
                that.dou = false;
            }, 1500);
        }
    },

})
var bubblePageNav = new Vue({
    el:'.bubble-pagenav',
    components:{
        "page-nav":pageNav
    }
})
