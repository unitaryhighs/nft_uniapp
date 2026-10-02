<template>
	<view class="empty-content">
		<ji-nav-bar v-if="!wechat" class="ji-nav-bar" ref="navBar" type="fixed" bgColor="#1E1E1F" :withPadding="false" fontColor="#ffffff"
		backState="2000" homeState="2000">
			<view class="preview" slot="default" style="color: #fff">链源</view>
		</ji-nav-bar>
		<image class="empty-content-image" src="/static/images/maintenance.png" mode="aspectFit"></image>
		<text class="tip">{{msg}}</text>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				msg: '系统维护中. 当前服务处于维护状态，维护期间暂时停止服务。 因此给您带来的不便，敬请谅解。',
			}
		},
		onLoad(e) {
			if(e.msg){
				this.msg = e.msg;
			}
		}
	}
</script>

<style lang="scss">
	.empty-content {
		height: 90vh;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;

		&-image {
			width: 405rpx;
			height: 274rpx;
		}
		.tip{
			width: 70vw;
			text-align: center;
			margin-top: 50rpx;
			color: #777;
		}
	}
</style>
