<template>
	<view class="page-body p50 pt100 " :class="[app.setCStyle()]">
		<tfgg-verify @result='verifyResult' ref="verifyElement"></tfgg-verify>
		<text class="block fs42  color-ff font-w600 mt40">{{app.langReplace('找回密码')}}</text>
		<text class="block fs30 color-ff font-w600 mt20">{{app.langReplace('请按以下操作重置密码信息')}}</text>
		<u-form :model="model"  ref="uForm" :errorType="errorType" class="mt60">
			<u-form-item :border-bottom="false" style="border-bottom: 1rpx solid #333;" :rightIconStyle="{color: '#fff', fontSize: '32rpx'}" :label-style="customStyle" right-icon="phone" :label-position="labelPosition" :label="app.langReplace('手机号码')" prop="mobile" label-width="150">
				<u-input :border="border" :custom-style="customStyle" :placeholder="app.langReplace('请输入手机号')" v-model="model.mobile" type="number"></u-input>
			</u-form-item>
			
			<u-form-item :border-bottom="false" style="border-bottom: 1rpx solid #333;" :label-position="labelPosition" :label-style="customStyle" :label="app.langReplace('验证码')" prop="code" label-width="150">
				<u-input :border="border" :custom-style="customStyle" :placeholder="app.langReplace('请输入验证码')" v-model="model.code" type="text"></u-input>
				<button slot="right" type="success" size="mini" class="primarybtn" @click="getCode">{{codeTips}}</button>
			</u-form-item>
			<u-form-item :border-bottom="false" style="border-bottom: 1rpx solid #333;" :label-position="labelPosition" :label-style="customStyle" :label="app.langReplace('新密码')" prop="password" label-width="150">
				<u-input :password-icon="true" :custom-style="customStyle" :border="border" type="password" v-model="model.password" :placeholder="app.langReplace('请输入密码')"></u-input>
			</u-form-item>
			<u-form-item :border-bottom="false" style="border-bottom: 1rpx solid #333;" :label-position="labelPosition" :label-style="customStyle" :label="app.langReplace('确认密码')" label-width="150" prop="rePassword">
				<u-input :border="border" :custom-style="customStyle" type="password" v-model="model.rePassword" :placeholder="app.langReplace('请再次输入密码')"></u-input>
			</u-form-item>
			<u-form-item :border-bottom="false" style="border-bottom: 1rpx solid #333;" v-if="showVerify" :label-position="labelPosition" :label-style="customStyle" :label="app.langReplace('图形验证码')" prop="verifyCode" label-width="150">
				<u-input :border="border" :custom-style="customStyle" :placeholder="app.langReplace('输入验证码')" v-model="model.verifyCode" type="text"></u-input>
				<u-image width="200rpx" height="80rpx" :src="verifyUrl" @click="changeVerifyUrl"></u-image>
			</u-form-item>
			<button size="default" shape="circle" type="warning" class="primarybtn mt40"  @click="submit">{{app.langReplace('提交')}}</button>
			<u-verification-code seconds="60" ref="uCode" @change="codeChange"></u-verification-code>
		</u-form>
		<copyright></copyright>
	</view>
</template>

<script>
	import copyright from '@/pages/public/copyright';
	import tfggVerify from '@/components/tfgg-verify';
	export default {
		components: {
			copyright,
			"tfgg-verify": tfggVerify
		},
		data() {
			let that = this;
			return {
				verifyUrl: '',
				showVerify:false,
				model: {
					nc_val:'',
					mobile: '',
					code: '',
					password: ''
				},
				customStyle:{color:'#fff'},
				rulesgetCode:{
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
				rules: {
					mobile: [
						{
							required: true,
							message: this.app.langReplace('请输入手机号'),
							trigger: ['change','blur'],
						},
						{
							validator: (rule, value, callback) => {
								// 调用uView自带的js验证规则，详见：https://www.uviewui.com/js/test.html
								return this.$u.test.mobile(value);
							},
							message: this.app.langReplace('手机号码不正确'),
							// 触发器可以同时用blur和change，二者之间用英文逗号隔开
							trigger: ['change','blur'],
						}
					],
					code: [
						{
							min: 6,
							required: true,
							message: this.app.langReplace('请输入6位验证码'),
							trigger: ['change','blur'],
						},
						{
							type: 'number',
							message: this.app.langReplace('验证码只能为数字'),
							trigger: ['change','blur'],
						}
					],
					password: [
						{
							required:  true,
							message: this.app.langReplace('请输入密码'),
							trigger: ['change','blur'],
						},
						{
							min: 8,
							message: this.app.langReplace('密码不能少于8个字符'),
							trigger: 'change' ,
						}
					],
					rePassword: [
						{
							required: true,
							message: this.app.langReplace('请重新输入密码'),
							trigger: ['change','blur'],
						},
						{
							validator: (rule, value, callback) => {
								return value === this.model.password;
							},
							message: this.app.langReplace('两次输入的密码不相等'),
							trigger: ['change','blur'],
						}
					],
				},
				border: false,
				check: false,
				labelPosition: 'left',
				codeTips: '',
				errorType: ['toast']
			};
		},
		onLoad() {
			this.model.mobile = uni.getStorageSync("loginMobile");
			let that = this;
			setTimeout(() => {
				that.verifyFasong();
			},500);
			this.verifyUrl = this.config.baseImgUrl + '/index.php/publics/api.index/verify/session_id/'+uni.getStorageSync("session_id");
		},
		computed: {
			borderCurrent() {
				return this.border ? 0 : 1;
			},
		},
		onReady() {
			
		},
		methods: {
			/* 校验结果回调函数 */
			verifyResult(res) {
				if (res.nc_val) {
					this.is_nch5 = true;
					this.model.nc_val = res.nc_val;
					this.verifyReset(); //校验成功重置插件
					console.log('验证成功')
				}
				console.log(res);
			},
			/* 显示校验弹窗 */
			verifyFasong() {
			    this.$refs.verifyElement.show();
			},
			/* 校验插件重置 */
			verifyReset() {
			    this.$refs.verifyElement.shuaxinVerify();
			},
			submit() {
				this.$refs.uForm.setRules(this.rules);
				this.$refs.uForm.validate(valid => {
					if (!valid) {
						return false;
					}
					//验证手机验证码
					this.$u.get('member/api.passport/forgetPwd',this.model).then(res => {
						if (res.code < 0){
							this.showVerify = res.data.showVerify;
							this.$u.toast(res.msg);
							this.changeVerifyUrl();
							this.model.verifyCode = '';
							return false;
						}
						uni.showModal({
							title: this.app.langReplace('提示'),
							content: this.app.langReplace('密码已重置，请使用新密码登录'),
							confirmText: this.app.langReplace('确认'),
							showCancel:false,
							success: function (res) {
								if (res.confirm) {
								   uni.navigateTo({
									url: '/pages/member/passport/login'
								   });
								} 
							}
						});
						
					})
					
				});
			},
			codeChange(text) {
				this.codeTips = this.app.langReplace(text);
			},
			changeVerifyUrl() {
				if (this.verifyUrl.indexOf('rand=') > -1) {
					this.verifyUrl = this.verifyUrl.substr(0, this.verifyUrl.length - 19);
				}
				this.verifyUrl += '?rand=' + new Date().getTime();
			},
			// 获取验证码
			getCode() {
				if(this.$refs.uCode.canGetCode) {
					this.$refs.uForm.setRules(this.rulesgetCode);
					this.$refs.uForm.validate(valid => {
						if (valid) {
							// 向后端请求验证码
							uni.showLoading({
								title: '正在获取验证码',
								mask: true
							})
							this.$u.get('publics/api.sms/sendCode', {
								'type': 'forget_password',
								'mobile': this.model.mobile,
								'nc_val': this.model.nc_val
							}).then(res => {
								uni.hideLoading();
								if (res.code == -100){
									this.is_nch5 = false;
									this.verifyFasong();
									this.verifyReset();
									this.app.showModal(res.msg);
									return false;
								}
								// 这里此提示会被this.start()方法中的提示覆盖
								if (res.data.code){
									this.$u.toast('测试状态，验证码自动填充');
									this.model.code = res.data.code;
								}else{
									this.$u.toast(this.app.langReplace('验证码已发送'));
								}
								this.user_exist = res.data.user_exist;
								// 通知验证码组件内部开始倒计时
								this.$refs.uCode.start();
							})
						}
					});
				} else {
					this.$u.toast(this.app.langReplace('倒计时结束后再请求'));
				}
			},
		}
	}
</script>
<style>
	.u-form-item{
		line-height: 30rpx;
	}
</style>
