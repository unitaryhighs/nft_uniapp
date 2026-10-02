let hostname = '';
let _hostUrl = '';

// #ifdef H5
// H5 默认使用当前站点作为接口地址
hostname = window.location.host
// #endif

if (hostname != '') {
  // 根据当前页面协议生成接口域名
  if (window.location.href.indexOf('https') >= 0) {
    _hostUrl = 'https://' + hostname
  } else {
    _hostUrl = 'http://' + hostname
  }
}

// #ifdef H5
// H5 默认请求当前站点；本地后端示例为 http://127.0.0.1:8000
var _baseUrl = _hostUrl || 'http://127.0.0.1:8000';
// #endif
// #ifndef H5
// App/小程序等非 H5 端默认请求本机后端；真机调试时需改成电脑局域网 IP 或线上 HTTPS 域名
var _baseUrl = 'http://127.0.0.1:8000';
// #endif

export default {
  defaultIndex: '/pages/nft/index/index', // 默认首页
  baseUrl: _baseUrl, // API 地址
  hostUrl: _hostUrl,
  baseImgUrl: '', // 图片网络地址
  upImageUrl: _baseUrl + '/index.php/publics/api.index/upImage', // 公共上传图片地址
  removeImageUrl: _baseUrl + '/index.php/publics/api.index/removeImage', // 删除公共上传图片地址
  moreLanguage: true, // 是否多语言
  wxmpProvider: '', // 微信小程序直播组件 appid
  refreshTime: 10, // 刷新时间/分钟
  forceRefresh: true, // 切换页面时刷新数据
  tabRefresh: true, // 切换 tab 栏时刷新数据
}
