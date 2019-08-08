var catHeader = new Vue({
    el:'#cat-header',
    data:{
        width:parseInt(zrz_script.page_width) + 60,
        catId:zrz_cat.cat_id,
        blur:zrz_cat.blur == 1 ? true : false,
        bgimage:zrz_cat.image,
        locked:false,
        isAdmin:zrz_script.is_admin
    },
    methods:{
        getFile:function(event){
            var file = event.target.files[0],
                that = this;
            if(!file) return;
            if(this.locked == true) return;
            this.locked = true;
            if(file.type.indexOf('image') > -1){
                imgcrop(file,this.width,'',function(resout){
                    if(resout[0] === true){
                        var formData = new FormData(),
                            fileData = resout[2];
                        formData.append("cat_id", that.catId);
                        formData.append("file", fileData,'default.jpg');
                        axios.post(zrz_script.ajax_url+'zrz_upload_category_image',formData)
                        .then(function(resout){
                            if(resout.data.status == 200){
                                that.bgimage = resout.data.url;
                                that.locked = false;
                            }
                        })
                    }
                })
            }
        },
        blurChange:function(){
            axios.post(zrz_script.ajax_url+'zrz_update_category_blur','cat_id='+this.catId)
            .then(function(resout){
                if(resout.data.status == 200){
                    this.blur = resout.data.msg.blur
                }
            })
        }
    }
})
