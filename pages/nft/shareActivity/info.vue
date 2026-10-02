<template>
	<view class="page-body" :class="[app.setCStyle()]">
		<view class="p20">
			<image :src="info.pic" mode="widthFix" style="width: 100%;"></image>
			<view class="box mt20 box-bg-base">
				<view class="color-ff fs32 mb10">
					活动简介
				</view>
				<view class="color-99 fs28">
					<text>{{info.description}}</text>
				</view>
				<view class="base-color mt10 fs26">
					活动时间：{{info.reg_date_start}}~{{info.reg_date_end}}
				</view>
				<view class="base-color mt10 fs26">
					领取时间：{{info.give_date_start}}~{{info.give_date_end}}
				</view>
			</view>
		</view>
		<view class="mt20" v-if="info.rankingList.length > 0">
			<view class="qb-box" :style="{'background-image':'url('+img_share_ranking_top_bg+')'}"></view>
			<view class="phb-list box-bg-base">
				<view class="flex color-99 fs26">
					<view class="">排名</view>
					<view class="" style="margin-left: 92rpx;">手机号</view>
					<view v-if="info.type == 0" class="fll">注册时间</view>
					<view v-else class="fll">邀请人数</view>
				</view>
				<view class="color-ff fs32">
					<view  v-for="(item,index) in info.rankingList" :key="index" class="flex fh pt30 pb30" style="border-bottom: 1rpx solid rgba(255, 255, 255, .1);">
						<view v-if="item.sort<=3" class="jpimg">
							<image :src="'/static/images/num'+(item.sort)+'.png'"></image>
						</view>
						<view v-else class="jpimg">
							{{item.sort}}
						</view>
						<view class="userimg"><image :src="item.headimgurl?baseImgUrl+item.headimgurl:'/static/images/headimgurl.jpg'"></image></view>
						<view class="ml20">
							<view>{{item.mobile}}</view>
							<view style="width:220rpx;" class="text_hidden">{{item.nick_name}}</view>
						</view>
						<view v-if="info.type == 0" class="flex_bd fs26 text-right">{{item.reg_time}}</view>
						<view v-else class="flex_bd text-right">{{item.share_num}}</view>
					</view>
					
				</view>
			</view>
		</view>
		<view class="fixed_btn fh">
			<view v-if="info.can_give ==1 " class="btn  color-ff" @click="goGive()">
				立即领取
			</view>
			<view v-else-if="info.is_give ==1 " class="btn bg-cc bg-none color-ff" @click="showGift()">
				{{info.tips}}
			</view>
			<view v-else class="btn bg-cc bg-none color-ff">{{info.tips}}</view>
		</view>
		
		<u-modal v-model="showDialog" width="500rpx" z-index="10" :show-confirm-button="false" :show-title="false" :mask-close-able="true">
			<view class="tit_img relative  text-center">
				<image src="/static/images/get_nft_title.png" mode=""></image>
			</view>
			<view class="Dialog box-bg-base">
				<view class="nft_img">
					<image :src="baseImgUrl + giftInfo.gift_pic" mode=""></image>
				</view>
				<view class="color-ff fs28 text-center mt30">{{giftInfo.gift_name}}</view>
				
			</view>
			<view v-if="giftInfo.sub_id > 0" class="put_btn font-w600 fs32 text-center" @click="app.goPage('/pages/nft/collection/info?id='+giftInfo.sub_id)">查看</view>
			<view v-else class="put_btn font-w600 fs32 text-center" @click="app.goPage('/pages/nft/blind_box/my')">查看</view>
		</u-modal>
		<copyright></copyright>
		<view class="h80"></view>
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
				showDialog:false,
				img_share_ranking_top_bg:'',
				info:{
					rankingList:[]
				},
				giftInfo:{},
				is_post:false,
			}
		},
		async onLoad(options) {
			this.id = options.id;
			this.app.isLogin(this);//强制登陆
			let title = this.app.langReplace('邀请活动详情');
			uni.setNavigationBarTitle({
				title
			})
			this.setting = uni.getStorageSync("setting");
			if (this.setting.img_share_ranking_top_bg){
				this.img_share_ranking_top_bg = this.config.baseImgUrl + this.setting.img_share_ranking_top_bg;
			}
		},
		onShow() {
			this.getInfo();
		},
		onBackPress() {
			return this.app.backPress([
				{obj: this, key: 'showDialog'},
			])
		},
		methods:{
			//获取信息
			getInfo() {
				this.$u.post('nft/api.share_activity/getInfo', {
					'id': this.id
				}).then(res => {
					this.info = res.data;
					this.info.pic = this.baseImgUrl + this.info.pic;
				})
			},
			//领取奖品
			goGive() {
				if (this.is_post == true){
					return false;
				}
				this.is_post = true;
				this.$u.post('nft/api.share_activity/goGive', {
					'id': this.id
				}).then(res => {
					this.is_post = false;
					this.giftInfo = res.data;
					this.showDialog = true;
					this.getInfo();
				}).catch(res=>{
					this.is_post = false;
				})
			},
			//查看奖品
			showGift(){
				this.$u.post('nft/api.share_activity/showGift', {
					'id': this.id
				}).then(res => {
					this.giftInfo = res.data;
					this.showDialog = true;
				})
			}
		}
	}
</script>

<style lang="scss">
.box{
		border-radius: 24rpx;
		margin: 0 auto;
		padding: 30rpx;
		width: 690rpx;
	}
	.qb-box{
		height: 325rpx;
		overflow: hidden;
		background-size: 100%;
		background-repeat: no-repeat;
	}
	.phb-list{
		min-height: 500rpx;
		position: relative;
		border-top-left-radius: 40rpx;
		border-top-right-radius: 40rpx;
		z-index: 9;
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
	.fixed_btn{
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		background-color: #313131;
		height: 128rpx;
		z-index: 999;
		
		.btn{
			margin: 0rpx auto;
			margin-top: 20rpx;
			width: 95%;
			height: 90rpx;
			background: $btn-two-purplered;
			border-radius: 45rpx;
			text-align: center;
			line-height: 90rpx;
			font-size: 32rpx;
		}
	}
	.tit_img{
		width: 329rpx;
		height: 86rpx;
		margin: 42rpx auto;
		image{
			width: 100%;
			height: 100%;
			
		}
		text{
			position: absolute;
			left: 0 ;
			right: 0;
			top: 8rpx;
			z-index: 2;
		}
	}
	.Dialog{
		  width: 100%;
		  height: 540rpx;
		  border: 2rpx solid rgba(0, 0, 0, .5);
		  border-radius: 24rpx;
		  margin-top: -90rpx;
		  .nft_img{
			  width: 280rpx;
			  height: 280rpx;
			  margin: 0 auto;
			  overflow: hidden;
			  border-radius: 12rpx;
			  margin-top: 100rpx;
			  image{
				  width: 100%;
				  height: 100%;
				  border-radius: 12rpx;
			  }
		  }
		  
	}
	.put_btn{
		width: 326rpx;
		height: 80rpx;
		margin: 40rpx auto;
		margin-top: -50rpx;
		background: $btn-two-purplered;
		border-radius: 45rpx;
		line-height: 80rpx;
	}
	/deep/ .u-mode-center-box{
		        background-color: transparent;
	}
	/deep/ .u-model{
		background-color: transparent;
	}
</style>
