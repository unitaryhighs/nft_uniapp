<template>
	<view class="page-body p50">
		<view class="emptyCard">
			<view class="emptyurl"><image src="@/static/images/icon_card.png" mode=""></image></view>
			<view class="color-99 text-center mt40 fs28">暂无银行卡，请添加</view>
		</view>
		<view class="addCard color-ff flex fh fs32 mt60" style="justify-content: center;"><view class="add">+</view><view>添加银行卡</view></view>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				
			}
		},
		methods:{
			
		}
	}
</script>

<style lang="less">
	.page-body{
		background: #09081A;
	}
	.emptyCard{
		margin-top: 100rpx;
		.emptyurl{
			width: 150rpx;
			height: 105rpx;
			margin: 0 auto;
			image{
				width: 100%;
				height: 100%;
			}
		}
	}
	.addCard{
		background: #2D2D2D;
		border-radius: 8rpx;
		height: 96rpx;
	}
	.add{
		width: 46rpx;
		height: 46rpx;
		border: 1rpx solid #FFFFFF;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		font-size: 36rpx;
		margin-right: 20rpx;
	}
</style>
