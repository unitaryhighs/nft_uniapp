<template>
	<view class="page-body" :class="[app.setCStyle()]">
		<scroll-view class="hb100" scroll-y>
			<!-- 空白页 -->
			<empty v-if="dataList.list.length === 0" class="mt80"></empty>
			<block v-else>
				<!-- 列表 -->
				<view v-for="(item,index) in dataList.list" :key="index" class="box-bg-base mt20 p20 br20 mlr20 tap" hover-class="hover" hover-start-time="0" hover-stay-time="100"
				@click="app.goPage('info?id='+item.id)">
					<view class="fs32 color-ff">{{item.title}}</view>
					<view class="base-color mt10">
						活动时间：{{item.reg_date_start}}~{{item.reg_date_end}}
					</view>
					<view class="base-color mt10">
						<view v-if="item.is_give === 1">已领取</view>
						<view v-else>领取时间：{{item.give_date_start}}~{{item.give_date_end}}</view>
					</view>
					<view class="mt10 fs28 color-94">{{item.description}}</view>
				</view>
			</block>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		data() {
			let that = this;
			return {
				dataList:{
					list: [],
					loaded:false
				}
			}
		},
		onLoad() {
			this.app.isLogin(this);//强制登陆
			let title = this.app.langReplace('邀请活动');
			uni.setNavigationBarTitle({
				title
			})
		},
		onShow() {
			this.getList('refresh');
		},
		async onPullDownRefresh() {
			await this.getList('refresh');
		},
		computed: {},
		onReady() {},
		methods: {
			getList(source) {
				return new Promise((resolve,reject) => {
					this.$u.post('nft/api.share_activity/getList').then(res => {
						if (source === 'refresh') {
							this.dataList.list = [];
						}
						this.dataList.list = this.dataList.list.concat(res.data.list);
						//loaded新字段用于表示数据加载完毕，如果为空可以显示空白页
						this.$set(this.dataList, 'loaded', true);
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
</style>
