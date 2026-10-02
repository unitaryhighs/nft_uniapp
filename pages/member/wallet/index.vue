<template>
	<view class="page-body " :class="[app.setCStyle()]">
		<view class="menu_box ">
		
			<view class="flex" style="justify-content: space-between;align-items: flex-end;">
				<view class="">
					<view class="fs30" style="color: #6E4524;">总金额</view>
					<view class="fs30 font-w600 mt10" style="color: #DB7623;">￥<text class="fs60">{{account.balance_money}}</text></view>
				</view>
				<view class="fs30 right_btn" style="color: #6E4524;"  @click="app.goPage('recharge')">充值</view>
			</view>
			<view v-if="setting.withdraw_status == 1" class="flex mt30" style="justify-content: space-between;align-items: flex-end;">
				<view class="">
					<view class="fs30" style="color: #6E4524;">提现中</view>
					<view class="fs30 font-w600 mt10" style="color: #6E4524;">￥<text class="fs50">{{withdrawing}}</text></view>
				</view>
				<view class="fs30 right_btn" style="color: #6E4524;"  @click="app.goPage('withdraw')">提现</view>
			</view>
			
			
			
		</view>

		<view class="p20 br20" style="background: #2D2D2D; width: 92%; margin: 0 auto;">
			<view class="list-cell mt20" @click="app.goPage('myLog')">
				<u-icon name="/static/images/l6.png" :size="48" class="mr20"></u-icon>
				<view class="cell-tit fs28">我的帐本</view>
				<view class="cell-more">
					<u-icon name="arrow-right"></u-icon>
				</view>
			</view>
			<view class="list-cell mt20" @click="app.goPage('/pages/member/center/editReceivePay')">
				<u-icon name="/static/images/l7.png" :size="48" class="mr20"></u-icon>
				<view class="cell-tit fs28">我的银行卡</view>
				<view class="cell-more">
					<u-icon name="arrow-right"></u-icon>
				</view>
			</view>
			<view class="list-cell mt20" @click="app.goPage('/pages/member/center/editPayPassWord')">
				<u-icon name="/static/images/l3.png" :size="48" class="mr20"></u-icon>
				<view class="cell-tit fs28">支付密码</view>
				<view class="cell-more">
					<u-icon name="arrow-right"></u-icon>
				</view>
			</view>
			
		</view>

		<view class="p30">
			<button v-if="setting.withdraw_status == 1" size="default" shape="circle" type="primary" class="mt40 primarybtn" @click="app.goPage('withdraw')">{{app.langReplace('去提现')}}</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			let that = this;
			return {
				baseImgUrl: this.config.baseImgUrl,
				setting: {},
				account: {},
				withdrawing: 0,
				wait_returned:0,
				img_wallet_top_bg:''
			}
		},
		onLoad() {
			let title = this.app.langReplace('我的钱包');
			uni.setNavigationBarTitle({
				title
			})
			this.setting = uni.getStorageSync("setting");
			if (this.setting.img_wallet_top_bg){
				this.img_wallet_top_bg = this.config.baseImgUrl + this.setting.img_wallet_top_bg;
			}
		},
		onShow() {
			this.app.isLogin(this); //强制登陆
			this.$u.post('member/api.wallet/getBalanceInfo').then(res => {
				this.account = res.data.account;
				this.withdrawing = res.data.withdrawing;
				this.wait_returned = res.data.wait_returned;
			});
		},
		onReady() {},
		methods: {}
	}
</script>

<style lang="scss" scoped>
	.qb-box{
		height: 445rpx;
		overflow: hidden;
		background-size: 100%;
		background-repeat: no-repeat;
	}
	.menu_box {
		width: 690rpx;
		height: 393rpx;
		background: linear-gradient(138.98deg, rgba(245, 237, 225, 1) 0%, rgba(252, 220, 181, 1) 100%);
		box-shadow: 0rpx 10rpx 15rpx 0rpx rgba(188, 188, 188, 0.1);
		border-radius: 20rpx;
		margin: 30rpx;
		padding: 50rpx 51rpx 50rpx 33rpx;
		// text-align: center;
	}
	
	.menu_box {
		.grid_price {
			color: $font-color-dark;
			font-size: 70rpx;
			font-weight: 500;
			text {
				font-size: 40rpx;
			}
		}
		.grid_text {
			font-size: 28rpx;
			color: $font-color-light;
		}
	}


	.img44 {
		image {
			width: 44rpx;
			height: 44rpx;
		}
	}

	.gridbox {
		margin: 20rpx 15rpx;

		.card-item {
			margin: 0rpx 10rpx;
			background-color: #ffffff;
			box-shadow: 0px 10rpx 15rpx 0px rgba(188, 188, 188, 0.1);
			border-radius: 20rpx;
			text-align: center;
			padding: 60rpx 0;
		}
	}

	
	.grid_menu {
		margin-top: 40rpx;
		line-height: 55rpx;
		.money {
			height: 55rpx;
			margin-top: 30rpx;
			font-weight: 600;
			font-size: 40rpx;
			&::before {
				content: '￥';
				font-size: 24rpx;
			}
		}
		.title{
			color: #999999;
		}
	}
	.right_btn{
		width: 171rpx;
		height: 72rpx;
		background: rgba(232, 198, 155, 1);
		border-radius: 40rpx;
		text-align: center;
		line-height: 72rpx;
	}
</style>
