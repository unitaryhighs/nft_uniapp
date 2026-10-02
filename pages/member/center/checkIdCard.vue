<template>
	<view class="page-body p50" :class="[app.setCStyle()]">
		<view class="fs40 color-ff">实名认证</view>
		<view class="color-red fs26">请确认注册手机号与实名信息匹配</view>
		<tfgg-verify @result='verifyResult' ref="verifyElement"></tfgg-verify>
		<u-form  :model="model"  ref="uForm" :errorType="errorType" :label-style="{color:'#fff',fontSize:'30rpx'}" class="mt50 form_box box-bg-base">
			<u-form-item :border-bottom="false" style="border-bottom: 1rpx solid #333;" right-icon="" :label-position="labelPosition" label="已注册手机号" prop="mobile" label-width="160">
				<u-input :border="border" disabled v-model="model.mobile" type="text" :custom-style="customStyle"></u-input>
			</u-form-item>
			<u-form-item :border-bottom="false" style="border-bottom: 1rpx solid #333;" right-icon="" :label-position="labelPosition" label="姓名" prop="name" label-width="160">
				<u-input :border="border" placeholder="请输入您的真实姓名" v-model="model.real_name" type="text" :custom-style="customStyle"></u-input>
			</u-form-item>
			<u-form-item :border-bottom="false" style="border-bottom: 1rpx solid #333;" right-icon="" :label-position="labelPosition" label="证件号码" prop="id_card_number" label-width="160">
				<u-input :border="border" placeholder="请输入您的身份证号码" v-model="model.id_card_number" type="text" :custom-style="customStyle"></u-input>
			</u-form-item>
		</u-form>
		
		<button size="default" shape="circle" class="primarybtn" type="warning"  @click="submit">提交</button>
	</view>
</template>

<script>
	import tfggVerify from '@/components/tfgg-verify';
	export default{
		components: {
			"tfgg-verify": tfggVerify
		},
		data(){
			return{
				is_nch5:false,
				model:{
					mobile:'',
					real_name:"",
					id_card_number:""
				},
				errorType: ['toast'],
				labelPosition: 'top',
				border: false,
				customStyle:{color:'#fff'},
				rules: {
					real_name: [
						{
							required: true,
							message: '请输入姓名',
							trigger: ['change','blur'],
						},
						{
							min: 2,
							max: 15,
							message: '姓名长度在2到15个字符',
							trigger: ['change', 'blur'],
						},
						{
							// 此为同步验证，可以直接返回true或者false，如果是异步验证，稍微不同，见下方说明
							validator: (rule, value, callback) => {
								// 调用uView自带的js验证规则，详见：https://www.uviewui.com/js/test.html
								return this.$u.test.chinese(value);
							},
							message: '姓名必须为中文',
							// 触发器可以同时用blur和change，二者之间用英文逗号隔开
							trigger: ['change', 'blur'],
						}
					],
					id_card_number: [
						{
							required:  true,
							message: '请输入您的身份证号码',
							trigger: ['change','blur'],
						},
						{
							validator: (rule, value, callback) => {
								// 调用uView自带的js验证规则，详见：https://www.uviewui.com/js/test.html
								return this.$u.test.idCard(value);
							},
							message: '身份证号码不正确',
							// 触发器可以同时用blur和change，二者之间用英文逗号隔开
							trigger: ['change','blur'],
						}
					],
				}
			}
		},
		onLoad(options) {
			this.app.isLogin(this);//强制登陆
			this.from = options.from;
			let that = this;
			that.getUserInfo();
		},
		computed: {

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
			getUserInfo() {
				//获取登录会员信息
				this.$u.api.getUserInfo().then(res => {
					this.model.mobile = res.data.mobile;
					if (res.data.check_id_card != 0) {
						this.app.showModal('已实名成功，无须操作.',-1);
						return true;
					}
					this.verifyFasong();
				});
			},
			submit(){
				if (!this.is_nch5){
					this.$u.toast(this.app.langReplace('请验证后操作.'));
					return false;
				}
				let that = this;
				this.$refs.uForm.setRules(this.rules);
					this.$refs.uForm.validate(valid => {
						if (!valid) {
							return false;
						}
						this.$u.post('member/api.users/checkIdCard', this.model).then(res => {
							if (res.code == -100){
								this.is_nch5 = false;
								this.verifyFasong();
								this.verifyReset();
								this.app.showModal(res.msg);
								return true;
							}
							uni.showModal({
								title: '提示',
								content: res.msg,
								showCancel: false,
								success: function(res) {
									if (res.confirm) {
										that.app.goPage(-1);
									}
								}
							});
							this.app.saveUserInfo(this);
						})
				});
			},
		}
	}
</script>

<style lang="scss">
	.form_box{
		border-radius: 24rpx;
		padding: 0 30rpx;
	}
	.primarybtn{
		border-radius: 45rpx;
		margin-top: 100rpx;
	}
</style>
