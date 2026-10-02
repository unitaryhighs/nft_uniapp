<template>
	<view class="page-body" :class="[app.setCStyle()]">
		<ji-nav-bar v-if="!wechat" class="ji-nav-bar" ref="navBar" type="transparentFixed" bgColor="#1E1E1F" :withPadding="false" fontColor="#ffffff">
			<view class="preview" slot="default" style="color: #fff">寄售详情</view>
		</ji-nav-bar>
		<view class="top-bg">
			<image class="top-bg-img" :src="data.nft_img" mode="aspectFill"></image>
		</view>
		
		<!-- <view class="good-info mt30 flex fh">
			<view class="item">
				<view class="dot"></view>
				<view class="content">
					<text class="label">发行数量</text>
					<text class="number">{{data.sales_total}}</text>
				</view>
			</view>
			<view class="item">
				<view class="dot"></view>
				<view class="content">
					<text class="label">流通数量</text>
					<text class="number">{{data.sales_order_total}}</text>
				</view>
			</view>
		</view> -->
		<view class="cover">
			<image class="bg" src="/static/images/goods-bg.png" mode="widthFix"></image>
			<view class="nft-name ellipsis-1">{{data.nft_name}}</view>
			<view class="content flex fh pb30">
				<limit class="ml30" name="发行" :number="data.sales_total"></limit>
				<limit class="ml30" name="流通" :number="data.sales_order_total"></limit>
			</view>
		</view>
		
		<view class="line"></view>
		
		<view class="list">
			<view class="list-screen" :style="{top: topHeight+'rpx'}">
				<view class="list-screen-title">寄售中</view>
				<view class="list-screen-bar">
					<!-- <view class="list-screen-bar-item">
						<view class="name">编号</view>
						<u-icon name="arrow-up-fill" color="#8A8A8A" size="20"></u-icon>
					</view> -->
					<view class="list-screen-bar-item" @click="switchSort">
						<view class="name">价格</view>
						<u-icon :name="tabSort?'arrow-down-fill':'arrow-up-fill'" color="#8A8A8A" size="20"></u-icon>
					</view>
				</view>
			</view>
			<view class="list-items">
				<empty v-if="navItem.list.length === 0"></empty>
				<block v-else>
					<view class="list-items-item br20 tap flex fh" hover-class="hover" hover-start-time="0" hover-stay-time="100"
					v-for="(item,index) in navItem.list" :key="index" @click="addOrder(item.nft_sub_id,item.is_locked)">
						<view class="left">
							<view class="top">
								<view class="number fs28 font-w700">{{item.nft_no}}</view>
								<view class="locked" v-if="item.is_locked">锁定中</view>
							</view>
							<view class="id fs20 ellipsis-1">链上标识：{{item.hash_addr || '---'}}</view>
						</view>
						<view class="right">
							<view class="price">
								<text class="yuan">¥</text>
								<text class="number">{{item.price}}</text>
								<u-icon name="arrow-right" color="#fff" size="28"></u-icon>
							</view>
							<!-- <view class="tips">当前价</view> -->
						</view>
					</view>
					<uni-load-more :status="navItem.loadingType"></uni-load-more>
				</block>
			</view>
		</view>
		<real-name ref="realName"></real-name>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				nft_id: '',
				wechat: false,
				topHeight: 0,
				navItem: {
					loadingType: 'more',
					list: [],
					p: 0
				},
				data: {},
				tabSort: false,//true降序
				realName: null,
			}
		},
		onLoad(e) {
			if(e.nft_id){
				this.nft_id = e.nft_id;
			}
			// 判断微信浏览器
			// #ifdef H5
			let ua = window.navigator.userAgent.toLowerCase()
			if (ua.match(/MicroMessenger/i) == 'micromessenger') {
				// do something
				this.wechat = true;
			}
			
			this.topHeight = this.wechat ? 0 : 88;
			
			this.app.addELPopState();
			// #endif
			// #ifndef H5
			let info = this.$u.sys();
			let height = info.statusBarHeight * 750 / info.windowWidth;
			this.topHeight = height + 88;
			// #endif
		},
		// #ifdef H5
		onUnload() {
			this.app.rmvELPopState();
		},
		// #endif
		async onShow() {
			if(this.nft_id){
				this.loadData('refresh');
			}
			
			if(await this.app.checkRealName(this)){
				this.realName = true;
			} else {
				this.realName = false;
			};
		},
		onPageScroll(e) {
			this.$refs.navBar.pageScroll(e);
		},
		onReachBottom() {
			this.loadData('add');
		},
		async onPullDownRefresh() {
			await this.loadData('refresh');
			uni.stopPullDownRefresh();
		},
		methods: {
			switchSort(){
				this.tabSort = !this.tabSort;
				this.loadData('refresh');
			},
			loadData(source) {
				return new Promise((resolve,reject) => {
					let navItem = this.navItem;
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
					let param = {};
					param.nft_id = this.nft_id;
					param.field = 'price';
					param.sort = this.tabSort? 'desc' : 'asc';
					param.p = navItem.p;
					// param.page_size = 1;
					navItem.loadingType = 'loading';
					this.$u.api.getMarketInfo(param).then(res => {
						if (source === 'refresh') {
							navItem.list = [];
						}
						this.data = res.data;
						navItem.list = navItem.list.concat(res.data.list);
						//loaded新字段用于表示数据加载完毕，如果为空可以显示空白页
						this.$set(navItem, 'loaded', true);
						//判断是否还有下一页，有是more  没有是nomore
						let data = res.data;
						navItem.loadingType = data.page * data.page_size > data.total ? 'nomore' : 'more';
						resolve(res)
					}).catch(err => {
						reject(err)
					})
				})
			},
			addOrder(id,locked){
				if(!this.app.checkToLogin(1)){
					return
				}
				if(!this.realName){
					this.$refs.realName.rnPop = true;
					return
				}
				if(locked){
					uni.showToast({
						title: '当前藏品已被下单锁定',
						icon: 'none'
					})
					return;
				}
				let that = this;
				uni.showModal({
					title: that.app.langReplace('提示'),
					confirmText: that.app.langReplace('确认购买'),
					cancelText: that.app.langReplace('取消'),
					content: that.app.langReplace('确定购买当藏品？'),
					showCancel: true,
					success: function(res) {
						if (res.confirm) {
							if (that.addOrderPost == true){
								return false;
							}
							that.addOrderPost = true;
							that.$u.api.marketBuy({
								id
							}).then(res => {
								that.addOrderPost = false;
								let data = JSON.parse(JSON.stringify(that.data));
								data.order_id = res.data.order_id;
								uni.navigateTo({
									url: `/pages/nft/order/pay?from=nft&order_id=${res.data.order_id}&order_type=6`
								});
							}).catch(err => {
								that.addOrderPost = false;
								// that.app.showModal(err.msg);
								that.loadData('refresh');//购买失败重新请藏品信息
							})
						}
					}
				});
			},
		}
	}
</script>

<style lang="scss" scoped>
	.cover {
		position: relative;
		
		.content {
			position: relative;
			z-index: 1;
		}
		.bg {
			position: absolute;
			width: 100%;
			left: 0;
			bottom: 0;
			z-index: 0;
			opacity: .03;
		}
	}
	.page-body {
		color: #fff;
		
		.top-bg {
			position: relative;
			z-index: 1;
			
			&-img {
				width: 750rpx;
				height: 750rpx;
			}
		}
			
		.good-info {
			padding: 0 30rpx;
			.item {
				display: flex;
				align-items: center;
				font-size: 24rpx;
				&:not(:nth-child(1)){
					margin-left: 30rpx;
				}
				
				.dot {
					width: 16rpx;
					height: 16rpx;
					transform: rotateZ(45deg)skew(15deg,15deg);
					background-color: $base-color;
				}
				.content {
					.label {
						margin: 0 10rpx;
						color: #8a8a8a;
					}
				}
			}
		}
		.nft-name {
			padding: 40rpx 30rpx 30rpx;
			font-size: 36rpx;
			line-height: 36rpx;
			font-family: PingFang SC;
			font-weight: bold;
		}
		.line {
			height: 20rpx;
			background-color: #171717;
		}
		
		.list {
			padding: 0 0 30rpx;
			
			&-screen {
				padding: 30rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				
				position: sticky;
				z-index: 99;
				background-color: $page-color-base;
				top: calc(var(--status-bar-height) + 88rpx - 3px) !important;
					
				// &.wechat {
				// 	top: -3px;
				// }
				
				&-title {
					flex: 1;
					font-size: 32rpx;
					color: #FFFFFF;
					line-height: 32rpx;
				}
				&-bar {
					display: flex;
					align-items: center;
					
					&-item {
						display: flex;
						align-items: center;
						padding: 0 30rpx;
						
						.name {
							color: #939393;
							margin-right: 10rpx;
						}
					}
				}
			}
			&-items {
				padding: 0 30rpx;
				
				&-item {
					position: relative;
					background-color: $box-color-base;
					padding: 30rpx;
					&:not(:nth-child(1)){
						margin-top: 20rpx;
					}
					
					.right {
						display: flex;
						justify-content: space-between;
						align-items: center;
					}
					.left {
						flex: 1;
						
						.top {
							display: flex;
							justify-content: flex-start;
							align-items: center;
							
							.locked {
								height: 30rpx;
								background: #EF7102;
								border-radius: 4rpx;
								font-size: 20rpx;
								line-height: 20rpx;
								padding: 2rpx 8rpx;
								color: #fff;
								display: flex;
								align-items: center;
								margin-left: 20rpx;
								// position: absolute;
								// left: 50%;
								// transform: translateX(-50%);
							}
						}
						.id {
							margin-top: 14rpx;
							flex: 1;
							max-width: 400rpx;
						}
						.number {
							font-size: 28rpx;
							line-height: 28rpx;
						}
					}
					.right {
						color: #8A8A8A;
						
						.tips {
							margin-right: 40rpx;
							font-size: 20rpx;
						}
						
						.price {
							display: flex;
							align-items: flex-end;
							font-size: 20rpx;
							line-height: 28rpx;
							color: #8A8A8A;
							
							.yuan {
								margin-left: 10rpx;
								font-size: 24rpx;
								line-height: 28rpx;
								color: #fff;
								font-weight: 700;
							}
							.number {
								margin: 0 20rpx 0 10rpx;
								font-size: 36rpx;
								line-height: 36rpx;
								color: #fff;
								font-weight: bold;
							}
						}
					}
				}
			}
		}
	}
</style>
