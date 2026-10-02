<template>
	<view class="page-body p30">
		<view class="box-bg-base  p20 br40" >
			<u-grid :col="2" :border="false">
					<u-grid-item class="box-bg-base">
						<view class="color-F3D7B7 fs40">{{push_num}}</view>
						<view class="color-99 fs28">推广人数</view>
					</u-grid-item>
					<u-grid-item class="box-bg-base">
						<view class="color-F3D7B7 fs40"><text class="fs24">￥</text>{{push_achievement}}</view>
						<view class="color-99 fs28">推广业绩</view>
					</u-grid-item>
				</u-grid>
		</view>
		<view class="box-bg-base main_box br40 mt30">
			<view class="color-ff pt30 ml30 fs32">推广记录</view>
			<scroll-view class="scroll_h" scroll-y @scrolltolower="loadData">
				<view class="p30">
					<view class="flex fh mt30 pb30" style="border-bottom: 1rpx solid #2C2C2D;"  v-for="(item,index) in userList.list" :key="index">
						<view class="follow_img"><image :src="baseImgUrl+item.headimgurl" mode=""></image></view>
						<view class="ml20">
							<view class="fs30 color-ff">{{item.nick_name}}</view>
							<view class="fs26 color-99 mt20">ID:{{item.user_id}}</view>
						</view>
						<view class="fll">
							<view class="fs24 color-ff">￥<text class="fs40">{{item.total_consume}}</text></view>
							<view class="color-99 fs26 text-right mt10">业绩</view>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
		
	</view>
</template>

<script>
	export default{
		data(){
			return{
				baseImgUrl: this.config.baseImgUrl,
				push_num:0,
				push_achievement:'0.00',
				userList: {
					loadingType: 'more',
					list: [],
					p: 0
				},
			}
		},
		onShow(){
			this.loadData('refresh');
		},
		methods:{
			//获取列表
			loadData(source) {
				let userList = this.userList;
				if (source === 'refresh') {
					userList.p = 0;
					userList.loadingType = 'more';
					// userList.list = [];
					userList.loaded = false;
				}
				if (userList.loadingType == 'nomore' || userList.loadingType === 'loading') {
					return;
				}
				if (userList.loaded === true) {
					//tab切换只有第一次需要加载数据
					return;
				}
				userList.p++;
				let param = {};
				param.p = userList.p;
				userList.loadingType = 'loading';
				this.$u.post('member/api.bd_account/getPushList', param).then(res => {
					if (source === 'refresh') {
						userList.list = [];
					}
					if (userList.p == 1){
						this.push_num = res.data.push_num;
						this.push_achievement = res.data.push_achievement;
					}
					userList.list = userList.list.concat(res.data.list);
					//loaded新字段用于表示数据加载完毕，如果为空可以显示空白页
					this.$set(userList, 'loaded', true);
					//判断是否还有下一页，有是more  没有是nomore
					userList.loadingType = userList.p == res.data.page_count ? 'nomore' : 'more';
				})
			},
		}
	}
</script>

<style lang="scss">
	.follow_img{
		width: 98rpx;
		height: 98rpx;
		image{
			width: 100%;
			height: 100%;
			border-radius: 50%;
		}
	}
	.main_box{
		height: calc(100% - 200rpx);
	}
	.scroll_h{
		height: calc(100% - 74rpx);
	}
</style>
