<template>
	<view class="share-image-box" v-if="shareShow==true" @touchmove.stop.prevent>
		<div class="share-mask" @click="shareShow=false" ></div>
		<view class="share-main">
			<view class="share-close"  @click="shareShow=false">
				<u-icon name="close" color="#FFFFFF" size="32"></u-icon>
			</view>
			<view class="share-img">
					<!-- <canvas style="width: 100%;height:100%;" > -->
					<img v-if="shareimgurl" :src="shareimgurl" mode="aspectFill" style="width: 100%;height: 100%;"></img>
					<!-- </canvas> -->
					<canvas canvas-id="mycanvas" style="width: 600px;height: 900px;opacity: 0;position: fixed;left: -9999px;top: -9999px;"></canvas>
			</view>
			<view class="btn-box flex">
				<!-- #ifdef H5 -->
				<view  class="btn" >{{app.langReplace('长按图片保存')}}</view>
				<!-- #endif  -->
				<!-- #ifndef H5 -->
				<view  class="btn" @click="saveImage">{{app.langReplace('下载分享')}}</view>
				<!-- #endif  -->
				<view  class="btn ml20" @click="app.copy(shareInfo.share_url)">{{app.langReplace('复制链接')}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "share-img",
		props: {
			_id: {
				type: [String, Number],
				default: ''
			},
			nftInfo: {
				type: Object,
				default: () => {}
			},
			type: {
				type: String,
				default: ''
			},
		},
		data() {
			return {
				baseImgUrl: this.config.baseImgUrl,
				shareShow: false,
				shareUrl: '',
				shareimgurl: '',
			};
		},
		methods: {
			async canvasImage() {
				let shareInfo = {};
				let is_wxmp = 0;
				//#ifdef MP-WEIXIN
				is_wxmp = 1;
				//#endif

				let url,param;
				if (this.type == "blindBox") {
					url = 'nft/api.blind_box/shareInfo';
					param = {'id': this._id,'is_wxmp': is_wxmp};
				} else if (this.type == "collection") {
					url = 'nft/api.publics/shareCollectionInfo';
					param = {'id': this._id,'is_wxmp': is_wxmp};
				} else if (this.type == "goodsInfo") {
					url = 'nft/api.goods/shareInfo';
					param = {'nft_id': this._id,'is_wxmp': is_wxmp};
				} else if (this.type == "share") {
					url = 'member/api.users/shareInfo';
					param = {'is_wxmp': is_wxmp};
				}
				await this.$u.post(url, param).then(res => {
					shareInfo = res.data;
					this.shareInfo = shareInfo;
					this.shareUrl = res.data.share_url;
				})
				if (shareInfo.length < 1) {
					this.shareShow = false;
					return false;
				}
				this.shareShow = true;
				uni.showLoading({
					title: '加载中',
					mask: true
				})
				let ImgInfo = {};
				let	myCanvas = uni.createCanvasContext('mycanvas', this);
				this.app.circleImgTwo(myCanvas,'',0,0,600,900,11);

				myCanvas.fillStyle = "#FFFFFF";
				myCanvas.fill();
				let nft_img;
				 // = this.type == "collection" ? this.nftInfo.nft_pic : this.nftInfo.square_pic;
				if(this.type == "collection"){
					nft_img = this.nftInfo.nft_square_pic;
				} else if (this.type == "goodsInfo"){
					nft_img = this.nftInfo.square_pic;
				} else {
					nft_img = this.nftInfo.pic;
				}
				ImgInfo = await this.app.getImgInfo(nft_img);
				// myCanvas.drawImage(ImgInfo.path, 0, 0, 600, 600 / ImgInfo.width * ImgInfo.height);
				this.app.circleImgTwo(myCanvas,ImgInfo.path,0,0,600,600,11,true);
				
				if(this.type == 'share'){
					let share_headimgurl = '/static/images/logo.png';
					ImgInfo = await this.app.getImgInfo(share_headimgurl);
					this.app.circleImg(myCanvas,ImgInfo.path,202,625,21);
					
					myCanvas.fillStyle = "#AF7D46";
					let text_name = '智链猿宇宙';
					let text_name_x = 262;
					let text_name_y = 656;
					myCanvas.font="500 28px/28px PingFang SC";
					myCanvas.fillText(text_name,text_name_x,text_name_y);
					
					// if (this.shareInfo.share_hb_text.length > 0){
						myCanvas.fillStyle = "#000000";
						let text = '邀请您一起探索链源数藏';
						let text_x = 32;
						let text_y = 716;
						myCanvas.font="500 32px/32px PingFang SC";
						myCanvas.setTextAlign('center');
						myCanvas.fillText(text,300,text_y);
					// }
				} else {
					let nft_name = this.type == "blindBox" ? this.nftInfo.name : this.nftInfo.nft_name;
					if (nft_name.length > 14) {
						nft_name = nft_name.substring(0, 14) + '...';
					}
					myCanvas.fillStyle = "#000000";
					let nft_name_x = 32;
					let nft_name_y = 656;
					myCanvas.font="500 32px/32px PingFang SC";
					myCanvas.setTextAlign('center');
					myCanvas.fillText(nft_name,300,nft_name_y);
					
					myCanvas.fillStyle = "#AF7D46";
					let text_name = '发现一款超赞的数字藏品，快来看看吧';
					let text_name_x = 262;
					let text_name_y = 716;
					myCanvas.font="500 28px/28px PingFang SC";
					myCanvas.setTextAlign('center');
					myCanvas.fillText(text_name,300,text_name_y);
				}

				ImgInfo = await this.app.getImgInfo('/static/images/share-bt.png');
				myCanvas.drawImage(ImgInfo.path,0,0,ImgInfo.width,ImgInfo.height,0,750,600,150);
				
				let share_qrcode = this.baseImgUrl + shareInfo.share_qrcode;
				ImgInfo = await this.app.getImgInfo(share_qrcode);
				myCanvas.drawImage(ImgInfo.path,0,0, ImgInfo.width,ImgInfo.height,466,773,104,104);

				//开始绘画，必须调用这一步，才会把之前的一些操作实施
				myCanvas.draw(true, (ret) => {
					uni.canvasToTempFilePath({
						canvasId: 'mycanvas',
						success: (res) => {
							let path = '';
							//#ifdef APP-PLUS  
							var p = plus.io.convertLocalFileSystemURL(res.tempFilePath);
							path = 'file:///'+p;
							//#endif
							// #ifndef APP-PLUS
							path = res.tempFilePath;
							// #endif
							// 在H5平台下，tempFilePath 为 base64
							this.shareimgurl = path;
							this.$emit('success',path);
							uni.hideLoading();

						},
						complete(e) {
							uni.hideLoading();
						},
						fail: () => {
							uni.showToast({
								title: this.app.langReplace('加载失败'),
								duration: 2000
							});
						}
					});
				});

			},
			saveImage() {
				uni.showActionSheet({
					itemList: [this.app.langReplace('保存图片')],
					success: (res) => {
						if (res.tapIndex == 0) {
							uni.saveImageToPhotosAlbum({
								filePath: this.shareimgurl, //    图片文件路径，可以是临时文件路径也可以是永久文件路径，不支持网络图片路径
								success: () => {
									uni.showToast({
										title: this.app.langReplace('保存成功'),
										duration: 2000
									});
								},
								fail: () => {
									uni.showToast({
										title: this.app.langReplace('保存失败'),
										duration: 2000
									});
								}
							});
						}
					},
					fail: function(res) {
						console.log(res.errMsg);
					}
				});
			},
		}
	}
</script>

<style lang="scss" scoped>
	.share-image-box{
		position: fixed;
		top: 0;
		left: 0;
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
			top: 50%;
			left: 50%;
			width: 100%;
			transform: translate(-50%, -50%);
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
			min-width: 290rpx;
			width: 290rpx;
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
