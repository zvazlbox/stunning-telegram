var singleShop = new Vue({
    el:'#shop-single',
    data:{
        count:0,
        login:zrz_script.is_login,
        j:0,
        y:0,
        t:0,
        msg:'',
        //商品人气
        countUpOption:{
            useEasing: true,
            useGrouping: false,
            separator: '',
            decimal: '',
        },
        //商品信息
        buyData:[],
        //添加到购物车
        cartList:{},
        addToCartText:'加入购物车',
        addToCartLocked:false,
        favorited:{
            loved:0,
            count:0
        },
        //抽奖
        locked:false,
        rand1:0,
        dy:'=',
        rand2:0,
        math:10,
        t:'',
        lotteryMsg:'',
    },
    mounted:function(){

        if(this.$refs.credit){
            this.j = this.$refs.credit.getAttribute('data-j');
            this.y = this.$refs.credit.getAttribute('data-y');
            this.t = this.$refs.credit.getAttribute('data-t');
        }
        if(this.j && this.j != '00' && this.j != '0'){
            this.msg = this.j + '金';
        }
        if(this.y && this.y != '00'){
            this.msg += this.y + '银';
        }
        if(this.t && this.t != '00'){
            this.msg += this.t + '铜';
        }

        if(this.$refs.creditCoin){
            this.msg = this.$refs.creditCoin.getAttribute('data-credit') + this.$refs.creditCoin.getAttribute('data-name');
        }

        var data = JSON.parse(localStorage.getItem('zrz_shop_list_'+zrz_script.site_info.site_mark));
        if(data){
            this.cartList = data;
        }

        if(typeof zrz_shop_data != 'undefined'){
            //商品信息
            this.buyData = {
                'title':zrz_shop_data.title,
                'price':zrz_shop_data.price,
                'type':zrz_shop_data.type,
                'commodity':zrz_shop_data.commodity,
                'picked':0,
                'msg':'',
                'buyed':0,
                'count':this.count
            }

            if(this.checkCart() && this.login){
                this.addToCartText = '已添加到购物车';
                this.addToCartLocked = true;
            }
        }

        //人气
        if(this.$refs.postViews){
            var that = this;
            axios.post(zrz_script.ajax_url+'zrz_view','pid='+zrz_single.post_id).then(function(resout){
                if(resout.data.status == 200){
                    var view = new CountUp(that.$refs.postViews, 0, resout.data.views, 0, 2.5,that.countUpOption);
                    if (!view.error) {
                      view.start();
                    }
                    that.favorited.loved = resout.data.favorites.loved;
                    that.favorited.count = resout.data.favorites.count;
                }
            })
        }
    },
    methods:{
        mouseOver:function(event){
            this.$refs.big.style.backgroundImage = 'url('+event.target.src+')';
            if(event.target.className.indexOf('picked') !== -1) return;
            event.target.className += ' picked';
        },
        mouseOut:function(event){
            event.target.className = event.target.className.replace(' picked','');
        },
        more:function(){
            this.count ++;
            this.countCalculate();
        },
        less:function(){
            if(this.count <= 0) return;
            this.count --;
            this.countCalculate();
        },
        //计算数量
        countCalculate:function(){
            this.buyData.count = this.count;
        },
        //商品购买
        buy:function(){
            if(!this.loginac()) return;
            self.location='/cart?id='+zrz_single.post_id+'&count='+this.count;
        },
        //积分兑换
        exchange:function(){
            if(!this.loginac()) return;
            self.location='/cart?id='+zrz_single.post_id+'&count='+this.count;
        },
        //抽奖
        lottery:function(){
            if(!this.login){
                signForm.showBox = true;
                signForm.signin = true;
                return;
            }
            var r = confirm('确定要使用'+this.msg+'来抽奖吗？');
            if (r == false) return;
            if(this.locked == true) return;
            this.locked = true;
            this.rand1 = 0;
            this.rand2 = 0;
            this.lotteryMsg = '';
            this.rand(1);
            var that = this;
            axios.post(zrz_script.ajax_url+'zrz_shop_lottery','pid='+zrz_single.post_id).then(function(resout){
                var data = resout.data;
                if(data.status == 200 || data.status == 403){
                    that.math = data.m;
                    setTimeout(function () {
                        clearTimeout(that.t);
                        that.rand1 = data.rand1;
                        that.rand(2);
                        setTimeout(function () {
                            clearTimeout(that.t);
                            that.rand2 = data.rand2;
                            if(that.rand1 != that.rand2){
                                that.dy = '≠';
                                that.lotteryMsg = '运气稍微差一点，再接再厉！';
                            }else{
                                that.dy = '=';
                                that.lotteryMsg = '<span class="green">恭喜！你中奖了！</span>';
                            }
                            that.locked = false;
                        }, 2000);
                    }, 2000);
                }
            })
        },
        rand:function(rand){
            if(rand == 1){
                this.rand1 = Math.round(Math.random() * (this.math - 1) + 1);
            }else{
                this.rand2 = Math.round(Math.random() * (this.math - 1) + 1);
            }
            var that = this;
            this.t = setTimeout(function(){
                that.rand(rand);
            },50);
        },
        //加入购物车
        addToCart:function(){
            if(this.buyData.count <= 0 ){
                this.buyData.count = 1;
            }
            if(this.addToCartLocked == true) return;
            if (!window.sessionStorage) return;
            if(!this.loginac()) return;
            if(this.checkCart()) return;

            this.cartList['p'+zrz_single.post_id] = this.buyData;
            localStorage.setItem('zrz_shop_list_'+zrz_script.site_info.site_mark, JSON.stringify(this.cartList));
            this.addToCartText = '已添加到购物车';

            //购物车图标事件
            headTop.$refs.addToCart.className += ' add-cart';
            setTimeout(function () {
                headTop.$refs.addToCart.className = headTop.$refs.addToCart.className.replace(' add-cart','');
            }, 320);
            headTop.shopCount++;
        },
        //检查购物车中是否存在该商品
        checkCart:function(){
            if(this.cartList['p'+zrz_single.post_id]){
                return true;
            }
            return false;
        },
        loginac:function(){
            if(!this.login){
                signForm.showBox = true;
                signForm.signin = true;
                return false;
            }
            return true;
        },
        //商品收藏
        favorites:function(){
            if(zrz_script.is_login == 0){
                signForm.showBox = true;
                signForm.signup = false;
                signForm.signin = true
            }
            var that = this;
            axios.post(zrz_script.ajax_url+'zrz_post_favorites','pid='+zrz_single.post_id+'&type=shop').then(function(resout){
                if(resout.data.status == 200){
                    if(resout.data.loved == 1){
                        that.favorited.loved = 1;
                        that.favorited.count++;
                    }else{
                        that.favorited.loved = 0;
                        that.favorited.count--;
                    }
                }
            })
        }
    }
})

var cart = new Vue({
    el:'#cart',
    data:{
        list:{},
        step:0,
        all:0,
        totalPrice:0,
        totalCoin:0,
        picked:0,
        pickedLength:0,
        //底部跟随
        footerBarFixed:false,
        BoxWidth:'100%',
        userCredit:0,
        //支付结果
        Dstep3:{
            'success':0,
            'fail':0
        },
        Gstep3:{
            'success':0,
            'fail':0
        },
        payLocked:false,
        GpayLocked:false,
        //收货地址
        address:{},
        addressShow:false,
        addError:'',
        add:{
            'address':'',
            'phone':'',
            'name':''
        },
        defaultAddress:'',
        //用户留言
        orderContent:'',
        //支付
        show:false,
        data:[],
        postIDs:[],
        fapiao:{
            'open':0,
            'gongsi':'',
            'shibiehao':'',
            'dizhi':'',
            'dianhua':'',
            'yinhang':'',
            'zhanghao':''
        }
    },
    mounted:function(){
        if(!this.$refs.cartListPage) return;
        var that = this;
        //localStorage.removeItem('zrz_shop_list_'+zrz_script.site_info.site_mark);
        //判断是直接购买模式，还是加入购物车的模式
        if(typeof zrz_cart_data != 'undefined'){
            this.list[zrz_cart_data.postid] = {
                'commodity':0,
                'count':zrz_cart_data.count,
                'msg':'',
                'picked':1,
                'price':0,
                'buyed':0,
                'title':zrz_cart_data.title,
                'type':zrz_cart_data.type
            }
            this.address = zrz_cart_data.address == 0 ? {} : zrz_cart_data.address;
            this.defaultAddress = zrz_cart_data.defaultAddress;
        }else{
            var data = JSON.parse(localStorage.getItem('zrz_shop_list_'+zrz_script.site_info.site_mark));
            //清除已经付款的订单
            if(data){
                this.list = data;
                Object.keys(this.list).forEach(function(key){
                    if(that.list[key].payed == 'd'){
                        Vue.delete( that.list, key );
                    }else if(that.list[key].payed == 'g'){
                        Vue.delete( that.list, key );
                    }
                })
            }
            localStorage.setItem('zrz_shop_list_'+zrz_script.site_info.site_mark, JSON.stringify(this.list));
            this.address = zrz_cart_ban.address == 0 ? {} : zrz_cart_ban.address;
            this.defaultAddress = zrz_cart_ban.defaultAddress;
        }

        //订单校验
        data = {
            'data':Object.keys(this.list)
        };
        console.log(data);

        axios.post(zrz_script.ajax_url+'zrz_shop_confirm',Qs.stringify(data)).then(function(resout){
            if(resout.data.status == 200){
                var msg = resout.data.msg;
                //订单数据确认
                resout.data.msg.forEach(function(item,index){
                    that.list['p'+item.postid].price = item.price;
                    that.list['p'+item.postid].remaining = item.remaining;
                })

                if(typeof zrz_cart_data == 'undefined'){
                    localStorage.setItem('zrz_shop_list_'+zrz_script.site_info.site_mark, JSON.stringify(that.list));
                }
                that.userCredit = resout.data.credit;
            }
            that.autoPicked();
            that.pickedlength();
            that.totalPriceC();
            Vue.nextTick(function(){
                that.step = 1;
                that.$refs.loading.style.display = 'none';
                //that.BoxWidth = that.$el.offsetWidth ? that.$el.offsetWidth+'px' : '100%';
                // if(that.$refs.postFooter && that.step == 1){
                //     that.handleScroll();
                //     window.addEventListener('scroll', that.handleScroll);
                //     window.onresize = function temp(){
                //         that.BoxWidth = that.$el.offsetWidth+'px';
                //     }
                // }

            })
        })
    },
    methods:{
        pickeAdd:function(){
            this.addressShow = true;
            if(typeof Select != 'undefined'){
                var address = new Select('#address',default_data);
            }
        },
        addAddress:function(){
            var that = this;
            if(!this.add.address || !this.add.phone || !this.add.name){
                this.addError = '请输入完整的信息';
                return;
            }
            this.addError = '';
            var arr = JSON.parse(JSON.stringify(this.add)),
                key = uuid(8, 16);

                this.$set(this.address,key,arr);

            this.add = {
                'address':'',
                'phone':'',
                'name':''
            };
            var data = {
                'data':this.address,
                'key':key
            };
            axios.post(zrz_script.ajax_url+'zrz_add_address',Qs.stringify(data)).then(function(resout){
                if(resout.data.status == 200){
                    that.defaultAddress = key;
                    that.addressShow = false
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
        setDefault:function(key){
            var that = this;
            axios.post(zrz_script.ajax_url+'zrz_set_default_address','key='+key).then(function(resout){
                if(resout.data.status == 200){
                    that.defaultAddress = key;
                }
            })
        },
        coin:function(nub){
            if(nub){
                nub = nub.toString();
                return zrzStrToCoin(nub);
            }
            return '';
        },
        pickedc:function(key){
            if(this.list[key].picked == 1){
                this.list[key].picked = 0;
                this.picked = 0;
            }else{
                this.list[key].picked = 1;
                this.picked = 1;
            }
            this.pickedlength();
            this.totalPriceC();
            this.autoPicked();
        },
        pickedlength:function(){
            var j = 0,
                that = this;
                Object.keys(this.list).forEach(function(key){
                    if(that.list[key].picked == 1){
                        j++
                    };
                })
            this.pickedLength = j;
        },
        count:function(key,type){

            if(type == 'add'){
                if(this.list[key].count >= this.list[key].remaining) return;
                this.list[key].count++
            }else{
                if(this.list[key].count <= 1) return;
                this.list[key].count--
            }
            this.totalPriceC();
        },
        countAc:function(key){
            //如果购物车中的商品数量大于商品剩余数量，则自动取商品的最大数量
            if(this.list[key].count > this.list[key].remaining){
                this.list[key].count = this.list[key].remaining;
            }
            this.totalPriceC();
        },
        autoPicked:function(){
            var i = 0,
                that = this;
            Object.keys(this.list).forEach(function(key){
                if(that.list[key].picked == 1){
                    i++;
                }
            })
            if(i == Object.keys(this.list).length){
                this.all = 1;
            }else{
                this.all = 0;
            }
        },
        pickedAll:function(){
            var that = this;

            if(this.all == 0){
                Object.keys(this.list).forEach(function(key){
                    that.list[key].picked = 1;
                })
                this.all = 1;
            }else{
                Object.keys(this.list).forEach(function(key){
                    that.list[key].picked = 0;
                })
                this.all = 0;
            }
            this.pickedlength();
            this.totalPriceC();
        },
        deleteOrders:function(){
            var r = confirm('确定要删除这些订单吗？');
            if (r == false) return;
            var that = this;
            Object.keys(this.list).forEach(function(key){
                if(that.list[key].picked == 1){
                    Vue.delete( that.list, key );
                }
            })
            this.totalPriceC();
            headTop.shopCount = Object.keys(this.list).length;
            if(typeof zrz_cart_data == 'undefined'){
                localStorage.setItem('zrz_shop_list_'+zrz_script.site_info.site_mark, JSON.stringify(this.list));
            }
        },
        //底部跟随滚动
        handleScroll:function() {
            if(this.step > 1) return;
            var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop,
                offsetTop = this.$refs.postFooter.offsetTop,
                clientHeight = document.documentElement.clientHeight;
            if ((scrollTop+ clientHeight) <= offsetTop) {
                this.footerBarFixed = true
            } else {
                this.footerBarFixed = false
            }
        },
        deleteIndex:function(key){
            var r = confirm('确定要删除这个订单吗？');
            if (r == false) return;
            Vue.delete( this.list, key );
            headTop.shopCount = Object.keys(this.list).length;
            if(typeof zrz_cart_data == 'undefined'){
                localStorage.setItem('zrz_shop_list_'+zrz_script.site_info.site_mark, JSON.stringify(this.list));
            }
        },
        totalPriceC:function(){
            var that = this;
            this.totalPrice = 0;
            this.totalCoin = 0;
            Object.keys(this.list).forEach(function(key){
                if(that.list[key].picked == 1){
                    if(that.list[key].type == 'g'){
                        that.totalPrice += that.list[key].price * that.list[key].count;
                    }else{
                        that.totalCoin += that.list[key].price * that.list[key].count;
                    }
                }
            })
            that.totalPrice = that.totalPrice == 0 ? 0 : changeTwoDecimal_f(that.totalPrice);
        },
        //确认订单
        confirmOrder:function(){
            if(!this.totalPrice && !this.totalCoin) return;
            this.step = 2;
        },
        back:function(){
            if(this.payLocked == true) return;
            this.step--;
        },
        //积分支付
        coinPay:function(){
            if(this.payLocked == true) return;
            this.payLocked = true;
            var that = this;
            var data = [];
            Object.keys(this.list).forEach(function(key){
                if(that.list[key].type == 'd' && that.list[key].picked == 1){
                    data.push({'postid':key,'count':that.list[key].count});
                }
            })
            var data = {
                'data':data,
                'orderContent':this.orderContent
            };
            axios.post(zrz_script.ajax_url+'zrz_shop_exchange_buy',Qs.stringify(data)).then(function(resout){

                if(resout.data.status == 200){
                    var msg = resout.data.msg;
                    msg.forEach(function(item){
                        if(that.list['p'+item.postid].type == 'd' && item.status == 200){
                            that.list['p'+item.postid].buyed = 1;
                            that.list['p'+item.postid].msg = item.msg;
                        }else{
                            that.list['p'+item.postid].buyed = 0;
                            that.list['p'+item.postid].msg = item.msg;
                        }
                        that.list['p'+item.postid].payed = 'd';
                    })

                    Object.keys(that.list).forEach(function(key){
                        if(that.list[key].type == 'd' && that.list[key].payed == 'd'){
                            if(that.list[key].buyed == 1){
                                that.Dstep3['success'] ++;
                            }else{
                                that.Dstep3['fail'] ++;
                            }
                        }
                    })
                    if(typeof zrz_cart_data == 'undefined'){
                        localStorage.setItem('zrz_shop_list_'+zrz_script.site_info.site_mark, JSON.stringify(that.list));
                    }
                }
            })
        },
        //余额支付
        pay:function(){
            var that = this;
            Object.keys(this.list).forEach(function(key){
                if(that.list[key].type == 'g' && that.list[key].picked == 1){
                    that.postIDs.push({'pid':key,'count':that.list[key].count});
                }
            })

            var content = this.orderContent;

            if(this.fapiao.open == 1 || this.fapiao.open == 2){
              content = '【'+(this.fapiao.open == 0 ? '不开发票' : (this.fapiao.open == 1 ? '开专票' : '开普票'))+'】\n'+ this.fapiao.gongsi + '/' + this.fapiao.shibiehao + '/' + this.fapiao.dizhi + '/' + this.fapiao.dianhua + '/' + this.fapiao.yinhang + '/' + this.fapiao.zhanghao + '\n' + content;
            }

            this.data = {
                'data':this.postIDs,
                'orderContent':content
            }
            this.show = true;
        },
        closeForm:function(){
            this.show = false;
            this.data = [];
            this.postIDs = [];
        }
    }
})
