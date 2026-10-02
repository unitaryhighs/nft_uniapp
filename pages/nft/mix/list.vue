<template>
	<view class="page-body p30"  :class="[app.setCStyle()]">
		<!-- 空白页 -->
		<empty v-if="list.length === 0" class="mt80"></empty>
		<block v-else>
			<view v-for="(item, index) in list" :key="index"  class=" p30 syn_list mt20 box-bg-base">
				<view class="flex fh">
					<view class="img">
						<!-- <image :src="baseImgUrl+item.pic" mode="aspectFill"></image> -->
						<u-image height="100%" border-radius="24" :fade="false" :lazy-load="true" :src="baseImgUrl+item.pic" mode="aspectFill">
							<u-loading size="50" mode="flower" slot="loading"></u-loading>
						</u-image>
					</view>
					<view class="color-99 ml20">
						<view class="fs30 color-ff ellipsis">{{item.nft_name}}</view>
						<view class="fs24 mt40 flex fh"> <text class="spot"></text><text class="ml10">限量：{{item.nums}}</text> 
						<text class="ml10">剩余：{{item.stock}}</text></view>
					</view>
				</view>
				<view class="color-99 flex fh b_box">
					<view class="fs24 mt10">{{item.sell_date_start}} 至 {{item.sell_date_end}}</view>
					<view class="primarybtn btn" @click="app.goPage('info?nft_id='+item.nft_id)">
						去合成
					</view>
				</view>
			</view>
		</block>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				baseImgUrl: this.config.baseImgUrl,
				list:[],
				loaded:false,
			}
		},
		onLoad(options) {
			
		},
		onShow() {
			this.getList();
		},
		onPullDownRefresh() {
			this.getList();
		},
		methods:{
			getList(){
				this.$u.post('nft/api.mix/getList').then(res => {
					this.list = res.data.list;
					this.loaded = true;
				})
			}
		}
	}
</script>

<style lang="scss">
	.syn_list{
		height: 310rpx;
		border-radius: 16rpx;
		.img{
			width: 150rpx;
			height: 150rpx;
			flex-shrink: 0;
			image{
				width: 100%;
				height: 100%;
				border-radius: 10rpx;
			}
		}
		.spot{
			border-radius: 50%;
			// padding: 20rpx;
			display: inline-block;
			width: 10rpx;
			height: 10rpx;
			background: #D6A686;
		}
	}
	.b_box{
		height: 116rpx; 
		justify-content: space-between;
		border-top: 1px solid rgba(255, 255, 255, .1);
		margin-top: 16rpx;
	}
	.btn{
		width: 162.6rpx;
		height: 64rpx;
		border-radius: 32rpx;
		text-align: center;
		line-height: 64rpx;
		color: #000000;
	}
</style>
