<template>
	<view class="page-body" :class="[app.setCStyle()]">
		<view class="top_navbar" :class="wechat?'wechat':''">
			<view class="navbar base-select">
				<view class="nav-item" v-for="(item, index) in navList" :key="index" :class="{current: topTabCurrentIndex === index}"
				 @click="topTabClick(index)">{{item.text}}</view>
			</view>
		</view>
		<!-- 空白页 -->
		<empty v-if="navList[topTabCurrentIndex].list.length === 0" class="mt80"></empty>
		<block v-else>
			<view class="content" v-for="(tabItem, tabIndex) in navList" :key="tabIndex">
				<block v-if="topTabCurrentIndex == tabIndex">
					<!-- 列表 -->
					<view v-for="(item,index) in tabItem.list" :key="index" class="box-bg-base mt20 p20 br20 mlr20 tap" hover-class="hover" hover-start-time="0" hover-stay-time="100"
					@click="goPage(item)">
						<view class="fs32 color-ff"><text v-if="item.is_see == '0'" class="tip-dian"></text>{{item.title}}</view>
						<view class="mt10 fs28 color-94">{{item.send_time}}</view>
						<view class="mt10 fs28 color-94">{{item.content}}</view>
					</view>
					<uni-load-more :status="tabItem.loadingType"></uni-load-more>
				</block>
			</view>
		</block>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				wechat: false,
				topTabCurrentIndex: 0,
				param: {
					state: '',
					p: 0
				},
				navList: [{
						state: 'my',
						text: this.app.langReplace('我的消息'),
						list: [],
						loadingType: 'more',
						p: 0
					},
					{
						state: 'sys',
						text: this.app.langReplace('系统公告'),
						list: [],
						loadingType: 'more',
						p: 0
					}
				],
			}
		},
		onLoad() {
			this.app.isLogin(this);//强制登陆
			let title = this.app.langReplace('消息');
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
		onPullDownRefresh() {
			this.loadData('refresh');
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
				this.param.state = navItem.state;
				this.param.p = navItem.p;
				navItem.loadingType = 'loading';
				this.$u.post('publics/api.message/getList', this.param).then(res => {
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
			goPage(item){
				if (item.is_see == 0){
					let data = {};
					if (item.type == 'all'){
						data.type = 'all';
						data.rec_id = item.message_id;
					}else{
						data.rec_id = item.rec_id;
					}
					this.$u.post('publics/api.message/setSee', data).then(res => {
						item.is_see = 1;
					});
				}
				if (item.type == 'all'){//系统公告 
					if (item.article_id == 0){
						return true;
					}
					this.app.goPage('/pages/public/article?id='+item.article_id);
					return true;
				}
				if (item.type == 0){
				   if (item.ext_id == 0){
					 return true;
				   }
				   this.app.goPage('/pages/public/article?id='+item.ext_id);
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
	.top_navbar .navbar .nav-item.current {
		color: #FFFFFF !important;
	}
</style>
