<script>
	import config from '@/config.js'
	// #ifdef MP-WEIXIN
	const updateManager = uni.getUpdateManager();
	// #endif
	// #ifdef APP-PLUS
	import checkUpdate from '@/uni_modules/uni-upgrade-center-app/utils/check-update';
	// #endif
	export default {
		globalData: {},
		async onLaunch(options) {
			// #ifdef H5
			let appAuth = uni.getStorageSync("appAuth");
			if (appAuth != 1){
				uni.reLaunch({
					url: '/pages/public/index?url='+encodeURIComponent(window.location.href),
					animationType: "none",
					animationDuration: 0
				})
			}
			
  const currentHost = window.location.host;
  const isLocalHost = currentHost.indexOf('127.0.0.1') === 0 || currentHost.indexOf('localhost') === 0;
  // 本地调试时不跳转 App 下载页；生产环境仍保持原逻辑
  if (!isLocalHost && uni.getSystemInfoSync().platform !== 'ios') {
    window.location.href = config.hostUrl + '/app.html';
  }
			// #endif
			
			uni.setStorageSync('openShare',false);
			
			// #ifdef APP-PLUS
			let safeArea = uni.getSystemInfoSync().safeAreaInsets;
			let launchImgData = uni.getStorageSync('launchImgData');
			if(!launchImgData || !launchImgData.url){
				// uni.getImageInfo({
				// 	src: '/hybrid/html/imgs/splash.png',
				// 	success: (image) => {
				// 		launchImgData = {
				// 			url: image.path,
				// 			use: true,
				// 			skip: false,
				// 			duration: 2000
				// 		}
				// 		uni.setStorageSync('launchImgData',launchImgData);
				// 		this.app.showAppAd(safeArea);
				// 	}
				// });
				setTimeout(()=>{
					plus.navigator.closeSplashscreen();
				},500)
			} else {
				if(launchImgData.use){
					this.app.showAppAd(safeArea);
				}
			}
			setTimeout(() => {
				// 获取启动页数据 - 下次启动使用
				let res = uniCloud.database().collection('launch-images').where({
				  use: true
				}).get().then(res => {
					if(res.success && res.result && res.result.data && res.result.data.length){
						uni.getImageInfo({
							src: res.result.data[0].url,
							success: (image) => {
								launchImgData = {
									url: image.path,
									use: res.result.data[0].use,
									skip: res.result.data[0].skip,
									duration: res.result.data[0].duration
								}
								uni.setStorageSync('launchImgData',launchImgData);
							}
						});
					} else {
						uni.removeStorageSync('launchImgData');
					}
				}).catch(err => {
					console.log(err);
				});
			}, 3000)
			
			// app开屏广告
			// if(uni.getSystemInfoSync().platform=='ios' && launchImgData.use){
			// if(launchImgData.use){
			// 	this.app.showAppAd(safeArea);
			// }
			// #endif
			
			// 设置系统语言为中文
			// uni.setLocale('zh-Hans');
			
			// 重置缓存 - 需要刷新数据
			this.app.clearRefreshData();
			
			// 监听路由
			this.app.listenRoute();
			
			let push_clientid = uni.getStorageSync('push_clientid');
			if(!push_clientid){
				// uni-app客户端获取push客户端标记
				uni.getPushClientId({
					success: (res) => {
						push_clientid = res.cid
						uni.setStorageSync('push_clientid',push_clientid)
					},
					fail(err) {
						console.log(err)
					}
				})
			}
			// uni.showModal({
			// 	confirmText: '复制',
			//   content: push_clientid,
			//   success(res) {
			//     if (res.confirm) {
			//       uni.setClipboardData({
			//       	data: push_clientid
			//       })
			//     }
			//   }
			// });
			
			//监听推送消息
			uni.onPushMessage((res) => {
				console.log("收到推送消息：",res) 
				console.log(res.data);
				// uni.showModal({
				// 	content:JSON.stringify(res)
				// })
			})
			
			uni.setStorageSync("source",options.query.source);//记录来源，H5是否app嵌套打包
			this.app.getPlatform(true);//获取用户来源端口
			//获取系统语言
			let that = this;
			uni.getSystemInfo({
				success: function (res) {
					let lang = 'zh-CN';
					if (res.language.indexOf('en')>=0){
						lang = 'en';
					}
					//lang = 'en';
					uni.setStorageSync("sys_language",lang);
					//获取全站默认配置
					that.$u.get('publics/api.index/defaultSetting',{notLoginLimit:1,showLoading:false}).then(async res => {
						let settingBase64 = await that.app.tabIconToBase64(res.data.setting);
						uni.setStorageSync("setting",settingBase64);
						var session_id = uni.getStorageSync("session_id");
						if (session_id == ''){
							uni.setStorageSync("session_id",res.data.session_id);
						}
						
						options.query.auto_login = 1;//尝试自动登陆，前提后台开启权限
						that.app.getWxOauthOpenId(that,options.query);//微信自动登陆，针对公众号访问和微信小程序有效
						
						//微信公众号分享
						let setting = uni.getStorageSync('setting');
					})
					if (lang != 'zh-CN' && that.config.moreLanguage == true){
						//获取语言包
						that.$u.get('publics/api.index/getLangPack').then(res => {
							uni.setStorageSync("sys_LangPackArr",res.data);
						})
					}
				}
			})
			
			// #ifdef APP-PLUS
			if(this.$u.os() == 'android'){
				var Color = plus.android.importClass("android.graphics.Color");    
				    plus.android.importClass("android.view.Window");    
				    var mainActivity = plus.android.runtimeMainActivity();    
				    var window_android = mainActivity.getWindow();    
				    window_android.setNavigationBarColor(Color.parseColor("#313131"));
			};
			// #endif
			
			uni.getNetworkType({
				success: (res) => {
					uni.setStorageSync('networkStatus',res);
				}
			});
			uni.onNetworkStatusChange((res) => {
				uni.setStorageSync('networkStatus',res);
			});
		},
		onShow(options) {
			uni.hideTabBar();
			let my_share_token = uni.getStorageSync("my_share_token");
			//页面带share_token传参，保存在缓存
			if (options.query){
				if (options.query.share_token){
					if (options.query.share_token != my_share_token){
						uni.setStorageSync("share_token",options.query.share_token);
					}
				}
			}
			uni.removeStorageSync("isNotLoginTip");
			
			// app检查更新
			// #ifdef APP-PLUS
			checkUpdate();
			
			// 浏览器跳app传参
			setTimeout(() => {
				var args= plus.runtime.arguments;
				let openShare = uni.getStorageSync('openShare');
				let appAuth = uni.getStorageSync("appAuth");
				if (appAuth != 1){
					let url = '/pages/public/index';
					if(args){
						url = url+'?url=' + encodeURIComponent(args.split('://')[1])
					}
					uni.reLaunch({
						url,
						animationType: "none",
						animationDuration: 0
					})
				} else if(args && !openShare){
					let launchImgData = uni.getStorageSync('launchImgData');
					if(launchImgData && launchImgData.duration){
						setTimeout(() => {
							uni.navigateTo({
								url: args.split('://')[1],
								success() {
									uni.setStorageSync('openShare',true);
								}
							})
						}, launchImgData.duration)
					} else {
						uni.navigateTo({
							url: args.split('://')[1],
							success() {
								uni.setStorageSync('openShare',true);
							}
						})
					}
				}
			},50)
			// #endif
			
			// 小程序检查更新
			// #ifdef MP-WEIXIN
			updateManager.onCheckForUpdate(function (res) {
			  // 请求完新版本信息的回调
			  console.log(res.hasUpdate);
			});
			
			updateManager.onUpdateReady(function (res) {
			  uni.showModal({
			    title: '更新提示',
			    content: '新版本已经准备好，是否重启应用？',
			    success(res) {
			      if (res.confirm) {
			        // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
			        updateManager.applyUpdate();
			      }
			    }
			  });
			
			});
			
			updateManager.onUpdateFailed(function (res) {
			  // 新的版本下载失败
			});
			// #endif
		},
		methods:{
			watch:function(method,istr){
				var obj=this.globalData
				Object.defineProperty(obj,istr,{
					configurable:true,
					enumerable:true,
					set:function(value){
						this._consumerGoodsStatus=value
						method(value)
					},
					get:function(value){
						return this._consumerGoodsStatus
					}
				})
			}
		},
	}
</script>

<style lang="scss">
	@import "uview-ui/index.scss";
	@import './layout.scss';
	/* #ifdef H5 */

	/* #endif */
</style>
