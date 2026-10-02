<template>
	<view class="container">
		<u-popup class="call-popup" v-model="show" mode="center" width="600rpx" border-radius="11" :closeable="false" negative-top="40">
			<image src="/static/images/share-top.png" mode="widthFix" style="width: 100%;margin-top: -54rpx;"></image>
			<view class="code_img">
				<image class="img" :src="kefu_qrcode" mode="aspectFill"></image>
			</view>
			<view class="fs24 color-00 text-center" style="line-height: 24rpx;margin-top: 36rpx;">扫一扫二维码，添加企业微信联系客服</view>
			<view class="fs32 text-center font-w700" style="margin-top: 26rpx;color: #FF5F01;line-height: 32rpx;">联系电话：{{setting.kefu_tel}}</view>
			<view class="btns" style="padding: 50rpx 0;">
				<!-- #ifdef APP-PLUS || MP -->
				<view class="btn" @click="downloadQRcode('https://images.ccsnfr.cn/launch_image/kefu.png')">
					<view class="text" hover-class="hover" hover-start-time="0" hover-stay-time="100">下载二维码</view>
				</view>
				<view class="btn" @click="call(setting.kefu_tel)">
					<view class="text" hover-class="hover" hover-start-time="0" hover-stay-time="100">拨打号码</view>
				</view>
				<!-- #endif -->
				<!-- #ifndef APP-PLUS || MP -->
				<view class="btn" @click="app.copy(setting.kefu_tel)">
					<view class="text" hover-class="hover" hover-start-time="0" hover-stay-time="100">复制号码</view>
				</view>
				<!-- #endif -->
			</view>
			<view class="close u-flex u-row-center u-col-center" @click="close">
				<u-icon name="close" color="#fff" size="28"></u-icon>
			</view>
		</u-popup>
	</view>
</template>

<script>
	export default {
		name:"kefu",
		props: {
			showKefu: {
				type: Boolean,
				default: false
			}
		},
		watch: {
			showKefu(n,o){
				this.show = n;
			},
			show(n,o){
				if(!n){
					this.$emit('update:showKefu',false);
				}
			},
		},
		data() {
			return {
				show: false,
				kefu_qrcode: '',
				baseImgUrl: this.config.baseImgUrl,
			};
		},
		created() {
			this.setting = uni.getStorageSync("setting");
			this.kefu_qrcode = this.baseImgUrl + this.setting.kefu_qrcode;
		},
		methods: {
			close(){
				this.$emit('update:showKefu',false);
			}
		}
	}
</script>

<style lang="scss" scoped>
	/deep/ .call-popup {
		.uni-scroll-view,
		.u-mode-center-box {
			overflow: unset !important;
		}
		.uni-scroll-view-content {
			background-color: #fff;
			border-radius: 11rpx;
		}
		
		.code_img {
			margin: 38rpx auto 0;
			width: 292rpx;
			height: 292rpx;
			background: #FFFFFF;
			border-radius: 14rpx;
			overflow: hidden;
		
			.img {
				width: 100%;
				height: 100%;
				border-radius: 14rpx;
			}
		}
		
		.btns {
			display: flex;
			justify-content: center;
			align-items: center;
			
			.btn {
				padding: 0 15rpx;
				
				.text {
					display: flex;
					justify-content: center;
					align-items: center;
					width: 244rpx;
					height: 80rpx;
					border-radius: 40rpx;
					color: #7D583B;
					font-size: 32rpx;
					line-height: 32rpx;
					background-color: #F4C89F;
					
					&.hover {
						background-color: $btn-two-purplered;
						color: $btn-color;
					}
				}
				
			}
		}
		
		.close {
			width: 74rpx;
			height: 74rpx;
			border: 2rpx solid #FFFFFF;
			background-color: #4b4b4c;
			border-radius: 50%;
			position: absolute;
			left: 50%;
			bottom: -110rpx;
			transform: translateX(-50%);
		}
	}
</style>