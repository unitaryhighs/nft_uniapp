<template>
	<view class="empty-content">
		<block v-if="isConnected">
			<image class="empty-content-image" src="/static/images/empty.png" mode="aspectFit"></image>
			<text class="tip">暂无相关信息~</text>
		</block>
		<block v-else>
			<image class="empty-content-image network" src="/static/images/network.png" mode="aspectFit"></image>
			<text class="tip">当前网络欠佳，请检查网络后重试~</text>
			<view class="btn" @click="refresh">刷新</view>
		</block>
	</view>
</template>

<script>
	export default {
		props: {
			src: {
				type: String,
				default: 'empty'
			},
		},
		data() {
			return {
				// typeSrc: {
				// 	empty: '/static/images/empty.png'
				// },
				isConnected: getApp().globalData.isConnected,
			}
		},
		// computed: {
		// 	setSrc(src) {
		// 		return this.typeSrc[this.src];
		// 	},
		// },
		created() {
			getApp().watch(this.network,'isConnected');
		},
		methods: {
			network(e){
				this.isConnected = e;
				this.$forceUpdate();
			},
			refresh(){
				uni.startPullDownRefresh({
					
				})
			},
		}
	}
</script>

<style lang="scss">
	.empty-content {
		height: 600rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;

		&-image {
			width: 437rpx;
			height: 329rpx;
			
			&.network {
				width: 425rpx;
				height: 294rpx;
			}
		}
		.tip{
			margin-top: 50rpx;
			color: #777;
		}
		.btn {
			margin-top: 48rpx;
			width: 226rpx;
			height: 70rpx;
			background: #666666;
			border-radius: 35rpx;
			font-size: 32rpx;
			color: #A9A8AD;
			display: flex;
			justify-content: center;
			align-items: center;
		}
	}
</style>
