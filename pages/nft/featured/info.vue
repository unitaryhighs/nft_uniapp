<template>
	<view class="page-body" :class="[app.setCStyle()]">
		<!-- <view class="banner">
			<image :src="info.img_url" mode="widthFix" id="loadImg"></image>
		</view> -->
		<view class="main mb60">
			<!-- <view class="box p30 mb20">
				<view class="color-ff fs36">{{info.title}}</view>
				<view class="color-99 img-max mt30"> -->
				<view v-html="info.content" ></view>
				<!-- </view>
			</view> -->
			<view v-if="info.bind_nft" class="box mt30">
				<view class="color-ff p20 fs36">相关藏品</view>
				<view class="p20">
					<view class="flex fh mb20"  v-for="(item, index) in info.bind_nft" :key="index" @click="app.goPage('/pages/nft/goods/info?nft_id='+item.nft_id)">
						<view class="img2">
							<image :src="item.square_pic?baseImgUrl+item.square_pic:baseImgUrl+item.pic_thumb" mode="aspectFit"></image>
						</view>
						<view class="color-ff ml20">
							<view class="fs30">{{item.nft_name}}</view>
							<!-- <view class="flex fs24 text-center mt10">
								<view class="amount color-00">限量</view>
								<view class="count">{{item.nums}}份</view>
							</view> -->
							<view class="mt20">
								<limit :number="item.nums"></limit>
							</view>
							<view class="fs40 mt20">￥{{item.price}}</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<copyright></copyright>
	</view>
</template>

<script>
	import copyright from '@/pages/public/copyright';
	export default {
		components: {
			copyright
		},
		data(){
			return{
				baseImgUrl: this.config.baseImgUrl,
				info:{}
			}
		},
		async onLoad(options) {
			this.id = options.id;
			this.getInfo();
		},
		methods:{
			//获取信息
			getInfo() {
				this.$u.post('nft/api.goods/getFeaturedInfo', {
					'id': this.id
				}).then(res => {
					this.info = res.data;
					this.info.img_url = this.baseImgUrl + this.info.img_url;
				})
			},
		}
	}
</script>

<style lang="scss">
.banner{
	position: relative;
	image{
		width: 100%;
		height: 100%;
	}
}
.main{
	.box{
		width: 690rpx;
		background: rgba(255, 255, 255, .15);
		border-radius: 24rpx;
		margin: 0 auto;
	}
}
.img2{
	width: 200rpx;
	height: 200rpx;
	border-radius: 12rpx;
	overflow: hidden;
	image{
		width: 100%;
		height: 100%;
	}
}
.amount{
	width: 76rpx;
	height: 40rpx;
	background: $btn-two-purplered;
	border-radius: 4rpx;
	line-height: 40rpx;
}
.count{
	width: 125rpx;
	height: 40rpx;
	border: 1rpx solid $border-color-base;
	line-height: 40rpx;
	margin-left: -6rpx;
	border-left: none;
}
</style>
