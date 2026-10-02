<template>
	<view class="page-body p50">
		<u-form :model="model"  ref="uForm" :errorType="errorType" :label-style="{color:'#fff',fontSize:'30rpx'}">
			<u-form-item :border-bottom="false" right-icon="" :label-position="labelPosition" label="姓名" prop="mobile" label-width="160">
				<u-input :border="border" placeholder="请输入真实姓名" v-model="model.nickname" type="text" :custom-style="customStyle"></u-input>
			</u-form-item>
			<u-form-item :border-bottom="false" right-icon="" :label-position="labelPosition" label="身份证号" prop="idCard" label-width="160">
				<u-input :border="border" placeholder="请输入身份证号" v-model="model.idCard" type="idcard" :custom-style="customStyle"></u-input>
			</u-form-item>
			<u-form-item :border-bottom="false" right-icon="" :label-position="labelPosition" label="账户类型" prop="type" label-width="160">
				<u-input :border="border" placeholder="请输入账户类型" v-model="model.type" type="text" :custom-style="customStyle"></u-input>
			</u-form-item>
			<u-form-item :border-bottom="false" right-icon="" :label-position="labelPosition" label="银行卡号" prop="bankCard" label-width="160">
				<u-input :border="border" placeholder="请输入卡号" v-model="model.bankCard" type="idcard" :custom-style="customStyle"></u-input>
			</u-form-item>
			<u-form-item :border-bottom="false" right-icon="" :label-position="labelPosition" label="银行卡预留手机号" prop="mobile" label-width="160">
				<u-input :border="border" placeholder="请输入预留手机号" v-model="model.mobile" type="number" :custom-style="customStyle"></u-input>
			</u-form-item>
			<button size="default" shape="circle" class="primarybtn" type="warning"  @click="submit">确认</button>
		</u-form>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				model:{
					nickname: '',
					idCard: '',
					type: '',
					bankCard:'',
					mobile:''
				},
				errorType: ['toast'],
				labelPosition: 'top',
				border: false,
				customStyle:{color:'#fff'},
				rules: {
					nickname: [
						{
							required: true,
							message: '请输入真实姓名',
							trigger: ['change','blur'],
						},
						{
							validator: (rule, value, callback) => {
								// 调用uView自带的js验证规则，详见：https://www.uviewui.com/js/test.html
								return this.$u.test.chinese(value);
							},
							message: '姓名格式不正确',
							// 触发器可以同时用blur和change，二者之间用英文逗号隔开
							trigger: ['change','blur'],
						}
					],
					idCard: [
						{
							required: true,
							message: '请输入身份证号',
							trigger: ['change','blur'],
						},
						{
							validator: (rule, value, callback) => {
								// 调用uView自带的js验证规则，详见：https://www.uviewui.com/js/test.html
								return this.$u.test.idCard(value);
							},
							message: '身份证号格式不正确',
							// 触发器可以同时用blur和change，二者之间用英文逗号隔开
							trigger: ['change','blur'],
						}
					],
					type: [
						{
							required:  true,
							message: '请输入账户类型',
							trigger: ['change','blur'],
						},
					],
					bankCard: [
						{
							required: true,
							message: '请输入卡号',
							trigger: ['change','blur'],
						}
					],
					mobile: [
						{
							required: true,
							message: '请输入手机号',
							trigger: ['change','blur'],
						},
						{
							validator: (rule, value, callback) => {
								// 调用uView自带的js验证规则，详见：https://www.uviewui.com/js/test.html
								return this.$u.test.mobile(value);
							},
							message: '手机号码不正确',
							// 触发器可以同时用blur和change，二者之间用英文逗号隔开
							trigger: ['change','blur'],
						}
					],
				}
			}
		},
		methods:{
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
		}
	}
</script>

<style lang="scss">
	.page-body{
		background: #09081A;
	}
	.codebtn{
		padding: 8rpx 20rpx;
		border: 1rpx solid #888888;
		text-align: center;
		color: #888888;
		border-radius: 40rpx;
	}
	.primarybtn{
		// background: linear-gradient(90deg, rgba(210, 159, 127, 1) 0%, rgba(247, 222, 190, 1) 100%);
		border-radius: 45rpx;
		margin-top: 20rpx;
	}
	/deep/ .u-form-item--right{
		background: #323336;
		padding: 10rpx 20rpx !important;
		border-radius: 10rpx;
	}
</style>
