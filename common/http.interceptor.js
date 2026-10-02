// 这里的vm，就是我们在vue文件里面的this，所以我们能在这里获取vuex的变量，比如存放在里面的token
// 同时，我们也可以在此使用getApp().globalData，如果你把token放在getApp().globalData的话，也是可以使用的
const install = (Vue, vm) => {
	Vue.prototype.$u.http.setConfig({
		baseUrl: Vue.prototype.config.baseUrl+'/index.php',
		showLoading: false
		// 如果将此值设置为true，拦截回调中将会返回服务端返回的所有数据response，而不是response.data
		// 设置为true后，就需要在this.$u.http.interceptor.response进行多一次的判断，请打印查看具体值
		// originalData: true, 
		// 设置自定义头部content-type
		// header: {
		// 	'content-type': 'xxx'
		// }
	});
	// 请求拦截，配置Token等参数
	Vue.prototype.$u.http.interceptor.request = (config) => {
		if (config.data.notLoginLimit != 1 && uni.getStorageSync("isNotLoginTip") == 1) {
			return false;
		}
		if(!vm.globalData.callNums){
			vm.globalData.callNums = 1;
		} else {
			vm.globalData.callNums++;
		}
		if (config.data.showLoading !== false){
			if(!vm.globalData.callTimer) {
				vm.globalData.callTimer = setTimeout(() => {
					vm.globalData.callTimer = null;
					if(vm.globalData.callNums){
						uni.showLoading();
						setTimeout(()=>{
							uni.hideLoading();
							uni.stopPullDownRefresh();
						}, 7000)
					}
				}, 2000);
			}
		}
		if('showLoading' in config.data){
			delete config.data.showLoading;
		}
		
		config.header.language = uni.getStorageSync("sys_language");
		config.header.token = uni.getStorageSync("authcode");
		config.header.appsessionid = uni.getStorageSync("session_id");
		config.header.uiType = 'uniapp';
		config.header.source = uni.getStorageSync("source_platform");
		let userInfo = uni.getStorageSync("userInfo");
		config.header.uid = userInfo?userInfo.user_id:'';
		// 方式一，存放在vuex的token，假设使用了uView封装的vuex方式，见：https://uviewui.com/components/globalVariable.html
		// config.header.token = vm.token;
		
		// 方式二，如果没有使用uView封装的vuex方法，那么需要使用$store.state获取
		// config.header.token = vm.$store.state.token;
		
		// 方式三，如果token放在了globalData，通过getApp().globalData获取
		// config.header.token = getApp().globalData.username;
		
		// 方式四，如果token放在了Storage本地存储中，拦截是每次请求都执行的，所以哪怕您重新登录修改了Storage，下一次的请求将会是最新值
		// const token = uni.getStorageSync('token');
		// config.header.token = token;
		
		return config; 
	}
	// 响应拦截，判断状态码是否通过
	Vue.prototype.$u.http.interceptor.response = (res) => {
		// 如果把originalData设置为了true，这里得到将会是服务器返回的所有的原始数据
		// 判断可能变成了res.statueCode，或者res.data.code之类的，请打印查看结果
		// 如果把originalData设置为了true，这里return回什么，this.$u.post的then回调中就会得到什么
		if(!vm.globalData.callNums){
			clearTimeout(vm.globalData.callTimer);
			vm.globalData.callTimer = null;
			uni.hideLoading();
			uni.stopPullDownRefresh();
		}
				
		if(typeof(res.code) == 'undefined') {
			uni.showToast({
			    title: '回调数据错误.',
			    duration: 5000,
				icon:'none'
			});
			return false;
		} 
		if (res.code == 0){
			uni.showToast({
			    title: res.msg,
			    duration: 5000,
				icon:'none'
			});
			Vue.prototype.app.setAuthTime();
			return false;
		}
		if (res.code == -1){
			uni.showToast({
				title: res.msg || '请稍后再试～',
				icon: 'none',
				position: 'bottom'
			})
			return false;
		}
		if (res.code == -2){
			uni.reLaunch({
				url: '/pages/public/maintenance?msg='+res.msg
			})
			return false;
		}
		if (res.code == -400001){
			Vue.prototype.app.delAuthCode();
			let pages = getCurrentPages();
			let page = pages[pages.length - 1];
			Vue.prototype.app.noLoginModal(page,res.msg);
			return false;
		}
		if (res.code == -400002){
			Vue.prototype.app.delAuthCode();
			Vue.prototype.app.showModal(res.msg,'/pages/member/passport/login',-1);
			return false;
		}
		return res;
	}
}

export default {
	install
}