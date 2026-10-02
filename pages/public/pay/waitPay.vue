<template>
	<view class="page-body" :class="[app.setCStyle(from)]">
		<view class="success-icon" style="margin-top: 200rpx;">
			<u-icon :name="icon" color="#FFFFFF" size="88"></u-icon>
		</view>
		<text class="tip color-ff">{{tip}}</text>
		
		<view class="btn-group">
			<view v-if="type == 'order'" @click="app.goPage('/pages/nft/order/info?order_id='+order_id,-1)" class="mix-btn  primarybtn" >查看订单</view>
			<view @click="app.goPage('/pages/member/center/index',-1)" class="mix-btn primarybtn" >返回个人中心</view>
			<view v-if="type == 'market'" @click="app.goPage('/pages/nft/market/index',-1)" class="mix-btn primarybtn" >返回市场</view>
			<view v-else @click="app.goPage('/pages/nft/index/index',-1)" class="mix-btn primarybtn" >返回首页</view>
		</view>
		
	</view>
</template>

<!-- 需要把 uni.webview.1.5.4.js 下载到自己的服务器 -->
    <script type="text/javascript" src="https://unpkg.com/@dcloudio/uni-webview-js@0.0.3/index.js"></script>
<script>
	export default {
		data() {
			return {
				from:'',
				baseBgColor:'',
				type:'',
				order_id:0,
				tip:'等待支付结果...',
				icon:'clock',
				
			}
		},
		onLoad(options){
			console.log(options);
			this.from = options.from;
			this.type = options.payType;
			this.order_id = options.order_id;
			if (this.type == 'order' || this.type == 'market'){
				this.getOrderInfo();
			}else if (this.type == 'recharge'){
				this.getRechargeInfo();
			} else if (this.type == 'my_init'){
				this.icon = 'checkmark';
				this.tip = '认证成功';
				uni.setNavigationBarTitle({
					title: '认证结果'
				})
			}
		},
		methods: {
			//获取订单信息
			getOrderInfo() {
				this.$u.post('nft/api.order/getInfo', {
					'order_id': this.order_id,
					'showLoading':false
				}).then(res => {
					if (res.data.pay_status == 0){
						setTimeout(() => {
							this.getOrderInfo();
						},10000);
						return false;
					}
					if (res.data.pay_status == 1){
						this.icon = 'checkmark';
						this.tip = '支付成功';
					}
				})
			},
			//获取充值信息
			getRechargeInfo() {
				this.$u.post('member/api.wallet/getRechargeInfo', {
					'order_id': this.order_id,
					'showLoading':false
				}).then(res => {
					console.log('res',res);
					if (res.data.status == 0){
						setTimeout(() => {
							this.getRechargeInfo();
						},10000);
						return false;
					}
					if (res.data.status == 9){
						this.icon = 'checkmark';
						this.tip = '充值成功';
					}
				}).catch(err => {
					console.log('err',err);
				})
			},
		}
	}
</script>

<style lang='scss'>
	.page-body{
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	.success-icon{
		background-color: #18B566;
		padding:40rpx 40rpx;
		border-radius: 50%;
		margin-bottom: 20rpx;
	}
	.tit{
		font-size: 38rpx;
		color: #303133;
	}
	.btn-group{
		padding-top: 100rpx;
	}
	.mix-btn {
		margin-top: 30rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 600rpx;
		height: 80rpx;
		font-size: $font-lg;
		/* color: #fff; */
		/* border-radius: 10rpx; */
		
	}
</style>
