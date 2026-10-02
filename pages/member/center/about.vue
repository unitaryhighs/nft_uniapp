<template>
	<view class="page-body" :class="[app.setCStyle()]">
		<view class="info">
			<image class="info-logo" src="/static/images/app.png" mode="aspectFill"></image>
			<view class="info-title mt30">链源</view>
		</view>
		<view class="list mt80 plr30">
			<view class="item u-flex u-col-center" @click="app.goPage('/pages/public/info?type=about_us')">
				<view class="text u-flex-1">关于我们</view>
				<u-icon name="arrow-right" color="#fff" size="28"></u-icon>
			</view>
			<view class="item u-flex u-col-center" @click="app.goPage('/pages/public/info?type=licence')">
				<view class="text u-flex-1">平台资质证照</view>
				<u-icon name="arrow-right" color="#fff" size="28"></u-icon>
			</view>
		</view>
		<view class="bottom-pos fs24 color-66">
			<view class="text-center u-flex u-row-center">
				<view class="text text-center" @click="app.goPage('/pages/public/info?type=nft_user_sale_desc')">交易协议</view>
				<view class="text"  @click.stop="app.goPage('/pages/public/info?type=register_agreement')">服务协议</view>
				<view class="text" @click.stop="app.goPage('/pages/public/info?type=privacy_agreement')">隐私政策</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		}
	}
</script>

<style lang="scss">
	.page-body {
		text-align: center;
		color: #fff;
		
		.info {
			padding-top: 60rpx;
			
			&-logo {
				width: 200rpx;
				height: 200rpx;
			}
			&-title {
				font-size: 40rpx;
				font-weight: 600;
			}
		}
		.list {
			.item {
				background-color: $box-color-base;
				margin-top: 20rpx;
				border-radius: 20rpx;
				padding: 30rpx;
				
				.text {
					text-align: left;
				}
			}
		}
		.bottom-pos {
			position: fixed;
			width: 100%;
			bottom: 60rpx;
			padding-bottom: 0;
			padding-bottom: constant(safe-area-inset-bottom);
			padding-bottom: env(safe-area-inset-bottom);
			color: rgba(236, 199, 158, 0.5);
			
			.text {
				padding: 10rpx 20rpx;
			}
		}
	}
</style>
