<template>
	<view class="container">
		<view class="left" :style="{color: leftColor}">{{name}}</view>
		<view class="right" :style="{color: color}">{{number}}{{unit}}</view>
	</view>
</template>

<script>
	export default {
		name:"limit",
		props: {
			name: {
				type: [Number,String],
				default: '限量'
			},
			number: {
				type: [Number,String],
				default: '0'
			},
			unit: {
				type: String,
				default: '份'
			},
			leftColor: {
				type: String,
				default: '#2D2D2D'
			},
			color: {
				type: String,
				default: '#FFFFFF'
			},
		},
		data() {
			return {
				
			};
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		display: flex;
		align-items: center;
		height: 36rpx;
		border-radius: 4rpx;
		overflow: hidden;
		
		.left,
		.right {
			padding: 0 12rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 22rpx;
			font-family: PingFang SC;
			font-weight: 500;
			height: 36rpx;
			line-height: 22rpx;
		}
		.left {
			background: #ECC79E;
			color: #2D2D2D;
			border-top-left-radius: 4rpx;
			border-bottom-left-radius: 4rpx;
		}
		.right {
			background: #494949;
			color: #FFFFFF;
			border-top-right-radius: 4rpx;
			border-bottom-right-radius: 4rpx;
			min-width: 100rpx;
		}
	}
</style>