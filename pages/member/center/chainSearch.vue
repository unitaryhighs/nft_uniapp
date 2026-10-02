<template>
	<view class="page-body p30" :class="[app.setCStyle()]">
		<view class="title color-ff text-center fs32">请输入HASH值（含区块链地址）</view>
		<view class="subtitle color-cc text-center fs24 mt10">支持账户、藏品相关区块链信息查询</view>
		<view class="code_box box-bg-base color-ff mt80">
			<textarea placeholder="请输入" v-model="code"/>
		</view>
		<button size="default" shape="circle" class="primarybtn" :class="!code?'disabled':''" type="warning" @click="search()">查询</button>
		<!-- 二维码 -->
		<view v-if="qrShow" class="mt30 br20 bg-white p20" style="width: 520rpx;min-height: 520rpx;margin: 0 auto;">
			<canvas v-if="qrcodeImg" style="width: 100%;height: 500rpx;" >
				<img :src="qrcodeImg" mode="aspectFill"  ></img>
			</canvas>
			<canvas v-else canvas-id="qrcode"  style="width: 500rpx;height: 500rpx;"/>
			<view class="text-center">请使用支付宝扫码</view>
		</view>
		
	</view>
</template>

<script>
	import uQRCode from '@/common/uqrcode.js' //引入uqrcode.js
	export default{
		data(){
			return{
				code:'',
				customStyle:{color:'#fff'},
				qrShow:false,
				qrcodeImg:''
			}
		},
		onLoad() {
			// #ifdef H5
			this.app.addELPopState();
			// #endif
		},
		// #ifdef H5
		onUnload() {
			this.app.rmvELPopState();
		},
		// #endif
		methods:{
			search(){
				if(this.code){
					this.app.goPage('/pages/member/center/collection-details?hash='+this.code);
				} else {
					uni.showToast({
						title: '请输入区块链HASH',
						icon: 'none'
					})
				}
				
			},
			// search(){
			// 	this.qrShow = false;
			// 	this.qrcodeImg = '';
			// 	if (this.code == ''){
			// 		uni.showToast({
			// 		    title: '请输入区块链HASH.',
			// 			icon:'none',
			// 		    duration: 2000
			// 		});
			// 		return false;
			// 	}
			// 	this.qrShow = true;
			// 	let url = 'https://ds.alipay.com/?scheme=alipays%3A%2F%2Fplatformapi%2Fstartapp%3FappId%3D2019032063606715%26page%3Dpages%252Fhome%252Findex%253Ftype%253Dtrans%2526from%253Daliyun%2526bizid%253D0a4d97e91fc34140b87196f743ca224e%2526hash%253D'+this.code;
			// 	uQRCode.make({
			// 		canvasId: 'qrcode',
			// 		componentInstance: this,
			// 		text: url,
			// 		size: 250,
			// 		margin: 0,
			// 		backgroundColor: '#ffffff',
			// 		foregroundColor: '#000000',
			// 		fileType: 'jpg',
			// 		errorCorrectLevel: uQRCode.errorCorrectLevel.H,
			// 		success: res => {}
			// 	}).then(res =>{
			// 		this.qrcodeImg = res;
			// 	})
			// },
		}
	}
</script>

<style lang="scss" scoped>
	.title {
		margin-top: 120rpx;
	}
	.code_box{
		padding: 25rpx 30rpx;
		border-radius: 24rpx;
		height: 200rpx;
	}
	.primarybtn{
		border-radius: 45rpx;
		margin-top: 80rpx;
		
		&.disabled {
			background-color: #666;
			color: #A9A8AD;
		}
	}
</style>
