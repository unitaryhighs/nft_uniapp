<template>
	<view class="page-body p50">
		<u-form :model="model"  ref="uForm" :errorType="errorType" :label-style="{color:'#fff',fontSize:'30rpx'}">
			<u-form-item :label-position="labelPosition" :leftIconStyle="{color: '#fff', fontSize: '50rpx',width:'50rpx',height:'50rpx',marginTop:'20rpx'}" :left-icon="leftImg.password"  prop="password" label-width="70" :border-bottom="false">
				<u-input :border="border" type="password" v-model="model.password" placeholder="支付密码，请设置6位数字" :custom-style="customStyle"></u-input>
			</u-form-item>
			<u-form-item :label-position="labelPosition" :leftIconStyle="{color: '#fff', fontSize: '50rpx',width:'50rpx',height:'50rpx',marginTop:'20rpx'}" :left-icon="leftImg.code" prop="code" label-width="70" :border-bottom="false">
				<u-input :border="border" placeholder="输入验证码" v-model="model.code" type="text" :custom-style="customStyle"></u-input>
				<text class="color-ff font-w600 fs24 codebtn" @click="getCode">{{codeTips}}</text>
			</u-form-item>
			<u-verification-code seconds="60" ref="uCode" @change="codeChange"></u-verification-code>
			<button size="default" shape="circle" class="primarybtn color-00" type="warning"  @click="submit">保存</button>
		</u-form>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				model:{
					code: '',
					password: '',
				},
				errorType: ['toast'],
				labelPosition: 'left',
				border: false,
				codeTips: '获取验证码',
				customStyle:{color:'#fff'},
				leftImg:{
					password:require("@/static/images/l3.png"),
					code:require("@/static/images/l2.png"),
				},
				rules: {
					code: [
						{
							min: 6,
							required: true,
							message: '请输入6位验证码',
							trigger: ['change','blur'],
						},
						{
							type: 'number',
							message: '验证码只能为数字',
							trigger: ['change','blur'],
						}
					],
					password: [
						{
							min: 6,
							required: true,
							message: '支付密码，请设置6位数字',
							trigger: ['change','blur'],
						},
						{
							type: 'number',
							message: '支付密码，请设置6位数字',
							trigger: ['change','blur'],
						}
					],
				}
			}
		},
		methods:{
			// 获取验证码
			getCode(){
				this.$refs.uForm.setRules(this.rulesgetCode);
					this.$refs.uForm.validate(valid => {
						if (valid) {
							// uni.showLoading({
							// 	title: '正在获取验证码',
							// 	mask: true
							// })
							this.$refs.uCode.start();
						} else {
							console.log('验证失败');
						}
				});
			},
			// 保存
			submit(){
				this.$refs.uForm.setRules(this.rules);
					this.$refs.uForm.validate(valid => {
						if (valid) {
							console.log('验证通过');
						} else {
							console.log('验证失败');
						}
				});
			},
			// 验证码倒计时
			codeChange(text) {
				this.codeTips = text;
			},
		}
	}
</script>

<style lang="scss">
	.page-body{
		background: #09081A;
	}
	.codebtn{
		padding: 8rpx 20rpx;
		text-align: center;
		color: #888888;
	}
	.primarybtn{
		// background: linear-gradient(90deg, rgba(210, 159, 127, 1) 0%, rgba(247, 222, 190, 1) 100%);
		border-radius: 45rpx;
		margin-top: 200rpx;
	}
	/deep/ .u-form-item__body{
		background: #323336;
		padding: 0rpx 20rpx !important;
		border-radius: 10rpx;
		// margin-bottom: 20rpx;
	}
</style>
