var write = new Vue({
    el:'#write',
    data:{
        toolbarOptions:[
            ['bold', 'italic', { 'header': 2 }],
            [{ 'color': [] }, { 'background': [] }],
            ['blockquote', 'code-block'],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            ['link','imagei','videoi'],
            [{ 'align': [] },'divider'],
            ['clean'],
            ['undo','redo'],
            ['post','files'],
            ['hideStart','hideEnd']
        ],
        editor:'',
        images:'',
        //加载中
        ac:0,
        msg:'',
        data:'',
        //分类
        cats:zrz_write.cats,
        cat:'',
        catArr:{},
        catLength:1,
        catMore:zrz_write.cat_more,
        //标题
        title:'',
        //图片上传
        setting:zrz_script.media_setting,
        imgUploadLocked:false,
        //特色图ID
        thumb:0,
        nonce:'',
        //标签
        tags:[],
        customTags:zrz_write.custom_tags,
        tagI:'',
        lengthw:false,
        dubb:false,
        tagsCount:zrz_write.tag_count,
        //文章形式
        postFormat:zrz_write.post_format,
        formatText:'默认',
        format:'none',
        showFormats:false,
        //相关文章
        relateChose:zrz_write.related_chose,
        relatedPost:[],
        realtedId:'',
        relatedLocked:false,
        relatedError:'',
        //图片高亮按钮
        toolbarHs:false,
        toolbarHb:false,
        //添加视频
        showMediaForm:false,
        insertVideoUrl:true,
        insertVideoFile:false,
        //插入视频
        insertVideoButton:false,
        videoError:'',
        dropenter:false,
        videoText:'选择视频文件<b class="gray"> 或 </b>拖拽到此处',
        videoSize:zrz_write.video_size,
        //阅读权限
        redCapabilities:'default',
        rmb:'',
        credit:'',
        lv:[],
        //摘要
        excerpt:'',
        showExcerpt:false,
        //折叠项
        showRealted:false,
        showTags:false,
        showCapabilities:false,
        //草稿
        draft:[],
        timeagoInstance:new timeago(),
        date:0,
        draftEdit:false,
        mediaType:'',
        //插入文章或者商品
        postIdOrUrl:'',
        getPostError:'',
        getPostLocked:false,
        //文章发布
        insertPostLocked:false,
        insertPostMsg:'',
        postType:'',
        subMsg:'立刻发布',
        //上传封面
        thumbLocked:false,
        thumbSrc:'',
        thumbUPlocked:false,
        thumbVideo:'',
        thumbVideoDom:'',
        //上传附件
        fileData:{
            'type':'url',
            'link':'',
            'name':'',
            'pass':'',
            'code':''
        },
        fileLocked:false,
        progress:'0%',
        uploadText:'<i class="iconfont zrz-icon-font-lnicon34"></i> 选择文件',
        uploadLocked:false,
        uploadError:'',
        //图片上传
        insertUri:'',
        imageBoxType:'upload',
        //附件数组
        filesArg:[],
    },
    mounted:function(){
        if(!this.$refs.editor) return;
        //自定义编辑器图标
        var icon = Quill.import('ui/icons'),
            that = this;
        icon['divider'] = '<i class="iconfont zrz-icon-font-divider"></i>';
        icon['imagei'] = icon['image'];
        icon['videoi'] = icon['video'];
        icon['redo'] = '<i class="iconfont zrz-icon-font-zhongzuo"></i>';
        icon['undo'] = '<i class="iconfont zrz-icon-font-chexiao"></i>';
        icon['post'] = '<i class="iconfont zrz-icon-font-wenzhang"></i>';
        icon['files'] = '<i class="iconfont zrz-icon-font-fujian1"></i>';
        icon['hideEnd'] = '结束隐藏';
        icon['hideStart'] = '开始隐藏';

        'use strict';

        var BlockEmbed = Quill.import('blots/block/embed');

        //分割线
        var DividerBlot = function (_BlockEmbed) {
          _inherits(DividerBlot, _BlockEmbed);

          function DividerBlot() {
            _classCallCheck(this, DividerBlot);

            return _possibleConstructorReturn(this, (DividerBlot.__proto__ || Object.getPrototypeOf(DividerBlot)).apply(this, arguments));
          }

          return DividerBlot;
        }(BlockEmbed);

        DividerBlot.blotName = 'divider';
        DividerBlot.tagName = 'hr';
        Quill.register(DividerBlot);

        //图片
        var ImageBloti = function (_BlockEmbed2) {
          _inherits(ImageBloti, _BlockEmbed2);

          function ImageBloti() {
            _classCallCheck(this, ImageBloti);

            return _possibleConstructorReturn(this, (ImageBloti.__proto__ || Object.getPrototypeOf(ImageBloti)).apply(this, arguments));
          }

          _createClass(ImageBloti, null, [{
            key: 'create',
            value: function create(value) {
              var node = _get(ImageBloti.__proto__ || Object.getPrototypeOf(ImageBloti), 'create', this).call(this);
              node.setAttribute('contenteditable', 'false');
              if (value.url) {
                node.className += ' ' + value.loading;
                node.id = value.imgId;
                var img = document.createElement('img');
                img.setAttribute('alt', value.alt);
                img.setAttribute('src', value.url);
                img.setAttribute('id', value.id);
                img.setAttribute('class', 'po-img-big');

                var input = document.createElement('input');
                input.setAttribute('placeholder', '添加图片注释（可选）');
                input.setAttribute('class', 'addDesn-input' + (value.des ? '' : ' hide'));
                input.value = value.des;

                var des = document.createElement('figcaption');
                des.className = 'addDesn';
                des.innerText = value.des;

                var i = document.createElement('span');
                i.setAttribute('class', 'remove-img-ico click');
                i.innerText = '删除';

                node.appendChild(i);

                node.appendChild(img);
                node.appendChild(input);
                node.appendChild(des);
              }
              return node;
            }
          }, {
            key: 'value',
            value: function value(node) {
              return node.querySelectorAll('img').length > 0 ? {
                alt: node.querySelectorAll('img')[0].getAttribute('alt'),
                url: node.querySelectorAll('img')[0].getAttribute('src'),
                id: node.querySelectorAll('img')[0].getAttribute('id'),
                des: node.querySelectorAll('.addDesn')[0] ? node.querySelectorAll('.addDesn')[0].innerText : '',
                imgId: node.getAttribute('id'),
                loading: ''
              } : '';
            }
          }]);

          return ImageBloti;
        }(BlockEmbed);

        ImageBloti.blotName = 'imagei';
        ImageBloti.tagName = 'figure';
        ImageBloti.className = 'content-img-box';
        Quill.register(ImageBloti);

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
              var i = document.createElement('span');
              i.setAttribute('class', 'remove-img-ico click');
              i.innerText = '删除';
              node.appendChild(i);
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

        //本地视频
        var VideoFileBlot = function (_BlockEmbed4) {
          _inherits(VideoFileBlot, _BlockEmbed4);

          function VideoFileBlot() {
            _classCallCheck(this, VideoFileBlot);

            return _possibleConstructorReturn(this, (VideoFileBlot.__proto__ || Object.getPrototypeOf(VideoFileBlot)).apply(this, arguments));
          }

          _createClass(VideoFileBlot, null, [{
            key: 'create',
            value: function create(value) {
              var node = _get(VideoFileBlot.__proto__ || Object.getPrototypeOf(VideoFileBlot), 'create', this).call(this);
              node.className += ' content-video content-box';
              node.setAttribute('contenteditable', 'false');
              if (value.src) {
                var video = document.createElement('video');
                video.src = value.src;
                video.autoPlay = false;
                video.setAttribute('controls', 'controls');

                var i = document.createElement('span');
                i.setAttribute('class', 'remove-img-ico click');
                i.innerText = '删除';
                node.appendChild(video);
                node.appendChild(i);
              }
              return node;
            }
          }, {
            key: 'value',
            value: function value(node) {
              return node.querySelectorAll('video').length > 0 ? {
                src: node.querySelectorAll('video')[0].getAttribute('src')
              } : '';
            }
          }]);

          return VideoFileBlot;
        }(BlockEmbed);

        VideoFileBlot.blotName = 'videoFile';
        VideoFileBlot.tagName = 'div';
        VideoFileBlot.className = 'content-video-file-box';
        Quill.register(VideoFileBlot);

        //本地音频
        var AudioFileBlot = function (_BlockEmbed4) {
            _inherits(AudioFileBlot, _BlockEmbed4);
  
            function AudioFileBlot() {
              _classCallCheck(this, AudioFileBlot);
  
              return _possibleConstructorReturn(this, (AudioFileBlot.__proto__ || Object.getPrototypeOf(AudioFileBlot)).apply(this, arguments));
            }
  
            _createClass(AudioFileBlot, null, [{
              key: 'create',
              value: function create(value) {
                var node = _get(AudioFileBlot.__proto__ || Object.getPrototypeOf(AudioFileBlot), 'create', this).call(this);
                node.className += ' content-audio content-box';
                node.setAttribute('contenteditable', 'false');
                if (value.src) {
                  var audio = document.createElement('audio');
                  audio.src = value.src;
                  audio.autoPlay = false;
                  audio.setAttribute('controls', 'controls');
  
                  var i = document.createElement('span');
                  i.setAttribute('class', 'remove-img-ico click');
                  i.innerText = '删除';
                  node.appendChild(audio);
                  node.appendChild(i);
                }
                return node;
              }
            }, {
              key: 'value',
              value: function value(node) {
                return node.querySelectorAll('audio').length > 0 ? {
                  src: node.querySelectorAll('audio')[0].getAttribute('src')
                } : '';
              }
            }]);
  
            return AudioFileBlot;
          }(BlockEmbed);
  
          AudioFileBlot.blotName = 'audioFile';
          AudioFileBlot.tagName = 'div';
          AudioFileBlot.className = 'content-audio-file-box';
          Quill.register(AudioFileBlot);

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
                Vue.nextTick(function(){
                    that.allAc();
                })
                return false;
              }
            }
          }]);

          return PlainTextClipboard;
        }(Clipboard);

        Quill.register('modules/clipboard', PlainTextClipboard);

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

        //初始化编辑器
        this.editor = new Quill(this.$refs.editor,{
            modules: {
                syntax: zrz_script.highlight == 1 ? true : false,
              toolbar:{
                  container: this.toolbarOptions,
                  handlers: {
                    'imagei': this.imageHandler,
                    'divider':this.dividerHandler,
                    'videoi':this.videoHandler,
                    'post':this.addPostHandler,
                    'hideStart':this.hideStart,
                    'hideEnd':this.hideEnd,
                    'undo':this.undo,
                    'files':this.files,
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

        //验证口令
        this.nonce = this.$refs.nonce.value;

        //工具条跟随滚动
        new Sticky('#toolbar');

        document.body.onclick = function(e){
            that.docAc();
        }

        //拖拽上传
        this.dropFile();

        //如果是文章编辑，直接获取编辑的数据
        var draft = JSON.parse(localStorage.getItem('zrz_write_'+zrz_script.site_info.site_mark));
        if(typeof zrz_write_edit_data == "undefined"){
            if(draft){
                this.draft = draft;
                this.draftEdit = true;
                this.timeAgo();
                this.cat = Object.keys(draft.cat)[0];
            }else{
                this.cat = this.cats[0];
            }
        }else{
            this.draft = zrz_write_edit_data;
            this.cat = Object.keys(zrz_write_edit_data.cat)[0];
            this.filesArg = zrz_write_edit_data.filesArg;
        }

        Vue.nextTick(function(){
            //输入框自动长高
            autosize(that.$refs.title);
            //自动草稿
            that.autoContentDraft();
            //跟随滚动
            document.getElementById('toolbar').appendChild(document.querySelectorAll('.ql-toolbar')[0]);
            setTimeout(function () {
                var toolbarButton = document.querySelectorAll('.ql-icon-picker');
                for (var i = 0; i < toolbarButton.length; i++) {
                    toolbarButton[i].addEventListener('click mousedown mousemove', function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                    });
                }
            }, 1000);

        })
        //localStorage.removeItem('zrz_write_'+zrz_script.site_info.site_mark);
        this.getDraft();

        //自动链接
        //this.autoLink();
    },
    watch:{
        cat:function(val){
            this.catInit(val);
            this.autoDraft();
        },
        format:function(val){
            if(val == 'none'){
                this.formatText = '默认';
            }
            if(val == 'image'){
                this.formatText = '4小图';
            }
            if(val == 'status'){
                this.formatText = '1大图';
            }
        },
        progress:function(val){
            if(val == '100%'){
                this.uploadText = '上传成功，文件校验中...';
                this.videoText = this.uploadText;
            }
        }
    },
    methods:{
        insetImageUri:function(){
            if(!this.insertUri) return;
            var that = this,
                range = that.editor.getSelection(true);
            that.editor.insertText(range.index, '\n', Quill.sources.USER);
            that.editor.insertEmbed(range.index, 'imagei', {
                alt: that.title,
                url: that.insertUri,
                id:0,
                des:'',
                loading:'',
                imgId:'',
                thumb:''
            }, Quill.sources.USER);
            that.editor.setSelection(range.index + 1, Quill.sources.SILENT);

            Vue.nextTick(function(){
                that.allAc();
                that.mediaType = '';
                that.showMediaForm = false;
                that.insertUri = '';
                that.imageBoxType = 'upload';
            })
        },
        //图片上传事件
        imageHandler:function(){
            this.mediaType = 'image';
            this.showMediaForm = true;
        },
        imageUpload:function(){
            this.mediaType = '';
            this.showMediaForm = false;
            this.insertUri = '';
            this.imageBoxType = 'upload';
            this.$refs.getFile.click();
        },
        uploadThumb:function(){
            this.$refs.getFileOne.click();
            this.thumbLocked = true;
        },
        uploadThumbVideo:function(){
            this.showMediaForm = true;
            this.mediaType = 'video';
            this.videoText = '选择视频文件<b class="gray"> 或 </b>拖拽到此处';
            this.thumbUPlocked = true;
        },
        cion:function(nub){
            return zrzStrToCoin(nub);
        },
        hideEnd:function(){
            var range = this.editor.getSelection(true);
            this.editor.insertText(range.index, '[/content_hide]', {},true);
        },
        hideStart:function(){
            var range = this.editor.getSelection(true);
            this.editor.insertText(range.index, '[content_hide]', {},true);
        },
        undo:function(){
            this.editor.history.undo();
        },
        redo:function(){
            this.editor.history.redo();
        },
        autoLink:function(){
            //复制网址自动转链接
            this.editor.clipboard.addMatcher(Node.TEXT_NODE, function(node, delta) {
                var regex = /(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-)+)/g;
                if(typeof(node.data) !== 'string') return;
                var matches = node.data.match(regex);
                if(matches && matches.length > 0) {
                    var ops = [];
                    var str = node.data;
                    matches.forEach(function(match) {
                        var split = str.split(match);
                        var beforeLink = split.shift();
                        ops.push({ insert: beforeLink });
                        ops.push({ insert: match, attributes: { link: match } });
                        str = split.join(match);
                    });
                    ops.push({ insert: str });
                    delta.ops = ops;
                }

                return delta;
            });
        },
        docAc:function(){
            var img = this.editor.root.querySelectorAll('.content-img-box');
            for (var i = 0; i < img.length; i++) {
                var bor = img[i].querySelectorAll('.bor-s');
                if(bor.length > 0){
                    bor[0].className = 'po-img-big';
                }

                var des = img[i].querySelectorAll('.addDesn-input')[0];
                if(des.value.length == 0 && des.className.indexOf(' hide') == -1){
                    des.className += ' hide';
                }
            }

            this.$refs.imgtoolbarSet.appendChild(this.$refs.imgtoolbar);
            this.toolbarHs = false;
            this.toolbarHb = false;

            var box = this.editor.root.querySelectorAll('.content-box,hr');
            if(box.length > 0){
                for (var i = 0; i < box.length; i++) {
                    var next = box[i].nextSibling;
                    if(next.length > 0 && next.tagName == 'P' && next.outerHTML == '<p><br></p>' && (next.nextSibling.tagName == 'DIV' || next.nextSibling.tagName == 'FIGURE')){
                        next.remove();
                    }
                }
            }
        },
        allAc:function(){
            
            var that = this,
                box = this.editor.root.querySelectorAll('.content-box,hr'),
                img = this.editor.root.querySelectorAll('.content-img-box');
            //点击盒子，如果两个盒子之间没有空行，则插入空行
            if(box.length > 0){
                for (var i = 0; i < box.length; i++) {
                    box[i].onclick = function(e){
                        e.preventDefault();
                        e.stopPropagation();
                        that.docAc();
                        if(e.currentTarget.nextSibling.tagName == 'DIV' || e.currentTarget.nextSibling.tagName == 'FIGURE'){
                            if(e.currentTarget.className.indexOf('content-post-box') != -1){
                                that.insertP(0);
                            }else{
                                that.insertP(1);
                            }
                        }
                    }

                    //删除按钮 事件
                    var del = box[i].querySelectorAll('.remove-img-ico');
                    if(del.length > 0){
                        del[0].onclick = function(e){
                            e.preventDefault();
                            e.stopPropagation();
                            that.deleteButtonAc(this);
                        }
                    }
                }
            }
            if(img.length > 0){
                

                for (var i = 0; i < img.length; i++) {
                    //点击描述框，不触发焦点事件
                    var des = img[i].querySelectorAll('.addDesn-input');
                    if(des.length > 0){
                        des[0].addEventListener('click', function(e) {
                            //e.preventDefault();
                            e.stopPropagation();
                        });
                        des[0].addEventListener('keydown',function(e){
                            //e.preventDefault();
                            e.stopPropagation();
                        });
                        //描述回车换行，输入文字同步到 addDesn 中
                        des[0].onkeyup = function(e){
                            e.stopPropagation();
                            if(e.which == 13 || e.keyCode == 13){
                                that.insertP(1);
                            }
                        }
                        des[0].addEventListener('blur',function(e){
                            e.stopPropagation();
                            this.parentNode.querySelectorAll('.addDesn')[0].innerText = this.value;
                        });
                    }

                    img[i].onclick = function(e){
                        e.preventDefault();
                        e.stopPropagation();
                        that.docAc();

                        //显示图片描述
                        this.querySelectorAll('.addDesn-input')[0].className = 'addDesn-input';

                        //显示图片高亮框
                        this.querySelectorAll('.po-img-big')[0].className += ' bor-s';

                        //插入图片控制工具

                        this.appendChild(that.$refs.imgtoolbar);
                        
                        if(this.className.indexOf('write-img-small') != -1){
                            that.toolbarHs = true;
                        }else{
                            that.toolbarHb = true;
                        }
                    }

                    //图片删除
                    var remove = img[i].querySelectorAll('.remove-img-ico');
                    if(remove.length > 0){
                        remove[0].onclick = function(e){
                            e.preventDefault();
                            e.stopPropagation();
                            that.deleteButtonAc(this);
                            if(that.thumb == this.parentNode.id){
                                that.thumb = 0;
                            }
                        }
                    }
                }
            }
            videoBackground();
        },
        deleteButtonAc:function(node){
            var that = this;
            var r = confirm('确认删除吗？');
            if (r == false) return;
            node.parentNode.remove();
            Vue.nextTick(function(){
                that.allAc();
            })
        },
        insertP:function(index){
            var range = this.editor.getSelection(true);

            this.editor.insertText(range.index+index, '\n',Quill.sources.SILENT);
            this.editor.setSelection(range.index +1, Quill.sources.SILENT);
        },
        catInit:function(val){
            if(this.catMore == 1){
                if(this.catLength > 3) return;
                this.catArr[val] = this.cats[val];
                this.catLength = Object.keys(this.catArr).length;
            }else{
                var arr = {};
                arr[val] = this.cats[val];
                this.catArr = arr;
            }
        },
        //恢复草稿
        getDraft:function(){
            if(this.draft.length != 0){

                this.title = this.draft['title'];
                this.thumb = this.draft['thumb'];
                this.thumbSrc = this.draft['thumbSrc'];
                this.thumbVideo = this.draft['thumbVideo'];
                this.thumbVideoDom = this.draft['thumbVideoDom'];
                if(typeof zrz_write_edit_data == "undefined"){
                    this.date = this.draft['date'];
                    this.editor.clipboard.dangerouslyPasteHTML(0, this.draft['content']);
                }else{
                    this.editor.clipboard.dangerouslyPasteHTML(0, this.domRest(this.draft['content'],'in'));

                }
                this.relatedPost = this.draft['related'];
                this.tags = this.draft['tags'];
                this.catArr = this.draft['cat'];
                this.redCapabilities = this.draft['capabilities']['redCapabilities'];
                this.rmb = this.draft['capabilities']['rmb'];
                this.credit = this.draft['capabilities']['credit'];
                this.lv = this.draft['capabilities']['lv'];
                this.excerpt = this.draft['excerpt'];
                this.format = this.draft['format'];
                this.filesArg = this.draft['filesArg'];
                this.allAc();
            }else{
                this.date = '';
                this.title = '';
                this.editor.root.innerHTML = '<p><br></p>';
                this.relatedPost = [];
                this.tags = [];
                this.redCapabilities = 'default';
                this.rmb = '';
                this.credit = '';
                this.lv = [];
                this.thumb = 0;
                this.thumbSrc = '';
                this.thumbVideo = '';
                this.thumbVideoDom = '';
                this.excerpt = '';
                this.cat = Object.keys(this.cats)[0];
                this.catArr = {};
                this.catInit(this.cat);
                this.draftEdit = false;
                this.format = 'none';
            }
        },
        //删除草稿
        deleteDraft:function(){
            var r=confirm('删除草稿之后将不可恢复，确定要删除吗？');
            if (r==false)return;
            localStorage.removeItem('zrz_write_'+zrz_script.site_info.site_mark);
            this.draft = [];
            this.getDraft();
        },
        editAgain:function(){
            this.draftEdit = false;
            new Sticky('#toolbar');
        },
        timeAgo:function(){
            var that = this;
            timeago.cancel();
            this.date = this.draft.date;
            setTimeout(function () {
                that.timeagoInstance.render(that.$el.querySelectorAll('.timeago'), 'zh_CN');
            }, 10);
        },
        //失去焦点，自动保存草稿
        autoContentDraft:function(){
            var that = this;
            this.editor.on('selection-change', function(range, oldRange, source) {
                if (range === null && oldRange !== null) {
                    that.autoDraft();
                }
            })
        },
        //自动草稿
        autoDraft:function(){
            if(typeof zrz_write_edit_data != "undefined") return;
            if(zrz_write.auto_draft == 0){
                localStorage.removeItem('zrz_write_'+zrz_script.site_info.site_mark);
                return;
            };
            if(window.sessionStorage && ((this.editor.root.innerHTML != '<p><br></p>' || this.title != '') && this.imgUploadLocked == false && this.showMediaForm == false) || this.thumbLocked == true){
                var data = {
                    'date':this.getDate(),
                    'content':this.editor.root.innerHTML,
                    'cat':this.catArr,
                    'title':this.title,
                    'related':this.relatedPost,
                    'tags':this.tags,
                    'capabilities':{
                        'redCapabilities':this.redCapabilities,
                        'rmb':this.rmb,
                        'credit':this.credit,
                        'lv':this.lv,
                    },
                    'thumb':this.thumb,
                    'excerpt':this.excerpt,
                    'thumbSrc':this.thumbSrc,
                    'thumbVideo':this.thumbVideo,
                    'thumbVideoDom':this.thumbVideoDom,
                    'format':this.format,
                    'filesArg':this.filesArg
                }
                this.draft = data;
                var that = this;
                setTimeout(function () {
                    localStorage.setItem('zrz_write_'+zrz_script.site_info.site_mark, JSON.stringify(that.draft));
                    that.timeAgo();
                }, 300);
            }
        },
        saveData:function(){
            this.autoDraft();
        },
        catRemove:function(key){
            if(this.catLength > 1 && this.catMore == 1){
                this.$delete(this.catArr,key);
                this.catLength --;
                this.autoDraft();
                return;
            }
            return;
        },
        table:function(type){
            if(this.thumbLocked == true) return;
            if(type == 'url'){
                this.insertVideoUrl = true;
                this.insertVideoFile = false;
                this.videoError=''
            }else{
                this.insertVideoUrl = false;
                this.insertVideoFile = true;
                this.videoError=''
            }
        },
        //删除相关文章
        deleteRelated:function(id){
            var r=confirm('确认要删除这个相关文章吗？');
            if (r==false) return;
            for (var i = 0; i < this.relatedPost.length; i++) {
                if(id == this.relatedPost[i].id){
                    this.relatedPost.splice(i, 1);
                    this.autoDraft();
                }
            }
        },
        addPostHandler:function(){
            this.showMediaForm = true;
            this.mediaType = 'post';
            this.postIdOrUrl = '';
            this.getPostError = '';
        },
        files:function(){
            this.showMediaForm = true;
            this.mediaType = 'files';
            this.uploadText = '请选择要上传的附件';
        },
        insertFile:function(type){
            if(!this.fileData.link || !this.fileData.name) return;
            var start = '[content_hide]',
                end = '[/content_hide]';
            if(type != 'hide'){
                start = '';
                end = '';
            }
            var shortCode = start+'[zrz_file link="'+this.fileData.link+'" name="'+this.fileData.name+'" code="'+this.fileData.code+'"]'+end;
            if(this.fileData.type == 'netdisc'){
                shortCode = start+'[zrz_file link="'+this.fileData.link+'" name="'+this.fileData.name+'" pass="'+this.fileData.pass+'" code="'+this.fileData.code+'"]'+end;
            }else if(this.fileData.type == 'local'){
                shortCode = start+'[zrz_file local="1" link="'+this.fileData.link+'" name="'+this.fileData.name+'" pass="'+this.fileData.pass+'" code="'+this.fileData.code+'"]'+end;
            }
            var range = this.editor.getSelection(true);
            this.editor.insertText(range.index, shortCode, {},true);
            this.showMediaForm = false;
            this.fileData.link = '';
            this.fileData.name = '';
            this.fileData.pass = '';
            this.fileData.code = '';
            this.fileData.url = '';
        },
        updatefile:function(event){
            var file = event.target.files[0],
                that = this;
            if(!file) return;
            if(this.uploadLocked == true) return;
            this.uploadLocked = true;
            this.uploadError = '';
            var formData = new FormData();

            formData.append('file',file,file.name);
            formData.append("security", this.nonce);
            formData.append("user_id", zrz_script.current_user);
            formData.append("type", 'file');
            var config = {
                onUploadProgress: function(progressEvent){
                    var complete = (progressEvent.loaded / progressEvent.total * 100 | 0) + '%';
                    that.progress = complete;
                }
            }
            axios.post(zrz_script.ajax_url+'zrz_media_upload',formData,config).then(function(resout){
                if(resout.data.status == 200){
                    that.fileData.link = resout.data.Turl;
                    that.filesArg.push(resout.data.imgdata);
                }else{
                    that.uploadError = resout.data.msg;
                };
                that.uploadLocked = false;
                that.uploadText = '<i class="iconfont zrz-icon-font-lnicon34"></i> 选择文件';
            })
        },
        getPost:function(type){
            var that = this;
            if(this.getPostLocked == true) return;
            this.getPostLocked = true;
            axios.post(zrz_script.ajax_url+'zrz_get_post_by_id','pid='+this.postIdOrUrl+'&type='+type).then(function(resout){
                if(resout.data.status == 200){
                    var range = that.editor.getSelection(true);
                    that.editor.insertText(range.index, '[zrz_insert_post id='+resout.data.msg+']', {},true);
                    that.showMediaForm = false;
                }else{
                    that.getPostError = resout.data.msg;
                }
                that.getPostLocked = false;
            })
        },
        //图片上传
        imgUpload:function(event){
            if(!event.target.files) return;
            if(this.imgUploadLocked == true) return;
            this.imgUploadLocked = true;
            var files = event.target.files,
                that = this,
                filesArr = Array.prototype.slice.call(files),
                i = 0,
                key;
                if(this.thumbLocked){
                    this.thumbUPlocked = true;
                }

            filesArr.forEach(function(f) {
                if(!f.type.match("image.*")) {
                    return;
                }

                //生成随机数
                var id = uuid(8, 16);

                imgcrop(f,zrz_script.media_setting.max_width,'',function(resout){
                    if(resout[0] === true){
                        imgload(resout[1],function(imgSize){

                            if(!that.thumbLocked){
                                //编辑器插入临时图像
                                var range = that.editor.getSelection(true);
                                that.editor.insertText(range.index, '\n', Quill.sources.USER);
                                that.editor.insertEmbed(range.index, 'imagei', {
                                    alt: that.title,
                                    url: resout[1],
                                    id:id,
                                    des:'',
                                    loading:'editor-loading',
                                    imgId:'',
                                    thumb:''
                                }, Quill.sources.USER);
                                that.editor.setSelection(range.index + 1, Quill.sources.SILENT);
                            }

                            //上传
                            var formData = new FormData();
                            if(f.type.indexOf('gif') > -1){
                                fileData = f;
                            }else{
                                fileData = resout[2];
                            }

                            //区分小图和大图
                            if(imgSize[0] < 300){
                                formData.append("type", 'small');
                            }else{
                                formData.append("type", 'big');
                            }

                            formData.append('file',fileData,f.name);
                            formData.append("security", that.nonce);
                            formData.append("user_id", zrz_script.current_user);

                            axios.post(zrz_script.ajax_url+'zrz_media_upload',formData).then(function(resout){
                                if(resout.data.status == 200){
                                    if(!that.thumbLocked){
                                        var dom = document.getElementById(id);
                                        //上传成功，替换网址
                                        if(resout.data.status === 200){
                                            dom.src = resout.data.Turl;
                                            dom.parentNode.className = 'content-img-box';
                                            if(resout.data.imgdata){
                                                dom.parentNode.id = resout.data.imgdata;
                                                that.filesArg.push(resout.data.imgdata);
                                            }
                                        }else{
                                            //上传失败删除临时dom
                                            dom.parentNode.remove();
                                        }
                                        Vue.nextTick(function(){
                                            that.allAc();
                                        })
                                    }else{
                                        if(resout.data.imgdata){
                                            that.thumb = resout.data.imgdata;
                                            that.filesArg.push(resout.data.imgdata);
                                        }
                                        that.thumbSrc = resout.data.Turl;
                                        that.thumbVideo = '';
                                        that.thumbVideoDom = '';
                                        that.autoDraft();
                                        that.thumbLocked = false;
                                        that.thumbUPlocked = false;
                                    }
                                    that.$refs.getFile.value = '';
                                    that.imgUploadLocked = false;
                                }
                            })
                        })
                    }
                })
            })
        },
        dividerHandler:function(){
            var range = this.editor.getSelection(true);
            this.editor.insertText(range.index, '\n', Quill.sources.USER);
            this.editor.insertEmbed(range.index + 1, 'divider', true, Quill.sources.USER);
            this.editor.setSelection(range.index + 2, Quill.sources.SILENT);
        },
        //视频上传
        videoHandler:function(){
            this.showMediaForm = true;
            this.mediaType = 'video';
            this.videoText = '选择视频文件<b class="gray"> 或 </b>拖拽到此处';
        },
        tagChange:function(e){
            if(this.tags.length > this.tagsCount){
                this.lengthw = true;
            }
            var val = this.tagI.replace(/(，|。)+/g, '');
            if (e.keyCode == 13 || e.keyCode == 32 || e.keyCode == 188 || e.keyCode == 190 || this.tagI.indexOf("，")!=-1 || this.tagI.indexOf("。")!=-1 || e.type == 'blur') {
                e.preventDefault();
                var index = this.tags.indexOf(val);
                if(index == -1 && val.length > 0 && this.tags.length < this.tagsCount ){
                    this.tags.push(val);
                    this.tagI = '';
                    this.autoDraft();
                }else{
                    this.tagI = '';
                    this.lengthw = false;
                }
            }
        },
        removeTag:function(index){
            this.tags.splice(index,1);
            this.autoDraft();
        },
        addTag:function(tag){
            var that = this;
            if(this.tags.length > this.tagsCount) return;
            if(this.tags.indexOf(tag) != -1){
                this.dubb = tag;
                setTimeout(function () {
                    that.dubb = '';
                }, 100);
                return;
            }else{
                this.tags.push(tag);
                this.autoDraft();
            }
        },
        //调整图片大小
        size:function(event,type){
            var dom = event.currentTarget.parentNode.parentNode.parentNode;
            if(type == 'small'){
                dom.className = dom.className.replace(' write-img-big','');
                if(dom.className.indexOf('write-img-small') == -1){
                    dom.className += ' write-img-small';
                    this.toolbarHs = true;
                    this.toolbarHb = false;
                }
            }else{
                dom.className = dom.className.replace(' write-img-small','');
                if(dom.className.indexOf('write-img-big') == -1){
                    dom.className += ' write-img-big';
                    this.toolbarHs = false;
                    this.toolbarHb = true;
                }
            }
        },
        //插入视频
        closeViedoForm:function(){
            this.showMediaForm = false
        },
        //拖拽上传
        dropFile:function(){
            var box = this.$refs.dropbox,
                that = this;
            box.addEventListener('dragenter',function(event){
                event.preventDefault();
                event.stopPropagation();
                that.dropenter = true;
                },false);
            box.addEventListener('dragleave',function(event){
                event.preventDefault();
                event.stopPropagation();
                that.dropenter = false;
            },false);
            box.addEventListener('dragover',function(event){
                event.preventDefault();
                event.stopPropagation();
                that.dropenter = true;
                event.dataTransfer.effectAllowed = "copy";
            },false);
             box.addEventListener('drop', function(event){
                 event.preventDefault();
                 event.stopPropagation();
                 that.updateVideo(event,'file');
             }, false);
        },
        //视频上传
        updateVideo:function(event,type){
            if(this.thumbLocked == true) return;
            this.thumbLocked = true;

            this.videoError = '';
            var that = this;
            if(type == 'url'){
                if(this.insertVideoButton == true) return;
                this.insertVideoButton = true;
                var data = {
                    'url':this.$refs.videoUrl.value,
                    'type':'url',
                    'security':this.nonce
                };
                axios.post(zrz_script.ajax_url+'zrz_video_upload',Qs.stringify(data)).then(function(resout){
                    console.log(resout);
                    if(resout.data.status == 200){
                        if(resout.data.msg.indexOf('smartideo') != -1){
                            if(!that.thumbUPlocked){
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
                                setTimeout(function () {
                                    videoBackground();
                                }, 300);
                            }else{
                                that.thumbVideo = that.$refs.videoUrl.value;
                                that.thumbVideoDom = resout.data.msg;
                                that.thumbUPlocked = false;
                                that.thumbSrc = '';
                                that.thumb = 0;
                            }
                            that.showMediaForm = false;
                            that.$refs.videoUrl.value = '';
                            that.insertVideoButton = false;
                            that.autoDraft();
                        }else{
                            that.videoError = '不支持此视频，请重试';
                            that.thumbUPlocked = false;
                        }
                    }else{
                        that.videoError = resout.data.msg+'请重试';
                        that.insertVideoButton = false;
                        that.thumbUPlocked = false;
                    }
                    that.thumbLocked = false;
                    Vue.nextTick(function(){
                        that.allAc();
                    })
                })
            }

            if(type == "file"){

                if(event.dataTransfer){
                    var file = event.dataTransfer.files[0];
                }else{
                    var file = event.target.files[0]
                }

                if(!file){
                    this.thumbLocked = false;
                    return;
                }

                //视频尺寸限制
                if(Math.round(file.size/1024*100)/100000 > zrz_write.video_size){
                    this.videoError = '该视频体积太大，请重新选择。';
                    this.thumbLocked = false;
                    return;
                }
                if(file.type.indexOf('video') != -1 || file.type.indexOf('audio') != -1){
                    this.dropenter = false;
                    var data = {
                        'file':file,
                        'type':'file'
                    };

                    formData = new FormData();
                    formData.append("type", 'file');
                    formData.append('file',file,file.name);
                    formData.append("security", that.nonce);
                    var config = {
                        onUploadProgress: function(progressEvent){
                            var complete = (progressEvent.loaded / progressEvent.total * 100 | 0) + '%';
                            that.progress = complete;
                        }
                    }

                    axios.post(zrz_script.ajax_url+'zrz_video_upload',formData,config)
                    .then(function(resout){
                        console.log(resout);
                        if(resout.data.status == 200){
                            if(!that.thumbUPlocked){
                                that.videoText = '<span class="green">上传成功，插入中...</span>';
                                var range = that.editor.getSelection(true);
                                that.editor.insertText(range.index, '\n', Quill.sources.USER);

                                var filetype = 'videoFile';
                                if(file.type.indexOf('audio') != -1){
                                    filetype = 'audioFile';
                                }
                                that.editor.insertEmbed(range.index,filetype, {
                                    src: resout.data.Turl
                                }, Quill.sources.USER);
                                that.editor.setSelection(range.index + 1, Quill.sources.SILENT);
                                setTimeout(function () {
                                    that.allAc();
                                }, 10);
                            }else{
                                that.thumbVideo = resout.data.Turl;
                                if(file.type.indexOf('audio') != -1){
                                    that.thumbVideoDom = '<audio src="'+resout.data.Turl+'" controls="controls"></audio>';
                                }else{
                                    that.thumbVideoDom = '<video src="'+resout.data.Turl+'" controls="controls"></video>';
                                }
                                that.thumbSrc = '';
                                that.thumb = 0;
                                that.thumbUPlocked = false;
                            }
                            that.filesArg.push(resout.data.imgdata);
                            that.showMediaForm = false;
                            that.autoDraft();
                        }else{
                            that.videoError = resout.data.msg || '非法操作';
                            that.videoText = '选择视频文件<b class="gray"> 或 </b>拖拽到此处';
                            that.thumbUPlocked = false;
                        }
                    })
                }else{
                    this.videoError = '不是视频文件';
                    this.videoText = '选择视频文件<b class="gray"> 或 </b>拖拽到此处';
                    that.thumbUPlocked = false;
                }
                this.thumbLocked = false;
                this.insertVideoButton = false;
                this.$refs.getVideoFile.value = '';
            }
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
        //获取相关文章
        getRelatePost:function(pid){
            if(this.relatedLocked == true) return;
            this.relatedLocked = true;
            if(this.relatedPost.length >= 5){
                this.relatedError = '最多只能添加5篇相关文章';
                this.relatedLocked = false;
                return;
            }
            for (var i = 0; i < this.relatedPost.length; i++) {
                if(this.relatedPost[i].id == pid || this.relatedPost[i].href == pid){
                    this.relatedError = '此文章已添加';
                    this.relatedLocked = false;
                    return;
                }
            }
            var that = this;
            axios.post(zrz_script.ajax_url+'zrz_get_related_post','pid='+pid+'&type=post').then(function(resout){
                if(resout.data.status == 200){
                    that.relatedPost.push(resout.data.msg);
                    that.realtedId = '';
                    that.autoDraft();
                }else{
                    that.relatedError = resout.data.msg;
                }
                that.relatedLocked = false;
            })
        },
        domRest:function(str,type){
            if(type == 'in'){
                var content = ZrzparseHTML(str),
                    out = '';
                for (var i = 0; i < content.length; i++) {
                    //图片
                    if(content[i].className.indexOf('content-img-box') != -1){
                        content[i].innerHTML += '<span class="remove-img-ico click">删除</span>';
                        content[i].setAttribute('contenteditable','false');
                        var des = content[i].querySelectorAll('.addDesn')[0];

                        var input = document.createElement('input');
                                if(des){
                                    input.value = des.innerText;
                                }

                            if(input.value.length > 0){
                                input.className = 'addDesn-input';
                            }else{
                                input.className = 'addDesn-input hide';
                            }
                            content[i].appendChild(input);
                    };

                    //视频
                    if(content[i].className.indexOf('content-video') != -1){
                        content[i].innerHTML += '<span class="remove-img-ico click">删除</span>';
                        content[i].setAttribute('contenteditable','false');
                    }

                    out += content[i].outerHTML;
                }

                return out;
            }else if(type == 'out'){
                str = str.replace(/ contenteditable="false"/g,'').replace(/ contenteditable="true"/g,'')
                .replace(/ placeholder="添加图片注释（可选）"/g,'').replace(/<p><br><\/p>/g,'');
                var content = ZrzparseHTML(str),
                    out = '';
                for (var i = 0; i < content.length; i++) {
                    //删掉删除按钮
                    var rem = content[i].querySelectorAll('.remove-img-ico');
                    if(rem.length > 0){
                        rem[0].remove();
                    }

                    var des = content[i].querySelectorAll('.addDesn-input');
                    if(des.length > 0){
                        des[0].remove();
                    }

                    var img = content[i].querySelectorAll('.po-img-big');
                    if(img.length > 0){
                        img[0].className = 'po-img-big';
                    }

                    var tool = content[i].querySelector('#imgtoolbar');
                    if(tool){
                        tool.remove();
                    }

                    out += content[i].outerHTML;
                }
                return out;
            }
        },
        //文章发布
        postInsert:function(type){
            if(this.insertPostLocked == true || this.imgUploadLocked == true || this.thumbLocked == true) return;
            this.postType = type;
            this.insertPostLocked = true;
            var data = {
                'cats':this.catArr,
                'title':this.title,
                'thumb':this.thumb,
                'content':this.domRest(this.editor.root.innerHTML,'out'),
                'related':this.relatedPost,
                'tags':this.tags,
                'capabilities':this.redCapabilities,
                'rmb':this.rmb,
                'credit':this.credit,
                'lv':this.lv,
                'pid':typeof zrz_write_edit_data == "undefined" ? '' : zrz_write_edit_data.post_id,
                'security':this.nonce,
                'excerpt':this.excerpt,
                'draft':type == 'draft' ? 1 : 0,
                'thumbVideo':this.thumbVideo,
                'format':this.format,
                'filesArg':this.filesArg
            },
            that = this;
            axios.post(zrz_script.ajax_url+'zrz_insert_post',Qs.stringify(data)).then(function(resout){
                if(resout.data.status == 200){
                    that.subMsg = '发布成功，跳转中...';
                    localStorage.removeItem('zrz_write_'+zrz_script.site_info.site_mark);
                    that.insertPostMsg = '';
                    window.location.href = resout.data.url;
                }else{
                    that.insertPostLocked = false;
                    that.insertPostMsg = resout.data.msg;
                }
                that.postType = '';
            })
        }
    }
})

Vue.nextTick(function(){
    autosize(document.querySelector('#textarea'));
})

