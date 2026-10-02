<template>
	<view class="page-body" :class="[app.setCStyle()]">
		<view class="qb-box" :style="{'background-image':'url('+img_share_ranking_top_bg+')'}"></view>
		<view class="phb-list box-bg-base">
			<view class="flex color-99 fs26">
				<view class="">排名</view>
				<view class="" style="margin-left: 92rpx;">手机号</view>
				<view class="fll">邀请人数</view>
			</view>
			<view class="color-ff fs32" v-if="shareRanking.length">
				<view v-for="(item,index) in shareRanking" :key="index" class="flex fh pt30 pb30" style="border-bottom: 1rpx solid rgba(255, 255, 255, .1);">
					<view v-if="index<3" class="jpimg">
						<image :src="'/static/images/num'+(index+1)+'.png'" class="jpimg"></image>
					</view>
					<view v-else class="jpimg">
						{{index+1}}
					</view>
					<view class="userimg ml80"><image :src="item.headimgurl?baseImgUrl+item.headimgurl:'/static/images/headimgurl.jpg'" class="jpimg"></image></view>
					<view class="ml20">
						<view>{{item.mobile}}</view>
						<view style="width:220rpx;" class="text_hidden">{{item.nick_name}}</view>
					</view>
					<view class="flex_bd text-right">{{item.num}}</view>
				</view>
			</view>
			<empty v-else class="mt80"></empty>
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
				setting: {},
				img_share_ranking_top_bg: '/static/images/img_share_ranking_top_bg.png',
				shareRanking:[]
			}
		},
		onLoad() {
			let title = this.app.langReplace('邀请排行榜');
			uni.setNavigationBarTitle({
				title
			})
			this.setting = uni.getStorageSync("setting");
			// if (this.setting.img_share_ranking_top_bg){
			// 	this.img_share_ranking_top_bg = this.config.baseImgUrl + this.setting.img_share_ranking_top_bg;
			// }
		},
		onShow() {
			this.getShareRanking();
		},
		onPullDownRefresh() {
			this.getShareRanking();
		},
		methods:{
			//获取信息
			getShareRanking() {
				this.$u.post('member/api.center/getShareRanking').then(res => {
					this.shareRanking = res.data;
				})
			},
		}
	}
</script>

<style lang="scss">
	.qb-box{
		height: 325rpx;
		overflow: hidden;
		background-size: 100%;
		background-repeat: no-repeat;
	}
	.phb-list{
		min-height: 1000rpx;
		position: relative;
		border-top-left-radius: 40rpx;
		border-top-right-radius: 40rpx;
		z-index: 20;
		padding: 28rpx 51rpx 28rpx 56rpx;
		margin: 0rpx 20rpx;
		margin-top: -30rpx;
	}
	
	.jpimg{
		width: 56rpx;
		height: 61rpx;
		image{
			border-radius: 50%;
			width: 100%;
			height: 100%;
		}
	}
	.userimg{
		width: 80rpx;
		height: 80rpx;
		margin-left: 80rpx;
		overflow: hidden;
		border-radius: 50%;
		image{
			width: 100%;
			height: 100%;
			border-radius: 50%;
		}
	}
</style>
