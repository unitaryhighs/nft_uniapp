<template>
	<view class="page-body u-skeleton" :class="[app.setCStyle()]">
		<!-- 轮播图 -->
		<view class="wrap" :class="wechat?'wechat':''">
			<!-- <u-swiper class="u-skeleton-fillet" :list="swiperList" :border-radius="24" @click="bannerClick" bg-color="rgba(0,0,0,0)"></u-swiper> -->
			<view class="u-relative">
				<view v-if="loading" class="u-skeleton-fillet u-absolute" style="width: 690rpx;height: 250rpx;left: 30rpx;bottom: 0;"></view>
				<uni-swiper-dot class="swiper-dot" :info="swiperList" :current="swiperCurrent" mode="round" :dotsStyles="dotsStyles">
					<swiper autoplay="true" circular="true" style="height:250rpx;" :interval="3000" @change="swiperChange">
						<swiper-item v-for="(item,index) in swiperList" :key="index" @click="bannerClick(item.url)">
							<view class="plr30" style="box-sizing: content-box;height: 100%;">
								<!-- <image :src="item.image" mode="scaleToFill" style="width: 100%;height: 100%;"></image> -->
								<u-image :fade="false" :lazy-load="true" :border-radius="20" style="width: 100%;height: 100%;" :src="item.image" mode="scaleToFill">
									<u-loading size="50" mode="flower" slot="loading"></u-loading>
								</u-image>
							</view>
						</swiper-item>
					</swiper>
				</uni-swiper-dot>
			</view>
		</view>
		<!-- 公告 -->
		<view class="box-bg-base ml30 mr30 br20 mb20">
			<view class="u-skeleton-fillet flex fh plr20">
				<swiper autoplay="true" circular="true" class="color-99 flex_bd lh80" style="height: 80rpx;" :interval="5000" vertical="true">
					<swiper-item v-for="(item,index) in noticeList" :key="index" @click="app.goPage('/pages/public/article?id='+item.id)">
						<view class="flex fh">
							<u-icon name="volume-up" color="#F0D2B2" size="40"></u-icon>
							<!-- <text class="tip-dian" v-if="notice_see_list && notice_see_list.length && notice_see_list.indexOf(item.id) > -1" style="margin: 0 0 0 8rpx;width: 12rpx;height: 12rpx;"></text> -->
							<view class="ml10 ellipsis-1">{{item.title}}</view>
							<image v-if="index==0" src="/static/images/new.png" mode="widthFix" style="width: 50rpx;min-width: 50rpx;height:24rpx;margin-left: 10rpx;"></image>
						</view>
					</swiper-item>
				</swiper>
				<view class="u-relative ml30">
					<u-icon name="list" color="#999999" size="40" top="2" @click="app.goPage('/pages/public/message/notice')"></u-icon>
					<view v-if="notice_is_see > 0" class="tip-msg-dian"></view>
				</view>
				
			</view>
		</view>
		<!-- 导航栏 -->
		<view class="top_navbar w100 bg-base" :class="wechat?'wechat':''">
			<view class="navbar ">
				<view class="nav-item u-relative" v-for="(item, index) in list" :key="index" 
				:class="{current: topTabCurrentIndex === index}" @click="topTabClick(index, config.tabRefresh?'refresh':'tabChange')">
					{{item.name}}
					<view v-if="loading" class="u-skeleton-fillet" style="width: 140rpx;height: 60rpx;position: absolute;left: 50%;top: 50%;transform: translate(-50%,-50%);"></view>
				</view>
			</view>
		</view>
		<view class="p30 list1 pb0" v-if="loading">
			<view class="box br20 mb30 box-bg-base relative tap item lastmb0" v-for="(item,index) in 2" :key="index">
				<view class="cover">
					<u-image :fade="false" :lazy-load="true" :border-radius="20" class="img u-skeleton-fillet" mode="aspectFill">
						<u-loading size="50" mode="flower" slot="loading"></u-loading>
					</u-image>
					<view class="color-ff bottom">
						<view class="flex fh u-skeleton-fillet" style="justify-content: space-between;">
							<view class="fs32 ellipsis name">qqq</view>
						</view>
						<view class="nums u-skeleton-fillet">
							<limit :number="30"></limit>
						</view>
						<view class="flex price-sec">
							<view class="flex fh">
								<view class="flex fh">
									<image class="head u-skeleton-circle" mode=""></image>
									<view class="fs24 color-99 ellipsis u-skeleton-fillet">qqqqqqqq</view>
								</view>
							</view>
							<view class="fs28 font-w600 price"><text class="fs40 u-skeleton-fillet">￥333</text></view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 藏品列表 -->
		<view v-if="topTabCurrentIndex==0" class="relative">
			<!-- 空白页 -->
			<empty v-if="saleNftList.list.length === 0"></empty>
			<block v-else>
				<view class="p30 list1 pb0">
					<view v-for="(item, index) in saleNftList.list" :key="index"
						@click="app.goPage('/pages/nft/goods/info?nft_id='+item.nft_id)"
						class="box br20 mb30 box-bg-base relative tap item lastmb0">
						<image class="bg" src="/static/images/goods-bg.png" mode="widthFix"></image>
						<view class="cover">
							<u-image :fade="false" :lazy-load="true" :border-radius="20" class="img"
								:src="item.square_pic?baseImgUrl+item.square_pic:baseImgUrl+item.pic_thumb" mode="aspectFill">
								<u-loading size="50" mode="flower" slot="loading"></u-loading>
							</u-image>
							<view v-if="item.wait_sale == 1" class="sold_out start">
								<u-icon name="clock" color="#00fecb" size="28" class="clock"></u-icon>
								即将开售
								<u-count-down class="count-down ml10" :timestamp="fromNow(item.sell_time_start)" :separator-size="24" :font-size="24" bg-color="rgba(0,0,0,0)" color="#00fecb" separator-color="#00fecb"
								@end="topTabClick(topTabCurrentIndex, 'refresh')"></u-count-down>
							</view>
							<view v-else-if="item.stock == 0" class="sold_out">
								<u-icon name="clock" color="#ccc" size="28" class="clock"></u-icon> 
								已售罄
							</view>
							<view class="color-ff bottom">
								<!-- <view class="flex fh" style="justify-content: space-between;"> -->
								<view class="fs32 ellipsis name">{{item.nft_name}}</view>
								<!-- </view> -->
								<!-- <view class="fs24 text-center nums" style="display: flex;">
									<view class="amount color-00">限量</view>
									<view class="count" style="color: #CCBEA9;">
										{{item.limit_sale_num>0?item.limit_sale_num:item.nums}}份
									</view>
								</view> -->
								<view class="nums">
									<limit :number="item.limit_sale_num>0?item.limit_sale_num:item.nums"></limit>
								</view>
								<view class="flex price-sec">
									<view class="flex fh ">
										<view class="flex fh">
											<image class="head" :src="baseImgUrl+item.creator_headimgurl" mode=""></image>
											<view class="fs24 color-99 ellipsis">{{item.creator_name}}</view>
										</view>
										<view class="mr10 primarybtn plr20" v-for="(val,index) in item.limitRoleList" :key="index">
											{{val}}
										</view>
									</view>
									<view class="fs28 font-w600 price"><text class="fs40">￥{{item.price}}</text></view>
								</view>
							</view>
						</view>
					</view>
				</view>
				<uni-load-more :status="saleNftList.loadingType"></uni-load-more>
			</block>
		</view>

		<!-- 盲盒列表 -->
		<view v-if="topTabCurrentIndex==1" class="relative">
			<!-- 空白页 -->
			<empty v-if="blindBoxList.list.length === 0"></empty>
			<block v-else>
				<view class="p30 list2 pb0">
					<view v-for="(item, index) in blindBoxList.list" :key="index"
						@click="app.goPage('/pages/nft/blind_box/info?id='+item.id)"
						class="box br20 mb30 box-bg-base relative tap item lastmb0">
						<image class="bg" src="/static/images/goods-bg.png" mode="widthFix"></image>
						<view class="cover">
							<u-image :fade="false" :lazy-load="true" :border-radius="20" class="img" :src="baseImgUrl+item.pic"
								mode="aspectFill">
								<u-loading size="50" mode="flower" slot="loading"></u-loading>
							</u-image>
							<view v-if="item.wait_sale == 1" class="sold_out start">
								<u-icon name="clock" color="#00fecb" size="28" class="clock"></u-icon>
								即将开售
								<u-count-down class="count-down ml10" :timestamp="fromNow(item.sell_time_start)" :separator-size="24" :font-size="24" bg-color="rgba(0,0,0,0)" color="#00fecb" separator-color="#00fecb"
								@end="topTabClick(topTabCurrentIndex, 'refresh')"></u-count-down>
							</view>
							<view v-else-if="item.stock == 0" class="sold_out">
								<u-icon name="clock" color="#ccc" size="28" class="clock"></u-icon> 
								已售罄
							</view>
							<view class="color-ff p30">
								<view class="flex fh">
									<view class="fs32 ellipsis">{{item.name}}</view>
								</view>
								<view class="flex fh">
									<!-- <view class="flex fs24 text-center mt20">
										<view class="amount color-00">限量</view>
										<view class="count" style="color: #CCBEA9;">{{item.nums}}份</view>
									</view>	 -->
									<view class="mt20">
										<limit :number="item.nums"></limit>
									</view>
									<view class="fs28 flex_bd text-right font-w600 price"><text class="fs40">￥{{item.price}}</text></view>
								</view>
							</view>
						</view>
					</view>
				</view>
				<uni-load-more :status="blindBoxList.loadingType"></uni-load-more>
			</block>
		</view>

		<!-- 发售列表 -->
		<view v-if="topTabCurrentIndex==2" class="relative">
			<!-- 空白页 -->
			<empty v-if="preSaleNftList.list.length === 0"></empty>
			<block v-else>
				<view class="p30 pb0">
					<view class="items" v-for="(item, index) in preSaleNftList.list" :key="index">
						<view class="date mb30 lastmb0">
							<text class="fs32 color-ff">{{item.date}} </text>
						</view>
						<view class="flex fh p30 syn_list box-bg-base mb20 tap"
						v-for="(itemb, indexb) in item.list" :key="indexb" @click="app.goPage('/pages/nft/goods/info?nft_id='+itemb.nft_id)">
							<u-image :fade="false" :lazy-load="true" :border-radius="20" class="img2"
								:src="itemb.square_pic?baseImgUrl+itemb.square_pic:baseImgUrl+itemb.pic_thumb" mode="aspectFill">
								<u-loading size="50" mode="flower" slot="loading"></u-loading>
							</u-image>
							<view class="color-ff ml20">
								<text class="fs28 color-99">开售时间：{{itemb.sale_time}}</text>
								<view class="fs30 ellipsis">{{itemb.nft_name}}</view>
								<!-- <view class="flex fs24 text-center mt10">
									<view class="amount color-00">限量</view>
									<view class="count" style="color: #CCBEA9;">
										{{itemb.limit_sale_num>0?itemb.limit_sale_num:itemb.nums}}份
									</view>
								</view> -->
								<view class="mt10">
									<limit :number="itemb.limit_sale_num>0?itemb.limit_sale_num:itemb.nums"></limit>
								</view>
								<view class="fs40 mt20 font-w600"><text class="fs24">￥</text>{{itemb.price}}</view>
							</view>
						</view>
					</view>
				</view>
			</block>
		</view>

		<!-- 精选列表 -->
		<view v-if="topTabCurrentIndex==3" class="relative">
			<!-- 空白页 -->
			<empty v-if="featuredList.list.length === 0"></empty>
			<block v-else>
				<view class="p30 pb0">
					<view v-for="(item, index) in featuredList.list" :key="index" @click="app.goPage('/pages/nft/featured/info?id='+item.id)"
						class="selected box-bg-base mb30 tap">
						<u-image :fade="false" v-if="item.img_url" :lazy-load="true" :border-radius="20" class="img3"
							:src="baseImgUrl+item.img_url" mode="aspectFill">
							<u-loading size="50" mode="flower" slot="loading"></u-loading>
						</u-image>
						<view class="p20 color-ff linefeed">
							<view class="linefeed_tit fs32">{{item.title}}</view>
							<view class="linefeed_description color-99 fs28" style="margin-top: 16rpx;">
								<rich-text :nodes="item.description"></rich-text>
							</view>
						</view>
					</view>
				</view>
			</block>
		</view>

		<block v-if="showCheckIdCard">
			<view class="real flex" v-if="!authcode">
				<view class="tip flex_bd fs26">
					登录后，开启您的数字藏品之旅
				</view>
				<view class="u-flex fh">
					<view class="btn fs28 text-center" @click="toLogin">登录</view>
					<u-icon @click="showCheckIdCard=false" class="ml20 p10" name="close" color="#999999" size="28"></u-icon>
				</view>
			</view>
			<view class="real flex" v-else>
				<view class="tip flex_bd fs26">
					实名认证后才能支付购买数字藏品
				</view>
				<view class="u-flex fh">
					<view class="btn fs28 text-center" @click="app.goPage('/pages/member/center/checkIdCard')">去认证</view>
					<u-icon @click="showCheckIdCard=false" class="ml20 p10" name="close" color="#999999" size="28"></u-icon>
				</view>
			</view>
		</block>
		<view :style="{height: showCheckIdCard?'100rpx':'0'}" style="transition: height .3s;"></view>

		<!-- <copyright></copyright> -->

		<tabbar ref="tabbar" :now_page="now_page" :getCartNum="0"></tabbar>
		
		<u-skeleton :loading="loading" :animation="true" el-color="#3d3d3d" bg-color="#1e1e1f"></u-skeleton>
	</view>
</template>

<script>
	import tabbar from '@/pages/public/tabbar';
	import copyright from '@/pages/public/copyright';
	export default {
		components: {
			tabbar,
			copyright,
		},
		data() {
			return {
				swiperCurrent: 0,
				dotsStyles: {
					backgroundColor: 'rgba(0, 0, 0, .3)',
					border: 'none',
					color: '#fff',
					selectedBackgroundColor: '#fff',
					selectedBorder: 'none'
				},
				baseImgUrl: this.config.baseImgUrl,
				now_page: '',
				swiperList: [],
				list: [{
					name: '数字藏品',
					num: 0
				}, {
					name: '藏品盲盒',
					num: 0
				}, {
					name: '发售日历',
					num: 0
				}, {
					name: '内容精选',
					num: 0
				}],
				topTabCurrentIndex: 0,
				showDialog: false,
				showCheckIdCard: false,
				saleNftList: {
					p: 0,
					loaded: false,
					list: []
				},
				blindBoxList: {
					p: 0,
					loaded: false,
					list: []
				},
				preSaleNftList: {
					loaded: false,
					list: []
				},
				featuredList: {
					loaded: false,
					list: []
				},
				noticeList: [],
				// h5Fixed: false,
				// wxFixed: false,
				wechat: false,
				authcode: null,
				showLoading: false,
				loading: true,
				notice_is_see: 0,//未读公告
				notice_see_list: null,
			}
		},
		onLoad(options) {
			uni.hideTabBar();
			if (options.scene) { //获取小程序的场景值，用于获取分享者的token
				let scene = options.scene.split('_');
				uni.setStorageSync("share_token", scene[0]);
			}
			this.now_page = this.$mp.page.route;
			let setting = uni.getStorageSync("setting");
			uni.setNavigationBarTitle({
				title: setting.site_name
			})
			//微信公众号分享
			this.weixin_qrcode = this.config.baseImgUrl + setting.weixin_qrcode;
			// 判断微信浏览器
			// #ifdef H5
			let ua = window.navigator.userAgent.toLowerCase()
			if (ua.match(/MicroMessenger/i) == 'micromessenger') {
				// do something
				this.wechat = true;
			}
			// #endif
			
			// #ifdef APP-PLUS
			// app开屏广告
			// let launchImgData = uni.getStorageSync('launchImgData');
			// if(uni.getSystemInfoSync().platform=='android' && launchImgData.use){
			// 	setTimeout(() => {
			// 		this.app.showAppAd();
			// 	},500)
			// }
			// #endif
			
			// this.getIndexInfo();
			setTimeout(() => {
				this.loading = false;
			},5000)
		},
		onShow() {
			if(this.app.refreshData(this.$mp.page.route, Date.now())){
				this.getIndexInfo();
				this.getCheckIdCard();
				this.topTabClick(this.topTabCurrentIndex, 'refresh','onShow');
			}
			this.authcode = uni.getStorageSync("authcode");
			
			setTimeout(()=>{
				this.showLoading = true;
			}, 3000)
			
			if(this.$refs.tabbar){
				this.$refs.tabbar.autoFun();
			}
		},
		onReachBottom() {
			if (this.topTabCurrentIndex == 0) {
				this.getSaleNftList();
			} else if (this.topTabCurrentIndex == 1) {
				this.getBlindBoxList();
			}
		},
		onPullDownRefresh() {
			this.getIndexInfo();
			this.getCheckIdCard();
			// this.saleNftList.loaded = false;
			// this.blindBoxList.loaded = false;
			// this.preSaleNftList.loaded = false;
			// this.featuredList.loaded = false;
			this.topTabClick(this.topTabCurrentIndex, 'refresh');
		},
		methods: {
			fromNow(time){
				let date = new Date().toLocaleDateString();
				let fTime = new Date(date +' '+ time).getTime();
				return (fTime - Date.now()) / 1000;
			},
			swiperChange(e){
				this.swiperCurrent = e.detail.current;
			},
			toLogin(){
				uni.setStorageSync("loginReturnUrl",'/pages/nft/index/index');
				this.app.goPage('/pages/member/passport/login')
			},
			// onViewScroll(res) {
			// 	if (this.app.getPlatform() == 'H5-WX') {
			// 		this.wxFixed = res.detail.scrollTop >= 160;
			// 	} else {
			// 		this.h5Fixed = res.detail.scrollTop >= 200;
			// 	}
			// },
			// loadScrollData() {
			// 	if (this.topTabCurrentIndex == 0) {
			// 		this.getSaleNftList();
			// 	} else if (this.topTabCurrentIndex == 1) {
			// 		this.getBlindBoxList();
			// 	}
			// },
			getIndexInfo() {
				return new Promise((resolve,reject) => {
					this.$u.post('publics/api.index/getIndexInfo',{showLoading: false}).then(res => {
						this.swiperList = [];
						if (res.code == 0) {
							return true;
						}
						// if (res.data.check_id_card == 0) {
						// 	this.showCheckIdCard = true;
						// }
						res.data.banner.forEach((item, index) => {
							item.image = this.baseImgUrl + item.image;
							this.swiperList.push(item);
						})
						this.noticeList = res.data.notice;
						this.notice_is_see = res.data.notice_is_see;
						this.notice_see_list = res.data.notice_see_list;
						resolve(res);
					}).catch(err => {
						reject(err);
					})
				})
			},
			bannerClick(url) {
				if (url) {
					this.app.goPage(url);
				}
			},
			// 判断是否实名
			getCheckIdCard() {
				return new Promise((resolve,reject) => {
					this.$u.post('publics/api.index/getCheckIdCard',{showLoading: false}).then(res => {
						if (res.code == 0) {
							return true;
						}
						if (res.data.check_id_card == 0) {
							this.showCheckIdCard = true;
						} else {
							this.showCheckIdCard = false;
						}
						resolve(res);
					}).catch(err => {
						reject(err);
					})
				})
			},
			getSaleNftList(source, type) {
				// console.log('getSaleNftList');
				return new Promise((resolve,reject) => {
					let saleNftList = this.saleNftList;
					// console.log(saleNftList.loadingType);
					if (source === 'refresh') {
						saleNftList.p = 0;
						saleNftList.loadingType = 'more';
						// saleNftList.list = [];
						saleNftList.loaded = false;
					}
					if (saleNftList.loadingType == 'nomore' || saleNftList.loadingType == 'loading') {
						//防止重复加载
						return;
					}
					saleNftList.p++;
					let param = {showLoading: this.showLoading};
					param.p = saleNftList.p;
					param.page_size=10;
					this.$u.post('nft/api.goods/getSaleNftList', param).then(res => {
						if (source === 'refresh') {
							saleNftList.list = [];
						}
						this.saleNftList.list = this.saleNftList.list.concat(res.data.list);
						this.$set(this.saleNftList, 'loaded', true);
						//判断是否还有下一页，有是more  没有是nomore
						saleNftList.loadingType = saleNftList.p >= res.data.page_count ? 'nomore' : 'more';
						resolve(res);
					}).catch(err => {
						reject(err);
					})
				})
			},
			getBlindBoxList(source, type) {
				return new Promise((resolve,reject) => {
					let blindBoxList = this.blindBoxList;
					if (source === 'refresh') {
						blindBoxList.p = 0;
						blindBoxList.loadingType = 'more';
						// blindBoxList.list = [];
						blindBoxList.loaded = false;
					}
					if (blindBoxList.loadingType == 'nomore' || blindBoxList.loadingType == 'loading') {
						//防止重复加载
						return;
					}
					blindBoxList.p++;
					let param = {showLoading: this.showLoading};
					param.p = blindBoxList.p;
					this.$u.post('nft/api.blind_box/getSaleList', param).then(res => {
						if (source === 'refresh') {
							blindBoxList.list = [];
						}
						this.blindBoxList.list = this.blindBoxList.list.concat(res.data.list);
						this.$set(this.blindBoxList, 'loaded', true);
						//判断是否还有下一页，有是more  没有是nomore
						blindBoxList.loadingType = blindBoxList.p >= res.data.page_count ? 'nomore' : 'more';
						resolve(res)
					}).catch(err => {
						reject(err)
					})
				})
			},
			getPreSaleNftList(source, type) {
				return new Promise((resolve,reject) => {
					this.$u.post('nft/api.goods/getPreSaleNftList',{showLoading: this.showLoading}).then(res => {
						this.preSaleNftList.list = [];
						this.preSaleNftList.list = this.preSaleNftList.list.concat(res.data.list);
						this.$set(this.preSaleNftList, 'loaded', true);
						resolve(res)
					}).catch(err => {
						reject(err)
					})
				})
			},
			getFeaturedList(source, type) {
				return new Promise((resolve,reject) => {
					this.$u.post('nft/api.goods/getFeaturedList',{showLoading: this.showLoading}).then(res => {
						this.featuredList.list = [];
						this.featuredList.list = this.featuredList.list.concat(res.data.list);
						this.$set(this.featuredList, 'loaded', true);
						// console.log(this.featuredList)
					resolve(res)
					}).catch(err => {
						reject(err)
					})
				})
			},

			async topTabClick(index, source, type) {
				// console.log(index,source,index == 0,source=='refresh');
				this.topTabCurrentIndex = index;
				if (this.topTabCurrentIndex == 0) {
					if (this.saleNftList.loaded == false || source == 'refresh') {
						await this.getSaleNftList(source, type);
					}
				} else if (this.topTabCurrentIndex == 1) {
					if (this.blindBoxList.loaded == false || source == 'refresh') {
						await this.getBlindBoxList(source, type);
					}
				} else if (this.topTabCurrentIndex == 2) {
					if (this.preSaleNftList.loaded == false || source == 'refresh') {
						await this.getPreSaleNftList(source, type);
					}
				} else if (this.topTabCurrentIndex == 3) {
					if (this.featuredList.loaded == false || source == 'refresh') {
						await this.getFeaturedList(source, type);
					}
				}
				// #ifdef APP-PLUS
				setTimeout(() => {
					this.loading = false;
				},800)
				// #endif
				// #ifdef H5
				setTimeout(() => {
					this.loading = false;
				},300)
				// #endif
			}

		}
	}
</script>

<style lang="scss" scoped>
	.wrap {
		padding: 20rpx 0 50rpx;
		
		&.wechat {
			padding-top: 50rpx;
		}
	}

	// .wx_fixed {
	// 	position: fixed;
	// 	top: 0;
	// 	z-index: 99;
	// }

	// .h5_fixed {
	// 	position: fixed;
	// 	top: 85rpx;
	// 	z-index: 99;
	// }

	.swiper-box {
		height: 100%;
	}

	.tab-content {
		overflow-y: scroll;
	}

	.sold_out {
		position: absolute;
		top: 30rpx;
		left: 30rpx;
		color: #ccc;
		border-radius: 24rpx;
		padding: 4rpx 18rpx 4rpx 16rpx;
		background-color: rgba(0,0,0,1);
		// background-color: rgba(29, 29, 46, 0.7);
		height: 48rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		vertical-align: bottom;
		font-size: 24rpx;
		line-height: 48rpx;
		
		&.start {
			color: #00fecb;
		}
		
		.clock {
			margin-right: 8rpx;
		}
	}

	.img {
		width: 100% !important;
		height: 690rpx !important;

		image {
			width: 100%;
			height: 100%;
			border-radius: 20rpx;
		}
	}

	.img2 {
		width: 200rpx !important;
		height: 200rpx !important;
		flex-shrink: 0;

		image {
			width: 100%;
			height: 100%;
			border-radius: 12rpx;
		}
	}

	.img3 {
		width: 100% !important;
		height: 340rpx !important;
		
		image {
			width: 100%;
			border-radius: 20rpx;
		}
	}

	.head {
		width: 36rpx;
		height: 36rpx;
		border-radius: 50%;
		margin-right: 14rpx;
	}

	.amount {
		width: 76rpx;
		height: 40rpx;
		background: $btn-two-purplered;
		border-radius: 4rpx;
		line-height: 40rpx;
	}

	.count {
		width: 125rpx;
		height: 40rpx;
		border: 1rpx solid $border-color-base;
		line-height: 40rpx;
		margin-left: -6rpx;
		border-left: none;
		border-top-right-radius: 4rpx;
		border-bottom-right-radius: 4rpx;
	}

	.real {
		background: rgba(15, 15, 15, .8);
		position: fixed;
		z-index: 103;
		bottom: 110rpx;
		bottom: calc(constant(safe-area-inset-bottom) + 110rpx);
		bottom: calc(env(safe-area-inset-bottom) + 110rpx);
		left: 0;
		right: 0;
		padding: 20rpx 20rpx 20rpx 30rpx;
		justify-content: space-between;
		align-items: center;
		// backdrop-filter: blur(8px);

		.tip {
			color: #fff;
		}
		.btn {
			// width: 127rpx;
			padding: 0 26rpx;
			height: 60rpx;
			line-height: 60rpx;
			// border: 1rpx solid $base-color;
			background-color: #ECC79E;
			border-radius: 30rpx;
			color: $box-color-base;
			display: flex;
			justify-content: center;
			align-items: center;
		}
	}

	.syn_list {
		border-radius: 24rpx;
		height: 248rpx;
	}

	.selected {
		border-radius: 24rpx;
	}

	.mask {
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		backdrop-filter: blur(20rpx);
		z-index: 101;
		display: flex;
		justify-content: center;
		align-items: center;
		transition: all 0.3s;

		// -moz-transition: all 0.3s linear;
		// -webkit-transition: all 0.3s linear;
		.Dialog {
			width: 556rpx;
			background: #222136;
			border-radius: 20rpx;
			padding: 50rpx 40rpx;
		}
	}

	.sele_btn {
		width: 232rpx;
		height: 87rpx;
		background: #585867;
		border-radius: 43rpx;
		line-height: 87rpx;
		color: #FFFFFF;
	}

	.sele_btn_act {
		background: $btn-two-purplered;
		color: #000000;
	}

	.linefeed_tit {
		text-overflow: -o-ellipsis-lastline;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
	}

	.linefeed_description {
		text-overflow: -o-ellipsis-lastline;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 1;
		line-clamp: 1;
		-webkit-box-orient: vertical;
	}

	.top_navbar {
		position: sticky;
		z-index: 99;
		background-color: $page-color-base;
		top: calc(var(--window-top) - 3px);

		&.wechat {
			top: -3px;
		}
	}

	.top_navbar .navbar .nav-item.current {
		font-size: 34rpx;
	}

	.top_navbar .navbar .nav-item.current:after {
		width: 50rpx;
		height: 8rpx;
		bottom: 12rpx;
		border-radius: 4rpx;
		border: none;
		background: #fff;
	}
	
	.items {
		&:not(:nth-child(1)){
			.date {
				margin-top: 40rpx;
			}
		}
	}
	
	.list1,
	.list2 {
		.item {
			// background-image: url('/static/images/goods-bg.png');
			// background-size: cover;
			position: relative;
			
			.bg {
				position: absolute;
				width: 100%;
				left: 0;
				bottom: 0;
				z-index: 0;
				opacity: .03;
			}
			.cover {
				position: relative;
				z-index: 1;
			}
			.bottom {
				padding: 30rpx 30rpx 26rpx;
				.nums {
					margin-top: 26rpx;
				}
			}
			.price-sec {
				margin-top: 20rpx;
				.price {
					line-height: 40rpx;
				}
			}
		}
	}
	
	.pb0 {
		padding-bottom: 0 !important;
	}
	.lastmb0 {
		&:nth-last-child(1){
			margin-bottom: 0 !important;
		}
	}
	
	.tip-msg-dian {
		position: absolute;
		right: -5rpx;
		top: 0rpx;
		width: 15rpx;
		height: 15rpx;
		background-color: #F2692F;
		border-radius: 50%;
	}
	/deep/ .swiper-dot {
		.uni-swiper__dots-box {
			.uni-swiper__dots-item {
				transition: all .3s;
				
				&.uni-swiper__dots-long {
					width: 30rpx !important;
				}
			}
		}
	}
	/deep/ .count-down {
		.u-countdown-colon {
			padding: 0;
		}
	}
</style>
