//长微博组件
Vue.component('long-weibo', {
    props: ['show','postTitle'],
    template:'<div>\
        <div :class="[\'long-weibo\',\'pos-r\',\'dialog\',showLong ? \'dialog--open\' : \'\']">\
        <div class="dialog__overlay" @click="close"></div>\
        <div class="dialog__content long-weibo-content pd20" ref="opc">\
            <div id="long-img" style="background-color:#fff;padding-bottom:1px">\
                <div class="long-img pos-r" :style="\'background-image:url(\'+longImg+\')\'" ref="logimg">\
                <span class="long-site shadow" v-text="author+\' @ \'+siteName"></span>\
                <span class="long-date shadow" v-text="date"></span><h2 class="shadow">{{postTitle}}</h2>\
                </div>\
                <div class="long-content pos-r">\
                    <div class="des">{{des}}</div>\
                </div>\
                <div class="long-qcode t-l"><div>扫描二维码继续阅读</div><div class="long-author"></div><span class="pos-a qcode img-bg" :style="\'background-image:url(\'+qcode+\')\'"></span></div>\
            </div>\
            <div class="pos-a long-down"><button class="close mar10-r" @click="close()">关闭窗口</button><button @click="getLongWeibo()" :class="[\'mouh\',{\'disabled\' : locked}]"><b :class="locked ? \'loading\' : \'\'"></b>点击下载</button></div>\
        </div>\
        </div>\
    </div>',
    data:function(){
        return {
            showLong:false,
            title:this.postTitle,
            des:'',
            date:'',
            longImg:'',
            siteName:zrz_script.site_info.name,
            shareUrli:zrz_single.share_url,
            qcode:'',
            author:'',
            security:zrz_single.nonce,
            locked:false
        }
    },
    mounted:function(){
        var metas = document.getElementsByTagName('meta');
            var des = document.querySelectorAll('.post-excerpt')[0];
            if(des) {
                this.des = des.innerText;
            }else{
                this.des = document.querySelector('#entry-content').innerText;
            }
        for (var i=0; i<metas.length; i++) {
            if(metas[i].getAttribute("property") == "og:image") {
                this.longImg = metas[i].getAttribute("content");
            }
        }
        this.date = document.querySelector('#post-single').getAttribute('data-date');
        this.qcode = zrz_script.theme_url+'/inc/qrcode/index.php?c='+window.location.href;
        this.author = document.querySelectorAll('.author-name')[0].innerText;
    },
    methods:{
        close:function(){
            this.show = false;
            this.$emit('close-long')
        },
        openWeibo:function(){
            openWin(this.shareUrli,'weibo',600,600);
        },
        rebulid:function(){
            this.longImg = '';
            this.getLongWeibo();
        },
        getLongWeibo:function(){
            if(this.locked == true) return;
            this.locked = true;
            var that = this;
            axios.post(zrz_script.ajax_url+'zrz_img_url_to_base64','url='+this.longImg+'&security='+this.security).then(function(resout){
                if(resout.data.status == 200){
                    that.longImg = resout.data.msg;
                    that.$refs.logimg.setAttribute('crossOrigin','anonymous');
                    setTimeout(function () {
                        that.html2canvas();
                    }, 0);
                }
            });
        },
        isSafari:function(){
            var ua = navigator.userAgent.toLowerCase(); 
            if (ua.indexOf('safari') != -1) { 
                if (ua.indexOf('chrome') > -1) {
                  return false;
                } else {
                  return true;
                }
              }
        },
        html2canvas:function(){
            var that = this,
                dom = document.querySelector('#long-img'),
                w = dom.clientWidth,
                h = dom.clientHeight;

            html2canvas(dom,{
                allowTaint: true,
                taintTest: false,
                dpi: 240,
                scale: 2,
                with:w,
                height:h,
                onrendered: function (canvas){
                    var imgData = canvas.toDataURL();
                    that.downloadFile(that.title+'.png', imgData);
                    that.locked = false;
                    that.showLong = false;
                    that.$refs.opc.style.opacity = '0';
                }
            });
        },
        downloadFile:function(fileName, content) {
            var aLink = document.createElement('a');
            var blob = this.base64ToBlob(content); //new Blob([content]);
    
            var evt = document.createEvent("HTMLEvents");
            evt.initEvent("click", true, true);//initEvent 不加后两个参数在FF下会报错  事件类型，是否冒泡，是否阻止浏览器的默认行为
            aLink.download = fileName;
            aLink.href = URL.createObjectURL(blob);
    
            // aLink.dispatchEvent(evt);
            aLink.click()
          },
          //base64转blob
          base64ToBlob:function(code) {
            var parts = code.split(';base64,');
            var contentType = parts[0].split(':')[1];
            var raw = window.atob(parts[1]);
            var rawLength = raw.length;
    
            var uInt8Array = new Uint8Array(rawLength);
    
            for (var i = 0; i < rawLength; ++i) {
              uInt8Array[i] = raw.charCodeAt(i);
            }
            return new Blob([uInt8Array], {type: contentType});
          },
    },
    watch:{
        show:function(val){
            this.showLong = val;
            if(val){
                this.$refs.opc.style.opacity = '1';
            }else{
                this.$refs.opc.style.opacity = '0';
            }
        }
    }
})

//文章投票组件
Vue.component('face', {
    template:'<div v-if="show">\
        <div class="face-item fd pos-r mouh" v-for="(item , key, index) in items" @click="addface(key)" v-show="key != \'cute\' && key != \'wtf\'">\
            <div :class="[item.display,key+\'b\',{\'disabled\':disabled},\'vote-name\']">{{item.nub}}</div>\
                <div :class="[\'face\',item.class]">\
                    <img :src="theme_url+\'/images/face/\'+key+\'.svg\'" />\
                </div>\
        </div>\
    </div>\
    <div class="loading-dom" v-else>\
        <div class="lm"><div class="loading"></div></div>\
    </div>\
    ',
    data:function(){
        return {
            items:[],
            theme_url:zrz_script.theme_url,
            show:false,
            locked:false,
            disabled:false,
            count:0,
            total:0
        }
    },
    created:function() {
        if(!zrz_single.post_id) return;
        var that = this;
        axios.post(zrz_script.ajax_url+'zrz_get_post_face','post_id='+zrz_single.post_id).then(function(resout){
            if(resout.data.status === 200){
                that.items = resout.data.msg
                that.count = resout.data.count;
                if(resout.data.count >= 3){
                    that.disabled = true
                }
                that.total = resout.data.total;
            }
            that.show = true
        })
    },
    methods:{
        addface:function(type){
            var c  = this.$el.querySelectorAll('.'+type+'b')[0].className;
            if(this.locked === true || (c.indexOf('disabled') != -1 && c.indexOf('active') == -1)) return;
            this.locked = true;
            var that = this;
            axios.post(zrz_script.ajax_url+'zrz_add_post_face','post_id='+zrz_single.post_id+'&face='+type).then(function(resout){
                if(resout.data.status === 200){
                    var ac = resout.data.ac;
                    if(ac === 1){
                        that.items[type].display = 'active';
                    }else if(ac === -1){
                        that.items[type].display = '';
                    }
                    that.total = that.total + ac;
                    that.count = that.count + ac;
                    if(that.count >= 3){
                        that.disabled = true
                    }else{
                        that.disabled = false
                    }
                    that.items[type].nub = that.items[type].nub + ac;
                }
                that.locked = false;
            })
        }
    },
})

//计数
var postViews = new Vue({
    el:'#post-views',
    data:{
        countUpOption:{
            useEasing: true,
            useGrouping: false,
            separator: '',
            decimal: '',
        },
    },
    mounted:function(){
        if(!this.$refs.postViews) return;
        var that = this;
        //文章点击次数统计
        axios.post(zrz_script.ajax_url+'zrz_view','pid='+zrz_single.post_id).then(function(resout){
            if(resout.data.status == 200){
                var view = new CountUp(that.$refs.postViews, 0, resout.data.views, 0, 2.5,that.countUpOption);
                if (!view.error) {
                  view.start();
                }
                favorited.loved = resout.data.favorites.loved;
                favorited.count = resout.data.favorites.count;
            }
        })
    }
})

//点击收藏
var favorited = new Vue({
    el:'.footer-author',
    data:{
        loved:0,
        count:0
    },
    mounted:function(){
        if(!zrz_script.is_mobile){
            new Sticky('.entry-footer');
        }
    },
    methods:{
        favorites:function(){
            if(zrz_script.is_login == 0){
                signForm.showBox = true;
                signForm.signup = false;
                signForm.signin = true
            }

            var that = this;
            axios.post(zrz_script.ajax_url+'zrz_post_favorites','pid='+zrz_single.post_id+'&type=post').then(function(resout){
                if(resout.data.status == 200){
                    if(resout.data.loved == 1){
                        that.loved = 1;
                        that.count++;
                    }else{
                        that.loved = 0;
                        that.count--;
                    }
                }
            })
        }
    }
})

//关注与私信
var singleFollow = new Vue({
    el:'.single-post-meta',
    data:{
        cuser:zrz_script.current_user,
        follow:zrz_single.follow,
        tid:0,
        uname:'',
        author:zrz_single.post_author,
        showBox:false,
        mtype: '',
        countUpOption:{
            useEasing: true,
            useGrouping: false,
            separator: '',
            decimal: '',
        },
    },
    mounted:function(){
        if(this.$refs.postViews){
            var that = this;
            //文章点击次数统计
            axios.post(zrz_script.ajax_url+'zrz_view','pid='+zrz_single.post_id).then(function(resout){
                if(resout.data.status == 200){
                    var view = new CountUp(that.$refs.postViews, 0, resout.data.views, 0, 2.5,that.countUpOption);
                    if (!view.error) {
                      view.start();
                    }
                    favorited.loved = resout.data.favorites.loved;
                    favorited.count = resout.data.favorites.count;
                }
            })
        }
    },
    methods:{
        dMsgBox:function(){
            if(zrz_script.is_login == 0){
                signForm.showBox = true;
                signForm.signup = false;
                signForm.signin = true
            }else{
                this.tid = zrz_single.post_author;
                this.uname = this.$refs.uname.innerText;
                this.mtype = 'admin';
                this.showBox = true;
            }
        },
        followAc:function(){
            if(zrz_script.is_login == 0){
                signForm.showBox = true;
                signForm.signup = false;
                signForm.signin = true;
                return;
            }
            var that = this;
            axios.post(zrz_script.ajax_url+'zrz_follow','user_id='+this.author).then(function(resout){
                if(resout.data.status == 200){
                    if(resout.data.msg == 'add'){
                        that.follow = 1
                    }else{
                        that.follow = 0
                    }
                }
            })
        },
        closeForm:function(){
            this.showBox = false;
        },
    },
    components:{
        'msg-box':dmsg
    }
})

//语音播放
var postRead = new Vue({
    el:'.post-meta-read',
    data:{
        play:false,
        text:'',
    },
    methods:{
        playAudio:function(text){
            if(!text){
                this.text = document.querySelector('#content-innerText').innerText;
                this.text = encodeURI(this.text);
            }
            var that = this;
            if(this.play == false){
                setTimeout(function () {
                    that.$refs.audio.play();
                    that.play = true;
                }, 10);

            }else{
                setTimeout(function () {
                    that.$refs.audio.pause();
                    that.play = false;
                }, 10);

            }
        }
    }
})

var contentHide = new Vue({
    el:'.content-hide-tips',
    data:{
        payOpen:{
            weixin:zrz_script.pay_setting.weixin,
            alipay:zrz_script.pay_setting.alipay,
        },
        price:0,
        payLocked:false,
        coinPayMsg:'立刻支付',
        canReg:zrz_script.can_reg
    },
    methods:{
        payRmb:function(price){
            payform.show = true;
            payform.price = price;
            payform.data = zrz_single.post_id
        },
        coinPay:function(){
            if(this.payLocked == true) return;
            this.payLocked = true;
            var that = this;
            this.coinPayMsg = '支付中，请稍后...';
            axios.post(zrz_script.ajax_url+'zrz_post_pay_coin','pid='+zrz_single.post_id).then(function(resout){
                if(resout.data.status == 200){
                    that.coinPayMsg = '支付成功，刷新中...';
                    setTimeout(function () {
                        window.location.reload();
                    }, 1500);
                }else{
                    that.coinPayMsg = resout.data.msg;
                }
                that.payLocked = false;
            })
        },
        login:function(type){
            signForm.showBox = true;
            if(type === 'up'){
                signForm.signup = true;
                signForm.signin = false;
            }else{
                signForm.signin = true;
                signForm.signup = false;
            }
        },
    }
})

//文章内页长微博，打赏
var single = new Vue({
    el:'#post-ac',
    data:{
        longShow:false,
        postTitle:'',
        dsShow:false,
        authorData:[],
        price:0,
    },
    mounted:function(){
        if(document.querySelectorAll('.author-name').length > 0){
            this.authorData = {
                avatar:document.querySelectorAll('.single-post-meta a img')[0].src,
                name:document.querySelectorAll('.author-name')[0].innerText
            }
        }

        if(document.querySelectorAll('.entry-title').length > 0){
            this.postTitle = document.querySelectorAll('.entry-title')[0].innerText;
        }

        var videoBox = document.querySelectorAll('.content-video-box');
        for (var i = 0; i < videoBox.length; i++) {
            videoBox[i].onclick = function(){
                var url = this.getAttribute('data-video-url');
                var that = this;
                that.className += ' ready';
                axios.post(zrz_script.ajax_url+'zrz_video_upload','url='+url+'&type=url&single=1').then(function(resout){
                    if(resout.data.status == 200){
                        that.innerHTML = resout.data.msg;
                        that.className += ' hide-data';
                    }

                })
            }
        }
        downQcode();
        //代码高亮
        if(zrz_script.highlight == 1){
            var pre = document.querySelectorAll('pre');
            if(pre.length > 0){
                for (var i = 0; i < pre.length; i++) {
                    hljs.highlightBlock(pre[i]);
                }
            }
        }

        videoBackground();
    },
    methods:{
        showLongWeiBo:function(){
            this.longShow = !this.longShow;
        },
        closeLong:function(){
            this.longShow = false;
        },
        dsShowAc:function(){
            if(zrz_script.is_login == 0){
                signForm.showBox = true;
                signForm.signup = false;
                signForm.signin = true
            }else{
                this.dsShow = true;
                this.price = 2;
            }
        },
        closeForm:function(){
            this.dsShow = false;
        },
        deletePost:function(id){
            var r = confirm('确认删除这篇文章吗？');
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
        }
    }
})

var comments = new Vue({
    el:'#comments',
    data:{
        timeAgo:new timeago(),
        //用户是否登陆
        isLogin:zrz_script.is_login,
        //当前父评论ID
        pid:0,
        hellowMsg:'',
        //临时父评论ID
        pido:0,
        author:zrz_single.comment_user.user_name,
        authorLs:'1',
        email:zrz_single.comment_user.user_email,
        commentsCount:zrz_single.comment_user.comment_count,
        avatar:zrz_single.comment_user.avatar,
        editText:'修改资料',
        editBool:false,
        //评论内容
        commentContent:'',
        //评论数据检查
        errorEmail:false,
        errorName:false,
        errorContent:false,
        errorMsg:'',
        submitLocked:false,
        //表情
        smiles:'',
        smileShow:false,
        smileShowF:false,
        //评论图片
        commentImage:'',
        commentImageSrc:'',
        imageLocked:false,
        imageRemove:false,
        //名言警句
        helloLocked:false,
        uplocked:false,
        downlocked:false,
        commentStrCount:{
            count:50,
            cCount:0,
        },
    },
    mounted:function(){
        //评论时间
        if(parseInt(this.$refs.commentCount) != 0){
            this.timeago();
        }
        //点击回复按钮
        this.reply();
        //自动长高
        autosize(this.$refs.content);
        var that = this;
        //点击屏幕，隐藏表情框
        document.body.onclick = function(){
            that.smileShow = false;
            if(that.commentImage != '' && that.commentImageSrc != '') that.imageRemove = true
        };
        //如果是手机端，不显示名言警句
        if(!zrz_script.is_mobile) this.getHellowMsg();
        this.imgzoom();
    },
    methods:{
        sign:function(e){
            signForm.showBox = true;
            if(e === 'up'){
                signForm.signup = true;
                signForm.signin = false;
            }else{
                signForm.signin = true;
                signForm.signup = false;
            }
        },
        imgzoom:function(){
            var img = this.$el.querySelectorAll('.comment-img-box');
            if(img.length < 1) return;
            for (var index = 0; index < img.length; index++) {
                img[index].onclick = function(){
                    console.log(this.className);
                    if(this.className.indexOf('w100') !== -1){
                        this.className = this.className.replace(' w100','');
                    }else{
                        this.className += ' w100';
                    }
                };
            }
        },
        //事件 timeago 初始化
        timeago:function(){
            this.timeAgo.render(this.$el.querySelectorAll('.timeago'), 'zh_CN');
        },
        //回复按钮初始化
        reply:function(){
            var reply = document.querySelectorAll('.reply'),
                that = this;
            for (var i = 0; i < reply.length; i++) {
                reply[i].onclick = function(event){
                    that.pid = event.currentTarget.getAttribute('data-id');
                    that.moveForm(event);
                }
            }
            this.voteAc();
        },
        //回复按钮事件
        moveForm:function(event){
            if(this.pid !== 0 && this.pido === this.pid){
                this.$el.querySelector('#respond').appendChild(this.$el.querySelector('#commentform'));
                this.pid = 0;
                event.currentTarget.innerHTML = '回复';
            }else{
                this.$el.querySelector('#comment-form-'+this.pid).appendChild(this.$el.querySelector('#commentform'));
                if(this.pido !== 0){
                    this.$el.querySelector('#reply'+this.pido).innerHTML = '回复';
                }
                event.currentTarget.innerHTML = '<b class="red">取消</b>';
            }
            this.pido = this.pid;
        },
        //游客修改资料
        edit:function(){
            if(this.editBool === false){
                this.editBool = true;
                this.editText = '确认修改';
            }else{
                this.editBool = false;
                this.editText = '修改资料';
            }
        },
        //修改完成折叠
        contentBlur:function(event){
            this.commentContent = event.target.value;

            if(this.editBool === true && this.author && this.email){
                this.edit();
            }
            if(event.type == 'focus'){
                this.smileShowF = true;
            }else{
                this.smileShowF = false;
            }
            this.errorMsg = '';
            this.errorContent = false;
        },
        //更换名称以后生成头像
        changeAvatar:function(event){
            this.errorMsg = '';
            this.errorName = false;
            if(this.authorLs === this.author || !this.author) return;
            this.authorLs = this.author;
            var that = this;
            axios.post(zrz_script.ajax_url+'zrz_change_avatar','name='+this.author).then(function(resout){
                if(resout.data.status === 200){
                    that.avatar = resout.data.src;
                }
            })

        },
        //提交
        submit:function(){
            var ac = true;
            if(!zrz_script.is_login){
                if(!this.author){
                    this.errorName = true;
                    this.editBool = true;
                    ac = false;
                    this.errorMsg = '请输入称呼';
                }
                if(!this.email){
                    this.errorEmail = true;
                    this.editBool = true;
                    ac = false;
                    this.errorMsg = '请输入邮箱';
                }
            }
            if(!this.commentContent){
                this.errorContent = true
                ac = false;
                this.errorMsg = '请输入评论内容';
            }
            if(!ac) return;
            if(this.submitLocked === true) return;
            this.submitLocked = true;
            var text = this.commentContent;
            if(text && this.commentImageSrc){
                text = this.commentContent+'<div class="comment-img-box"><p><img src="'+this.commentImageSrc+'"></p></div>';
            }
            var data = {
                'author':this.author,
                'email':this.email,
                'comment':text,
                'comment_parent':this.pid,
                'comment_post_ID':zrz_single.post_id,
                '_wp_unfiltered_html_comment':zrz_single.wp_unfiltered_html_comment
            },
            that = this;
            axios.post(zrz_script.ajax_url+'zrz_save_comment',Qs.stringify(data)).then(function(resout){
                if(resout.data.status != 200){
                    that.errorMsg = resout.data.msg;
                }else{
                    if(that.$refs.commentTips){
                        that.$refs.commentTips.style.display = "none";
                    }

                    if(that.$refs.isaidComment){
                        isaid.$refs.commentList.insertAdjacentHTML('beforeend', resout.data.msg);
                    }else if(that.pid){
                        that.$el.querySelector('#comment-children-'+that.pid).insertAdjacentHTML('beforeend', resout.data.msg)
                    }else{
                        that.$refs.commentList.insertAdjacentHTML('beforeend', resout.data.msg)
                    }
                    that.commentRest();
                    if(!that.$refs.isaidComment)
                    that.timeAgo.render(that.$el.querySelector('#comment-'+resout.data.comment_id+' .timeago'), 'zh_CN');
                }
                that.submitLocked = false;
            })
        },
        //清除错误
        emptyError:function(){
            this.errorMsg = '';
            this.errorEmail = false;
        },
        //加载表情，添加表情
        smiley:function(){
            this.imageRemove = false;
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
        //上传评论图片
        getFile:function(event){
            if(this.imageLocked === true) return;
            var file = event.target.files[0];
            if(!file) return;
            this.imageLocked = true;
            this.imageRemove = true;
            if(file.type.indexOf('image') > -1){
                this.commentImage = '<b class="loading"></b>';
                var that = this;
                imgcrop(file,500,'',function(resout){
                    if(resout[0] === true){
                        imgload(resout[1],function(imgSize){
                            if(imgSize[0] >= 10 && imgSize[1] >= 10){
                                var formData = new FormData(),
                                    fileData,key;
                                    if(file.type.indexOf('gif') > -1){
                                        fileData = file;
                                        key = 'default.gif';
                                    }else{
                                        fileData = resout[2];
                                        key = 'default.jpg';
                                    }
                                    formData.append("security", that.$refs.comment_nonce.value);
                                    formData.append("type",'comment');
                                    formData.append("user_id", zrz_script.current_user);
                                    formData.append("file", fileData,key);
                                axios.post(zrz_script.ajax_url+'zrz_media_upload',formData)
                                .then(function(resout){
                                    if(resout.data.status == 200){
                                        imgload(resout.data.url,function(){
                                            that.commentImage = '<img src="'+resout.data.url+'" />';
                                            that.commentImageSrc = resout.data.Turl;
                                            that.imageLocked = false;
                                        })
                                    }else{
                                        that.error(resout.data.msg)
                                    }
                                })
                            }else{
                                that.error('尺寸太小<br>建议大于10*10');
                            }
                        })
                    }else{
                        this.error(resout[1]);
                    }
                })
            }else{
                this.error('不是图片文件<br>请重新选择')
            }
        },
        //错误信息
        error:function(msg){
            this.commentImage = '<span class="lm">'+msg+'</span>'
        },
        //删除图片确认
        removeImg:function(){
            var r = confirm('确认删除此条消息？');
            if (r == false) return;
            this.imgRest();
        },
        //删除图片
        imgRest:function(){
            this.commentImage = '';
            this.commentImageSrc = '';
            this.imageRemove = false;
            this.$refs.commentImgInput.value = "";
        },
        //获取随机名言警句
        getHellowMsg:function(){
            if(this.helloLocked == true) return;
            this.helloLocked = true;
            var that = this;
            axios.get(zrz_script.ajax_url+'zrz_hello_get_lyric').then(function(resout){
                if(resout.data.status === 200){
                    that.hellowMsg = resout.data.msg;
                    that.helloLocked = false;
                }
            })
        },
        //手动获取名言警句
        changeHellow:function(){
            this.getHellowMsg()
        },
        //发表评论以后重置
        commentRest:function(){
            this.imgRest();
            if(this.pid !== 0 && this.pido === this.pid){
                this.$el.querySelector('#reply'+this.pid).innerHTML = '回复';
                this.$el.querySelector('#respond').appendChild(this.$el.querySelector('#commentform'));
            }
            this.pid = 0;
            this.pido = 0;
            this.commentContent = '';
        },
        voteAc:function(){
            var up = this.$el.querySelectorAll('.cvote-up'),
                down = this.$el.querySelectorAll('.cvote-down'),
                that = this;

                for (var i = 0; i < up.length; i++) {
                    up[i].onclick = function(e){
                        if(that.voteLocked == true) return;
                        that.voteLocked = true;
                        that.vote(e,'up');
                    }
                }

                for (var i = 0; i < down.length; i++) {
                    down[i].onclick = function(e){
                        if(that.voteLocked == true) return;
                        that.voteLocked = true;
                        that.vote(e,'down');
                    }
                }
        },
        vote:function(event,type){
            console.log(111);
            if(!this.isLogin){
                signForm.showBox = true;
                signForm.signup = false;
                signForm.signin = true;
                this.voteLocked = false;
                return;
            }
            var loading = event.currentTarget,
                data = {
                    'comment_id':loading.getAttribute('data-Cid'),
                    'type':type
                },
                that = this;
            loading.firstChild.className = 'loading';
            axios.post(zrz_script.ajax_url+'zrz_commnet_up_down',Qs.stringify(data)).then(function(resout){
                if(resout.data.status == 200){
                    loading.className += ' hide';
                    loading.previousElementSibling.className = loading.previousElementSibling.className.replace('hide','');
                }else{
                    loading.innerText = resout.data.msg;
                }
                that.voteLocked = false;
                loading.firstChild.className = '';
            })
        },
    },
    watch:{
        commentContent:function(val){
            if(this.$refs.isaidComment){
                this.commentStrCount.cCount = val.length;
            }
        }
    },
    //分页组件
    components:{
        "page-nav":pageNav
    }
})
