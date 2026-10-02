<template>
	<view id="page">
		<ji-nav-bar v-if="!wechat" class="ji-nav-bar" ref="navBar" type="fixed" bgColor="transparent" :withPadding="false" fontColor="#ffffff"></ji-nav-bar>
		<view class="bg-box">
			<image src="https://images.ccsnfr.cn/launch_image/model_preview_bg.jpg" mode="aspectFill" class="bg"></image>
		</view>
		<view class="container">
			<model ref="model" :scale="0.015"
			:url="model" 
			:control="true"
			></model>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				wechat: false,
				model: '',
			}
		},
		onLoad(e) {
			if(e.model){
				this.model = e.model;
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
		methods: {
			
		}
	}
</script>

<style lang="scss" scoped>
	#page {
		width: 100vw;
		height: 100vh;
		background-color: #ccc;
		
		.container {
			position: fixed;
			left: 0;
			right: 0;
			top: 0;
			bottom: 0;
			z-index: 1;
		}
		.bg-box {
			position: fixed;
			left: 0;
			right: 0;
			top: 0;
			bottom: 0;
			z-index: 0;
			width: 100%;
			height: 100%;
			
			&::after {
				content: '';
				position: absolute;
				left: 0;
				right: 0;
				top: 0;
				bottom: 0;
				backdrop-filter: blur(60px);
			}
			.bg {
				width: 100%;
				height: 100%;
			}
		}
	}
</style>
