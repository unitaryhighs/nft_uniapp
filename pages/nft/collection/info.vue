<template>
	<view class="page-body " :class="[app.setCStyle()]">
		<ji-nav-bar v-if="!wechat" class="ji-nav-bar" ref="navBar" type="transparentFixed" bgColor="#1E1E1F" :withPadding="false" fontColor="#ffffff">
			<view class="preview" slot="default" style="color: #fff">藏品信息</view>
		</ji-nav-bar>
		
		<goods-info
		:show3d="show3d"
		:square_pic="nftInfo.nft_square_pic"
		:pic="nftInfo.nft_pic"
		:nft_name="nftInfo.nft_name"
		:limit_sale_num="nftInfo.limit_sale_num"
		:nums="nftInfo.nums"
		:pic_thumb="nftInfo.nft_pic_thumb"
		:big_pic="nftInfo.nft_pic"
		></goods-info>
		
		<view class="color-ff box fs32 box-bg-base mt40 ">
			<view class="fs32">{{nftInfo.nft_name}}</view>
			<view class="flex mt40">
				<view class="flex fh" @click="app.goPage('/pages/nft/collection/creator?creator_id='+nftInfo.creator_id)">
					<view class="head"><image :src="nftInfo.creator_headimgurl" mode=""></image></view>
					<view class="ml10 ellipsis">{{nftInfo.creator_name}}</view>
				</view>
				
			</view>
		</view>
		<view v-if="nftInfo.put_sale == 1" class="color-ff box fs32 box-bg-base mt20 " >
			<view class="flex">
				<view class="flex fh">
					正在寄售
				</view>
				<view >售价：￥<text class="fs44">{{nftInfo.put_sale_price}}</text></view>
			</view>
			<view v-if="nftInfo.look_order_id > 9" class="flex mt20 fs28">
				<view class="flex fh">
					已被下单锁定
				</view>
				<view>剩余支付时间：<text >{{times.hou}}</text>:<text>{{times.min}}</text>:<text>{{times.sec}}</text></view>
			</view>
		</view>
		
		<view class="box mt20 color-99 box-bg-base linefeed">
			<view class="color-ff fs32 mb30">
				藏品信息
			</view>
			<view class="mb30 color-99 flex">
				<text style="min-width: 150rpx;">合约地址</text>
				<view class="ellipsis-1">{{nftInfo.contract_address}}</view>
				<u-icon name="/static/images/copy.png" size="40" @click="app.copy(nftInfo.contract_address)"></u-icon>
			</view>
			<view v-if="nftInfo.chain_status>=2" class="mb30 text-center ">
				正在同步链上数据...
			</view>
			<block v-else>
				<view v-if="nftInfo.last_hash" class="mb30 flex">
					<text style="min-width: 150rpx;">交易Hash</text>
					<view class="ellipsis-1">{{nftInfo.last_hash}}</view>
					<u-icon name="/static/images/copy.png" size="40" @click="app.copy(nftInfo.last_hash)"></u-icon>
				</view>
			</block>
			<view class="flex mb30" style="justify-content: space-between;">
				<text>藏品编号</text><text  class="color-99">#{{nftInfo.token_id}}/{{nftInfo.nft_nums}}</text>
			</view>
			<view class="flex mb30" style="justify-content: space-between;">
				<text>流通数量</text><view  class="color-99">{{nftInfo.keep_num}}</view>
			</view>
			<block v-if="nftInfo.is_burn >= 1">
				<view class="mt30 color-red text-center">
					当前藏品已被销毁
				</view>
				<view  class=" mb20"  >
					<text>销毁Hash</text><view class="color-99" style="position: relative;">{{nftInfo.burn_hash}}<u-icon name="/static/images/copy.png" style="position: absolute; right: 0; border: 0;" color="#2979ff" size="40" @click="app.copy(nftInfo.burn_hash)"></u-icon></view>
				</view>
			</block>
			<view v-else-if="nftInfo.user_id > 0">
				<view class="flex mb30" style="justify-content: space-between;">
					<text>收藏时间</text><text  class="color-99">{{nftInfo.trannsfer_date}}</text>
				</view>
				<view class="flex mb30 fh" style="justify-content: space-between;">
					<view class="flex_bd ">持有人</view>
					<view >
						<view class="flex fh">
							<view class="head"><image :src="nftInfo.have_headimgurl" mode=""></image></view>
							<view class="ml10 color-99">{{nftInfo.have_nick_name}}</view>
						</view>
					</view>
				</view>
				<view class="flex mb20" style="justify-content: space-between;">
					<text>持有人手机</text><text  class="color-99">{{nftInfo.have_mobile}}</text>
				</view>
			</view>
		</view>
		<view class="box  mt20 box-bg-base goods-info">
			<view class="color-ff fs32 mb30 goods-info-title">
				藏品介绍
			</view>
			<view class="color-99 fs28 goods-info-content">
				<view v-html="nftInfo.nft_desc" ></view>
			</view>
		</view>
		<view class="box mt20 box-bg-base">
			<view class="color-ff fs32 mb10">
				购买须知
			</view>
			<view class="color-99 fs28">
				<view v-html="setting.nft_buy_desc" ></view>
			</view>
		</view>
		<view class="blank"></view>
		<view v-if="nftInfo.is_burn == 0" class="fixed_btn color-ff fs28 flex fh">
			<view v-if="nftInfo.can_sale == 1" class="item w100" @click="saleShow=true">
				<!-- <u-icon name="bag" color="#ffffff" size="40"></u-icon> -->
				<uni-icons type="shop" size="24" color="#fffffff"></uni-icons>
				<text class="text">寄售</text>
			</view>
			<view v-if="nftInfo.cancel_sale == 1" class="item w100" @click="cancelPutSale()">
				<!-- <u-icon name="close-circle" color="#ffffff" size="40"></u-icon> -->
				<uni-icons type="close" size="24" color="#fffffff"></uni-icons>
				<text class="text">取消寄售</text>
			</view>
			<view v-if="nftInfo.can_give == 1" class="item w100"  @click="transferShow=true">
				<!-- <u-icon name="gift" color="#ffffff" size="40"> -->
				<uni-icons type="gift" size="24" color="#fffffff"></uni-icons>
				</u-icon><text class="text">转赠</text>
			</view>
			<view v-if="nftInfo.can_buy == 1" class="item w100"  @click="goBuy()">
				<!-- <u-icon name="bag-fill" color="#ffffff" size="40"></u-icon> -->
				<uni-icons type="cart" size="24" color="#fffffff"></uni-icons>
				<text class="text">购买</text>
			</view>
			<view class="item w100" @click="showShareImg()">
				<!-- <u-icon name="share" color="#ffffff" size="40"> -->
				<uni-icons type="redo" size="24" color="#fffffff"></uni-icons>
				</u-icon><text class="text">分享</text>
			</view>
		</view>
		
		
		<!-- <u-modal v-model="saleShow" z-index="10" :show-confirm-button="false" :show-title="false" :mask-close-able="true">
			<view class="p30 color-ff box-bg-base" >
				<view class="text-center">寄售金额</view>
				<view class="code_box flex mt20 color-ff mb10" style="background: #666666;">
					<text class="mt5 mr10 lh60 ">￥</text><u-input :focus="true" maxlength="5" @input="changeSalePrice" @blur="changeSalePrice" @confirm="changeSalePrice" placeholder="请输入要寄售的价格" v-model="salePrice" type="number" :custom-style="{color:'#fff'}"></u-input>
				</view>
				<view class="fs28 mt10">寄售价格不能须大于1元.</view>
				<view v-if="nftInfo.nft_market_transfer_fee>0" class="fs28 mt10">
					服务费，成交价的<text class="font-w700 fs28">{{nftInfo.nft_market_transfer_fee}}%</text>
				</view>
				<view v-if="nftInfo.nft_market_creator_fee>0" class="fs28 mt10">
					版税，成交价的<text class="font-w700 fs28">{{nftInfo.nft_market_creator_fee}}%</text>
				</view>
				<block v-if="nftInfo.nft_market_transfer_fee>0 || nftInfo.nft_market_creator_fee>0" >
					<view class="fs28 mt10">以上费用将在出售成功后，到帐时扣除.</view>
					<view  class="fs28 mt10 font-w500">购入价格{{nftInfo.buy_price}}元，预计收入{{es_revenue}}元</view>
				</block>
				<view class="fs22 mt20">已阅读并同意上述规则及<text class="base-color" @click="app.goPage('/pages/public/info?type=nft_user_sale_desc')">《平台用户售卖服务协议》</text></view>
				<button size="default" shape="circle" class="primarybtn mt20" type="warning" @click="openPayPassWord('salePost')">寄售</button>
			</view>
		</u-modal> -->
		<sale-modal :saleShow.sync="saleShow" :salePrice.sync="salePrice" :es_revenue.sync="es_revenue" @openPayPassWord="(e)=>{openPayPassWord(e)}"
		:creator_fee="nftInfo.nft_market_creator_fee" :transfer_fee="nftInfo.nft_market_transfer_fee"></sale-modal>
		
		<u-modal v-model="transferShow" z-index="102" :show-confirm-button="false" :show-title="false" :mask-close-able="true">
			<view class="p30 box-bg-base color-ff">
				<view class="code_box" style="background: #666666;">
					<u-input  placeholder="请输入要转赠的手机号码" v-model="transferMobile" type="number" :custom-style="{color:'#fff'}"></u-input>
				</view>
				<button size="default" shape="circle" class="primarybtn mt30" type="warning" @click="transferInfo">转赠</button>
			</view>
		</u-modal>
		
		<u-modal v-model="transferInfoShow" z-index="103" :show-confirm-button="false" :show-title="false" :mask-close-able="true">
			<view class="transferInfoBox box-bg-base color-ff">
				<view class="headimgurl">
					<image style="width:120rpx; height:120rpx;" mode="aspectFill" :src="transferUinfo.headimgurl?baseImgUrl+transferUinfo.headimgurl:'/static/images/headimgurl.jpg'"></image>
				</view>
				<view class="fs28 text-center mt20">
					<view class="mt10" v-if="transferUinfo.nick_name">昵称：{{transferUinfo.nick_name}}</view>
					<view class="mt10">手机号码：{{transferUinfo.mobile}}</view>
				</view>
				<view class="text-center fs26 color-99 mt20">以上为受赠人的信息,请核实是否正确.</view>
				<view class="smll w100 mt30 p20 fs28">
					<view class="w50 p10 mlr10 text-center primarybtn " style="background:#666 !important;color: #FFFFFF;" @click="transferBack">重新填写</view>
					<view class="w50 p10 mlr10 text-center primarybtn" @click="openPayPassWord('transferNft')">确认转赠</view>
				</view>
			</view>
		</u-modal>
		
		<share-img ref="shareImgCom" :_id="id" :nftInfo="nftInfo" type="collection"></share-img>
		
		<payPassWord :payPassWordShow="payPassWordShow"   @closePayPassWord="closePayPassWord"   @finishPayPassWord="finishPayPassWord"></payPassWord>
	</view>
</template>

<script>
	// #ifdef H5
	import 'viewerjs/dist/viewer.css'
	import {component as Viewer} from 'v-viewer'
	// #endif
	import payPassWord from '@/pages/member/wallet/payPassWord';
	import three3d from '@/components/three3d';
	export default{
		components: {
			"three3d": three3d,
			payPassWord,
			// #ifdef H5
			Viewer
			// #endif
		},
		data(){
			return{
				baseImgUrl: this.config.baseImgUrl,
				setting: {},
				// nft_bottom_bg:'',
				id:0,
				nftInfo:{},
				salePrice:'',
				es_revenue:0,
				saleShow:false,
				transferShow:false,
				transferMobile:'',
				transferInfoShow:false,
				transferUinfo:{},
				// shareShow:false,
				// shareimgurl:"",
				// shareUrl:'',
				// canvasShow:true,
				rotateY:0,
				rotateType:'inc',
				is_post:false,
				times:{},
				reservTimeCount:'',
				payPassWordShow: false,
				pay_password:'',
				show3d:0,
				options: {
					'inline': false, // 是否启用inline模式
					'navbar': false, // 是否显示缩略图底部导航栏
					'title': false, // 是否显示当前图片标题，默认显示alt属性内容和尺寸
					'toolbar': false, // 是否显示工具栏
				},
				wechat: false,
				refreshData: false, //返回我的页时是否刷新数据
				tapBack: false, //是否点击了返回
			}
		},
		watch: {
			// 关闭弹窗时,重置价格
			saleShow(newName, oldName) {
				if(!newName){
					this.salePrice = null;
					this.es_revenue = null;
				}
			},
			// 关闭弹窗时,重置手机号
			transferShow(newName, oldName) {
				if(!newName){
					this.transferMobile = '';
				}
			},
		},
		onLoad(options) {
			if (options.scene){//获取小程序的场景值，用于获取分享者的token
				let scene = options.scene.split('_');
				uni.setStorageSync("share_token",scene[0]);
				this.id = scene[1];
			}else{
				this.id = options.id;
			}
			// this.nft_bottom_bg = this.baseImgUrl + this.setting.nft_bottom_bg;
			this.getInfo();
						
			// 判断微信浏览器
			// #ifdef H5
			let ua = window.navigator.userAgent.toLowerCase()
			if (ua.match(/MicroMessenger/i) == 'micromessenger') {
				// do something
				this.wechat = true;
			}
			
			this.app.addELPopState();
			// #endif
		},
		// #ifdef H5
		onUnload() {
			this.app.rmvELPopState();
		},
		// #endif
		onShow() {
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
		onBackPress(e) {
			let back = this.app.backPress([
				{obj: this.$refs.shareImgCom, key: 'shareShow'},
				{obj: this, key: 'transferInfoShow'},
				{obj: this, key: 'transferShow'},
				{obj: this, key: 'payPassWordShow'},
				{obj: this, key: 'saleShow'},
			])
			if(back){
				return true;
			} else if(this.refreshData){
				let pages = getCurrentPages(); // 当前页面
				let beforePage = pages[pages.length - 2]; // 前一个页面
				if(e.from == 'navigateBack' && this.tapBack){
					return false;
				}
				this.tapBack = true;
				uni.navigateBack({
					delta: 1,
					success: () => {
						beforePage.$vm.loadData('refresh');; // 执行前一个页面的刷新
					}
				});
				return true;
			} else {
				return false;
			}
		},
		methods:{
			// #ifdef H5
			//初始化预览组件
			inited(viewer) {
				this.$viewer = viewer;
			},
			// #endif
			//获取信息
			getInfo() {
				return new Promise((resolve,reject) => {
					let _this = this;
					this.$u.post('nft/api.publics/getCollectionInfo', {
						'id': this.id
					}).then(res => {
						this.nftInfo = res.data;
						this.nftInfo.nft_pic = this.baseImgUrl + this.nftInfo.nft_pic;
						// uni.downloadFile({
						// 	url: this.baseImgUrl + this.nftInfo.nft_pic,
						// 	complete(e) {
						// 		console.log(e);
						// 		if(e.errMsg == "downloadFile:ok"){
						// 			_this.nftInfo.nft_pic = e.tempFilePath;
						// 		} else {
						// 			_this.nftInfo.nft_pic = _this.baseImgUrl + _this.nftInfo.nft_pic;
						// 		}
						// 	}
						// })
						this.nftInfo.nft_pic_thumb = this.baseImgUrl + this.nftInfo.nft_pic_thumb;
						this.nftInfo.creator_headimgurl = this.baseImgUrl + this.nftInfo.creator_headimgurl;
						if (this.nftInfo.user_id > 0){
							this.nftInfo.have_headimgurl = this.baseImgUrl + this.nftInfo.have_headimgurl
						}
						if (this.nftInfo.look_order_id > 0){
							this.getReservTimeCount(this.nftInfo.exp_cancel_date);
						}
						if (this.nftInfo.nft_square_pic != ''){
							this.nftInfo.nft_square_pic = this.baseImgUrl + this.nftInfo.nft_square_pic;
							if (this.nftInfo.is_rotate_show == 1){
								this.show3d = 1;
							}
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
				if (!time) return false; 
				if (typeof(this.reservTimeCount) != 'undefined'){
					clearInterval(this.reservTimeCount);
				}
				this.reservTimeCount=setInterval(()=>{
					let nowTime = new Date().getTime();
					//注：不论安卓还是ios，请将时间如 2020-02-02 20:20:20 转化为 2020/02/02 20:20:20 这种形式后再使用，否则无法转换，如下转换即可↓
					let transedPreTime= time.replace(/-/g,'/') //这里转化时间格式为以/分隔形式
					let preTime = new Date(transedPreTime).getTime()
					let _time = (preTime - nowTime) / 1000;
					if (_time > 0){
						let day = parseInt(_time / (60 * 60 * 24));
						let hou = parseInt(_time % (60 * 60 * 24) / 3600);
						let min = parseInt(_time % (60 * 60 * 24) % 3600 / 60);
						let sec = parseInt(_time % (60 * 60 * 24) % 3600 % 60);
						let msec = Math.floor(_time * 1000 % 1000 / 100);
						this.times = {
							day: day<10?'0'+day:day,
							hou: hou<10?'0'+hou:hou,
							min: min<10?'0'+min:min,
							sec: sec<10?'0'+sec:sec
						};
					}else{
						clearInterval(this.reservTimeCount);
						this.getInfo();
					}
				},1000)
			},
			transferInfo(){
				if (this.transferMobile.length != 11){
					this.$u.toast(this.app.langReplace('请输入11位手机号码'));
					return false;
				}
				this.$u.post('nft/api.publics/getTransferInfo', {
					'mobile': this.transferMobile,
				}).then(res => {
					// this.transferShow = false;
					this.transferInfoShow = true;
					this.transferUinfo = res.data.userInfo;
				})
			},
			transferBack(){
				// this.transferShow = true;
				this.transferInfoShow = false;
			},
			openPayPassWord(transferType) {
				this.refreshData = true;
				let setting = uni.getStorageSync('setting');
				this.transferType = transferType;
				if (setting.sys_model_pay_password != 1){
					if (this.transferType == 'transferNft'){
						return this.transferNft();
					}else if (this.transferType == 'salePost'){
						return this.salePost();
					}
				}
				if (this.transferType == 'salePost'){
					if (this.salePrice <= 1){
						this.$u.toast(this.app.langReplace('寄售价格必须大于1'));
						return false;
					}
					if (Math.round(this.salePrice) != this.salePrice){
						this.$u.toast(this.app.langReplace('寄售价格必须为整数，不能带小数.'));
						return false;
					}
				}
				this.pay_password = '';
				this.$u.post('member/api.users/isSetPayPwd').then(res => {
					if (res.data.isset == 1){
						this.payPassWordShow = true;
					}else{
						let that = this;
						uni.showModal({
							title:  that.app.langReplace('提示'),
							content: res.msg,
							showCancel: true,
							confirmText: that.app.langReplace('设置支付密码'),
							cancelText: that.app.langReplace('取消支付'),
							success: function(res) {
								if (res.confirm) {
									uni.navigateTo({
										url: '/pages/member/center/editPayPassWord'
									});
								}
								if (res.cancel){
									that.payPassWordShow = false;
								}
							}
						});
					}
				});
			},
			closePayPassWord(){
				this.payPassWordShow = false;
			},
			finishPayPassWord(e){
				this.payPassWordShow = false;
				this.pay_password = e;
				if (this.transferType == 'transferNft'){
					return this.transferNft();
				}else if (this.transferType == 'salePost'){
					return this.salePost();
				}
			},
			transferNft(){
				if (this.is_post == true){
					return false;
				}
				this.is_post = true;
				this.$u.post('nft/api.flow/transferNft', {
					'id': this.id,
					'mobile': this.transferMobile,
					'pay_password': this.pay_password,
				}).then(res => {
					this.app.showModal(res.msg);
					this.getInfo();//重新请求数据
					this.is_post = false;
					this.transferShow = false;
					this.transferInfoShow = false;
				}).catch(res=>{
					this.is_post = false;
				})
			},
			// changeSalePrice(){
			// 	if (this.salePrice <= 1){
			// 		this.es_revenue = 0;
			// 		return true;
			// 	}
				
			// 	let nft_market_transfer_fee = this.salePrice / 100 * this.nftInfo.nft_market_transfer_fee;
			// 	nft_market_transfer_fee = nft_market_transfer_fee.toFixed(2);
			// 	let nft_market_creator_fee = this.salePrice / 100 * this.nftInfo.nft_market_creator_fee;
			// 	nft_market_creator_fee = nft_market_creator_fee.toFixed(2);
			// 	let es_revenue = this.salePrice - this.nftInfo.buy_price - nft_market_transfer_fee - nft_market_creator_fee;
			// 	this.es_revenue = es_revenue.toFixed(2);
			// },
			//进行挂售
			salePost(){
				if (this.is_post == true){
					return false;
				}
				this.is_post = true;
				this.$u.post('nft/api.flow/putSale', {
					'id': this.id,
					'salePrice': this.salePrice,
					'pay_password': this.pay_password,
				}).then(res => {
					this.app.showModal(res.msg);
					this.saleShow = false;
					this.is_post = false;
					this.getInfo();
				}).catch(res=>{
					this.is_post = false;
				})
			},
			//取消挂售
			cancelPutSale(){
				let that = this;
				uni.showModal({
					title: that.app.langReplace('提示'),
					confirmText: that.app.langReplace('确认取消'),
					cancelText: that.app.langReplace('继续寄售'),
					content: that.app.langReplace('确定取消寄售？'),
					showCancel: true,
					success: function(res) {
						if (res.confirm) {
							if (that.is_post == true){
								return false;
							}
							that.is_post = true;
							that.$u.post('nft/api.flow/canclePutSale', {
								'id': that.id
							}).then(res => {
								that.app.showModal(res.msg);
								that.is_post = false;
								that.getInfo();
								that.refreshData = true;
							}).catch(res=>{
								that.is_post = false;
							})
						}
					}
				});
			},
			//购买
			goBuy(){
				let that = this;
				uni.showModal({
					title: that.app.langReplace('提示'),
					confirmText: that.app.langReplace('确认购买'),
					cancelText: that.app.langReplace('取消'),
					content: that.app.langReplace('确定购买当藏品？'),
					showCancel: true,
					success: function(res) {
						if (res.confirm) {
							if (that.is_post == true){
								return false;
							}
							that.is_post = true;
							that.$u.post('nft/api.flow/marketBuy', {
								'id': that.id
							}).then(res => {
								that.app.showModal(res.msg);
								that.is_post = false;
								that.refreshData = true;
								uni.redirectTo({
									url: `/pages/nft/order/pay?from=nft&order_id=${res.data.order_id}`
								});
							}).catch(res=>{
								that.is_post = false;
							})
						}
					}
				});
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

<style lang="scss">
	.box{
		border-radius: 24rpx;
		margin: 0 auto;
		padding: 30rpx;
		width: 690rpx;
	}
	.head{
		width: 60rpx;
		height: 60rpx;
		border-radius: 50%;
		overflow: hidden;
		flex-shrink: 0;
		image{
			width: 100%;
			height: 100%;
			border-radius: 50%;
		}
	}
	.desc{
		
	}
	.blank{
		height: 120rpx;
	}
	.fixed_btn{
		position: fixed;
		z-index: 999;
		bottom: 0;
		left: 0;
		right: 0;
		background-color: #313131;
		height: 100rpx;
		
		.item {
			height: 100%;
			display: flex;
			justify-content: center;
			align-items: center;
			position: relative;
			
			&:not(:nth-child(1)){
				&::before {
					content: '';
					position: absolute;
					width: 1px;
					height: 40%;
					left: 0;
					top: 30%;
					background-color: rgba(255,255,255,.15);
				}
			}
			
			.text {
				margin-left: 6rpx;
			}
		}
	}
	.code_box{
		padding: 15rpx 20rpx;
		border-radius: 24rpx;
		margin: 0 auto;
	}
	
	
	.transferInfoBox {
	    display: flex;
	    flex-direction: column;
	    align-items: center;
	    position: relative;
	    z-index: 99999;
		border-radius: 20rpx;
		margin-bottom: 20rpx;
		position: relative;
		padding-top: 20rpx;
	}
	.transferInfoBox .headimgurl {
		width: 120rpx;
		height: 120rpx;
		border-radius: 50%;
		overflow: hidden;
		border: 3rpx solid #FFFFFF;
		background-color: #FFFFFF;
		text-align: center;
	}
	.transferInfoBox .headimgurl image{
		width: 100%;
		height: 100%;
		overflow: hidden;
		border-radius: 50%;
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
