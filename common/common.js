let sysLang = uni.getStorageSync("sys_language");
let LangPackArr = '';
import config from '@/config.js' //配置信息
import { pathToBase64 } from '@/js_sdk/mmmm-image-tools/index.js'
module.exports = {
	addELPopState(){
		if (window.history && window.history.pushState) {
			history.pushState(null, null, document.URL);
			window.addEventListener("popstate", this.popState, false);
		}
	},
	rmvELPopState(){
		window.removeEventListener("popstate", this.popState, false);
	},
	popState(){
		uni.navigateBack();
	},
	downImage(src){
		return new Promise((resolve,reject) => {
			uni.getImageInfo({
				src,
				complete: (image) => {
					console.log(image);
					if(image.errMsg == "getImageInfo:ok"){
						resolve(image.path);
					} else {
						resolve(src);
					}
				}
			});
		})
	},
	tabIconToBase64(setting){
		return new Promise((resolve,reject) => {
			Promise.all(setting.tabarList.map(async item => {
				// #ifdef H5
				item.iconPath = await pathToBase64(item.iconPath);
				item.selectedIconPath = await pathToBase64(item.selectedIconPath);
				// #endif
				// #ifdef APP-PLUS
				item.iconPath = await this.downImage(item.iconPath);
				item.selectedIconPath = await this.downImage(item.selectedIconPath);
				// #endif
				return item;
			})).then(res => {
				setting.tabarList = res;
				resolve(setting);
			}).catch(error => {
				console.log(error)
				reject(error);
			})
		})
	},
	backPress(arr){
		let tag = false;
		for(let i=0; i<arr.length; i++){
			if(arr[i].obj[arr[i].key]){
				arr[i].obj[arr[i].key] = false;
				tag = true;
				break;
			}
		}
		return tag;
	},
	async saveUserInfo(vm){
		// 保存用户信息
		let res = await vm.$u.api.getUserInfo();
		if(res.code == 1){
			uni.setStorageSync('userInfo',res.data);
		}
	},
	async checkRealName(vm){
		let authcode = uni.getStorageSync("authcode");
		if (!authcode) {
			return false;
		}
		let userInfo = uni.getStorageSync('userInfo');
		if(!userInfo){
			let res = await vm.$u.api.getUserInfo();
			if(res.code == 1){
				userInfo = res.data;
				uni.setStorageSync('userInfo',userInfo);
			}
		}
		if(userInfo.check_id_card == 1){
			return true;
		} else {
			return false;
		}
	},
	showAppAd(safeArea){
		// app开屏广告
		// #ifdef APP-PLUS
		let launchImgData = uni.getStorageSync('launchImgData');
		// 获取顶部安全区域的高度 安卓的顶部区域为0 ios的是实际大小
		let safeTopArea = uni.getSystemInfoSync().platform=='ios'?safeArea?safeArea.top:uni.getSystemInfoSync().safeAreaInsets.top:0;
		//获取底部安全区域的高度
		let safeBoottom = safeArea?safeArea.bottom:uni.getSystemInfoSync().safeAreaInsets.bottom;
		let webviewStyle = {
			zindex: 99999,
		    top: - safeTopArea,  //ios的位置上移安全区域的高度 
		    height: uni.getSystemInfoSync().windowHeight + safeBoottom + safeTopArea,  //高度+安全区域的高度
		}
		// app启动时打开启动广告页
		var w = plus.webview.open(
		`hybrid/html/advertise/advertise.html?url=${launchImgData.url}&use=${launchImgData.use}&duration=${launchImgData.duration}&skip=${launchImgData.skip}`,
		'AD',
		{ top: - safeTopArea, bottom: - safeBoottom, zindex: 999 },
		'fade-in',
		);
		setTimeout(()=>{
			plus.navigator.closeSplashscreen();
		},100)
		//设置定时器，4s后关闭启动广告页
		setTimeout(function() {
			plus.webview.close(w);
		}, launchImgData.duration||3000);
		// #endif
	},
	refreshData(page,time,force=true){//判断是否刷新数据
		if(config.forceRefresh && force){
			if(typeof(getApp().globalData.refreshPage) === 'undefined'){
				return true;
			} else if(getApp() && getApp().globalData.refreshPage){
				getApp().globalData.refreshPage = false;
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 0
				});
				return true
			} else {
				return false
			}
		};
		
		let refreshTime = config.refreshTime * 60 * 1000;
		let refresh_info = uni.getStorageSync('refresh_info') || [];
		let pageInfo;
		let tag = false;
		refresh_info.forEach(item => {
			if(item.page == page){
				pageInfo = item;
			}
		});
		// 第一次无数据
		if(!pageInfo){
			pageInfo = {
				page,
				time
			};
			refresh_info.push(pageInfo);
			tag = true;
		} else {
			if(!pageInfo.time || time - pageInfo.time > refreshTime){
				// 需要刷新或已过期
				pageInfo.time = time;
				refresh_info.forEach(item => {
					if(item.page == page){
						item.time = time;
					}
				});
				tag = true;
			} else {
				// 未过期
			}
		}
		uni.setStorageSync('refresh_info',refresh_info);
		return tag;
	},
	clearRefreshData(){// 重置缓存 - 需要刷新数据
		let refresh_info = uni.getStorageSync('refresh_info') || [];
		if(refresh_info.length){
			refresh_info.forEach(item => {
				item.time = 0;
			});
		}
		uni.setStorageSync('refresh_info',refresh_info);
	},
	listenRoute(){
		let _this = this;
		//自定义路由拦截
		// 1.needLogin：黑名单模式。枚举游客不可访问的页面。
		// 2.visitor：白名单模式。枚举游客可访问的页面。
		const needLogin = [
			'/pages/nft/market/index',
			'/pages/member/center/index',
			'/pages/member/center/checkIdCard'
		];
		// const visitor = [
			
		// ];
		
		let list = ["navigateTo", "redirectTo", "reLaunch", "switchTab", "navigateBack"];
		list.forEach(item => { //用遍历的方式分别为,uni.navigateTo,uni.redirectTo,uni.reLaunch,uni.switchTab这4个路由方法添加拦截器
			uni.addInterceptor(item, {
				invoke(e) { // 调用前拦截
					if(item == 'navigateBack'){
						getApp().globalData.refreshPage = false;
						return e;
					} else {
						getApp().globalData.refreshPage = true;
					}
					const url = e.url.split('?')[0];
					//获取要前往的页面路径（即url去掉"?"和"?"后的参数）
					const pages = getCurrentPages();
					const page = pages[pages.length - 1];
					if (!pages.length) {
						console.log("首页启动调用了");
						return e
					}
					
					let authcode = uni.getStorageSync("authcode");
					
					// console.log(url,page.route);
					let returnUrl = '';
					if (typeof(page) == 'object'){
						returnUrl = encodeURIComponent(url+'?'+_this.objectToQueryString(page.options));
					}
					let loginUrl = '/pages/member/passport/login?returnUrl='+returnUrl;
					//控制登录优先级
					if ( //判断当前窗口是否为登录页面，如果是则不重定向路由
						url == '/pages/member/passport/login' &&
						page.route == 'pages/member/passport/login'
					) {
						return false;
					} else {
						//拦截强制登录页面
						let pass = true
						//pattern
						if (needLogin) {
							pass = needLogin.every((item) => {
								if (typeof(item) == 'object' && item.pattern) {
									return !item.pattern.test(url)
								}
								return url != item
							})
							// console.log({pass})
						}
						// if (visitor) {
						// 	pass = visitor.some((item) => {
						// 		if (typeof(item) == 'object' && item.pattern) {
						// 			return item.pattern.test(url)
						// 		}
						// 		return url == item
						// 	})
						// 	console.log({pass})
						// }
		
						if (!pass && !authcode) {
							uni.navigateTo({
								url: loginUrl
							})
							return false
						}
					}
					return e;
				},
				fail(err) { // 失败回调拦截 
					console.log(err);
				}
			})
		})
	},
	checkToLogin(back=0){
		const pages = getCurrentPages();
		const page = pages[pages.length - 1];
		if (!pages.length) {
			return false
		}
		let authcode = uni.getStorageSync("authcode");
		let loginUrl = '/pages/member/passport/login?back='+back+'&returnUrl='+encodeURIComponent(page.$page.fullPath);
		if(!authcode){
			uni.navigateTo({
				url: loginUrl
			})
			return false
		}
		return true;
	},
	isLogin: function(_that,model='') { //判断登陆
		let authcode = uni.getStorageSync("authcode");
		if (authcode != '') {
			return true;
		}
		let pages = getCurrentPages();
		let page = pages[pages.length - 1];
		if (typeof(page) == 'undefined') { //未读取到页面信息
			return true;
		}
		this.noLoginModal(page, this.langReplace('未登陆或登陆超时，请重新登陆.'),true);
		return false;
	},
	isMPTextModel:function(){ //是否开启小程序审批模式
		// #ifdef MP-WEIXIN
		let setting = uni.getStorageSync("setting");
		if (setting.xcx_check_model == 1){
			return true;
		}
		// #endif
		return false;
	},
	setAuthTime: function() { //设置授权时间
		let time = new Date().getTime();
		uni.setStorageSync("auth_time", time+86400000);
	},
	checkAuthTime: function() { //校验授权时间
		let time = new Date().getTime();
		let auth_time =	uni.getStorageSync("auth_time");
		return (auth_time > time) ? true : false;
	},
	getAuthCode: function() { //获取登陆授权码
		if (this.checkAuthTime() == false){
			return '';
		}
		return uni.getStorageSync("authcode");
	},
	setAuthCode: function($authcode,$share_token) { //设置登陆授权码
		uni.setStorageSync("authcode", $authcode);
		uni.setStorageSync("my_share_token", $share_token);
		this.setAuthTime();//设置授权时间
	},
	delAuthCode: function() { //清理登陆授权码
		uni.removeStorageSync("authcode");
		uni.removeStorageSync("my_share_token");
	},
	getWxOpenId: function() { //获取微信openid
		if (this.checkAuthTime() == false){
			return '';
		}
		return uni.getStorageSync("wx_openid");
	},
	setWxOpenId: function($openId) { //设置微信openid
		uni.setStorageSync("wx_openid", $openId);
		this.setAuthTime();//设置授权时间
	},
	objectToQueryString: function(obj) {
	  return Object.keys(obj).map(function (key) {
	    return "".concat(encodeURIComponent(key), "=").concat(encodeURIComponent(obj[key]));
	  }).join('&');
	},
	toOutLink(url){ //判断是否外链，外链跳转
		if (url.slice(0, 7) === 'weixin:') {
			let str = url.replace(/^\s+|\s+$/g, "");
			//#ifdef H5
			window.location.href = str
			//#endif
			return false;
		}
		if (url.slice(0, 4) === 'http') {
			let str = url.replace(/^\s+|\s+$/g, "");
			//#ifdef H5
			window.location.href = str
			//#endif
			// #ifdef APP-PLUS
			plus.runtime.openURL(str, function(res) {
				console.log(res);
			});
			//#endif
			return false;
		}
		return true;
	},
	goPage: function(page, type = false) { //跳转页面
		let pages = getCurrentPages();
		if (page == -1) {
			if (pages.length <= 1){
				uni.redirectTo({
					url: '/pages/nft/index/index'
				});
			}else{
				uni.navigateBack({
					delta: 1
				});
			}
			return false;
		}
		
		if (page.indexOf('/pages/nft/index/index') >= 0 ||  page.indexOf('/pages/member/center/index') >= 0  ||  page.indexOf('/pages/nft/market/index') >= 0 ||  page.indexOf('/pages/nft/collection/showRoom') >= 0){
			uni.switchTab({
				url: page
			});
			return false;
		}
		
		if (this.toOutLink(page) == false){
			return false;
		}
		if (typeof(page) == 'object'){
			let options = this.objectToQueryString(page[1]);
			page = page[0]+'?'+options;
		}
		if (pages.length >= 10 && type != -1){
			uni.reLaunch({
				url: page
			});
			return false;
		}
		if (type === false) {
			uni.navigateTo({
				url: page
			});
			return false;
		}
		if (type == -1){
			uni.redirectTo({
				url: page
			});
			return false;
		}
		if (type == 1){
			uni.reLaunch({
				url: page
			});
			return false;
		}
		uni.switchTab({
			url: page
		});
	},
	noLoginModal: function(page, msg,forcibly=false) { //未登陆统一提示操作
		if (uni.getStorageSync("isNotLoginTip") == 1 && forcibly == false) {
			return false;
		}
		if(page.route.indexOf('pages/member/passport/login') > -1){
			return false;
		}
		uni.setStorageSync("isNotLoginTip", 1);
		let returnUrl = '';
		if (typeof(page) == 'object'){
			returnUrl = encodeURIComponent('/'+page.route+'?'+this.objectToQueryString(page.options));
		}
		
		let that = this;
		let loginUrl = '/pages/member/passport/login?returnUrl='+returnUrl;
		// if (forcibly == true){//强制必须登陆
						// console.log(page);
			// uni.showModal({
			// 	title:  that.langReplace('提示'),
			// 	confirmText: that.langReplace(forcibly == true? '确认' : '前往登录'),
			// 	content: msg,
			// 	showCancel: forcibly == true? false : true,
			// 	cancelText: that.langReplace('暂不登录'),
			// 	success: function(res) {
					uni.removeStorageSync("isNotLoginTip");
					// if (res.confirm) {
						if (['pages/nft/index/index','pages/member/center/index','pages/nft/market/index','pages/nft/collection/showRoom'].indexOf(page.route) > -1){
							uni.reLaunch({
								url:loginUrl
							});
							// console.log('reLaunch');
						} else {
							uni.redirectTo({
								url:loginUrl
							});
							// console.log('redirectTo');
						}
					// }
			// 	}
			// });
		// }else{//不强制，一般api请求返回未登陆时调用
		// 	uni.showModal({
		// 		title:  that.langReplace('提示'),
		// 		content: msg,
		// 		showCancel: true,
		// 		confirmText: that.langReplace('前往登录'),
		// 		cancelText: that.langReplace('暂不登录'),
		// 		success: function(res) {
		// 			uni.removeStorageSync("isNotLoginTip");
		// 			if (res.confirm) {
		// 				uni.redirectTo({
		// 					url: loginUrl
		// 				});
		// 			}
		// 		}
		// 	});
		// }
	},
	showModal: function(title, page = 0, type = false) { //提示并跳转
		let that = this;
		uni.showModal({
			title: that.langReplace('提示'),
			confirmText: that.langReplace('确认'),
			content: title,
			showCancel: false,
			success: function(res) {
				uni.removeStorageSync("isNotLoginTip");
				if (res.confirm) {
					if (page == 0) {
						return true;
					}
					that.goPage(page, type);
				}
			}
		});
	},
	showImg(pic, _current = 0, baseUrl = '', indicator = 'none') { //点击查看图片
		if (typeof(pic) == 'string') {
			var pics = [];
			pics.push(pic);
		} else {
			var pics = [];
			if (baseUrl !== '') {
				pic.forEach((item, index) => {
					pics.push(baseUrl + item);
				})
			} else {
				pics = pic;
			}
		}
		// 预览图片
		uni.previewImage({
			current: _current,
			urls: pics,
			indicator: indicator
		})
	},
	pxToRpx(px) { //px转rpx
		if (px <= 0) return 0;
		const info = uni.getSystemInfoSync();
		return px * 750 / info.windowWidth / 2;
	},
	toParams(options){ //转换参数
		let params = Object.keys(options).map(function (key) {
				        return encodeURIComponent(key) + "=" + encodeURIComponent(options[key]);
				    }).join("&");
		return params;
	},
	isIPhoneX(fn){
		let getSystemInfoSync = uni.getSystemInfoSync();
	    if (getSystemInfoSync.platform == 'ios') {
	        if (getSystemInfoSync.screenHeight == 812 && getSystemInfoSync.screenWidth == 375){
	            return true;//是iphoneX || xs || 11 Pro ||  12 mini 
			} else if (getSystemInfoSync.screenHeight == 896 && getSystemInfoSync.screenWidth == 414){
				return true;//是iphone xr || Xs Max || 11 || 11 Pro Max
			} else if (getSystemInfoSync.screenHeight == 844 && getSystemInfoSync.screenWidth == 390){
				return true;//是iPhone 12 || 12 Pro  
			} else if (getSystemInfoSync.screenHeight == 926 && getSystemInfoSync.screenWidth == 428){
				return true;//是iPhone 12 Pro Max 
	        }else{
				return false;//不是iphoneX
	        } 
	    }
	},
	iphonexBottom(){
		let height = '0rpx';
		if (this.isIPhoneX() === true){
			height = '20rpx';
		}
		return height;
	},
	//设置C端主题色
	setCStyle(from){
		if (from == 'channel'){
			return '';
		}
		let classArr = [];
		classArr.push('baseA');
		if (this.isIPhoneX() === true){
			classArr.push('iphonexClass');
		}
		return classArr;
	},
	//获取默认颜色
	getColor(_that){
		return _that.config.defaultColor;
	},
	//判断来源平台，暂只判断H5,app,微信小程序
	getPlatform(type){
		let platform = uni.getStorageSync("source_platform");
		if (platform == '' || type == true){
			platform = 'other';//默认其它
			// #ifdef H5
				platform = 'H5';
				let ua = window.navigator.userAgent.toLowerCase()
				if (ua.match(/MicroMessenger/i) == 'micromessenger') {
					platform = 'H5-WX';
				}
				if (uni.getStorageSync("source") == 'android'){
					platform = 'android';
				}else if (uni.getStorageSync("source") == 'ios'){
					platform = 'ios';
				}
			// #endif
			// #ifdef APP-PLUS
				switch(uni.getSystemInfoSync().platform){
					case 'android':
					  platform = 'android';
					   break;
					case 'ios':
					  platform = 'ios';
					   break;
				}
			// #endif
			// #ifdef MP-WEIXIN
				platform = 'MP-WEIXIN';
			// #endif
			uni.setStorageSync("source_platform",platform);
		}
		return platform;
	},
	//微信授权获取用户openid
	getWxOauthOpenId(_this,query){
		let platform = this.getPlatform();
		if (platform != 'H5-WX' && platform != 'MP-WEIXIN'){
			return;
		}
		let openId = this.getWxOpenId();
		if (openId != ''){
			return true;
		} 
		if (this.getAuthCode()){
			query.auto_login = 0;
		}
		let share_token = uni.getStorageSync("share_token");//获取邀请码
		if (platform == 'MP-WEIXIN'){
			uni.login({
				provider: 'weixin',
				success: function(loginRes) {
					_this.$u.post(`weixin/api.index/getOpenId?type=MP&code=${loginRes.code}&share_token=${share_token}&auto_login=${query.auto_login}`,{notLoginLimit:1})
					.then(res => {
						_this.app.setWxOpenId(res.data.openid);
						if (res.data.token){
							_this.app.setAuthCode(res.data.token,res.data.share_token);
						}
					});
				},
				fail: function(err) {
				}
			});
		}else{
			let setting = uni.getStorageSync("setting");
			if (setting.weixin_is_used != 1){
				return;//不使用公众号，不进行跳转
			}
			if (!query.code){
				const href = encodeURI(window.location.href);
				window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?
														appid=${setting.weixin_appid}&
														redirect_uri=${href}&
														response_type=code&
														scope=snsapi_userinfo&
														state=STATE#wechat_redirect`;
				return;
			}
			
			_this.$u.post(`weixin/api.index/getOpenId?type=H5-WX&code=${query.code}&share_token=${share_token}&auto_login=${query.auto_login}`,{notLoginLimit:1})
			.then(res => {
				_this.app.setWxOpenId(res.data.openid);
				if (res.data.token){
					_this.app.setAuthCode(res.data.token,res.data.share_token);
				}
			});
		}
	},
	// APP图片上传处理
	async appReadFileToBase64(path,callback){  
	        return new Promise((resolve,reject)=>{  
	            plus.io.resolveLocalFileSystemURL(path, function(entry) {  
	                entry.file(function(file) {  
	                    var AppReader = new plus.io.FileReader();  
	                    AppReader.onloadend = function(e) {  
	                        let base64 = e.target.result  
	                        //resolve(base64.split(",")[1])  
							callback(base64);
	                    };  
	                    AppReader.onerror = function(err) {  
	                        reject(err)  
	                    };  
	                    AppReader.readAsDataURL(file);    
	                }, function(e) {  
	                    reject(e)  
	
	                });  
	            });  
	
	        })  
	
	},
	// 小程序图片上传处理
	async wxmpReadFileToBase64(path,callback){
		wx.getFileSystemManager().readFile({
			filePath: path, //选择图片返回的相对路径
			encoding: 'base64', //编码格式
			success: res => {
				//成功的回调
				let base64 = 'data:image/'+path.substring(path.indexOf('.')+1).toLowerCase()+';base64,' + res.data;//拼接后返回
				callback(base64);
			}
		});
	},
	//复制
	copy(text){
		uni.setClipboardData({ data:text, success:function(data){
			uni.showToast({
			    title: '复制成功.',
			    duration: 2000,
			});
		}, fail:function(err){
			uni.showToast({
			    title: '复制失败，请重试.',
				icon:'none',
			    duration: 2000
			});
		}, complete:function(res){} })
	},
	textFormat(val) {
		// 格式化文字展示文本域格式文字
		if (val) {
			console.log(val)
			let newString = val.replace(/\n/g, '_@').replace(/\r/g, '_#');
			newString = newString.replace(/_#_@/g, '<br/>'); // IE7-8
			newString = newString.replace(/_@/g, '<br/>'); // IE9、FF、chrome
			newString = newString.replace(/\s/g, '&nbsp;'); // 空格处理
			return newString;
		}
	},
	async getImgInfo(src){
		return (await uni.getImageInfo({src}))[1];
	},
	circleImg(ctx, img, x, y, r) { //圆形头像
		ctx.save();
		ctx.beginPath();
		var d =2 * r;
		var cx = x + r;
		var cy = y + r;
		ctx.arc(cx, cy, r, 0, 2 * Math.PI);
		ctx.stroke();
		ctx.clip();
		ctx.drawImage(img, x, y, d, d);
		ctx.restore();
	},
	circleImgTwo(ctx, img, x, y, w, h, r, restore=false) {
		if(restore)ctx.save();
		// 画一个图形
		if (w < 2 * r) r = w / 2;
		if (h < 2 * r) r = h / 2;
		ctx.beginPath();
		ctx.moveTo(x + r, y);
		ctx.arcTo(x + w, y, x + w, y + h, r);
		ctx.arcTo(x + w, y + h, x, y + h, r);
		ctx.arcTo(x, y + h, x, y, r);
		ctx.arcTo(x, y, x + w, y, r);
		ctx.closePath();
		ctx.strokeStyle = 'rgba(0,0,0,0)'; // 设置绘制圆形边框的颜色
		ctx.stroke();
		ctx.clip();
	
		if (img != ''){
			ctx.drawImage(img, x, y, w, h);
		}
		if(restore)ctx.restore();
	},
	langReplace(str){ //语言替换
		if (config.moreLanguage != true){
			return str;
		}
		if (sysLang == 'zh-CN'){
			return str;
		}
		if (LangPackArr == ''){
			LangPackArr = uni.getStorageSync("sys_LangPackArr");
		}
		if (typeof(LangPackArr[str]) == 'undefined'){
			return str;
		}
		if (LangPackArr[str] == -1){
			return '';
		}
		return LangPackArr[str];
	}
}
