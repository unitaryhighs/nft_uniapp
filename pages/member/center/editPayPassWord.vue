<template>
	<view class="page-body" :class="[app.setCStyle(from)]">
		<view class="p20"></view>
		<u-form v-if="show" :model="model"  ref="uForm" :errorType="errorType">
			<view class="pbox mlr20 br20 ">
				<u-form-item :border-bottom="border"  :rightIconStyle="{color: '#888', fontSize: '32rpx'}" right-icon="phone" :label-position="labelPosition" :leftIconStyle="{color: '#fff', fontSize: '50rpx',width:'50rpx',height:'50rpx',marginTop:'20rpx'}" :left-icon="leftImg.mobile" prop="mobile" label-width="70">
					<text class="color-ff">{{mobile}}</text>
				</u-form-item>
				
				<u-form-item :border-bottom="border"  :label-position="labelPosition" :leftIconStyle="{color: '#fff', fontSize: '50rpx',width:'50rpx',height:'50rpx',marginTop:'20rpx'}" :left-icon="leftImg.code" prop="code" label-width="70">
					<u-input :border="border" :custom-style="customStyle" :placeholder="app.langReplace('请输入验证码')" v-model="model.code" type="text"></u-input>
					<button slot="right" type="success" size="mini" class="primarybtn color-ff code_btn" @click="getCode">{{codeTips}}</button>
				</u-form-item>
				
				<u-form-item :border-bottom="border" :label-position="labelPosition" :leftIconStyle="{color: '#fff', fontSize: '50rpx',width:'50rpx',height:'50rpx',marginTop:'20rpx'}" :left-icon="leftImg.password" prop="pay_password" label-width="70">
					<u-input :password-icon="true" :custom-style="customStyle" :border="border" type="password" v-model="model.pay_password" :placeholder="app.langReplace('请输入6位数字支付密码')"></u-input>
				</u-form-item>
				<u-form-item :border-bottom="border" :label-position="labelPosition" :leftIconStyle="{color: '#fff', fontSize: '50rpx',width:'50rpx',height:'50rpx',marginTop:'20rpx'}" :left-icon="leftImg.rePassword" label-width="70" prop="repay_password">
					<u-input :border="border" :custom-style="customStyle" type="password" v-model="model.repay_password" :placeholder="app.langReplace('请再次输入支付密码')"></u-input>
				</u-form-item>
			</view>
			<view class="pbox mt50">
			<button size="default" shape="circle"  type="warning"  class="primarybtn" @click="submit">{{app.langReplace('保存')}}</button>
			</view>
			<u-verification-code seconds="60" ref="uCode" @change="codeChange"></u-verification-code>
		</u-form>
	</view>
</template>

<script>
	export default {
		data() {
			let that = this;
			return {
				mobile:'',
				model: {
					code: '',
					pay_password: '',
					repay_password:'',
				},
				codeTips: '',
				border: false,
				labelPosition: 'left',
				errorType: ['toast'],
				show:false,
				
				rules: {
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
					
					pay_password: [
						{
							required:  true,
							message: this.app.langReplace('请输入支付密码'),
							trigger: ['change','blur'],
						},
						{
							min: 6,
							max: 6,
							type: 'number',
							message: this.app.langReplace('支付密码只能为6位数字'),
							trigger: ['change','blur'],
						}
					],
					repay_password: [
						{
							required: true,
							message: this.app.langReplace('请再次输入支付密码'),
							trigger: ['change','blur'],
						},
						{
							validator: (rule, value, callback) => {
								return value === this.model.pay_password;
							},
							message: this.app.langReplace('两次输入的支付密码不相等'),
							trigger: ['change','blur'],
						}
					],
				},
				customStyle:{color:'#fff'},
				leftImg:{
					mobile:require("@/static/images/l1.png"),
					code:require("@/static/images/l2.png"),
					password:require("@/static/images/l3.png"),
					rePassword:require("@/static/images/l5.png"),
					invite_code:require("@/static/images/l4.png"),
				},
			};
		},
		onLoad(options) {
			let title = this.app.langReplace('支付密码');
			uni.setNavigationBarTitle({
				title
			})
			this.from = options.from;
			this.getUserInfo();
			
		},
		computed: {
		
		},
		onReady() {
			
		},
		methods: {
			getUserInfo(){
				//获取登录会员信息
				this.$u.api.getUserInfo().then(res => {
					let userInfo = res.data;
					if (userInfo.mobile == ''){
						uni.showModal({
						    title: this.app.langReplace('提示'),
						    content: this.app.langReplace('当前帐号未绑定手机，请前往绑定.'),
							confirmText: this.app.langReplace('确认'),
							showCancel:false,
						    success: function (res) {
						        if (res.confirm) {
						           uni.redirectTo({
						           	url: 'bindMobile'
						           });
						        } 
						    }
						});
					}else{
						this.show = true;
						this.mobile = userInfo.mobile;
					}
				});
			},
			submit() {
				this.$refs.uForm.setRules(this.rules);
				this.$refs.uForm.validate(valid => {
					if (!valid) {
						return false;
					}
					//绑定手机
					this.$u.post('member/api.users/editPayPwd',this.model).then(res => {
						if (res.code < 0){
							this.$u.toast(res.msg);
							return false;
						}
						 uni.showModal({
						     title: this.app.langReplace('提示'),
						     content: this.app.langReplace('修改支付密码成功'),
						 	confirmText: this.app.langReplace('确认'),
						 	showCancel:false,
						     success: function (res) {
						         if (res.confirm) {
						            let pages = getCurrentPages();
									if(pages.length > 1){
										uni.navigateBack();
									} else {
										uni.reLaunch({
											url: '/pages/nft/index/index'
										});
									}
						         } 
						     }
						 });
					})
					
				});
			},
			codeChange(text) {
				this.codeTips = this.app.langReplace(text);
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
								'type': 'edit_pay_pwd',
								'mobile': this.model.mobile
							}).then(res => {
								uni.hideLoading();
								// 这里此提示会被this.start()方法中的提示覆盖
								if (res.data.code){
									this.$u.toast('测试状态，验证码自动填充');
									this.model.code = res.data.code;
									delete this.rules.code;
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

<style lang='scss'>
/deep/ .u-form-item__body{
		background: #323336;
		padding: 10rpx 20rpx !important;
		border-radius: 10rpx;
		margin-bottom: 20rpx;
	}
	.code_btn{
		border: none;
		background: none;
		
		&::after {
			border: none;
		}
		/* border: 1rpx solid #999999; */
	}
</style>
