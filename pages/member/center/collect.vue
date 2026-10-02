<template>
	<view class="page-body" :class="[app.setCStyle()]">
		<!-- <scroll-view class="hb100" scroll-y @scrolltolower="loadData"> -->
		
			<!-- 空白页 -->
			<empty v-if="itemList.list.length === 0" class="mt80"></empty>
			<!-- 列表 -->
			<block v-else>
				<u-swipe-action :index="index" :show="item.show" v-for="(item, index) in itemList.list" :key="item.nft_id" 
				@click="unCollect" :options="options" @open="open" @content-click="app.goPage('/pages/nft/goods/info?nft_id='+item.nft_id)"
				class="mt20 br20 box-bg-base ellipsis-1" bg-color="rgba(0,0,0,0)">
					<view class="flex list ellipsis-1">
						<image class="img" :src="item.square_pic?baseImgUrl+item.square_pic:baseImgUrl+item.pic_thumb" mode="aspectFill"></image>
						<view class="ml20 flex_bd flex_center content title-wrap ellipsis-1">
							<view class="color-ff fs32 ellipsis-1">{{item.nft_name}}</view>
							<view class="flex fh user">
								<view class="head">
									<image :src="baseImgUrl+item.creator_headimgurl" mode=""></image>
								</view>
								<view class="fs26 color-99 ml10 ellipsis-1">{{item.creator_name}}</view>
							</view>
						</view>
					</view>
					<!-- <view class="item u-border-bottom">
						<image mode="aspectFill" :src="item.square_pic?baseImgUrl+item.square_pic:baseImgUrl+item.pic_thumb" />
						<view class="title-wrap">
							<text class="title u-line-2">{{ item.nft_name }}</text>
						</view>
					</view> -->
				</u-swipe-action>
				<uni-load-more :status="itemList.loadingType"></uni-load-more>
			</block>
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
					loaded: true,
					list: [],
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
			let title = this.app.langReplace('关注作品');
			uni.setNavigationBarTitle({
				title
			})
		},
		onReady() {
			setTimeout(()=>{
				this.loadData('refresh');
			})
		},
		onReachBottom() {
			this.loadData('add');
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
			unCollect(index) {
				let row = this.itemList.list[index];
				this.$u.post('nft/api.publics/setCollect', {
					nft_id: row.nft_id
				}).then(res => {
					this.itemList.list.splice(index, 1);
				})
			},
			
			//加载商品 
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
					this.$u.post('nft/api.publics/getCollectlist', this.param).then(res => {
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
		
		.head{
			width: 40rpx;
			height: 40rpx;
			border-radius: 50%;
			overflow: hidden;
			margin-left: 0rpx;
			flex-shrink: 0;
			image{
				width: 100%;
				height: 100%;
				border-radius: 50%;
			}
		}
		.img{
			width: 150rpx;
			height: 150rpx;
			border-radius: 24rpx;
		}
	}
	
	.flex_center{
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}
	.content {
		padding: 10rpx 0;
		
		.user {
			flex: none;
		}
	}
</style>
