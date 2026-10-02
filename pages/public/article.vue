<template>
	<view class="page-body" :class="[app.setCStyle()]">
		<view class=" p20">
			<view class="title color-ff">{{item.title}}</view>
			<view class="mt20 color-94 fs26">
				<text class="time">
					<text class="type">{{item.cat_name}}</text>
					{{item.add_time}}
				</text>
			</view>
			<view  v-if="app.isMPTextModel() == false && item.is_video == 1" class="mt20" >
				<view v-if="videoPaly == false" class="video_cover" style="min-height:500rpx;">
					<image class="bg" :src="baseImgUrl+item.video_cover" style="height:100%;width:100%"></image>
					<image class="play" src="/static/images/video_icon/video_play.png" style="" @click="startplay"></image>
				</view>
				<video v-else  :enable-progress-gesture="false" autoplay="true" @ended="videoPaly = false" @click="videoPaly = false"  :muted="sound" :src="baseImgUrl+item.video_url" style="width: 100%;" >
					<cover-image @click="changevoice" class="voice" :src="sound?mute:voice"></cover-image>
				</video>
			</view>
				<view class="detail-desc" v-html="item.content" ></view>
			<!-- <copyright></copyright> -->
		</view>
		<!-- <tabbar :_current="0" :getCartNum="0"></tabbar> -->
	</view>
</template>


<script>
	// import copyright from '@/pages/public/copyright';
	import tabbar from '@/pages/public/tabbar';
	export default {
		components: {
			// copyright,
			// tabbar,
		},
		data() {
			return {
				baseImgUrl: this.config.baseImgUrl,
				item:{},
				sound: false,
				mute:'/static/images/video_icon/mute.png',
				voice:'/static/images/video_icon/voice.png',
				videoPaly:false
			}
		},
		onLoad(options) {
			let title = this.app.langReplace('公告详情');
			uni.setNavigationBarTitle({
				title
			})
			if (options.id < 1){
				return this.app.showModal('传参错误.',-1);
			}
			this.getInfo(options.id);
			
			// #ifdef H5
			this.app.addELPopState();
			// #endif
		},
		// #ifdef H5
		onUnload() {
			this.app.rmvELPopState();
		},
		// #endif
		methods: {
			getInfo(id){
				this.$u.post('publics/api.article/getInfo',{id:id}).then(res => {
					this.item = res.data;
					//微信公众号分享
					let setting = uni.getStorageSync('setting');
					let shareimg = this.config.baseImgUrl+setting.logo;
					if (this.item.img_url != ''){
						shareimg = this.item.img_url;
					}
				})
			},
			changevoice(){
				this.sound = this.sound == false ? true : false;
			},
			startplay(){
				this.videoPaly = true;
			}
		}
	}
</script>

<style lang="scss">

.title{
	// margin-top: 20rpx;
	font-size: 32rpx;
	font-weight: bold;
	// text-align: center;
}

/*  详情 */
	.detail-desc{
		color: #fff;
		margin-top: 16rpx;
		padding-bottom: 50rpx;
		// min-height: 800rpx;
		img,
		image {
			width: 100% !important;
			vertical-align: middle;
		}
	}
	
	.video_cover {
	    width: 100%;
		height: 100%;
	    position: relative;
	}
	
	.video_cover .play {
	    position: absolute;
	    top: 50%;
	    left: 50%;
	    width: 130rpx !important;
	    height: 120rpx !important;
	    margin-top: -60rpx;
	    margin-left: -65rpx;
	}
	.video_cover .bg {
	    position: absolute;
	    left: 0;
	    top: 0;
	}
	
	.time {
		.type {
			color: $base-color;
			margin-right: 16rpx;
			font-size: 24rpx;
		}
	}
</style>
