<template>
	<view class="top_box">
		<block v-if="model_detail_list && model_detail_list.other">
			<view class="bg-box" v-if="model_detail_list.images">
				<image :src="model_detail_list.images[0].url" mode="aspectFill" class="bg"></image>
			</view>
			<image v-else src="/static/images/light.png" mode="widthFix" style="position: absolute;left: 0;top: 0;width: 100%;"></image>
			<!-- #ifdef APP-PLUS -->
			<view class="td-pic" style="height: 860rpx;">
			<!-- #endif -->
			<!-- #ifndef APP-PLUS -->
			<view class="td-pic" style="height: 820rpx;">
			<!-- #endif -->
				<view class="cover" style="width: 100%;height: 100%;position: absolute;z-index: 1;"></view>
				<model ref="model" :scale="0.017" :speed="0.5" :url="model_detail_list.other[0].url"></model>
			</view>
			<view class="img_bp relative model">
				<view class="preview-3d" @click="app.goPage(model_detail_list.images?
				`/pages/nft/goods/previewModel?model=${model_detail_list.other[0].url}&image=${model_detail_list.images[0].url}` :
				`/pages/nft/goods/previewModel?model=${model_detail_list.other[0].url}`
				)">
					3D预览
					<view class="arrow-right"></view>
				</view>
			
				<image v-if="!model_detail_list.images" :src="'/static/images/zst.png'" mode=""></image>
			</view>
			<view style="height: 20rpx;"></view>
		</block>
		<block v-else>
			<block v-if="show3d==1">
				<image src="/static/images/light.png" mode="widthFix" style="position: absolute;left: 0;top: 0;width: 100%;"></image>
				<!-- #ifdef APP-PLUS -->
				<view class="td-pic" style="height: 860rpx;">
				<!-- #endif -->
				<!-- #ifndef APP-PLUS -->
				<view class="td-pic" style="height: 820rpx;">
				<!-- #endif -->
					<view class="cover" style="width: 100%;height: 100%;position: absolute;z-index: 1;"></view>
					<!-- <three3d :frontImg="square_pic" :backImg="baseImgUrl+'/a_static/menuimg/logo_bg.png'"></three3d> -->
					<model ref="model" :scale="0.0065" :frontImg="square_pic" backImg="/static/images/logo_bg.png"
					:url="'https://images.ccsnfr.cn/launch_image/photo_model.fbx'" 
					:dirLight="[{
								color: 'ffffff',
								positionx: 200,
								positiony: 200,
								positionz: 100,
								intensity: 0.4
							},{
								color: 'ffffff',
								positionx: -200,
								positiony: -100,
								positionz: -100,
								intensity: 0.4
							}]"
					></model>
				</view>
				<view class="img_bp relative">
					<view class="big_pic" >
						<!-- #ifdef H5 -->
						<viewer :options="options" ref="viewer" :images="[pic]" @inited="inited">
							  <img :src="pic" class="place">
							  <!-- <u-icon name="photo" color="#FFF" size="50"></u-icon> -->
							  <view class="place" style="z-index: 0;opacity: 1;width: 80rpx;height: 80rpx;background: url('/static/images/preview.png') center;background-size: cover;"></view>
						</viewer>
						<!-- #endif -->
						<!-- #ifndef H5 -->
						<!-- <u-icon name="photo" color="#FFF" size="50" @click="app.showImg(pic)"></u-icon> -->
						<!-- <image @click="app.showImg(pic)" src="/static/images/preview.png" mode="aspectFill" style="width: 80rpx;height: 80rpx;"></image> -->
						<view @click="app.showImg(pic)" class="place" style="z-index: 0;opacity: 1;width: 80rpx;height: 80rpx;background: url('/static/images/preview.png') center;background-size: cover;"></view>
						<!-- #endif -->
					</view>
				
					<image :src="'/static/images/zst.png'" mode=""></image>
				</view>
				<!-- <view class="flex good-info" style="justify-content: center;">
					<view class="decorate_img">
						<image src="@/static/images/tit_rl.png" mode=""></image>
					</view>
					<view class="ml30 mr30">
						<view class="fs40 color-ff text-center ellipsis-1 good-name" style="margin-top: -30rpx;">{{nft_name}}</view>
						<view class="flex text-center mt20 fs24" style="justify-content: center;">
							<view class="amount_top color-00">限量</view>
							<view class="count_top">{{limit_sale_num>0?limit_sale_num:nums}}份</view>
						</view>
					</view>
					<view class="decorate_img" style="transform: rotateY(180deg);">
						<image src="@/static/images/tit_rl.png" mode=""></image>
					</view>
				</view> -->
			</block>
			<view v-else class="img">
				<view class="card">
					<!-- #ifdef H5 -->
					<image :src="big_pic" mode="widthFix"></image>
					<view style="position: absolute;width: 100%;top: 0;z-index: 1;opacity: 0;">
						<viewer :options="options" ref="viewer" :images="[big_pic]" @inited="inited">
							<img class="view-img" :src="big_pic"></img>
						</viewer>
					</view>
					<!-- #endif -->
					<!-- #ifndef H5 -->
					<image :src="big_pic" mode="widthFix" @click="app.showImg(big_pic)"></image>
					<!-- #endif -->
				</view>
			</view>
		</block>
	</view>
</template>

<script>
	// #ifdef H5
	import 'viewerjs/dist/viewer.css'
	import {component as Viewer} from 'v-viewer'
	// #endif
	// import three3d from '@/components/three3d';
	export default {
		name:"goods-info",
		components: {
			// "three3d": three3d,
			// previewImage,
			// #ifdef H5
			Viewer
			// #endif
		},
		props: {
			// 类型 是否3d图片模式
			show3d: {
				type: [String, Number],
				default: 0
			},
			// 3d正面图
			square_pic: {
				type: String,
				default: ''
			},
			// 3d图模式清晰图
			pic: {
				type: String,
				default: ''
			},
			nft_name: {
				type: String,
				default: ''
			},
			// limit_sale_num: {
			// 	type: [String, Number],
			// 	default: 0
			// },
			// nums: {
			// 	type: [String, Number],
			// 	default: 0
			// },
			
			// 缩略图
			// pic_thumb: {
			// 	type: String,
			// 	default: ''
			// },
			// 大图模式清晰图
			big_pic: {
				type: String,
				default: ''
			},
			model_detail_list: {
				type: [Array,Object],
				default: ()=>{}
			}
		},
		data() {
			return {
				baseImgUrl: this.config.baseImgUrl,
				// nft_bottom_bg: this.config.baseImgUrl + uni.getStorageSync('setting').nft_bottom_bg,
				options: {
					'inline': false, // 是否启用inline模式
					'navbar': false, // 是否显示缩略图底部导航栏
					'title': false, // 是否显示当前图片标题，默认显示alt属性内容和尺寸
					'toolbar': false, // 是否显示工具栏
				},
			};
		},
		methods: {
			// #ifdef H5
			//初始化预览组件
			inited(viewer) {
				this.$viewer = viewer;
			},
			// #endif
		},
	}
</script>

<style lang="scss" scoped>
	.top_box{
		position: relative;
		// height: 638rpx;
		// position: absolute;
		// left: 0;
		// right: 0;
		// top: 0;
		// z-index: 1;
		
		// position: relative;
		// z-index: 1;
		// background: url('@/static/images/light.png');
		// background-size: 100%;
		// background-repeat: no-repeat;
		// box-sizing: content-box;
		.bg-box {
			position: absolute;
			left: 0;
			right: 0;
			top: 0;
			bottom: 0;
			z-index: 0;
			width: 100%;
			height: 100%;
			
			&::after {
				content: '';
				position: absolute;
				left: 0;
				right: 0;
				top: 0;
				bottom: 0;
				// background: linear-gradient(to bottom,rgba(23,23,23,0),rgba(23,23,23,1));
				background: linear-gradient(to bottom, rgba(23,23,23,0) 80%, rgba(23,23,23,1) 100%);
				// backdrop-filter: blur(4px);
			}
			.bg {
				width: 100%;
				height: 100%;
			}
		}
		
		.td-pic {
			position: relative;
			z-index: 98;
			width: 100%;
			height: 600rpx;
			box-sizing: content-box;
		}
		
		.good-info {
			.good-name {
				max-width: 400rpx;
			}
		}
		
		.big_pic{
			position: absolute;
			width: 100%;
			top: -50rpx;
			text-align: center;
			z-index: 98;
			
			.place {
				width: 80rpx;
				height: 80rpx;
				position: absolute;
				left: 50%;
				top: 50%;
				transform: translate(-50%,-50%);
				z-index: 1;
				opacity: 0;
			}
		}
		
		.decorate_img{
			width: 62rpx;
			height: 106rpx;flex-shrink: 0;
			image{
				width: 100%;
				height: 100%;
			}
		}
		
		.top_title {
			height: 90rpx;
			color: #FFFFFF;
		}
		.back-btn{
			position: absolute;
			left: 20rpx;
			top: 28rpx;
		}
		.img{
			margin: 0 auto;
			position: relative;
			border-radius: 20rpx;
			width: 100%;
			height: 100%;
			image{
				width: 100%;
				height: 100%;
			}
		}
		
		.img_bp{
			width: 582rpx;
			height: 168rpx;
			margin: 0 auto;
			// margin-top: 100rpx;
			
			// &.model {
			// 	margin-top: 80rpx;
			// }
			image{
				width: 100%;
				height: 100%;
			}
		}
		
		.amount_top{
			width: 76rpx;
			height: 40rpx;
			background: $btn-two-purplered;
			border-radius: 4rpx;
			line-height: 40rpx;
		}
		.count_top{
			width: 125rpx;
			height: 40rpx;
			border: 1rpx solid $border-color-base;
			line-height: 40rpx;
			margin-left: -6rpx;
			border-left: none;
			color: rgba(229, 193, 127, 1);
			border-top-right-radius: 4rpx;
			border-bottom-right-radius: 4rpx;
		}
		
		.card {
			margin: 0 auto;
			width: 100%;
			position: relative;
			
			.view-img {
				width: 100%;
			}
		}
	}
	.preview-3d {
		width: 467rpx;
		height: 64rpx;
		background-image: url('/static/images/preview3d-bg.png');
		background-size: cover;
		margin: 0 auto;
		position: absolute;
		z-index: 9;
		left: 50%;
		bottom: -46rpx;
		transform: translateX(-50%);
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 28rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #FFFFFF;
		line-height: 44rpx;
		
		.arrow-right {
			margin-left: 14rpx;
			width: 0;
			height: 0;
			border: 10rpx solid rgba(0, 0, 0, 0);
			border-left-color: #00FECB;
		}
	}
</style>