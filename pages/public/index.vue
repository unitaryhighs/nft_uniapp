<template>
	<view class="page-body " :class="[app.setCStyle()]">
		<u-modal v-model="show" :show-confirm-button="false" :show-title="false" >
			<view class="lh50 box-bg-base color-cc" style="padding-top: 20rpx;">
				<view class="mb20 mt20 fs36 color-ff text-center">隐私保护提示</view>
				<view class="fs28" style="line-height: 50rpx;padding: 20rpx 40rpx;white-space: pre-line;color: #818181;">为了向您提供服务，我们需要收集你的设备和个人信息，请您务必审慎阅读，充分理解《服务协议》和《隐私政策》各条款。
			    你可阅读<text class="link" @click="app.goPage('/pages/public/info?type=register_agreement')">《服务协议》</text>和<text class="link" @click="app.goPage('/pages/public/info?type=privacy_agreement')">《隐私政策》</text>了解详细信息。如您同意，请点击“同意”开始授受我们的服务。
				</view>
				<view class="p10 flex lh80 text-center mt20" style="border-top: 0.5px solid #444;">
					<view class="flex_bd pl10 pr10 bg-none" @click="cancel()" style="color: #818181;">不同意</view>
					<view class="flex_bd pl10 pr10" @click="confirm()" style="border-left: 0.5px solid #444;color: #ECC79E;">同意</view>
				</view>
			</view>
		</u-modal>
		<u-modal v-model="cancelShow" :show-confirm-button="false" :show-title="false" >
			<view class="lh50 box-bg-base color-cc" style="padding-top: 20rpx;">
				<view class="mb20 mt20 fs36 color-ff text-center">同意隐私协议方可继续</view>
				<view class="fs28" style="line-height: 50rpx;padding: 20rpx 40rpx;white-space: pre-line;color: #818181;">您需要同意本站相关协议，我们才能继续为您提供服务</view>
				<view class="p10 flex lh80 text-center mt20" style="border-top: 0.5px solid #444;">
					<!-- #ifdef APP-PLUS -->
					<view class="flex_bd pl10 pr10 bg-none" @click="quit" style="border-right: 0.5px solid #444;color: #818181;">退出应用</view>
					<!-- #endif -->
					<view class="flex_bd pl10 pr10" @click="showAgreemennt()" style="color: #ECC79E;">再次查看</view>
				</view>
			</view>
		</u-modal>
		<!-- <view v-if="cancelShow" class="cancelBox">
			<view class="color-ff">您未同意本站相关协议，暂不能使用本软件</view>
			<view class="lh80 mt60 fs36 mlr20   color-ff primarybtn" @click="showAgreemennt()">查看协议</view>
		</view> -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				show: false,
				cancelShow:false,
				url: '',
			}
		},
		onLoad(options) {
			uni.hideTabBar();
			if (options.scene){//获取小程序的场景值，用于获取分享者的token
				let scene = options.scene.split('_');
				uni.setStorageSync("share_token",scene[0]);
			}
			//页面带share_token传参，保存在缓存
			if (options.query && options.query.share_token){
				uni.setStorageSync("share_token",options.query.share_token);
			}
			let source = uni.getStorageSync("source");
			let appAuth = uni.getStorageSync("appAuth");
			if (appAuth == 1){
				return this.app.goPage(this.config.defaultIndex,-1);
			}else{
				this.show = true;
			}
			let setting = uni.getStorageSync('setting');
			let title = this.app.langReplace(setting.site_name);
			uni.setNavigationBarTitle({
			　　title:title
			})
			
			if(options.url){
				this.url = decodeURIComponent(options.url);
			}
		},
		methods: {
			confirm() {
				 uni.setStorageSync("appAuth",1);
				// return this.app.goPage(this.config.defaultIndex,-1);
				// #ifdef APP-PLUS
				uni.reLaunch({
					url: this.url?this.url:this.config.defaultIndex,
					animationType: 'fade-in',
					animationDuration: 200
				})
				// #endif
				// #ifdef H5
				window.location.href = this.url?this.url:this.config.defaultIndex;
				// #endif
			},
			cancel(){
				this.show = false;
				this.cancelShow = true;
			},
			showAgreemennt(){
				this.show = true;
				this.cancelShow = false;
			},
			quit(){
				let platform = uni.getSystemInfoSync().platform;
				if(platform == 'android'){
					plus.runtime.quit();
				} else if (platform == 'ios'){
					plus.ios.import('UIApplication').sharedApplication().performSelector('exit');
				}
			}
		}
	}
</script>

<style lang="scss">
.cancelBox{
	padding-top: 400rpx;
	text-align: center;
}
/deep/ .u-mode-center-box{
	background-color: transparent;
}
/deep/ .u-model{
	background-color: transparent;
}

.link {
	color: $btn-two-purplered;
}
</style>
