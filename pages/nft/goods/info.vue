<template>
	<view class="page-body u-skeleton" :class="[app.setCStyle()]">
		<ji-nav-bar v-if="!wechat" class="ji-nav-bar" ref="navBar" type="transparentFixed" bgColor="#1E1E1F"
			:withPadding="false" fontColor="#ffffff" :showShare="true" @share="showShareImg">
			<view class="preview" slot="default" style="color: #fff">藏品详情</view>
		</ji-nav-bar>

		<!-- <view v-if="loading" style="padding: 32rpx;">
			<view class="u-skeleton-fillet" style="width: 100%;height: 686rpx;"></view>
			<view class="u-skeleton-fillet" style="margin-top: 30rpx;height: 38rpx;"></view>
			<view class="box mt30 box-bg-base u-skeleton-fillet">
				<view class="cover">
					<view class="fs40 color-ff flex_bd text-center mt10 font-w700 u-skeleton-fillet">qqqqqqqqqqq</view>
					<view class="flex" style="margin-top: 44rpx;padding-bottom: 10rpx;">
						<view class="flex fh">
							<image class="head u-skeleton-circle" mode="aspectFill"></image>
							<view class="color-99 ml10 ellipsis u-skeleton-fillet">qqqqqqqqq</view>
						</view>
						<limit class="u-skeleton-fillet" :number="30" color="#F4D8B0" leftColor="#7D583B"></limit>
					</view>
				</view>
			</view>
			<view class="box mt20 box-bg-base goods-info u-skeleton-fillet">
				<view class="color-ff fs28 mb30 goods-info-title"><text class="u-skeleton-fillet">藏品简介</text></view>
				<view class="color-99 fs28 goods-info-content plr30 pb30">
					<view class="u-skeleton-fillet" style="white-space: pre-line;">
						1
						1
						1
						1
						1
					</view>
				</view>
			</view>
			<view class="box mt20 box-bg-base goods-info u-skeleton-fillet">
				<view class="color-ff fs28 mb30 goods-info-title"><text class="u-skeleton-fillet">购买须知</text></view>
				<view class="color-99 fs28 goods-info-content plr30 pb30">
					<view class="u-skeleton-fillet" style="white-space: pre-line;">
						1
						1
						1
						1
						1
					</view>
				</view>
			</view>
		</view> -->
		<goods-info :show3d="show3d" :square_pic="nftInfo.square_pic" :pic="nftInfo.pic" :nft_name="nftInfo.nft_name" :big_pic="nftInfo.pic" :model_detail_list="nftInfo['3d_model_detail_list']"></goods-info>
		<!-- :pic_thumb="nftInfo.pic_thumb"
		:limit_sale_num="nftInfo.limit_sale_num"
		:nums="nftInfo.nums" -->
		<view class="mt50">
			<u-divider color="#838384" border-color="#838384" bg-color="none" fontSize="28rpx" :half-width="195">
				<u-icon name="lock-fill" color="#7C7C7D" style="margin-right: 5rpx;" size="28"></u-icon>购买即可体验内容
			</u-divider>
		</view>
		<view class="">
			<view class="box mt30 box-bg-base">
				<image class="bg" src="/static/images/goods-bg.png" mode="widthFix"></image>
				<view class="cover">
					<!-- <view class="flex"> -->
					<view class="fs40 color-ff flex_bd text-center mt10 font-w700">{{nftInfo.nft_name}}</view>
					<!-- <view class="fh collection" :style="collection_status!=1?'color:#ffffff':'color:#F3D7B7'" style="display: flex;" @click="setCollect(nftInfo.nft_id)">
							<u-icon name="/static/images/collection.png" style="width: 30rpx; height: 30rpx;margin-right: 10rpx;" v-if="collection_status!=1"></u-icon><text>{{collection_status!=1?"收藏":"已收藏"}}</text>
						</view> -->
					<!-- </view> -->
					<view class="flex" style="margin-top: 44rpx;padding-bottom: 10rpx;">
						<view class="flex fh"
							@click="app.goPage('/pages/nft/collection/creator?creator_id='+nftInfo.creator_id)">
							<image class="head" :src="nftInfo.creator_headimgurl" mode="aspectFill"></image>
							<view class="color-99 ml10 ellipsis">{{nftInfo.creator_name}}</view>
						</view>
						<!-- <view class="color-ff fs40"><text class="fs24">￥</text>{{nftInfo.price}}</view> -->
						<limit :number="nftInfo.nums" color="#F4D8B0" leftColor="#7D583B"></limit>
					</view>
					<view v-if="nftInfo.limitRoleList" class="flex mt20 color-99">
						<view>限制身份购买：</view>
						<view class="ml10 primarybtn plr20" v-for="(val,index) in nftInfo.limitRoleList" :key="index">
							{{val}}
						</view>
					</view>
				</view>
			</view>
			<!-- <view class="box mt20 box-bg-base">
				<view class="color-ff fs32 mb30">
					藏品信息
				</view>
				<view v-if="nftInfo.contract_address" class="flex mb30 color-99 linefeed" style="justify-content: space-between;">
					<view style="min-width: 150rpx;">合约地址</view>
					<view class="fs26 ellipsis-1">{{nftInfo.contract_address}}</view>
					<u-icon name="/static/images/copy.png" size="40" @click="app.copy(nftInfo.contract_address)"></u-icon>
				</view>
				<view class="flex mb30 color-99" style="justify-content: space-between;">
					<text>发行数量</text><text>{{nftInfo.nums}}份</text>
				</view>
				<view class="flex mb30 color-99" style="justify-content: space-between;">
					<text>流通数量</text><text>{{nftInfo.keep_num}}份</text>
				</view>
				<view class="flex mb30 color-99" style="justify-content: space-between;">
					<text>藏品库存</text><text>{{nftInfo.stock}}份</text>
				</view>
				<view class="flex mb10 color-99" style="justify-content: space-between;">
					<text>发行时间</text><text>{{nftInfo.publish_time}}</text>
				</view>
			</view> -->
			<view class="box mt20 box-bg-base goods-info">
				<view class="color-ff fs28 mb30 goods-info-title">
					藏品简介
				</view>
				<view class="color-99 fs28 goods-info-content">
					<view v-html="nftInfo.nft_desc"></view>
				</view>
			</view>
			<view class="box mt20 box-bg-base">
				<view class="color-ff fs32 mb30">
					购买须知
				</view>
				<view class="color-99 fs28">
					<view v-html="setting.nft_buy_desc"></view>
				</view>
			</view>
			<view v-if="relevantNft.length > 0" class="mt50">
				<u-divider color="#838384" border-color="#838384" bg-color="none" fontSize="28rpx" :half-width="245">
					<u-icon name="/static/images/re.png" style="margin-right: 5rpx;" size="28"></u-icon>相关推荐
				</u-divider>
				<view class="p30 flex" style="justify-content: space-between;flex-wrap: wrap;">
					<view class="color-ff list mt20 box-bg-base relative tap" hover-class="hover" hover-start-time="0" hover-stay-time="100" v-for="(item,index) in relevantNft" :key="index">
						<view class="img_b" @click="app.goPage('/pages/nft/goods/info?nft_id='+item.nft_id)">
							<!-- <image :src="item.square_pic?baseImgUrl+item.square_pic:baseImgUrl+item.pic_thumb" mode="aspectFit"></image> -->
							<u-image height="100%" border-radius="24" :fade="false" :lazy-load="true" :src="item.square_pic?baseImgUrl+item.square_pic:baseImgUrl+item.pic_thumb" mode="aspectFill">
								<u-loading size="50" mode="flower" slot="loading"></u-loading>
							</u-image>
						</view>
						<view class="p20">
							<view class="fs30 ellipsis" @click="app.goPage('/pages/nft/goods/info?nft_id='+item.nft_id)">{{item.nft_name}}
							</view>
							<view class="flex fh mt10" @click="app.goPage('/pages/nft/goods/info?nft_id='+item.nft_id)">
								<view class="head_b">
									<image :src="baseImgUrl+item.creator_headimgurl" mode=""></image>
								</view>
								<view class="ml20 fs26 color-99 ellipsis">{{item.creator_name}}</view>
							</view>
							<view class="flex fh mt20">
								<view class="">￥<text class="fs40">{{item.price}}</text></view>
								<!-- <view class="fll" @click="setCollectRelevantNft(item.nft_id,index)">
									<u-icon :name="item.collection_status==1?'heart-fill':'heart'" class="text-right" color="#ffffff" size="40"></u-icon>
								</view> -->
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="blank"></view>
		</view>

		<view class="fixed_btn flex fh">
			<!-- <view class="left flex fh">
				<view class="text-center lbtn" @click="setCollect(nftInfo.nft_id)">
					<image :src="collection_status!=1?'/static/images/collect.png':'/static/images/collect-a.png'" mode="aspectFill" style="width: 36rpx;height: 33rpx;"></image>
					<view class="fs20 mt10" :style="collection_status!=1?'color: #818181':'color: #ECC79E'">{{collection_status!=1?'收藏':'已收藏'}}</view>
				</view>
				<view class="text-center lbtn" @click="showShareImg()">
					<image src="/static/images/share.png" mode="aspectFill" style="width: 33rpx;height: 32rpx;"></image>
					<view class="fs20 mt10" style="color: #818181;">分享</view>
				</view>
			</view> -->
			<view class="flex cbtn font-w700 u-row-center u-col-bottom">
				<text class="fs32" style="line-height: 36rpx;">￥</text>
				<text style="font-size: 48rpx;line-height: 48rpx;">{{nftInfo.price}}</text>
			</view>
			<view class="right">
				<view v-if="nftInfo.limit_buy == 1" class="btn disable">
					<view class="fs32">您不满足购买条件</view>
				</view>
				<block v-else-if="nftInfo.sys_is_reserve == 1">
					<view v-if="nftInfo.is_reserve >= 1" class="btn">
						<view class="fs32">已预约</view>
						<view class="time fs24">
							<text v-if="times.day > 0">{{times.day}}天</text><text
								class="ml10">{{times.hou}}</text>:<text>{{times.min}}</text>:<text>{{times.sec}}</text>
							<text class="ml10">后结束</text>
						</view>
					</view>
					<view v-else class="btn" @click="reserve()">
						<view class="fs32">预约</view>
						<view class="time fs24">
							<text v-if="times.day > 0">{{times.day}}天</text><text
								class="ml10">{{times.hou}}</text>:<text>{{times.min}}</text>:<text>{{times.sec}}</text>
							<text class="ml10">后结束</text>
						</view>
					</view>
				</block>
				<view class="btn disable" v-else-if="nftInfo.wait_sale == 1">
					<view class="fs32">即将开售</view>
					<view class="time fs24">
						<text>剩余</text>
						<text v-if="times.day > 0">{{times.day}}天</text><text
							class="ml10">{{times.hou}}</text>:<text>{{times.min}}</text>:<text>{{times.sec}}</text>
					</view>
				</view>
				<block v-else>
					<block v-if="nftInfo.sys_is_buy == 1">
						<view v-if="nftInfo.is_exchange==1" class="btn" @click="exchangeShow=true">
							<view class="fs32">立即兑换</view>
						</view>
						<view v-else class="btn" @click="addOrder()">
							<view class="fs32">立即购买</view>
						</view>
					</block>
					<view v-else-if="nftInfo.stock < 1" class="btn disable" style="flex-direction: row;"
						@click="goMarket()">
						<view class="fs32">已售罄，</view>
						<view class="cbtn fs32">前往市场</view>
						<u-icon name="arrow-right cbtn" color="" size="24"></u-icon>
					</view>
					<view v-else class="btn disable">
						<view class="fs28">{{nftInfo.status_tip}}</view>
					</view>
				</block>
			</view>
		</view>
		<u-modal v-model="exchangeShow" z-index="102" :show-confirm-button="false" :show-title="false"
			:mask-close-able="true">
			<view class="p20 mt20">
				<view class="code_box bg-base">
					<u-input placeholder="请输入兑换码" v-model="exchangeCode" type="text" :custom-style="{color:'#fff'}">
					</u-input>
				</view>
				<button size="default" shape="circle" class="primarybtn mt20" type="warning"
					@click="exchangeNft">兑换</button>
			</view>
		</u-modal>

		<share-img ref="shareImgCom" :_id="nft_id" :nftInfo="nftInfo" type="goodsInfo"></share-img>
		<!-- <previewImage ref="previewImage" :show="previewShow" :imgs="[nftInfo.pic]"  @longPress="longPress" @onpreview="onpreview"></previewImage> -->
		<real-name ref="realName"></real-name>
		
		<!-- <u-skeleton :loading="loading" :animation="true" el-color="#3d3d3d" bg-color="#1e1e1f"></u-skeleton> -->
	</view>
</template>

<script>
	// #ifdef H5
	import 'viewerjs/dist/viewer.css'
	import {
		component as Viewer
	} from 'v-viewer'
	// #endif
	import three3d from '@/components/three3d';
	// import previewImage from '@/components/kxj-previewImage/kxj-previewImage.vue';
	export default {
		components: {
			"three3d": three3d,
			// previewImage,
			// #ifdef H5
			Viewer
			// #endif
		},
		data() {
			return {
				nft_id: '',
				baseImgUrl: this.config.baseImgUrl,
				setting: {},
				// nft_bottom_bg:'',
				nftInfo: {},
				reservTimeCount: '',
				times: {},
				exchangeShow: false,
				exchangeCode: '',
				// shareShow:false,
				// shareimgurl:"",
				// shareUrl:"",
				// canvasShow:true,
				rotateY: 0,
				rotateType: 'inc',
				relevantNft: [],
				collection_status: 0,
				show3d: 0,
				// previewShow:false
				options: {
					'inline': false, // 是否启用inline模式
					'navbar': false, // 是否显示缩略图底部导航栏
					'title': false, // 是否显示当前图片标题，默认显示alt属性内容和尺寸
					'toolbar': false, // 是否显示工具栏
				},
				wechat: false,
				realName: null,
				// loading: true,
			}
		},
		async onLoad(options) {
			if (options.scene) { //获取小程序的场景值，用于获取分享者的token
				let scene = options.scene.split('_');
				uni.setStorageSync("share_token", scene[0]);
				this.nft_id = scene[1];
			} else {
				this.nft_id = options.nft_id;
			}
			// this.nft_bottom_bg = this.baseImgUrl + this.setting.nft_bottom_bg;

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
		async onShow() {
			this.getInfo();

			if (await this.app.checkRealName(this)) {
				this.realName = true;
			} else {
				this.realName = false;
			};

			let descInfo = uni.getStorageSync('descInfo');
			if (!descInfo || this.app.refreshData(this.$mp.page.route, Date.now(), false)) {
				this.$u.api.getDescInfo().then(res => {
					uni.setStorageSync('descInfo', res.data.setting);
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
			return this.app.backPress([{
					obj: this.$refs.shareImgCom,
					key: 'shareShow'
				},
				{
					obj: this.$refs.realName,
					key: 'rnPop'
				},
				{
					obj: this,
					key: 'exchangeShow'
				}
			])
		},
		methods: {
			// #ifdef H5
			//初始化预览组件
			inited(viewer) {
				this.$viewer = viewer;
			},
			// #endif
			// longPress(){

			// },
			// onpreview(){
			// 	this.previewShow = false
			// },
			//获取信息
			getInfo() {
				return new Promise((resolve, reject) => {
					let _this = this;
					this.$u.post('nft/api.goods/getInfo', {
						'nft_id': this.nft_id
					}).then(res => {
						this.nftInfo = res.data;
						this.nftInfo.pic = this.baseImgUrl + this.nftInfo.pic;
						// uni.downloadFile({
						// 	url: this.baseImgUrl + this.nftInfo.pic,
						// 	complete(e) {
						// 		console.log(e);
						// 		if(e.errMsg == "downloadFile:ok"){
						// 			_this.nftInfo.pic = e.tempFilePath;
						// 		} else {
						// 			_this.nftInfo.pic = _this.baseImgUrl + _this.nftInfo.pic;
						// 		}
						// 	}
						// })
						this.nftInfo.pic_thumb = this.baseImgUrl + this.nftInfo.pic_thumb;
						this.nftInfo.creator_headimgurl = this.baseImgUrl + this.nftInfo
						.creator_headimgurl;
						this.collection_status = this.nftInfo.collection_status;
						if (res.data.sys_is_reserve == 1) {
							this.getReservTimeCount(res.data.pre_sale_time_end_date);
						} else if (res.data.wait_sale == 1) {
							this.getReservTimeCount(res.data.sell_time_start_date);
						}
						if (this.nftInfo.square_pic != '') {
							this.nftInfo.square_pic = this.baseImgUrl + this.nftInfo.square_pic;
							if (this.nftInfo.is_rotate_show == 1) {
								this.show3d = 1;
							}
						}
						this.relevantList();
						// setTimeout(() => {
						// 	this.loading = false;
						// },300)
						resolve(res)
					}).catch(err => {
						reject(err)
					})
				})
			},
			//相关推荐
			relevantList() {
				return new Promise((resolve, reject) => {
					this.$u.post('nft/api.goods/relevantList', {
						'nft_id': this.nft_id,
						'cid': this.nftInfo.cid
					}).then(res => {
						this.relevantNft = res.data.list;
						resolve(res)
					}).catch(err => {
						reject(err)
					})
				})
			},
			getReservTimeCount(time) {
				this.times = {
					day: '00',
					hou: '00',
					min: '00',
					sec: '00'
				};
				if (time == 0) return false;
				if (typeof(this.reservTimeCount) != 'undefined') {
					clearInterval(this.reservTimeCount);
				}
				this.reservTimeCount = setInterval(() => {
					let nowTime = new Date().getTime();
					//注：不论安卓还是ios，请将时间如 2020-02-02 20:20:20 转化为 2020/02/02 20:20:20 这种形式后再使用，否则无法转换，如下转换即可↓
					let transedPreTime = time.replace(/-/g, '/') //这里转化时间格式为以/分隔形式
					let preTime = new Date(transedPreTime).getTime()
					if (preTime - nowTime > 0) {
						let time = (preTime - nowTime) / 1000;
						if (time > 0) {
							let day = parseInt(time / (60 * 60 * 24));
							let hou = parseInt(time % (60 * 60 * 24) / 3600);
							let min = parseInt(time % (60 * 60 * 24) % 3600 / 60);
							let sec = parseInt(time % (60 * 60 * 24) % 3600 % 60);
							let msec = Math.floor(time * 1000 % 1000 / 100);
							this.times = {
								day: day < 10 ? '0' + day : day,
								hou: hou < 10 ? '0' + hou : hou,
								min: min < 10 ? '0' + min : min,
								sec: sec < 10 ? '0' + sec : sec
							};
						} else {
							if (this.nftInfo.sys_is_reserve == 1) {
								this.nftInfo.sys_is_reserve = 0;
								if (this.nftInfo.wait_sale == 1) {
									this.getReservTimeCount(this.nftInfo.sell_time_start_date);
									return true;
								}
								clearInterval(this.reservTimeCount);
								return true;
							}
							if (this.nftInfo.wait_sale == 1) {
								clearInterval(this.reservTimeCount);
								this.nftInfo.wait_sale = 0;
								if (this.nftInfo.is_mint == 1) {
									this.nftInfo.sys_is_buy = 1;
								}
							}
						}
					} else {
						if (this.nftInfo.sys_is_reserve == 1) {
							this.nftInfo.sys_is_reserve = 0;
							if (this.nftInfo.wait_sale == 1) {
								this.getReservTimeCount(this.nftInfo.sell_time_start_date);
								return true;
							}
							clearInterval(this.reservTimeCount);
							return true;
						}
						if (this.nftInfo.wait_sale == 1) {
							clearInterval(this.reservTimeCount);
							this.nftInfo.wait_sale = 0;
							if (this.nftInfo.is_mint == 1) {
								this.nftInfo.sys_is_buy = 1;
							}
						}
					}
				}, 1000)
			},
			exchangeNft() {
				if (this.checkExchange == true) {
					return false;
				}
				if (this.exchangeCode.length < 10) {
					this.$u.toast(this.app.langReplace('请输入兑换码'));
					return false;
				}
				this.checkExchange = true;
				this.$u.post('nft/api.flow/exchangeNft', {
					'exchangeCode': this.exchangeCode,
				}).then(res => {
					this.app.showModal(res.msg);
					if (res.code == 0) {
						return false;
					}
					this.exchangeShow = false;
				}).catch(res => {
					this.checkExchange = false;
				})
			},
			addOrder() {
				if (!this.app.checkToLogin(1)) {
					return
				}
				if (!this.realName) {
					this.$refs.realName.rnPop = true;
					return
				}
				let that = this;
				uni.showModal({
					title: that.app.langReplace('提示'),
					confirmText: that.app.langReplace('确认购买'),
					cancelText: that.app.langReplace('取消'),
					content: that.app.langReplace('确定购买当藏品？'),
					showCancel: true,
					success: function(res) {
						if (res.confirm) {
							if (that.addOrderPost == true) {
								return false;
							}
							that.addOrderPost = true;
							that.$u.post('nft/api.flow/addNftOrder', {
								'nft_id': that.nft_id,
							}).then(res => {
								if (res.code != 1) {
									that.app.showModal(res.msg);
									return false;
								}
								uni.navigateTo({
									url: `/pages/nft/order/pay?from=nft&order_id=${res.data.order_id}`
								});
								that.addOrderPost = false;
							}).catch(res => {
								that.addOrderPost = false;
								// that.app.showModal(res.msg);
								// that.getInfo();//购买失败重新请藏品信息
							})
						}
					}
				});
			},
			showShareImg() {
				if (this.$refs.shareImgCom.shareimgurl == '') {
					this.$refs.shareImgCom.canvasImage();
				} else {
					this.$refs.shareImgCom.shareShow = true;
				}
			},
			reserve() {
				this.$u.post('nft/api.goods/reserve', {
					'nft_id': this.nft_id,
				}).then(res => {
					this.nftInfo.is_reserve = 1;
					this.app.showModal(res.msg);
				})
			},
			setCollect(nft_id) {
				this.$u.post('nft/api.publics/setCollect', {
					'nft_id': nft_id,
				}).then(res => {
					this.collection_status = res.data.status;
				})
			},
			setCollectRelevantNft(nft_id, index) {
				this.$u.post('nft/api.publics/setCollect', {
					'nft_id': nft_id,
				}).then(res => {
					this.relevantNft[index].collection_status = res.data.status;
				})
			},
			goMarket() {
				uni.setStorageSync("keywordByMarket", this.nftInfo.nft_name);
				this.app.goPage('/pages/nft/market/index');
			},
		}
	}
</script>

<style lang="scss">
	.page-body {
		background-color: #171717;
	}

	.box-bg-base {
		background-color: #1e1e1f !important;
	}

	.box {
		border-radius: 24rpx;
		margin: 0 auto;
		padding: 30rpx;
		width: 690rpx;
		position: relative;
		overflow: hidden;

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
	}

	.head {
		width: 42rpx;
		min-width: 42rpx;
		height: 42rpx;
		border-radius: 50%;
		margin-right: 10rpx;
	}

	.blank {
		height: 150rpx;
	}

	.fixed_btn {
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
		// 	min-width: 400rpx;
		// 	border: 1rpx solid $border-color-base;
		// 	border-radius: 8rpx;
		// 	padding: 0rpx 10rpx;

		// 	&.disabled {
		// 		border: 1rpx solid #6E6E6E;
		// 	}
		// }
		// .btn{
		// 	flex: 1;
		// 	// color: #FFFFFF;
		// 	background: $btn-two-purplered;
		// 	border-radius: 45rpx;
		// 	text-align: center;
		// 	font-size: 32rpx;
		// 	border-radius: 8rpx;
		// 	margin-left: -8rpx;

		// 	&.disabled {
		// 		background: #999;
		// 	}
		// }
	}

	.code_box {
		padding: 15rpx 20rpx;
		border-radius: 24rpx;
		margin: 0 auto;
	}

	.layers {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		transform-style: preserve-3d;
		z-index: -1;
	}

	.layer {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		border-radius: 25rpx;
		background-image: var(--bi);
		transform: translateZ(var(--tz));
		box-shadow: 0 0 1rpx #000d inset;
	}

	.layer:nth-child(1) {
		--tz: 0rpx;
	}

	.layer:nth-child(2) {
		--tz: -4rpx;
	}

	.layer:nth-child(3) {
		--tz: -8rpx;
	}

	.layer:nth-child(4) {
		--tz: -12rpx;
	}

	.layer:nth-child(5) {
		--tz: -16rpx;
	}

	.layer:nth-child(6) {
		--tz: -20rpx;
	}

	.layer:nth-child(7) {
		--tz: -24rpx;
	}

	.layer:nth-child(8) {
		--tz: -28rpx;
	}

	.layer:nth-child(9) {
		--tz: -32rpx;
	}

	.layer:nth-child(10) {
		--tz: -36rpx;
	}

	.layer:last-child {
		box-shadow: 0 0 5rpx #000d inset, 0 0 5rpx #000;
	}

	.list {
		width: 330rpx;
		border-radius: 24rpx;
	}

	.img_b {
		height: 330rpx;

		image {
			width: 100%;
			height: 100%;
			border-radius: 24rpx;
		}
	}

	.head_b {
		width: 40rpx;
		height: 40rpx;
		border-radius: 50%;
		flex-shrink: 0;

		image {
			width: 100%;
			height: 100%;
			border-radius: 50%;
		}
	}

	.collection {
		width: 145rpx;
		height: 56rpx;
		background: #4D4D4D;
		border-radius: 28rpx;
		justify-content: center;
	}

	.count_down {
		width: 100%;
		height: 90rpx;
		background: #6E6E6E;
		border-radius: 45rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		line-height: 40rpx;

		.title {
			line-height: 40rpx;
		}

		.times {
			line-height: 40rpx;

		}
	}

	/deep/ .ji-nav-bar {
		.header_left_info {
			/* #ifndef APP-PLUS-NVUE */
			display: flex;
			/* #endif */
			flex-direction: row;
			align-items: center;
			width: 56rpx;
			height: 56rpx;
			margin-left: 16rpx;
		}

		.header_left_back {
			width: 56rpx;
			height: 100%;
			/* #ifndef APP-PLUS-NVUE */
			display: flex;
			/* #endif */
			align-items: center;
			justify-content: center;
		}

		.header_icon {
			width: 30rpx;
			height: 30rpx;
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
