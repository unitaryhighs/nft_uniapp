<template>
	<view class="page-body" :class="[app.setCStyle()]">
		<view class="top_navbar" :class="wechat?'wechat':''">
			<view class="navbar">
				<view class="nav-item" v-for="(item, index) in navList" :key="index" :class="{current: tabCurrentIndex === index}"
				 @click="topTabClick(index)">{{item.text}}</view>
			</view>
		</view>
		<div class="container">
			<!-- <swiper :current="tabCurrentIndex" class="swiper-box" duration="300" @change="changeTab"> -->
				<!-- <swiper-item class="tab-content" v-for="(tabItem,tabIndex) in navList" :key="tabIndex"> -->
				<empty v-if="navList[tabCurrentIndex].orderList.length === 0" class="mt80"></empty>
				<block v-else>
					<block v-for="(tabItem,tabIndex) in navList" :key="tabIndex">
						<view class="content-list" v-show="tabCurrentIndex == tabIndex">
						<!-- <scroll-view class="hb100" scroll-y @scrolltolower="loadData"> -->
							<!-- 空白页 -->
							<view v-for="(item,index) in tabItem.orderList" :key="index" style="padding: 30rpx 30rpx 0;" class="tap" hover-class="hover" hover-start-time="0" hover-stay-time="100"
							@click="app.goPage('info?order_id='+item.order_id+'&order_type='+item.order_type)">
								<view class="list box-bg-base" >
									<view class="flex" style="justify-content: space-between;">
										<view class="color-99">订单编号：{{item.order_sn}}</view>
										<view class="base-color" >{{item.ostatus}}</view>
									</view>
									<view v-if="item.blind_box_id > 0" class="flex mt20">
										<view class="img">
											<!-- <image :src="baseImgUrl+item.blind_box_pic" mode="aspectFill"></image> -->
											<u-image height="100%" border-radius="24" :fade="false" :lazy-load="true" :src="baseImgUrl+item.blind_box_pic" mode="aspectFill">
												<u-loading size="50" mode="flower" slot="loading"></u-loading>
											</u-image>
										</view>
										<view class="ml20" style="flex: 1;">
											<view class="color-ff fs32 ellipsis">{{item.blind_box_name}}</view>
											<view class="flex mt30">
												<view class="flex fh"></view>
												<view class="color-ff fs40">￥{{item.order_amount}}</view>
											</view>
											<view class="color-cc fs20 text-right">{{item.orderType}}</view>
										</view>
									</view>
									<view v-else class="flex mt20">
										<view class="img">
											<!-- <image :src="item.nft_square_pic?baseImgUrl+item.nft_square_pic:baseImgUrl+item.nft_pic_thumb" mode="aspectFill"></image> -->
											<u-image height="100%" border-radius="24" :fade="false" :lazy-load="true" :src="item.nft_square_pic?baseImgUrl+item.nft_square_pic:baseImgUrl+item.nft_pic_thumb" mode="aspectFill">
												<u-loading size="50" mode="flower" slot="loading"></u-loading>
											</u-image>
										</view>
										<view class="ml20 flex_center">
											<view class="color-ff fs32 ellipsis">{{item.nft_name}}</view>
											<view class=" mt30" style="display: flex;">
												<view class="" style="display: flex;">
													<image class="head" :src="baseImgUrl+item.creator_headimgurl" mode=""></image>
													<view class="fs26 color-99 ml10 ellipsis">{{item.creator_name}}</view>
												</view>
											</view>
										</view>
										<view class="fll" style="display: flex; flex-direction: column-reverse;">
											<view class="color-cc fs20 text-right">{{item.orderType}}</view>
											<view class="color-ff fs40 fll">￥{{item.order_amount}}</view>
										</view>
									</view>
									<view class="btn_box" v-if="item.ostatus == '待支付'">
										<view class="btn tap" hover-class="hover" hover-start-time="0" hover-stay-time="100" hover-stop-propagation
										@click.stop="goPay(item)">立即支付</view>
									</view>
								</view>
								
							</view>
							<uni-load-more :status="tabItem.loadingType"></uni-load-more>
						</view>
					</block>
				</block>
					<!-- </scroll-view>
				</swiper-item>
			</swiper> -->
		</div>
	</view>
</template>


<script>
export default {
	data() {
		return {
			wechat: false,
			baseImgUrl: this.config.baseImgUrl,
			tabCurrentIndex: 0,
			param: {
				type: '',
				p: 0
			},
			navList: [{
					type: 'all',
					text: this.app.langReplace('全部'),
					loadingType: 'more',
					orderList: [],
					p: 0
				},
				{
					type: 'waitPay',
					text: this.app.langReplace('待付款'),
					loadingType: 'more',
					orderList: [],
					num:0,
					p: 0
				},
				{
					type: 'sign',
					text: this.app.langReplace('已完成'),
					loadingType: 'more',
					orderList: [],
					p: 0
				},
				{
					type: 'cancel',
					text: this.app.langReplace('已取消'),
					loadingType: 'more',
					orderList: [],
					num:0,
					p: 0
				},
			],
		}
	},
	onLoad(options) {
		this.app.isLogin(this);//强制登陆
		let title = this.app.langReplace('我的订单');
		uni.setNavigationBarTitle({
		　　title:title
		})
		
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
		// if(this.app.refreshData(this.$mp.page.route, Date.now())){
			this.loadData('refresh');
		// }
	},
	onReachBottom() {
		this.loadData('add');
	},
	async onPullDownRefresh() {
		await this.loadData('refresh');
		uni.stopPullDownRefresh();
	},
	methods: {
		goPay(item){
			uni.navigateTo({
				url: `pay?from=nft&order_id=${item.order_id}&order_type=${item.order_type}`
			})
		},
		//获取订单列表
		loadData(source) {
			return new Promise((resolve,reject) => {
				//这里是将订单挂载到tab列表下
				let index = this.tabCurrentIndex;
				let navItem = this.navList[index];
				if (source === 'refresh') {
					navItem.p = 0;
					navItem.loadingType = 'more';
					// navItem.orderList = [];
					navItem.loaded = false;
				}
				if (navItem.loadingType == 'nomore' || navItem.loadingType === 'loading') {
					return;
				}
				if (source === 'tabChange' && navItem.loaded === true) {
					//tab切换只有第一次需要加载数据
					return;
				}
				navItem.p++;
				this.param.type = navItem.type;
				this.param.p = navItem.p;
				navItem.loadingType = 'loading';
				this.$u.post('nft/api.order/getList', this.param).then(res => {
					if (source === 'refresh') {
						navItem.orderList = [];
					}
					navItem.orderList = navItem.orderList.concat(res.data.list);
					//loaded新字段用于表示数据加载完毕，如果为空可以显示空白页
					this.$set(navItem, 'loaded', true);
					//判断是否还有下一页，有是more  没有是nomore
					navItem.loadingType = navItem.p == res.data.page_count ? 'nomore' : 'more';
					resolve(res)
				}).catch(err => {
					reject(err)
				})
			})
		},
		
		//swiper 切换
		changeTab(e) {
			this.tabCurrentIndex = e.target.current;
			this.loadData('tabChange');
		},
		//顶部tab点击
		topTabClick(index) {
			this.tabCurrentIndex = index;
			this.loadData(this.config.tabRefresh?'refresh':'tabChange');
		},
	}
}
</script>

<style lang="scss" scoped>
	.top_navbar {
		position: sticky;
		z-index: 99;
		background-color: $page-color-base;
		top: var(--window-top);
			
		&.wechat {
			top: 0px;
		}
	}
	.swiper-box{
		// height: calc(100vh - var(--window-top) - 100rpx);
		height: 100%;
	}
	.tab-content {
		overflow-y: scroll;
	}
	.list{
		border-radius: 16rpx;
		padding: 24rpx 32rpx 33rpx 29rpx;
	}
	.img{
		width: 150rpx;
		min-width: 150rpx;
		height: 150rpx;
		image{
			width: 100%;
			height: 100%;
			border-radius: 24rpx;
		}
	}
	.flex_center{
		    display: flex;
		    flex-direction: column;
		    justify-content: space-between;
	}
	.head{
		width: 40rpx;
		height: 40rpx;
		border-radius: 50%;
	}
	.btn_box{
		display: flex;
		padding-top: 33rpx;
		border-top: 1rpx solid #424242;
		margin-top: 30rpx;
	}
	.btn{
		width: 172rpx;
		height: 64rpx;
		// background: linear-gradient(90deg, rgba(210, 159, 127, 1) 0%, rgba(247, 221, 189, 1) 100%);
		background-color: $btn-two-purplered;
		border-radius: 34rpx;
		line-height: 64rpx;
		text-align: center;
		margin-left: auto;
	}
</style>
