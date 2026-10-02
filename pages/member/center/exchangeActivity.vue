<template>
	<view class="page-body" :class="[app.setCStyle()]">
		<view class="relative" style="padding: 0rpx 30rpx;">
			<!-- 空白页 -->
			<empty v-if="navList.list.length === 0" :style="{paddingTop: navList.type != 'have'?'104rpx':'0'}" style="box-sizing: content-box;"></empty>
					
			<block v-else>
				<view class=" flex" style="justify-content: space-between;flex-wrap: wrap;padding-top: 0rpx;">
					<view class="color-ff list mt20 box-bg-base relative tap" hover-class="hover" hover-start-time="0" hover-stay-time="100"
						v-for="(item,index) in navList.list" :key="index" @click="open(item)">
						<view v-if="item.num > 0" class="tips">
							x{{item.num}}
						</view>
						<view class="select-num" v-if="selectList[item.nft_id] && selectList[item.nft_id].length">
							已选：x{{selectList[item.nft_id].length}}
						</view>
						<view class="img_b">
							<!-- <image :src="item.square_pic?baseImgUrl+item.square_pic:baseImgUrl+item.pic_thumb"
								mode="aspectFill"></image> -->
							<u-image height="100%" border-radius="24" :fade="false" :lazy-load="true" :src="item.square_pic?baseImgUrl+item.square_pic:baseImgUrl+item.pic_thumb" mode="aspectFill">
								<u-loading size="50" mode="flower" slot="loading"></u-loading>
							</u-image>
						</view>
						<view class="p20">
							<view class="fs28 ellipsis">{{item.nft_name}}</view>
							<view class="flex fh mt10">
								<view class="head_b">
									<image :src="baseImgUrl+item.creator_headimgurl" mode="aspectFill"></image>
								</view>
								<view class="ml20 fs26 color-99 ellipsis">{{item.creator_name}}</view>
			
							</view>
						</view>
					</view>
				</view>
				<uni-load-more :status="navList.loadingType"></uni-load-more>
			</block>
		</view>
		<view class="fixed_btn flex fh">
			<view class="flex cbtn font-w700 u-row-center u-col-bottom">
				<text style="font-size: 40rpx;line-height: 40rpx;">已选 x{{selectNum}}</text>
			</view>
			<view class="right">
				<view v-if="selectNum > 0" class="btn">
					<view class="fs32">立即合成</view>
				</view>
				<view v-else class="btn disable">
					<view class="fs32">立即合成</view>
				</view>
			</view>
		</view>
		
		<u-modal class="nft-list" v-model="showNftBox" width="700rpx" z-index="101" :show-confirm-button="false" :show-title="false" :mask-close-able="true">
			<scroll-view class="box-bg-base" style="height:900rpx;border-radius: 16rpx;overflow: hidden;" scroll-y>
				<view class="flex modal-content">
					<view class="color-ff list mt20 relative tap" hover-class="hover" hover-start-time="0" hover-stay-time="100" v-for="(item,index) in nftList" :key="index"
					@click="select(item)">
						<view class="cover">
							<view class="cover-top">
								<view v-if="item.token_id" class="top-tips">
									#{{item.token_id}}
								</view>
								<view v-if="item.put_sale == 1" class="top-ps-tips">
									寄售中
								</view>
								<view v-if="item.chain_status >= 2" class="top-ps-tips">
									上链中
								</view>
							</view>
							<view class="checkbox" v-if="item.put_sale != 1 && item.chain_status < 2">
								<view class="active" v-if="selectList[item.nft_id] && selectList[item.nft_id].indexOf(item.sub_id) > -1">
									<u-icon name="checkbox-mark" color="#EF7102" size="28"></u-icon>
								</view>
							</view>
							<view class="img_b">
								<!-- <image :src="item.square_pic?baseImgUrl+item.square_pic:baseImgUrl+item.pic_thumb" mode="aspectFill"></image> -->
								<u-image height="100%" border-radius="24" :fade="false" :lazy-load="true" :src="item.square_pic?baseImgUrl+item.square_pic:baseImgUrl+item.pic_thumb" mode="aspectFill">
									<u-loading size="50" mode="flower" slot="loading"></u-loading>
								</u-image>
							</view>
						</view>
						<view class="p20">
							<view class="fs30 ellipsis">{{item.nft_name}}</view>
							<view class="flex fh mt10">
								<view class="head_b">
									<image :src="baseImgUrl+item.creator_headimgurl" mode="aspectFill"></image>
								</view>
								<view class="ml20 fs26 color-99 ellipsis">{{item.creator_name}}</view>
							</view>
						</view>
					</view>
				</view>
			</scroll-view>
			<view class="btn">
				<view class="close" @click="showNftBox=false">
					<u-icon name="close" color="#fff" size="28"></u-icon>
				</view>
			</view>
		</u-modal>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				navList: {
					type: 'have',
					text: this.app.langReplace('藏品'),
					loadingType: 'more',
					list: [],
					p: 0
				},
				param: {
					type: '',
					p: 0
				},
				baseImgUrl: this.config.baseImgUrl,
				nftList: [],
				showNftBox: false,
				selectList: [],
				selectNum: 0,
			};
		},
		onShow() {
			this.loadData('refresh');
		},
		onReachBottom() {
			this.loadData();
		},
		onPullDownRefresh() {
			this.loadData('refresh');
		},
		methods: {
			//获取列表
			loadData(source) {
				return new Promise((resolve,reject) => {
					let navItem = this.navList;
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
						navItem.loadingType = navItem.p >= res.data.page_count ? 'nomore' : 'more';
						
						setTimeout(() => {
							this.loading = false;
						},300)
						resolve(res)
					}).catch(err => {
						reject(err)
					});
				})
			},
			open(item) {
				this.getNftList(item.nft_id);
			},
			//获取NFT列表
			getNftList(nft_id) {
				this.nftList = [];
				this.$u.post('nft/api.collection/getNftList', {
					nft_id: nft_id
				}).then(res => {
					this.nftList = this.nftList.concat(res.data.list);
					this.showNftBox = true;
				})
			},
			select(item){
				if(item.put_sale != 1 && item.chain_status < 2){
					if(!this.selectList[item.nft_id]){
						this.selectList[item.nft_id] = [];
					}
					let index = this.selectList[item.nft_id].indexOf(item.sub_id);
					if(index > -1){
						this.selectList[item.nft_id].splice(index,1);
					} else {
						this.selectList[item.nft_id].push(item.sub_id);
					}
					this.getSelectNum();
					this.$forceUpdate();
				}
			},
			getSelectNum(){
				let num = 0;
				this.selectList.forEach(item => {
					num += item.length;
				})
				this.selectNum = num;
			}
		},
	}
</script>

<style lang="scss" scoped>
	.list {
		width: 330rpx;
		border-radius: 24rpx;
		background-color: #414141;
		
		.img_b {
			width: 330rpx;
			height: 330rpx;
	
			image {
				width: 100%;
				height: 100%;
				border-radius: 24rpx;
			}
		}
	}
	.cover {
		.checkbox {
			position: absolute;
			z-index: 1;
			right: 16rpx;
			top: 16rpx;
			width: 30rpx;
			height: 30rpx;
			// border-radius: 50%;
			border: 2px solid #ccc;
			display: flex;
			justify-content: center;
			align-items: center;
			
			// .active {
			// 	width: 24rpx;
			// 	height: 24rpx;
			// 	border-radius: 50%;
			// 	background-color: #EF7102;
			// }
		}
		.cover-top {
			position: absolute;
			z-index: 1;
			width: 100%;
			left: 0;
			top: 0;
			padding: 16rpx 0;
			display: flex;
			align-items: center;
			
			.top-tips,
			.top-ps-tips {
				margin-left: 12rpx;
				height: 30rpx;
				border-radius: 4rpx;
				color: #FEFEFE;
				display: flex;
				align-items: center;
			}
			.top-tips {
				background-color: rgba(0, 0, 0, .3);
				font-size: 28rpx;
				padding: 0 6rpx;
			}
			.top-ps-tips {
				background-color: #EF7102;
				font-size: 20rpx;
				padding: 2rpx 8rpx;
			}
		}
	}
	.tips {
		position: absolute;
		top: 20rpx;
		left: 12rpx;
		color: #FFFFFF;
		border-radius: 20rpx;
		background-color: rgba(29, 29, 46, 0.3);
		z-index: 9;
		display: inline-block;
		padding: 2rpx 8rpx;
		line-height: 30rpx;
		border-radius: 4rpx;
	}
	.select-num {
		position: absolute;
		top: 20rpx;
		right: 12rpx;
		color: #FFFFFF;
		border-radius: 20rpx;
		background-color: rgba(29, 29, 46, 0.3);
		z-index: 9;
		display: inline-block;
		padding: 2rpx 8rpx;
		line-height: 30rpx;
		border-radius: 4rpx;
	}
	.head_b {
		margin-left: 0rpx;
	
		image {
			width: 40rpx;
			height: 40rpx;
			border-radius: 50%;
		}
	}
	.nft-list {
		.box-bg-base {
			.modal-content {
				justify-content: space-between;
				flex-wrap: wrap;
				padding: 20rpx 20rpx 40rpx;
			}
		}
		
		/deep/ .u-mode-center-box{
			background-color: transparent !important;
		}
		.list {
			width: 315rpx;
			border-radius: 24rpx;
			
			.img_b {
				width: 315rpx;
				height: 315rpx;
			}
		}
		.btn {
			height: 100rpx;
			position: relative;
			
			.close {
				background-color: $box-color-base;
				border-radius: 50%;
				width: 80rpx;
				height: 80rpx;
				position: absolute;
				left: 50%;
				bottom: 6rpx;
				transform: translateX(-50%);
				display: flex;
				justify-content: center;
				align-items: center;
			}
		}
	}
	.fixed_btn {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		background-color: #313131;
		height: 130rpx;
		z-index: 999;
	
		.left {
			padding: 0 30rpx;
	
			.lbtn {
				flex: 1;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
			}
		}
	
		.right {
			padding-right: 30rpx;
			text-align: center;
	
			.btn {
				width: 460rpx;
				height: 90rpx;
				border-radius: 45rpx;
				background-color: $btn-two-purplered;
				color: #7D583B;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
	
				&.disable {
					background-color: #666666;
					color: #A9A8AD;
				}
	
				.fs32 {
					font-size: 32rpx;
					line-height: 32rpx;
					height: 32rpx;
				}
	
				.fs24 {
					font-size: 24rpx;
					line-height: 32rpx;
					height: 32rpx;
				}
	
				.time {
					margin-top: 4rpx;
				}
			}
		}
	}
</style>
