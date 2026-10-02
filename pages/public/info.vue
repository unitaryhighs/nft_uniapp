<template>
	<view class="page-body" :class="[app.setCStyle()]">
		<ji-nav-bar v-if="!wechat" class="ji-nav-bar" ref="navBar" type="transparentFixed" bgColor="#1E1E1F" 
		:withPadding="false" fontColor="#000000" :iconBorder="false"></ji-nav-bar>
		<view :style="{height: statusBarHeight+'rpx'}"></view>
		<view class=" p20">
			<view  class="detail-desc"  v-html="content" ></view>
		</view>
	</view>
</template>


<script>
	export default {
		data() {
			return {
				wechat: false,
				type:'',
				content:'',
				setting: {},
				statusBarHeight: 40,
			}
		},
		onLoad(options) {
			// #ifdef APP-PLUS
			if(this.$u.os() == 'android'){
				var Color = plus.android.importClass("android.graphics.Color");    
				    plus.android.importClass("android.view.Window");    
				    var mainActivity = plus.android.runtimeMainActivity();    
				    var window_android = mainActivity.getWindow();    
				    window_android.setNavigationBarColor(Color.parseColor("#FFFFFF"));
			};
			// #endif
			// 判断微信浏览器
			// #ifdef H5
			let ua = window.navigator.userAgent.toLowerCase()
			if (ua.match(/MicroMessenger/i) == 'micromessenger') {
				// do something
				this.wechat = true;
			}
			
			this.app.addELPopState();
			// #endif
			
			let info = this.$u.sys();
			this.statusBarHeight = info.statusBarHeight * 750 / info.windowWidth;
			
			this.type = options.type;
			if(this.type == 'licence'){
				this.content = '<img src="https://images.ccsnfr.cn/launch_image/licence.png">';
				return;
			}
			
			let descInfo = uni.getStorageSync('descInfo');
			if(!descInfo || this.app.refreshData(this.$mp.page.route, Date.now(),false)){
				this.$u.api.getDescInfo().then(res => {
					uni.setStorageSync('descInfo',res.data.setting);
					this.setting = res.data.setting;
					this.getInfo();
				}).catch(err => {
					console.log(err);
				})
			} else {
				this.setting = descInfo;
				this.getInfo();
			}
		},
		onUnload() {
			// #ifdef APP-PLUS
			if(this.$u.os() == 'android'){
				var Color = plus.android.importClass("android.graphics.Color");    
				    plus.android.importClass("android.view.Window");    
				    var mainActivity = plus.android.runtimeMainActivity();    
				    var window_android = mainActivity.getWindow();    
				    window_android.setNavigationBarColor(Color.parseColor("#313131"));
			};
			// #endif
			// #ifdef H5
			this.app.rmvELPopState();
			// #endif
		},
		methods: {
			getInfo(){
				// let data = {};
				// data.type = this.type;
				// this.$u.post('publics/api.index/info',data).then(res => {
				// 	let title = res.data.title;
				// 	uni.setNavigationBarTitle({
				// 		title
				// 	})
				// 	this.content = res.data.content;
				// })
				this.content = this.setting[this.type];
			}
		}
	}
</script>

<style>
	page {
		background-color: #fff;
	}
</style>
<style lang="scss">
	/deep/.detail-desc{
		color: #333;
		img{
			width: 100% !important;
			vertical-align: middle;
		}
		td {
			border-style: solid;
			border-width: 1px;
		}
		table {
			width: 100% !important;
		}
	}
</style>
