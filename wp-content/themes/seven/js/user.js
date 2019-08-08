var userCover = new Vue({
    el:'#user-cover',
    data:{
        self:zrz_user.self,
        save:'保存',
        coverSrc:'',
        coverSrcR:zrz_user.author_data.cover,//取消时返回原图
        toolMsg:'请上下拖动图片来选择裁剪范围',
        nonce:'',
        toolShow:false,
        coverImgHeight:0,
        coverImgTop:0,
        coverButton:true,
        coverLock:false,
        isMobile:zrz_script.is_mobile,
        file:'',
        locked:false,
        pageWidth:parseInt(zrz_script.page_width),
        avatar:''
    },
    mounted:function(){
        if(!this.$refs.cover_nonce) return;
        this.nonce = this.$refs.cover_nonce.value;
        var that = this;
        setTimeout(function () {
            that.avatar = zrz_user.author_data.avatar;
        }, 300);
        imgload(zrz_user.author_data.cover,function(){
            that.coverSrc = zrz_user.author_data.cover;
        })
    },
    methods:{
        //获取用户封面图片，进行压缩矫正
        getFile:function(event){
            var file = event.target.files[0];
            if(!file) return;
            this.toolShow = true;
            this.coverButton = false;
            var that = this;
            if(file.type.indexOf('image') > -1){
                imgcrop(file,this.pageWidth,'',function(resout){
                    if(resout[0] === true){
                        imgload(resout[1],function(imgSize){
                            if(imgSize[0] >= 400 && imgSize[1] >=200){
                                that.coverImgHeight = imgSize[1];
                                that.coverImgTop =  Math.round(-((imgSize[1]/2)-120));
                                that.coverSrc = resout[1];
                                that.file = resout[2];
                                that.toolMsg = '请上下拖动图片来选择裁剪范围';
                            }else{
                                that.toolMsg = '<span class="red">尺寸太小，请选择大于 1000*240 像素的图片</span>';
                                that.coverButton = true;
                                that.locked = false;
                                that.save = '保存';
                            }
                        })
                    }else{
                        that.toolMsg = '<span class="red">'+resout[1]+'</span>';
                        that.coverButton = true;
                        that.locked = false;
                        that.save = '保存';
                    }
                });
            }else{
                that.toolMsg = '<span class="red">您选择的文件不是图片，请重试！</span>';
                that.coverButton = true;
                that.locked = false;
                that.save = '保存';
            }
        },
        //图片拖动
        coverDrag:function(ev){
            if(this.toolShow == false || this.coverLock == true) return;
            this.coverLock = true;
            var imgY = ev.target.offsetTop,
                wY = ev.clientY,
                that = this;
            document.onmousemove=function(e){
                e.preventDefault();
                if(that.coverLock == false) return;
                var lsY = imgY+e.clientY-wY;
                if(lsY <= 0 && that.coverImgHeight >= (240 + Math.abs(lsY))){
                   that.coverImgTop = lsY;
                }
            }
            document.onmouseup=function(){
                that.coverLock = false;
            }
        },
        //取消上传
        coverCancle:function(){
            this.coverSrc = this.coverSrcR;
            this.reset();
        },
        reset:function(){
            this.toolShow = false;
            this.coverButton = true;
            this.coverImgTop = 0;
            this.$refs.input.value = '';
            this.coverLock = false;
        },
        //图片上传
        saveCover:function(){
            if(this.locked) return;
            this.locked = true;
            this.save = '保存中...';
            var formData = new FormData();
                formData.append("security", this.nonce);
                formData.append("type",'cover');
                formData.append("cover_y", this.coverImgTop);
                formData.append("user_id", zrz_user.author_data.user_id);
                formData.append("file", this.file,'defalut.jpg');
            var that = this;
            axios.post(zrz_script.ajax_url+'zrz_media_upload',formData)
            .then(function(resout){
                console.log(resout);
                if(resout.data.status == 200){
                    imgload(resout.data.url,function(){
                        that.coverSrc = resout.data.url;
                        that.coverSrcR = resout.data.url;
                        that.locked = false;
                        that.save = '保存';
                        that.reset();
                    })
                }else{
                    that.toolMsg = '<span class="red">'+resout.data.msg+'</span>';
                    that.locked = false;
                    that.save = '保存';
                }
            })
        },
    }
})

var avatar = new Vue({
    el:'#user-avatar',
    data:{
        avatarMsg:'修改我的头像',
        avatarIcon:1,
        showMsg:0,
        avatarSrc:zrz_user.author_data.avatar ? zrz_user.author_data.avatar : '',
        locked:false,
        self:zrz_user.self,
        followText:'<i class="iconfont zrz-icon-font-lnicon34"></i> 关注Ta',
        followed:zrz_user.follow,
        followLocked:false,
        userData:{
            gender:zrz_user.setting.gender,
            bio:zrz_user.setting.bio,
            address:zrz_user.setting.address ? zrz_user.setting.address : {},
            phone:zrz_user.setting.phone,
            nickname:zrz_user.setting.nickname,
            mail:zrz_user.setting.mail,
            site:zrz_user.setting.site,
            pass:''
        },
        pass:'',
        rePass:'',
        userDataRest:{},
        social:{
            default:zrz_user.social.default,
            qq:{
                avatar:zrz_user.social.qq.avatar,
                bind:zrz_user.social.qq.bind
            },
            weibo:{
                avatar:zrz_user.social.weibo.avatar,
                bind:zrz_user.social.weibo.bind
            },
            weixin:{
                avatar:zrz_user.social.weixin.avatar,
                bind:zrz_user.social.weixin.bind
            }
        },
        avatarPicked:zrz_user.social.avatar_set,
        //显示隐藏按钮
        genderShow:false,
        bioShow:false,
        addressShow:false,
        phoneShow:false,
        nicknameShow:false,
        mailShow:false,
        siteShow:false,
        passShow:false,
        //财富设置
        cfSetting:{
            credit:{
                val:'',
                why:''
            },
            rmb:{
                val:'',
                why:''
            }
        },
        cfSettingRest:{},
        nubMsg:{
            credit:'',
            rmb:''
        },
        saveLocked:false,
        //密码验证
        passLocked:false,
        passMsg:false,
        //社交登录
        qqUrl:zrz_script.social.qq_url,
        weiboUrl:zrz_script.social.weibo_url,
        weixinUrl:zrz_script.social.weixin_url,
        openWindow:zrz_script.social.open_window,
        qq:zrz_script.social.qq,
        weibo:zrz_script.social.weibo,
        weixin:zrz_script.social.weixin,
        //邮箱验证
        mailMsg:'',
        //修改用户权限
        LvSelected:zrz_user.setting.lv,
        LvMsg:'',
        //小黑屋
        disabledUser:0,
        disabledDay:0,
        disabledMsg:'',
        //私信
        showBox:false,
        uid:0,
        uname:'',
        mtype:'',
        //发送验证码
        nub:60,
        sendCodeLocked:{
            'mail':false,
            'phone':false
        },
        security:signForm.$refs.security.value,
        sendText:{
            'mail':'发送验证码',
            'phone':'发送验证码',
        },
        code:'',
        pass:'',
        //添加地址
        add:{
            'address':'',
            'phone':'',
            'name':''
        },
        addError:'',
        defaultAddress:zrz_user.setting.defaultAddress,
        //收款码
        qcode:{
            'weixin':zrz_user.setting.weixin,
            'alipay':zrz_user.setting.alipay
        },
        qcodeError:''
    },
    mounted:function(){
        if(this.followed == 1){
            this.followText = '<i class="iconfont zrz-icon-font-jianhaocu"></i> 取消关注';
        }else{
            this.followText = '<i class="iconfont zrz-icon-font-lnicon34"></i> 关注Ta';
        }
        this.userDataRest = JSON.parse(JSON.stringify(this.userData));
        this.cfSettingRest = JSON.parse(JSON.stringify(this.cfSetting));
        if(typeof zrz_user != 'undefined'){
            achievement.uName = zrz_user.u_name;
        }
        if(typeof Select != 'undefined'){
            var address = new Select('#address',default_data);
        }
        if(typeof(zrz_user.abled) != 'string'){
            console.log(zrz_user.abled);
            this.disabledUser = zrz_user.abled.abled;
            this.disabledDay = zrz_user.abled.days;
        }
    },
    watch:{
        rePass:function(val){
            if(this.pass == val && val.length >= 6){
                this.passLocked = true;
            }else{
                this.passLocked = false;
            }
        },
        pass:function(val){
            if(this.rePass == val && val.length >= 6){
                this.userData.pass = val;
                this.passLocked = true;
            }else{
                this.passLocked = false;
            }
        }
    },
    methods:{
        getFile:function(event){
            var file = event.target.files[0];
            if(!file || this.locked === true) return;
            this.locked = true;
            if(file.type.indexOf('image') > -1){
                var that = this;
                imgcrop(file,300,'',function(resout){
                    if(resout[0] === true){
                        imgload(resout[1],function(imgSize){
                            if(imgSize[0] >= 100 && imgSize[1] >= 100){
                                that.avatarMsg = '保存中...';
                                that.showMsg = 1;
                                that.avatarIcon = 1;
                                var formData = new FormData(),
                                    fileData,key;
                                    if(file.type.indexOf('gif') > -1){
                                        fileData = file;
                                        key = 'default.gif';
                                    }else{
                                        fileData = resout[2];
                                        key = 'default.jpg';
                                    }
                                    formData.append("security", userCover.nonce);
                                    formData.append("type",'avatar');
                                    formData.append("user_id", zrz_user.author_data.user_id);
                                    formData.append("file", fileData,key);
                                axios.post(zrz_script.ajax_url+'zrz_media_upload',formData)
                                .then(function(resout){
                                    if(resout.data.status == 200){
                                        imgload(resout.data.url,function(){
                                            that.avatarSrc = resout.data.url;
                                            that.showMsg = 0;
                                            that.avatarMsg = '修改我的头像';
                                            that.locked = false;
                                        })
                                    }else{
                                        that.error(resout.data.msg)
                                    }
                                })
                            }else{
                                that.error('尺寸太小<br>建议大于100*100');
                            }
                        })
                    }else{
                        that.toolMsg = '<span class="red">'+resout[1]+'</span>';
                        that.coverButton = true;
                    }
                })
            }else{
                this.error('不是图片文件<br>请重新选择')
            }
        },
        getCodeFile:function(event,type){
            var file = event.target.files[0];
            if(!file || this.locked === true) return;
            this.locked = true;
            this.qcodeError = '';
            var that = this;
            if(file.type.indexOf('image') > -1){
                var formData = new FormData(),
                    fileData,key;
                fileData = file;
                key = 'default.png';

                formData.append("security", userCover.nonce);
                formData.append("type",type);
                formData.append("user_id", zrz_user.author_data.user_id);
                formData.append("file", fileData,key);

                axios.post(zrz_script.ajax_url+'zrz_media_upload',formData)
                .then(function(resout){
                    if(resout.data.status == 200){
                        that.qcodeError = '<span class="green">上传成功</span>';
                        if(type == 'weixin'){
                            that.qcode.weixin = resout.data.Turl;
                        }else{
                            that.qcode.alipay = resout.data.Turl;
                        }
                    }else{
                        that.qcodeError = '<span class="red">上传失败</span>';
                    }
                })
            }
        },
        error:function(msg){
            this.avatarMsg = msg;
            this.avatarIcon = 0;
            this.showMsg = 1;
            this.locked = false;
        },
        follow:function(){
            if(zrz_script.is_login == 0){
                signForm.showBox = true;
                signForm.signup = false;
                signForm.signin = true
                return;
            }
            if(this.followLocked == true) return;
            this.followLocked = true;
            var that = this;
            axios.post(zrz_script.ajax_url+'zrz_follow','user_id='+zrz_user.author_data.user_id).then(function(resout){
                if(resout.data.status == 200){
                    if(resout.data.msg == 'add'){
                        that.followText = '<i class="iconfont zrz-icon-font-jianhaocu"></i> 取消关注';
                        that.followed = 1;
                    }else{
                        that.followText = '<i class="iconfont zrz-icon-font-lnicon34"></i> 关注Ta';
                        that.followed = '';
                    }
                    that.followLocked = false;
                }
            })
        },
        msg:function(){
            if(zrz_script.is_login == 0){
                signForm.showBox = true;
                signForm.signup = false;
                signForm.signin = true;
                return;
            }
            this.showBox = true;
            this.uid = zrz_user.author_data.user_id;
            this.uname = zrz_user.author_data.name;
            this.mtype = 'author';
        },
        save:function(type){
            if(this.saveLocked == true) return;
            this.saveLocked = false;
            this.mailMsg = '';
            var that = this;
            if(type == 'pass'){
                if(this.passLocked == false) return;
                this.userData.pass = this.pass;
                setTimeout(function () {
                    that.passMsg = true;
                    setTimeout(function () {
                        window.location.reload();
                    }, 1500);
                }, 500);
            }
            var data = {
                'user_id':zrz_user.author_data.user_id,
                'type':type,
                'data':this.userData[type],
                'code':this.code,
                'pass':this.pass
            };
            axios.post(zrz_script.ajax_url+'zrz_ajax_update_user_data',Qs.stringify(data)).then(function(resout){
                console.log(resout);
                if(resout.data.status == 200){
                    that[type+'Show'] = false;
                }else{
                    if(type == 'mail'){
                        that.mailMsg = resout.data.msg;
                    }
                }
                that.saveLocked = false;
            })
        },
        cancelSave:function(type){
            this.userData[type] = this.userDataRest[type];
            this[type+'Show'] = false;
        },
        //绑定社交账户
        openWin:function(url,name){
            if(this.openWindow){
                var iTop = (window.screen.availHeight - 30 - 500) / 2;
                var iLeft = (window.screen.availWidth - 10 - 500) / 2;
                window.open(url, name, 'height=' + 500 + ',innerHeight=' + 500 + ',width=' + 500 + ',innerWidth=' + 500 + ',top=' + iTop + ',left=' + iLeft + ',status=no,toolbar=no,menubar=no,location=no,resizable=no,scrollbars=0,titlebar=no');
            }else{
                window.location.href = url;
            }
        },
        //解除绑定
        unbind:function(event,type){
            var r = confirm('确定要解除绑定吗？');
            if (r == false) return;
            var that = this;
            axios.post(zrz_script.ajax_url+'zrz_unbind_social','type='+type+'&user_id='+zrz_user.author_data.user_id).then(function(resout){
                if(resout.data.status == 200){
                    that.social[type].avatar = '';
                    that.social[type].bind = '';
                    if(resout.data.set = 'default'){
                        that.avatarPicked = 'default';
                    }
                }else{
                    event.target.previousElementSibling.innerHTML = '<span class="red">'+resout.data.msg+'</span>';
                }
            })
        },
        //选择头像
        setAvatar:function(type){
            var that = this;
            axios.post(zrz_script.ajax_url+'zrz_setting_set_avatar','type='+type+'&user_id='+zrz_user.author_data.user_id).then(function(resout){
                if(resout.data.status == 200){
                    that.avatarPicked = type;
                }
            })
        },
        //地址选择
        addressPicked:function(){
            if(this.add.address.length>0) return;
            var add = this.$refs.address.querySelectorAll('select');
            for (var i = 0; i < add.length; i++) {
                if(add[i].value == -1) return;
                if(i == 0){
                    this.add.address += add[i].options[parseInt(add[i].value)+1].innerText+' ';
                }else{
                    this.add.address += add[i].options[add[i].value].innerText+' ';
                }
            }
        },
        //积分和余额变更
        nubChange:function(type){
            var that = this,
                nub = 0,
                why = '';
            if(type == 'credit'){
                nub = this.cfSetting.credit.val;
                why = this.cfSetting.credit.why;
            }else if(type == 'rmb'){
                nub = this.cfSetting.rmb.val;
                why = this.cfSetting.rmb.why;
            }

            axios.post(zrz_script.ajax_url+'zrz_setting_change_nub','type='+type+'&user_id='+zrz_user.author_data.user_id+'&nub='+nub+'&why='+why).then(function(resout){
                console.log(resout);
                if(resout.data.status == 200){
                    if(type == 'credit'){
                        that.nubMsg.credit = resout.data.msg;
                    }else{
                        that.nubMsg.rmb = resout.data.msg;
                    }
                    that.cfSetting = that.cfSettingRest;
                }
            })
        },
        //设置用户的权限
        saveLv:function(){
            var that = this;
            axios.post(zrz_script.ajax_url+'zrz_setting_save_lv','user_id='+zrz_user.author_data.user_id+'&lv='+this.LvSelected).then(function(resout){
                if(resout.data.status == 200){
                    that.LvMsg = '修改成功';
                }else{
                    that.LvMsg = resout.data.msg;
                }
            })
        },
        saveDisabled:function(){
            var that = this;
            axios.post(zrz_script.ajax_url+'zrz_setting_save_disabled','user_id='+zrz_user.author_data.user_id+'&disabled='+this.disabledUser+'&days='+this.disabledDay).then(function(resout){
                console.log(resout);
                if(resout.data.status == 200){
                    that.disabledMsg = '修改成功';
                }else{
                    that.disabledMsg = resout.data.msg;
                }
            })
        },
        //发送验证码
        sendCode:function(type){
            if((!this.userData.phone && type == 'phone') || (!this.userData.mail && type == 'mail')) return;
            if(this.sendCodeLocked[type] == true) return;
            this.sendCodeLocked[type] = true;
            var ep = this.userData.phone,
                that = this;
            if(type == 'mail'){
                ep = this.userData.mail;
            }
            axios.post(zrz_script.ajax_url+'zrz_send_code','ep='+ep+'&security='+this.security+'&type=re'+'&checkType='+type).then(function(resout){
                if(resout.data.status == 200){
                    that.nubAc(type);
                    if(type == 'mail'){
                        that.sendText.mail = '重新发送';
                    }else{
                        that.sendText.phone = '重新发送';
                    }

                }else{
                    that.sendCodeLocked[type] = false;
                    if(type == 'mail'){
                        that.sendText.mail = resout.data.msg+'，请重试';
                    }else{
                        that.sendText.phone = resout.data.msg+'，请重试';
                    }
                }
            });
        },
        nubAc:function(type){
            var that = this;
            setTimeout(function () {
                that.nub --;
                if(that.nub == 0){
                    that.sendCodeLocked[type] = false;
                    if(type == 'mail'){
                        that.sendText.mail = '重新发送';
                    }else{
                        that.sendText.phone = '重新发送';
                    }
                }else{
                    that.nubAc(type);
                }
            }, 1000);
        },
        closeForm:function(){
            this.showBox = false;
        },
        deleteAddress:function(key){
            var r=confirm('确认要删除这个地址吗？');
            if (r==false)return;
            this.$delete(this.userData.address,key);
            this.save('address');
        },
        addAddress:function(){
            if(!this.add.address || !this.add.phone || !this.add.name){
                this.addError = '请输入完整的信息';
                return;
            }
            this.addError = '';
            var arr = JSON.parse(JSON.stringify(this.add))
            this.$set(this.userData.address,uuid(8, 16),arr);
            this.add = {
                'address':'',
                'phone':'',
                'name':''
            };
            this.save('address');
        },
        setDefault:function(key){
            var that = this;
            axios.post(zrz_script.ajax_url+'zrz_set_default_address','key='+key).then(function(resout){
                if(resout.data.status == 200){
                    that.defaultAddress = key;
                }
            })
        }
    },
    components:{
        'msg-box':dmsg
    }
})

var userOrder = new Vue({
    el:'#user-order',
    data:{
        list:[],
        paged:1,
        moreIndex:'cc',
        orderType:'',
        orderState:'',
        locked:false,
        count:{
            total:0,
            g:0,
            c:0,
            w:0,
            cz:0,
            d:0,
            ds:0
        },
        ac:0,
        msg:'',
        pages:0,
        firstPage:true,
    },
    mounted:function(){
        if(!this.$refs.userOrders) return;
        var that = this;
        this.getList(1);

        document.onclick = function(event){
            that.moreIndex = 'cc'
        }

    },
    methods:{
        getList:function(paged){
            if(this.locked == true) return;
            this.locked = true;

            var data = {
                'paged':paged,
                'user_id':zrz_user.author_data.user_id,
                'filter':{
                    'order_type':this.orderType,
                    'order_state':this.orderState
                }
            };
            var that = this;

            axios.post(zrz_script.ajax_url+'zrz_get_user_orders',Qs.stringify(data))
            .then(function(resout){

                if(resout.data.status == 200){
                    that.list = resout.data.msg;

                    if(that.firstPage){
                        that.count = resout.data.count;
                        that.firstPage = false;
                    }
                    that.pages = resout.data.postCount;
                    that.paged = paged;
                    // if(paged != 1){
                    //     that.$scrollTo(that.$refs.userOrders, 200, {offset: -60});
                    // }
                }else{
                    that.list = [];
                }
                that.ac = true;
                that.locked = false;
                that.$refs.userOrders.style="min-height:auto";
            })
        },
        showMore:function(index){
            this.moreIndex = this.moreIndex == 'cc' ? index : 'cc';
        },
        forderType:function(type){
            this.orderType = type
        },
        deleteOrder:function(index,orderid){
            var r=confirm('确定要删除这个订单吗？');
            if (r==false)return;
            this.$refs['order-item'][index].className += ' hide-ani';
            var that = this;
            axios.post(zrz_script.ajax_url+'zrz_delete_user_orders','order_id='+orderid)
            .then(function(resout){
                if(resout.data.status == 200){
                    that.list.splice(index, 1);
                    that.$refs['order-item'][index].className = that.$refs['order-item'][index].className.replace(' hide-ani','');
                    that.moreIndex = 'cc';
                }
            })
        }
    },
    watch:{
        orderType:function(){
            this.getList(1);
        },
        orderState:function(){
            this.getList(1);
        }
    },
    components:{
        "page-nav":pageNav
    }
})

var activities = new Vue({
    el:'#user-activities',
    data:{
        timeagoInstance:new timeago(),
        paged:1,
        locked:false,
        uName:zrz_user.u_name,
    },
    mounted:function(){
        this.timeAgo();
    },
    methods:{
        timeAgo:function(){
            this.timeagoInstance.render(this.$el.querySelectorAll('.timeago'), 'zh_CN');
        },
        getList:function(paged){
            if(this.locked == true) return;
            this.locked = true;
            var that = this;
            axios.post(zrz_script.ajax_url+'zrz_get_user_activities_fn','user_id='+zrz_user.author_data.user_id+'&paged='+paged).then(function(resout){
                if(resout.data.status == 200){
                    if(zrz_script.ajax_post == 1){
                        that.$refs.activitiesList.insertAdjacentHTML('beforeend', resout.data.msg);
                    }else{
                        that.$refs.activitiesList.innerHTML = resout.data.msg;
                        that.$scrollTo(that.$refs.activitiesList, 400, {offset: -60});
                    }

                    that.paged = paged;
                    that.timeAgo();
                }
                that.locked = false;
            })
        }
    },
    components:{
        "page-nav":pageNav
    }
})

var userPosts = new Vue({
    el:'#user-posts',
    data:{
        timeagoInstance:new timeago(),
        paged:1,
        userId:'user-posts-'+zrz_user.author_data.user_id,
        uName:zrz_user.u_name
    },
    mounted:function(){
        this.timeAgo();
        this.delePost();
        this.setHD();
        axios.post(zrz_script.ajax_url+'zrz_author_page_views','uid='+zrz_user.author_data.user_id);
    },
    methods:{
        timeAgo:function(){
            this.timeagoInstance.render(this.$el.querySelectorAll('.timeago'), 'zh_CN');
        },
        delePost:function(){
            var button = this.$el.querySelectorAll('.delete-post'),
                that = this;
            for (var i = 0; i < button.length; i++) {
                button[i].onclick = function(){
                    var r = confirm('确认删除这篇文章吗？');
                    if (r == false) return;
                    var id = this.getAttribute('data-id');
                    axios.post(zrz_script.ajax_url+'zrz_del_post','pid='+id).then(function(resout){
                        if(resout.data.status == 200){
                            that.$el.querySelector('#post'+id).remove();
                        }
                    })
                }
            }
        },
        //设置幻灯
        setHD:function(){
            var button = this.$el.querySelectorAll('.set-hd');
            for (var i = 0; i < button.length; i++) {
                button[i].onclick = function(){
                    var id = this.getAttribute('data-id'),
                        _this = this;
                    axios.post(zrz_script.ajax_url+'zrz_set_post_swipe','pid='+id).then(function(resout){
                        if(resout.data.msg == 'del'){
                            _this.innerText = '设为幻灯';
                        }else{
                            _this.innerText = '取消幻灯';
                        }
                    })
                }
            }
        }
    },
    components:{
        "page-nav":pageNav
    }
})

//用户帖子
var userPageTopic = new Vue({
    el:'#user-topic',
    data:{
        paged:1,
        userId:zrz_user.author_data.user_id,
        uName:zrz_user.u_name
    },
    methods:{
        getList:function(paged,type){
            var data = {
                'user_id':this.userId,
                'paged':paged,
                'type':type
            },
            that = this;
            axios.post(zrz_script.ajax_url+'zrz_get_topic_or_reply',Qs.stringify(data)).then(function(resout){
                if(resout.data.status == 200) {
                    if(zrz_script.ajax_post == 1){
                        that.$refs.listTopic.insertAdjacentHTML('beforeend', resout.data.msg);
                    }else{
                        that.$refs.listTopic.innerHTML = resout.data.msg;
                        that.$scrollTo(that.$refs.listTopic, 400, {offset: -60});
                    }
                    that.paged = paged;
                }
            })
        }
    },
    components:{
        "page-nav":pageNav
    }
})

//关注，粉丝，收藏
var followFans = new Vue({
    el:'#user-follow',
    data:{
        paged:1,
        type:'',
        list:[],
        pages:0,
        ac:false,
        msg:'加载中...',
        self:zrz_user._self,
        timeagoInstance:new timeago(),
        uName:zrz_user.u_name
    },
    mounted:function(){
        if(!this.$refs.listFollow) return;
        this.type = this.$refs.listFollow.getAttribute('data-type');
        this.getList(this.paged);
    },
    methods:{
        timeago:function(){
            var that = this;
            setTimeout(function () {
                that.timeagoInstance.render(that.$el.querySelectorAll('.timeago'), 'zh_CN');
            }, 10);
        },
        getList:function(paged){
            var data = {
                'paged':paged,
                'user_id':zrz_user.author_data.user_id,
                'type':this.type
            },that = this,ac;
            if(this.type == 'zrz_followed' || this.type == 'zrz_follow'){
                ac = 'zrz_get_user_follow';
            }else{
                ac = 'zrz_get_user_collection';
            }
            axios.post(zrz_script.ajax_url+ac,Qs.stringify(data)).then(function(resout){
                console.log(resout);
                if(resout.data.status == 200){
                    that.pages = resout.data.pages;
                    that.list = resout.data.data;
                    that.paged = paged;
                    that.timeago();
                }
                that.ac = true;
            })
        },
        cancel:function(id){
            var that = this;
            axios.post(zrz_script.ajax_url+'zrz_follow','user_id='+id).then(function(resout){
                if(resout.data.status == 200){
                    if(resout.data.msg == 'add'){
                        for (var i = 0; i < that.list.length; i++) {
                            if(that.list[i].id == id){
                                that.list[i].follow = 1
                            }
                        }
                    }else{
                        for (var i = 0; i < that.list.length; i++) {
                            if(that.list[i].id == id){
                                that.list[i].follow = 0
                            }
                        }
                    }
                }
            })
        }
    },
    components:{
        "page-nav":pageNav
    }
})

var zrzTa = new Vue({
    el:'.user-sidebar-bottom',
    data:{
        uName:''
    },
    mounted:function(){
        if(typeof zrz_user != 'undefined'){
            this.uName = zrz_user.u_name;
        }
    }
})