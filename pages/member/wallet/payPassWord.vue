<template>
	<!-- 规格-模态层弹窗 -->
	<view class="pay_body" :class="payPassWordShow?'show':'hide'"  @touchmove.stop.prevent="stopPrevent" >
		<!-- 遮罩层 -->
		<view class="mask-box"></view>
		<view class="pay_main" @click.stop="stopPrevent">
			<view class="pay_box p20">
				<u-icon name="close" size="28" class="close"  @click="close"></u-icon>
				<view class=" text-center">请输入支付密码</view>
				<view class="text-center mt30 fs32">{{payTip}}</view>
				<view v-if="payMoney > 0" class="text-center fs60 mt10"><text class="fs28">￥</text>{{payMoney}}</view>
				<view v-if="payPassWordShow" class="mt20"><u-message-input :maxlength="6"  @finish="finish" :focus="true" :dot-fill="true"></u-message-input></view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "payPassWord",
		props: {
			payTip:{
				type: String,
				default:''
			},
			payMoney:{
				type: String,
				default:'0'
			},
			payPassWordShow: {
				type: Boolean,
				default: false,
			},
		},
		data() {
			return {
			}
		},
		computed:{
			
		},
		methods: {
			close(){
				this.$emit("closePayPassWord");
			},
			finish(e) {
				this.$emit("finishPayPassWord",e);
			},
			stopPrevent() {}
		},
	}
</script>

<style>
	.pay_body{
		position: fixed;
		top: 0;
		left: 0;
		z-index: 102;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 100%;
	}
	.pay_main{
		width: 100%;
		z-index: 9999;
	}
	
	.pay_main .pay_box{
		border: 1rpx #cccccc solid;
		width: 650rpx;
		min-height: 180rpx;
		background-color: #FFFFFF;
		border-radius: 20rpx;
		margin: 0rpx auto;
		position: relative;
	}
	.pay_main .pay_box .close{
		position: absolute;
		top: 20rpx;
		right: 20rpx;
	}
</style>
