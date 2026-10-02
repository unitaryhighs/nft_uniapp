<template>
	<view class="page-body " :class="[app.setCStyle()]">
		<view class="top_navbar" :class="wechat?'wechat':''">
			<view class="navbar ">
				<view class="nav-item " v-for="(item, index) in navList" :key="index" :class="{current: tabCurrentIndex === index}"
				 @click="topTabClick(index)">{{item.text}}</view>
			</view>
		</view>
		
		<view class="container">
		<!-- <swiper :current="tabCurrentIndex" class="swiper-box" duration="300" @change="changeTab">
			<swiper-item class="tab-content" v-for="(navList[tabCurrentIndex],tabIndex) in navList" :key="tabIndex">
				<scroll-view class="hb100" scroll-y @scrolltolower="loadData"> -->
					<!-- 空白页 -->
					<empty v-if="navList[tabCurrentIndex].list.length === 0" class="mt80"></empty>
					<block v-else>
						<view v-if="navList[tabCurrentIndex].type == 'sale'">
							<view class="list mt30 box-bg-base tap ellipsis-1" hover-class="hover" hover-start-time="0" hover-stay-time="100"
							v-for="(item,index) in navList[tabCurrentIndex].list" :key="index" @click="open(item)">
								<view class="color-cc fs20 flex">
									<view >挂售时间：{{item.put_sale_time}}</view>
									<view class="flex_bd text-right">挂售价格：{{item.put_sale_price}}</view>
								</view>
								<view  class="flex mt20">
									<view class="img">
										<!-- <image :src="item.square_pic?baseImgUrl+item.square_pic:baseImgUrl+item.pic_thumb" mode="aspectFit"></image> -->
										<u-image height="100%" border-radius="24" :fade="false" :lazy-load="true" :src="item.square_pic?baseImgUrl+item.square_pic:baseImgUrl+item.pic_thumb" mode="aspectFill">
											<u-loading size="50" mode="flower" slot="loading"></u-loading>
										</u-image>
									</view>
									<view class="ml20 flex_bd ellipsis-1">
										<view class="color-ff fs32 ellipsis-1">{{item.nft_name}}</view>
										<view class="flex mt30">
											<view class="flex fh">
												<view class="head">
													<image :src="baseImgUrl+item.creator_headimgurl" mode=""></image>
												</view>
												<view class="fs26 color-99 ml10">{{item.creator_name}}</view>
											</view>
											<view class="color-ff fs40">#{{item.token_id}}</view>
										</view>
									</view>
								</view>
								
							</view>
						</view>
						<view v-else-if="navList[tabCurrentIndex].type == 'saleOut'">
							<view class="list mt30 box-bg-base tap ellipsis-1" hover-class="hover" hover-start-time="0" hover-stay-time="100"
							 v-for="(item,index) in navList[tabCurrentIndex].list" :key="index" @click="open(item)">
								<view class="color-cc fs20 flex">
									<view >出售时间：{{item.add_time}}</view>
									<view class="flex_bd text-right">出售价格：{{item.sale_price}}</view>
								</view>
								<view  class="flex mt20">
									<view class="img">
										<!-- <image :src="item.square_pic?baseImgUrl+item.square_pic:baseImgUrl+item.pic_thumb" mode="aspectFit"></image> -->
										<u-image height="100%" border-radius="24" :fade="false" :lazy-load="true" :src="item.square_pic?baseImgUrl+item.square_pic:baseImgUrl+item.pic_thumb" mode="aspectFill">
											<u-loading size="50" mode="flower" slot="loading"></u-loading>
										</u-image>
									</view>
									<view class="ml20 flex_bd ellipsis-1">
										<view class="color-ff fs32 ellipsis-1">{{item.nft_name}}</view>
										<view class="flex mt30">
											<view class="flex fh">
												<view class="head">
													<image :src="baseImgUrl+item.creator_headimgurl" mode=""></image>
												</view>
												<view class="fs26 color-99 ml10">{{item.creator_name}}</view>
											</view>
											<view class="color-ff fs40">#{{item.token_id}}</view>
										</view>
									</view>
								</view>
								
							</view>
						</view>
						<view v-else-if="navList[tabCurrentIndex].type == 'in'">
							<view class="list mt30 box-bg-base tap ellipsis-1" hover-class="hover" hover-start-time="0" hover-stay-time="100"
							 v-for="(item,index) in navList[tabCurrentIndex].list" :key="index" @click="open(item)">
								<view class="color-cc fs20 flex">
									<view >转入时间：{{item.add_time}}</view>
									<view class="flex_bd text-right">来源类型：{{item.transfer_type}}</view>
								</view>
								<view  class="flex mt20">
									<view class="img">
										<!-- <image :src="item.square_pic?baseImgUrl+item.square_pic:baseImgUrl+item.pic_thumb" mode="aspectFit"></image> -->
										<u-image height="100%" border-radius="24" :fade="false" :lazy-load="true" :src="item.square_pic?baseImgUrl+item.square_pic:baseImgUrl+item.pic_thumb" mode="aspectFill">
											<u-loading size="50" mode="flower" slot="loading"></u-loading>
										</u-image>
									</view>
									<view class="ml20 flex_bd ellipsis-1">
										<view class="color-ff fs32 ellipsis-1">{{item.nft_name}}</view>
										<view class="flex mt30">
											<view class="flex fh">
												<view class="head">
													<image :src="baseImgUrl+item.creator_headimgurl" mode=""></image>
												</view>
												<view class="fs26 color-99 ml10">{{item.creator_name}}</view>
											</view>
											<view class="color-ff fs40">#{{item.token_id}}</view>
										</view>
										<view class="color-ff mt10 text-right">来源：{{item.transfer_type=='空投'?'平台':item.from_uid==0?'平台':item.from_uid+' - '+item.from_mobile}}</view>
									</view>
								</view>
								
							</view>
						</view>
						<view v-else-if="navList[tabCurrentIndex].type == 'out'">
							<view class="list mt30 box-bg-base tap ellipsis-1" hover-class="hover" hover-start-time="0" hover-stay-time="100"
							 v-for="(item,index) in navList[tabCurrentIndex].list" :key="index" @click="open(item)">
								<view class="color-cc fs20 flex">
									<view >转出时间：{{item.add_time}}</view>
								</view>
								<view  class="flex mt20">
									<view class="img">
										<!-- <image :src="item.square_pic?baseImgUrl+item.square_pic:baseImgUrl+item.pic_thumb" mode="aspectFit"></image> -->
										<u-image height="100%" border-radius="24" :fade="false" :lazy-load="true" :src="item.square_pic?baseImgUrl+item.square_pic:baseImgUrl+item.pic_thumb" mode="aspectFill">
											<u-loading size="50" mode="flower" slot="loading"></u-loading>
										</u-image>
									</view>
									<view class="ml20 flex_bd ellipsis-1">
										<view class="color-ff fs32 ellipsis-1">{{item.nft_name}}</view>
										<view class="flex mt30">
											<view class="flex fh">
												<view class="head">
													<image :src="baseImgUrl+item.creator_headimgurl" mode=""></image>
												</view>
												<view class="fs26 color-99 ml10">{{item.creator_name}}</view>
											</view>
											<view class="color-ff fs40">#{{item.token_id}}</view>
										</view>
										<view class="color-ff mt10 text-right">转到用户：{{item.to_uid==0?'平台':item.to_uid+' - '+item.to_mobile}}</view>
									</view>
								</view>
								
							</view>
						</view>
						<view v-else-if="navList[tabCurrentIndex].type == 'burn'">
							<view class="list mt30 box-bg-base tap ellipsis-1" hover-class="hover" hover-start-time="0" hover-stay-time="100"
							 v-for="(item,index) in navList[tabCurrentIndex].list" :key="index" @click="open(item)">
								<view class="color-cc fs20 flex">
									<view >销毁时间：{{item.burn_time}}</view>
									<view v-if="item.mix_to > 0" @click="app.goPage('info?id='+item.mix_to)" class="flex_bd  text-right">合成藏品</view>
								</view>
								<view  class="flex mt20">
									<view class="img">
										<!-- <image :src="item.square_pic?baseImgUrl+item.square_pic:baseImgUrl+item.pic_thumb" mode="aspectFit"></image> -->
										<u-image height="100%" border-radius="24" :fade="false" :lazy-load="true" :src="item.square_pic?baseImgUrl+item.square_pic:baseImgUrl+item.pic_thumb" mode="aspectFill">
											<u-loading size="50" mode="flower" slot="loading"></u-loading>
										</u-image>
									</view>
									<view class="ml20 flex_bd ellipsis-1">
										<view class="color-ff fs32 ellipsis-1">{{item.nft_name}}</view>
										<view class="flex mt30">
											<view class="flex fh">
												<view class="head">
													<image :src="baseImgUrl+item.creator_headimgurl" mode=""></image>
												</view>
												<view class="fs26 color-99 ml10">{{item.creator_name}}</view>
											</view>
											<view class="color-ff fs40">#{{item.token_id}}</view>
										</view>
										
									</view>
								</view>
								
							</view>
						</view>
						<view  v-else-if="navList[tabCurrentIndex].type == 'have'" class="p30 flex" style="justify-content: space-between;flex-wrap: wrap;">
							<view  v-for="(item,index) in navList[tabCurrentIndex].list" :key="index" @click="open(item)" 
							class="color-ff block mt20 box-bg-base relative tap ellipsis-1" hover-class="hover" hover-start-time="0" hover-stay-time="100">
								<view v-if="item.num > 0" class="tips">
									x{{item.num}}
								</view>
								<view v-if="item.token_id" class="tips">
									#{{item.token_id}}
								</view>
								<view class="img">
									<!-- <image :src="item.square_pic?baseImgUrl+item.square_pic:baseImgUrl+item.pic_thumb" mode="aspectFit"></image> -->
									<u-image height="100%" border-radius="24" :fade="false" :lazy-load="true" :src="item.square_pic?baseImgUrl+item.square_pic:baseImgUrl+item.pic_thumb" mode="aspectFill">
										<u-loading size="50" mode="flower" slot="loading"></u-loading>
									</u-image>
								</view>
								<view class="p20">
									<view class="fs30 ellipsis-1">{{item.nft_name}}</view>
									<view class="flex fh mt10">
										<view class="head">
											<image :src="baseImgUrl+item.creator_headimgurl" mode=""></image>
										</view>
										<view class="ml20 fs26 color-99">{{item.creator_name}}</view>
									</view>
								</view>
							</view>
						</view>
						<uni-load-more :status="navList[tabCurrentIndex].loadingType"></uni-load-more>
					</block>
				<!-- </scroll-view>
			</swiper-item>
		</swiper> -->
		</view>
		
		<u-modal class="nft-list" v-model="showNftBox" width="700rpx"  z-index="101" :show-confirm-button="false" :show-title="false" :mask-close-able="true">
			<scroll-view class="box-bg-base" style="height:900rpx;border-radius: 16rpx;" scroll-y>
				<view class="flex modal-content">
					<view v-for="(item,index) in nftList" :key="index" @click="app.goPage('info?id='+item.sub_id);" 
					class="color-ff block mt20 relative tap" hover-class="hover" hover-start-time="0" hover-stay-time="100">
						<view class="cover">
							<view class="cover-top">
								<view v-if="item.token_id" class="top-tips">
									#{{item.token_id}}
								</view>
							</view>
							<image class="img" :src="item.square_pic?baseImgUrl+item.square_pic:baseImgUrl+item.pic_thumb" mode="aspectFit"></image>
						</view>
						<view class="p20">
							<view class="fs30 ellipsis-1">{{item.nft_name}}</view>
							<view class="flex fh mt10">
								<view class="head">
									<image :src="baseImgUrl+item.creator_headimgurl" mode=""></image>
								</view>
								<view class="ml20 fs26 color-99">{{item.creator_name}}</view>
							</view>
						</view>
					</view>
				</view>
			</scroll-view>
			<view class="btn">
				<view class="close" @click="showNftBox=false">
					<u-icon name="close" color="#fff" size="28"></u-icon>
				</view>
			</view>
		</u-modal>
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
			navList: [
				{
					type: 'in',
					text: this.app.langReplace('转入'),
					loadingType: 'more',
					list: [],
					num:0,
					p: 0
				},
				{
					type: 'out',
					text: this.app.langReplace('转出'),
					loadingType: 'more',
					list: [],
					p: 0
				},
				{
					type: 'burn',
					text: this.app.langReplace('已销毁'),
					loadingType: 'more',
					list: [],
					num:0,
					p: 0
				},
			],
			showNftBox:false,
			nftList:[]
		}
	},
	onLoad(options) {
		this.app.isLogin(this);//强制登陆
		let title = this.app.langReplace('藏品记录');
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
		// #endif
		
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
			{obj: this, key: 'showNftBox'},
		])
	},
	methods: {
		//获取列表
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
				this.$u.post('nft/api.collection/getList', this.param).then(res => {
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
		//获取NFT列表
		getNftList(nft_id) {
			this.$u.post('nft/api.collection/getNftList', {nft_id:nft_id}).then(res => {
				this.nftList = [];
				this.nftList = this.nftList.concat(res.data.list);
				this.showNftBox = true;
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
		open(item){
			if (this.tabCurrentIndex == 0){
				this.getNftList(item.nft_id);
			}else{
				this.app.goPage('info?id='+item.sub_id);
			}
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
		padding: 0 30rpx;
	}
	.tab-content {
		overflow-y: scroll;
	}
	.block{
		width: 315rpx;
		border-radius: 24rpx;
		background-color: #414141;
	}
	.cover {
		.cover-top {
			position: absolute;
			z-index: 1;
			width: 100%;
			left: 0;
			top: 0;
			padding: 16rpx 0;
			display: flex;
			align-items: center;
			
			.top-tips,
			.top-ps-tips {
				margin-left: 12rpx;
				height: 30rpx;
				border-radius: 4rpx;
				color: #FEFEFE;
				display: flex;
				align-items: center;
			}
			.top-tips {
				background-color: rgba(0, 0, 0, .3);
				font-size: 28rpx;
				padding: 0 6rpx;
			}
			// .top-ps-tips {
			// 	background-color: #EF7102;
			// 	font-size: 20rpx;
			// 	padding: 2rpx 8rpx;
			// }
		}
	}
	.tips {
		position: absolute;
		top: 20rpx;
		left: 12rpx;
		color: #FFFFFF;
		border-radius: 20rpx;
		padding: 5rpx 15rpx;
		background-color: rgba(29, 29, 46, 0.3);
		z-index: 9;
		display: inline-block;
		padding: 2rpx 8rpx;
		line-height: 30rpx;
		border-radius: 4rpx;
	}
	// .tips{
	// 	position: absolute;
	// 	top:20rpx;
	// 	right: 20rpx;
	// 	color: #FFFFFF;
	// 	border-radius: 20rpx;
	// 	padding: 5rpx 15rpx;
	// 	background-color:rgba(29,29,46,0.3);
	// 	z-index: 99;
	// }
	.nft-list {
		.box-bg-base {
			.modal-content {
				justify-content: space-between;
				flex-wrap: wrap;
				padding: 20rpx 20rpx 40rpx;
			}
		}
		.img{
			width: 315rpx;
			height: 315rpx;
			border-radius: 24rpx;
		}
		/deep/ .u-mode-center-box{
			background-color: transparent !important;
		}
		.list {
			width: 315rpx;
			border-radius: 24rpx;
			
			.img_b {
				width: 315rpx;
				height: 315rpx;
			}
		}
		.btn {
			height: 100rpx;
			position: relative;
			
			.close {
				background-color: $box-color-base;
				border-radius: 50%;
				width: 80rpx;
				height: 80rpx;
				position: absolute;
				left: 50%;
				bottom: 6rpx;
				transform: translateX(-50%);
				display: flex;
				justify-content: center;
				align-items: center;
			}
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
			border-radius: 50%;
		}
	}
	.list{
		border-radius: 16rpx;
		padding: 24rpx 32rpx 33rpx 29rpx;
		.img{
			width: 150rpx;
			height: 150rpx;
			image{
				width: 100%;
				height: 100%;
				border-radius: 24rpx;
			}
		}
	}
</style>
