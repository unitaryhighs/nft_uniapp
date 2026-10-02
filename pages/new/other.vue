<template>
	<view class="page-body" :class="[app.setCStyle()]">
		<view class="top_title pt30">
			<!-- #ifndef H5 -->
			<view class="window-top mb40"></view>
			<!-- #endif -->
			<view class="back-btn pt20" @click="app.goPage(-1)"><u-icon name="arrow-left" color="#FFFFFF" size="40"></u-icon></view>
			<image src="../../../static/images/tabg.png" class="top_bg" mode=""></image>
			<view class="mt80 flex fh">
				<view class="tahead" @click="app.goPage('/pages/member/center/editInfo')">
					<image :src="headimgurl?headimgurl:'/static/images/headimgurl.jpg'"></image>
				</view>
				<view class="ml30">
					<view class="color-99 fs24">NFT艺术家</view>
					<view class="color-99 fs24 mt10">130****4540</view>
					<view class="color-99 fs24 mt10">区块链地址: fdf4398945vkvn0949s84...</view>
				</view>
			</view>
		</view>
		<swiper :current="tabCurrentIndex" class="swiper-box" duration="300" @change="changeTab">
			<swiper-item class="tab-content" v-for="(tabItem,tabIndex) in navList" :key="tabIndex">
				<scroll-view class="hb100" scroll-y @scrolltolower="loadData">
					<!-- 空白页 -->
					<empty v-if="tabItem.list.length === 0"></empty>
					
					<view v-else class="list_box">
						<view class="color-ff fs30 flex pt30 plr30">
							<view class="">藏品</view>
							<view class="fll">共<text style="color: #007CFF;">12</text>个</view>
						</view>
						<view class="p30 flex" style="justify-content: space-between;flex-wrap: wrap;">
							<view  v-for="(item,index) in tabItem.list" :key="index" @click="open(item)" class="color-ff list mt20 relative" style="background: #252429;">
								<view v-if="item.num > 0" class="tips">
									x{{item.num}}
								</view>
								<view v-if="item.token_id" class="tips">
									#{{item.token_id}}/{{item.nft_nums}}
								</view>
								<view class="img"><image :src="baseImgUrl+item.pic" mode=""></image></view>
								<view class="p20">
									<view class="fs30">{{item.nft_name}}</view>
									<view class="flex fh mt10">
										<view class="head">
											<image :src="baseImgUrl+item.creator_headimgurl" mode=""></image>
										</view>
										<view class="ml20 fs26 color-99">{{item.creator_name}}</view>
									</view>
								</view>
							</view>
						</view>
						<uni-load-more :status="tabItem.loadingType"></uni-load-more>
					</view>
					
				</scroll-view>
			</swiper-item>
		</swiper>
		<u-modal v-model="showNftBox" width="720rpx"  z-index="9999999" :show-confirm-button="false" :show-title="false" :mask-close-able="true">
			<scroll-view  class="box-bg-base" style="height:990rpx;" scroll-y>
				<view class="p20 flex" style="justify-content: space-between;flex-wrap: wrap;">
				<view  v-for="(item,index) in nftList" :key="index" @click="app.goPage('info?id='+item.sub_id);" class="color-ff list mt20 bg-base relative">
					<view v-if="item.token_id" class="tips">
						#{{item.token_id}}/{{item.nft_nums}}
					</view>
					<view class="img"><image :src="baseImgUrl+item.pic" mode=""></image></view>
					<view class="p20">
						<view class="fs30">{{item.nft_name}}</view>
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
		</u-modal>
		<tabbar :now_page="now_page" :getCartNum="0"></tabbar>
	</view>
</template>


<script>
import tabbar from '@/pages/public/tabbar';
export default {
	components: {
		tabbar
	},
	data() {
		return {
			baseImgUrl: this.config.baseImgUrl,
			tabCurrentIndex: 0,
			param: {
				type: '',
				p: 0
			},
			navList: [{
					type: 'have',
					text: this.app.langReplace('拥有'),
					loadingType: 'more',
					list: [],
					p: 0
				},
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
		let title = this.app.langReplace('TA的主页');
		uni.setNavigationBarTitle({
		　　title:title
		})
		this.now_page = this.$mp.page.route;
		this.loadData();
	},
	methods: {
		//获取列表
		loadData(source) {
			//这里是将订单挂载到tab列表下
			let index = this.tabCurrentIndex;
			let navItem = this.navList[index];
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
			this.param.type = navItem.type;
			this.param.p = navItem.p;
			navItem.loadingType = 'loading';
			this.$u.post('nft/api.collection/getList', this.param).then(res => {
				navItem.list = navItem.list.concat(res.data.list);
				//loaded新字段用于表示数据加载完毕，如果为空可以显示空白页
				this.$set(navItem, 'loaded', true);
				//判断是否还有下一页，有是more  没有是nomore
				navItem.loadingType = navItem.p == res.data.page_count ? 'nomore' : 'more';
			})
		},
		//获取NFT列表
		getNftList(nft_id) {
			this.nftList = [];
			this.$u.post('nft/api.collection/getNftList', {nft_id:nft_id}).then(res => {
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
	.top_title {
		position: relative;
		top: 0;
		width: 100%;
		z-index: 99;
		color: #FFFFFF;
		height: 368rpx;
		.top_bg{
			position: absolute;
			width: 100%;
			height: 100%;
			top: 0;
			z-index: -999;
		}
	}
	.log{
		padding: 20rpx 0;
		width: auto;
	}
	.swiper-box{
		 height: calc(100% - 200rpx)
	}
	.tab-content {
		overflow-y: scroll;
	}
	.list{
		width: 330rpx;
		border-radius: 24rpx;
	}
	.tips{
		position: absolute;
		top:20rpx;
		right: 20rpx;
		color: #FFFFFF;
		border-radius: 20rpx;
		padding: 5rpx 15rpx;
		background-color:rgba(29,29,46,0.3);
		z-index: 99;
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
</style>
