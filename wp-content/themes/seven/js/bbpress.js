var bbpress = new Vue({
    el:'#bbpress-forums',
    data:{
        toolbarOptions:[
            ['bold', 'italic', { 'header': 2 }],
            ['blockquote', 'code-block'],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            ['link','imagei','videoi'],
            [{ 'align': [] },'divider'],
            ['clean'],
            ['undo','redo'],
        ],
        editor:'',
        timeagoInstance:new timeago(),
        title:'',
        uploadLocked:false,
        nonce:'',
        //插入视频
        showMediaForm:'',
        videoUrl:'',
        locked:'',
        videoError:'',
        error:'',
        //加入收藏
        favoritesText:'加入收藏',
        favorited:{
            'loved':0,
            'count':0
        },
        //浏览量计数
        countUpOption:{
            useEasing: true,
            useGrouping: false,
            separator: '',
            decimal: '',
        },
        isMobile:zrz_script.is_mobile,
        //图片上传
        insertUri:'',
        imageBoxType:'upload'
    },
    mounted:function(){
        if(this.isMobile){
            this.toolbarOptions = [
                ['bold',  { 'header': 2 }],
                ['blockquote', 'code-block'],
                ['link','imagei'],
                ['undo','redo'],
            ]
        }
        var editorDom = document.querySelector('#bbs-forum');
        if(editorDom){
            var icon = Quill.import('ui/icons'),
                that = this;
            icon['divider'] = '<i class="iconfont zrz-icon-font-divider"></i>';
            icon['imagei'] = icon['image'];
            icon['videoi'] = icon['video'];
            icon['redo'] = '<i class="iconfont zrz-icon-font-zhongzuo"></i>';
            icon['undo'] = '<i class="iconfont zrz-icon-font-chexiao"></i>';

            var bindings = {
                exitBlockWithEnter: {
                    key: 'enter',
                    format: ['blockquote', 'list'],
                    collapsed: true,
                    empty: true,
                    handler: function(range, context) {
                        that.editor.formatText(range.index, range.length + 1, {blockquote: null, list: null});
                        return false;
                    }
                }
            }

            var BlockEmbed = Quill.import('blots/block/embed');

            //图片
            var ImageBlot = function (_BlockEmbed) {
                _inherits(ImageBlot, _BlockEmbed);

                function ImageBlot() {
                    _classCallCheck(this, ImageBlot);

                    return _possibleConstructorReturn(this, (ImageBlot.__proto__ || Object.getPrototypeOf(ImageBlot)).apply(this, arguments));
                }

                _createClass(ImageBlot, null, [{
                    key: 'create',
                    value: function create(value) {
                        var node = _get(ImageBlot.__proto__ || Object.getPrototypeOf(ImageBlot), 'create', this).call(this);
                        node.setAttribute('src', value.url);
                        node.id = value.id;
                        return node;
                    }
                }, {
                    key: 'value',
                    value: function value(node) {
                        return {
                            alt: node.getAttribute('alt') ? node.getAttribute('alt') : '',
                            url: node.getAttribute('src'),
                            id: node.id
                        };
                    }
                }]);

                return ImageBlot;
            }(BlockEmbed);

            ImageBlot.blotName = 'imagei';
            ImageBlot.tagName = 'img';
            ImageBlot.className = 'bbp-img';

            var Embed = Quill.import('blots/embed');

            var atReplyBlot = function (_Embed) {
                _inherits(atReplyBlot, _Embed);

                function atReplyBlot() {
                    _classCallCheck(this, atReplyBlot);

                    return _possibleConstructorReturn(this, (atReplyBlot.__proto__ || Object.getPrototypeOf(atReplyBlot)).apply(this, arguments));
                }

                _createClass(atReplyBlot, null, [{
                    key: 'create',
                    value: function create(value) {
                        var node = _get(atReplyBlot.__proto__ || Object.getPrototypeOf(atReplyBlot), 'create', this).call(this);
                        node.setAttribute('href', value.url);
                        node.innerHTML = '<i class="iconfont zrz-icon-font-at"></i>' + value.name;
                        return node;
                    }
                }, {
                    key: 'value',
                    value: function value(node) {
                        return {
                            name: node.innerText,
                            url: node.getAttribute('href')
                        };
                    }
                }]);

                return atReplyBlot;
            }(Embed);

            atReplyBlot.blotName = 'atReply';
            atReplyBlot.tagName = 'a';
            atReplyBlot.className = 't-reply';

            //分割线

            var DividerBlot = function (_BlockEmbed2) {
                _inherits(DividerBlot, _BlockEmbed2);

                function DividerBlot() {
                    _classCallCheck(this, DividerBlot);

                    return _possibleConstructorReturn(this, (DividerBlot.__proto__ || Object.getPrototypeOf(DividerBlot)).apply(this, arguments));
                }

                return DividerBlot;
            }(BlockEmbed);

            DividerBlot.blotName = 'divider';
            DividerBlot.tagName = 'hr';

            //视频
            var VideoBlot = function (_BlockEmbed3) {
              _inherits(VideoBlot, _BlockEmbed3);

              function VideoBlot() {
                _classCallCheck(this, VideoBlot);

                return _possibleConstructorReturn(this, (VideoBlot.__proto__ || Object.getPrototypeOf(VideoBlot)).apply(this, arguments));
              }

              _createClass(VideoBlot, null, [{
                key: 'create',
                value: function create(value) {
                  var node = _get(VideoBlot.__proto__ || Object.getPrototypeOf(VideoBlot), 'create', this).call(this);
                  node.className += ' content-video content-box img-bg';
                  node.setAttribute('contenteditable', 'false');
                  if (value.url) {
                    node.setAttribute('data-video-url', value.url);
                    node.setAttribute('id', value.id);
                  }
                  if(value.thumb){
                      node.setAttribute('data-video-thumb', value.thumb);
                  }
                  if(value.title){
                      node.setAttribute('data-video-title', value.title);
                  }
                  return node;
                }
              }, {
                key: 'value',
                value: function value(node) {
                  return {
                     title:node.getAttribute('data-video-title'),
                    thumb:node.getAttribute('data-video-thumb'),
                    url: node.getAttribute('data-video-url'),
                    id: node.getAttribute('id')
                  };
                }
              }]);

              return VideoBlot;
            }(BlockEmbed);

            VideoBlot.blotName = 'videoUrl';
            VideoBlot.tagName = 'div';
            VideoBlot.className = 'content-video-box';

            Quill.register(VideoBlot);
            Quill.register(DividerBlot);
            Quill.register(ImageBlot);
            Quill.register(atReplyBlot);

            var Clipboard = Quill.import('modules/clipboard'),
                Delta = Quill.import('delta');
            var PlainTextClipboard = function (_Clipboard) {
              _inherits(PlainTextClipboard, _Clipboard);

              function PlainTextClipboard() {
                _classCallCheck(this, PlainTextClipboard);

                return _possibleConstructorReturn(this, (PlainTextClipboard.__proto__ || Object.getPrototypeOf(PlainTextClipboard)).apply(this, arguments));
              }

              _createClass(PlainTextClipboard, [{
                key: 'onPaste',
                value: function onPaste(e) {
                  if (e.defaultPrevented || !this.quill.isEnabled()) return;
                  var range = this.quill.getSelection();
                  var delta = new Delta().retain(range.index);

                  if (e && e.clipboardData && e.clipboardData.types && e.clipboardData.getData) {
                    var text = (e.originalEvent || e).clipboardData.getData('text/html');
                    if(!text){
                        return true;
                    }
                    var cleanedText = this.convert(text);

                    e.stopPropagation();
                    e.preventDefault();

                    delta = delta.concat(cleanedText).delete(range.length);
                    this.quill.updateContents(delta, Quill.sources.USER);

                    this.quill.setSelection(delta.length() - range.length, Quill.sources.SILENT);
                    return false;
                  }
                }
              }]);

              return PlainTextClipboard;
            }(Clipboard);

            Quill.register('modules/clipboard', PlainTextClipboard);

            this.editor = new Quill(editorDom,{
                modules: {
                    syntax: zrz_script.highlight == 1 ? true : false,
                  toolbar:{
                      container: this.toolbarOptions,
                      handlers: {
                        'imagei': this.imageHandler,
                        'divider':this.dividerHandler,
                        'videoi':this.videoHandler,
                        'undo':this.undo,
                        'redo': this.redo
                    }
                  },
                  keyboard: { bindings: bindings }
                },
                placeholder: '从这里开始...',
                //readOnly: false,
                theme: 'snow',
                scrollingContainer:document.documentElement,
            });

            document.getElementById('bbs-toolbar').appendChild(document.querySelectorAll('.ql-toolbar')[0]);
        }

        if(this.$refs.title){
            this.title = this.$refs.title.innerText;
        }
        if(this.$refs.nonce){
            this.nonce = this.$refs.nonce.value;
        }
        var that = this;
        axios.post(zrz_script.ajax_url+'zrz_view','pid='+zrz_bbpress.topic_id).then(function(resout){
            if(resout.data.status == 200){
                var view = new CountUp(that.$refs.postViews, 0, resout.data.views, 0, 2.5,that.countUpOption);
                if (!view.error) {
                  view.start();
                }
                that.favorited.loved = resout.data.favorites.loved;
                that.favorited.count = resout.data.favorites.count;
                if(that.favorited.loved == 1){
                    that.favoritesText = '已收藏';
                }else{
                    that.favoritesText = '加入收藏';
                }
            }
        })

        this.bbpAc();
        if(zrz_script.highlight == 1){
            var pre = this.$el.querySelectorAll('pre');
            if(pre.length > 0){
                for (var i = 0; i < pre.length; i++) {
                    hljs.highlightBlock(pre[i]);
                }
            }
        }
    },
    methods:{
        bbpLogin:function(e){
            signForm.showBox = true;
            if(e === 'up'){
                signForm.signup = true;
                signForm.signin = false;
            }else{
                signForm.signin = true;
                signForm.signup = false;
            }
        },
        insetImageUri:function(){
            if(!this.insertUri) return;
            var that = this,
            //编辑器插入临时图像
            range = that.editor.getSelection(true);

            that.editor.insertText(range.index, '\n', Quill.sources.USER);
            that.editor.insertEmbed(range.index, 'imagei', {
                alt: that.title,
                url: that.insertUri,
                id:0
            }, Quill.sources.USER);
            that.editor.setSelection(range.index + 1, Quill.sources.SILENT);

            Vue.nextTick(function(){
                that.showMediaForm = '';
                that.insertUri = '';
            })
        },
        //图片上传事件
        imageHandler:function(){
            this.showMediaForm = 'image';
        },
        imageUpload:function(){
            this.showMediaForm = '';
            this.insertUri = '';
            this.$refs.getFile.click();
        },
        bbpAc:function(){
            //timeago
            this.timeago();
            //视频点击播放
            var videoBox = this.$el.querySelectorAll('.content-video-box');
            for (var i = 0; i < videoBox.length; i++) {
                videoBox[i].onclick = function(){
                    var url = this.getAttribute('data-video-url');
                    var that = this;
                    axios.post(zrz_script.ajax_url+'zrz_video_upload','url='+url+'&type=url&single=true').then(function(resout){
                        if(resout.data.status == 200){
                            that.innerHTML = resout.data.msg;
                            that.setAttribute('data-video-url','');
                            that.className += ' hide-data';
                        }

                    })
                }
            }
            this.editorContent();
            this.reply();
            videoBackground();
        },
        //编辑模式
        editorContent:function(){
            var content = this.$el.querySelector('#bbp_topic_content') || this.$el.querySelector('#bbp_reply_content');
            if(content && content.value != ''){
                this.editor.clipboard.dangerouslyPasteHTML(0, content.value);
            }
        },
        imgUpload:function(event){
            if(!event.target.files || this.uploadLocked == true) return;
            this.uploadLocked = true;
            var file = event.target.files[0];
            if(!file.type.match("image.*")) {
                return;
            }

            var id = uuid(8, 16),
                that = this;

            imgcrop(file,zrz_script.media_setting.max_width,'',function(resout){
                if(resout[0] === true){
                    //编辑器插入临时图像
                    var range = that.editor.getSelection(true);
                    that.editor.insertText(range.index, '\n', Quill.sources.USER);
                    that.editor.insertEmbed(range.index, 'imagei', {
                        url: zrz_script.theme_url+'/images/load-img.gif',
                        id:id
                    }, Quill.sources.USER);
                    that.editor.setSelection(range.index + 1, Quill.sources.SILENT);

                    //上传
                    var formData = new FormData();
                    if(file.type.indexOf('gif') > -1){
                        fileData = file;
                    }else{
                        fileData = resout[2];
                    }

                    formData.append("type", 'small');

                    formData.append('file',fileData,file.name);
                    formData.append("security", that.nonce);
                    formData.append("user_id", zrz_script.current_user);

                    axios.post(zrz_script.ajax_url+'zrz_media_upload',formData).then(function(resout){
                        var dom = document.getElementById(id);
                        //上传成功，替换网址
                        if(resout.data.status === 200){
                            dom.src = resout.data.Turl;
                            dom.parentNode.id = resout.data.imgdata;
                        }else{
                            //上传失败删除临时dom
                            dom.remove();
                        }
                        that.$refs.getFile.value = '';
                        that.uploadLocked = false;
                    })
                }
            })
        },
        timeago:function(){
            this.timeagoInstance.render(this.$el.querySelectorAll('.timeago'), 'zh_CN');
        },
        dividerHandler:function(){
            var range = this.editor.getSelection(true);
            this.editor.insertText(range.index, '\n', Quill.sources.USER);
            this.editor.insertEmbed(range.index + 1, 'divider', true, Quill.sources.USER);
            this.editor.setSelection(range.index + 2, Quill.sources.SILENT);
        },
        videoHandler:function(){
            this.showMediaForm = 'video';
        },
        undo:function(){
            this.editor.history.undo();
        },
        redo:function(){
            this.editor.history.redo();
        },
        reply:function(url,name){
            var that = this,
                replyButton = this.$el.querySelectorAll('.reply-link');
            for (var i = 0; i < replyButton.length; i++) {
                replyButton[i].onclick = function(){
                    var name = this.getAttribute('data-name'),
                        url = this.getAttribute('data-url');
                    var cursorPosition = that.editor.getSelection(true).index,
                        realPosition = cursorPosition + name.length;
                    that.editor.insertEmbed(cursorPosition, 'atReply', {
                            name:name+' ',
                            url:url
                        }, Quill.sources.USER);
                    that.editor.setSelection(realPosition + name.length - 1,  Quill.sources.SILENT);
                    var forum = that.$el.querySelector('#bbs-forum');
                    if(!isElementInViewport(forum)){
                        that.$scrollTo(forum, 400, {offset: -60});
                    }
                }
            }
        },
        //关闭视频窗口
        closeViedoForm:function(){
            this.showMediaForm = '';
        },
        getVideo:function(){
            if(this.locked == true) return;
            this.locked = true;
            if(!this.videoUrl) this.videoError = '请输入网址';
            var data = {
                'url':this.videoUrl,
                'type':'url',
                'security':this.nonce
            },
            that = this;
            axios.post(zrz_script.ajax_url+'zrz_video_upload',Qs.stringify(data)).then(function(resout){
                if(resout.data.status == 200){
                    if(resout.data.msg.indexOf('smartideo') != -1){
                        var range = that.editor.getSelection(true);
                        var thumb = '',
                            title = '';
                        if(resout.data.img){
                            thumb = resout.data.img.url.url;
                            title = resout.data.img.title;
                        }
                        that.editor.insertText(range.index, '\n', Quill.sources.USER);
                        that.editor.insertEmbed(range.index, 'videoUrl', {
                            title:title,
                            thumb:thumb,
                            url: that.$refs.videoUrl.value,
                            id:uuid(8, 16)
                        }, Quill.sources.USER);
                        that.editor.setSelection(range.index + 1, Quill.sources.SILENT);

                        that.showMediaForm = '';
                        that.videoUrl = '';
                        that.locked = false;
                    }else{
                        that.videoError = '不支持此视频，请重试';
                        that.locked = false;
                    }
                }else{
                    that.videoError = resout.data.msg+'，请重试';
                    that.locked = false;
                }
                setTimeout(function () {
                    videoBackground();
                }, 300);
            })
        },
        sendData:function(event){
            var exc = this.$el.querySelector('#bbp_reply_content') || this.$el.querySelector('#bbp_topic_content');
                exc.value = this.editor.root.innerHTML;

            if(this.editor.root.innerText.length < 10){
                event.preventDefault();
                event.stopPropagation();
                this.error = '内容文字太少了';
            }

            if((this.uploadLocked == true || this.locked == true) || (this.$refs.title && this.$refs.title.value == '')){
                event.preventDefault();
                event.stopPropagation();
                this.error = '请输入标题';
            }
        },
        listAc:function(type,locked){
            if(type == 'topic'){
                if(zrz_script.ajax_post != 1 || locked == 1){
                    this.$scrollTo('.forum-top', 400, {offset: -60});
                }
            }else{
                if(zrz_script.ajax_post != 1 || locked == 1){
                    this.$scrollTo('#reply-list', 400, {offset: -60});
                }
            }
            this.bbpAc();
        },
        //帖子收藏
        favorites:function(topic_id){
            if(zrz_script.is_login == 0){
                signForm.showBox = true;
                signForm.signup = false;
                signForm.signin = true
            }

            var that = this;
            axios.post(zrz_script.ajax_url+'zrz_post_favorites','pid='+topic_id+'&type=topic').then(function(resout){
                if(resout.data.status == 200){
                    if(resout.data.loved == 1){
                        that.favorited.loved = 1;
                        that.favorited.count++;
                        that.favoritesText = '已收藏';
                    }else{
                        that.favorited.loved = 0;
                        that.favorited.count--;
                        that.favoritesText = '加入收藏';
                    }
                }
            })
        },
    },

    components:{
        "page-nav":pageNav
    }
})
