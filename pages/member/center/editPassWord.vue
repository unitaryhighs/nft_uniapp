<template>
	<view class="page-body" :class="[app.setCStyle(from)]">
		<view class="p20"></view>
		<u-form :model="model"  ref="uForm" :errorType="errorType">
			<view class="pbox bg-base mlr20 br20 ">
				<u-form-item :border-bottom="false" style="border-bottom: 1rpx solid #333;" :label-position="labelPosition"  :label-style="customStyle"  :label="app.langReplace('旧密码')" prop="old_password" label-width="auto">
					<u-input :password-icon="true" :border="border" :custom-style="customStyle" type="password" v-model="model.old_password" :placeholder="app.langReplace('请输入')+app.langReplace('旧密码')"></u-input>
				</u-form-item>
				<u-form-item :border-bottom="false" style="border-bottom: 1rpx solid #333;" :label-position="labelPosition"  :label-style="customStyle"  :label="app.langReplace('新密码')" prop="password" label-width="auto">
					<u-input :password-icon="true" :border="border" :custom-style="customStyle" type="password" v-model="model.password" :placeholder="app.langReplace('请输入')+app.langReplace('新密码')"></u-input>
				</u-form-item>
				<u-form-item :border-bottom="false" style="border-bottom: 1rpx solid #333;" :label-position="labelPosition"  :label-style="customStyle"  :label="app.langReplace('确认密码')" prop="rePassword" label-width="auto">
					<u-input :password-icon="true" :border="border" :custom-style="customStyle" type="password" v-model="model.rePassword" :placeholder="app.langReplace('请输入')+app.langReplace('确认密码')"></u-input>
				</u-form-item>
				<view class="h50"></view>
			</view>
			<view class="pbox mt50">
			<button size="default" shape="circle"  type="warning"  class="primarybtn" @click="submit">{{app.langReplace('确认修改')}}</button>
			</view>
		</u-form>
	</view>
</template>

<script>
	export default {
		data() {
			let that = this;
			return {
				from: '',
				model: {
					old_password: '',
					password: '',
					rePassword: '',
				},
				pwrules: {
					old_password: [{
							required: true,
							message: this.app.langReplace('请输入')+' '+this.app.langReplace('旧密码'),
							trigger: ['change', 'blur'],
						},
						{
							min: 8,
							message: this.app.langReplace('密码不能少于8个字符'),
							trigger: 'change',
						}
					],
					password: [{
							required: true,
							message: this.app.langReplace('请输入')+' '+this.app.langReplace('新密码'),
							trigger: ['change', 'blur'],
						},
						{
							min: 8,
							message: this.app.langReplace('密码不能少于8个字符'),
							trigger: 'change',
						}
					],
					rePassword: [{
							required: true,
							message:  this.app.langReplace('请输入')+' '+this.app.langReplace('确认密码'),
							trigger: ['change', 'blur'],
						},
						{
							validator: (rule, value, callback) => {
								return value === this.model.password;
							},
							message: this.app.langReplace('两次输入的密码不相等'),
							trigger: ['change', 'blur'],
						}
					],
				},
				border: false,
				labelPosition: 'top',
				customStyle:{color:'#fff'},
				errorType: ['toast']
			};
		},
		onLoad(options) {
			this.app.isLogin(this);//强制登陆
			let title = this.app.langReplace('修改密码');
			uni.setNavigationBarTitle({
				title
			})
			this.from = options.from;
		},
		computed: {
			borderCurrent() {
				return this.border ? 0 : 1;
			},

		},
		onReady() {
			this.$refs.uForm.setRules(this.pwrules);
		},
		methods: {
			submit() {
				this.$refs.uForm.validate(valid => {
					if (!valid) {
						return false;
					} 
					this.$u.get('member/api.users/editPwd', this.model).then(res => {
						uni.showModal({
						    title: this.app.langReplace('提示'),
							confirmText: this.app.langReplace('确认'),
						    content: this.app.langReplace('密码已重置，请使用新密码登录'),
							showCancel:false,
						    success: function (res) {
						        if (res.confirm) {
						           uni.redirectTo({
						           	url: '/pages/member/passport/login'
						           });
						        } 
						    }
						});
					})
				});
			},
			
		}
	}
</script>

<style lang='scss'>

</style>
