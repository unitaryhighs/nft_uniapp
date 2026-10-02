<template>
	<view class="copyright-box ">
		<view class="mt20 u-flex u-row-center">
			<!-- <img width="100" :src="baseUrl+'/a_static/images/antchain.png'"> -->
			<image src="/static/images/antchain.png" mode="widthFix" style="width: 228rpx;"></image>
			<view class="ml20">提供技术支持</view>
		</view>
		<view class="mt10 color-33">
			<!-- <view>粤公网安备44030702004909号</view> -->
			<!-- <view v-if="setting.copyright">{{setting.copyright}}</view>
			<view v-if="setting.ipc_no" @click="app.toOutLink('https://beian.miit.gov.cn/');">{{setting.ipc_no}}</view>
			<view v-if="setting.tel">联系电话：{{setting.tel}}</view>
			<view v-if="setting.address">联系地址：{{setting.address}}</view> -->
		</view>
	</view>
</template>

<script>
	export default {
		name: "copyright",
		props: {
			
		},
		data() {
			return { 
				setting : uni.getStorageSync('setting'),
				baseUrl: this.config.baseUrl,
			}
		},
		computed:{
		},
		methods: {
			
		}
	}
</script>

<style lang="scss">
	.copyright-box{
		font-size: 26rpx;
		text-align: center;
		color: #cccccc;
		line-height: 40rpx;
		padding-bottom: 60rpx;
		padding-top:30rpx;
	}
</style>
