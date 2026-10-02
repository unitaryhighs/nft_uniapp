<template>
	<view class="page-body" :class="[app.setCStyle()]">
		<ji-nav-bar v-if="!wechat" class="ji-nav-bar" ref="navBar" type="transparentFixed" bgColor="#1E1E1F" :withPadding="false" fontColor="#ffffff">
			<view class="preview" slot="default" style="color: #fff">创作者主页</view>
		</ji-nav-bar>
		
		<!-- #ifndef H5 -->
		<view class="top_title pt30" :style="{height: (statusBarHeight + 500) + 'rpx'}">
		<!-- #endif -->
		<!-- #ifdef H5 -->
		<view class="top_title pt30">
		<!-- #endif -->
			<!-- <view class="back-btn pt20" @click="app.goPage(-1)"><u-icon name="arrow-left" color="#FFFFFF" size="40"></u-icon></view> -->
			<!-- #ifndef H5 -->
			<view class="mt80 flex fh" :style="{paddingTop: statusBarHeight + 'rpx'}">
			<!-- #endif -->
			<!-- #ifdef H5 -->
			<view class="mt80 flex fh">
			<!-- #endif -->
				<image :src="userInfo.headimgurl?userInfo.headimgurl:'/static/images/headimgurl.jpg'" class="mine_bg"  mode="widthFix"></image>
				<!-- #ifndef H5 -->
				<view class="mine_mask" :style="{height: (statusBarHeight + 500) + 'rpx'}"></view>
				<!-- #endif -->
				<!-- #ifdef H5 -->
				<view class="mine_mask"></view>
				<!-- #endif -->
				
				<view class="tahead">
					<image :src="userInfo.headimgurl?userInfo.headimgurl:'/static/images/headimgurl.jpg'"></image>
				</view>
				<view class="ml30">
					<view class="color-cc fs24">{{userInfo.nick_name}}</view>
					<view class="color-cc fs24 mt10">{{userInfo.mobile}}</view>
				</view>
				<!-- <view class="fll mr30 follow_btn fh fs30" :style="collection_status!=1?'color:#ffffff':'color:#F3D7B7'" @click="setFollow"> -->
				<view class="fll mr30 follow_btn fh fs30" @click="setFollow">
					<u-icon name="plus" color="#ffffff" size="32" class="mr10" v-if="!follow_status"></u-icon>{{follow_status!=1?'关注':'已关注'}}
				</view>
			</view>
			<view class="ml40 color-cc fs24 mt30 mr20 ellipsis-5">
				个人简介：{{userInfo.creator_desc}}
			</view>
		</view>
		<view class="box_b">
			<view class="color-ff fs30 flex pt30 plr30 lh80">
				<view class="">作品</view>
				<view class="fll color-99">共<text>{{total_count}}</text>个</view>
			</view>
			<!-- <swiper :current="tabCurrentIndex" class="swiper-box" duration="300" @change="changeTab">
				<swiper-item class="tab-content" v-for="(tabItem,tabIndex) in navList" :key="tabIndex">
					<scroll-view class="hb100" scroll-y @scrolltolower="loadData"> -->
						<!-- 空白页 -->
						<empty v-if="navList[tabCurrentIndex].list.length === 0"></empty>
						<view v-else class="list_box">
							<view class="flex" style="justify-content: space-between;flex-wrap: wrap;padding: 30rpx 30rpx 0;">
								<view  v-for="(item,index) in navList[tabCurrentIndex].list" :key="index" @click="open(item)" 
								class="color-ff list mt20 relative tap" hover-class="hover" hover-start-time="0" hover-stay-time="100">
									<view v-if="item.nums > 0" class="tips">
										x{{item.nums}}
									</view>
									<view class="img"><image :src="baseImgUrl+item.pic" mode="aspectFill"></image></view>
									<view class="p20">
										<view class="fs30">{{item.nft_name}}</view>
									</view>
								</view>
							</view>
							<uni-load-more :status="navList[tabCurrentIndex].loadingType"></uni-load-more>
						</view>
						
					<!-- </scroll-view>
				</swiper-item>
			</swiper> -->
		</view>
		
	</view>
</template>


<script>
export default {
	data() {
		return {
			follow_status:0,
			baseImgUrl: this.config.baseImgUrl,
			creatorId:0,
			userInfo:{
			},
			param: {
				type: '',
				p: 0
			},
			tabCurrentIndex:0,
			navList: [{
					type: 'creator',
					text: this.app.langReplace('藏品'),
					loadingType: 'more',
					list: [],
					p: 0
				}
			],
			total_count:0,
			wechat: false,
			statusBarHeight: 0,
		}
	},
	onLoad(options) {
		let title = this.app.langReplace('创作者');
		uni.setNavigationBarTitle({
		　　title:title
		})
		this.creatorId = options.creator_id;
						
		// 判断微信浏览器
		// #ifdef H5
		let ua = window.navigator.userAgent.toLowerCase()
		if (ua.match(/MicroMessenger/i) == 'micromessenger') {
			// do something
			this.wechat = true;
		}
		// #endif
		
		let info = this.$u.sys();
		this.statusBarHeight = info.statusBarHeight * 750 / info.windowWidth;
	},
	onShow() {
		this.getInfo();
		this.loadData('refresh');
	},
	onReachBottom() {
		this.loadData('add');
	},
	onPageScroll(e) {
		this.$refs.navBar.pageScroll(e);
	},
	onPullDownRefresh() {
		this.getInfo();
		this.loadData('refresh');
	},
	methods: {
		getInfo(){
			this.$u.post('nft/api.publics/getCreatorInfo', {'creator_id':this.creatorId}).then(res => {
				this.userInfo = res.data;
				this.userInfo.headimgurl = this.baseImgUrl + this.userInfo.headimgurl;
				this.follow_status = res.data.follow_status;
				// console.log(this.userInfo.headimgurl);
			})
		},
		setFollow(){
			this.$u.post('nft/api.follow_creator/set', {
				'creator_id': this.creatorId,
			}).then(res => {
				this.follow_status = res.data.status;
			})
		},
		//获取列表
		loadData(source) {
			//这里是将订单挂载到tab列表下
			let index = this.tabCurrentIndex;
			let navItem = this.navList[index];
			if (source === 'refresh'){
				navItem.p = 0;
				navItem.loadingType = 'more';
				// navItem.list = [];
				navItem.loaded = false;
			}
			if (navItem.loadingType == 'nomore') {
				return;
			}
			if (source === 'tabChange' && navItem.loaded === true) {
				//tab切换只有第一次需要加载数据
				return;
			}
			if (navItem.loadingType === 'loading') {
				//防止重复加载
				return;
			}
			navItem.p++;
			this.param.p = navItem.p;
			navItem.loadingType = 'loading';
			this.$u.post('nft/api.publics/getCreatorList', {'creator_id':this.creatorId}).then(res => {
				if (source === 'refresh'){
					navItem.list = [];
				}
				navItem.list = navItem.list.concat(res.data.list);
				this.total_count = res.data.total_count;
				//loaded新字段用于表示数据加载完毕，如果为空可以显示空白页
				this.$set(navItem, 'loaded', true);
				//判断是否还有下一页，有是more  没有是nomore
				navItem.loadingType = navItem.p == res.data.page_count ? 'nomore' : 'more';
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
		},
		open(item){
			this.app.goPage('/pages/nft/goods/info?nft_id='+item.nft_id);
		}
	}
}
</script>

<style lang="scss">
	.page-body {
		padding-bottom: 0;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
	}
	.mine_bg{
		position: absolute;
		width: 100%;
		z-index: -1;
		// top: -2rpx;
	}
	.mine_mask{
		position: absolute;
		width: 100%;
		top: 0;
		left: 0;
		height: 500rpx;
		z-index: -1;
		background-color: rgba(0, 0, 0, .6);
	}
	.top_title {
		position: relative;
		top: 0;
		width: 100%;
		z-index: 90;
		color: #FFFFFF;
		height: 500rpx;
		.top_bg{
			position: absolute;
			width: 100%;
			height: 100%;
			top: 0;
			z-index: -999;
		}
	}
	
	// .swiper-box{
	// 	 height: calc(100% - 420rpx)
	// }
	.tab-content {
		overflow-y: scroll;
	}
	.list{
		width: 330rpx;
		border-radius: 24rpx;
		background: #2d2d2d;
	}
	.tips{
		position: absolute;
		top:20rpx;
		right: 20rpx;
		color: #FFFFFF;
		border-radius: 20rpx;
		padding: 5rpx 15rpx;
		background-color:rgba(29,29,46,0.3);
		z-index: 90;
	}
	.img{
		height: 330rpx;
		image{
			width: 100%;
			height: 100%;
			border-radius: 24rpx;
		}
	}
	.head{
		width: 40rpx;
		height: 40rpx;
		border-radius: 50%;
		overflow: hidden;
		image{
			width: 100%;
			height: 100%;
			
		}
	}
	.tahead{
		width: 126rpx;
		height: 126rpx;
		border-radius: 50%;
		border: 4rpx solid #FFFFFF;
		overflow: hidden;
		margin-left: 50rpx;
		image{
			border-radius: 50%;
			width: 100%;
			height: 100%;
			
		}
	}
	.list_box{
		border-top-left-radius: 20rpx;
		border-top-right-radius: 20rpx;
	}
	.follow_btn{
		width: 155rpx;
		height: 62rpx;
		background: rgba(150, 150, 150, .8);
		border-radius: 31rpx;
		display: flex;
		justify-content: center;
	}
	.box_b{
		height: 100%;
		position: relative;
		z-index: 92;
		border-top-left-radius: 36rpx;
		border-top-right-radius: 36rpx;
		background-color: #1E1E1F;
		margin-top: -30rpx;
	}
</style>
