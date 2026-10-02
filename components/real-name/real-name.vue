<template>
	<u-popup class="rnpop" v-model="rnPop" mode="center" width="600" height="464" border-radius="11">
		<view class="inner u-flex u-row-center u-col-center">
			<image class="mt40 icon" src="/static/images/tips-info.png" mode="aspectFill"></image>
			<view class="fs32 color-ff title">提示</view>
			<view class="fs28 subtitle">实名认证后才能购买数字藏品</view>
			<view class="btns mt60 u-flex u-row-center u-col-center">
				<view @click="rnPop=false" class="btn u-flex u-row-center u-col-center">再看看</view>
				<view @click="goCheckId" class="btn u-flex u-row-center u-col-center active">立即认证</view>
			</view>
		</view>
	</u-popup>
</template>

<script>
	export default {
		name:"real-name",
		data() {
			return {
				rnPop: false
			};
		},
		methods: {
			goCheckId(){
				this.rnPop = false;
				this.app.goPage('/pages/member/center/checkIdCard');
			},
		},
	}
</script>

<style lang="scss" scoped>
	.rnpop {
		.inner {
			flex-direction: column;
			
			.icon {
				width: 90rpx;
				height: 90rpx;
			}
			.title {
				margin-top: 32rpx;
			}
			.subtitle {
				margin-top: 58rpx;
				color: #8A8A8A;
			}
			.btns {
				.btn {
					width: 226rpx;
					height: 70rpx;
					border-radius: 35rpx;
					color: #A9A8AD;
					background: #666666;
					
					&.active {
						color: #7D583B;
						background: #ECC79E;
						margin-left: 30rpx;
					}
				}
			}
		}
	}
</style>