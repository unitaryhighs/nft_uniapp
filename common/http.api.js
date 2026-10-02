

// 此处第二个参数vm，就是我们在页面使用的this，你可以通过vm获取vuex等操作，更多内容详见uView对拦截器的介绍部分：
// https://uviewui.com/js/http.html#%E4%BD%95%E8%B0%93%E8%AF%B7%E6%B1%82%E6%8B%A6%E6%88%AA%EF%BC%9F
const install = (Vue, vm) => {
	let data = {
		// 获取会员信息
		getUserInfo(params = {}){
			return vm.$u.get('member/api.users/getInfo')
		},
		// 获取收货地址
		getUseraddress(params = {}){
			return vm.$u.get('member/api.address/getList')
		},
		
		// 获取代理信息
		getProxyInfo(params = {}){
			return vm.$u.get('channel/api.proxy_users/getInfo')
		},
		
		
		
		// 寄售市场列表
		getMarketList(params = {}){
			return vm.$u.post('/nft/api.market_news/getList',params)
		},
		// 寄售详情
		getMarketInfo(params = {}){
			return vm.$u.post('/nft/api.market_news/getNftList',params)
		},
		// 寄售创建支付单
		marketBuy(params = {}){
			return vm.$u.post('/nft/api.flow/marketBuy',params)
		},
		// 寄售获取支付数据
		getPayOrder(params = {}){
			return vm.$u.post('/nft/api.market_news/getPayOrder',params)
		},
		
		
		// 公共信息
		getDescInfo(params = {}){
			return vm.$u.post('/publics/api.index/getdescinfo',params)
		},
		// 区块链信息查询
		getHashInfo(params = {}){
			return vm.$u.post('/member/api.chain/getHashInfo',params)
		},
		
		// 获取支付方式
		getPayIndex(params = {}){
			return vm.$u.post('/member/api.wallet/getIndex',params)
		},
	}
	
	
	
	// 将各个定义的接口名称，统一放进对象挂载到vm.$u.api(因为vm就是this，也即this.$u.api)下
	vm.$u.api = data;
}

export default {
	install
}