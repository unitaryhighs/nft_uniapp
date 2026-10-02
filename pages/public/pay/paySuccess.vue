<template>
	<view class="page-body" :class="[app.setCStyle(from)]">
		<view class="success-icon" style="margin-top: 200rpx;">
			<u-icon name="checkmark" color="#FFFFFF" size="88"></u-icon>
		</view>
		<text class="tip color-ff">{{tip}}</text>
		
		<view v-if="from == 'nft'" class="btn-group">
			<view  @click="success" class="mix-btn  primarybtn" >查看订单</view>
		</view>
		<view @click="app.goPage('/pages/member/center/index',-1)" class="mix-btn primarybtn" >返回个人中心</view>
		<view v-if="type == 'market'" @click="app.goPage('/pages/nft/market/index',-1)" class="mix-btn primarybtn" >返回市场</view>
		<view v-else @click="app.goPage('/pages/nft/index/index',-1)" class="mix-btn primarybtn" >返回首页</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				from:'',
				baseBgColor:'',
				type:'',
				order_id:0,
				tip:'支付成功'
			}
		},
		onLoad(options){
			this.from = options.from;
			this.type = options.payType;
			this.order_id = options.order_id;
			
			if (options.pay_code == 'offline'){
				this.tip = '提交成功，等待审核.';
			}
			
			// 重置缓存 - 需要刷新数据
			this.app.clearRefreshData();
		},
		methods: {
			success(){
				uni.reLaunch({
					url: '/pages/nft/order/info?order_id='+order_id
				})
			}
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
