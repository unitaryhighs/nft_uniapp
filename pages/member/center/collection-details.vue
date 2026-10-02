<template>
	<view class="page-body flex-column" :class="[app.setCStyle()]">
		<view class="container flex-column u-flex-1">
			<view class="content u-flex-1">
				<view class="top">
					<view class="d l t"></view>
					<view class="d r t"></view>
				</view>
				<view class="bottom">
					<view class="d l b"></view>
					<view class="d r b"></view>
				</view>
				<view class="left"></view>
				<view class="right"></view>
				
				<image src="/static/images/ant-logo.png" mode="aspectFill" class="logo"></image>
				<view class="title fs32 font-w700 text-center">区块链查证信息概览</view>
				<!-- <view class="list mt60">
					<view class="sec">
						<view class="title">藏品信息</view>
					</view>
					<view class="info">
						
					</view>
				</view> -->
				<view class="mt40">
					<u-collapse ref="collapse" class="u-collapse" :item-style="itemStyle" :accordion="false">
						<block v-if="hashInfo.find_type=='user'">
							<u-collapse-item :index="0" :title="'账户信息'" :open="open">
								<view class="collapse-item">
									<view class="inner">
										<image class="bg" src="/static/images/ant-auth.png" mode="aspectFill"></image>
										<view class="item">
											<view class="label">区块链地址</view>
											<view class="text fh">
												{{hashInfo.hash}}
												<u-icon class="icon" name="/static/images/copy.png" size="40" @click="app.copy(hashInfo.hash)"></u-icon>
											</view>
										</view>
										<view class="item">
											<view class="label">注册时间</view>
											<view class="text">{{hashInfo.reg_time}}</view>
										</view>
									</view>
								</view>
							</u-collapse-item>
							<u-collapse-item :index="1" :title="'TA的藏品'+hashInfo.goods.total" :open="open">
							<view class="collapse-item">
								<view class="inner goods" v-for="(item,index) in goodsList" :key="index">
									<view class="goods-list">
										<view class="item">
											<view class="label">藏品名称</view>
											<view class="text">{{item.nft_name}}</view>
										</view>
										<view class="item">
											<view class="label">交易HASH</view>
											<view class="text fh">
												{{item.last_hash}}
												<u-icon class="icon" name="/static/images/copy.png" size="40" @click="app.copy(item.last_hash)"></u-icon>
											</view>
										</view>
										<view class="item">
											<view class="label">交易时间</view>
											<view class="text">{{item.transfer_time}}</view>
										</view>
									</view>
								</view>
								<uni-load-more :status="loadingType"></uni-load-more>
							</view>
						</u-collapse-item>
						</block>
						
						<block v-else-if="hashInfo.find_type=='transfer'">
							<u-collapse-item :index="0" :title="'藏品信息'" :open="open">
								<view class="collapse-item">
									<view class="inner">
										<image class="bg" src="/static/images/ant-auth.png" mode="aspectFill"></image>
										<view class="item">
											<view class="label">藏品名称</view>
											<view class="text">{{hashInfo.nft_name}}</view>
										</view>
										<view class="item">
											<view class="label">合约地址</view>
											<view class="text fh">
												{{hashInfo.contract_address}}
												<u-icon class="icon" name="/static/images/copy.png" size="40" @click="app.copy(123)"></u-icon>
											</view>
										</view>
										<view class="item">
											<view class="label">藏品编码</view>
											<view class="text">#{{hashInfo.token_id}}/{{hashInfo.nft_nums}}</view>
										</view>
										<view class="item">
											<view class="label">发行方</view>
											<view class="text">{{hashInfo.creator_name}}</view>
										</view>
										<view class="item">
											<view class="label">作品介绍</view>
											<view class="text" v-html="hashInfo.description"></view>
										</view>
									</view>
								</view>
							</u-collapse-item>
							<u-collapse-item :index="1" :title="'流转信息'" :open="open">
							<view class="collapse-item">
								<view class="inner">
									<view class="list" v-for="(item,index) in transferList" :key="index">
										<view class="item">
											<view class="label">流转类型</view>
											<view class="text">{{item.type_title}}</view>
										</view>
										<view class="item">
											<view class="label">流转时间</view>
											<view class="text">{{item.add_time}}</view>
										</view>
										<view class="item">
											<view class="label">流转哈希值</view>
											<view class="text fh">
												{{item.hash}}
												<u-icon class="icon" name="/static/images/copy.png" size="40" @click="app.copy(123)"></u-icon>
											</view>
										</view>
									</view>
								</view>
								<uni-load-more :status="loadingType"></uni-load-more>
							</view>
						</u-collapse-item>
						</block>
					</u-collapse>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				itemStyle: {
					fontSize: '30rpx',
					color: '#333',
					fontWeight: '700',
				},
				open: true,
				hash: '',
				hashInfo: {},
				goodsList: [],
				transferList: [],
				p: 0,
				loadingType: 'more',
			}
		},
		onLoad(e) {
			if(e.hash){
				this.hash = e.hash;
				this.getHashInfo();
			}
		},
		onReachBottom() {
			if(this.loadingType == 'more'){
				this.getHashInfo();
			}
		},
		methods: {
			getHashInfo(){
				this.p++;
				this.$u.api.getHashInfo({
					hash: this.hash,
					p: this.p,
					// page_size: 1
				}).then(res => {
					this.hashInfo = res.data;
					let title = '';
					if(this.hashInfo.find_type=='user'){
						title = '区块链账户信息';
						this.goodsList = this.goodsList.concat(res.data.goods.list);
						this.loadingType = res.data.goods.page >= res.data.goods.total/res.data.goods.page_size ? 'nomore' : 'more';
					} else if (this.hashInfo.find_type=='transfer') {
						title = '区块链藏品信息';
						this.transferList = this.transferList.concat(res.data.transfer.list);
						this.loadingType = res.data.transfer.page >= res.data.transfer.total/res.data.transfer.page_size ? 'nomore' : 'more';
					}
					uni.setNavigationBarTitle({
						title
					});
					this.$nextTick(()=>{
						setTimeout(()=>{
							this.$refs.collapse.init();
						},100)
					})
				}).catch(err => {
					console.log(err);
				})
			}
		}
	}
</script>

<style>
	page {
		background-color: #ebeef7;
	}
</style>
<style lang="scss">
	.flex-column {
		display: flex;
		flex-direction: column;
	}
	.page-body {
		min-height: calc(100vh - var(--window-top));
		padding: 30rpx;
		background-color: #ebeef7;
		padding-bottom: calc(30rpx + constant(safe-area-inset-bottom));
		padding-bottom: calc(30rpx + env(safe-area-inset-bottom));
		
		.container {
			height: 100%;
			padding: 25rpx;
			background-color: #f5f8ff;
			box-shadow: 0px 3px 14px rgba(60,65,78,0.2);
			border-radius: 2px;
			
			.left,
			.right {
				position: absolute;
				top: 0;
				width: 1px;
				height: 100%;
				background-color: #95bfe7;
			}
			.left {
				left: 0;
			}
			.right {
				right: 0;
			}
			.top,
			.bottom {
				.d {
					width: 35rpx;
					min-width: 35rpx;
					height: 35rpx;
					position: absolute;
					z-index: 1;
					background-color: #f5f8ff;
					
					&.l {
						left: 0;
						border-right: 1px solid #95bfe7;
						&::before {
							left: 0;
						}
					}
					&.r {
						right: 0;
						border-left: 1px solid #95bfe7;
						&::before {
							right: 0;
						}
					}
					&.t {
						top: 0;
						border-bottom: 1px solid #95bfe7;
						&::before {
							top: 0;
						}
					}
					&.b {
						bottom: 0;
						border-top: 1px solid #95bfe7;
						&::before {
							bottom: 0;
						}
					}
					&::before {
						content: '';
						position: absolute;
						width: 15rpx;
						height: 15rpx;
						border: 2px solid #bbdcfb;
					}
				}
			}
			.bottom {
				&::after {
					content: '';
					position: absolute;
					left: 0;
					bottom: 0;
					width: 100%;
					height: 1px;
					background-color: #95bfe7;
				}
			}
			.top {
				&::before,
				&::after {
					content: '';
					position: absolute;
					top: 0;
					width: 40%;
					height: 1px;
					background-color: #95bfe7;
				}
				&::before {
					left: 0;
				}
				&::after {
					right: 0;
				}
			}
		
			.content {
				position: relative;
				width: 100%;
				height: 100%;
				background-color: #fff;
				padding: 40rpx;
				
				.logo {
					width: 110rpx;
					height: 110rpx;
					position: absolute;
					left: 50%;
					top: -15rpx;
					transform: translateX(-50%);
				}
				.title {
					color: #0181ff;
					padding-top: 80rpx;
				}
			}
		}
	}
	
	/deep/ .u-collapse {
		.u-collapse-item {
			margin-bottom: 20rpx;
		}
		.u-collapse-head {
			border-top: 1px solid #f0f0f0;
			border-bottom: 1px solid #f0f0f0;
		}
		.u-collapse-body {
			// padding: 20rpx 0 40rpx;
			
			// .u-collapse-content {
			// 	background-color: #f3f8fe;
			// }
			.collapse-item {
				padding: 30rpx 0 20rpx;
				
				.inner {
					background-color: #f3f8fe;
					padding: 30rpx;
					position: relative;
					
					&.goods {
						&:not(:nth-child(1)){
							margin-top: 30rpx;
						}
					}
					
					.bg {
						position: absolute;
						right: 20rpx;
						top: 50rpx;
						width: 200rpx;
						height: 200rpx;
						opacity: 0.5;
					}
					
					.item {
						margin-bottom: 40rpx;
						font-weight: 400;
						position: relative;
						z-index: 1;
						
						.label {
							font-size: 26rpx;
							color: #999;
						}
						.text {
							margin-top: 20rpx;
							font-size: 28rpx;
							line-height: 40rpx;
							color: #333;
							word-break: break-all;
						}
						.icon {
							margin-left: 8rpx;
							vertical-align: bottom;
						}
					}
				
					.list {
						padding-left: 30rpx;
						position: relative;
						
						&::before {
							content: '';
							width: 13rpx;
							height: 13rpx;
							border-radius: 50%;
							background-color: #1878fe;
							position: absolute;
							left: 0;
							top: 14rpx;
						}
						&:not(:nth-last-child(1)){
							&::after {
								content: '';
								width: 1px;
								height: 100%;
								background-color: #1878fe;
								position: absolute;
								left: 6rpx;
								top: 40rpx;
							}
						}
					}
				}
			}
		}
	}
</style>
