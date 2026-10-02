<template>
	<view class="page-body " :class="[app.setCStyle()]">
		
		<view class="top_navbar">
			<view class="navbar ">
				<view class="nav-item " v-for="(item, index) in navList" :key="index" :class="{current: tabCurrentIndex === index}"
				 @click="topTabClick(index)">{{item.text}}</view>
			</view>
		</view>
			
		<swiper :current="tabCurrentIndex" class="swiper-box" duration="300" @change="changeTab">
			<swiper-item class="tab-content" v-for="(tabItem,tabIndex) in navList" :key="tabIndex">
				<scroll-view class="hb100" scroll-y @scrolltolower="loadData">
					<!-- 空白页 -->
					<empty v-if="tabItem.list.length === 0"></empty>
					<block v-else>
						<view v-if="tabItem.type == 'sale'">
							<view class="list mt20 box-bg-base" v-for="(item,index) in tabItem.list" :key="index" >
								<view class="color-cc fs20 flex">
									<view >寄售时间：{{item.put_sale_time}}</view>
									<view class="flex_bd text-right">寄售价格：{{item.put_sale_price}}</view>
								</view>
								<view  class="flex mt20">
									<view class="img" @click="open(item)">
										<image :src="baseImgUrl+item.pic" mode=""></image>
									</view>
									<view  class="flex mt20">
										<view class="img" @click="open(item)">
											<image :src="baseImgUrl+item.pic" mode=""></image>
										</view>
										<view class="ml20 flex_bd" >
											<view class="color-ff fs32">{{item.nft_name}}</view>
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
						</view>
						<view v-else-if="tabItem.type == 'saleOut'">
							<view class="list mt20 box-bg-base" v-for="(item,index) in tabItem.list" :key="index" >
								<view class="color-cc fs20 flex">
									<view >出售时间：{{item.add_time}}</view>
									<view class="flex_bd text-right">出售价格：{{item.sale_price}}</view>
								</view>
								<view  class="flex mt20">
									<view class="img" @click="open(item)">
										<image :src="baseImgUrl+item.pic" mode=""></image>
									</view>
									<view class="ml20 flex_bd" >
										<view class="color-ff fs32">{{item.nft_name}}</view>
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
						<view v-else-if="tabItem.type == 'in'">
							<view class="list mt20 box-bg-base" v-for="(item,index) in tabItem.list" :key="index" >
								<view class="color-cc fs20 flex">
									<view >转入时间：{{item.add_time}}</view>
									<view class="flex_bd text-right">来源类型：{{item.transfer_type}}</view>
								</view>
								<view  class="flex mt20">
									<view class="img" @click="open(item)">
										<image :src="baseImgUrl+item.pic" mode=""></image>
									</view>
									<view class="ml20 flex_bd" >
										<view class="color-ff fs32">{{item.nft_name}}</view>
										<view class="flex mt30">
											<view class="flex fh">
												<view class="head">
													<image :src="baseImgUrl+item.creator_headimgurl" mode=""></image>
												</view>
												<view class="fs26 color-99 ml10">{{item.creator_name}}</view>
											</view>
											<view class="color-ff fs40">#{{item.token_id}}</view>
										</view>
										<view class="color-ff mt10 text-right">来源用户：{{item.from_uid==0?'平台':item.from_uid+' - '+item.from_mobile}}</view>
									</view>
								</view>
								
							</view>
						</view>
						<view v-else-if="tabItem.type == 'out'">
							<view class="list mt20 box-bg-base" v-for="(item,index) in tabItem.list" :key="index">
								<view class="color-cc fs20 flex">
									<view >转出时间：{{item.add_time}}</view>
								</view>
								<view  class="flex mt20">
									<view class="img"  @click="open(item)">
										<image :src="baseImgUrl+item.pic" mode=""></image>
									</view>
									<view class="ml20 flex_bd" >
										<view class="color-ff fs32">{{item.nft_name}}</view>
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
						<view v-else-if="tabItem.type == 'burn'">
							<view class="list mt20 box-bg-base" v-for="(item,index) in tabItem.list" :key="index" >
								<view class="color-cc fs20 flex">
									<view >销毁时间：{{item.burn_time}}</view>
									<view v-if="item.mix_to > 0" @click="app.goPage('info?id='+item.mix_to)" class="flex_bd  text-right">合成藏品</view>
								</view>
								<view  class="flex mt20">
									<view class="img" @click="open(item)">
										<image :src="baseImgUrl+item.pic" mode=""></image>
									</view>
									<view class="ml20 flex_bd" >
										<view class="color-ff fs32">{{item.nft_name}}</view>
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
						<view v-else class="p30 flex" style="justify-content: space-between;flex-wrap: wrap;">
							<view  v-for="(item,index) in tabItem.list" :key="index" @click="open(item)" class="color-ff block mt20 box-bg-base relative">
								<view v-if="item.num > 0" class="tips">
									x{{item.num}}
								</view>
								<view v-if="item.token_id" class="tips">
									#{{item.token_id}}
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
					</block>		
				</scroll-view>
			</swiper-item>
		</swiper>
		<u-modal v-model="showNftBox" width="720rpx"  z-index="101" :show-confirm-button="false" :show-title="false" :mask-close-able="true">
			<scroll-view class="box-bg-base" style="height:990rpx;" scroll-y>
				<view class="p20 flex" style="justify-content: space-between;flex-wrap: wrap;">
				<view  v-for="(item,index) in nftList" :key="index" @click="app.goPage('info?id='+item.sub_id);" class="color-ff block mt20 bg-base relative">
					<view v-if="item.token_id" class="tips">
						#{{item.token_id}}
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
	</view>
</template>


<script>
export default {
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
					type: 'sale',
					text: this.app.langReplace('寄售中'),
					loadingType: 'more',
					list: [],
					p: 0
				},
				{
					type: 'saleOut',
					text: this.app.langReplace('售出'),
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
		let title = this.app.langReplace('我的藏品');
		uni.setNavigationBarTitle({
		　　title:title
		})
		
		this.loadData();
	},
	methods: {
		//获取列表
		loadData(source) {
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
	.swiper-box{
		height: calc(100% - 100rpx);
	}
	.tab-content {
		overflow-y: scroll;
	}
	.block{
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
			border-radius: 50%;
		}
	}
	.list{
		border-radius: 16rpx;
		padding: 24rpx 32rpx 33rpx 29rpx;
		margin: 10rpx;
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
