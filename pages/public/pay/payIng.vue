<template>
	<view class="page-body" :class="[app.setCStyle(from)]">
		<block v-if="showzhiyin">
			<view class="w100">
				<image class="fr" :src="baseImgUrl+'a_static/images/zhiyin.png'" mode="widthFix"></image>
				<view class="text-center color-ff fs32 pb30 cl cr">
					<view>微信不能使用支付宝</view>
					<view>请按提示复制链接到其它浏览器操作</view>
				</view>
			</view>
		</block>
		<block v-else>
			<view class="success-icon" style="margin-top: 200rpx;">
				<u-icon name="rmb" color="#FFFFFF" size="88"></u-icon>
			</view>
			<text class="tip color-ff">{{app.langReplace('正在支付')}}...</text>
		</block>
		<view v-if="from == 'nft'" class="btn-group">
			<view v-if="payType == 'order'" @click="app.goPage('/pages/nft/order/info?order_id='+order_id,1)" class="mix-btn  primarybtn" >{{app.langReplace('返回订单')}}</view>
		</view>
		<view @click="app.goPage('/pages/member/center/index',-1)" class="mix-btn primarybtn" >{{app.langReplace('返回个人中心')}}</view>
		<view v-if="payType == 'market'" @click="app.goPage('/pages/nft/market/index',-1)" class="mix-btn primarybtn" >返回市场</view>
		<view v-else @click="app.goPage('/pages/nft/index/index',-1)" class="mix-btn primarybtn" >返回首页</view>
		<payPassWord :payPassWordShow="payPassWordShow" :payTip="payTip" :payMoney="payMoney"  @closePayPassWord="closePayPassWord"  @finishPayPassWord="finishPayPassWord"></payPassWord>
		
	</view>
</template>

<script>
	import payPassWord from '@/pages/member/wallet/payPassWord';
	export default {
		components: {
			payPassWord
		},
		data() {
			return {
				baseImgUrl: this.config.baseImgUrl,
				options:{},
				from:'',
				payType:'',
				pay_code:'',
				order_id:0,
				payTip:'',
				payMoney:'0',
				payPassWordShow: false,
				pay_password:'',
				showzhiyin:false
			}
		},
		onLoad(options) {
			this.from = options.from;
			this.payType = options.payType;
			this.order_id = options.order_id;
			this.pay_code = options.pay_code;
			this.options = options;
			if (this.$mPayment.isWechat() == true && this.pay_code == 'alipayMobile'){
				this.showzhiyin = true;
			}else{
				let key = "payIng"+options.from+options.pay_code+options.payType;
				let syncOrderId = uni.getStorageSync(key);
				if (syncOrderId != options.order_id){
					uni.setStorageSync(key,options.order_id);
					this.openPayPassWord();
				}
			}
		},
		computed: {},
		onReady() {},
		methods: {
			openPayPassWord() {
				let setting = uni.getStorageSync('setting');
				if (setting.sys_model_pay_password != 1){
					return this.goPay();
				}
				this.pay_password = '';
				if (this.pay_code == 'balance'){
					let that = this;
					this.$u.post('member/api.users/isSetPayPwd').then(res => {
						if (res.data.isset == 1){
							this.payPassWordShow = true;
						}else{
							uni.showModal({
								title:  that.app.langReplace('提示'),
								content: res.msg,
								showCancel: true,
								confirmText: that.app.langReplace('设置支付密码'),
								cancelText: that.app.langReplace('取消支付'),
								success: function(res) {
									if (res.confirm) {
										uni.navigateTo({
											url: '/pages/member/center/editPayPassWord'
										});
									}
									if (res.cancel){
										that.app.goPage(-1);
									}
								}
							});
						}
					})
					
				}else{
					 return this.goPay();
				}
			},
			closePayPassWord(){
				this.payPassWordShow = false;
			},
			finishPayPassWord(e){
				this.pay_password = e;
				this.goPay();
			},
			async goPay(){
				// 重置缓存 - 需要刷新数据
				this.app.clearRefreshData();
				
				switch (this.pay_code) {
					case 'alipayMobile':
						if (this.showzhiyin == true){
							return false;
						}
						await this.$mPayment.aliPay(this);
						break;
					  case 'alipayApp':
						await this.$mPayment.alipayApp(this);
						break;
					case 'appWeixinPay':
						await this.$mPayment.appWeixinPay(this);
						break;
					case 'weixin':
					case 'miniAppPay':
						await this.$mPayment.weixinPay(this);
						break;
					case 'balance':
						await this.$mPayment.balancePay(this);
						break;
					case 'sandPayH5':
						await this.$mPayment.sandPayH5(this);
						break;
					case 'sandPayH5N':
						await this.$mPayment.sandPayH5N(this);
						break;
					default:
						this.app.showModal('暂不支持.',-1);
						break;
				}
			}
		}
	}
</script>

<style lang="scss">
.page-body{
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.success-icon{
		background-color: #fdb448;
		padding:40rpx 40rpx;
		border-radius: 50%;
		margin-bottom: 20rpx;
	}
	.tit{
		font-size: 38rpx;
		color: #303133;
	}
	.btn-group{
		padding-top: 80rpx;
	}
	.mix-btn {
		margin-top: 30rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 600rpx;
		height: 80rpx;
		font-size: $font-lg;
		// color: #fff;
		// border-radius: 10rpx;
		
	}

</style>
