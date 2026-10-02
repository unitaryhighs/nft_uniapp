<template>
	<view class="page-body " :class="[app.setCStyle()]">
		<!-- <scroll-view class="hb100" scroll-y @scrolltolower="loadData"> -->
			<!-- 空白页 -->
			<empty v-if="itemList.list.length === 0" class="mt80"></empty>
			<!-- 列表 -->
			<view v-else>
				<u-swipe-action :index="index" v-for="(item, index) in itemList.list" :key="item.creator_id" :show="item.show"
				@click="unFollow" :options="options" @open="open" @content-click="app.goPage('/pages/nft/collection/creator?creator_id='+item.creator_id)"
				class="mt20 br20 box-bg-base ellipsis-1" bg-color="rgba(0,0,0,0)">
					<view class="flex list ellipsis-1">
						<image class="img" :src="baseImgUrl+item.headimgurl" mode="aspectFill"></image>
						<view class="ml20 flex_bd ellipsis-1">
							<view class="color-ff fs32 ellipsis-1">{{item.nick_name}}</view>
							<view class="color-cc fs26 ellipsis-2" style="word-break: break-all;margin-top: 10rpx;">个人简介：{{item.creator_desc || '---'}}</view>
						</view>
					</view>
				</u-swipe-action>
				<uni-load-more :status="itemList.loadingType"></uni-load-more>
			</view>
		<!-- </scroll-view> -->
	</view>
</template>

<script>
	export default {
		data() {
			let that = this;
			return {
				baseImgUrl: this.config.baseImgUrl,
				getCartNum:0,//1执行请求购物车数量
				keyword: '',
				loadingType: 'more', //加载更多状态
				filterIndex: 0,
				itemList: {
					list: [],
					loadingType: 'more',
					p: 0
				}, 
				param: {
				},
				options: [{
					text: this.app.langReplace('取消'),
					style: {
						backgroundColor: '#F65236'
					}
				}]
				
			}
		},
		onLoad(options) {
			this.app.isLogin(this);//强制登陆
			let title = this.app.langReplace('关注创作者');
			uni.setNavigationBarTitle({
				title
			})
		},
		onShow() {
			this.loadData('refresh');
		},
		onReachBottom() {
			this.loadData();
		},
		async onPullDownRefresh() {
			await this.loadData('refresh');
			uni.stopPullDownRefresh();
		},
		methods: {
			// 如果打开一个的时候，不需要关闭其他，则无需实现本方法
			open(index) {
				// 先将正在被操作的swipeAction标记为打开状态，否则由于props的特性限制，
				// 原本为'false'，再次设置为'false'会无效
				this.$set(this.itemList.list[index],'show',true);
				this.itemList.list.map((val, idx) => {
					if(index != idx)this.$set(this.itemList.list[idx],'show',false);
				})
			},
			unFollow(index) {
				let row = this.itemList.list[index];
				this.$u.post('nft/api.follow_creator/set', {
					creator_id: row.creator_id
				}).then(res => {
					this.itemList.list.splice(index, 1);
				})
			},
			
			//加载
			loadData(source) {
				return new Promise((resolve,reject) => {
					let itemList = this.itemList;
								
					if (source === 'refresh') {
						itemList.p = 0;
						itemList.loadingType = 'more';
						// itemList.list = [];
						itemList.loaded = false;
					}
					
					if (itemList.loadingType === 'loading' || itemList.loadingType == 'nomore') {
						//防止重复加载
						return;
					}
					itemList.p++;
					this.param.p = itemList.p;
					itemList.loadingType = 'loading';
					this.$u.post('nft/api.follow_creator/getList', this.param).then(res => {
						setTimeout(()=>{
							if (source === 'refresh') {
								itemList.list = [];
							}
							let list = res.data.list.map(item => {
								item.show = false;
								return item;
							})
							itemList.list = itemList.list.concat(list);
							//loaded新字段用于表示数据加载完毕，如果为空可以显示空白页
							this.$set(itemList, 'loaded', true);
							//判断是否还有下一页，有是more  没有是nomore
							itemList.loadingType = itemList.p == res.data.page_count ? 'nomore' : 'more';
							resolve(res)
						},100)
					}).catch(err => {
						reject(err)
					})
				})
			},
			stopPrevent() {}
		}
	}
</script>

<style lang="scss" scoped>
	.page-body {
		padding: 0 30rpx;
	}
	.list{
		width: 690rpx;
		border-radius: 20rpx;
		padding: 30rpx;
		
		.img{
			width: 150rpx;
			min-width: 150rpx;
			height: 150rpx;
			border-radius: 50%;
		}
	}
	/deep/ .box-bg-base {
		.u-swipe-content {
			overflow:hidden;
			text-overflow:ellipsis;
			white-space:nowrap;
		}
	}
</style>
