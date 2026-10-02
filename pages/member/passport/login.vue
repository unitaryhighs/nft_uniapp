<template>
	<view class="page-body p50" :class="[app.setCStyle()]">
		<ji-nav-bar v-if="!wechat" class="ji-nav-bar" ref="navBar" type="fixed" bgColor="#1E1E1F" :withPadding="false" fontColor="#ffffff">
			<view class="preview" slot="default" style="color: #fff">登录</view>
		</ji-nav-bar>
		<view class="flex fh mt30" style="justify-content: space-between;">
			<view class="fs42 color-ff">欢迎进入</view>
		</view>
		<view class="shoporder mt60">
			<view class="top_navbar2">
				<view class="navbar navbar2">
					<view class="nav-item nav-item2" v-for="(item, index) in list" :key="index" :class="{current: model.login_type === index}"
					 @click="topTabClick(index)">{{item.name}}</view>
				</view>
			</view>
		</view>
		<u-form :model="model" ref="uForm" :errorType="errorType" :label-style="{color:'#fff',fontSize:'30rpx'}" class="mt50">
			<u-form-item :border-bottom="false" style="border-bottom: 1rpx solid #333;" right-icon="" :label-position="labelPosition" :leftIconStyle="{color: '#fff', fontSize: '50rpx',width:'50rpx',height:'50rpx',marginTop:'20rpx'}" :left-icon="leftImg.mobile" prop="mobile" label-width="70">
				<u-input :border="border" placeholder="请输入手机号" v-model="model.mobile" type="number" :custom-style="customStyle"></u-input>
			</u-form-item>
			
			<view v-if="model.login_type==0">
				<u-form-item :label-position="labelPosition" :leftIconStyle="{color: '#fff', fontSize: '50rpx',width:'50rpx',height:'50rpx',marginTop:'20rpx'}" :left-icon="leftImg.password" prop="password" label-width="70" :border-bottom="false" style="border-bottom: 1rpx solid #333;">
					<u-input :border="border" type="password" v-model="model.password" placeholder="请输入密码" :custom-style="customStyle"></u-input>
				</u-form-item>
			</view>
			<u-form-item  v-if="model.login_type==1" :label-position="labelPosition" :leftIconStyle="{color: '#fff', fontSize: '50rpx',width:'50rpx',height:'50rpx',marginTop:'20rpx'}" :left-icon="leftImg.code" :border-bottom="false" style="border-bottom: 1rpx solid #333;"
			 prop="code" label-width="70" >
				<u-input :border="border" :custom-style="customStyle" :placeholder="app.langReplace('请输入验证码')" v-model="model.code" type="text"></u-input>
				<button slot="right" type="success" size="mini" class="bg-base color-ff" @click="getCode">{{codeTips}}</button>
			</u-form-item>
			<u-form-item v-if="showVerify" :label-position="labelPosition" :label="app.langReplace('图形验证码')" prop="verifyCode" label-width="180">
				<u-input :border="border" :placeholder="app.langReplace('输入验证码')" v-model="model.verifyCode" type="text" :custom-style="customStyle"></u-input>
				<u-image width="200rpx" height="80rpx" :src="verifyUrl" @click="changeVerifyUrl"></u-image>
			</u-form-item>
			
			<view class="mt20 flex" style="color: #888888; justify-content: space-between;">
				<view v-if="settings.sms_public_forget_password" @click="goForget"><u-icon name="question-circle" color="#888888" size="28"></u-icon>忘记密码</view>
			</view>
			<view class="flex fh color-99 ml30" style="margin-top: 120rpx;">
				<u-checkbox class="not-mr" shape="circle"  active-color="#DBAE8E" v-model="is_agree" @change="is_agree=!is_agree">
					<view class="fs24">
						<text class="color-99">注册/登录即代表同意</text>
						<text class="cbtn" @click.stop="app.goPage('/pages/public/info?type=register_agreement')">
							《{{app.langReplace('服务协议')}}》
						</text>
						<text class="color-99">和</text>
						<text class="cbtn" @click.stop="app.goPage('/pages/public/info?type=privacy_agreement')">
							《{{app.langReplace('隐私政策')}}》
						</text>
					</view>
				</u-checkbox>
			</view>
			<button size="default" shape="circle" :disabled="!is_agree" :class="is_agree?'primarybtn':'primarybtn_def'" type="warning"  @click="submit">登录</button>
			<view class="color-99 fs26 text-center mt40">没有账号，<text class="color-ff" @click="goRegister">立即注册</text></view>
		
			<u-verification-code seconds="60" ref="uCode" @change="codeChange"></u-verification-code>
			
		</u-form>
		
		<copyright></copyright>
	</view>
</template>

<script>
	let that = this;
	import md5Libs from "uview-ui/libs/function/md5";
	import copyright from '@/pages/public/copyright';
	export default {
		components: {
			copyright
		},
		data() {
			return {
				wechat: false,
				list: [{name: '账号密码登录'},{name: '验证码登录'}],
				topTabCurrentIndex: 0,
				settings: {sms_public_forget_password: 1},
				baseImgUrl:this.config.baseImgUrl,
				returnUrl:'',
				logintype: this.app.langReplace('短信登录'),
				verifyUrl: '',
				showVerify: false,
				rememberPassword:this.app.langReplace('记住密码已被加密,无法查看'),
				model: {
					mobile: uni.getStorageSync("loginMobile"),
					wx_openid: this.app.getWxOpenId(),
					code: '',
					password: uni.getStorageSync("loginPassword")?'记住密码已被加密,无法查看':'',
					en_password:'',
					login_type: 0,
					remember: uni.getStorageSync("loginPassword") ? true : false,
					verifyCode: '',
					checkToken:'',
					rand_str:''
				},
				pwrules: {
					mobile: [{
							required: true,
							message: this.app.langReplace('请输入手机号'),
							trigger: ['change', 'blur'],
						},
						{
							validator: (rule, value, callback) => {
								// 调用uView自带的js验证规则，详见：https://www.uviewui.com/js/test.html
								return this.$u.test.mobile(value);
							},
							message: this.app.langReplace('手机号码不正确'),
							// 触发器可以同时用blur和change，二者之间用英文逗号隔开
							trigger: ['change', 'blur'],
						}
					],
					password: [{
							required: true,
							message: this.app.langReplace('请输入密码'),
							trigger: ['change', 'blur'],
						},
						{
							min: 8,
							message: this.app.langReplace('密码不能少于8个字符'),
							trigger: 'change',
						}
					]
				},
				msmrules: {
					mobile: [{
							required: true,
							message: this.app.langReplace('请输入手机号'),
							trigger: ['change', 'blur'],
						},
						{
							validator: (rule, value, callback) => {
								// 调用uView自带的js验证规则，详见：https://www.uviewui.com/js/test.html
								return this.$u.test.mobile(value);
							},
							message: this.app.langReplace('手机号码不正确'),
							// 触发器可以同时用blur和change，二者之间用英文逗号隔开
							trigger: ['change', 'blur'],
						}
					],
					code: [{
							min: 6,
							required: true,
							message: this.app.langReplace('请输入6位验证码'),
							trigger: ['change', 'blur'],
						},
						{
							type: 'number',
							message: this.app.langReplace('验证码只能为数字'),
							trigger: ['change', 'blur'],
						}
					]
				},
				rulesgetCode: {
					mobile: [{
							required: true,
							message: this.app.langReplace('请输入手机号'),
							trigger: ['change', 'blur'],
						},
						{
							validator: (rule, value, callback) => {
								// 调用uView自带的js验证规则，详见：https://www.uviewui.com/js/test.html
								return this.$u.test.mobile(value);
							},
							message: this.app.langReplace('手机号码不正确'),
							// 触发器可以同时用blur和change，二者之间用英文逗号隔开
							trigger: ['change', 'blur'],
						}
					]
				},
				border: false,
				check: false,
				labelPosition: 'left',
				customStyle:{color:'#fff'},
				codeTips: '',
				errorType: ['toast'],
				regshow:false,
				is_agree:false,
				postData:{},
				invite_code:'',
				leftImg:{
					mobile:require("../../../static/images/l1.png"),
					code:require("../../../static/images/l2.png"),
					password:require("../../../static/images/l3.png"),
					rePassword:require("../../../static/images/l5.png"),
					invite_code:require("../../../static/images/l4.png"),
				},
				back: false,
			};
		},
		onLoad(options) {
			// 判断微信浏览器
			// #ifdef H5
			let ua = window.navigator.userAgent.toLowerCase()
			if (ua.match(/MicroMessenger/i) == 'micromessenger') {
				// do something
				this.wechat = true;
			}
			// #endif
			
			uni.removeStorageSync("isNotLoginTip");//未登陆提示，此值会限制网络请求
			if (options.scene){//获取小程序的场景值，用于获取分享者的token
				let scene = options.scene.split('_');
				uni.setStorageSync("share_token",scene[0]);
			}
			
			if (typeof(options.returnUrl) == 'undefined' || !options.returnUrl){
				this.returnUrl = uni.getStorageSync("loginReturnUrl");
			}else{
				this.returnUrl = options.returnUrl;
				uni.setStorageSync("loginReturnUrl",options.returnUrl);
			}
			this.back = options.back;
			this.getToken();
			let that = this;
			setTimeout(function(){
				that.settings = uni.getStorageSync('setting');
				that.wxlogin();
			},500)
			this.verifyUrl = this.config.baseUrl + '/index.php/publics/api.index/verify/session_id/' + uni.getStorageSync("session_id");
		},
		computed: {
			borderCurrent() {
				return this.border ? 0 : 1;
			},
		},
		// onShow() {
		// 	console.log(getCurrentPages());
		// },
		onReady() {
			this.$refs.uForm.setRules(this.pwrules);
		},
		methods: {
			topTabClick(index) {
				this.model.login_type = index;
			},
			getToken(){
				this.$u.post('member/api.passport/getToken',{'showLoading':false}).then(res => {
					this.model.checkToken = res.data.checkToken;
					this.model.rand_str = res.data.rand_str;
				})
			},
			getLoginBtnClass(){
				let style = [];
				if (this.model.login_type == 0){
					if (this.model.mobile == '' || this.model.password == ''){
						style.push('primarybtnC');
						return style;
					}
				}
				if (this.model.login_type == 1){
					if (this.model.mobile == '' || this.model.code == ''){
						style.push('primarybtnC');
						return style;
					}
				}
				style.push('primarybtn');
				return style;
			},
			wxlogin(){
				if (this.app.getAuthCode()){
					this.app.goPage('/pages/member/center/index');
				}
			},
			submit() {
				this.$refs.uForm.validate(valid => {
					if (valid) {
						uni.setStorageSync("loginMobile", this.model.mobile); //记住手机号
						if (this.model.password == this.rememberPassword){
							this.model.en_password = uni.getStorageSync("loginPassword");
						}
						if (this.model.remember != true) {
							try {
								uni.removeStorageSync('loginPassword'); //销毁记住密码
							} catch (e) {}
						}
						this.model.rand_str = md5Libs.md5(this.model.rand_str+uni.getStorageSync("session_id"));
						this.$u.post('member/api.passport/login', this.model).then(res => {
							if (this.model.remember == true){
								uni.setStorageSync("loginPassword",res.data.loginPassword);//记录后端返回加密的用户密码
							}
							this.loginGo(res);
						}).catch(res=>{
							this.showVerify = res.data.showVerify;
							if (this.showVerify == true){
								this.model.verifyCode = '';
								this.changeVerifyUrl();
							}
							this.getToken();
						})
					} else {
						console.log('验证失败');
					}
				});
			},
			getPhoneNumber (e) {
				//小程序手机授权登陆
				if (e.detail.errMsg == "getPhoneNumber:ok") {
					this.postData.iv = e.detail.iv;
					this.postData.encryptedData = e.detail.encryptedData;
					this.postData.openid = this.app.getWxOpenId();
				    this.$u.post('weixin/api.index/loginByMpPhone', this.postData).then(res => {
						if (res.data.must_reg == 1){
							this.regshow = true;
							this.invite_code = uni.getStorageSync("share_token");
							return false;
						}
						if (res.data.token){
							this.loginGo(res);
						}
					})
				}
			},
			
			getUserInfo(){
				 if (this.is_agree == false){
				 	uni.showModal({
				 	    title: this.app.langReplace('提示'),
				 	    content: this.app.langReplace('请勾选同意本站相关协议'),
				 		confirmText: this.app.langReplace('确认'),
				 		showCancel:false,
				 	    success: function (res) {
				 	    }
				 	});
				 	return false;
				 }
				 let that = this;
				 uni.getUserProfile({
					desc:'Wexin',     // 这个参数是必须的
					success:res=>{
						console.log("用户信息",res.rawData);
						this.postData.rawData = res.rawData;
						this.postData.invite_code = this.invite_code;
						//请求注册
						this.$u.post('member/api.passport/register',this.postData).then(res => {
							if (res.code < 0){
								this.$u.toast(res.msg);
								return false;
							}
							let _url = '/pages/member/passport/login';
							if (res.data.token){
								_url = '/pages/shop/index/index';//自动登陆，跳转地址
								this.app.setAuthCode(res.data.token,res.data.share_token);
							}
							uni.removeStorageSync("share_token");//注册完成清理来源邀请码
							uni.showModal({
								title: this.app.langReplace('提示'),
								content: this.app.langReplace('注册成功'),
								confirmText: this.app.langReplace('确认'),
								showCancel:false,
								success: function (res) {
									if (res.confirm) {
									  that.app.goPage(_url,-1);
									} 
								}
							});
						})
					}
				})
			},
			loginGo(res){
				// 重置缓存 - 需要刷新数据
				this.app.clearRefreshData();
				//登录成功后执行
				this.app.setAuthCode(res.data.token,res.data.share_token);
				uni.removeStorageSync("loginReturnUrl");
				if (this.returnUrl == '' || typeof(this.returnUrl) == 'undefined') { //未读取到页面信息
					this.app.goPage('/pages/nft/index/index');
				} else if (this.back == 1){
					uni.navigateBack();
				} else {
					this.app.goPage(decodeURIComponent(this.returnUrl),-1);
				}
				this.app.saveUserInfo(this);
			},
			changeLogin() {
				if (this.model.login_type == 0) {
					this.logintype = this.app.langReplace('密码登录');
					this.model.login_type = 1;
					this.$refs.uForm.setRules(this.msmrules);
				} else {
					this.logintype = this.app.langReplace('短信登录');
					this.model.login_type = 0;
					this.$refs.uForm.setRules(this.pwrules);
				}
			},
			changeVerifyUrl() {
				if (this.verifyUrl.indexOf('rand=') > -1) {
					this.verifyUrl = this.verifyUrl.substr(0, this.verifyUrl.length - 19);
				}
				this.verifyUrl += '?rand=' + new Date().getTime();
			},
			codeChange(text) {
				this.codeTips = this.app.langReplace(text);
			},
			// 获取验证码
			getCode() {
				let that = this;
				if (this.$refs.uCode.canGetCode) {
					this.$refs.uForm.setRules(this.rulesgetCode);
					this.$refs.uForm.validate(valid => {
						if (valid) {
							// 向后端请求验证码
							uni.showLoading({
								title: that.app.langReplace('正在获取验证码'),
								mask: true
							})
							this.$u.get('publics/api.sms/sendCode', {
								'type': 'login',
								'mobile': this.model.mobile
							}).then(res => {
								uni.hideLoading();
								// 这里此提示会被this.start()方法中的提示覆盖
								if (res.data.code){
									this.$u.toast('测试状态，验证码自动填充');
									this.model.code = res.data.code;
								}else{
									this.$u.toast(that.app.langReplace('验证码已发送'));
								}
								this.user_exist = res.data.user_exist;
								// 通知验证码组件内部开始倒计时
								this.$refs.uCode.start();
							})
						}
					});
				} else {
					this.$u.toast(this.app.langReplace('倒计时结束后再发送'));
				}
			},
			
			goForget() {
				uni.navigateTo({
					url: '/pages/member/passport/forget'
				});
			},
			goRegister() {
				uni.navigateTo({
					url: '/pages/member/passport/register'
				});
			}
		}
	}
</script>
<style lang="scss">
	.primarybtn{
		margin-top: 20rpx;
		// color: $btn-color;
	}
	.primarybtn_def{
		background: rgba(129, 129, 129, 1);
		border-radius: 45rpx;
		margin-top: 20rpx;
	}
	.top_navbar2{
		border-top-left-radius: 20rpx;
		border-top-right-radius: 20rpx;
		box-shadow: unset;
	}
	.navbar .nav-item.current{
		color: #FFFFFF;
	}
	.navbar .nav-item.current:after{
	    width: 80%;
		border-bottom: 2rpx solid;
	    border-color: #FFFFFF;
	    background-color: #FFFFFF;
	}
</style>
