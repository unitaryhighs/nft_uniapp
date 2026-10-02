<template>
	<view class="page-body " :class="[app.setCStyle()]">
		<view class="main-box  base-select p30">
			
			<u-search  :placeholder="app.langReplace('请输入用户id、手机账号进行搜索')" bg-color="none" class="box-bg-base radius20" shape="square" input-align="left" :show-action="false"  v-model="keywordArr"  @search="loadData('refresh')"></u-search>
				
			<view class="team-list-box box-bg-base mt20">
				<view class="title color-ff">
					邀请总数：{{userTotal}} <text class="ml20">实名认证数：{{users.checkNameTotal}}</text>
				</view>
				<!-- <scroll-view class="user_box" scroll-y @scrolltolower="loadData('add')"> -->
				<view class="user_box">
					<!-- 空白页 -->
					<empty class="box-bg-base" v-if="users.list.length === 0"></empty>
					<block v-else>
						<view class="user_item flex" v-for="(item, index) in users.list" :key="index">
							<view class="img">
								<u-image :src="item.headimgurl?baseImgUrl+item.headimgurl:'/static/images/headimgurl.jpg'" mode="widthFix" shape="circle"></u-image>
							</view>
							<view class="flex_bd">
								<view class="user_name text_hidden">{{item.user_id}} - {{item.nick_name?item.nick_name:' 暂无昵称'}}</view>
								<view class="role_name hide">{{item.role_id>0?roleList[item.role_id].role_name:' -- '}}</view>
								<view>{{item.mobile}}
								<view v-if="item.check_id_card==1">实名时间：{{item.check_id_card_date}}</view>
								<view v-else >未实名</view>
								</view>
							</view>
							<view class="user_btn hide" @click="app.goPage('taIndex?user_id='+item.user_id)">{{app.langReplace('TA的主页')}}</view>
						</view>
						<uni-load-more :status="users.loadingType"></uni-load-more>
					</block>
				<!-- </scroll-view> -->
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				baseImgUrl: this.config.baseImgUrl,
				keywordArr:'',
				roleList:[],
				userTotal:0,
				users:{
					checkNameTotal:0,
					uncheckNameTotal:0,
					loadingType: 'more',
					list: [],
					p: 0
				}
			}
		},
		onLoad(options) {
			this.app.isLogin(this);//强制登陆
			let title = this.app.langReplace('邀请记录');
			uni.setNavigationBarTitle({
				title
			})
		},
		onShow() {
			this.getRoleList();
			this.loadData('refresh');
		},
		onReachBottom() {
			this.loadData('add');
		},
		async onPullDownRefresh() {
			this.getRoleList();
			await this.loadData('refresh');
		},
		methods: {
			getRoleList(){
				this.$u.post('member/api.fans/getRoleList').then(res => {
					this.roleList = res.data.roleList;
				})
			},
			loadData(source = 'add'){
				return new Promise((resolve,reject) => {
					if (this.users.loadingType === 'loading') {
						//防止重复加载
						return;
					}
					
					//没有更多直接返回
					if (source == 'add' && this.users.loadingType == 'nomore') {
						return;
					}
					if (source === 'refresh') {
						this.users.p = 0;
						// this.users.list = [];
						this.users.loaded = false;
					}
					
					this.users.loadingType = 'loading';
					this.users.p++;
					let param = {};
					param.keyword = this.keywordArr;
					param.p = this.users.p;
					
					this.$u.post('member/api.fans/getFansUserList',param).then(res => {
						if (source === 'refresh') {
							this.users.list = [];
						}
						this.users.list = this.users.list.concat(res.data.list);
						this.$set(this.users, 'loaded', true);
						if (param.p == 1){
							this.userTotal = res.data.userTotal;
							this.users.checkNameTotal = res.data.checkNameTotal;
							this.users.uncheckNameTotal = res.data.uncheckNameTotal;
						}
						this.users.loadingType = this.users.p == res.data.page_count ? 'nomore' : 'more';
						resolve(res)
					}).catch(err => {
						reject(err)
					})
				})
			},
		
		}
	}
</script>

<style lang="scss">
	.main-box {
		height: calc(100% - 80rpx);
	}
	
	.team-list-box{
		padding: 44rpx 32rpx;
		border-radius: 16rpx;
		height: calc(100% - 60rpx);
	}
	
	.team-list-box .title{
		color: #666666;
		height: 66rpx;
		font-size: 28rpx;
		border-bottom: 1rpx solid #333;
	}
	

	.user_box {
		height: calc(100% - 50rpx);
		.user_item {
			padding: 40rpx 0rpx 20rpx 0rpx;
			font-size: 28rpx;
			color: #ffffff;
			.img {
				float: left;
				margin-right: 36rpx;
				width: 86rpx;
				height: 86rpx;
				border-radius: 50%;
				overflow: hidden;
			}
			.user_name{
				width: 300rpx;
			}
			.role_name{
				margin-top: 10rpx;
				background: linear-gradient(57deg, #C8DAF3 0%, #ABBCDF 100%);
				display: table;
				padding: 5rpx 20rpx;
				border-radius: 20rpx;
				color: #FFFFFF;
				font-size: 22rpx;
			}
			
			.user_btn{
				margin-top: 20rpx;
				height: 50rpx;
				line-height: 30rpx;
				color: $base-color;
				border: 1rpx solid $base-color;
				border-radius: 30rpx;
				padding: 10rpx  20rpx;
			}
		}
	}

	.team-tree {

		.all-title {
			position: relative;
			width: 100%;
			padding: 0 20rpx;
			background-color: #ffffff;
			margin-bottom: 20rpx;
			box-shadow: 0px 10rpx 20rpx 0px rgba(0, 0, 0, 0.04);
			border-radius: 0px 0px 10rpx 10rpx;
			line-height: 100rpx;
			color: $font-color-dark;
			font-size: 28rpx;

			.count {
				color: #98979a;
				font-size: 28rpx;
				margin-left: 5rpx;
			}

			.icon {
				float: right;
				color: rgb(144, 147, 153);
				font-size: inherit;
			}
		}
	}
</style>
