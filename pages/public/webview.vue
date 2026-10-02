<template>
	<view>
		<web-view :src="src" @message="message" @onPostMessage="message"></web-view>
	</view>
</template>

<script>
	import Base64 from 'base-64';
	export default {
		data() {
			return {
				src: '',
			};
		},
		onLoad(e) {
			let src = Base64.decode(e.src)
			if(src){
				this.src = src;
			}
			
			// #ifdef H5
			this.app.addELPopState();
			// #endif
		},
		// #ifdef H5
		onUnload() {
			this.app.rmvELPopState();
		},
		// #endif
		methods: {
			message(e){
				let data = e.detail.data[0];
				if(data.src){
					uni.reLaunch({
						url: data.src+data.option||''
					})
				}
			}
		},
	}
</script>

<style lang="scss">

</style>
