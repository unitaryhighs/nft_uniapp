<template>
	<view class="page-body u-skeleton" :class="[app.setCStyle()]">
		<!-- <view :style="{height: statusBarHeight+'rpx'}"></view> -->
		<view class="top-sec" :class="wechat?'wechat':''">
			<view class="flex top-bar" :style="{paddingTop: statusBarHeight?(statusBarHeight+30)+'rpx':'30rpx'}">
				<view class="flex_bd top-bar-search u-skeleton-fillet">
					<u-search class="u-search" :placeholder="app.langReplace('搜索你感兴趣的内容')" border-color="#313338"
						bg-color="#3A3A3B" color="#fff" shape="round" input-align="left" :show-action="false"
						v-model="keyword" @search="search()"></u-search>
				</view>
				<view class="ml30 menu-btn u-skeleton-fillet" @click="showCatBox=true">
					<!-- <image class="menu" src="/static/images/market/menu.png" mode="widthFix"></image> -->
					<u-icon name="list" color="#ffffff" size="50"></u-icon>
				</view>
			</view>
			
			<view class="navbar base-select fh box-bg-base">
				<view class="nav-item u-relative" :class="{current: tabType === 'all'}" data-index="all" @click="selectType">
					{{app.langReplace('全部')}}
					<view class="u-skeleton-fillet" style="width: 140rpx;height: 50rpx;position: absolute;left: 50%;top: 50%;transform: translate(-50%,-50%);"></view>
				</view>
				<!-- <view class="nav-item" :class="{current: tabType === 'new'}" data-index="new" @click="selectType">
					{{app.langReplace('最新')}}
					<text class="sort_icon" :class="{sort_desc:tabSort==='desc',sort_asc:tabSort==='asc'}"></text>
				</view>
				<view class="nav-item" :class="{current: tabType === 'heat'}" data-index="heat" @click="selectType">
					{{app.langReplace('最热')}}<text class="sort_icon"
						:class="{sort_desc:tabSort==='desc',sort_asc:tabSort==='asc'}"></text>
				</view> -->
				<view class="nav-item u-relative" :class="{current: tabType === 'price'}" data-index="price" @click="selectType">
					{{app.langReplace('价格')}}<text class="sort_icon" :class="{sort_desc:tabSort==='desc',sort_asc:tabSort==='asc'}"></text>
					<view class="u-skeleton-fillet" style="width: 140rpx;height: 50rpx;position: absolute;left: 50%;top: 50%;transform: translate(-50%,-50%);"></view>
				</view>
			</view>
		</view>
		<view v-if="loading" class="market-list flex" style="justify-content: space-between;flex-wrap: wrap;">
			<view v-for="(item,index) in 6" :key="index" class="color-ff list mt30 box-bg-base relative tap">
				<view class="img u-skeleton-fillet">
					<u-image height="100%" border-radius="20" :fade="false" :lazy-load="true" mode="aspectFill">
						<u-loading size="50" mode="flower" slot="loading"></u-loading>
					</u-image>
				</view>
				<view class="bottom">
					<view class="name ellipsis-1 u-skeleton-fillet">
						qqqqqqq
					</view>
					<view class="flex fh mt30 price u-skeleton-fillet">
						<view class="">￥<text class="fs34">qqqq</text></view>
						<view class="qi">
							起
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 空白页 -->
		<empty v-if="navList[tabCurrentIndex].list.length === 0" class="mt80"></empty>
		
		<block v-else>
			<view class="market-list flex" style="justify-content: space-between;flex-wrap: wrap;">
				<view v-for="(item,index) in navList[tabCurrentIndex].list" :key="index" @click="app.goPage('/pages/nft/market/info?nft_id='+item.nft_id)"
					class="color-ff list mt30 box-bg-base relative tap">
					<view class="img">
						<!-- <image :src="item.nft_img" mode="aspectFit"></image> -->
						<u-image height="100%" border-radius="20" :fade="false" :lazy-load="true" :src="item.nft_img" mode="aspectFill">
							<u-loading size="50" mode="flower" slot="loading"></u-loading>
						</u-image>
					</view>
					<view class="bottom">
						<view class="name ellipsis-1">
							{{item.nft_name}}
						</view>
						<view class="flex fh mt30 price">
							<view class="">￥<text class="fs34">{{item.min_price}}</text></view>
							<view class="qi">
								起
							</view>
						</view>
					</view>
				</view>
			</view>
			<uni-load-more :status="navList[tabCurrentIndex].loadingType"></uni-load-more>
		</block>

		<tabbar ref="tabbar" :now_page="now_page" :getCartNum="0"></tabbar>

		<!-- 模态层弹窗 -->
		<!-- <view class="popup" :class="searchBox" @touchmove.stop.prevent="stopPrevent">
			<view class="mask" @click="showSearchBox()"></view>
			<view class="layer box-bg-base color-ff br20" @click.stop="stopPrevent">
				<view class="fs34 mt20">选择分类</view>
				<view class="flex mt20  br20 selectCatBox " style="height: 600rpx;">
					<view class="catBoxA ">
						<view class="flex item" :class="selCatIdA==0?'bg-base':''" @click="selCatA(0)">
							<view class="fs28 ">推荐分类</view>
						</view>
						<view class="flex item" :class="item.id==selCatIdA?'bg-base':''"
							v-for="(item,index) in categoryList" :key="index" @click="selCatA(item.id)">
							<view class="img">
								<image :src="baseImgUrl+item.pic" mode="widthFix"></image>
							</view>
							<view class="fs28">{{item.name}}</view>
						</view>
					</view>
					<view class="catBoxB flex_bd bg-base br20 base-select">
						<scroll-view class="hb100" scroll-y style="overflow: auto;">
							<view class="pb20 fl w50 text-center item" :class="item.id==selCatIdB?'current':''"
								v-for="(item,index) in categoryListB[selCatIdA]" :key="index" @click="selCatB(item.id)">
								<view class="class_box_img">
									<image :src="baseImgUrl+item.pic" mode=""></image>
								</view>
								<view class=" fs30  mt20">{{item.name}}</view>
							</view>
						</scroll-view>
					</view>
				</view>
				<view class="color-ff text-center flex mt20 safe-area-inset-bottom">
					<view class="flex_bd lh80 bg-ff color-00 mlr10 br20" @click="reset()">{{app.langReplace('重置')}}
					</view>
					<view class="flex_bd lh80 bg-base mlr10 br20" @click="submit()">{{app.langReplace('确认')}}</view>
				</view>
			</view>
		</view> -->
		
		<u-popup class="u-popup" v-model="showCatBox" mode="right" width="100%">
			<view style="width: 100%;height: 100%;background-color: #1e1e1e;">
				<ji-nav-bar v-if="!wechat" class="ji-nav-bar" ref="navBar" type="fixed" bgColor="#1E1E1F" :withPadding="true" fontColor="#ffffff" 
				backState="3000" @backClick="showCatBox=false">
					<view class="preview" slot="default" style="color: #fff">筛选</view>
				</ji-nav-bar>
				<view class="container">
					<view class="sec pr30" style="padding-left: 11rpx;">
						<view class="title pt30 pb10" style="padding-left: 19rpx;">
							<image src="/static/images/market-type.png" mode="widthFix" style="width: 30rpx;margin-right: 18rpx;"></image>
							<text class="fs28 color-ff">市场类型</text>
						</view>
						<view class="content">
							<view @click="selCatA(0)" style="width: 158rpx;margin-left: 19rpx;" class="fs28 item br10 mt20" :class="selCatIdA==0?'bbtn acolor':''">
								全部
							</view>
							<view v-for="(item,index) in categoryList" :key="index" @click="selCatA(item.id)" style="width: 158rpx;margin-left: 19rpx;"
							class="fs28 item br10 mt20" :class="item.id==selCatIdA?'bbtn acolor':''">
								{{item.name}}
							</view>
						</view>
					</view>
					<view style="height: 20rpx;background-color: #171717;margin-top: 30rpx;"></view>
					<view class="sec pr30" style="padding-left: 9rpx;">
						<view class="title pt30 pb10 flex fh" style="padding-left: 21rpx;">
							<view class="line" style="width: 10rpx;height: 26rpx;background: #939393;margin-right: 20rpx;"></view>
							<text class="fs28 color-ff">专题</text>
						</view>
						<view class="content">
							<view v-if="selCatIdA==0" @click="selCatB(0)" style="width: 216rpx;margin-left: 21rpx;" class="fs28 item br10 mt20" 
							:class="selCatIdB==0?'bbtn acolor':''">
								全部
							</view>
							<view v-for="(item,index) in categoryListB[selCatIdA]" :key="index" @click="selCatB(item.id)" style="width: 216rpx;margin-left: 21rpx;"
							class="fs28 item br10 mt20" :class="item.id==selCatIdB?'bbtn acolor':''">
								{{item.name}}
							</view>
						</view>
					</view>
				</view>
			</view>
		</u-popup>
		
		<u-skeleton :loading="loading" :animation="true" el-color="#3d3d3d" bg-color="#1e1e1f"></u-skeleton>
	</view>
</template>

<script>
	import tabbar from '@/pages/public/tabbar';
	export default {
		components: {
			tabbar,
		},
		data() {
			return {
				tabSort: '',
				tabType: 'all',
				categoryList: [],
				categoryBaseList: [],
				categoryListB: {},
				index: 0,
				baseImgUrl: this.config.baseImgUrl,
				now_page: '',
				tabCurrentIndex: 0,
				navList: [{
					"id": 0,
					"name": '全部',
					loadingType: 'more',
					list: [],
					p: 0
				}],
				keyword: '',
				param: {},
				showCatBox: false,
				cat_id: 0,
				searchBox: 'none',
				selCatIdA: 0,
				selCatIdB: 0,
				wechat: false,
				statusBarHeight: 0,
				loading: true,
			}
		},
		onLoad(options) {
			let title = this.app.langReplace('市场');
			uni.setNavigationBarTitle({
				title: title
			})

			this.now_page = this.$mp.page.route;
			
			let keywordByMarket = uni.getStorageSync("keywordByMarket");
			if (keywordByMarket) {
				this.selCatIdA = 0;
				this.selCatIdB = 0;
				this.keyword = keywordByMarket;
				uni.removeStorageSync("keywordByMarket");
			}
			
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
			
			setTimeout(() => {
				this.loading = false;
			},5000)
		},
		onShow() {
			// this.app.isLogin(this); //强制登陆
			if(!this.categoryList.length){
				this.loadCatList();
			} else if (this.app.refreshData(this.$mp.page.route, Date.now())){
				this.loadData('refresh');
			}
			
			if(this.$refs.tabbar){
				this.$refs.tabbar.autoFun();
			}
		},
		async onPullDownRefresh() {
			await this.loadCatList();
			uni.stopPullDownRefresh();
		},
		onReachBottom() {
			this.loadData('add');
		},
		onBackPress() {
			return this.app.backPress([
				{obj: this, key: 'showCatBox'}
			])
		},
		methods: {
			selectType(e) { //排序筛选
				let tabType = e.target.dataset.index;
				if (tabType != 'all') {
					if (this.tabType == tabType) {
						this.tabSort = this.tabSort != 'desc' ? 'desc' : 'asc';
					} else {
						this.tabSort = 'desc';
					}
					this.tabType = tabType;
				} else {
					this.tabSort = '';
					this.tabType = 'all';
				}
				this.loadData('refresh');
			},
			loadCatList() {
				return this.$u.post('nft/api.market/getCatList',{showLoading: false}).then(res => {
					this.categoryList = res.data.list;
					this.categoryBaseList = res.data.baseList;
					this.categoryListB[0] = this.categoryBaseList;
					return this.loadData('refresh');
				})
			},
			selCatA(cat_id) {
				console.log(cat_id);
				this.selCatIdA = cat_id;
				this.selCatIdB = 0;
				if (this.categoryListB[cat_id]) {
					return true;
				}

				this.$u.post('nft/api.market/getCatList', {
					cat_id: cat_id
				}).then(res => {
					this.categoryListB[cat_id] = res.data.list;
					this.$forceUpdate(); //刷新数据
				})
			},
			selCatB(cat_id) {
				console.log(cat_id);
				this.selCatIdB = cat_id;
				this.$forceUpdate(); //刷新数据
				this.showCatBox = false;
				this.loadData('refresh');
			},
			loadData(source) {
				return new Promise((resolve,reject) => {
					let index = this.tabCurrentIndex;
					let navItem = this.navList[index];
					if (source === 'refresh') {
						navItem.p = 0;
						navItem.loadingType = 'more';
						// navItem.list = [];
						navItem.loaded = false;
					}
					
					if (navItem.loadingType == 'nomore' || navItem.loadingType === 'loading') {
						//防止重复加载
						return;
					}
					navItem.p++;
					if (this.selCatIdB > 0) {
						this.param.cat_id = this.selCatIdB;
					} else if (this.selCatIdA > 0) {
						this.param.cat_id = this.selCatIdA;
					} else {
						this.param.cat_id = 0;
					}
					this.param.field = 'price';
					this.param.sort = this.tabSort || 'asc';
					this.param.keyword = this.keyword;
					this.param.p = navItem.p;
					// this.param.page_size = 1;
					navItem.loadingType = 'loading';
					this.$u.api.getMarketList(this.param).then(res => {
						if (source === 'refresh') {
							navItem.list = [];
						}
						navItem.list = navItem.list.concat(res.data.list);
						//loaded新字段用于表示数据加载完毕，如果为空可以显示空白页
						this.$set(navItem, 'loaded', true);
						//判断是否还有下一页，有是more  没有是nomore
						let data = res.data;
						navItem.loadingType = data.page * data.page_size > data.total ? 'nomore' : 'more';
						resolve(res)
						
						setTimeout(() => {
							this.loading = false;
						},300)
					}).catch(err => {
						reject(err)
					})
				})
			},
			//顶部tab点击
			topTabClick(index) {
				this.tabCurrentIndex = index;
				this.loadData('refresh');
			},
			search() {
				this.tabCurrentIndex = 0;
				this.loadData('refresh');
			},
			setCollect(nft_id) {
				let index = this.tabCurrentIndex;
				let navItem = this.navList[index];
				this.$u.post('nft/api.publics/setCollect', {
					'nft_id': nft_id,
				}).then(res => {
					navItem.list.forEach((item, index) => {
						if (item.nft_id == nft_id) {
							item.collection_status = res.data.status;
						}
					})
					this.$forceUpdate(); //刷新数据
				})
			},
			showSearchBox() {
				if (this.searchBox == 'none') {
					this.searchBox = 'show';
				} else {
					this.searchBox = 'none';
				}
			},
			// reset() {
			// 	this.searchBox = 'none';
			// 	this.tabCurrentIndex = 0;
			// 	this.selCatIdA = 0;
			// 	this.selCatIdB = 0;
			// 	this.loadData('refresh');
			// },
			// submit() {
			// 	this.searchBox = 'none';
			// 	this.loadData('refresh');
			// },
			stopPrevent() {}
		}
	}
</script>

<style lang="scss" scoped>
	.top-sec {
		position: sticky;
		z-index: 99;
		background-color: $page-color-base;
		// top: var(--window-top);
		top: 0;
			
		&.wechat {
			top: 0;
		}
	}
	.top-bar {
		position: relative;
		z-index: 9;
		padding: 30rpx 30rpx 0rpx 30rpx;
		align-items: center;
		background-color: $box-color-base;
		
		&.wechat {
			padding-top: 30rpx;
		}

		.menu-btn {
			height: 64rpx;
			display: flex;
			align-items: center;

			.menu {
				width: 37rpx;
			}
		}
	}

	.market-list {
		padding: 0 20rpx 0 20rpx;
	}

	.class_box_img {
		margin: auto;
		width: 180rpx;
		height: 180rpx;

		image {
			width: 100%;
			height: 100%;
			border-radius: 24rpx;
		}
	}

	.navbar {
		padding-bottom: 6rpx;
		height: 82rpx;
		justify-content: center;
		box-shadow: none !important;

		.nav-item {
			flex: unset;
			padding: 0 50rpx;
			color: #939393;
			font-size: 28rpx;
		}

		.current {
			color: #fff !important;

			&:after {
				display: none;
				width: 32rpx;
				background-color: #fff !important;
				border-color: #fff !important;
				bottom: 14rpx;
			}

			.sort_desc {
				&:after {
					border-color: #fff !important;
					border-bottom-color: transparent !important;
					/* 设置透明背景色 */
					border-left-color: transparent !important;
					border-right-color: transparent !important;
				}
			}

			.sort_asc {
				&:before {
					border-color: #fff !important;
					border-top-color: transparent !important;
					/* 设置透明背景色 */
					border-left-color: transparent !important;
					border-right-color: transparent !important;
				}
			}
		}

		.sort_icon {
			position: relative;
			height: 100%;
			margin-left: 10rpx;

			&:before {
				content: "";
				position: absolute;
				bottom: 50%;
				transform: translateY(-2rpx);
				border: 8rpx solid;
				border-color: #999999;
				border-top-color: transparent;
				/* 设置透明背景色 */
				border-left-color: transparent;
				border-right-color: transparent;
			}

			&:after {
				content: "";
				position: absolute;
				top: 50%;
				transform: translateY(2rpx);
				border: 8rpx solid;
				border-color: #999999;
				border-bottom-color: transparent;
				/* 设置透明背景色 */
				border-left-color: transparent;
				border-right-color: transparent;
			}
		}
	}




	.list {
		width: 345rpx;
		border-radius: 20rpx;

		.bottom {
			padding: 30rpx 20rpx;

			.name {
				font-size: 28rpx;
				color: #FFFFFF;
				line-height: 28rpx;
			}

			.price {
				color: #fff;
				font-weight: 500;
				line-height: 30rpx;

				.qi {
					margin-left: 10rpx;
					// color: $base-color;
					color: #fff;
					width: 30rpx;
					height: 30rpx;
					font-size: 20rpx;
					background-color: #494949;
					display: flex;
					justify-content: center;
					align-items: center;
				}
			}
		}
	}


	.tips {
		position: absolute;
		top: 20rpx;
		right: 10rpx;
		color: #FFFFFF;
		border-radius: 20rpx;
		padding: 5rpx 15rpx;
		background-color: rgba(29, 29, 46, 0.3);
		font-size: 24rpx;
		z-index: 9;
	}

	.img {
		height: 345rpx;

		image {
			width: 100%;
			height: 100%;
			border-radius: 20rpx;
		}
	}

	// .catBoxA {
	// 	line-height: 50rpx;
	// 	padding-top: 20rpx;

	// 	.item {
	// 		width: 200rpx;
	// 		padding: 20rpx 20rpx;
	// 		border-top-left-radius: 20rpx;
	// 		border-bottom-left-radius: 20rpx;
	// 	}

	// 	.img {
	// 		width: 50rpx;
	// 		height: 50rpx;
	// 		border-radius: 50%;
	// 		overflow: hidden;
	// 		margin-right: 10rpx;

	// 		image {
	// 			width: 100%;
	// 			height: 100%;
	// 			border-radius: 24rpx;
	// 		}
	// 	}

	// }

	// .catBoxB {
	// 	padding: 0 20rpx;

	// 	.item {

	// 		&:nth-child(1),
	// 		&:nth-child(2) {
	// 			padding-top: 20rpx;
	// 		}
	// 	}
	// }
	
	/deep/ .u-popup {
		.content {
			display: flex;
			// justify-content: space-between;
			align-items: center;
			flex-wrap: wrap;
		}
		.item {
			color: #939393;
			background-color: #2d2d2d;
			height: 70rpx;
			display: flex;
			justify-content: center;
			align-items: center;
		}
		.acolor{
			color: #7D583B !important;
			background-color: $btn-two-purplered !important;
		}
	}
</style>
