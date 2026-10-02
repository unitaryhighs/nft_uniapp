<template>
	<view class="page-body" :class="[app.setCStyle()]">
		<ji-nav-bar v-if="!wechat" class="ji-nav-bar" ref="navBar" type="transparentFixed" bgColor="#1E1E1F" :withPadding="false" fontColor="#ffffff" :showShare="true" @share="showShareImg">
			<view class="preview" slot="default" style="color: #fff">盲盒详情</view>
		</ji-nav-bar>
		<view class="top_box">
			<image src="/static/images/light.png" mode="widthFix" style="width: 100%;position: absolute;left: 0;top: 0;"></image>
			<!-- #ifdef APP-PLUS -->
			<view style="padding-top: 190rpx;">
			<!-- #endif -->
			<!-- #ifndef APP-PLUS -->
			<view style="padding-top: 150rpx;">
			<!-- #endif -->
				<view class="img">
					<!-- <image :src="bbInfo.pic" mode=""></image> -->
					<u-image height="100%" border-radius="24" :fade="false" :lazy-load="true" :src="bbInfo.pic" mode="aspectFill">
						<u-loading size="50" mode="flower" slot="loading"></u-loading>
					</u-image>
				</view>
				<view class="img_bp">
					<!-- <image :src="nft_bottom_bg" mode=""></image> -->
					<image src="@/static/images/zst.png" mode=""></image>
				</view>
				<view class="flex good-info" style="justify-content: center;">
					<view class="decorate_img">
						<image src="@/static/images/tit_rl.png" mode=""></image>
					</view>
					<view class="ml30 mr30">
						<view class="fs40 color-ff text-center ellipsis-1 good-name" style="margin-top: -20rpx;max-width: 400rpx;">{{bbInfo.name}}</view>
						<!-- <view class="flex text-center mt20 fs24" style="justify-content: center;">
							<view class="amount_top color-00">限量</view>
							<view class="count_top">{{bbInfo.nums}}份</view>
						</view> -->
						<view class="mt20 u-flex u-row-center">
							<limit :number="bbInfo.nums"></limit>
						</view>
					</view>
					<view class="decorate_img" style="transform: rotateY(180deg);">
						<image src="@/static/images/tit_rl.png" mode=""></image>
					</view>
				</view>
				
				<view class="mt50">
					<u-divider color="#838384" border-color="#838384" bg-color="none" fontSize="28rpx" :half-width="195"><u-icon name="lock-fill" color="#7C7C7D" style="margin-right: 5rpx;" size="28"></u-icon>购买即可开启</u-divider>
				</view>
			</view>
			<view class="">
				<!-- <view class="box mt30 flex box-bg-base">
					<view class="fs34 color-ff flex_bd">{{bbInfo.name}}</view>
					<view class="color-ff fs40 ml30"><text class="fs24">￥</text>{{bbInfo.price}}</view>
				</view> -->
				<!-- <view class="box mt20 box-bg-base">
					<view class="color-ff fs32 mb30">
						盲盒信息
					</view>
					<view class="flex mb30 color-99" style="justify-content: space-between;">
						<text>盲盒数量</text><text>{{bbInfo.nums}}份</text>
					</view>
					<view class="flex mb10 color-99" style="justify-content: space-between;">
						<text>盲盒库存</text><text>{{bbInfo.stock}}份</text>
					</view>
				</view> -->
				<!-- <view class="box mt20 box-bg-base">
					<view class="color-ff fs32 mb30">
						盲盒藏品
					</view>
					<view class="flex fh mt20"  v-for="(item, index) in bbInfo.bind_nft" :key="index" @click="app.goPage('/pages/nft/goods/info?nft_id='+item.nft_id)">
						<view class="img2">
							<image :src="baseImgUrl+item.pic" mode="aspectFill"></image>
						</view>
						<view class="color-ff ml20 flex_bd">
							<view class="fs30 ellipsis">{{item.nft_name}}</view>
							<view class="flex fs24 text-center mt20 fh">
								<limit :number="item.limit_num"></limit>
								<view class="flex_bd text-right">￥{{item.price}}</view>
							</view>
							<view class="fs40 mt20 flex fh">
								<view class="flex fh">
									<image class="head" :src="baseImgUrl+item.creator_headimgurl" mode=""></image>
									<view class="ml10 fs28 color-99 ellipsis">{{item.creator_name}}</view>
								</view>
								<view class="fs26">开盒概率：{{item.win_pro}}%</view>
							</view>
						</view>
					</view>
				</view> -->
				<view class="box mt20 box-bg-base goods-info">
					<view class="color-ff fs32 mb30 goods-info-title">
						盲盒介绍
					</view>
					<view class="color-99 fs28 goods-info-content">
						<view v-html="bbInfo.desc" ></view>
					</view>
				</view>
				<view class="box mt20 box-bg-base">
					<view class="color-ff fs32 mb30">
						购买须知
					</view>
					<view class="color-99 fs28">
						<view v-html="setting.blind_box_buy_desc" ></view>
					</view>
				</view>
				<view class="blank"></view>
			</view>
		</view>
		
		
		<view class="fixed_btn flex fh">
			<!-- <view class="left flex fh">
				<view class="text-center lbtn" @click="app.goPage('/pages/nft/index/index')">
					<image src="/static/images/home.png" mode="aspectFill" style="width: 36rpx;height: 36rpx;"></image>
					<view class="fs20 mt10" style="color: #818181;">首页</view>
				</view>
				<view class="text-center lbtn" @click="showShareImg()">
					<image src="/static/images/share.png" mode="aspectFill" style="width: 33rpx;height: 32rpx;"></image>
					<view class="fs20 mt10" style="color: #818181;">分享</view>
				</view>
			</view> -->
			<view class="flex cbtn font-w700 u-row-center u-col-bottom">
				<text class="fs32" style="line-height: 36rpx;">￥</text>
				<text style="font-size: 48rpx;line-height: 48rpx;">{{bbInfo.price}}</text>
			</view>
			<view class="right">
				<view class="btn disable" v-if="bbInfo.wait_sale == 1" >
					<view class="fs32">即将开售</view>
					<view class="time fs24">
						<text v-if="times.day > 0">{{times.day}}天</text><text class="ml10">{{times.hou}}</text>:<text>{{times.min}}</text>:<text>{{times.sec}}</text>
					</view>
				</view>
				<view v-else-if="bbInfo.sys_is_buy == 1">
					<view v-if="bbInfo.is_exchange==1" class="btn" @click="exchangeShow=true">
						<view class="fs32">立即兑换</view>
					</view>
					<view v-else class="btn" @click="showBuy">
						<view class="fs32">立即购买</view>
					</view>
				</view>
				<view v-else class="btn disable">
					<view class="fs28">{{bbInfo.status_tip}}</view>
				</view>
			</view>
		</view>
		<u-modal v-model="buyShow" z-index="102" :show-confirm-button="false" :show-title="false" :mask-close-able="true">
			<view class="p20 mt20">
				<view class="code_box text-center color-99">
					购买数量：<u-number-box :min="1" :max="10" v-model="buy_number" @change="buyNumberChange"></u-number-box>
				</view>
				<button size="default" shape="circle" class="primarybtn mt20" type="warning" @click="addOrder()">立即购买</button>
			</view>
		</u-modal>
		<u-modal v-model="exchangeShow" z-index="103" :show-confirm-button="false" :show-title="false" :mask-close-able="true">
			<view class="p20 mt20">
				<view class="code_box bg-base">
					<u-input  placeholder="请输入兑换码" v-model="exchangeCode" type="text" :custom-style="{color:'#fff'}"></u-input>
				</view>
				<button size="default" shape="circle" class="primarybtn mt20" type="warning" @click="exchangeBlindBox">兑换</button>
			</view>
		</u-modal>
		
		<share-img ref="shareImgCom" :_id="id" :nftInfo="bbInfo" type="blindBox"></share-img>
		
		<real-name ref="realName"></real-name>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				id: '',
				baseImgUrl: this.config.baseImgUrl,
				setting: {},
				// nft_bottom_bg:'',
				bbInfo:{},
				times:{},
				buyShow:false,
				buy_number:1,
				exchangeShow:false,
				exchangeCode:'',
				// shareShow:false,
				// shareimgurl:"",
				// shareUrl:"",
				// canvasShow:true,
				addOrderPost:false,
				wechat: false,
				realName: null,
			}
		},
		async onLoad(options) {
			if (options.scene){//获取小程序的场景值，用于获取分享者的token
				let scene = options.scene.split('_');
				uni.setStorageSync("share_token",scene[0]);
				this.id = scene[1];
			}else{
				this.id = options.id;
			}
			// this.nft_bottom_bg = this.baseImgUrl + this.setting.nft_bottom_bg;
			
			// 判断微信浏览器
			// #ifdef H5
			let ua = window.navigator.userAgent.toLowerCase()
			if (ua.match(/MicroMessenger/i) == 'micromessenger') {
				// do something
				this.wechat = true;
			}
			// #endif
		},
		async onShow() {
			this.getInfo();
			
			if(await this.app.checkRealName(this)){
				this.realName = true;
			} else {
				this.realName = false;
			};
			
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
		async onPullDownRefresh() {
			await this.getInfo();
			uni.stopPullDownRefresh();
		},
		onBackPress() {
			return this.app.backPress([
				{obj: this.$refs.shareImgCom, key: 'shareShow'},
				{obj: this.$refs.realName, key: 'rnPop'},
				{obj: this, key: 'buyShow'},
				{obj: this, key: 'exchangeShow'}
			])
		},
		methods:{
			showBuy(){
				if(!this.app.checkToLogin(1)){
					return
				}
				if(!this.realName){
					this.$refs.realName.rnPop = true;
					return
				}
				this.buyShow = true;
			},
			//获取信息
			getInfo() {
				return new Promise((resolve,reject) => {
					this.$u.post('nft/api.blind_box/getInfo', {
						'id': this.id
					}).then(res => {
						this.bbInfo = res.data;
						this.bbInfo.pic = this.baseImgUrl + this.bbInfo.pic;
						if (res.data.wait_sale == 1){
							this.getReservTimeCount(res.data.sell_time_start_date);
						}
						resolve(res)
					}).catch(err => {
						reject(err)
					})
				})
			},
			getReservTimeCount(time){
				this.times = {
					day: '00',
					hou: '00',
					min: '00',
					sec: '00'
				};
				if (time == 0) return false; 
				if (typeof(this.reservTimeCount) != 'undefined'){
					clearInterval(this.reservTimeCount);
				}
				this.reservTimeCount=setInterval(()=>{
					let nowTime = new Date().getTime();
					//注：不论安卓还是ios，请将时间如 2020-02-02 20:20:20 转化为 2020/02/02 20:20:20 这种形式后再使用，否则无法转换，如下转换即可↓
					let transedPreTime= time.replace(/-/g,'/') //这里转化时间格式为以/分隔形式
					let preTime = new Date(transedPreTime).getTime()
					if(preTime - nowTime > 0){
						let time = (preTime - nowTime) / 1000;
						if (time > 0){
							let day = parseInt(time / (60 * 60 * 24));
							let hou = parseInt(time % (60 * 60 * 24) / 3600);
							let min = parseInt(time % (60 * 60 * 24) % 3600 / 60);
							let sec = parseInt(time % (60 * 60 * 24) % 3600 % 60);
							let msec = Math.floor(time * 1000 % 1000 / 100);
							this.times = {
								day: day<10?'0'+day:day,
								hou: hou<10?'0'+hou:hou,
								min: min<10?'0'+min:min,
								sec: sec<10?'0'+sec:sec
							};
						}else{
							
							if (this.bbInfo.wait_sale == 1){
								clearInterval(this.reservTimeCount);
								this.bbInfo.wait_sale = 0;
								this.bbInfo.sys_is_buy = 1;
							}
						}
					}else{
						if (this.bbInfo.wait_sale == 1){
							clearInterval(this.reservTimeCount);
							this.bbInfo.wait_sale = 0;
							this.bbInfo.sys_is_buy = 1;
						}
					}
				},1000)
			},
			exchangeBlindBox(){
				if (this.checkExchange == true){
					return false;
				}
				if (this.exchangeCode.length < 10){
					this.$u.toast(this.app.langReplace('请输入兑换码'));
					return false;
				}
				this.checkExchange = true;
				this.$u.post('nft/api.flow/exchangeBlindBox', {
					'exchangeCode': this.exchangeCode,
				}).then(res => {
					this.exchangeShow = false;
					this.app.showModal(res.msg);
				}).catch(res=>{
					this.checkExchange = false;
				})
			},
			buyNumberChange(e){
				this.buy_number = e.value;
			},
			addOrder(){
				if (this.addOrderPost == true){
					return false;
				}
				this.addOrderPost = true;
				this.$u.post('nft/api.flow/addBlindBoxOrder', {
					'id': this.id,
					'buy_number': this.buy_number,
				}).then(res => {
					if (res.code != 1){
						this.app.showModal(res.msg);
						return false;
					}
					uni.redirectTo({
						url: `/pages/nft/order/pay?from=nft&order_id=${res.data.order_id}`
					});
					this.addOrderPost = false;
				}).catch(res=>{
					this.addOrderPost = false;
				})
			},
			showShareImg(){
				if (this.$refs.shareImgCom.shareimgurl == ''){
					this.$refs.shareImgCom.canvasImage();
				}else{
					 this.$refs.shareImgCom.shareShow = true;
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	.good-info {
		.good-name {
			max-width: 400rpx;
		}
	}
	.top_box{
		position: relative;
		// height: 638rpx;
		// position: absolute;
		// left: 0;
		// right: 0;
		// top: 0;
		// z-index: 1;
		// background: url('@/static/images/light.png');
		// background-size: 100%;
		// background-repeat: no-repeat;
		.top_title {
			height: 90rpx;
			color: #FFFFFF;
		}
		.back-btn{
			position: absolute;
			left: 20rpx;
			top: 28rpx;
		}
		.img{
			width: 400rpx;
			height: 400rpx;
			margin: 0 auto;
			position: relative;
			border-radius: 20rpx;
			image{
				width: 100%;
				height: 100%;
				border-radius: 20rpx;
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
	}
	
	.box{
		
		border-radius: 24rpx;
		margin: 0 auto;
		padding: 30rpx;
		width: 690rpx;
	}
	.head{
		width: 48rpx;
		height: 48rpx;
		border-radius: 50%;
		flex-shrink: 0;
	}
	.blank{
		height: 150rpx;
	}
	
	.fixed_btn{
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		background-color: #313131;
		height: 130rpx;
		z-index: 999;
		
		.left {
			padding: 0 30rpx;
			
			.lbtn {
				flex: 1;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
			}
		}
		.right {
			padding-right: 30rpx;
			text-align: center;
			
			.btn {
				width: 460rpx;
				height: 90rpx;
				border-radius: 45rpx;
				background-color: $btn-two-purplered;
				color: #7D583B;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				
				&.disable {
					background-color: #666666;
					color: #A9A8AD;
				}
				
				.fs32 {
					font-size: 32rpx;
					line-height: 32rpx;
					height: 32rpx;
				}
				.fs24 {
					font-size: 24rpx;
					line-height: 32rpx;
					height: 32rpx;
				}
				.time {
					margin-top: 4rpx;
				}
			}
		}
		// .time{
		// 	min-width: 350rpx;
		// 	border: 2rpx solid #A7A3F6;
		// 	border-radius: 8rpx;
		// 	padding: 0rpx 20rpx;
		// }
		// .btn{
		// 	flex: 1;
		// 	// color: #FFFFFF;
		// 	height: 90rpx;
		// 	background: $btn-two-purplered;
		// 	border-radius: 45rpx;
		// 	text-align: center;
		// 	line-height: 90rpx;
		// 	font-size: 32rpx;
		// }
	}
	
	.img2{
		width: 200rpx;
		height: 200rpx;
		border-radius: 12rpx;
		image{
			width: 100%;
			height: 100%;
			border-radius: 12rpx;
		}
	}
	.amount{
		width: 76rpx;
		height: 40rpx;
		background: $btn-two-purplered;
		border-radius: 4rpx;
		line-height: 40rpx;
	}
	.count{
		width: 125rpx;
		height: 40rpx;
		border: 1rpx solid $border-color-base;
		line-height: 40rpx;
		margin-left: -6rpx;
		border-left: none;
		border-top-right-radius: 4rpx;
		border-bottom-right-radius: 4rpx;
	}
	.amount_top{
		width: 76rpx;
		height: 40rpx;
		background: $btn-two-purplered;
		border-radius: 4rpx;
		line-height: 40rpx;
	}
	.count_top{
		width: 125rpx;
		height: 40rpx;
		border: 1rpx solid $border-color-base;
		line-height: 40rpx;
		margin-left: -6rpx;
		border-left: none;
		color: rgba(229, 193, 127, 1);
		border-top-right-radius: 4rpx;
		border-bottom-right-radius: 4rpx;
	}
	
	.code_box{
		padding: 15rpx 20rpx;
		border-radius: 24rpx;
		margin: 0 auto;
	}
	
	.head_b{
		width: 40rpx;
		height: 40rpx;
		border-radius: 50%;
		overflow: hidden;
		image{
			width: 100%;
			height: 100%;
			border-radius: 50%;
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
	
	.goods-info {
		padding: 0;
		
		&-title {
			padding: 30rpx 30rpx 0;
		}
		/deep/ &-content {
			border-bottom-left-radius: 24rpx;
			border-bottom-right-radius: 24rpx;
			overflow: hidden;
			vertical-align: bottom;
			
			image,
			img,
			.uni-image {
				border-bottom-left-radius: 24rpx;
				border-bottom-right-radius: 24rpx;
				vertical-align: bottom;
			}
		}
	}
</style>
