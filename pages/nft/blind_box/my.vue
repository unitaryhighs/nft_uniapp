<template>
	<view class="page-body" :class="[app.setCStyle()]">
		<view class="top_navbar" :class="wechat?'wechat':''">
			<view class="navbar">
				<view class="nav-item " v-for="(item, index) in navList" :key="index" :class="{current: tabCurrentIndex === index}"
				 @click="topTabClick(index)">{{item.text}}</view>
			</view>
		</view>
		<view class="container">
			<!-- <swiper :current="tabCurrentIndex" class="swiper-box" duration="300" @change="changeTab">
				<swiper-item class="tab-content" v-for="(tabItem,tabIndex) in navList" :key="tabIndex">
					<scroll-view class="hb100" scroll-y @scrolltolower="loadData" > -->
				<!-- 空白页 -->
				<empty v-if="navList[tabCurrentIndex].list.length === 0" class="mt80"></empty>
				<block v-else>
					<block v-for="(tabItem,tabIndex) in navList" :key="tabIndex">
						<view class="content-list" v-show="tabCurrentIndex == tabIndex">
							<view v-for="(item,index) in tabItem.list" :key="index" style="padding: 30rpx 30rpx 0;"
							class="tap" hover-class="hover" hover-start-time="0" hover-stay-time="100"
							@click="app.goPage('/pages/nft/blind_box/info?id='+item.blind_box_id)">
								<view class="list box-bg-base" >
									<view class="flex fs26" style="justify-content: space-between;">
										<view class="color-99">{{item.box_type}} - {{item.add_date}}</view>
										<view class="color-ff" >{{item.open_status>0?'已开':'待开'}}</view>
									</view>
									<view class="flex mt20">
										<view class="img">
											<!-- <image :src="baseImgUrl+item.pic" mode="aspectFill"></image> -->
											<u-image height="100%" border-radius="24" :fade="false" :lazy-load="true" :src="baseImgUrl+item.pic" mode="aspectFill">
												<u-loading size="50" mode="flower" slot="loading"></u-loading>
											</u-image>
										</view>
										<view class="ml20 box_right">
											<view class="color-ff fs30 ellipsis">{{item.blind_box_name}}</view>
											<view class="" style="display: flex;">
												<view class="color-ff fs40"><text class="fs24">￥</text>{{item.price}}</view>
												<view  v-if="item.open_status == 0" class="pull fll fs28 text-center color-00 tap" hover-class="hover" hover-start-time="0" hover-stay-time="100" hover-stop-propagation
												@click.stop="openBlindBox(item.box_id,index)">
													立即拆盒
												</view>
												<view v-else  class="pull fll fs28 text-center color-00 tap" hover-class="hover" hover-start-time="0" hover-stay-time="100" hover-stop-propagation
												@click.stop="getInfo(item.box_id)">
													查看
												</view>
											</view>
										</view>
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
		</view>
		
		<u-modal v-model="showDialog" width="600rpx" z-index="101" :show-confirm-button="false" :show-title="false" :mask-close-able="true">
			<!-- 未中奖 -->
			<block v-if="nftInfo.bind_box_goods_is_empty">
				<view class="Dialog none">
					<view class="text-center title">非常遗憾</view>
					<view class="nft_img">
						<u-image height="100%" border-radius="12" :fade="false" :lazy-load="true" src="/static/images/cry.png" mode="aspectFill">
							<u-loading size="50" mode="flower" slot="loading"></u-loading>
						</u-image>
					</view>
					<view class="color-66 fs28 text-center mt30 ellipsis">{{nftInfo.bind_box_goods_name}}</view>
				</view>
				<view class="put_btn none font-w600 fs32 text-center tap" hover-class="hover" hover-start-time="0" hover-stay-time="100"
				@click="showDialog=false">关闭</view>
			</block>
			<!-- 有奖励 -->
			<block v-else>
				<view class="Dialog">
					<view class="text-center title">恭喜获得</view>
					<view class="nft_img">
						<u-image height="100%" border-radius="12" :fade="false" :lazy-load="true" :src="nftInfo.open_bind_box_type?nftInfo.bind_box_goods_image_url:nftInfo.nft_pic" mode="aspectFill">
							<u-loading size="50" mode="flower" slot="loading"></u-loading>
						</u-image>
					</view>
					<view class="color-66 fs28 text-center mt30 ellipsis">{{nftInfo.open_bind_box_type?nftInfo.bind_box_goods_name:nftInfo.nft_name}}</view>
				</view>
				<view v-if="nftInfo.open_bind_box_type" class="put_btn fs32 text-center tap" hover-class="hover" hover-start-time="0" hover-stay-time="100"
				@click="showKefu=true">联系客服领取</view>
				<view v-else class="put_btn fs32 text-center tap" hover-class="hover" hover-start-time="0" hover-stay-time="100"
				@click="app.goPage('/pages/nft/collection/info?id='+nftInfo.sub_id)">查看</view>
			</block>
		</u-modal>
		
		<kefu :showKefu.sync="showKefu"></kefu>
	</view>
</template>


<script>
export default {
	data() {
		return {
			wechat: false,
			baseImgUrl: this.config.baseImgUrl,
			tabCurrentIndex: 0,
			showDialog:false,
			param: {
				type: '',
				p: 0
			},
			nftInfo:{},
			navList: [{
					type: 'unopen',
					text: this.app.langReplace('待开'),
					loadingType: 'more',
					list: [],
					p: 0
				},
				{
					type: 'open',
					text: this.app.langReplace('已开'),
					loadingType: 'more',
					list: [],
					num:0,
					p: 0
				}
				
			],
			is_post:false,
			showKefu: false,
		}
	},
	onLoad(options) {
		this.app.isLogin(this);//强制登陆
		let title = this.app.langReplace('我的盲盒');
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
		this.loadData('refresh');
	},
	onReachBottom() {
		this.loadData('add');
	},
	async onPullDownRefresh() {
		await this.loadData('refresh');
		uni.stopPullDownRefresh();
	},
	onBackPress() {
		return this.app.backPress([
			{obj: this, key: 'showKefu'},
			{obj: this, key: 'showDialog'},
		])
	},
	methods: {
		//获取订单列表
		loadData(source) {
			return new Promise((resolve,reject) => {
				//这里是将订单挂载到tab列表下
				let index = this.tabCurrentIndex;
				let navItem = this.navList[index];
				if (source === 'refresh') {
					navItem.p = 0;
					navItem.loadingType = 'more';
					// navItem.list = [];
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
				this.$u.post('nft/api.my_blind_box/getList', this.param).then(res => {
					if (source === 'refresh') {
						navItem.list = [];
					}
					navItem.list = navItem.list.concat(res.data.list);
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
		openBlindBox(box_id,index){
			if (this.is_post == true){
				return true;
			}
			this.is_post = true;
			this.$u.post('nft/api.flow/open', {'box_id':box_id}).then(res => {
				this.is_post = false;
				if (res.code == 0){
					this.$u.toast(res.msg);
					return false;
				}
				this.nftInfo = res.data;
				this.nftInfo.nft_pic = this.baseImgUrl + this.nftInfo.nft_pic;
				this.showDialog = true;
				let navItem = this.navList[this.tabCurrentIndex];
				navItem.list[index].nft_id = this.nftInfo.nft_id;
				this.loadData('refresh');
			}).catch(res=>{
				this.is_post = false;
			})
		},
		getInfo(box_id){
			this.$u.post('nft/api.my_blind_box/getInfo', {'box_id':box_id}).then(res => {
				if (res.code == 0){
					this.$u.toast(res.msg);
					return false;
				}
				this.nftInfo = res.data;
				this.nftInfo.nft_pic = this.baseImgUrl + this.nftInfo.nft_pic;
				this.showDialog = true;
			})
		}
	}
}
</script>

<style lang="scss">
	.top_navbar {
		position: sticky;
		z-index: 99;
		background-color: $page-color-base;
		top: var(--window-top);
			
		&.wechat {
			top: 0px;
		}
	}
	.container {
		flex: 1;
	}
	.navbar .nav-item.current{
		color: #FFFFFF;
		font-size: 28rpx;
	}
	.navbar{
		box-shadow: unset;
	}
	.navbar .nav-item.current:after{
	    // width: 35%;
		width: 32rpx;
		height: 5rpx;
		// border-bottom: 2px solid;
	    // border-color: #333;
		border: none;
	    background: $btn-two-purplered;
	}
	.log{
		padding: 20rpx 0;
		width: auto;
	}
	.swiper-box{
		height: 100%;
	}
	.tab-content {
		overflow-y: scroll;
	}
	.list{
		height: 271rpx;
		border-radius: 16rpx;
		padding: 24rpx 32rpx 33rpx 29rpx;
	}
	.img{
		width: 150rpx;
		min-width: 150rpx;
		height: 150rpx;
		flex-shrink: 0;
		image{
			width: 100%;
			height: 100%;
			border-radius: 24rpx;
		}
	}
	.pull{
		width: 153rpx;
		height: 56rpx;
		background: $btn-two-purplered;
		border-radius: 32rpx;
		line-height: 56rpx;
	}
	.tit_img{
		width: 329rpx;
		height: 86rpx;
		margin: 42rpx auto;
		image{
			width: 100%;
			height: 100%;
			
		}
		text{
			position: absolute;
			left: 0 ;
			right: 0;
			top: 8rpx;
			z-index: 2;
		}
	}
	.Dialog{
		width: 100%;
		height: 690rpx;
		border-radius: 22rpx;
		// margin-top: -90rpx;
		// background: url(/static/images/box_bg.png) center/cover;
		background: linear-gradient(to bottom,#fffbf5,#fbf0df);
		padding-top: 60rpx;
		
		&.none {
			background: linear-gradient(to bottom,#f0f0f0,#c8c8c8);
			
			.title {
				color: #333;
				&::after,
				&::before {
					background-color: #333;
				}
			}
		}
		  
		&>.title {
			color: #A26D42;
			font-size: 44rpx;
			font-family: Source Han Sans CN;
			font-weight: bold;
			position: relative;
			
			&::after,
			&::before {
				width: 70rpx;
				height: 2rpx;
				content: '';
				position: absolute;
				bottom: 50%;
				transform: translateY(50%);
				background-color: #A26D42;
			}
			&::before {
				left: 118rpx;
			}
			&::after {
				right: 118rpx;
			}
		}
		.nft_img{
			width: 280rpx;
			height: 280rpx;
			margin: 0 auto;
			  
			margin-top: 80rpx;
			image{
				width: 100%;
				height: 100%;
				border-radius: 12rpx;
			}
		}
	}
	.put_btn{
		width: 340rpx;
		height: 70rpx;
		margin: 40rpx auto;
		margin-top: -120rpx;
		// background: linear-gradient(116.57deg, rgba(211, 150, 83, 1) 0%, rgba(178, 114, 69, 1) 100%);
		background-color: $btn-two-purplered;
		border-radius: 35rpx;
		line-height: 70rpx;
		color: #7D583B;
		
		&.none {
			background-color: #999;
				color: #fff;
		}
	}
	.box_right{
		    display: flex;
		    flex-direction: column;
		    justify-content: space-between;
		    flex: 1;
	}
	/deep/ .u-mode-center-box{
		        background-color: transparent;
	}
	/deep/ .u-model{
		background-color: transparent;
	}
</style>
