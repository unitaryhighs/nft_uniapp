<template>
	<view v-if="shows">
		<view class="zhezhao"  @tap="close()"></view>
		<view class="verifyBox" @touchend="onEnd"  @mouseup="onEnd">
			<view class="pintuBox">
				<image :src="'https://images.ccsnfr.cn/a_static/tfgg-verify/'+img+'.jpg'" class="pintuBg"></image>
			</view>
			<view class="huakuaiBox">
				<view class="yinying" :style="{top:top+'px',left:left+'px'}"></view>
				<movable-area :animation="true">
					<movable-view :x="x" direction="horizontal" @change="onMove">
						<view class="pintukuai" :style="{top:top+'px'}"><image :src="'https://images.ccsnfr.cn/a_static/tfgg-verify/'+img+'.jpg'" :style="{top:-lefttop+'px',left:-left+'px'}"></image></view>
					</movable-view>
				</movable-area>
				<view class="huadao">拖动左边滑块完成上方拼图</view>
			</view>
		</view>
	</view>
</template>

<script>
import md5Libs from "uview-ui/libs/function/md5";
export default {
	name: 'tfgg-verify',
	data() {
		return {
			baseUrl: this.config.baseUrl,
			x: 0,//初始距离
			oldx:0,//移动的距离
			img:'0',//显示哪张图片
			left:'',//随机拼图的最终X轴距离
			top:'',//拼图的top距离
			lefttop:'',//拼图内容的top距离
			shows:false,
			rand_str:''
		};
	},
	mounted() {
		this.shuaxinVerify()
	},
	methods: {
		//刷新验证
		shuaxinVerify(){
			var gl = Math.random();
			this.img = Math.floor(Math.random()*5+1);
			this.$u.get('publics/api.index/ncGet').then(res => {
				this.rand_str = res.data.rand_str;
				if (res.data.gl){
					gl = res.data.gl;
				}
				this.left = uni.upx2px(500)*gl>uni.upx2px(250)?(uni.upx2px(500)*gl):uni.upx2px(250)-gl;//生成随机X轴最终距离
				this.top = -(uni.upx2px(25)+uni.upx2px(343)-(uni.upx2px(263)*gl));//生成随机Y轴初始距离
				this.lefttop = uni.upx2px(263)*gl;//生成随机Y轴初始距离
			})
		},
		/* 滑动中 */
		onMove(e) {
			this.oldx = e.detail.x;
		},
		/* 滑动结束 */
		onEnd() {
			if(Math.abs(this.oldx-this.left)<=5){
				let postData = {};
				postData.rand_str = this.rand_str;
				postData.ciphertext = md5Libs.md5(this.rand_str+uni.getStorageSync("session_id")+this.left);
				postData.left = this.left;
				postData.upx2px = uni.upx2px(500);
				this.$u.get('publics/api.index/ncCheck',postData).then(res => {
					uni.showToast({
						title: '验证成功'
					});
					let data = {};
					data.nc_val = res.data.nc_val;
					this.$emit("result",data);
					this.hide();
				}).catch(res=>{
					this.$u.toast(res.msg);
					this.shuaxinVerify();
					this.reset();
				})
			}else{
				let rand = Math.floor(Math.random()*5+1);
				if (rand <= 2){
					this.shuaxinVerify()
				}
				this.reset();
			}
		},
		/* 重置 */
		reset(){
			console.log('重置');
			this.x = 1;
			this.oldx = 1;
			setTimeout(()=>{
				this.x = 0;
				this.oldx = 0;
			},300)
		},
		show(){
			this.shows=true;
		},
		hide(){
			this.shows=false;
		},
		close(){
			this.shows=false
			this.app.goPage(-1);
		}
	}
}
</script>

<style>
.zhezhao{
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0,0,0,.5);
	z-index: 8;
}
.verifyBox{
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%,-50%);
	width: 85%;
	background-color: #fff;
	border-radius: 20upx;
	box-shadow: 0 0 5upx rgba(0,0,0);
	z-index: 9;
}
.pintuBox{
	position: relative;
}
.pintuBg{
	width: 610upx;
	height: 343upx;
	display: block;
	margin: 17upx auto;
}
.huakuaiBox{
	position: relative;
	height: 80upx;
	width: 610upx;
	margin: 25upx auto;
}
.yinying{
	position: absolute;
	width: 80upx;
	height: 80upx;
	background-color: rgba(0,0,0,.7);
	border: 1rpx #ffffff solid;
}
.huakuaiBox movable-area{
	height: 80upx;
	width: 100%;
}
.huakuaiBox movable-area movable-view{
	width: 80upx;
	height: 80upx;
	border-radius: 50%;
	background-color: #007cff;
	background-image: url('@/static/tfgg-verify/icon-button-normal.png');
	background-repeat: no-repeat;
	background-size: auto 30upx;
	background-position: center;
	position: relative;
	z-index: 100;
}
.pintukuai{
	position: absolute;
	top: -105upx;
	left: 0;
	width: 100%;
	height: 100%;
	z-index: 101;
	box-shadow: 0 0 5upx rgba(0,0,0,.3);
	overflow: hidden;
}
.pintukuai image{
	max-width: none;
	position: absolute;
	top: 0;
	left: 0;
	width: 610upx;
	height: 343upx;
}
.huadao{
	position: absolute;
	width: calc(100% - 35upx);
	height: 65upx;
	line-height: 65upx;
	background: #eee;
	box-shadow: inset 0 0 5upx #ccc;
	border-radius: 60upx;
	color: #999;
	text-align: center;
	top: 50%;
	right: 0;
	transform: translateY(-50%);
	font-size: 18upx;
	padding-right: 35upx;
	z-index: 99;
}
</style>