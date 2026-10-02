<template>
	<view class="page-body" :class="[app.setCStyle()]">
		<view class=" p20">
			<view class="detail-desc" v-html="content"></view>
			<!-- <button size="default" shape="circle" class="primarybtn mt40 " type="warning"  @click="app.goPage(-1)">返回继续操作</button> -->
		</view>
	</view>
</template>


<script>
	export default {
		data() {
			return {
				type:'',
				content:''
			}
		},
		onLoad(options) {
			let title = '服务协议';
			this.type = 'register';
			if (options.type == 'privacy'){
				title = '隐私协议';
				this.type = options.type;
			}
			uni.setNavigationBarTitle({
				title
			})
			this.getInfo();
			
			// #ifdef APP-PLUS
			if(this.$u.os() == 'android'){
				var Color = plus.android.importClass("android.graphics.Color");    
				    plus.android.importClass("android.view.Window");    
				    var mainActivity = plus.android.runtimeMainActivity();    
				    var window_android = mainActivity.getWindow();    
				    window_android.setNavigationBarColor(Color.parseColor("#FFFFFF"));
			};
			// #endif
			// #ifdef H5
			this.app.addELPopState();
			// #endif
		},
		onUnload() {
			// #ifdef APP-PLUS
			if(this.$u.os() == 'android'){
				var Color = plus.android.importClass("android.graphics.Color");    
				    plus.android.importClass("android.view.Window");    
				    var mainActivity = plus.android.runtimeMainActivity();    
				    var window_android = mainActivity.getWindow();    
				    window_android.setNavigationBarColor(Color.parseColor("#313131"));
			};
			// #endif
			// #ifdef H5
			this.app.rmvELPopState();
			// #endif
		},
		methods: {
			getInfo(){
				let data = {};
				data.type = this.type;
				this.$u.post('publics/api.article/regagreement',data).then(res => {
					this.content = res.data.content;
				})
			}
		}
	}
</script>

<style>
	page {
		background-color: #fff;
	}
</style>
<style lang="scss">
	.title{
		margin-top: 20rpx;
		font-size: 32rpx;
		font-weight: bold;
		text-align: center;
	}
	/deep/.detail-desc{
		color: #333;
		img{
			width: 100% !important;
			vertical-align: middle;
		}
		td {
			border-style: solid;
			border-width: 1px;
		}
		table {
			width: 100% !important;
		}
	}
</style>
