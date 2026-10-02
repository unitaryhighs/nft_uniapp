<template>
	<view class="page-body" :class="[app.setCStyle(),wechat?'wechat':'']">
		<view class="swiper">
			<u-swiper :height="'100%'" :list="imgList" :title="false"  :effect3d-previous-margin="80" :autoplay="false" imgMode="aspectFill" border-radius="0"></u-swiper>
		</view>
		<tabbar ref="tabbar" :now_page="now_page" :getCartNum="0"></tabbar>
	</view>
</template>

<script>
	import tabbar from '@/pages/public/tabbar';
	export default {
		components: {
			tabbar
		},
		data() {
			return {
				wechat: false,
				baseImgUrl:this.config.baseImgUrl,
				imgList:[],
			}
		},
		onLoad(options) {
			let title = this.app.langReplace('展厅');
			uni.setNavigationBarTitle({
			　　title:title
			})
		
			// 判断微信浏览器
			// #ifdef H5
			let ua = window.navigator.userAgent.toLowerCase()
			if (ua.match(/MicroMessenger/i) == 'micromessenger') {
				// do something
				this.wechat = true;
			}
			// #endif
		
			this.now_page = this.$mp.page.route;
			this.getShowRoomImg();
		},
		onShow() {
			if(this.$refs.tabbar){
				this.$refs.tabbar.autoFun();
			}
		},
		methods: {
			getShowRoomImg(){
				this.$u.post('nft/api.publics/getShowRoomImg').then(res => {
					this.imgList = res.data.imgList;
				})
			}
		}
	}
</script>

<style lang="scss">
	.page-body {
		height: calc(100vh - 110rpx - var(--window-top));
		
		&.wechat {
			height: calc(100vh - 110rpx);
		}
		
		.swiper {
			height: 100%;
		}
	}
	// .content {
	// 	display: flex;
	// 	align-items: center;
	// 	justify-content: center;
	// 	flex-direction: column;
		
	// 	position: absolute;
	// 	left: 0;
	// 	top: 0;
	// 	right: 0;
	// 	bottom: 0;
	// 	padding-bottom: 200rpx;
	
	// 	&-image {
	// 		width: 400rpx;
	// 		height: 400rpx;
	// 	}
	// 	.tip{
	// 		margin-top: 82rpx;
	// 		color: $font-color-light;
	// 	}
	// }
	/deep/ .u-swiper-wrap {
		height: 100%;
		uni-swiper,
		.uni-swiper {
			height: 100% !important;
		}
	}
</style>