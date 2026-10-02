<template>
	<view class="page-body" :class="[app.setCStyle()]">
		<view class="top_navbar" :class="wechat?'wechat':''">
			<view class="navbar base-select">
				<view class="nav-item" v-for="(item, index) in navList" :key="index" :class="{current: topTabCurrentIndex === index}" @click="topTabClick(index)">
					<view class="u-relative">
						{{item.name}}
						<!-- <view v-if="item.is_see > 0" class="tip-msg-dian"></view> -->
					</view>
					
				</view>
			</view>
		</view>
		<!-- 空白页 -->
		<empty v-if="navList.length && navList[topTabCurrentIndex].list.length === 0" class="mt80"></empty>
		<block v-else>
			<view class="content" v-for="(tabItem, tabIndex) in navList" :key="tabIndex">
				<block v-if="topTabCurrentIndex == tabIndex">
					<!-- <view v-if="topTabCurrentIndex==0">
						<view  v-for="(noticeItem, noticeIndex) in tabItem.list" :key="noticeIndex" class="box-bg-base mt20 p20 br20 mlr20" >
							<view class="flex fh">
								<view class="color-ff">{{noticeItem.name}}</view>
								<view class="color-99 fll"  @click="topTabClick(noticeItem.index)">更多<u-icon name="arrow-right" color="#999999" size="30" class="mr20"></u-icon></view>
							</view>
							<view v-for="(item, index) in noticeItem.list" :key="index" class="mt40" @click="goPage(item)" >
								<view class="flex">
									<view><u-icon name="volume-up" color="#F0D2B2" size="40" class="mr20"></u-icon></view>
									<view class="flex_bd fs32 color-ff">{{item.title}}</view>
								</view>
								<view class="mt10 fs28 color-94" style="margin-left: 60rpx;">{{item.add_time}}</view>
							</view>
						</view>
						<uni-load-more :status="'nomore'"></uni-load-more>
					</view>
					<view v-else> -->
						<!-- 列表 -->
						<view v-for="(item,index) in tabItem.list" :key="index" class="box-bg-base mt30 p20 br20 mlr30 ellipsis-1 tap" hover-class="hover" hover-start-time="0" hover-stay-time="100"
						@click="goPage(item)" >
							<view class="flex ellipsis-1" style="max-width: 100%;">
								<!-- <view><u-icon name="volume-up" color="#F0D2B2" size="40" class="mr20"></u-icon></view> -->
								<view class="flex_bd fs32 color-ff mr10 ellipsis-1"><text v-if="item.is_see > 0" class="tip-dian"></text>{{item.cat_name?item.cat_name + ' | ' + item.title : item.title}}</view>
								<u-icon name="arrow-right" color="#fff" size="32"></u-icon>
							</view>
							<view v-if="item.desc" class="mt10 fs28 color-94 ellipsis-1">{{item.desc}}</view>
							<view class="mt10 fs28 color-94">{{item.add_time}}</view>
						</view>
						
						<uni-load-more :status="tabItem.loadingType"></uni-load-more>
				<!-- </view> -->
				</block>
			</view>
		</block>
	</view>
</template>

<script>
	export default {
		data() {
			let that = this;
			return {
				topTabCurrentIndex: 0,
				param: {
					cid: 0,
					p: 0
				},
				navList: [],
				wechat: false,
			}
		},
		onLoad() {
			let title = this.app.langReplace('公告');
			uni.setNavigationBarTitle({
				title
			})
		
			// 判断微信浏览器
			// #ifdef H5
			let ua = window.navigator.userAgent.toLowerCase()
			if (ua.match(/MicroMessenger/i) == 'micromessenger') {
				// do something
				this.wechat = true;
			}
			// #endif
		},
		async onShow() {
			// if(this.app.refreshData(this.$mp.page.route, Date.now())){
				if(!this.navList.length){
					await this.getIndex('refresh');
				}
				this.loadData('refresh');
			// }
		},
		onReachBottom() {
			this.loadData('add');
		},
		async onPullDownRefresh() {
			// if(this.topTabCurrentIndex != 0){
				await this.getIndex('refresh')
				this.loadData('refresh');
			// } else {
			// 	this.getIndex();
			// }
		},
		onBackPress(e) {
			let pages = getCurrentPages(); // 当前页面
			let beforePage = pages[pages.length - 2]; // 前一个页面
			if(e.from == 'navigateBack'){
				return false;
			}
			uni.navigateBack({
				delta: 1,
				success: () => {
					beforePage.$vm.getIndexInfo(); // 执行前一个页面的刷新
				}
			});
			return true;
		},
		methods: {
			//顶部tab点击
			topTabClick(index) {
				this.topTabCurrentIndex = index;
				this.loadData('tabChange');
			},
			topChangeTab(e) {
				this.topTabCurrentIndex = e.target.current;
				this.loadData('tabChange');
			},
			getIndex(source) {
				return new Promise((resolve,reject) => {
					this.$u.post('publics/api.notice/getIndex').then(res => {
						if(source === 'refresh'){
							this.navList = [];
						}
						res.data.catList.forEach((item,index)=>{
							// if (index > 0){
								item.list = [];
								item.loadingType = 'more';
								item.p = 0;
							// }
							this.navList.push(item);
						})
						resolve(res)
					}).catch(err => {
						reject(err)
					})
				})
				
			},
			goPage(item){
				this.app.goPage('/pages/public/article?id='+item.id);
			},
			loadData(source) {
				//这里是将订单挂载到tab列表下
				let index = this.topTabCurrentIndex;
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
				this.param.cid = navItem.cid;
				this.param.p = navItem.p;
				navItem.loadingType = 'loading';
				this.$u.post('publics/api.notice/getList', this.param).then(res => {
					if (source === 'refresh') {
						navItem.list = [];
					}
					navItem.list = navItem.list.concat(res.data.list);
					//loaded新字段用于表示数据加载完毕，如果为空可以显示空白页
					this.$set(navItem, 'loaded', true);
					//判断是否还有下一页，有是more  没有是nomore
					navItem.loadingType = navItem.p == res.data.page_count ? 'nomore' : 'more';
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
	.top_navbar .navbar .nav-item.current {
		color: #FFFFFF !important;
	}
	.mlr30 {
		margin-left: 30rpx;
		margin-right: 30rpx;
	}
	.tip-msg-dian {
		position: absolute;
		right: -14rpx;
		top: -5rpx;
		width: 15rpx;
		height: 15rpx;
		background-color: #F2692F;
		border-radius: 50%;
	}
</style>
