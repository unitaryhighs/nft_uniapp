'use strict';
const uniPush = uniCloud.getPushManager({appId:"__UNI__79013E1"}) //注意这里需要传入你的应用appId
exports.main = async (event, context) => {
	let e = event.queryStringParameters;
	return await uniPush.sendMessage({
		"push_clientid": e.push_clientid || '', 	//填写上一步在uni-app客户端获取到的客户端推送标识push_clientid
		"title": e.title || '',	
		"content": e.content || '',
		"force_notification": true, //始终显示通知消息
		"payload": {
			"content": e.content || ''
		}
	})
};