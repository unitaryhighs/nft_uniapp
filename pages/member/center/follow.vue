<template>
	<view class="page-body">
		<scroll-view class="hb100" scroll-y @scrolltolower="loadData">
			<view class="p30">
				<view class="flex fh mt30 pb30" style="border-bottom: 1rpx solid #2C2C2D;">
					<view class="follow_img"><image src="https://img.js.design/assets/img/62bd0cec9ea116046638e22e.png" mode=""></image></view>
					<view class="ml20">
						<view class="fs30 color-ff">NFT创作者</view>
						<view class="fs26 color-99 mt20">ID:34834</view>
					</view>
					<view class="follow_btn color-99 fs30 fll">
						已关注
					</view>
				</view>
				<view class="flex fh mt30 pb30" style="border-bottom: 1rpx solid #2C2C2D;">
					<view class="follow_img"><image src="https://img.js.design/assets/img/62bd0cec9ea116046638e22e.png" mode=""></image></view>
					<view class="ml20">
						<view class="fs30 color-ff">NFT创作者</view>
						<view class="fs26 color-99 mt20">ID:34834</view>
					</view>
					<view class="follow_btn color-99 fs30 fll">
						已关注
					</view>
				</view>
				<view class="flex fh mt30 pb30" style="border-bottom: 1rpx solid #2C2C2D;">
					<view class="follow_img"><image src="https://img.js.design/assets/img/62bd0cec9ea116046638e22e.png" mode=""></image></view>
					<view class="ml20">
						<view class="fs30 color-ff">NFT创作者</view>
						<view class="fs26 color-99 mt20">ID:34834</view>
					</view>
					<view class="follow_btn color-99 fs30 fll">
						已关注
					</view>
				</view>
				
			</view>
		</scroll-view>
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

<style lang="scss">
	.follow_img{
		width: 98rpx;
		height: 98rpx;
		image{
			width: 100%;
			height: 100%;
			border-radius: 50%;
		}
	}
	.follow_btn{
		width: 155rpx;
		height: 62rpx;
		border: 2rpx solid #999999;
		border-radius: 31rpx;
		text-align: center;
		line-height: 62rpx;
	}
</style>
