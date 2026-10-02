<template>
	<u-tabbar v-model="current" :list="list" bg-color="#313131" active-color="#ecc79e"  :before-switch="beforeSwitch" :_autoFun="autoFun" :border-top="true"
	:mid-button="false" :mid-button-size="60" :iconSize="50" :height="110" :fontSize="22" :lineHeight="34"></u-tabbar>
</template>

<script>
	export default {
		name: "tabbar",
		props: {
			now_page:{
				type: String,
				default:''
			},
			getCartNum:{
				type: Number,
				default:0
			}
		},
		data() {
			return {
				list: [],
				current:0
			}
		},
		created() {
			this.autoFun()
		},
		methods: {
			beforeSwitch(index){
				this.app.goPage(this.list[index].url);
				return false;
			},
			//加载购物车中商品数
			// async loadCartNum() {
			// 	this.$u.post('shop/api.flow/getCartInfo').then(res => {
			// 		let cartNum = res.data.num;
			// 		this.$set(this.list[2], 'count', cartNum);
			// 	})
			// },
			async autoFun(){
				let setting = uni.getStorageSync('setting');
				this.list = setting && setting.tabarList ? setting.tabarList : null;
				if(!this.list){
					//获取全站默认配置
					let res = await this.$u.get('publics/api.index/defaultSetting',{notLoginLimit:1});
					let settingBase64 = await this.app.tabIconToBase64(res.data.setting);
					uni.setStorageSync("setting",settingBase64);
					this.list = settingBase64.tabarList;
				}
				this.list.forEach((item,key)=>{
					if (item.url == '/'+this.now_page){
						this.current = key;
						return false;
					}
				})
			},
		}
	}
</script>
<style lang="scss" scoped>
	/deep/ .u-border-top:after {
		// border: 0 solid rgba(200, 200, 200, .2);
		border-color: rgba(200, 200, 200, .2);
	}
</style>
