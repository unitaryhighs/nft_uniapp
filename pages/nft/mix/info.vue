<template>
	<view class="page-body" :class="[app.setCStyle()]">
		<ji-nav-bar v-if="!wechat" class="ji-nav-bar" ref="navBar" type="transparentFixed" bgColor="#1E1E1F" :withPadding="false" fontColor="#ffffff">
			<view class="preview" slot="default" style="color: #fff">合成</view>
		</ji-nav-bar>
		<!-- <view class="flex fh p30 syn_list box-bg-base">
			<view class="img">
				<image :src="nftInfo.pic" mode="widthFix"></image>
			</view>
			<view class="color-ff ml20">
				<view class="fs30">{{nftInfo.nft_name}}</view>
				<view class="fs24 mt10 flex fh"> <text class="spot"></text><text class="ml10">限量：{{nftInfo.nums}}</text>  
				<text class="ml10">剩余：{{nftInfo.stock}}</text></view>
				<view class="fs24 mt10">{{nftInfo.sell_date_start}} 至 {{nftInfo.sell_date_end}}</view>
			</view>
		</view> -->
		<!-- #ifdef APP-PLUS -->
		<view class="p30" style="padding-top: 190rpx;position: relative;">
		<!-- #endif -->
		<!-- #ifndef APP-PLUS -->
		<view class="p30" style="padding-top: 150rpx;position: relative;">
		<!-- #endif -->
			<image src="/static/images/light.png" mode="widthFix" style="width: 100%;position: absolute;left: 0;top: 0;"></image>
			<view class="">
				<!-- #ifdef APP-PLUS -->
				<view class="img" style="margin-top: 190rpx;">
				<!-- #endif -->
				<!-- #ifndef APP-PLUS -->
				<view class="img" style="margin-top: 150rpx;">
				<!-- #endif -->
					<!-- <image :src="nftInfo.pic" mode="aspectFill"></image> -->
					<u-image height="100%" border-radius="20" :fade="false" :lazy-load="true" :src="nftInfo.pic" mode="aspectFill">
						<u-loading size="50" mode="flower" slot="loading"></u-loading>
					</u-image>
				</view>
				<view class="img_bp">
					<!-- <image :src="nft_bottom_bg" mode=""></image> -->
					<image src="@/static/images/zst.png" mode=""></image>
				</view>
				<view class="flex" style="justify-content: center;">
					<view class="decorate_img">
						<image src="@/static/images/tit_rl.png" mode=""></image>
					</view>
					<view class="ml30 mr30">
						<view class="fs40 color-ff text-center ellipsis" style="margin-top: -10rpx;max-width: 400rpx;">{{nftInfo.nft_name}}</view>
						<view class="mt20 fs28 color-ff text-center">
							<text>限量：{{nftInfo.nums}}</text>
							<text style="margin-left: 30rpx;">剩余：{{nftInfo.stock}}</text>
						</view>
					</view>
					<view class="decorate_img" style="transform: rotateY(180deg);">
						<image src="@/static/images/tit_rl.png" mode=""></image>
					</view>
				</view>
			</view>
			<view class="material br20 mt40 p40 box-bg-base">
				<view class="flex" style="justify-content: center;">
					<view class="line"><image src="/static/images/line.png" mode=""></image></view>
					<view class="fs30 color-ff ml10 mr10">合成材料</view>
					<view class="line rotate"><image src="/static/images/line.png" mode=""></image></view>
				</view>
				<view class="flex list_box mt50">
					<view v-for="(item, index) in nftInfo.mix_list" :key="index" class="list relative">
						<!-- <image :src="baseImgUrl+item.nft_pic" mode="aspectFill"></image> -->
						<u-image height="100%" border-radius="10" :fade="false" :lazy-load="true" :src="baseImgUrl+item.nft_pic" mode="aspectFill">
							<u-loading size="50" mode="flower" slot="loading"></u-loading>
						</u-image>
						<view  class="tit_box">
							{{item.have_num}}/{{item.need_num}}
						</view>
					</view>
				</view>
			</view>
			<view class=" p30 br20 mt20 box-bg-base">
				<view class="fs32 color-ff">
					合成说明
				</view>
				<view class="fs26 color-ff mt30" v-html="setting.nft_mix_desc"></view>
			</view>
		</view>
		<view class="blank"></view>
		<view class="btn">
			<button v-if="nftInfo.is_mix==0" size="default" shape="circle"  class="primarybtn bg-cc color-ff" type="warning" >合成</button>
			<button v-else size="default" shape="circle" class="primarybtn" type="warning" @click="runMix()">合成</button>
		</view>
		
		<u-modal v-model="showDialog" width="500rpx" z-index="101" :show-confirm-button="false" :show-title="false" :mask-close-able="true">
			<view class="Dialog box-bg-base text-center">
				<image class="tit_img" src="/static/images/get_nft_title.png" mode="heightFix"></image>
				<view class="nft_img">
					<image :src="nftInfo.pic" mode=""></image>
				</view>
				<view class="color-ff fs28 p30">{{nftInfo.nft_name}}</view>
			</view>
		</u-modal>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				baseImgUrl: this.config.baseImgUrl,
				setting: {},
				nftInfo:{},
				showDialog:false,
				isRunMix:false,
				wechat: false,
			}
		},
		onLoad(options) {
			if (options.scene){//获取小程序的场景值，用于获取分享者的token
				let scene = options.scene.split('_');
				uni.setStorageSync("share_token",scene[0]);
				this.nft_id = scene[1];
			}else{
				this.nft_id = options.nft_id;
			}
			
			// 判断微信浏览器
			// #ifdef H5
			let ua = window.navigator.userAgent.toLowerCase()
			if (ua.match(/MicroMessenger/i) == 'micromessenger') {
				// do something
				this.wechat = true;
			}
			// #endif
		},
		onPullDownRefresh() {
			this.getInfo();
		},
		onShow() {
			this.getInfo();
			
			let descInfo = uni.getStorageSync('descInfo');
			if(!descInfo || this.app.refreshData(this.$mp.page.route, Date.now(),false)){
				this.$u.api.getDescInfo().then(res => {
					uni.setStorageSync('descInfo',res.data.setting);
					this.setting = res.data.setting;
				}).catch(err => {
					close(err)
				})
			} else {
				this.setting = descInfo;
			}
		},
		onPageScroll(e) {
			this.$refs.navBar.pageScroll(e);
		},
		onBackPress() {
			return this.app.backPress([
				{obj: this, key: 'showDialog'},
			])
		},
		methods:{
			//获取信息
			getInfo() {
				this.$u.post('nft/api.mix/getInfo', {
					'nft_id': this.nft_id
				}).then(res => {
					this.nftInfo = res.data;
					this.nftInfo.pic = this.baseImgUrl + this.nftInfo.pic;
				})
			},
			//执行合成
			runMix(){
				if (this.isRunMix == true){
					return false;
				}
				this.isRunMix = false;
				this.$u.post('nft/api.flow/runMix', {
					'nft_id': this.nft_id
				}).then(res => {
					this.showDialog = true;
					this.getInfo();
				}).catch(res=>{
					this.isRunMix = false;
				})
			}
		}
	}
</script>

<style lang="scss">
	
	.img{
		width: 400rpx;
		height: 400rpx;
		margin: 0 auto;
		position: relative;
		border-radius: 20rpx;
		overflow: hidden;
		image{
			width: 100%;
			height: 100%;
		}
	}
	.img_bp{
		width: 582rpx;
		height: 238rpx;
		margin: 0 auto;
		margin-top: 100rpx;
		image{
			width: 100%;
			height: 100%;
		}
	}
	.decorate_img{
		width: 62rpx;
		height: 106rpx;
		flex-shrink: 0;
		image{
			width: 100%;
			height: 100%;
		}
	}
	.amount_top{
		width: 76rpx;
		height: 40rpx;
		background: linear-gradient(116.57deg, rgba(247, 227, 201, 1) 0%, rgba(229, 193, 127, 1) 100%);
		border-radius: 4rpx;
		line-height: 40rpx;
	}
	.count_top{
		width: 125rpx;
		height: 40rpx;
		border: 1rpx solid rgba(229, 193, 127, 1);
		line-height: 40rpx;
		margin-left: -6rpx;
		border-left: none;
		color: rgba(229, 193, 127, 1);
	}
	
	.syn_list{
		height: 216rpx;
		border-radius: 20rpx;
		// .img{
		// 	width: 150rpx;
		// 	height: 150rpx;
		// 	image{
		// 		width: 100%;
		// 		height: 100%;
		// 	}
		// }
		.spot{
			border-radius: 50%;
			// padding: 20rpx;
			display: inline-block;
			width: 10rpx;
			height: 10rpx;
		}
	}
	.material{
		
		.line{
			width: 94rpx;
			height: 11rpx;
			image{
				width: 100%;
				height: 100%;
			}
		}
		.rotate{
			image{
				transform: rotate(180deg);
			}
		}
		.list_box{
			flex-wrap: wrap;
			justify-content: space-between;
			.list{
				width: 266rpx;
				height: 266rpx;
				margin-bottom: 42rpx;
				image{
					width: 100%;
					height: 100%;
					border-radius: 10rpx;
				}
			}
		}
	}

	.blank{
		height: 140rpx;
	}
	.btn{
		position: fixed;
		bottom: 40rpx;
		left: 30rpx;
		width: calc(100% - 60rpx);
		.primarybtn{
			border-radius: 45rpx;
			// color: #FFFFFF;
		}
	}
	.tit_box{
		position: absolute;
		top:10rpx;
		right: 10rpx;
		color: #FFFFFF;
		border-radius: 20rpx;
		padding: 5rpx 15rpx;
		background-color:rgba(29,29,46,0.3);
	}
	.Dialog{
		  width: 100%;
		  height: 580rpx;
		  border: 6rpx solid #FFFFFF;
		  border-radius: 24rpx;
		  .tit_img{
			  // width: 380rpx;
			  height: 86rpx;
			  margin: 30rpx auto;
		  }
		  .nft_img{
			  width: 320rpx;
			  height: 320rpx;
			  margin: 0 auto;
			  overflow: hidden;
			  border-radius: 12rpx;
			  image{
				  width: 100%;
				  height: 100%;
			  }
		  }
		 
	}
</style>
