<template>
	<view class="page-body" :class="[app.setCStyle()]">
		<view class="goods-box" v-if="order_type == '6'">
			<image class="goods-box-img" :src="goodsInfo.nft_img" mode="aspectFill" style="border-radius: 24rpx;"></image>
			<view class="goods-box-content ellipsis-1">
				<view class="top">
					<view class="name ellipsis-1">{{goodsInfo.nft_name}}</view>
					<view class="number">{{goodsInfo.nft_no}}</view>
				</view>
				<view class="bottom">
					<view class="id ellipsis-1">{{goodsInfo.hash_addr}}</view>
					<view class="price">
						<view class="yuan">¥</view>
						<view class="price-num">{{goodsInfo.price}}</view>
					</view>
				</view>
			</view>
		</view>
		<view class="top-box" v-else>
			<view class="price_box ff color-ff">￥<text class="price ">{{paySetting.order_amount}}</text></view>
			<view class="mt10 text-center fs24 color-99">
				{{app.langReplace('需支付金额')}}
			</view>
			<view  v-if="from == 'nft'" @click="app.goPage('info?order_id='+order_id,-1)" class="mt20 text-center fs26 color-66">{{app.langReplace('查看订单')}}</view>
		</view>

		<payBox :payType="payType" :from="from" :order_id="order_id" :paySetting="paySetting"></payBox>
		
		<view class="record mt40" v-if="recordListData.total > 0">
			<view class="record-title">寄售记录</view>
			<view class="record-list">
				<view class="record-list-item" v-for="(item,index) in recordListData.list" :key="index">
					<view class="name ellipsis-1">{{item.hash||'--'}}</view>
					<view class="date">{{item.created_date}}</view>
					<view class="price">
						{{item.action_type==1?'铸造':item.action_type==2?'买入':item.action_type==3?'寄售':item.action_type==4?'取消寄售':''}}
						{{' ¥ ' + item.price}}
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import payBox from '@/pages/public/pay/payBox';
	export default {
		components: {
			payBox
		},
		data() {
			return {
				from:'nft',
				payType: 'order', //支付类型
				order_id: 0,
				headerPosition: "fixed",
				headerTop: "0px",
				paySetting: {},
				order_type: null,
				goodsInfo: {},
				recordListData: {
					list: [],
					total: 0
				},
			}
		},
		onLoad(options) {
			this.order_type = options.order_type || null;
			let that = this;
			if (options.order_id < 1) {
				uni.showModal({
					title: this.app.langReplace('提示'),
					content: this.app.langReplace('ID传值错误'),
					showCancel: false,
					success: function(res) {
						if (res.confirm) {
							that.app.goPage(-1);
						}
					}
				});
				return false;
			}
			this.from = options.from;
			this.order_id = parseInt(options.order_id);
			let title = this.app.langReplace('订单支付');
			uni.setNavigationBarTitle({
			　　title:title
			})
			if(this.order_type == '6'){
				this.getMarketOrder(options);
				this.payType = 'market';
			} else {
				this.getOrder(options);
			}
		},
		methods: {
			getOrder(options) { //获取订单信息
				let order_id = this.order_id;
				let platform = this.app.getPlatform();
				this.$u.post('nft/api.order/getPayOrder', {
					order_id: order_id,
					platform: platform
				}).then(res => {
					this.paySetting = res.data;
				}).catch(res => {
					setTimeout(() => {
						uni.redirectTo({
							url: '/pages/nft/order/info?order_id=' + order_id
						});
					}, 1000);
				})
			},
			getMarketOrder(options) { //获取订单信息
				let order_id = this.order_id;
				let platform = this.app.getPlatform();
				this.$u.api.getPayOrder({
					order_id: order_id,
					platform: platform
				}).then(res => {
					this.paySetting = res.data.pay;
					this.recordListData = res.data.nft_sub_order_list;
					this.goodsInfo = res.data.goods_sub_info;
				}).catch(res => {
					setTimeout(() => {
						uni.redirectTo({
							url: '/pages/nft/order/info?order_id=' + order_id
						});
					}, 1000);
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.page-body {
		padding: 20rpx 30rpx;
	}
	
	.goods-box {
		padding: 30rpx;
		background-color: $box-color-base;
		border-radius: 20rpx;
		display: flex;
		align-items: center;
		
		&-img {
			width: 140rpx;
			height: 140rpx;
		}
		&-content {
			margin-left: 20rpx;
			flex: 1;
			color: #fff;
			
			.top {
				display: flex;
				align-items: center;
				font-size: 24;
				
				.name {
					flex: 1;
					margin-right: 20rpx;
				}
			}
			.bottom {
				margin-top: 40rpx;
				display: flex;
				align-items: center;
				
				.id {
					flex: 1;
					margin-right: 20rpx;
				}
				.price {
					display: flex;
					align-items: flex-end;
					color: #fff;
					font-weight: 500;
					
					.yuan {
						font-size: 28rpx;
						line-height: 28rpx;
					}
					.price-num {
						font-size: 40rpx;
						line-height: 40rpx;
					}
				}
			}
		}
	}
	
	.top-box {
		text-align: center;
		padding: 60rpx;
		width: 100%;
		z-index: 1;
		z-index: 99;
		font-weight: 500;
		.price_box {
			font-size: 40rpx;
			.price {
				margin-left: 5rpx;
				font-size: 66rpx;
			}
		}
	}

	.record {
		padding-bottom: 200rpx;
		&-title {
			font-size: 28rpx;
			color: #FFFFFF;
		}
		&-list {
			margin-top: 32rpx;
			
			&-item {
				&:not(:nth-child(1)){
					margin-top: 18rpx;
				}
				display: flex;
				justify-content: space-between;
				align-items: center;
				font-size: 20rpx;
				color: #FFFFFF;
				
				.name,
				.date,
				.price {
					flex: 1;
				}
				.date {
					text-align: center;
				}
				.price {
					text-align: right;
				}
			}
		}
	}
</style>
