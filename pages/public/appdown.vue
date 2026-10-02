<template>
		<view class="page-body" :class="[app.setCStyle()]" :style="{'background-image':'url('+baseUrl+appset.app_bg+')'}">
			<view class="mainbox">
				<view class="text-center">
					<image style="width: 280rpx;" mode="widthFix" :src="baseUrl+appset.app_logo"></image>
				</view>
				<view class="text-center">
					<text class="fs32">{{appset.app_name}}</text>
					<text class="app_name_tip fs20">官方</text>
				</view>
				<button v-if="appset.app_apk_path" size="default" class="mt80 primarybtn" type="warning"  @click="downapp()">{{app.langReplace('下载安卓APP')}}</button>
				<button v-if="appset.app_ios_path" size="default" class="mt60 primarybtn" type="warning"  @click="downapp('ios')">{{app.langReplace('下载苹果APP')}}</button>
				<button size="default" class="mt60 primarybtn" type="warning"  @click="app.goPage(-1)">{{app.langReplace('返回')}}</button>
			</view>
			
			<view v-if="showtip" class="tipbox" @click="showtip=false">
				<view class="mask-box"></view>
				<image  style="width: 100%;z-index: 99;" mode="widthFix" src="/static/images/zhiyin.png"></image>
			</view>
		</view>
</template>

<script>
	export default {
		data() {
			return {
				setting: {},
				baseUrl: this.config.baseUrl,
				showtip:false,
				appset:{
					
				}
			};
		},
		onLoad(options) {
			this.setting = uni.getStorageSync("setting");
			let title = this.app.langReplace('APP下载');
			this.getAppSet();
			
		},
		onShow() {
			
		},
		watch: { /* 监听方法  开始*/
			
		},
		computed: {},
		methods: {
			downapp(type){
				let platfrom = this.app.getPlatform();
				if (platfrom == 'H5-WX'){
					this.showtip = true;
					return false;
				}
				if (type == 'ios'){
					window.location.href = this.appset.app_ios_path;
				}else{
					window.location.href = this.baseUrl + this.appset.app_apk_path;
				}
			},
			getAppSet(){
				this.$u.post('publics/api.Index/getAppSet').then(res => {
					this.appset = res.data;
				})
			}
		},
	}
</script>

<style>
	page {
		background-color: #fff;
	}
	.page-body{
		background-size: 100%;
		background-repeat: no-repeat;
		background-color: #FFFFFF;
	}
	.mainbox{
		padding: 0rpx 50rpx;
		padding-top: 280rpx;
	}
	.app_name_tip{
		font-style: inherit;
		background-color: #fdf0f7;
		border: 1rpx solid #f4d1cd;
		color: #e6a8a3;
		margin-left: 5rpx;
		vertical-align: middle;
		padding: 1rpx 4rpx;
	}
	.tipbox{
		position: fixed;
		top: 0rpx;
		width: 100%;
		height: 100%;
	}
</style>
