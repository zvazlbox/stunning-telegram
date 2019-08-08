var labs = new Vue({
    el:'#labs',
    data:{
        picked:'isaid',
        pickedText:'我说',
        showAutoSave:false,
        labRequired:{
            'title':'',
            'img':'',
            'content':'',
            'attid':''
        },
        imageLocked:false,
        imageError:false,
        uploadText:'添加封面图片',
        guessKey:'',
        resoutKey:'',
        voteIndex:'',
        postId:'',
        guessItems:[
            {
                'q':'',
                'l':{
                        'a':{
                            'i':'',
                            't':''
                        },
                        'b':{
                            'i':'',
                            't':''
                        },
                        'c':{
                            'i':'',
                            't':''
                        },
                        'd':{
                            'i':'',
                            't':''
                        }
                    },
                'a':''
            }
        ],
        guessResouts:{
            '33':{
                'i':'',
                't':''
            },
            '66':{
                'i':'',
                't':''
            },
            '99':{
                'i':'',
                't':''
            }
        },
        voteList:[
            {
                'i':'',
                't':'',
                'p':0,
                'c':0
            }
        ],
        draft:JSON.parse(localStorage.getItem('zrz_labs_'+zrz_script.site_info.site_mark)),
        draftDate:'',
        defaultData:'',
        showHeadDraft:false,
        timeagoInstance:new timeago(),
        labError:'',
        //编辑研究
        edit:false,
        path:'',
        locked:false,
        submitMsg:'立刻发布',
    },
    mounted:function(){
        if(!this.$refs.loading) return;
        //保存临时的初始值
        this.defaultData = {
            'picked':this.picked,
            'labRequired':this.labRequired,
            'guessItems':this.guessItems,
            'guessResouts':this.guessResouts,
            'voteList':this.voteList
        }

        //输入框自动长高
        this.autoHeight();
        if(this.labRequired.img){
            this.uploadText = '更换封面图片';
        }
        //检查是否有草稿
        if(typeof labs_data != "undefined"){
            this.showAutoSave = false;
            this.getEditData();
            this.edit = true;
            this.postId = labs_data.post_id;
        }else if(this.draft){
            this.showAutoSave = true;
            this.getAutoSave();
        }
        this.$refs.loading.className += 'hide';

        //跟随滚动
        new Sticky('#box-header-labs');
    },
    methods:{
        imgUpload:function(event,type,index,keyi){
            if(this.imageLocked === true) return;
            this.imageLocked = true;
            var file = event.target.files[0];
            if(!file) return;
            this.guessKey = keyi;
            this.resoutKey = keyi;
            this.voteIndex = index;
            this.uploadText = '上传中...';
            if(file.type.indexOf('image') > -1){
                var that = this,width;
                width = 1400;
                
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
                            formData.append("type",type);
                            formData.append("user_id", zrz_script.current_user);
                            formData.append("file", fileData,key);

                            //开始上传
                            axios.post(zrz_script.ajax_url+'zrz_media_upload',formData)
                            .then(function(resout){
                                console.log(resout);
                                var img = resout.data.Turl;
                                // if(typeof labs_data != "undefined"){
                                //     img = img.replace(that.path,'');
                                // }
                                if(resout.data.status == 200){
                                    imgload(resout.data.url,function(){
                                        if(type === 'labsThumbnail'){
                                            that.labRequired.img = img;
                                            that.labRequired.attid = resout.data.imgdata;
                                            that.uploadText = '更换封面图片';
                                        }else if(type === 'guess'){
                                            that.guessItems[index].l[keyi].i = img;
                                            this.guessKey = '';
                                        }else if(type === 'guessResouts'){
                                            that.guessResouts[keyi].i = img;
                                        }else if(type === 'vote'){
                                            that.voteList[index].i = img;
                                        }
                                        that.imageLocked = false;
                                        that.autoSave();
                                    })
                                }else{
                                    if(type === 'labsThumbnail'){
                                        that.imageError = true;
                                        that.uploadText = '请先登录';
                                    }
                                    that.imageLocked = false;
                                }
                            })
                    }else{
                        if(type === 'labsThumbnail'){
                            that.imageError = true;
                            that.uploadText = '图片压缩失败，请重试';
                        }
                        that.imageLocked = false;
                    }
                })
            }else{
                if(type === 'labsThumbnail'){
                    this.imageError = true;
                    this.uploadText = '您选择的不是图片文件，请重试';
                }
                this.imageLocked = false;
            }
            //清空 input 的值
            event.target.value = '';
        },
        autoHeight:function(){
            setTimeout(function () {
                autosize(document.querySelectorAll('textarea'));
            }, 10);
        },
        addMoreGuess:function(){
            var data = {
                'q':'',
                'l':{
                        'a':{
                            'i':'',
                            't':''
                        },
                        'b':{
                            'i':'',
                            't':''
                        },
                        'c':{
                            'i':'',
                            't':''
                        },
                        'd':{
                            'i':'',
                            't':''
                        }
                    },
                'a':'',
            };
            this.guessItems.push(data);
            this.autoHeight();
        },
        deleteGuessItem:function(index){
            var r=confirm('确认删除此条？');
            if (r==false)return;
            this.$refs['guess-item'][index].className += ' hide-ani';
            var that = this;
            setTimeout(function () {
                that.guessItems.splice(index, 1);
                that.$refs['guess-item'][index].className = that.$refs['guess-item'][index].className.replace(' hide-ani','');
                that.autoSave();
            }, 220);
        },
        //添加投票条目
        addVote:function(){
            var data = {
                'i':'',
                't':'',
                'p':0,
                'c':0
            };
            this.voteList.push(data);
            this.autoHeight();
        },
        //删除投票条目
        deleteVoteItem:function(index){
            var r=confirm('确认删除此条？');
            if (r==false)return;
            this.$refs['vote-item'][index].className += ' hide-ani';
            var that = this;
            setTimeout(function () {
                that.voteList.splice(index, 1);
                that.$refs['vote-item'][index].className = that.$refs['vote-item'][index].className.replace(' hide-ani','');
                that.autoSave();
            }, 220);
        },
        //草稿保存到本地
        autoSave:function(event){
            if(typeof labs_data != "undefined") return;
            if (!window.sessionStorage) return;
            if(event && event.target.value.length == 0) return;
            var data = {
                'picked':this.picked,
                'labRequired':this.labRequired,
                'guessItems':this.guessItems,
                'guessResouts':this.guessResouts,
                'voteList':this.voteList,
                'date':this.getDate()
            }
            this.draftDate = data.date;
            localStorage.setItem('zrz_labs_'+zrz_script.site_info.site_mark, JSON.stringify(data));
            this.timeAgo();
            this.showHeadDraft = true;
        },
        getAutoSave:function(){
            if (!window.sessionStorage) return;
            this.picked = this.draft.picked;
            this.labRequired = this.draft.labRequired;
            this.guessItems = this.draft.guessItems;
            this.guessResouts = this.draft.guessResouts;
            this.voteList = this.draft.voteList;
            this.draftDate = this.draft.date;
            this.timeAgo();
        },
        getEditData:function(){
            this.picked = labs_data.type;
            this.labRequired = {
                'title':labs_data.title,
                'img':labs_data.img,
                'content':labs_data.content,
                'attid':labs_data.attid
            };
            this.path = labs_data.path;
            if(labs_data.type == 'youguess'){
                this.guessItems = labs_data.youguess;
                this.guessResouts = labs_data.guessResouts
            }
            if(labs_data.type == 'vote'){
                this.voteList = labs_data.vote;
            }
        },
        deleteAutoSave:function(type){
            if(!type){
                var r=confirm('删除草稿之后将不可恢复，确定要删除吗？');
                if (r==false)return;
            }
            localStorage.removeItem('zrz_labs_'+zrz_script.site_info.site_mark);
            this.picked = this.defaultData.picked;
            this.labRequired = this.defaultData.labRequired;
            this.guessItems = this.defaultData.guessItems;
            this.guessResouts = this.defaultData.guessResouts;
            this.voteList = this.defaultData.voteList;
            this.showAutoSave = false;
            this.timeAgo();
        },
        editData:function(){
            this.showAutoSave = false;
            this.timeAgo();
        },
        getDate:function(){
            var date = new Date(Date.parse( new Date())),
            Y = date.getFullYear() + '-';
            M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
            D = date.getDate() + ' ';
            h = date.getHours() + ':';
            m = date.getMinutes() + ':';
            s = date.getSeconds();
            return Y+M+D+h+m+s;
        },
        timeAgo:function(){
            var that = this;
            timeago.cancel();
            setTimeout(function () {
                that.timeagoInstance.render(that.$el.querySelectorAll('.timeago'), 'zh_CN');
            }, 10);
        },
        submit:function(){
            if(this.locked == true) return;
            this.locked = true;
            this.submitMsg = '发布中...';
            this.labError = '';
            var data = {
                'picked':this.picked,
                'labRequired':this.labRequired,
                'guessItems':this.guessItems,
                'guessResouts':this.guessResouts,
                'voteList':this.voteList,
                'post_id':this.postId,
                'security':this.$refs.nonce.value
            };
            var that = this;
            axios.post(zrz_script.ajax_url+'zrz_save_labs',Qs.stringify(data)).then(function(resout){
                if(resout.data.status === 401){
                    that.labError = resout.data;
                    that.submitMsg = '发布失败，请查看错误信息';
                }else{
                    that.submitMsg = '发布成功，跳转中...';
                    window.location.href = resout.data.url;
                    that.deleteAutoSave('add');
                };
                that.locked = false;
            })
        },
        closeError:function(){
            this.labError = '';
        }
    },
    watch:{
        picked:function(val){
            if(val === 'isaid'){
                this.pickedText = '我说';
            }else if(val === 'youguess'){
                this.pickedText = '你猜';
            }else if(val === 'vote'){
                this.pickedText = '投票';
            }else if(val === 'relay'){
                this.pickedText = '接力';
            }
            this.autoHeight();
        }
    }
})
