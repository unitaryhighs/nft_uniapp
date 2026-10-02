<template>
	<view class="page-body" :class="[app.setCStyle()]">
		<view class="banner">
			<view class="fs28 color-ff flex fh">
				<image v-if="orderInfo.order_status==0" class="icon" src="/static/images/os_pay.png" mode=""></image>
				<image v-if="orderInfo.order_status==1" class="icon" src="/static/images/os_cancel.png" mode=""></image>
				<image v-if="orderInfo.order_status==9" class="icon" src="/static/images/os_finish.png" mode=""></image>
				<view class="ml20">{{orderInfo.ostatus}}</view>
			</view>
		</view>
		<view class="main_box p30 box-bg-base">
			<view  v-if="orderInfo.blind_box_id > 0"  class="flex" @click="app.goPage('/pages/nft/blind_box/info?id='+orderInfo.blind_box_id)">
				<image class="img" :src="orderInfo.blind_box_pic" mode="aspectFill"></image>
				<view class="ml20">
					<view class="color-ff ellipsis">{{orderInfo.blind_box_name}}</view>
					
				</view>
			</view>
			<view  v-else  class="flex" @click="app.goPage('/pages/nft/goods/info?nft_id='+orderInfo.nft_id)">
				<image class="img" v-if="orderInfo.nft_id" :src="orderInfo.nft_square_pic?baseImgUrl+orderInfo.nft_square_pic:baseImgUrl+orderInfo.nft_pic_thumb" mode="aspectFit"></image>
				<view class="ml20">
					<view class="color-ff ellipsis">{{orderInfo.nft_name}}</view>
					<view class="color-99 flex mt50 fh">
						<image class="head" :src="orderInfo.creator_headimgurl" mode="aspectFill"></image>
						<view class="ml10 ellipsis">{{orderInfo.creator_name}}</view>
					</view>
				</view>
			</view>
			<view class="mt80">
				<view class="flex mt20" style="justify-content: space-between;">
					<view class="color-99">商品金额</view>
					<view class="color-ff">￥{{orderInfo.goods_amount}}</view>
				</view>
				<view class="flex mt20" style="justify-content: space-between;">
					<view class="color-99">购买数量</view>
					<view class="color-ff fs28"><text class="fs24 mr10">x</text>{{orderInfo.buy_number}}</view>
				</view>
				<block v-if="orderInfo.order_amount > 0">
					<view  class="flex mt20" style="justify-content: space-between;">
						<view class="color-99">合计</view>
						<view class="color-ff">￥{{orderInfo.order_amount}}</view>
					</view>
					<view v-if="orderInfo.order_status == 9" class="flex mt20" style="justify-content: space-between;">
						<view class="color-99">支付方式</view>
						<view class="color-ff">{{orderInfo.pay_name}}</view>
					</view>
				</block>
				<view v-if="orderInfo.is_pay_eval==1" class="mt20 text-center color-ff">
					支付成功，正在处理...
				</view>
				<block v-if="orderInfo.blind_box_id == 0">
					<view class="mt20 linefeed flex">
						<view class="color-99" style="min-width: 150rpx;">合约地址</view>
						<view class="color-ff ellipsis-1">{{orderInfo.nft_contract_address}}</view>
						<u-icon name="/static/images/copy.png" size="40" @click="app.copy(orderInfo.nft_contract_address)"></u-icon>
					</view>
					<view v-if="orderInfo.sub_id > 0"  @click="app.goPage('/pages/nft/collection/info?id='+orderInfo.sub_id)" class="flex mt20" style="justify-content: space-between;">
						<view class="color-99">藏品编号</view>
						<view class="color-ff">#{{orderInfo.nft_token_id}}/{{orderInfo.nft_nums}}</view>
					</view>
				</block>
			</view>
		</view>
		<view class="desc p30 mt20 box-bg-base">
			<view class="flex" style="justify-content: space-between;">
				<view class="color-99">订单编号</view>
				<view class="color-ff">{{orderInfo.order_sn}}</view>
			</view>
			<view class="flex mt20" style="justify-content: space-between;">
				<view class="color-99">订单类型</view>
				<view class="color-ff">{{orderInfo.orderType}}</view>
			</view>
			<view class="flex mt20" style="justify-content: space-between;">
				<view class="color-99">创建时间</view>
				<view class="color-ff">{{orderInfo.add_date}}</view>
			</view>
			<view v-if="orderInfo.cancel_time > 0" class="flex mt20" style="justify-content: space-between;">
				<view class="color-99">取消时间</view>
				<view class="color-ff">{{orderInfo.cancel_date}}</view>
			</view>
			<view v-if="orderInfo.pay_time > 0" class="flex mt20" style="justify-content: space-between;">
				<view class="color-99">支付时间</view>
				<view class="color-ff">{{orderInfo.pay_date}}</view>
			</view>
		</view>
		
		<view class="p30">
		<button v-if="orderInfo.order_type == 6" class="mt20 primarybtn mlr20" type="warning"
		 @click="app.goPage('/pages/nft/market/index')">{{app.langReplace('前往寄售市场')}}</button>
		 
		 <button class="mt20 primarybtn mlr20" type="warning"
		  @click="app.goPage('/pages/member/center/index')">{{app.langReplace('返回个人中心')}}</button>
		  
		 <button v-if="orderInfo.is_pay == 1" class="mt20 mlr20 " type="warning" style="border-radius: 40rpx;"
		 	 @click="cancelOrder()">{{app.langReplace('取消订单')}}</button>
		<view class="blank">
			</view>
		</view>
		<view v-if="orderInfo.is_pay == 1" class="fixed_btn flex">
			<view class="lh80 color-ff ml30 mt10 ">
				<text>订单将在：</text>
				<text >{{times.hou}}</text>:<text>{{times.min}}</text>:<text>{{times.sec}}</text>
				<text class="ml10">后取消</text>
			</view>
			<view class="btn primarybtn" @click="app.goPage('pay?from=nft&order_id='+orderInfo.order_id+'&order_type='+order_type,-1)">
				立即支付
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				baseImgUrl: this.config.baseImgUrl,
				order_id: 0,
				order_type: '',
				orderInfo:{},
				times:{},
			}
		},
		onLoad(options) {
			this.order_id = options.order_id;
			this.order_type = options.order_type;
		},
		onShow() {
			this.getInfo();
		},
		methods:{
			//获取信息
			getInfo() {
				this.$u.post('nft/api.order/getInfo', {
					'order_id': this.order_id,
					'showLoading':false
				}).then(res => {
					this.orderInfo = res.data;
					if (this.orderInfo.blind_box_id > 0){
						this.orderInfo.blind_box_pic = this.baseImgUrl + this.orderInfo.blind_box_pic;
					}else{
						this.orderInfo.nft_pic = this.baseImgUrl + this.orderInfo.nft_pic;
						this.orderInfo.creator_headimgurl = this.baseImgUrl + this.orderInfo.creator_headimgurl;
					}
					
					if (this.orderInfo.is_pay_eval == 1){
						setTimeout(() => {
							this.getInfo();
						},10000);
					}
					if (this.orderInfo.is_pay == 1){
						this.getReservTimeCount(this.orderInfo.exp_cancel_date);
					}
				})
			},
			getReservTimeCount(time){
				this.times = {
					day: '00',
					hou: '00',
					min: '00',
					sec: '00'
				};
				if (time == 0) return false; 
				if (typeof(this.reservTimeCount) != 'undefined'){
					clearInterval(this.reservTimeCount);
				}
				this.reservTimeCount=setInterval(()=>{
					let nowTime = new Date().getTime();
					//注：不论安卓还是ios，请将时间如 2020-02-02 20:20:20 转化为 2020/02/02 20:20:20 这种形式后再使用，否则无法转换，如下转换即可↓
					let transedPreTime= time.replace(/-/g,'/') //这里转化时间格式为以/分隔形式
					let preTime = new Date(transedPreTime).getTime()
					if(preTime - nowTime > 0){
						let time = (preTime - nowTime) / 1000;
						if (time > 0){
							let day = parseInt(time / (60 * 60 * 24));
							let hou = parseInt(time % (60 * 60 * 24) / 3600);
							let min = parseInt(time % (60 * 60 * 24) % 3600 / 60);
							let sec = parseInt(time % (60 * 60 * 24) % 3600 % 60);
							let msec = Math.floor(time * 1000 % 1000 / 100);
							this.times = {
								day: day<10?'0'+day:day,
								hou: hou<10?'0'+hou:hou,
								min: min<10?'0'+min:min,
								sec: sec<10?'0'+sec:sec
							};
						}else{
							clearInterval(this.reservTimeCount);
							this.getInfo();
						}
					}else{
						clearInterval(this.reservTimeCount);
						this.getInfo();
					}
				},1000)
			},
			//取消订单
			cancelOrder(){
				let that = this;
				uni.showModal({
					title: that.app.langReplace('提示'),
					confirmText: that.app.langReplace('确认取消'),
					cancelText: that.app.langReplace('不取消'),
					content: that.app.langReplace('确定取消订单？'),
					showCancel: true,
					success: function(res) {
						if (res.confirm) {
							if (that.is_post == true){
								return false;
							}
							that.is_post = true;
							that.$u.post('nft/api.flow/cancelOrder', {
								'order_id': that.order_id
							}).then(res => {
								that.app.showModal(res.msg);
								that.is_post = false;
								that.getInfo();
							}).catch(res=>{
								that.is_post = false;
								that.getInfo();
							})
						}
					}
				});
			},
		}
	}
</script>

<style lang="scss">
	
	.banner{
		height: 274rpx;
		// background: linear-gradient(135deg, rgba(50, 77, 92, 1) 0%, rgba(60, 34, 77, 1) 100%);
		padding: 65rpx;
	}
	.icon{
		width: 42rpx;
		height: 42rpx;
	}
	.main_box{
		width: 688rpx;
		margin: 0 auto;
		margin-top: -100rpx;
		border-radius: 16rpx;
	}
	.img{
		width: 150rpx;
		height: 150rpx;
		border-radius: 10rpx;
	}
	.head{
		width: 40rpx;
		height: 40rpx;
		border-radius: 50%;
	}
	.desc{
		width: 688rpx;
		margin: 0 auto;
		border-radius: 16rpx;
	}
	.blank{
		// background: #222136;
		height: 140rpx;
	}
	.fixed_btn{
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		height: 98rpx;
		background-color: #313131;
		
		.btn{
			width: 221rpx;
			height: 68rpx;
			// border: 1rpx solid rgba(198, 115, 250, 1);
			border-radius: 45rpx;
			// color: rgba(198, 115, 250, 1);
			font-size: 32rpx;
			text-align: center;
			line-height: 68rpx;
			margin:15rpx 20rpx 0 auto ;
		}
	}
</style>
