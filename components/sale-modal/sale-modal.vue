<template>
	<u-modal v-model="show" z-index="101" :show-confirm-button="false" :show-title="false" :mask-close-able="true" :border-radius="22">
		<view class="p30 color-ff box-bg-base">
			<view class="text-center">寄售金额</view>
			<view class="code_box flex mt30 color-ff mb10 fh" style="background: #666666;">
				<text class="mt5 mr10 lh50 fs50">￥</text>
				<u-input :focus="true" maxlength="5" @input="changeSalePrice" @blur="changeSalePrice" placeholder-style="font-size: 24rpx;color: #A9A8AD;"
					@confirm="changeSalePrice" placeholder="寄售价格须大于1，小于20000" v-model="price" type="number" :clearable="false"
					:custom-style="{
						color:'#fff',
						height: '38rpx',
						fontSize: '50rpx',
						fontWeight: 500,
						lineHeight: '50rpx',
					}"></u-input>
				<view class="fs24 cbtn" v-if="revenue">预计收入{{' ¥ '+revenue}}</view>
			</view>
			<view class="flex fh mt40" style="color: #8a8a8a;justify-content: space-between;">
				<view v-if="creator_fee>0" class="fs26 mt10">
					版税：成交价的<text class="font-w700 fs26">{{creator_fee}}%</text>
				</view>
				<view v-if="transfer_fee>0" class="fs26 mt10">
					服务费：成交价的<text class="font-w700 fs26">{{transfer_fee}}%</text>
				</view>
			</view>
			<image src="/static/images/sale-line.png" mode="widthFix" style="width: 539rpx;height: 11rpx;margin: 40rpx 0 0;"></image>
			<u-checkbox class="mt40" shape="circle" size="24" active-color="#DBAE8E" v-model="is_agree" @change="is_agree=!is_agree">
				<view class="fs20">已阅读并同意上述规则及<text class="cbtn" @click.stop="app.goPage('/pages/public/info?type=nft_user_sale_desc')">《用户交易协议》</text></view>
			</u-checkbox>
			<button v-if="revenue&&is_agree" size="default" shape="circle" class="primarybtn mt30" type="warning" @click="openPayPassWord('salePost')">寄售</button>
			<button v-else disabled size="default" shape="circle" class="primarybtn mt30" type="warning" style="background: #818181 !important;">寄售</button>
		</view>
	</u-modal>
</template>

<script>
	export default {
		name:"sale-modal",
		props: {
			saleShow: {
				type: Boolean,
				default: false
			},
			creator_fee: {
				type: [Number, String],
				default: 0
			},
			transfer_fee: {
				type: [Number, String],
				default: 0
			},
			salePrice: {
				type: [Number, String],
				default: 0
			},
			es_revenue: {
				type: [Number, String],
				default: 0
			},
		},
		watch: {
			saleShow(){
				this.show = this.saleShow;
			},
			show(){
				this.$emit('update:saleShow',this.show);
			},
			salePrice(){
				this.price = this.salePrice;
			},
			price(){
				this.$emit('update:salePrice',this.price);
			},
			es_revenue(){
				this.revenue = this.es_revenue;
			},
			revenue(){
				this.$emit('update:es_revenue',this.revenue);
			},
		},
		data() {
			return {
				show: false,
				price: null,
				revenue: null,
				is_agree: true,
			};
		},
		methods: {
			changeSalePrice(e) {
				this.$nextTick(()=>{
					if(this.price)this.price = Number(e).toFixed(0);
					if (this.price <= 1) {
						this.revenue = 0;
						return true;
					}
					
					let nft_market_transfer_fee = this.price / 100 * this.transfer_fee;
					nft_market_transfer_fee = nft_market_transfer_fee.toFixed(2);
					let nft_market_creator_fee = this.price / 100 * this.creator_fee;
					nft_market_creator_fee = nft_market_creator_fee.toFixed(2);
					let revenue = this.price - nft_market_transfer_fee - nft_market_creator_fee;
					this.revenue = revenue.toFixed(2);
				})
			},
			openPayPassWord(e){
				this.$emit('openPayPassWord',e);
			},
		},
	}
</script>

<style>
.code_box {
    padding: 7px 10px;
    border-radius: 12px;
    margin: 0 auto;
}
</style>