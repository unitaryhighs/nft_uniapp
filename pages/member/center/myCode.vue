<template>
	<view class="page-body" :class="[app.setCStyle()]">
		<view style="height:100%;" >
			<view class="p50"></view>
			<u-swiper :height="870" :list="imgList" @change="changeImg" :title="false" :effect3d="true" :autoplay="false" imgMode="aspectFit" bg-color="rgba(0,0,0,0)"></u-swiper>
			<view class="text-center mt80" @click="showShareImg">
				<view class="primarybtn u-flex u-row-center u-col-center" style="width: 100rpx; height:100rpx;border-radius: 50%;margin: 0rpx auto;">
					<u-icon name="photo" color="#FFFFFF" size="60"></u-icon>
				</view>
				<view class="f32 mt10 color-ff">{{app.langReplace('生成海报')}}</view>
			</view>
		</view>
		<!-- <view class="share-image-box" v-if="shareShow==true">
			<div class="share-mask" @click="shareShow=false" ></div>
			<view class="share-main">
				<view class="share-close"  @click="shareShow=false">
					<u-icon name="close" color="#FFFFFF" size="32"></u-icon>
				</view>
				<view class="share-img">
						<img v-if="shareimgurl" :src="shareimgurl" mode="aspectFill" style="width: 100%;height: 100%;" ></img>
						<canvas canvas-id="mycanvas" style="width: 600px;height: 900px;opacity: 0;" v-show="canvasShow"></canvas>
				</view>
				<view class="btn-box flex">
					!-- #ifdef H5 --
					<view  class="btn" >{{app.langReplace('长按图片保存')}}</view>
					<view  class="btn ml20" @click="app.copy(shareInfo.share_url)">{{app.langReplace('复制链接')}}</view>
					!-- #endif  --
					!-- #ifndef H5 --
					<view  class="btn" @click="saveImage">{{app.langReplace('下载分享')}}</view>
					!-- #endif  --
				</view>
			</view>
		</view> -->
		
		<share-img ref="shareImgCom" :nftInfo="{pic: imgList.length?imgList[current].image:''}" type="share" @success="success"></share-img>
	</view>
</template>


<script>
	export default {
		data() {
			return {
				imgList:[],
				// is_share:false,
				is_wxmp:0, 
				img_url:'',
				baseImgUrl:this.config.baseImgUrl,
				current:0,
				shareShow:false,
				canvasShow:true,
				shareimgurl:'',
				shareimgurlList:{},
				shareInfo:{}
			}
		},
		onLoad(options) {
			this.app.isLogin(this);//强制登陆
			let title = this.app.langReplace('邀请好友');
			uni.setNavigationBarTitle({
				title
			})
			// this.getShareInfo();
			//微信公众号分享
			let setting = uni.getStorageSync('setting');
			let share_bg = setting.share_bg.split(',');
			share_bg.forEach((item,index)=>{
				let row = {};
				row.image = this.baseImgUrl+item;
				this.imgList.push(row);
			});
		},
		onShow: function() {},
		computed: {},
		onReady() {
		},
		methods: {
			changeImg(current){
				this.current = current;
			},
			showShareImg(){
				if (typeof(this.shareimgurlList[this.current]) != 'undefined'){
					this.$refs.shareImgCom.shareimgurl = this.shareimgurlList[this.current];
					this.$refs.shareImgCom.shareShow = true;
				} else {
					this.$refs.shareImgCom.shareimgurl = '';
					this.$refs.shareImgCom.canvasImage();
				}
				// if (this.$refs.shareImgCom.shareimgurl == ''){
				// 	this.$refs.shareImgCom.canvasImage();
				// }else{
				// 	 this.$refs.shareImgCom.shareShow = true;
				// }
			},
			success(e){
				this.shareimgurlList[this.current] = e;
			},
			// getShareInfo(){
			// 	let is_wxmp = 0;
			// 	//#ifdef MP-WEIXIN
			// 	is_wxmp = 1;
			// 	//#endif
			// 	this.$u.post('member/api.users/shareInfo', {
			// 		'is_wxmp':is_wxmp
			// 	}).then(res => {
			// 		if (res.code == 0){
			// 			return false;
			// 		}
			// 		this.is_share = true;
			// 		this.shareInfo = res.data;
			// 	})
			// },
			// async canvasImage(){
			//     this.shareShow = true;
			// 	if (typeof(this.shareimgurlList[this.current]) != 'undefined'){
			// 		this.shareimgurl = this.shareimgurlList[this.current];
			// 		return false;
			// 	}
			// 	this.shareimgurl = '';
			// 	uni.showLoading({
			// 		title:'加载中',
			// 		mask:true
			// 	})
			// 	this.canvasShow = true;
			// 	let ImgInfo = {};
			// 	let	myCanvas = uni.createCanvasContext('mycanvas', this);
			// 	this.app.circleImgTwo(myCanvas,'',0,0,600,900,11);
				
			// 	myCanvas.fillStyle = "#FFFFFF";
			// 	myCanvas.fill();
			// 	let bg_img = this.imgList[this.current].image;
			// 	ImgInfo = await this.app.getImgInfo(bg_img);
			// 	// myCanvas.drawImage(ImgInfo.path,0,0,ImgInfo.width,ImgInfo.height,0,0,600,600);
			// 	this.app.circleImgTwo(myCanvas,ImgInfo.path,0,0,600,600,11,true);
				
			// 	let share_headimgurl = '/static/images/logo.png';
			// 	ImgInfo = await this.app.getImgInfo(share_headimgurl);
			// 	this.app.circleImg(myCanvas,ImgInfo.path,202,625,21);
				
			// 	myCanvas.fillStyle = "#AF7D46";
			// 	let text_name = '智链猿宇宙';
			// 	let text_name_x = 262;
			// 	let text_name_y = 656;
			// 	myCanvas.font="500 28px/28px PingFang SC";
			// 	myCanvas.fillText(text_name,text_name_x,text_name_y);
				
			// 	// if (this.shareInfo.share_hb_text.length > 0){
			// 		myCanvas.fillStyle = "#000000";
			// 		let text = '邀请您一起探索链源数藏';
			// 		let text_x = 32;
			// 		let text_y = 716;
			// 		myCanvas.font="500 32px/32px PingFang SC";
			// 		myCanvas.setTextAlign('center');
			// 		myCanvas.fillText(text,300,text_y);
			// 	// }
				
			// 	ImgInfo = await this.app.getImgInfo('/static/images/share-bt.png');
			// 	myCanvas.drawImage(ImgInfo.path,0,0,ImgInfo.width,ImgInfo.height,0,750,600,150);
				
			// 	let share_qrcode = this.baseImgUrl+this.shareInfo.share_qrcode
			// 	ImgInfo = await this.app.getImgInfo(share_qrcode);
			// 	myCanvas.drawImage(ImgInfo.path,0,0, ImgInfo.width,ImgInfo.height,466,773,104,104);
				
			// 	//开始绘画，必须调用这一步，才会把之前的一些操作实施
			// 	myCanvas.draw(true,()=>{
			// 		uni.canvasToTempFilePath({
			// 			canvasId: 'mycanvas',
			// 			success: (res) => {
			// 				let path = '';
			// 				//#ifdef APP-PLUS  
			// 				var p = plus.io.convertLocalFileSystemURL(res.tempFilePath);
			// 				path = 'file:///'+p;
			// 				//#endif
			// 				// #ifndef APP-PLUS
			// 				path = res.tempFilePath;
			// 				// #endif
			// 				// 在H5平台下，tempFilePath 为 base64
			// 				this.shareimgurl = path;
			// 				this.shareimgurlList[this.current] = path;
			// 				this.canvasShow = false;
			// 				uni.hideLoading();
			// 			},
			// 			complete() {
			// 				uni.hideLoading();
			// 			},
			// 			fail: () => {
			// 				uni.showToast({
			// 					title: '名片加载失败',
			// 					duration: 2000 
			// 				});
			// 			}
			// 		});
			// 	});
				
			// },
			// saveImage(){
			// 	uni.showActionSheet({
			// 		itemList: ['保存图片'], 
			// 		success: (res) => {
			// 			if(res.tapIndex == 0){
			// 				uni.saveImageToPhotosAlbum({
			// 					filePath: this.shareimgurl,//    图片文件路径，可以是临时文件路径也可以是永久文件路径，不支持网络图片路径
			// 					success: () => {
			// 						uni.showToast({
			// 							title: '保存成功',
			// 							duration: 2000
			// 						});
			// 					},
			// 					fail: () => {
			// 						uni.showToast({
			// 							title: '保存失败',
			// 							duration: 2000 
			// 						});
			// 					}
			// 				});
			// 			}
			// 		},
			// 		fail: function (res) {
			// 			console.log(res.errMsg);
			// 		}
			// 	});
			// },
			// getImg(){
			// 	//#ifdef MP-WEIXIN
			// 		this.is_wxmp = 1;
			// 	//#endif
			// 	this.$u.post('member/api.users/getShareImg',{isnew:1,is_wxmp:this.is_wxmp}).then(res => {
			// 		this.img_url = res.data.img;
			// 	}).catch(res=>{
			// 		this.app.showModal(res.msg, -1);
			// 	})
			// }
		}
	}
</script>

<style lang="scss">
	.page-body{
		height: 100%;
	}
	.share-image-box{
		position: absolute;
		top: 0;
		width: 100%;
		height: 100%;
		z-index: 999;
		.share-mask{
			position: fixed;
			top:0px;
			left: 0px;
			width: 100%;
			height: 100%;
			background-color: #000;
			opacity: 0.85;
		}
		.share-main{
			position: absolute;
			top:0px;
			left: 0px;
			width: 100%;
			margin-top: 160rpx;
		}
		
		.share-close{
			position: absolute;
			top: 20rpx;
			right: 95rpx;
			width: 60rpx;
			height: 60rpx;
			// border: 2rpx solid #FFFFFF;
			background-color: rgba(0,0,0,.1);
			border-radius: 50%;
			display: flex;
			justify-content: center;
			align-items: center;
		}
		.share-img{
			width: 600rpx;
			height: 900rpx;
			margin: 0 auto;
			overflow: hidden;
			img{
				width: 600rpx;
				height: 900rpx;
				-webkit-touch-callout:default;
			}
		}
		.btn-box{
			padding-top: 40rpx;
			margin: 0rpx auto;
			width: 600rpx;
		}
		.btn-box .btn{
			min-width: 50%;
			padding: 0rpx 10rpx;
			// border: 2rpx solid #FFFFFF;
			margin: 0rpx auto;
			border-radius: 35rpx;
			line-height: 70rpx;
			text-align: center;
			color: #FFFFFF;
			background-color: rgba(255, 255, 255, .2);
			font-size: 32rpx;
		}
	}
	
</style>
