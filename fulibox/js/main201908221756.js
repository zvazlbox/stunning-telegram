//登陆注册组件
Vue.component('sign-form', {
    props: ['showForm','signup','signin','security'],
    template: '<div :class="[\'sign-form\',\'dialog\',show ? \'dialog--open\' : \'\']" ref="singBox">\
		<div class="dialog__overlay" @click="closeForm()"></div>\
		<div class="dialog__content">\
            <button class="pos-a form-close text" @click="closeForm()"><i class="iconfont zrz-icon-font-icon-x"></i></button>\
            <div class="form-title pd10">\
                <h2>\
                    <img class="sign-header" :src="logo"/>\
                </h2>\
            </div>\
            <div class="sign-form-pd pos-r">\
                <form @submit.stop.prevent="signSubmit" class="sign-form-input">\
                    <div class="bor-out">\
                        <div v-show="rePass == 0">\
                            <label v-show="type != 1 && type != 5">\
                                <span class="tip-icon"><i class="iconfont zrz-icon-font-denglu"></i></span><input name="nickname" type="text" autocorrect="off" autocapitalize="off" autocomplete="off" spellcheck="false" tabindex="1" class="username" v-model="data.name" placeholder="昵称">\
                                <span class="sign-des" v-if="type != 1">支持中文，英文</span>\
                            </label>\
                            <p class="fs12 mar10-b" v-if="type == 5">验证码将会发送至你的注册邮箱或手机</p>\
                            <label>\
                                <span class="tip-icon"><i :class="\'iconfont \' +(loginType == 1 || loginType == 4 ? \'zrz-icon-font-message1\' : \'zrz-icon-font-msnui-tel\')"></i></span><input type="text" autocorrect="off" autocapitalize="off" autocomplete="off" spellcheck="false" tabindex="2" class="phone-email" name="username" v-model="data.phoneEmail" :placeholder="loginType == 1 ? \'邮箱\' : (loginType == 2 ? \'手机\' : (loginType == 3 ? \'手机/邮箱\' : \'邮箱\'))">\
                                <span class="sign-des" v-if="type != 1 && type != 5">用作登录</span>\
                            </label>\
                            <label v-show="data.phoneEmail && type != 1 && (loginType != 4 || type == 5)">\
                                <span class="tip-icon"><i class="iconfont zrz-icon-font-ecurityCode"></i></span><input type="text" name="code" tabindex="3" class="code" autocorrect="off" autocapitalize="off" autocomplete="off" spellcheck="false" v-model="data.code" placeholder="验证码">\
                                <span :class="[\'send-code\',\'button\',{\'disabled\':sendCodeLocked}]" @click.stop.prevent="sendCode">{{sendCodeLocked ? nub+\'秒后可\'+sendText : sendText}}</span>\
                            </label>\
                            <label v-show="type != 5">\
                                <span class="tip-icon"><i class="iconfont zrz-icon-font-suo-copy"></i></span><input type="password" name="password" autocorrect="off" autocapitalize="off" autocomplete="off" spellcheck="false" tabindex="5" class="pass" v-model="data.pass" placeholder="密码">\
                                <span class="sign-des" v-if="type != 1">6位以上</span>\
                            </label>\
                            <label v-show="((loginType == 4 && type == 2) || (type == 1 && openCheckCode == 1)) && type != 5" class="checkcode-div">\
                                <div class="fd mouh pos-r" @click="changeCheckCode()"><span v-if="checkCodeImg" class="bg-img" :style="\'background-image:url(\'+checkCodeImg+\')\'"></span><span class="fs12 gray" v-else>点击获取验证码</span></div><input type="text" autocorrect="off" autocapitalize="off" autocomplete="off" spellcheck="false" name="checkcode" tabindex="5" class="checkcode fd" v-model="data.checkcode" placeholder="验证码">\
                            </label>\
                            <label v-show="invitation != 0 && (type == 2 || type == 3)" class="inv-k">\
                                <span class="tip-icon"><i class="iconfont zrz-icon-font-yaoqingma"></i></span><input type="text" name="code" autocorrect="off" autocapitalize="off" autocomplete="off" spellcheck="false" tabindex="6" class="code" v-model="data.invCode" :placeholder="\'邀请码\'+(invitationMust == 1 ? \'（必填）\' : \'（选填）\')">\
                                </span>\
                                <span class="sign-des" v-html="invitationHtml"></span>\
                            </label>\
                        </div>\
                        <div v-show="rePass == 1">\
                            <label>\
                                <span class="tip-icon"><i class="iconfont zrz-icon-font-suo-copy"></i></span><input type="password" autocorrect="off" autocapitalize="off" autocomplete="off" spellcheck="false" name="password1" tabindex="6" class="pass" v-model="rePassData.pass" placeholder="密码">\
                                <span class="sign-des">6位以上</span>\
                            </label>\
                            <label>\
                                <span class="tip-icon"><i class="iconfont zrz-icon-font-suo"></i></span><input type="password" autocorrect="off" autocapitalize="off" autocomplete="off" spellcheck="false" name="password2" tabindex="7" class="pass" v-model="rePassData.repass" placeholder="重复密码">\
                                <span class="sign-des">6位以上</span>\
                            </label>\
                        </div>\
                    </div>\
                    <div class="t-c mar20-t">\
                        <button :class="[\'submit\',\'w100\',{\'disabled\':submitLocked}]" type="submit"><b :class="{\'loading\':submitLocked}"></b><span v-text="signTexts"></span></button>\
                        <div class="submit-error mar10-t mouh" @click="submitError = \'\'" v-if="submitError">\
                            <span v-text="\'错误：\'+submitError" class="fs12"></span>\
                        </div>\
                    </div>\
                    <div class="sign-info mar20-t clearfix fs12" v-if="type != 4">\
                        <div class="fl">忘记密码？<span @click="type = 5">找回</span></div>\
                        <div class="fr" v-if="canReg == 1">{{type == 1 ? \'没有帐号？\' :  \'已有帐号？\'}}<span @click="type == 1 ? type = 2 : type = 1">{{type == 1 ? \'注册\' :  \'登录\'}}</span></div>\
                    </div>\
                </form>\
            </div>\
            <div class="open-sign pd20" v-if="type != 4 && (open.qq == 1 || open.weibo == 1 || (open.weixin == 1 && !isMobile) || (open.weixin_m == 1 && isWeixin))">\
                <p class="fs12 gray pos-r"><span>社交帐号直接登录</span></p>\
                <div class="form-open mar20-t">\
                    <button class="qq-ico empty" @click="openWin(open.qqUrl,\'qq\')" v-if="open.qq == 1"><i class="iconfont zrz-icon-font-QQ1"></i> QQ登录</button>\
                    <button class="weibo-ico empty" @click="openWin(open.weiboUrl,\'weibo\')"  v-if="open.weibo == 1 && !isWeixin"><i class="iconfont zrz-icon-font-weibo"></i> 微博登录</button>\
                    <button class="weixin-ico empty" @click="openWin(open.weixinUrl,\'weixin\')"  v-if="(open.weixin == 1 && !isMobile) || (open.weixin_m == 1 && isWeixin)"><i class="iconfont zrz-icon-font-icon-"></i> 微信登录</button>\
                </div>\
            </div>\
            <div class="h20" v-else></div>\
        </div>\
    </div>',
    data:function(){
        return {
            show:false,
            signTexts:'',
            title:'',
            plaText:'',
            siteInfo:zrz_script.site_info,
            type:0,
            data:{
                'name':'',
                'pass':'',
                'phoneEmail':'',
                'code':'',
                'checkcode':'',
                'invCode':''

            },
            //强制完善资料
            complete:{
                'open':zrz_script.complete.open,
                'email':zrz_script.complete.has_mail,
                'name':zrz_script.complete.name,
                'avatar':zrz_script.complete.avatar
            },
            reg:zrz_script.reg,
            open:{
                'qqUrl':zrz_script.social.qq_url,
                'weiboUrl':zrz_script.social.weibo_url,
                'openWindow':zrz_script.social.open_window,
                'qq':zrz_script.social.qq,
                'weibo':zrz_script.social.weibo,
                'weixin':zrz_script.social.weixin,
                'weixin_m':zrz_script.social.weixin_m,
                'weixinUrl':zrz_script.social.weixin_url
            },
            //发送验证码
            canReg:zrz_script.can_reg,
            sendCodeLocked:false,
            codeCheck:false,
            sendText:'发送验证码',
            nub:60,
            submitLocked:false,
            submitError:'',
            //修改密码
            rePass:1,
            rePassData:{
                'pass':'',
                'repass':'',
                'code':'',
            },
            loginType:zrz_script.login_type,
            isWeixin:true,
            isMobile:zrz_script.is_mobile,
            //是否使用邀请码
            invitation:zrz_script.has_invitation,
            invitationMust:zrz_script.invitation_must,
            invitationText:zrz_script.invitation_text,
            invitationHtml:'',
            checkCodeImg:'',
            openCheckCode:zrz_script.open_check_code,
            logo:''
        }
    },
    mounted:function(){
        if(this.complete.open == 1 && this.complete.email == 0){
            this.data.name = this.complete.name;
            this.type = 4;
            this.show = true;
        }
        if(this.reg){
            this.type = 3;
            this.show = true;
        }
        var ua = navigator.userAgent.toLowerCase();
        if(ua.match(/MicroMessenger/i)=="micromessenger") {
            this.isWeixin = true;
            //this.openWin(this.open.weixinUrl,'weixin');
        } else {
            this.isWeixin = false;
        }
        if(document.querySelectorAll('.logo').length > 0){
            this.logo = document.querySelectorAll('.logo')[0].src
        }
        this.invitationHtml = '<a target="_blank" href="'+this.invitationText.link+'">'+this.invitationText.text+'</a>';
    },
    methods:{
        changeCheckCode:function(){
            this.checkCodeImg = zrz_script.theme_url+'/inc/recaptcha.php?time='+((new Date()).getTime());
        },
        signSubmit:function(){
            if(this.submitLocked == true) return;
            this.submitLocked = true;
            var that = this,
                ac = '',data;
            if(this.type == 1){
                ac = 'zrz_ajax_login';
            }
            if(this.type == 2 || this.type == 3){
                ac = 'zrz_ajax_register';
            }
            if(this.type == 4){
                ac = 'zrz_complete_user_data';
            }
            if(this.type == 5){
                ac = 'lost_password';
            }
            data = this.data;
            if(this.rePass == 1){
                ac = 're_password';
                data = this.rePassData;
            }
            axios.post(zrz_script.ajax_url+ac,Qs.stringify(data)+'&security='+this.security).then(function(resout){
                console.log(resout);
                if(resout.data.status == 200){
                    if(that.type == 1 || that.type == 2){
                        that.signTexts = '成功，刷新中...';
                    }
                    if(that.type != 5){
                        window.location.href = location.href+'?time='+((new Date()).getTime());
                    }
                    if(that.rePass == 1){
                        that.rePass == 2;
                        that.signTexts = '修改成功，跳转到登录中...';
                        that.submitLocked = false;
                        setTimeout(function () {
                            that.type = 1;
                        }, 1500);
                    }
                    if(that.type == 5 && that.rePass == 0){
                        that.rePass = 1;
                        that.rePassData.code = that.data.code;
                        that.signTexts = '提交新密码';
                        that.submitLocked = false;
                    }
                }else{
                    that.submitError = resout.data.msg;
                    that.changeCheckCode();
                }
                if(that.rePass != 1){
                    that.submitLocked = false;
                }
            })
        },
        closeForm:function(){
            this.show = false;
            this.$emit('close-form');
        },
        openWin:function(url,name){
            if(this.open.openWindow){
                var iTop = (window.screen.availHeight - 30 - 500) / 2;
                var iLeft = (window.screen.availWidth - 10 - 500) / 2;
                window.open(url, name, 'height=' + 500 + ',innerHeight=' + 500 + ',width=' + 500 + ',innerWidth=' + 500 + ',top=' + iTop + ',left=' + iLeft + ',status=no,toolbar=no,menubar=no,location=no,resizable=no,scrollbars=0,titlebar=no');
            }else{
                window.location.href = url;
            }
        },
        sendCode:function(){
            if(this.sendCodeLocked == true) return;
            this.sendCodeLocked = true;
            this.nub = 60;
            this.sendText = '重新发送';
            var that = this,type = 're';
            if(that.type == 5){
                type = 'pa';
            }
            axios.post(zrz_script.ajax_url+'zrz_send_code','ep='+this.data.phoneEmail+'&security='+this.security+'&type='+type).then(function(resout){
                console.log(resout);
                if(resout.data.status == 200){
                    that.nubAc();
                }else{
                    that.sendCodeLocked = false;
                    that.sendText = resout.data.msg+'，请重试';
                }
            });
        },
        nubAc:function(){
            var that = this;
            setTimeout(function () {
                that.nub --;
                if(that.nub == 0){
                    that.sendCodeLocked = false;
                }else{
                    that.nubAc();
                }
            }, 1000);
        }
    },
    watch: {
        showForm:function(val) {
            this.show = val;
        },
        signup:function(){
            this.type = 2;
        },
        signin:function(){
            this.type = 1;
        },
        type:function(val){
            //登录
            if(val == 1){
                this.signTexts = '立刻登录';
                this.title = '登录';
                this.rePass = 0;
                //注册
            }else if(val == 2 && this.canReg == 1){
                this.signTexts = '提交注册';
                this.title = '注册';
                this.rePass = 0;
                //邀请注册
            }else if(val == 3){
                this.signTexts = '注册';
                this.title = '收到 '+this.reg+' 的注册邀请';
                this.rePass = 0;
                //强制完善资料
            }else if(val == 4){
                this.signTexts = '立刻进入';
                this.title = '完善资料，开启探索吧！';
                this.rePass = 0;
                //找回密码
            }else if(val == 5){
                this.signTexts = '下一步';
                this.title = '找回密码';
            }
            this.sendText = '发送验证码';
            this.submitError = '';
        }
    }
})

//支付组件
Vue.component('payment', {
    props: ['show','typeText','type','price','data'],
    template:'<div :class="[\'dialog\', \'pay-form\',{\'dialog--open\':show}]"  v-cloak>\
		<div class="dialog__overlay"></div>\
		<div class="dialog__content">\
			<div class="pay-title pd10 pos-r clearfix b-b">\
				<div class="fl"><span v-html="userData.avatar"></span><span v-text="userData.name"></span></div>\
				<div class="fr"><span v-html="typeText"></span></div>\
				<span class="pos-a close mouh" @click.stop="closeForm"><i class="iconfont zrz-icon-font-icon-x"></i></span>\
			</div>\
            <template v-if="step == 1">\
                <template v-if="type == \'tx\'">\
                    <div class="pd10 bg-blue-light gray">本站将会扣除{{cc*100+\'%\'}}的服务费{{txPrice != 0 ? \'，实际到账\'+cprice+\'元\' : \'\'}}</div>\
                    <div class="mar20-t mar10-b pd20-t exchange-credit">\
                        <p>最小提现金额{{tx}}元</p>\
                        <div class="tx-form mar10-t"><input type="text" placeholder="请输入提现金额" v-model="txPrice" class="pd10" onkeypress="validate(event)"/></div>\
                    </div>\
                    <div class="mar20-t fs12 red mar20-b" v-if="allowWithdraw == 0">请在个人主页上传收款码，否则无法提现。</div>\
                </template>\
                <template v-else-if="type == \'ds\'">\
                    <div class="ds-form pd10">\
                        <div :class="[\'fd\',{\'picked\':cprice == 2 && !picked}]" @click="cprice = 2;picked = false">\
                            <div><i class="iconfont zrz-icon-font-tang"></i><b>2</b>元</div>\
                        </div><div :class="[\'fd\',{\'picked\':cprice == 5 && !picked}]" @click="cprice = 5;picked = false">\
                            <div><i class="iconfont zrz-icon-font-tang"></i><b>5</b>元</div>\
                        </div><div :class="[\'fd\',{\'picked\':cprice == 10 && !picked}]" @click="cprice = 10;picked = false">\
                            <div><i class="iconfont zrz-icon-font-tang"></i><b>10</b>元</div>\
                        </div><div :class="[\'fd\',{\'picked\':cprice == 20 && !picked}]" @click="cprice = 20;picked = false">\
                            <div><i class="iconfont zrz-icon-font-tang"></i><b>20</b>元</div>\
                        </div><div :class="[\'fd\',{\'picked\':cprice == 50 && !picked}]" @click="cprice = 50;picked = false">\
                            <div><i class="iconfont zrz-icon-font-tang"></i><b>50</b>元</div>\
                        </div><label :class="[\'fd\',\'custom-ds\',\'pos-r\',{\'picked\':picked}]" @click="cprice = 0;picked = true">\
                            <div><span v-if="!picked" class="fs16"><i class="iconfont zrz-icon-font-zidingyi"></i>自定义</span><span v-else><i class="iconfont zrz-icon-font-tang"></i><input type="number" oninput="value = parseInt(Math.min(Math.max(value, 0), 10000), 10)" v-model="cprice"/><p>元</p></span></div>\
                        </label>\
                    </div>\
                    <div class="ds-textarea">\
                        <textarea placeholder="给Ta留言…" class="textarea bor-3" v-model="text"></textarea>\
                    </div>\
                    <div class="pay-price mar10-t" v-html="\'<sup>¥</sup>\'+cprice"></div>\
                </template>\
                <template v-else-if="type == \'cz\'">\
                    <div class="cz-input mar20-t mar10-b pd20-t t-c">\
                        <div class="kmcz" v-if="(payType == \'km\' && (payOpen.weixin || payOpen.alipay) && payOpen.card == 1) || (!payOpen.weixin && !payOpen.alipay)">\
                            <p class="fs13">充值的卡号和密码：</p>\
                            <input class="mar10-t" type="text" v-model="kmpay.key" placeholder="卡号">\
                            <input class="mar10-t" type="text" v-model="kmpay.value" placeholder="密码">\
                            <div class="mar20-t fs13 kmcz-info" v-html="cardHtml"></div>\
                        </div>\
                        <template v-else>\
                            <p class="fs13">请输入充值金额：</p>\
                            <input class="mar10-t" type="number" v-model="cprice" placeholder="请输入充值金额" oninput="value = parseInt(Math.min(Math.max(value, 0), 10000), 10)">\
                        </template>\
                    </div>\
                </template>\
                <template v-else-if="type == \'gm\'">\
                    <div class="pd10 bg-blue-light gray" v-if="cprice == 0"><span>1元</span>人民币可购买<span>{{changeCredit+name}}</span></div>\
                    <div class="pd10 bg-blue-light gray" v-else><span>{{cprice}}元</span>人民币可购买<span>{{changeCredit*cprice}}{{name}}</span></div>\
                    <div class="exchange-credit mar20-t pd20-t mar20-b">\
                        <p class="mar20-b"><input class="t-c" type="number" v-model="cprice" :oninput="cprice = parseInt(Math.min(Math.max(cprice, 0), payType == \'balance\' ? balance : 100000), 10)"></p>\
                        <div v-html="credit(cprice*changeCredit)"></div>\
                    </div>\
                </template>\
                <template v-else>\
    				<div class="mar20-t mar10-b pd20-t">\
    					<div>付款金额</div>\
    					<div class="pay-price mar10-t" v-html="\'<sup>¥</sup>\'+cprice"></div>\
    				</div>\
                </template>\
				<div class="fs12 gray pay-balance">您的当前余额：<span v-text="\'¥\'+balance"></span></div>\
				<div class="pay-chose mar20-t pd10-t" v-if="type != \'tx\'">\
					<label v-if="payOpen.weixin" :class="[\'fd\',{\'picked\':payType == \'weixin\'},{\'youzan\':payOpen.weixin == \'youzan\'}]">\
                        <span v-if="payOpen.weixin == \'youzan\'"><input type="radio" value="weixin" v-model="payType" class="hide"><i class="iconfont zrz-icon-font-z-balance"></i>微信或支付宝</span>\
						<span v-else><input type="radio" value="weixin" v-model="payType" class="hide"><i class="iconfont zrz-icon-font-iconzhi02"></i>微信支付</span>\
					</label><span class="dot fd"></span><label v-if="payOpen.alipay && !isWeixin" :class="[\'fd\',{\'picked\':payType == \'alipay\'}]">\
						<input type="radio" value="alipay" v-model="payType" class="hide"><i class="iconfont zrz-icon-font-zhifubao"></i>支付宝\
					</label><span class="dot fd" v-if="!isWeixin"></span><label :class="[\'fd\',{\'picked\':payType == \'balance\'},{\'disabled\':twoDecimal(balance) - twoDecimal(cprice) < 0}]" v-if="type != \'cz\'">\
						<input type="radio" :value="twoDecimal(balance) - twoDecimal(cprice) < 0 ? payType : \'balance\'" v-model="payType" class="hide"><i class="iconfont zrz-icon-font-z-balance"></i>余额支付\
					</label><label :class="[\'fd\',{\'picked\':payType == \'km\'}]" v-else-if="payOpen.card == 1">\
                    <input type="radio" value="km" v-model="payType" class="hide"><i class="iconfont zrz-icon-font-qiami"></i>卡密支付</label>\
				</div>\
                <div class="h20" v-show="type == \'tx\'"></div>\
				<div class="mar10-b pd20"><button @click="pay()" :class="[\'w100\',\'pd10\',{\'disabled\':(balanceLocked || (type == \'tx\' && (changeTwoDecimal_f(txPrice) > changeTwoDecimal_f(balance) || txPrice == 0 || allowWithdraw == 0 || changeTwoDecimal_f(this.tx) > changeTwoDecimal_f(this.txPrice))) || (cprice == 0 && type != \'tx\')) && payType != \'km\' }]">\
                <b :class="{\'loading\':balanceLocked}"></b><span v-text="type == \'tx\' ? \'提交申请\' : \'立刻支付\'"></span>\
                </button></div>\
			</template>\
			<template v-if="step == 2">\
				<template v-if="payType == \'alipay\' || (this.payOpen.weixin == \'xunhu\' && this.payType == \'weixin\') || (payType == \'weixin\' && isMobile)">\
					<div class="t-c pay-resout">\
						<button class="empty mar20-r" @click="success()">支付失败</button>\
						<button @click="success()">支付成功</button>\
					</div>\
				</template>\
			</template>\
			<template v-if="step == 3">\
				<div class="pay-success">\
					<template v-if="payUrl.resout">\
						<i class="iconfont zrz-icon-font-sentiment_satisfied  pay-font green"></i>\
						<p class="mar10-t mar20-b green"><span v-if="payType == \'tx\'">申请成功</span><span v-else>恭喜，支付成功</span></p>\
						<button @click="reload(\'success\')" class="empty">确定</button>\
					</template>\
					<template v-else>\
						<i class="iconfont zrz-icon-font-ku pay-font red"></i>\
						<p class="mar10-t mar20-b red"><span v-if="payType == \'tx\' || payType == \'km\'" v-text="errorMsg"></span><span v-else>支付失败，请重试</span></p>\
						<button @click="reload(\'fail\')" class="empty">确定</button>\
					</template>\
				</div>\
			</template>\
			<template v-if="step == 4">\
				<div class="pay-scan pd20">\
					<div class="scan-img pd5 pos-r"><div class="lm" v-if="!scan.qrCode"><span class="loading"></span></div><img :src="\'/wp-content/themes/seven/inc/qrcode/index.php?c=\'+scan.qrCode" v-else/></div>\
					<div class="scan-price mar10-t mar10-b t-c"><span v-text="\'¥\'+cprice"></span></div>\
                    <div class="" v-if="payOpen.weixin == \'youzan\'">请使用<b>微信</b>或者<b>支付宝</b>扫一扫支付</div>\
                    <div class="scan-tips pd10" v-else-if="payType == \'alipay\' && zrz_script.dangmian == 1">请使用<b>支付宝</b>扫一扫支付</div>\
                    <div class="scan-tips pd10" v-else>请使用<b>微信</b>扫一扫支付</div>\
                    <div class="scan-tips pd10" v-if="payType == \'alipay\' && zrz_script.dangmian == 1 && zrz_script.is_mobile"><a class="button" :href="scan.qrCode" target="_blank">立即启动支付宝APP支付</a></div><div v-else></div>\
				</div>\
			</template>\
			<template v-if="step == 5">\
				<div class="pd20">\
					<div class="pd5 pos-r"><i class="iconfont zrz-icon-font-iconzhi02"></i>微信支付</div>\
					<div class="mar20-t mar20-b t-c wxwap-price"><span v-text="\'¥\'+cprice"></span></div>\
					<div class="pd10"><a :href="payUrl.url" class="button" target="_blank" @click="mobileChick()">前往支付</a></div>\
				</div>\
			</template>\
		</div>\
	</div>',
    data:function(){
        return{
            //金额
            cprice:0,
            //当前用户资料
            userData:{
                'id':zrz_script.current_user,
                'avatar':zrz_script.current_user_data.avatar,
                'name':zrz_script.current_user_data.name
            },
            //当前用户余额
            balance:zrz_script.balance,
            //支付方式
            payOpen:{
                weixin:zrz_script.pay_setting.weixin,
                alipay:zrz_script.pay_setting.alipay,
                card:zrz_script.pay_setting.card,
            },
            //选择的支付方式
            payType:'',
            //支付步骤
            step:1,
            //扫码支付
            scan:{
                'locked':false,
                'qrCode':'',
                'resout':false
            },
            //跳转支付
            payUrl:{
                'url':'',
                'resout':false
            },
            //是否是移动端
            isMobile:zrz_script.is_mobile,
            //支付动作
            ac:'',
            //扫码轮询
            ajaxI:0,
            //余额支付
            balanceLocked:false,
            //卡密支付
            kmpay:{
                'key':'',
                'value':''
            },
            cardHtml:zrz_script.card_html,
            //打赏
            picked:false,
            text:'',
            //积分兑换
            changeCredit:0,
            name:'',
            //提现
            txPrice:'',//输入金额
            txAllowed:'',//是否允许提现
            cc:0,//抽成比例
            tx:'',//允许抽成的最小金额
            allowWithdraw:1,
            errorMsg:'',
            //是否是微信内
            isWeixin:true,
            currentUrl:zrz_script.current_url
        }
    },
    mounted:function(){
        this.payType = this.payOpen.weixin ? 'weixin' : (this.payOpen.alipay ? 'alipay' : 'balance');
        if(typeof zrz_gold != 'undefined'){
            this.changeCredit = zrz_gold.change_credit;
            this.name = zrz_gold.name;
            this.txAllowed = zrz_gold.tx_allowed;
            this.cc = zrz_gold.cc;
            this.tx = zrz_gold.tx;
            this.allowWithdraw = zrz_gold.allow_withdraw;
        }
        var ua = navigator.userAgent.toLowerCase();
        if(ua.match(/MicroMessenger/i)=="micromessenger") {
            this.isWeixin = true;
            //this.openWin(this.open.weixinUrl,'weixin');
        } else {
            this.isWeixin = false;
        }
    },
    methods:{
        pay:function(){
            var that = this;
            if(this.payType != 'km' && ((this.type == 'tx' && (changeTwoDecimal_f(this.txPrice) > changeTwoDecimal_f(this.balance) || this.txPrice == 0 || this.allowWithdraw == 0 || changeTwoDecimal_f(this.tx) > changeTwoDecimal_f(this.txPrice))) || (this.cprice == 0 && this.type != 'tx'))) return;
            //跳转支付，包括支付宝，迅虎
            if((this.payType == 'alipay' && zrz_script.dangmian != 1) || (this.payOpen.weixin == 'xunhu' && this.payType == 'weixin')){
                var hash = 'data='+this.data;
                if(this.type == 'cz' || this.type == 'gm'){
                    hash = 'data='+this.cprice;
                }else if(this.type == 'shop'){
                    this.data = Qs.stringify(this.data);
                    hash = this.data;
                }else if(this.type == 'ds'){
                    var data = {
                        'data':{
                            'price':this.cprice,
                            'post_id':zrz_single.post_id,
                            'text':this.text
                        }
                    };
                    hash = Qs.stringify(data);
                }else if(this.type == 'activity'){
                    var data = {
                        'data':{
                            'price':this.cprice,
                            'post_id':activity_single.post_id,
                            'name':this.data.name,
                            'number':this.data.number,
                            'sex':this.data.sex,
                            'more':this.data.more
                        }
                    };
                    hash = Qs.stringify(data);
                }
                this.payUrl.url = zrz_script.site_info.home_url+'/pay?'+hash+'&pay_type='+this.payType+'&type='+this.type;
                window.open(that.payUrl.url);
                that.step = 2;
                //扫码支付，包括微信，PAYJS
            }else if(this.payType == 'weixin' || (this.payType == 'alipay' && zrz_script.dangmian == 1)){
                //如果是PC端微信支付
                // if(!this.isMobile || (this.payOpen.weixin == 'payjs' && !this.isWeixin) || this.payOpen.weixin == 'youzan' || (this.payType == 'alipay' && zrz_script.dangmian == 1)){
                if((this.payOpen.weixin == 'payjs' && !this.isWeixin) || this.payOpen.weixin == 'youzan' || (this.payType == 'alipay' && zrz_script.dangmian == 1)){
                    this.step = 4;
                }
                var hash = '';
                if(this.type == 'vip'){
                    this.ac = 'zrz_weixin_vip_pay';
                    hash = 'lv='+this.data;
                }else if(this.type == 'post'){
                    this.ac = 'zrz_weixin_post_pay';
                    hash = 'post_id='+this.data;
                }else if(this.type == 'cz'){
                    this.ac = 'zrz_weixin_cz_pay';
                    hash = 'price='+this.cprice;
                }else if(this.type == 'gm'){
                    this.ac = 'zrz_weixin_credit_pay';
                    hash = 'rmb='+this.cprice;
                }else if(this.type == 'shop'){
                    this.ac = 'zrz_weixin_sp_pay';
                    hash = Qs.stringify(this.data);
                }else if(this.type == 'ds'){
                    this.ac = 'zrz_weixin_ds_pay';
                    var data = {
                        'data':{
                            'price':this.cprice,
                            'post_id':zrz_single.post_id,
                            'text':this.text
                        }
                    };
                    hash = Qs.stringify(data);
                }else if(this.type == 'activity'){
                    this.ac = 'zrz_weixin_activity_pay';
                    var data = {
                        'data':{
                            'price':this.cprice,
                            'post_id':activity_single.post_id,
                            'name':this.data.name,
                            'number':this.data.number,
                            'sex':this.data.sex,
                            'more':this.data.more
                        }
                    };
                    hash = Qs.stringify(data);
                }
                var current = this.currentUrl;
                if(this.payType == 'alipay' && zrz_script.dangmian == 1){
                    current = 'alipayscan';
                }

                hash = hash + '&current_url='+current+'&type='+this.type;
                axios.post(zrz_script.ajax_url+this.ac,hash).then(function(resout){
                    console.log(resout);
                    if(resout.data.status == 200){
                        // if(that.isMobile && that.payOpen.weixin != 'youzan'){
                        if(false && that.payOpen.weixin != 'youzan'){
                            if(that.isWeixin){
                                console.log(222);
                                if(that.payOpen.weixin == 'payjs'){
                                    console.log(111);
                                    var form = document.createElement("form");
                                    form.action = resout.data.msg;
                                    form.method = 'post';
                                    document.body.appendChild(form);
                                    form.submit();
                                }else{
                                    jsApiCall(resout.data.msg);
                                    that.step = 2;
                                }
                            }else{
                                that.payUrl.url = resout.data.msg;
                                that.step = 5;
                            }
                        }else{
                            that.scan.qrCode = resout.data.msg;
                            that.ajaxI = 0;
                            that.success();
                        }
                    }
                })
                //使用余额支付
            }else if(this.payType == 'balance'){
                if(changeTwoDecimal_f(this.balance) - changeTwoDecimal_f(this.cprice) < 0) return;
                if(this.balanceLocked == true) return;
                this.balanceLocked = true;
                var hash = '';
                if(this.type == 'vip'){
                    this.ac = 'zrz_buy_vip_by_balance';
                    hash = 'lv='+this.data;
                }else if(this.type == 'post'){
                    this.ac = 'zrz_post_pay_with_balance';
                    hash = 'pid='+this.data;
                }else if(this.type == 'gm'){
                    this.ac = 'zrz_rmb_to_credit';
                    hash = 'rmb='+this.cprice;
                }else if(this.type == 'shop'){
                    this.ac = 'zrz_pay_with_balance';
                    hash = Qs.stringify(this.data);
                }else if(this.type == 'ds'){
                    this.ac = 'zrz_ds_with_balance';
                    var data = {
                        'data':{
                            'price':this.cprice,
                            'post_id':zrz_single.post_id,
                            'text':this.text
                        }
                    };
                    hash = Qs.stringify(data);
                }else if(this.type == 'activity'){
                    this.ac = 'zrz_activity_with_balance';
                    var data = {
                        'data':{
                            'price':this.cprice,
                            'post_id':activity_single.post_id,
                            'name':this.data.name,
                            'number':this.data.number,
                            'sex':this.data.sex,
                            'more':this.data.more
                        }
                    };
                    hash = Qs.stringify(data);
                }
                axios.post(zrz_script.ajax_url+this.ac,hash).then(function(resout){
                    console.log(resout);
                    if(resout.data.status == 200){
                        that.step = 3;
                        that.payUrl.resout = true;
                    }else{
                        that.step = 3;
                        that.payUrl.resout = false;
                    }
                    that.balanceLocked = false;
                })
            }else if(this.payType == 'tx'){
                axios.post(zrz_script.ajax_url+'zrz_tx_application','price='+changeTwoDecimal_f(this.txPrice)+'&cprice='+changeTwoDecimal_f(this.cprice)).then(function(resout){
                    if(resout.data.status == 200){
                        that.step = 3;
                        that.payUrl.resout = true;
                    }else{
                        that.step = 3;
                        that.payUrl.resout = false;
                        that.errorMsg = resout.data.msg;
                    }
                })
            }else if(this.payType == 'km'){
                axios.post(zrz_script.ajax_url+'zrz_km_pay','key='+this.kmpay.key+'&value='+this.kmpay.value).then(function(resout){
                    if(resout.data.status == 200){
                        that.step = 3;
                        that.payUrl.resout = true;
                    }else{
                        that.step = 3;
                        that.payUrl.resout = false;
                        that.errorMsg = resout.data.msg;
                        console.log(that.errorMsg);
                    }
                })
            }
        },
        success:function(){
            var that = this;
            if(this.step == 1) return;

            //如果是扫描，设置轮询
            if(this.ajaxI >= 60 && ((this.payType == 'weixin' && !this.isMobile && this.payOpen.weixin != 'xunhu') || this.payOpen.weixin == 'payjs' || this.payOpen.weixin == 'youzan' || (this.payType == 'alipay' && zrz_script.dangmian == 1))){
                this.step = 3;
                this.payUrl.resout = false;
                return;
            }
            this.ajaxI ++;

            //购买VIP回调检查
            if(this.type == 'vip' || this.type == 'gm'){
                this.ac = 'zrz_cz_pay_check';
            }else if(this.type == 'post' || this.type == 'shop'){
                this.ac = 'zrz_shop_order_check';
            }else if(this.type == 'cz'){
                this.ac = 'zrz_cz_pay_check';
            }else if(this.type == 'ds' || this.type == 'activity'){
                this.ac = 'zrz_ds_check';
            }
            axios.post(zrz_script.ajax_url+this.ac).then(function(resout){
                console.log(resout);
                if(resout.data.status == 200){
                    if(that.type == 'post' || that.type == 'shop'){
                        if(resout.data.payed == 1){
                            that.step = 3;
                            that.payUrl.resout = true;
                        }else if(that.payType == 'weixin' || that.payOpen.weixin == 'payjs' || that.payOpen.weixin == 'youzan' || (that.payType == 'alipay' && zrz_script.dangmian == 1)){
                            setTimeout(function (){
                                that.success();
                            }, 1000);
                        }else{
                            that.step = 3;
                            that.payUrl.resout = false;
                        }
                    }else{
                        that.step = 3;
                        that.payUrl.resout = true;
                    }
                }else{
                    if((that.payType == 'weixin' && !that.isMobile && that.payOpen.weixin != 'xunhu') || that.payOpen.weixin == 'payjs' || that.payOpen.weixin == 'youzan' || (that.payType == 'alipay' && zrz_script.dangmian == 1)){
                        setTimeout(function (){
                            that.success();
                        }, 1000);
                    }else{
                        that.step = 3;
                        that.payUrl.resout = false;
                    }
                }
            })
        },
        mobileChick:function(){
            this.step = 2;
        },
        reload:function(status){
            if(this.type == 'shop'){
                if(status == 'success'){
                    for (var i = 0; i < cart.postIDs.length; i++) {
                        cart.list[cart.postIDs[i].pid].buyed = 1;
                        cart.list[cart.postIDs[i].pid].payed = 'g';
                        cart.list[cart.postIDs[i].pid].msg = '<b class="green mar10-l">购买成功</b>';
                    }
                    if(typeof zrz_cart_data == 'undefined'){
                        localStorage.setItem('zrz_shop_list_'+zrz_script.site_info.site_mark, JSON.stringify(cart.list));
                    }
                }else{
                    for (var i = 0; i < cart.postIDs.length; i++) {
                        cart.list[cart.postIDs[i].pid].buyed = 0;
                        cart.list[cart.postIDs[i].pid].payed = 'g';
                        cart.list[cart.postIDs[i].pid].msg = '<b class="red mar10-l">购买失败</b>';
                    }
                }
                Object.keys(cart.list).forEach(function(key){
                    if(cart.list[key].type == 'g' && cart.list[key].payed == 'g'){
                        if(cart.list[key].buyed == 1){
                            cart.Gstep3['success'] ++;
                        }else{
                            cart.Gstep3['fail'] ++;
                        }
                    }
                })
                this.closeForm();
            }else{
                window.location.href = location.href+'?time='+((new Date()).getTime());
            }
        },
        closeForm:function(){
            this.step = 1;
            this.ac = '';
            this.scan.qrCode = '';
            this.balanceLocked = false;
            this.txPrice = '';
            this.payType = this.payOpen.weixin ? 'weixin' : (this.payOpen.alipay ? 'alipay' : 'balance');
            this.$emit('close-form');
        },
        credit:function(val){
            return zrzStrToCoin(val);
        },
        twoDecimal:function(val){
            return changeTwoDecimal_f(val);
        }
    },
    watch:{
        show:function(val){
            this.show = val;
        },
        type:function(val){
            if(val == 'tx'){
                this.payType = 'tx';
            }
        },
        txPrice:function(val){
            var f = parseFloat(val)*(1 - this.cc);
            this.cprice = changeTwoDecimal_f(f);
        },
        price:function(val){
            this.cprice = val;
        }
    }
})

var payjsCheck = new Vue({
    el:'#payjs-check',
    data:{
        url:'',
        type:'',
        ac:'',
        text:'支付确认中，请稍后...'
    },
    mounted:function(){
        if(typeof payjs_data == "undefined") return;
        this.url = payjs_data.address;
        this.type = payjs_data.type;
        var that = this;
        setTimeout(function (){
            that.getResout();
        }, 1000);

    },
    methods:{
        getResout:function(){
            if(this.type == 'vip' || this.type == 'gm'){
                this.ac = 'zrz_cz_pay_check';
            }else if(this.type == 'post' || this.type == 'shop'){
                this.ac = 'zrz_shop_order_check';
            }else if(this.type == 'cz'){
                this.ac = 'zrz_cz_pay_check';
            }else if(this.type == 'ds' || this.type == 'activity'){
                this.ac = 'zrz_ds_check';
            }
            var that = this;
            axios.post(zrz_script.ajax_url+this.ac).then(function(resout){
                if(resout.data.status == 200){
                    that.text = '<span class="green">支付成功，跳转中..</span>';
                    setTimeout(function (){
                        window.location.href =  that.url;
                    },2000)

                }else{
                    that.text = '<span class="red">支付失败，请联系管理员..</span>';
                }
            })
        }
    }
})

var payform = new Vue({
    el:'#pay-form',
    data:{
        //支付
        data:0,
        price:0,
        show:false
    },
    methods:{
        closeForm:function(){
            this.show = false
        }
    }
})

//加载中组件
Vue.component('loading', {
    props: ['ac','msg'],
    template:'<div class="loading-dom pos-r">\
        <div class="lm"><div class="loading" v-if="!success"></div><div v-else><i class="iconfont zrz-icon-font-wuneirong"></i><p class="mar10-t">{{message}}</p></div></div>\
    </div>',
    data:function(){
        return {
            success:0,
            message:''
        }
    },
    watch: {
        ac:function(val){
            this.success = val;
        },
        msg:function(val){
            this.message = val;
        }
    }
})

//分页组件
var pageNav = Vue.extend({
    props: ['navType','paged','pages','showType','lockedNav'],
    template: '<div v-show="pages > 1" class="zrz-pager clearfix pd10 pos-r">\
        <div v-if="(ajaxPost == 0 && showType == \'p\') || (ajaxComment == 0 && showType == \'c\') || lockedNav == 1">\
            <div class="btn-group fl">\
                <button v-for="page in cpages" :class="[\'empty\',cpaged == page ? \'selected disabled\' : \'\',page == 0 ? \'bordernone\' : \'\']" @click.stop.self="go(page)">{{page != 0 ? page : \'...\'}}<b :class="[locked && cpage == page ? \'loading\' : \'\']"></b></button>\
            </div>\
            <div class="jump-page fl" v-show="pages >= 7"><input type="number" :value="cpaged" @keyup.enter="jump($event)"/></div>\
            <div class="pager-center">{{cpaged}}/{{pages}}</div>\
            <div class="btn-pager fr fs13">\
              <button :class="[\'empty\',cpaged <= 1 ? \'disabled\' : \'\']" @click.stop.self="go(cpaged-1)">❮</button><button :class="[\'empty\',\'navbtr\',cpaged >= pages ? \'disabled\' : \'\']" @click.stop.self="go(cpaged+1)">❯</button>\
            </div>\
        </div>\
        <div class="clearfix ajax-more" v-else>\
            <div class="jump-page fl"><input type="number" :value="cpaged" @keyup.enter="jump($event)"/><button class="text mar10-l" @click="jump($event)">前往</button></div>\
            <button :class="[\'fr\',{\'disabled\':cpaged >= pages || locked}]" @click="go(cpaged+1)"><b :class="{\'loading\': locked}"></b><span v-if="cpaged >= pages">没有更多</span><span v-else>加载更多</span></button>\
        </div>\
    </div>',
    data:function(){
        return {
            locked:false,
            cpage:0,
            cpaged:parseInt(this.paged),
            cpages:this.pagesInit(),
            ajaxPost:zrz_script.ajax_post,
            ajaxComment:zrz_script.ajax_comment,
            loadMoreLocked:false,
            autoLoad:zrz_script.ajax_post_more
        }
    },
    created:function(){
        window.addEventListener('scroll', this.autoLoadMore);
    },
    methods:{
        //计算分页
        pagesInit:function(){
            var pagearr = [];
            if(this.pages <= 7){
                for (var i = 1; i <= this.pages; i++) {
                    pagearr.push(i);
                }
            }else{
                if(!this.cpaged) this.cpaged = this.paged;
                if(this.cpaged < 5){
                    for (var i = 1; i <= this.pages; i++) {
                        if(i >= 6) break;
                        pagearr.push(i);
                    }
                    pagearr.push(0,this.pages);
                }else if(this.cpaged >= 5 && this.pages - 3 > this.cpaged){
                    pagearr.push(1,0);
                    for (var i = this.cpaged - 2; i <= this.cpaged + 2; i++) {
                        pagearr.push(i);
                    }
                    pagearr.push(0,this.pages);
                }else if(this.pages - 3 <= this.cpaged){
                    pagearr.push(1,0);
                    for (var i = this.cpaged - 3; i <= this.pages; i++) {
                        pagearr.push(i);
                    }
                }
            }
            return pagearr;
        },
        autoLoadMore:function(){
            if(this.autoLoad == 0) return;
            if(this.autoLoad != 'auto'){
                if(this.cpaged >= this.autoLoad) return;
            }
            if(this.pages <= 1 || (this.ajaxPost == 0 && this.showType == 'p') || (this.ajaxComment == 0 && this.showType == 'c') || this.lockedNav == 1) return;
            var scrollTop = document.documentElement.scrollTop;
            if(scrollTop + window.innerHeight >= document.body.clientHeight) {
                this.go(this.cpaged+1)
            }
        },
        //分页，点击事件
        go:function(page){
            if(this.locked === true || this.cpaged == page || page < 1 || page > this.pages || page == 0) return;
            this.locked = true;
            this.cpage = page;

            //评论分页
            if(this.navType === 'comment'){
                var data = {
                    'post_id':zrz_single.post_id,
                    'paged':page
                };
                this.getData('zrz_load_more_comments',data);
                //文章列表分页
            }else if(this.navType.indexOf("index") !=-1 || this.navType.indexOf("shop")!=-1 ||
                this.navType.indexOf("sptype")!=-1 || this.navType.indexOf("catL")!=-1 || this.navType.indexOf("collection")!=-1 ||
                this.navType.indexOf("bbp-home") != -1 ||
                this.navType.indexOf("bbp-reply") != -1 || this.navType.indexOf("bubble") != -1 ||
                this.navType.indexOf("user-posts-") != -1 || this.navType.indexOf("user-labs-") != -1 || this.navType.indexOf("tag") !=-1){
                var data = {
                    'type':this.navType,
                    'paged':page
                };
                this.getData('zrz_load_more_posts',data);
                //用户页面订单
            }else if(this.navType === 'userOrder'){
                userOrder.getList(page);
                //通知页面
            }else if(this.navType === 'notifications'){
                message.getList(page);
                //用户动态页面
            }else if(this.navType === 'gold'){
                gold.getList(page);
            }else if(this.navType === 'user-activities'){
                activities.getList(page);
                //用户帖子页面
            }else if(this.navType === 'userTopic'){
                userPageTopic.getList(page,'topic');
                //用户帖子回复页面
            }else if(this.navType === 'userReply'){
                userPageTopic.getList(page,'reply');
            }else if(this.navType === 'dmsg'){
                dmsg.getList(page);
            }else if(this.navType === 'dmsgUser'){
                dmsg.getDList(page);
            }else if(this.navType === 'userFans' || this.navType === 'usrFollow' || this.navType === 'post' || this.navType === 'sp' || this.navType === 'tp' || this.navType === 'mp'){
                followFans.getList(page);
            }else if(this.navType === 'relay'){
                relay.getList(page);
            }
        },
        //获取数据
        getData:function(fn,data){
            var that = this;
            axios.post(zrz_script.ajax_url+fn,Qs.stringify(data)).then(function(resout){
                if(resout.data.status === 200){
                    that.cpaged = data.paged;
                    //如果是评论翻页
                    if(that.navType === 'comment'){

                        //评论框归位
                        if(comments.pid !== 0 && comments.pido === comments.pid){
                            comments.$el.querySelector('#reply'+comments.pid).innerHTML = '回复';
                            comments.$el.querySelector('#respond').appendChild(comments.$el.querySelector('#commentform'));
                            comments.pid = 0;
                            comments.pido = 0;
                        }
                        if(that.ajaxComment == 1){
                            comments.$refs.commentList.insertAdjacentHTML('beforeend', resout.data.msg);
                        }else{
                            //写入获取的评论数据
                            comments.$refs.commentList.innerHTML = resout.data.msg;
                            //滚动到顶部
                            that.$scrollTo(comments.$refs.commentList, 400, {offset: -60});
                        }

                        //timeago初始化
                        comments.timeago();
                        //回复按钮初始化
                        comments.reply();
                        //图片点击初始化
                        comments.imgzoom();

                        //如果是文章翻页
                    }else if(that.navType.indexOf("index")!=-1 || that.navType.indexOf("shop")!=-1 || that.navType.indexOf("sptype")!=-1 || that.navType.indexOf("catL")!=-1 || that.navType.indexOf("collection")!=-1 || that.navType.indexOf("tag") !=-1){
                        if(that.ajaxPost == 1){
                            mainHome.$refs.postList.insertAdjacentHTML('beforeend', resout.data.msg);
                        }else{
                            mainHome.$refs.postList.innerHTML = resout.data.msg;
                            //滚动到顶部
                            that.$scrollTo(mainHome.$refs.postList, 400, {offset: -60});
                        }
                        //重新初始化timeago
                        mainHome.timeago();
                        mainHome.paged = data.paged;
                        //论坛分页
                    }else if(that.navType.indexOf("bbp-home") != -1){
                        if(that.ajaxPost == 1 && that.lockedNav != 1){
                            bbpress.$refs.topicList.insertAdjacentHTML('beforeend', resout.data.msg);
                            setTimeout(function () {
                                new Sticky('#bbs-toolbar');
                            }, 10);
                        }else{
                            bbpress.$refs.topicList.innerHTML = resout.data.msg;
                        }
                        bbpress.listAc('topic',that.lockedNav);
                    }else if(that.navType.indexOf("bbp-reply") != -1){
                        if(that.ajaxPost == 1 && that.lockedNav != 1){
                            bbpress.$refs.replyList.insertAdjacentHTML('beforeend', resout.data.msg);
                            setTimeout(function () {
                                new Sticky('#bbs-toolbar');
                            }, 10);
                        }else{
                            bbpress.$refs.replyList.innerHTML = resout.data.msg;
                        }
                        bbpress.listAc('reply',that.lockedNav);
                    }else if(that.navType.indexOf("bubble") != -1){
                        if(that.ajaxPost == 1){
                            document.querySelector('#bubbleListHome').insertAdjacentHTML('beforeend', resout.data.msg);
                        }else{
                            document.querySelector('#bubbleListHome').innerHTML = resout.data.msg;
                        }
                        bubble.listAc();
                    }else if(that.navType.indexOf("user-posts-") != -1 || that.navType.indexOf("user-labs-") != -1){
                        if(that.ajaxPost == 1){
                            userPosts.$refs.postList.insertAdjacentHTML('beforeend', resout.data.msg);
                        }else{
                            userPosts.$refs.postList.innerHTML = resout.data.msg;
                            that.$scrollTo(userPosts.$refs.postList, 400, {offset: -60});
                        }
                        userPosts.timeAgo();
                        userPosts.delePost();
                        userPosts.setHD();
                    }

                    //分页组件按钮解锁
                    that.locked = false;
                    that.cpages = that.pagesInit();
                }
            })
        },
        //跳转
        jump:function(event){
            var val = event.target.value || event.target.previousElementSibling.value;
            this.go(parseInt(val));
        }
    },
    watch: {
        pages:function(val){
            this.cpages = this.pagesInit();
        },
        paged:function(){
            this.cpaged = parseInt(this.paged);
            this.locked = false;
            this.cpages = this.pagesInit();
        }
    }
})

// 分页组件-首页
var pagePost = Vue.extend({
    name: "PagePost",
    template: `
<div v-show="pages > 1" class="zrz-pager clearfix pd10 pos-r">
    <div>
      <div class="btn-group fl">
        <button
          v-for="page in cpages"
          :class="['empty',cpaged == page ? 'selected disabled' : '',page == 0 ? 'bordernone' : '']"
          @click.stop.self="go(page)"
        >
          {{page != 0 ? page : '...'}}
          <b :class="[locked && cpage == page ? 'loading' : '']"></b>
        </button>
      </div>
      <div class="jump-page fl" v-show="pages >= 7">
        <input type="number" :value="cpaged" @keyup.enter="jump($event)" />
      </div>
      <div class="pager-center">{{cpaged}}/{{pages}}</div>
      <div class="btn-pager fr fs13">
        <button :class="['empty',cpaged <= 1 ? 'disabled' : '']" @click.stop.self="go(cpaged-1)">❮</button>
        <button
          :class="['empty','navbtr',cpaged >= pages ? 'disabled' : '']"
          @click.stop.self="go(cpaged+1)"
        >❯</button>
      </div>
    </div>
  </div>
    `,
    props: ["paged", "pages"],
    data: function () {
        return {
            locked: false,
            cpage: 0,
            cpaged: parseInt(this.paged),
            cpages: this.pagesInit()
        };
    },
    created: function () {
        // window.addEventListener("scroll", this.autoLoadMore);
    },
    methods: {
        //计算分页
        pagesInit: function () {
            var pagearr = [];
            if (this.pages <= 7) {
                for (var i = 1; i <= this.pages; i++) {
                    pagearr.push(i);
                }
            } else {
                if (!this.cpaged) this.cpaged = this.paged;
                if (this.cpaged < 5) {
                    for (var i = 1; i <= this.pages; i++) {
                        if (i >= 6) break;
                        pagearr.push(i);
                    }
                    pagearr.push(0, this.pages);
                } else if (this.cpaged >= 5 && this.pages - 3 > this.cpaged) {
                    pagearr.push(1, 0);
                    for (var i = this.cpaged - 2; i <= this.cpaged + 2; i++) {
                        pagearr.push(i);
                    }
                    pagearr.push(0, this.pages);
                } else if (this.pages - 3 <= this.cpaged) {
                    pagearr.push(1, 0);
                    for (var i = this.cpaged - 3; i <= this.pages; i++) {
                        pagearr.push(i);
                    }
                }
            }
            return pagearr;
        },
        //分页，点击事件
        go: function (page) {
            if (
                this.locked === true ||
                this.cpaged == page ||
                page < 1 ||
                page > this.pages ||
                page == 0
            ) {
                return;
            }
            this.locked = true;
            this.cpage = page;

            window.location.href = "/" + page;
        },
        //跳转
        jump: function (event) {
            var val = event.target.value || event.target.previousElementSibling.value;
            this.go(parseInt(val));
        }
    },
    watch: {}


});

//私信组件
var dmsg = Vue.extend({
    props: ['show','tid','tname','mtype','title'],
    template:'<div id="dmsg-form" :class="[\'dialog\', \'dmsg-form\',{\'dialog--open\':showBox}]" ref="dmsgForm" v-cloak>\
                <div class="dialog__overlay" @click.stop="close"></div>\
                <div class="dialog__content pos-r">\
                    <div class="b-b pd10 box-header b-b t-l clearfix">{{title}}<button class="text fr" @click="close"><i class="iconfont zrz-icon-font-icon-x"></i></button></div>\
                    <div class="no-dmsg pos-r box" v-if="!currentCanMsg">\
                        <div class="pd20 t-c">您没有权限发布私信</div>\
                    </div>\
                    <div class="pd10 t-l" v-else>\
                        <div class="mar10-b pos-r">\
                            <input type="text" class="pd10" placeholder="搜索用户" v-if="uid == 0" v-model="userStr"/>\
                            <div class="msg-picked-name" v-else>给 <span v-html="\'<b>\'+uname+\'</b>\'"></span> {{tType == \'reply\' ? \'回复消息\' : \'发消息\'}}：<span class="mar10-l green mouh" @click="uid = 0;uname = \'\'" v-if="tType != \'author\' && tType != \'admin\'">修改</span></div>\
                            <p class="setting-des" v-if="tType != \'admin\'">请输入对方昵称，从下拉菜单里选择收件人</p>\
                            <ul v-show="users.length > 0" class="pos-a">\
                                <li v-for="user in users" class="pos-r fs12 pd10 b-b mouh" @click="getUserId(user.id,user.name)">\
                                    <span v-html="user.avatar" class="mavatar pos-a"></span>\
                                    <div class="msg-user-info">\
                                        <p v-html="\'<b>\'+user.name+\'</b>\'" class="msg-name mar5-b"></p>\
                                        <p v-text="user.des ? user.des : \'没有描述\'" class="msguser-des gray"></p>\
                                    </div>\
                                </li>\
                            </ul>\
                        </div>\
                        <textarea class="pd10 textarea" id="textarea" placeholder="私信内容" ref="msgContent" @bulr="getContent" @focus="getContent" v-model="msgContent"></textarea>\
                        <div class="clearfix pos-r dmsg-tool">\
                            <span class="fl">\
                                <button class="text" @click.stop.prevent="smiley()"><i class="iconfont zrz-icon-font-sentiment_satisfied"></i>表情</button>\
                            </span>\
                            <div class="fr"><span class="mar10-r fs12" style="padding-top: 17px;display: inline-block;" v-html="sedErrorMsg"></span><button :class="[\'mar10-t\',\'fr\',{\'disabled\':sedLocked}]" @click="sedMsg" ><b :class="{\'loading\':sedLocked}"></b>发送</button></div>\
                            <div :class="[\'smile-box\',\'pos-a\',\'box\',\'pjt\',\'transform-out\',{\'transform-in\':smileShow}]">\
                                <div class="clearfix" v-html="smiles"></div>\
                            </div>\
                        </div>\
                    </div>\
                </div>\
            </div>',
    data:function(){
        return{
            tType:'',
            showBox:false,
            uid:0,
            uname:0,
            //表情
            smileShow:false,
            smiles:'',
            //发布
            sedErrorMsg:'',
            //获取用户
            getUserLocked:false,
            users:[],
            msgContent:'',
            //用户信息
            userStr:'',
            //发消息
            sedLocked:false,
            security:document.querySelector('#security').value,
            currentCanMsg:zrz_script.can_dmsg
        }
    },
    mounted:function(){
        var that = this;
        document.body.onclick = function(){
            that.smileShow = false;
            that.users = [];
        }
        this.$el.querySelectorAll('.dialog__content')[0].onclick = function(){
            that.smileShow = false;
            that.users = [];
        }
        autosize(this.$refs.msgContent);
    },
    methods:{
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
        close:function(){
            if(this.tType != 'author' && this.tType != 'admin'){
                this.sedErrorMsg = '',
                    this.uid = 0;
                this.uname = '';
            }
            this.show = false;
            this.$emit('close-form');
            this.sedErrorMsg ='';
        },
        getUsers:function(str){
            if(this.getUserLocked == true) return;
            this.getUserLocked = true;
            var that = this;
            axios.post(zrz_script.ajax_url+'zrz_user_search','str='+str).then(function(resout){
                if(resout.data.status == 200){
                    that.users = resout.data.msg;
                }
                that.getUserLocked = false;
            })
        },
        getUserId:function(id,name){
            this.uid = id;
            this.uname = name;
            this.users = [];
        },
        getContent:function(){
            this.msgContent = this.$refs.msgContent.value;
        },
        //发送消息
        sedMsg:function(){
            if(this.sedLocked == true) return;
            this.sedLocked = true;
            var that = this;
            axios.post(zrz_script.ajax_url+'zrz_send_msg','to_id='+this.uid+'&content='+this.msgContent+'&security='+this.security).then(function(resout){
                if(resout.data.status == 200){
                    that.sedErrorMsg = '<span class="green">发送成功</span>';
                    if(that.tType != 'author' && that.tType != 'admin'){
                        that.uid = 0;
                        that.uname = '';
                    }
                    that.userStr = '';
                    that.msgContent = '';
                    setTimeout(function () {
                        that.close();
                    }, 500);
                }else{
                    that.sedErrorMsg = '<span class="red">发送失败</span>';
                }
                that.sedLocked = false;
            })
        },
    },
    watch: {
        show:function(val){
            this.showBox = val;
        },
        tid:function(val){
            this.uid = val;
        },
        tname:function(val){
            this.uname = val;
        },
        userStr:function(val){
            if(val.length == 0){
                this.users = [];
                return;
            }
            this.getUsers(val);
        },
        mtype:function(val){
            this.tType = val;
        }
    }

})

//实例化登陆框
var signForm = new Vue({
    el:'#sign-form',
    data:{
        showBox:false,
        signup:false,
        signin:false,
        security:'',
    },
    methods:{
        closeForm:function(){
            this.showBox = false;
            this.signup = false;
            this.signin = false;
        }
    },
    mounted:function(){
        if(this.$refs.security){
            this.security = this.$refs.security.value;
        }
    },
})

//页面顶部
var headTop = new Vue({
    el:'#masthead',
    data:{
        value:'',
        width:false,
        linksShow:true,
        isMobile:zrz_script.is_mobile,
        showMenu:false,
        shopCount:0,
        msgCount:0,
        canReg:zrz_script.can_reg,
        marqueeList:[],
        animate:false,
        animateStop:false,
        announcementCount:zrz_script.announcement,
        showTable:zrz_script.show_search_tab,
        action:zrz_script.site_info.home_url,
        key:'',
        type:'post',
        NotificationId:0,
        currentN:JSON.parse(localStorage.getItem('zrz_Notification'))
    },
    mounted:function(){
        var that = this;
        document.onclick = function(){
            that.showMenu = false;
        }
        if(zrz_script.is_login == 1){
            if(localStorage.getItem('zrz_shop_list_'+zrz_script.site_info.site_mark)){

                var cart = JSON.parse(localStorage.getItem('zrz_shop_list_'+zrz_script.site_info.site_mark));
                //清除已经付款的订单
                if(cart){
                    Object.keys(cart).forEach(function(key){
                        if(cart[key].payed == 'd'){
                            Vue.delete(cart, key );
                        }else if(cart[key].payed == 'g'){
                            Vue.delete(cart, key );
                        }
                    })
                }
                localStorage.setItem('zrz_shop_list_'+zrz_script.site_info.site_mark, JSON.stringify(cart));
                this.shopCount = Object.keys(cart).length;
            }
            axios.get(zrz_script.ajax_url+'zrz_get_new_msg_count').then(function(resout){
                that.msgCount = resout.data.count;
                userPanel.missionNub = resout.data.mission;
                homeMission.missionNub = resout.data.mission;
                console.log(userPanel.missionNub);
            })
        }

        if ("Notification" in window && zrz_script.show_gg != 0) {
            Notification.requestPermission(function(){});
        }

        //获得公告
        if(zrz_script.announcement > 0){
            axios.post(zrz_script.ajax_url+'zrz_get_announcement').then(function(resout){

                if(resout.data.status == 200){
                    that.marqueeList = resout.data.msg;
                    if(!that.currentN || (that.currentN && that.currentN.id != resout.data.msgArr.id)){
                        localStorage.setItem('zrz_Notification', JSON.stringify(resout.data.msgArr));
                        that.currentN = resout.data.msgArr;
                        that.Html5Notification();
                    }
                }
            })
        }
        new Sticky('.site-branding-parent,.user-order-header,.link-cat-list,#bbs-toolbar');
    },
    created: function () {
        setInterval(this.showMarquee, 2000);
    },
    methods:{
        //html5 通知
        Html5Notification:function(){
            if (!("Notification" in window) || zrz_script.show_gg == 0) return;
            var n = new Notification(this.currentN.title,{
                body: this.currentN.des,
                icon:this.currentN.thumb,
                tag:this.currentN.id,
                data: {
                    url:this.currentN.link
                },
                requireInteraction : false
            })
            n.onclick = function(){
                window.open(n.data.url, '_blank');      // 打开网址
                n.close();                              // 并且关闭通知
            }
        },
        showSearchBox:function(){
            goTop.showSearchBox('search');
        },
        showTopMenu:function(){
            this.$refs.topMenu.style.display = 'block';
            goTop.index = 4;
            this.showMenu = false;
            document.querySelectorAll('body')[0].style.overflow = 'hidden';
            document.querySelectorAll('html')[0].style.overflow = 'hidden';
            ModalHelper.afterOpen();
        },
        close:function(){
            goTop.writeLocked = false;
            goTop.index = 6;
            if(this.isMobile){
                this.$refs.topMenu.style.display = 'none';
                document.querySelectorAll('body')[0].style.overflow = '';
                document.querySelectorAll('html')[0].style.overflow = '';
                ModalHelper.beforeClose();
            }
        },
        hoverStop:function(type){
            if(type == 'stop'){
                this.animateStop = true;
            }else{
                this.animateStop = false;
            }
        },
        showMarquee:function(){
            if(this.animateStop == true || this.announcementCount == 1 || this.marqueeList.length <= 1 ) return;
            this.animate = true;
            var that = this;
            setTimeout(function(){
                that.marqueeList.push(that.marqueeList[0]);
                that.marqueeList.shift();
                that.animate = false;
            },500)
        },
        showUserMenu:function(){
            this.showMenu = !this.showMenu
        },
        showWriteBox:function(){
            goTop.showSearchBox('write')
        },
        sign:function(e){
            signForm.showBox = true;
            if(e === 'up'){
                signForm.signup = true;
                signForm.signin = false;
            }else{
                signForm.signin = true;
                signForm.signup = false;
            }
        }
    }
})

//侧边栏评论
var sidebarComment = new Vue({
    el:'.widget_newest_comment',
    data:{
        hide:'',
        comments:[],
        paged:1,
        number:5,
        noneComments:false,
        timeagoInstance:new timeago(),
        pages:0,
        locked:false,
    },
    mounted:function(){
        if(this.$refs.commentSide){
            this.number = this.$el.querySelector('#newest-comments').getAttribute('data-number');
            this.hide = this.$el.querySelector('#newest-comments').getAttribute('data-hide');
            this.getList();
        }else{
            new Sticky('.side-fixed');
        }
    },
    methods:{
        pager:function(type){
            if(type == 'next'){
                if(this.paged >= this.pages){
                    this.lockedN = true;
                    return;
                }
                this.paged++;
                this.getList();
            }
            if(type == 'prev'){
                if(this.paged <= 1){
                    this.lockedP = true;
                    return;
                }
                this.paged--;
                this.getList();
            }
        },
        timeago:function(){
            //时间 time ago，如果想使用中文，请在最后
            this.timeagoInstance.render(this.$el.querySelectorAll('.timeago'), 'zh_CN');
        },
        getList:function(){
            if(this.locked == true) return;
            this.locked = true;
            var that = this;
            axios.post(zrz_script.ajax_url+'zrz_newest_comments_load','paged='+this.paged+'&number='+this.number+'&hide_author='+this.hide).then(function(resout){
                if(resout.data.status == 200){
                    that.comments = resout.data.msg;
                    if(that.paged == 1){
                        that.pages = resout.data.pages;
                    }
                    setTimeout(function () {
                        that.timeago();
                    }, 0);
                }else{
                    that.noneComments = true;
                }
                setTimeout(function () {
                    new Sticky('.side-fixed');
                }, 0);
                that.locked = false;
            })
        },
    }
})

//侧边栏用户面板
var userPanel = new Vue({
    el:'.widget_user_box',
    data:{
        Mtext:'',
        missionNub:'',
        missionLocked:false,
    },
    methods:{
        mission:function(){
            if(this.missionLocked == true || this.missionNub != 0) return;
            this.missionLocked = true;
            this.Mtext = '幸运之星正在降临...';
            var that = this;
            axios.get(zrz_script.ajax_url+'zrz_mission').then(function(resout){
                if(resout.data.status == 200){
                    setTimeout(function () {
                        that.Mtext = '恭喜！您今天获得了<b>'+resout.data.msg+'</b> '+zrz_script.credit_setting.name;
                    }, 1000);
                }
            })
        }
    },
    watch:{
        missionNub:function(val){
            if(val != 0){
                this.Mtext = '恭喜！您今天获得了<b>'+this.missionNub+'</b> '+zrz_script.credit_setting.name;
            }else{
                this.Mtext = '点击领取今天的签到奖励！';
            }
        }
    }
})

//推广网址
var achievement = new Vue({
    el:'.widget_user_achievement',
    data:{
        uName:'他'
    },
    methods:{
        copyUrl:function(){
            var input = this.$refs.urlInput;
            input.select(); // 选中文本
            document.execCommand("copy"); // 执行浏览器复制命令
            alert("复制成功");
        }
    }
})

//首页文章排列
var mainHome = new Vue({
    el:'#primary-home',
    data:{
        timeagoInstance:new timeago(),
        currentType:zrz_script.theme_setting.theme_style,
        locked:false,
        normalImg:'',
        lotteryImg:'',
        exchangeImg:'',
        isAdmin:zrz_script.is_admin,
        index:'index',
        paged:1,
        pages:1,
        catId:0,
        lockedMenu:false
    },
    mounted:function(){
        if(!this.$el.className) return;
        this.paged = parseInt(this.$el.getAttribute('data-paged'));
        this.pages = parseInt(this.$el.getAttribute('data-pages'));
        this.timeago();

        var that = this;
        if(this.$refs.homeMenu){
            var a = this.$refs.homeMenu.querySelectorAll('a');
            if(a.length > 0){
                for (var i = 0; i < a.length; i++) {
                    a[i].onclick = function(event){
                        if(that.lockedMenu == true) return;
                        that.lockedMenu = true;
                        this.firstChild.innerHTML += '<b class="loading"></b>';
                        var classN = this.parentNode.className;
                        if(classN.indexOf('seven') != -1){
                            that.catId = classN.split('seven')[1];
                            event.preventDefault();
                            event.stopPropagation();
                            that.getList(that.catId);
                        }
                    }
                }
            }
        }

        if(this.$refs.homeLabs){
            var flkty = new Flickity( '.home-labs-list', {
                cellAlign: 'left',
                contain: true,
                autoPlay:0,
                prevNextButtons: false,
                wrapAround: true,
                pageDots: true
            });
        }
    },
    methods:{
        listAc:function(type){
            if(this.currentType == type) return;
            this.currentType = type;
            if(this.$refs.postList){
                if(type == 'list'){
                    this.contentClass(' content',' content-card grid-item');
                    this.$refs.postList.className = this.$refs.postList.className.replace('grid-bor','');
                }else{
                    this.contentClass(' content-card grid-item ',' content');
                    this.$refs.postList.className += 'grid-bor'
                }
            }else if(this.$refs.shoplist){
                if(type == 'list'){
                    this.contentClass(' shop-list',' shop-card');
                }else{
                    this.contentClass(' shop-card',' shop-list');
                }
            }
        },
        contentClass:function(newClass,oldClass){
            if(this.$refs.shoplist){
                this.$refs.shoplist.className = this.$refs.shoplist.className.replace(oldClass,'');
                this.$refs.shoplist.className += newClass;
            }else{
                var list = this.$el.querySelectorAll('.post-list');
                for (var i = 0; i < list.length; i++) {
                    list[i].className = list[i].className.replace(oldClass,'');
                    list[i].className += newClass;
                }
            }
        },
        timeago:function(){
            //时间 time ago
            this.timeagoInstance.render(this.$el.querySelectorAll('.timeago'), 'zh_CN');
        },
        //商城主页图片上传
        getFile:function(event,type){
            var file = event.target.files[0];
            if(!file || this.locked === true) return;
            if(this.locked == true) return;
            this.locked = true;
            this.$refs[type+'Loding'].className = 'loading';
            if(file.type.indexOf('image') > -1){
                var that = this;
                imgcrop(file,zrz_script.media_setting['max_width'],'',function(resout){
                    if(resout[0] === true){
                        imgload(resout[1],function(imgSize){
                            var formData = new FormData(),
                                fileData,key;
                            if(file.type.indexOf('gif') > -1){
                                fileData = file;
                                key = 'default.gif';
                            }else{
                                fileData = resout[2];
                                key = 'default.jpg';
                            }
                            formData.append("type", type);
                            formData.append("file", fileData,key);
                            axios.post(zrz_script.ajax_url+'zrz_update_shop_home_img',formData)
                                .then(function(resout){
                                    if(resout.data.status == 200){
                                        imgload(resout.data.url,function(){
                                            if(type == 'normal'){
                                                that.normalImg = resout.data.url;
                                            }else if(type == 'lottery'){
                                                that.lotteryImg = resout.data.url;
                                            }else if(type == 'exchange'){
                                                that.exchangeImg = resout.data.url;
                                            }
                                        })
                                    }
                                    that.locked = false;
                                    that.$refs[type+'Loding'].className = '';
                                })
                        })
                    }
                })
            }
        },
        getList:function(id){
            var that = this,
                id = parseInt(id);
            axios.post(zrz_script.ajax_url+'zrz_get_cat_posts_pages','cat='+id).then(function(resout){

                that.index = 'catL'+id;
                that.pages = parseInt(resout.data.msg);
                that.paged = 1;

                axios.post(zrz_script.ajax_url+'zrz_load_more_posts','type='+that.index+'&paged=1').then(function(resout){
                    if(resout.data.status == 200){
                        var li = that.$refs.homeMenu.querySelectorAll('li');
                        for (var i = 0; i < li.length; i++) {
                            li[i].className = li[i].className.replace('current-menu-item','');
                        }
                        that.$refs.homeMenu.querySelectorAll('.seven'+id)[0].className += ' current-menu-item';
                        that.$refs.homeMenu.querySelectorAll('.seven'+id)[0].querySelectorAll('b')[0].remove();
                        that.$refs.postList.innerHTML = resout.data.msg;
                        that.timeago();
                    }
                    that.lockedMenu = false;
                })
            })
        }
    },
    components:{
        "page-nav":pageNav,
        "page-post":pagePost,
    }
})

Vue.nextTick(function(){
    if(zrz_script.is_mobile){
        var elem = document.querySelector('.zrz-menu-post');
        if(!elem) return;
        var flkty = new Flickity( elem, {
            freeScroll: true,
            groupCells: true,
            groupCells: 4,
            contain:true,
            prevNextButtons:false,
            pageDots:false,
            cellAlign: "left"
        });
    }
})

//首页专题
var cal = new Vue({
    el:'#home-collections',
    data:{
        isMobile:zrz_script.is_mobile,
        show:zrz_script.show_collections,
        locked:true
    },
    mounted:function(){
        if(!this.isMobile) return;
        if(this.show == 1){
            this.locked = true;
        }else{
            this.locked = false;
        }
    },
    methods:{
        openList:function(){
            if(this.show == 1) return;
            this.locked = !this.locked;
        }
    }
})

//幻灯
var carousel = new Vue({
    el:'#carousel',
    data:{
        isMobile:zrz_script.is_mobile,
        class:'',
        titleClass:'',
        auto:false
    },
    mounted:function(){
        var setting = {};
        if(this.$refs.bigCarousel){
            this.class = ".home-big-swipe";
            setting = {
                cellAlign: 'left',
                contain: true,
                autoPlay: zrz_script.swipe_time ? parseInt(zrz_script.swipe_time) : 4000,
                prevNextButtons: true,
                pageDots: false,
                wrapAround: true,
            };
        }else if(this.$refs.carousel){
            if(this.isMobile){
                this.class = ".main-carousel";
            }else{
                this.class = ".wp-first";
            }
            setting = {
                cellAlign: 'left',
                contain: true,
                autoPlay: zrz_script.swipe_time ? parseInt(zrz_script.swipe_time) : 4000,
                prevNextButtons: false,
                wrapAround: true,
            };
        }else{
            return;
        }
        if(document.querySelectorAll(this.class).length == 0) return;
        var flktyHome = new Flickity( this.class, setting);
        var that = this;
        Vue.nextTick(function(){
            that.titleClass = 'block';
        })
    }
})

var links = new Vue({
    el:'#link-add',
    data:{
        button:zrz_script.is_login ? '申请链接' : '申请链接',
        name:'',
        url:'',
        image:'',
        cat:'',
        description:'',
        subText:'提交申请',
        rating:zrz_script.rating,
        login:zrz_script.is_login,
        linksCat:[]
    },
    mounted:function(){
        if(this.rating){
            for (var k in this.rating){
                if (this.rating.hasOwnProperty(k)) {
                    if(this.rating[k] == 1){
                        this.$refs['rating'+k].className += ' active';
                    }
                }
            }
        }
    },
    methods:{
        addLink:function(){
            if(!this.login){
                signForm.showBox = true;
                signForm.signin = true;
            }else{
                this.$refs.linkForm.className += ' dialog--open';
            }
        },
        subLink:function(){
            var data = {
                'link_name':this.name,
                'link_url':this.url,
                'link_image':this.image,
                'link_category':this.cat,
                'link_description':this.description
            },that = this;
            axios.post(zrz_script.ajax_url+'zrz_insert_link',Qs.stringify(data)).then(function(resout){
                if(resout.data.status === 200){
                    that.subText = '提交成功，请等待审核';
                    setTimeout(function () {
                        that.close();
                    },1000);
                }else{
                    that.subText = resout.data.msg;
                    setTimeout(function () {
                        that.subText = '提交申请';
                    }, 1000);
                }
            })
        },
        close:function(){
            this.$refs.linkForm.className = this.$refs.linkForm.className.replace(' dialog--open', '' );
        },
        addRating:function(id){
            var that = this;
            axios.post(zrz_script.ajax_url+'zrz_link_add_rating','link_id='+id).then(function(resout){
                if(resout.data.status === 200){
                    if(resout.data.ac == 1){
                        that.$refs['rating'+id].className += ' active';
                        that.$refs['rating'+id].lastChild.innerText = parseInt(that.$refs['rating'+id].lastChild.innerText) + 1;
                    }else{
                        that.$refs['rating'+id].className = that.$refs['rating'+id].className.replace(' active', '' );
                        that.$refs['rating'+id].lastChild.innerText = parseInt(that.$refs['rating'+id].lastChild.innerText) - 1;
                    }

                }
            })
        },
        go:function(val){
            this.$scrollTo(this.$refs[val], 300, {offset: -20});
        }
    }
})

//搜索组件
var goTopToobar = Vue.extend({
    props:['show','type'],
    template:'<div :class="[\'dialog\', \'search-form\',\'dmsg-form\',{\'dialog--open\':showBox}]" ref="dmsgForm" v-cloak>\
				<div class="dialog__overlay" @click.stop="close"></div>\
				<div class="dialog__content">\
                    <template v-if="type == \'search\'">\
    					<h2 class="write-dol-title">搜一下</h2>\
                        <div class="search-tab t-l"><button :class="[\'text\',{\'active\':tab == \'post\'}]" @click="tab = \'post\'">文章</button><button :class="[\'text\',{\'active\':tab == \'labs\'}]" @click="tab = \'labs\'" v-if="showTab.labs == 1" v-text="showTab.labs_name"></button><button :class="[\'text\',{\'active\':tab == \'topic\'}]" @click="tab = \'topic\'" v-if="showTab.topic == 1">话题</button><button :class="[\'text\',{\'active\':tab == \'shop\'}]" @click="tab = \'shop\'" v-if="showTab.shop == 1">商品</button><button :class="[\'text\',{\'active\':tab == \'pps\'}]" @click="tab = \'pps\'" v-if="showTab.bubble == 1" v-text="showTab.bubble_name"></button></div>\
    					<div class="search-form-footer pd20">\
                            <form :action="action+\'?s=\'+key+\'&amp;post_type=\'+tab" method="post">\
        						<input type="text" name="s" id="sss" class="w100 pd10" :placeholder="\'搜索\'+sName" v-model="key"/>\
        						<div class="mar10-t t-r clearfix"><span class="fl"></span><button class="empty fr button">搜索</button></div>\
                            </form>\
    					</div>\
                    </template>\
                    <template v-else>\
                        <div class="write-dol pd10">\
                            <div class="write-dol-title">发起一个您感兴趣的内容</div>\
                            <div v-html="writeDom"></div>\
                        </div>\
                    </template>\
				</div>\
				</div>',
    data:function(){
        return {
            key:'',
            action:zrz_script.site_info.home_url,
            showBox:'',
            writeDom:zrz_script.write_dom,
            tab:'post',
            showTab:zrz_script.show_search_tab,
            sName:'文章'
        }
    },
    methods:{
        close:function(){
            this.$emit('close-form');
        }
    },
    watch: {
        show:function(val){
            this.showBox = val;
        },
        tab:function(val){
            if(val == 'post'){
                this.sName = '文章';
            }
            if(val == 'shop'){
                this.sName = '商品';
            }
            if(val == 'labs'){
                this.sName = this.showTab.labs_name;
            }
            if(val == 'pps'){
                this.sName = this.showTab.bubble_name;
            }
            if(val == 'topic'){
                this.sName = '话题';
            }
        }
    }
})

var homeMission = new Vue({
    el:'#home-mission',
    data:{
        Mtext:'',
        missionNub:'',
        missionLocked:false,
        login:zrz_script.is_login,
        isMobile:zrz_script.is_mobile
    },
    mounted:function(){
        if(!this.$refs.homeMission) return;
        if(this.isMobile && this.login){
            this.$refs.homeMission.style.display = 'block';
        }
    },
    methods:{
        mission:function(){
            if(!this.login){
                signForm.showBox = true;
                signForm.signup = false;
                signForm.signin = true;
                return;
            }
            if(this.missionLocked == true || this.missionNub != 0) return;
            this.missionLocked = true;
            this.Mtext = '幸运之星正在降临...';
            var that = this;
            axios.get(zrz_script.ajax_url+'zrz_mission').then(function(resout){
                if(resout.data.status == 200){
                    setTimeout(function () {
                        that.Mtext = '恭喜！您今天获得了<b>'+resout.data.msg+'</b> '+zrz_script.credit_setting.name;
                    }, 1000);
                }
            })
        }
    },
    watch:{
        missionNub:function(val){
            if(val != 0){
                this.Mtext = '恭喜！您今天获得了<b>'+val+'</b> '+zrz_script.credit_setting.name;
            }else{
                this.Mtext = '点击领取今天的签到奖励！';
            }
        }
    }
})

var goTop = new Vue({
    el:'#go-top',
    data:{
        showBox:false,
        uid:0,
        uname:'',
        mtype:'',
        showSearch:false,
        login:zrz_script.is_login,
        footerBarFixed:false,
        type:'',
        themeStyle:zrz_script.theme_setting['theme_style'],
        index:9,
        homeUlr:zrz_script.site_info.home_url
    },
    methods:{
        msg:function(){
            if(this.login == 0){
                signForm.showBox = true;
                signForm.signup = false;
                signForm.signin = true;
                return;
            }
            this.showBox = true;
            this.uid = zrz_script.contect.id;
            this.uname = zrz_script.contect.name;
            this.mtype = 'admin';
        },
        closeForm:function(){
            this.showBox = false;
            this.showSearch = false;
        },
        showSearchBox:function(type){
            if(this.login == 0 && type == 'write'){
                signForm.showBox = true;
                signForm.signup = false;
                signForm.signin = true;
                return;
            }
            this.showSearch = true;
            this.type = type;
        },
        loginAc:function(){
            signForm.showBox = true;
            signForm.signup = false;
            signForm.signin = true;
        },
        goComment:function(){
            this.$scrollTo(document.querySelector('#commentform'), 400, {offset: -350});
        },
        goTop:function(){
            this.$scrollTo(document.querySelector('#masthead'), 400);
        },
        changeStyle:function(type){
            var that = this;
            if(type == 'list'){
                this.themeStyle = 'list';
                mainHome.listAc('list');
            }else{
                this.themeStyle = 'pinterest';
                mainHome.listAc('pinterest');
            }
            axios.post(zrz_script.ajax_url+'zrz_set_theme_style_cookie','type='+type);
        },
    },
    components:{
        'msg-box':dmsg,
        'go-top':goTopToobar
    }
})

//图片加载
function imgload(url, callback) {
    var img = new Image();
    img.src = url;
    img.onload = function () {
        callback({0:img.width,1:img.height});
    };
}

function dataURItoBlob(base64Data) {
    var byteString;
    if (base64Data.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(base64Data.split(',')[1]);
    else
        byteString = unescape(base64Data.split(',')[1]);
    var mimeString = base64Data.split(',')[0].split(':')[1].split(';')[0];
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ia], {type:mimeString});
}

//图片裁剪
function imgcrop(file,w,h,callback){
    if(w == 0){
        w = '100%';
        h = '100%';
    }
    new html5ImgCompress(file, {
        maxWidth:w,
        maxHeight:h,
        quality:zrz_script.media_setting.quality/100,
        done: function (file, base64) {
            callback({0:true,1:base64,2:dataURItoBlob(base64),3:file});
        },
        fail: function(file) {
            callback({0:false,1:'压缩失败，请重试'});
        },
        notSupport: function(file) {
            callback({0:false,1:'浏览器不支持'});
        }
    });
}

//添加表情事件
function addSmily(type){
    var smilyButton = document.getElementsByClassName('smily-button');
    for (var i = smilyButton.length - 1; i >= 0; i--) {
        smilyButton[i].onclick = function(event){
            event.stopPropagation();
            var key = this.getAttribute('key-data');
            var type = this.parentNode.parentNode.parentNode.parentNode.parentNode.querySelectorAll('textarea')[0];
            grin(key,type);
        }
    }
}

//选择表情
function grin(tag,myField) {
    tag = ' ' + tag + ' ';

    if (document.selection) {
        myField.focus();
        sel = document.selection.createRange();
        sel.text = tag;
        myField.focus();
    }
    else if (myField.selectionStart || myField.selectionStart == '0') {
        var startPos = myField.selectionStart;
        var endPos = myField.selectionEnd;
        var cursorPos = startPos;
        myField.value = myField.value.substring(0, startPos)
            + tag
            + myField.value.substring(endPos, myField.value.length);
        cursorPos += tag.length;
        myField.focus();
        myField.selectionStart = cursorPos;
        myField.selectionEnd = cursorPos;
    } else {
        myField.value += tag;
        myField.focus();
    }
}

//随机数
function uuid(len, radix) {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    var uuid = [], i;
    radix = radix || chars.length;
    if (len) {
        for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];
    } else {
        var r;
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
        uuid[14] = '4';
        for (i = 0; i < 36; i++) {
            if (!uuid[i]) {
                r = 0 | Math.random()*16;
                uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
            }
        }
    }
    return uuid.join('');
}

//数字转换成功金币
function zrzStrToCoin(nub){
    nub = nub.toString();
    if(zrz_script.credit_setting.display == 0){
        return '<div class="coin fs12 l1 nub">'+nub+'</div>';
    }
    if(nub == 0) return '<div class="coin fs12 l1"><span class="tong">0<b></b></span></div>';
    if(nub == '') return;

    var j = nub.substring(0,nub.length-4).replace(/\b(0+)/gi,""),
        yt = nub.replace(j,''),
        y = yt.substring(0,yt.length-2),
        t = yt.replace(y,''),
        cj = j ? '<span class="jin">'+j+'<b></b></span>' : '',
        cy = y && y != 00 ? '<span class="yin">'+y.replace(/\b(0+)/gi,"")+'<b></b></span>' : '',
        ct = t && t != 00 ? '<span class="tong">'+t.replace(/\b(0+)/gi,"")+'<b></b></span>' : '';

    return '<div class="coin fs12 l1">'+cj+cy+ct+'</div>';
}

//阻止冒泡
function stopPropagation(e) {
    //如果提供了事件对象，则这是一个非IE浏览器
    if ( e && e.stopPropagation )
    //因此它支持W3C的stopPropagation()方法
        e.stopPropagation();
    else
    //否则，我们需要使用IE的方式来取消事件冒泡
        window.event.cancelBubble = true;
}

//字符串转 dom
function ZrzparseHTML(string) {
    var context = document.implementation.createHTMLDocument();
    var base = context.createElement('base');
    base.href = document.location.href;
    context.head.appendChild(base);
    context.body.innerHTML = string;
    return context.body.children;
}

//判断元素是不是在可是区
function isElementInViewport (el) {
    var rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

function openWin(url,name,iWidth,iHeight) {
    var iTop = (window.screen.availHeight - 30 - iHeight) / 2;
    var iLeft = (window.screen.availWidth - 10 - iWidth) / 2;
    window.open(url, name, 'height=' + iHeight + ',innerHeight=' + iHeight + ',width=' + iWidth + ',innerWidth=' + iWidth + ',top=' + iTop + ',left=' + iLeft + ',status=no,toolbar=no,menubar=no,location=no,resizable=no,scrollbars=0,titlebar=no');
}

//取小数点后两位
function changeTwoDecimal_f(x) {
    var f_x = parseFloat(x);
    if (isNaN(f_x)) {
        return false;
    }
    var f_x = Math.round(x * 100) / 100;
    var s_x = f_x.toString();
    var pos_decimal = s_x.indexOf('.');
    if (pos_decimal < 0) {
        pos_decimal = s_x.length;
        s_x += '.';
    }
    while (s_x.length <= pos_decimal + 2) {
        s_x += '0';
    }
    return parseFloat(s_x);
}

//解决移动端滚动穿透的问题
var ModalHelper = (function(bodyCls) {
    var scrollTop;
    return {
        afterOpen: function() {
            scrollTop = document.scrollingElement.scrollTop;
            document.body.classList.add(bodyCls);
            document.body.style.top = -scrollTop + 'px';
        },
        beforeClose: function() {
            document.body.classList.remove(bodyCls);
            // scrollTop lost after set position:fixed, restore it back.
            document.scrollingElement.scrollTop = scrollTop;
        }
    };
})('modal-open');

//视频背景图片
function videoBackground(){
    var videoBox = document.querySelectorAll('.content-video-box');
    if(videoBox.length > 0){
        for (var i = 0; i < videoBox.length; i++) {
            var img = videoBox[i].getAttribute('data-video-thumb');
            if(!img){
                img = zrz_script.theme_url+'/images/video.jpg';
            }
            videoBox[i].innerHTML = '<span class="pos-a img-bg" style="background-image:url('+img+')"></span>';
        }
    }
}

function downQcode(){
    var button = document.querySelectorAll('.down-qcode');
    if(button.length > 0){
        for (var i = 0; i < button.length; i++) {
            button[i].onclick = function(event){
                event.preventDefault();
                event.stopPropagation();
                if(this.nextElementSibling.className.indexOf('display') != -1){
                    this.nextElementSibling.className = this.nextElementSibling.className.replace(' display','');
                }else{
                    this.nextElementSibling.className += ' display';
                }
            }
        }
    }
}

function validate(evt) {
    var theEvent = evt || window.event;
    var key = theEvent.keyCode || theEvent.which;
    key = String.fromCharCode( key );
    var regex = /[0-9]|\./;
    if( !regex.test(key) ) {
        theEvent.returnValue = false;
        if(theEvent.preventDefault) theEvent.preventDefault();
    }
}

//微信内支付
function jsApiCall(data)
{
    WeixinJSBridge.invoke(
        'getBrandWCPayRequest',
        data,
        function(res){}
    );
}

function callpay()
{
    if (typeof WeixinJSBridge == "undefined"){
        if( document.addEventListener ){
            document.addEventListener('WeixinJSBridgeReady', jsApiCall, false);
        }else if (document.attachEvent){
            document.attachEvent('WeixinJSBridgeReady', jsApiCall);
            document.attachEvent('onWeixinJSBridgeReady', jsApiCall);
        }
    }else{
        jsApiCall();
    }
}

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
