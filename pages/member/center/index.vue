<template>
	<view class="page-body u-skeleton" :class="[app.setCStyle()]">
		<!-- #ifndef H5 -->
		<!-- <ji-nav-bar ref="navBar" backState="2000" type="transparentFixed" bgColor="#2d2d2d" :withPadding="false">
			<view class="preview" slot="default" style="color: #fff">我的</view>
		</ji-nav-bar> -->
		<!-- <view class="window-top pt40"></view> -->
		<view class="top-sec">
		<view :style="{height: statusBarHeight+'rpx'}"></view>
		<!-- #endif -->
		<!-- #ifdef H5 -->
		<view class="top-sec">
		<!-- #endif -->
		<!-- <scroll-view style="height: calc(100% - 110rpx)" scroll-y @scrolltolower="loadData" @scroll="onViewScroll"> -->
			<view class="top_title pt30">
				<!-- <view class="fs34 text-center p20">{{app.langReplace('个人中心')}}</view> -->
				<view class="fs34 pt20 pb20 plr30">
					<view class="smll text-center">
						<view class="mr30 relative u-skeleton-fillet" @click="show=true">
							<u-icon name="list" color="#FFFFFF" size="45"></u-icon>
						</view>
						<view class="mr30 relative fll u-skeleton-fillet" @click="showKefu=true">
							<u-icon name="kefu-ermai" color="#FFFFFF" size="45"></u-icon>
						</view>
						<view class="mr30 relative u-skeleton-fillet" @click="app.goPage('/pages/public/message/index')">
							<u-icon name="more-circle" color="#FFFFFF" size="45"></u-icon>
							<view v-if="unReadMsgNum > 0" class="tip-msg-dian"></view>
						</view>
						<!-- <view class="mr30 relative" @click="app.goPage('/pages/member/center/myCode')"> -->
						<view class="relative u-skeleton-fillet" @click="showShareImg">
							<u-icon name="zhuanfa" color="#FFFFFF" size="45"></u-icon>
						</view>
					</view>
				</view>
			</view>
			<view class="top-info">
				<view class="mt10 flex fh pb30">
					<!-- <image :src="headimgurl?headimgurl:'/static/images/headimgurl.jpg'" class="mine_bg" mode=""></image> -->
					<view class="head_bg" :style="'--bg:'+ 'linear-gradient(0, rgba(0, 0, 0, 1) 0%, rgba(33, 31, 32, 0) 100%),' + 'url(' + headimgurl + ')' "></view>
					<!-- <view class="head" @click="app.goPage('/pages/member/center/editInfo')"> -->
						<image class="head u-skeleton-circle" @click="app.goPage('/pages/member/center/editInfo')" :src="headimgurl?headimgurl:'/static/images/headimgurl.jpg'"></image>
					<!-- </view> -->
					<view v-if="loading">
						<view class="ml30">
							<view class="fs32 color-ff ellipsis u-skeleton-fillet"></view>
							<view class="color-cc fs2 mt10 u-skeleton-fillet">手机号码：133****3333</view>
							<view class="color-cc fs24 mt10 flex u-skeleton-fillet" style="line-height: 40rpx;">
								<view>区块链地址：11111111111111111111</view>
							</view>
						</view>
					</view>
					<view class="ml30 u-flex-1 ellipsis-1" v-if="userInfo.user_id > 0" style="padding-right: 50rpx;">
						<view class="fs32 color-ff ellipsis">{{userInfo.nick_name}}
							<view v-if="setting.user_center_show_role == 1" class="role_name fs20 ml20 hide">
								{{userInfo.role_name}}
							</view>
						</view>
						<view class="color-cc fs2 mt10">{{app.langReplace('手机号码')}}：{{userInfo.mobile}}</view>
						<view class="color-cc  fs24 hide">
							{{app.langReplace('我的ID')}}：{{userInfo.user_id}}，{{app.langReplace('我的邀请码')}}：{{userInfo.token}}
						</view>
						<view class="color-cc fs24 mt10 flex" style="line-height: 40rpx;">
							<view>区块链地址：</view>
							<block v-if="userInfo.chain_address">
								<view class="text_hidden" style=""> {{userInfo.chain_address}}</view>
								<u-icon name="/static/images/copy.png" size="30" @click="app.copy(userInfo.chain_address)"></u-icon>
							</block>
							<block v-else>
								<text v-if="userInfo.check_id_card == 0"
									@click="app.goPage('checkIdCard')">末实名，点击认证</text>
								<text v-else>区块链地址生成中...</text>
							</block>
						</view>
					</view>
					<view v-else class="plr10 color-ff">
						<view @click="app.goPage('/pages/member/passport/login')">{{app.langReplace('登陆/注册')}}</view>
					</view>
				</view>
			</view>
			<!-- 	<view class="flex text-center list_box mt20">
			<view class="" style="flex: auto;"  @click="app.goPage('/pages/member/center/collect')">
				<view class="color-ff fs32">{{collectionTotal}}</view>
				<view style="color: #BEBEC5;" class="mt20">关注作品</view>
			</view>
			<view class="" style="flex: auto;" @click="app.goPage('/pages/member/center/follow')">
				<view class="color-ff fs32">0</view>
				<view class="" style="color: #BEBEC5;" class="mt20">关注的人</view>
			</view>
			<view class="" style="flex: auto;"  @click="app.goPage('/pages/member/fans/index')">
				<view class="color-ff fs32">{{fansTotal}}</view>
				<view class="" style="color: #BEBEC5;" class="mt20">我的粉丝</view>
			</view>
			<view class="" style="flex: auto;" @click="app.goPage('/pages/member/wallet/index')">
				<view class="color-ff fs32">￥{{account.balance_money}}</view>
				<view   style="color: #BEBEC5;" class="mt20">我的钱包</view>
			</view>
		</view> -->
			<view class="flex nav-bar">
				<view class="nav-bar-item">
					<view class="color-99 fs28 flex list_btn u-skeleton-fillet">
						<u-icon name="/static/images/my_icon1.png" size="46" class="mr10"></u-icon>
						<text class="fs30 color-cc">订单</text>
					</view>
					<view class="cover" @click="app.goPage('/pages/nft/order/list')"></view>
				</view>
				<view class="nav-bar-item">
					<view class="color-99 fs28 flex list_btn u-skeleton-fillet">
						<u-icon name="/static/images/my_icon2.png" size="46" class="mr10"></u-icon>
						<text class="fs30 color-cc">盲盒</text>
					</view>
					<view class="cover" @click="app.goPage('/pages/nft/blind_box/my')"></view>
				</view>
				<view class="nav-bar-item">
					<view class="color-99 fs28 flex list_btn u-skeleton-fillet">
						<u-icon name="/static/images/my_icon3.png" size="46" class="mr10"></u-icon>
						<text class="fs30 color-cc">钱包</text>
					</view>
					<view class="cover" @click="getPayWay"></view>
				</view>
			</view>
		</view>
		<view class="sh">
			<view class="top_navbar" :style="{marginTop: (0-statusBarHeight)+'rpx'}">
				<!-- <view :style="{height: statusBarHeight+'rpx'}"></view> -->
				<view :style="{height: (100+statusBarHeight)+'rpx'}"></view>
				<view class="navbar" :style="{
					borderTopLeftRadius: borderRadius+'rpx',
					borderTopRightRadius: borderRadius+'rpx',
					paddingTop: scrollPaddingTop+'rpx'
				}">
				<!-- <view class="navbar" :style="{
					paddingTop: scrollPaddingTop+'rpx'
				}"> -->
					<view class="nav-item u-relative" v-for="(item, index) in navList" :key="index" :class="{current: tabCurrentIndex === index}" @click="topTabClick(index)">
						{{item.text}}
						<view v-if="loading" class="u-skeleton-fillet" style="width: 140rpx;height: 60rpx;position: absolute;left: 50%;top: 50%;transform: translate(-50%,-50%);"></view>
					</view>
				</view>
			</view>
			<view class="content">
			<!-- <view v-if="navbarFixed" class="bg-base" style="height: 160rpx;"></view> -->
				<view v-if="navList[tabCurrentIndex].type == 'have'" style="padding: 30rpx 30rpx 10rpx;">
					<u-search class="u-skeleton-fillet" :placeholder="app.langReplace('搜索藏品')" border-color="#313338" bg-color="#3A3A3B" color="#fff" shape="round" input-align="left" :show-action="false" v-model="keyword" @search="search()"></u-search>
				</view>
				<!-- <view v-if="navList[tabCurrentIndex].type == 'have' && navbarFixed" class="bg-base" style="height: 90rpx;"></view> -->
				<view v-if="loading" class="flex" style="justify-content: space-between;flex-wrap: wrap;padding: 0rpx 32rpx;">
					<view class="color-ff list mt20 box-bg-base relative" v-for="(item,index) in 6" :key="index">
						<view class="img_b u-skeleton-fillet">
							<u-image height="100%" border-radius="24" :fade="false" :lazy-load="true" mode="aspectFill">
								<u-loading size="50" mode="flower" slot="loading"></u-loading>
							</u-image>
						</view>
						<view class="p20">
							<view class="fs28 ellipsis u-skeleton-fillet">qqqqqqqqq</view>
							<view class="flex fh mt10">
								<view class="head_b u-skeleton-circle" style="width: 40rpx;height: 40rpx;"></view>
								<view class="ml20 fs26 color-99 ellipsis u-skeleton-fillet">qqqqqqqq</view>
							</view>
						</view>
					</view>
				</view>
				
				<view class="relative" style="padding: 0rpx 30rpx;">
					<!-- 空白页 -->
					<empty v-if="navList[tabCurrentIndex].list.length === 0" :style="{paddingTop: navList[tabCurrentIndex].type != 'have'?'104rpx':'0'}" style="box-sizing: content-box;"></empty>
			
					<block v-else>
						<view class=" flex" style="justify-content: space-between;flex-wrap: wrap;padding-top: 0rpx;">
							<block v-if="navList[tabCurrentIndex].type == 'saleOut'">
								<view class="listb mt20 box-bg-base tap ellipsis-1" hover-class="hover" hover-start-time="0" hover-stay-time="100" 
								v-for="(item,index) in navList[tabCurrentIndex].list" :key="index" @click="app.goPage('/pages/nft/collection/info?id='+item.sub_id);">
									<view class="flex">
										<view class="img">
											<!-- <image :src="item.square_pic?baseImgUrl+item.square_pic:baseImgUrl+item.pic_thumb"
												mode="aspectFill"></image> -->
											<u-image height="100%" border-radius="24" :fade="false" :lazy-load="true" :src="item.square_pic?baseImgUrl+item.square_pic:baseImgUrl+item.pic_thumb" mode="aspectFill">
												<u-loading size="50" mode="flower" slot="loading"></u-loading>
											</u-image>
										</view>
										<view class="ml20 flex_bd ellipsis-1">
											<view class="color-ff fs28 ellipsis-1 flex">
												<text class="ellipsis-1">{{item.nft_name}}</text>
												<text>#{{item.token_id}}</text>
												<view class="success flex_bd text-right" style="color: #E4BD8E;margin: 0 6rpx;">交易成功</view>
												<u-icon name="arrow-right" color="#fff" size="28"></u-icon>
											</view>
											<view class="flex fh mt20">
												<image class="head" :src="baseImgUrl+item.creator_headimgurl" mode=""></image>
												<view class="fs26 color-99 ml10 ellipsis">{{item.creator_name}}</view>
											</view>
											<view class="flex color-99 fs20 flex fh mt20" style="line-height: 20rpx;">
												<view class="flex_bd">{{item.add_time}}</view>
												<view class="color-ff fs32 mr30"><text class="fs28" style="margin-right: 6rpx;">¥</text>{{item.sale_price}}</view>
											</view>
										</view>
									</view>
									<!-- <view class="color-cc fs20 flex mt20">
										<view style="margin-left: 170rpx;">{{item.add_time}}</view> -->
										<!-- <view class="flex_bd text-right">#{{item.token_id}}</view> -->
										<!-- <view class="success flex_bd text-right" style="color: #E4BD8E">交易成功</view> -->
									<!-- </view> -->
								</view>
							</block>
							<block v-else-if="navList[tabCurrentIndex].type == 'sale'">
								<view class="listb mt20 box-bg-base tap ellipsis-1" hover-class="hover" hover-start-time="0" hover-stay-time="100" 
								v-for="(item,index) in navList[tabCurrentIndex].list" :key="index" @click="app.goPage('/pages/nft/collection/info?id='+item.sub_id);">
									<!-- <view class="color-cc fs20 flex">
										<view>寄售时间：{{item.put_sale_time}}</view>
										<view class="flex_bd text-right">寄售价格：{{item.put_sale_price}}</view>
									</view> -->
									<view class="flex">
										<view class="img">
											<!-- <image :src="item.square_pic?baseImgUrl+item.square_pic:baseImgUrl+item.pic_thumb"
												mode="aspectFill"></image> -->
											<u-image height="100%" border-radius="24" :fade="false" :lazy-load="true" :src="item.square_pic?baseImgUrl+item.square_pic:baseImgUrl+item.pic_thumb" mode="aspectFill">
												<u-loading size="50" mode="flower" slot="loading"></u-loading>
											</u-image>
										</view>
										<!-- <view class="ml20 flex_bd">
											<view class="color-ff fs32 ellipsis">{{item.nft_name}}</view>
											<view class="flex mt30">
												<view class="flex fh">
													<view class="head">
														<image :src="baseImgUrl+item.creator_headimgurl" mode=""></image>
													</view>
													<view class="fs26 color-99 ml10 ellipsis">{{item.creator_name}}</view>
												</view>
												<view class="color-ff fs40">#{{item.token_id}}</view>
											</view>
										</view> -->
										<view class="ml20 flex_bd ellipsis-1">
											<view class="color-ff fs28 ellipsis-1 flex">
												<text class="ellipsis-1">{{item.nft_name}}</text>
												<text>#{{item.token_id}}</text>
												<view class="success flex_bd text-right" style="color: #EF7102;margin: 0 6rpx;">寄售中</view>
												<u-icon name="arrow-right" color="#fff" size="28"></u-icon>
											</view>
											<view class="flex fh mt20">
												<image class="head" :src="baseImgUrl+item.creator_headimgurl" mode=""></image>
												<view class="fs26 color-99 ml10 ellipsis">{{item.creator_name}}</view>
											</view>
											<view class="flex color-99 fs20 flex fh mt20" style="line-height: 20rpx;">
												<view class="flex_bd">{{item.put_sale_time}}</view>
												<view class="color-ff fs32 mr30"><text class="fs28" style="margin-right: 6rpx;">¥</text>{{item.put_sale_price}}</view>
											</view>
										</view>
									</view>
								</view>
							</block>
							<!-- <block v-else-if="navList[tabCurrentIndex].type == 'in'">
								<view class="listb mt20 box-bg-base tap" hover-class="hover" hover-start-time="0" hover-stay-time="100" 
								v-for="(item,index) in navList[tabCurrentIndex].list"
									:key="index">
									<view class="color-cc fs20 flex">
										<view>转入时间：{{item.add_time}}</view>
										<view class="flex_bd text-right">来源类型：{{item.transfer_type}}</view>
									</view>
									<view class="flex mt20">
										<view class="img" @click="open(item)">
											<image
												:src="item.square_pic?baseImgUrl+item.square_pic:baseImgUrl+item.pic_thumb"
												mode="aspectFill"></image>
										</view>
										<view class="ml20 flex_bd">
											<view class="color-ff fs32 ellipsis">{{item.nft_name}}</view>
											<view class="flex mt30">
												<view class="flex fh">
													<image class="head" :src="baseImgUrl+item.creator_headimgurl" mode=""></image>
													<view class="fs26 color-99 ml10 ellipsis">{{item.creator_name}}</view>
												</view>
												<view class="color-ff fs40">#{{item.token_id}}</view>
											</view>
											<view class="color-ff mt10 text-right">
												来源用户：{{item.from_uid==0?'平台':item.from_uid}}</view>
										</view>
									</view>
						
								</view>
							</block>
							<block v-else-if="navList[tabCurrentIndex].type == 'out'">
								<view class="listb mt20 box-bg-base tap" hover-class="hover" hover-start-time="0" hover-stay-time="100" 
								v-for="(item,index) in navList[tabCurrentIndex].list"
									:key="index">
									<view class="color-cc fs20 flex">
										<view>转出时间：{{item.add_time}}</view>
									</view>
									<view class="flex mt20">
										<view class="img" @click="open(item)">
											<image
												:src="item.square_pic?baseImgUrl+item.square_pic:baseImgUrl+item.pic_thumb"
												mode="aspectFill"></image>
										</view>
										<view class="ml20 flex_bd">
											<view class="color-ff fs32 ellipsis">{{item.nft_name}}</view>
											<view class="flex mt30">
												<view class="flex fh">
													<image class="head" :src="baseImgUrl+item.creator_headimgurl" mode=""></image>
													<view class="fs26 color-99 ml10 ellipsis">{{item.creator_name}}</view>
												</view>
												<view class="color-ff fs40">#{{item.token_id}}</view>
											</view>
											<view class="color-ff mt10 text-right">转到用户：{{item.to_uid==0?'平台':item.to_uid}}
											</view>
										</view>
									</view>
						
								</view>
							</block>
							<block v-else-if="navList[tabCurrentIndex].type == 'burn'">
								<view class="listb mt20 box-bg-base tap" hover-class="hover" hover-start-time="0" hover-stay-time="100" 
								v-for="(item,index) in navList[tabCurrentIndex].list"
									:key="index">
									<view class="color-cc fs20 flex">
										<view>销毁时间：{{item.burn_time}}</view>
										<view v-if="item.mix_to > 0" @click="app.goPage('info?id='+item.mix_to)"
											class="flex_bd  text-right">合成藏品</view>
									</view>
									<view class="flex mt20">
										<view class="img" @click="open(item)">
											<image
												:src="item.square_pic?baseImgUrl+item.square_pic:baseImgUrl+item.pic_thumb"
												mode="aspectFill"></image>
										</view>
										<view class="ml20 flex_bd">
											<view class="color-ff fs32 ellipsis">{{item.nft_name}}</view>
											<view class="flex mt30">
												<view class="flex fh">
													<image class="head" :src="baseImgUrl+item.creator_headimgurl" mode=""></image>
													<view class="fs26 color-99 ml10 ellipsis">{{item.creator_name}}</view>
												</view>
												<view class="color-ff fs40">#{{item.token_id}}</view>
											</view>
						
										</view>
									</view>
						
								</view>
							</block> -->
							<block v-else-if="navList[tabCurrentIndex].type == 'have'">
								<view class="color-ff list mt20 box-bg-base relative tap" hover-class="hover" hover-start-time="0" hover-stay-time="100"
									v-for="(item,index) in navList[tabCurrentIndex].list" :key="index" @click="open(item)">
									<view v-if="item.num > 0" class="tips">
										x{{item.num}}
									</view>
									<view class="img_b">
										<!-- <image :src="item.square_pic?baseImgUrl+item.square_pic:baseImgUrl+item.pic_thumb"
											mode="aspectFill"></image> -->
										<u-image height="100%" border-radius="24" :fade="false" :lazy-load="true" :src="item.square_pic?baseImgUrl+item.square_pic:baseImgUrl+item.pic_thumb" mode="aspectFill">
											<u-loading size="50" mode="flower" slot="loading"></u-loading>
										</u-image>
									</view>
									<view class="p20">
										<view class="fs28 ellipsis">{{item.nft_name}}</view>
										<view class="flex fh mt10">
											<view class="head_b">
												<image :src="baseImgUrl+item.creator_headimgurl" mode="aspectFill"></image>
											</view>
											<view class="ml20 fs26 color-99 ellipsis">{{item.creator_name}}</view>
						
										</view>
									</view>
								</view>
							</block>
						</view>
						<uni-load-more :status="navList[tabCurrentIndex].loadingType"></uni-load-more>
					</block>
					<!-- <view class="clearfix mt30 h50"></view> -->
				</view>
			</view>
		</view>

		<!-- <copyright></copyright> -->
		<!-- </scroll-view> -->

		<tabbar ref="tabbar" :now_page="now_page" :getCartNum="0"></tabbar>
		
		<kefu :showKefu.sync="showKefu"></kefu>
		
		<u-popup v-model="show" width="532rpx">
			<view class="color-ff fs30" style="padding: 80rpx 30rpx;">
				<view class="flex fh mt40 b-line" v-for="(item, index) in navMenu" :key="index"
					@click="centerNav(item)">
					<view class="left_icon">
						<image :src="baseImgUrl+item.imgurl" mode="aspectFit"></image>
					</view>
					<view class="ml30">{{item.title}}</view>
				</view>
			</view>
		</u-popup>

		<u-modal class="nft-list" v-model="showNftBox" width="700rpx" z-index="101" :show-confirm-button="false" :show-title="false" :mask-close-able="true">
			<scroll-view class="box-bg-base" style="height:900rpx;border-radius: 16rpx;overflow: hidden;" scroll-y>
				<view class="flex modal-content">
					<view class="color-ff list mt20 relative tap" hover-class="hover" hover-start-time="0" hover-stay-time="100" v-for="(item,index) in nftList" :key="index"
					@click="app.goPage('/pages/nft/collection/info?id='+item.sub_id);">
						<view class="cover">
							<view class="cover-top">
								<view v-if="item.token_id" class="top-tips">
									#{{item.token_id}}
								</view>
								<view v-if="item.put_sale == 1" class="top-ps-tips">
									寄售中
								</view>
								<view v-if="item.chain_status >= 2" class="top-ps-tips">
									上链中
								</view>
							</view>
							<view class="img_b">
								<!-- <image :src="item.square_pic?baseImgUrl+item.square_pic:baseImgUrl+item.pic_thumb" mode="aspectFill"></image> -->
								<u-image height="100%" border-radius="24" :fade="false" :lazy-load="true" :src="item.square_pic?baseImgUrl+item.square_pic:baseImgUrl+item.pic_thumb" mode="aspectFill">
									<u-loading size="50" mode="flower" slot="loading"></u-loading>
								</u-image>
							</view>
						</view>
						<view class="p20">
							<view class="fs30 ellipsis">{{item.nft_name}}</view>
							<view class="flex fh mt10">
								<view class="head_b">
									<image :src="baseImgUrl+item.creator_headimgurl" mode="aspectFill"></image>
								</view>
								<view class="ml20 fs26 color-99 ellipsis">{{item.creator_name}}</view>
								<view class="fll" @click.stop="selectMore(item)">
									<u-icon name="more-dot-fill"></u-icon>
								</view>
							</view>
						</view>
					</view>
				</view>
			</scroll-view>
			<view class="btn">
				<view class="close" @click="showNftBox=false">
					<u-icon name="close" color="#fff" size="28"></u-icon>
				</view>
			</view>
		</u-modal>

		<u-action-sheet :list="selectMoreList" v-model="moreShow" :cancel-btn="true" @click="selectMoreClick" :safe-area-inset-bottom="true" border-radius="24">
		</u-action-sheet>

		<!-- <u-modal v-model="saleShow" z-index="101" :show-confirm-button="false" :show-title="false" :mask-close-able="true" :border-radius="22">
			<view class="p30 color-ff box-bg-base">
				<view class="text-center">寄售金额</view>
				<view class="code_box flex mt30 color-ff mb10 fh" style="background: #666666;">
					<text class="mt5 mr10 lh50 fs50">￥</text>
					<u-input :focus="true" maxlength="5" @input="changeSalePrice" @blur="changeSalePrice" placeholder-style="font-size: 24rpx;color: #A9A8AD;"
						@confirm="changeSalePrice" placeholder="寄售价格须大于1，小于20000" v-model="salePrice" type="number" :clearable="false"
						:custom-style="{
							color:'#fff',
							height: '38rpx',
							fontSize: '50rpx',
							fontWeight: 500,
							lineHeight: '50rpx',
						}"></u-input>
					<view class="fs24 cbtn" v-if="es_revenue">预计收入{{' ¥ '+es_revenue}}</view>
				</view>
				<view class="flex fh mt40" style="color: #8a8a8a;justify-content: space-between;">
					<view v-if="selectNft.nft_market_creator_fee>0" class="fs26 mt10">
						版税：成交价的<text class="font-w700 fs26">{{selectNft.nft_market_creator_fee}}%</text>
					</view>
					<view v-if="selectNft.nft_market_transfer_fee>0" class="fs26 mt10">
						服务费：成交价的<text class="font-w700 fs26">{{selectNft.nft_market_transfer_fee}}%</text>
					</view>
				</view>
				<image src="/static/images/sale-line.png" mode="widthFix" style="width: 539rpx;height: 11rpx;margin: 40rpx 0 0;"></image>
				<view class="fs20 mt40">已阅读并同意上述规则及<text class="cbtn" @click="app.goPage('/pages/public/info?type=nft_user_sale_desc')">《平台用户售卖服务协议》</text></view>
				<button v-if="es_revenue" size="default" shape="circle" class="primarybtn mt30" type="warning" @click="openPayPassWord('salePost')">寄售</button>
				<button v-else disabled size="default" shape="circle" class="primarybtn mt30" type="warning" style="background: #818181 !important;">寄售</button>
			</view>
		</u-modal> -->
		<sale-modal :saleShow.sync="saleShow" :salePrice.sync="salePrice" :es_revenue.sync="es_revenue" @openPayPassWord="(e)=>{openPayPassWord(e)}"
		:creator_fee="selectNft.nft_market_creator_fee" :transfer_fee="selectNft.nft_market_transfer_fee"></sale-modal>

		<u-modal v-model="transferShow" z-index="102" :show-confirm-button="false" :show-title="false"
			:mask-close-able="true">
			<view class="p30 box-bg-base color-ff">
				<view class="code_box" style="background: #666666;">
					<u-input placeholder="请输入要转赠的手机号码" v-model="transferMobile" type="number"
						:custom-style="{color:'#fff'}"></u-input>
				</view>
				<button size="default" shape="circle" class="primarybtn mt30" type="warning"
					@click="transferInfo">转赠</button>
			</view>
		</u-modal>

		<u-modal v-model="transferInfoShow" z-index="103" :show-confirm-button="false" :show-title="false"
			:mask-close-able="true">
			<view class="transferInfoBox box-bg-base color-ff">
				<view class="headimgurl">
					<image style="width:120rpx; height:120rpx;" mode="aspectFill"
						:src="transferUinfo.headimgurl?baseImgUrl+transferUinfo.headimgurl:'/static/images/headimgurl.jpg'">
					</image>
				</view>
				<view class="fs28 text-center mt20">
					<view class="mt10" v-if="transferUinfo.nick_name">昵称：{{transferUinfo.nick_name}}</view>
					<view class="mt10">手机号码：{{transferUinfo.mobile}}</view>
				</view>
				<view class="text-center fs26 color-99 mt20">以上为受赠人的信息,请核实是否正确.</view>
				<view class="smll w100 mt30 p20 fs28">
					<view class="w50 p10 mlr10 text-center primarybtn " style="background:#666 !important;color: #FFFFFF;"@click="transferBack">重新填写</view>
					<view class="w50 p10 mlr10 text-center primarybtn" @click="openPayPassWord('transferNft')">确认转赠</view>
				</view>
			</view>
		</u-modal>
		
		<payPassWord :payPassWordShow="payPassWordShow" @closePayPassWord="closePayPassWord" @finishPayPassWord="finishPayPassWord"></payPassWord>
		
		<share-img ref="shareImgCom" :nftInfo="{pic: share_bg}" type="share"></share-img>
		
		<u-skeleton :loading="loading" :animation="true" el-color="#3d3d3d" bg-color="#1e1e1f"></u-skeleton>
	</view>
</template>

<script>
	import Base64 from 'base-64';
	import payPassWord from '@/pages/member/wallet/payPassWord';
	import tabbar from '@/pages/public/tabbar';
	// import copyright from '@/pages/public/copyright'
	export default {
		components: {
			tabbar,
			payPassWord,
			// copyright
		},
		data() {
			return {
				is_post: false,
				showKefu: false,
				moreShow: false,
				show: false,
				now_page: '',
				baseImgUrl: this.config.baseImgUrl,
				setting: {},
				// user_center_top_bg: '',
				// kefu_qrcode: '',
				// top_bg: '',
				userInfo: {

				},
				orderStats: {
					wait_pay_num: 0,
					wait_shipping_num: 0,
					wait_sign_num: 0
				},
				collectNum: 0,
				unReadMsgNum: 0,
				headimgurl: '',
				navMenu: {},
				fansTotal: 0,
				collectionTotal: 0,
				account: {
					balance_money: '0.00'
				},
				teamCount: {
					allNum: 0,
					underNum: 0
				},
				tabCurrentIndex: 0,
				param: {
					type: '',
					p: 0
				},
				keyword: '',
				navList: [{
						type: 'have',
						text: this.app.langReplace('藏品'),
						loadingType: 'more',
						list: [],
						p: 0
					},
					{
						type: 'sale',
						text: this.app.langReplace('寄售中'),
						loadingType: 'more',
						list: [],
						p: 0
					},
					{
						type: 'saleOut',
						text: this.app.langReplace('已卖出'),
						loadingType: 'more',
						list: [],
						p: 0
					}

				],
				selectMoreList: [],
				selectNft: {},
				transferShow: false,
				transferMobile: '',
				transferInfoShow: false,
				transferUinfo: {},
				payPassWordShow: false,
				pay_password: '',
				showNftBox: false,
				nftList: [],
				saleShow: false,
				salePrice: '',
				es_revenue: 0,
				// navbarFixed: false
				borderRadius: 60,
				scrollPaddingTop: 0,
				statusBarHeight: 0,
				statusBarHeightPX: 0,
				topSecHeight: 0,
				share_bg: '',
				loading: true,
			}
		},
		watch: {
			// 关闭弹窗时,重置价格
			saleShow(newName, oldName) {
				if(!newName){
					this.salePrice = null;
					this.es_revenue = null;
				}
			},
			// 关闭弹窗时,重置手机号
			transferShow(newName, oldName) {
				if(!newName){
					this.transferMobile = '';
				}
			},
		},
		onLoad(options) {
			uni.hideTabBar();
			this.now_page = this.$mp.page.route;
			// this.setting = uni.getStorageSync("setting");
			// this.user_center_top_bg = this.baseImgUrl + this.setting.user_center_top_bg;
			// this.kefu_qrcode = this.baseImgUrl + this.setting.kefu_qrcode;
			
			// if (this.setting.user_center_top_bg != '') {
			// 	this.top_bg = this.config.baseImgUrl + this.setting.user_center_top_bg;
			// }
			// let that = this;
			// if (this.setting.user_center_top_nav_bgc != '') {
			// 	setTimeout(function() {
			// 		uni.setNavigationBarColor({
			// 			backgroundColor: that.setting.user_center_top_nav_bgc
			// 		});
			// 	}, 500);
			// }
			let info = this.$u.sys();
			this.statusBarHeight = info.statusBarHeight * 750 / info.windowWidth;
			this.statusBarHeightPX = info.statusBarHeight;
			
			let setting = uni.getStorageSync('setting');
			this.share_bg = setting.share_bg.split(',')[0];
			
			setTimeout(() => {
				this.loading = false;
			},5000)
		},
		onShow() {
			// this.app.isLogin(this)
			this.getCenterInfo();
			if(this.app.refreshData(this.$mp.page.route, Date.now())){
				this.getCenterNavMenu();
				this.loadData('refresh');
			}
			
			if(this.$refs.tabbar){
				this.$refs.tabbar.autoFun();
			}
		},
		onHide() {
			this.showKefu = false; //客服
			this.moreShow = false; //更多
			this.show = false; //左上角更多
			this.saleShow = false; //寄售
			this.transferShow = false; //转让
			this.transferInfoShow = false; //转让用户
			this.payPassWordShow = false; //支付密码
			this.showNftBox = false; //我的藏品
		},
		onReachBottom() {
			this.loadData();
		},
		onPullDownRefresh() {
			this.getCenterInfo();
			this.getCenterNavMenu();
			this.loadData('refresh');
		},
		onPageScroll(e) {
			let sheight = this.statusBarHeight || 40;
			let height = this.topSecHeight - sheight;
			// #ifndef H5
			if(e.scrollTop >= height){
				if(e.scrollTop >= this.topSecHeight){
					this.scrollPaddingTop = this.statusBarHeight;
				} else {
					this.scrollPaddingTop = (sheight - (this.topSecHeight - e.scrollTop).toFixed(0)) * this.statusBarHeight / this.statusBarHeightPX;
				}
			} else {
				this.scrollPaddingTop = 0;
			}
			// this.$refs.navBar.pageScroll(e);
			// this.scrollPaddingTop = e.scrollTop/3 > this.statusBarHeight ? this.statusBarHeight : e.scrollTop/3;
			// #endif
			if(e.scrollTop >= height){
				this.borderRadius = e.scrollTop >= this.topSecHeight ? 0 : (this.topSecHeight - e.scrollTop).toFixed(0) * 60 / sheight;
			} else {
				this.borderRadius = 60;
			}
			// this.borderRadius = (60 - e.scrollTop/3) < 0 ? 0 : 60 - e.scrollTop/3;
		},
		onBackPress() {
			return this.app.backPress([
				{obj: this.$refs.shareImgCom, key: 'shareShow'},
				{obj: this, key: 'transferInfoShow'},
				{obj: this, key: 'transferShow'},
				{obj: this, key: 'payPassWordShow'},
				{obj: this, key: 'showKefu'},
				{obj: this, key: 'saleShow'},
				{obj: this, key: 'moreShow'},
				{obj: this, key: 'showNftBox'},
				{obj: this, key: 'show'},
			])
		},
		mounted() {
			let _this = this;
			const query = uni.createSelectorQuery().in(this);
			query.select('.top-sec').boundingClientRect(data => {
				_this.topSecHeight = data.height;
			}).exec();
		},
		methods: {
			showShareImg(){
				if (this.$refs.shareImgCom.shareimgurl == ''){
					this.$refs.shareImgCom.canvasImage();
				}else{
					 this.$refs.shareImgCom.shareShow = true;
				}
			},
			getPayWay(){
				this.$u.api.getPayIndex().then(res => {
					if(res.data.type == 'sandPayH5N'){
						this.app.goPage('/pages/public/webview?src='+Base64.encode(res.data.url));
					} else if (res.data.type == 'balance') {
						this.app.goPage('/pages/member/wallet/index')
					}
				}).catch(err => {
					console.log(err);
				})
			},
			call(phoneNumber){
				uni.makePhoneCall({
					phoneNumber
				})
			},
			downloadQRcode(url){
				uni.showLoading();
				uni.downloadFile({
					url,
					success: (res) => {
						if (res.statusCode === 200) {
							uni.saveImageToPhotosAlbum({
								filePath: res.tempFilePath,
								success: function () {
									uni.hideLoading();
									uni.showToast({
										title: '下载成功',
										icon: 'none'
									})
								}
							});
						}
					}
				});
			},
			// onViewScroll(res) {
			// 	this.navbarFixed = res.detail.scrollTop >= 260;
			// },
			selectMore(item) {
				this.selectNft = item;
				this.selectMoreList = [];
				this.$u.post('nft/api.publics/getNftActionBtn', {
					sub_id: item.sub_id
				}).then(res => {
					res.data.btnList.forEach((item, index) => {
						item.color = "#ffffff";
						this.selectMoreList.push(item);
					});
					this.moreShow = true;
				})
			},
			selectMoreClick(index) {
				let item = this.selectMoreList[index];
				if (item.action == 'cancelPutSale') {
					this.cancelPutSale();
				} else if (item.action == 'saveHeadPortrait') {
					this.saveHeadPortrait();
				} else if (item.action == 'giveTransfer') {
					this.transferShow = true;
				} else if (item.action == 'putSale') {
					this.saleShow = true;
				}
			},
			saveHeadPortrait() {
				if (this.is_post == true) {
					return false;
				}
				this.is_post = true;
				this.$u.post('member/api.Users/saveHeadPortrait', {
					sub_id: this.selectNft.sub_id
				}).then(res => {
					this.app.showModal(res.msg);
					// this.headimgurl = this.config.baseImgUrl + this.selectNft.pic;
					this.getCenterInfo();
					this.is_post = false;
				}).catch(res => {
					this.is_post = false;
				})
			},
			topTabClick(index) {
				this.tabCurrentIndex = index;
				this.loadData(this.config.tabRefresh?'refresh':'tabChange');
			},

			getCenterNavMenu() {
				return new Promise((resolve,reject) => {
					let authcode = uni.getStorageSync("authcode");
					if (authcode == '') {
						this.userInfo = {
							user_id: 0,
							role: {},
							account: {
								balance_money: '0.00',
								use_integral: '0'
							}
						};
					}
					this.$u.post('publics/api.index/getCenterNavMenu').then(res => {
						this.navMenu = res.data.navMenu;
						resolve(res)
					}).catch(err => {
						reject(err)
					})
				})
			},
			getCenterInfo(){
				return new Promise((resolve,reject) => {
					//获取会员中心信息
					this.$u.post('member/api.center/getCenterInfo').then(res => {
						if (res.data.userInfo) {
							this.userInfo = res.data.userInfo;
							this.orderStats = res.data.orderStats;
							this.collectNum = res.data.collectNum;
							this.teamCount = res.data.teamCount;
							this.unReadMsgNum = res.data.unReadMsgNum;
							this.fansTotal = res.data.fansTotal;
							this.collectionTotal = res.data.collectionTotal;
							this.account = res.data.account;
							if (this.userInfo.headimgurl != '') {
								this.headimgurl = this.config.baseImgUrl + this.userInfo.headimgurl;
							}
						} else {
							this.app.delAuthCode();
						}
						resolve(res)
					}).catch(err => {
						reject(err)
					});
				})
			},
			search() {
				this.loadData('refresh')
			},
			//获取列表
			loadData(source) {
				return new Promise((resolve,reject) => {
					//这里是将订单挂载到tab列表下
					let index = this.tabCurrentIndex;
					let navItem = this.navList[index];
					if (source === 'refresh') {
						navItem.p = 0;
						navItem.loadingType = 'more';
						// navItem.list = [];
						navItem.loaded = false;
					}
					if (navItem.loadingType == 'nomore' || navItem.loadingType === 'loading') {
						return;
					}
					if (source === 'tabChange' && navItem.loaded === true) {
						//tab切换只有第一次需要加载数据
						return;
					}
					navItem.p++;
					this.param.keyword = '';
					if (index == 0) {
						this.param.keyword = this.keyword;
					}
					this.param.type = navItem.type;
					this.param.p = navItem.p;
					navItem.loadingType = 'loading';
					this.$u.post('nft/api.collection/getList', this.param).then(res => {
						if (source === 'refresh') {
							navItem.list = [];
						}
						navItem.list = navItem.list.concat(res.data.list);
						//loaded新字段用于表示数据加载完毕，如果为空可以显示空白页
						this.$set(navItem, 'loaded', true);
						//判断是否还有下一页，有是more  没有是nomore
						navItem.loadingType = navItem.p >= res.data.page_count ? 'nomore' : 'more';
						
						setTimeout(() => {
							this.loading = false;
						},300)
						resolve(res)
					}).catch(err => {
						reject(err)
					});
				})
			},
			centerNav(item) {
				if (item.bind_type == 'tel') {
					uni.makePhoneCall({
						// 手机号
						phoneNumber: item.url + '',
						// 成功回调
						success: (res) => {
							console.log('调用成功!')
						},
						// 失败回调
						fail: (res) => {
							console.log('调用失败!')
						}
					});
				} else {
					this.app.goPage(item.url);
				}
			},
			transferInfo() {
				if (this.transferMobile.length != 11) {
					this.$u.toast(this.app.langReplace('请输入11位手机号码'));
					return false;
				}
				this.$u.post('nft/api.publics/getTransferInfo', {
					'mobile': this.transferMobile,
				}).then(res => {
					// this.transferShow = false;
					this.transferInfoShow = true;
					this.transferUinfo = res.data.userInfo;
				})
			},
			transferBack() {
				// this.transferShow = true;
				this.transferInfoShow = false;
			},
			openPayPassWord(transferType) {
				let setting = uni.getStorageSync('setting');
				this.transferType = transferType;
				if (setting.sys_model_pay_password != 1) {
					if (this.transferType == 'transferNft') {
						return this.transferNft();
					} else if (this.transferType == 'salePost') {
						return this.salePost();
					}
				}
				this.pay_password = '';
				this.$u.post('member/api.users/isSetPayPwd').then(res => {
					if (res.data.isset == 1) {
						this.payPassWordShow = true;
					} else {
						let that = this;
						uni.showModal({
							title: that.app.langReplace('提示'),
							content: res.msg,
							showCancel: true,
							confirmText: that.app.langReplace('设置支付密码'),
							cancelText: that.app.langReplace('取消支付'),
							success: function(res) {
								if (res.confirm) {
									uni.navigateTo({
										url: '/pages/member/center/editPayPassWord'
									});
								}
								if (res.cancel) {
									that.payPassWordShow = false;
								}
							}
						});
					}
				});
			},
			closePayPassWord() {
				this.payPassWordShow = false;
			},
			finishPayPassWord(e) {
				this.payPassWordShow = false;
				this.pay_password = e;
				if (this.transferType == 'transferNft') {
					return this.transferNft();
				} else if (this.transferType == 'salePost') {
					return this.salePost();
				}
			},
			transferNft() {
				if (this.is_post == true) {
					return false;
				}
				this.is_post = true;
				this.$u.post('nft/api.flow/transferNft', {
					'id': this.selectNft.sub_id,
					'mobile': this.transferMobile,
					'pay_password': this.pay_password,
				}).then(res => {
					this.app.showModal(res.msg);
					this.is_post = false;
					this.transferShow = false;
					this.transferInfoShow = false;
					this.getNftList(this.selectNft.nft_id);
					this.loadData('refresh');
					this.app.clearRefreshData();
				}).catch(res => {
					this.is_post = false;
				})
			},
			// changeSalePrice(e) {
			// 	this.$nextTick(()=>{
			// 		if(this.salePrice)this.salePrice = Number(e).toFixed(0);
			// 		if (this.salePrice <= 1) {
			// 			this.es_revenue = 0;
			// 			return true;
			// 		}
					
			// 		let nft_market_transfer_fee = this.salePrice / 100 * this.selectNft.nft_market_transfer_fee;
			// 		nft_market_transfer_fee = nft_market_transfer_fee.toFixed(2);
			// 		let nft_market_creator_fee = this.salePrice / 100 * this.selectNft.nft_market_creator_fee;
			// 		nft_market_creator_fee = nft_market_creator_fee.toFixed(2);
			// 		let es_revenue = this.salePrice - nft_market_transfer_fee - nft_market_creator_fee;
			// 		this.es_revenue = es_revenue.toFixed(2);
			// 	})
			// },
			//进行挂售
			salePost() {
				if (this.is_post == true) {
					return false;
				}
				this.is_post = true;
				this.$u.post('nft/api.flow/putSale', {
					'id': this.selectNft.sub_id,
					'salePrice': this.salePrice,
					'pay_password': this.pay_password,
				}).then(res => {
					this.app.showModal(res.msg);
					this.saleShow = false;
					this.is_post = false;
					this.getNftList(this.selectNft.nft_id);
					this.loadData('refresh');
					this.app.clearRefreshData();
				}).catch(res => {
					this.is_post = false;
				})
			},
			//取消挂售
			cancelPutSale() {
				let that = this;
				uni.showModal({
					title: that.app.langReplace('提示'),
					confirmText: that.app.langReplace('确认取消'),
					cancelText: that.app.langReplace('继续寄售'),
					content: that.app.langReplace('确定取消寄售？'),
					showCancel: true,
					success: function(res) {
						if (res.confirm) {
							if (that.is_post == true) {
								return false;
							}
							that.is_post = true;
							that.$u.post('nft/api.flow/canclePutSale', {
								'id': that.selectNft.sub_id
							}).then(res => {
								that.app.showModal(res.msg);
								that.is_post = false;
								that.getNftList(that.selectNft.nft_id);
								this.loadData('refresh');
								this.app.clearRefreshData();
							}).catch(res => {
								that.is_post = false;
							})
						}
					}
				});
			},
			open(item) {
				if (this.tabCurrentIndex == 0) {
					this.getNftList(item.nft_id);
				} else {
					this.app.goPage('info?id=' + item.sub_id);
				}
			},
			//获取NFT列表
			getNftList(nft_id) {
				this.nftList = [];
				this.$u.post('nft/api.collection/getNftList', {
					nft_id: nft_id
				}).then(res => {
					this.nftList = this.nftList.concat(res.data.list);
					this.showNftBox = true;
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.page-body {
		position: relative;
		z-index: 1;
		// background-color: #09081A;
	}

	.u-badge {
		z-index: 999;
	}

	.top_title {
		position: relative;
		top: 0;
		width: 100%;
		z-index: 99;
		color: #FFFFFF;
	}

	.mine_bg {
		position: absolute;
		width: 100%;
		z-index: -1;
		top: -2rpx;
		opacity: .3;
	}

	.head_bg {
		position: fixed;
		width: 100%;
		height: 624rpx;
		z-index: -1;
		top: -2rpx;
		left: 0;
		background: var(--bg);
		background-position: center;
		background-size: cover;
		background-repeat: no-repeat;
		opacity: .6;
	}

	.top-info .head {
		margin-left: 50rpx;
		border-radius: 50%;
		width: 126rpx;
		min-width: 126rpx;
		height: 126rpx;
		min-height: 126rpx;
		border: 4rpx solid #FFFFFF;
		box-sizing: border-box;
	}

	.icon_set {
		position: absolute;
		top: 100rpx;
		right: 20rpx;

		.set_text {
			font-size: 22rpx;
			color: #FFFFFF;
		}
	}

	.nav-bar {
		padding: 30rpx;
		justify-content: space-around;
		
		&-item {
			height: 80rpx;
			background: none;
			position: relative;
			
			.cover {
				position: absolute;
				left: 0;
				top: 0;
				width: 100%;
				height: 100%;
				z-index: 100;
			}
		}
	}

	.card_box {
		background-color: #ffffff;
		border-radius: 20rpx;
		margin: 20rpx;
		width: auto;
		color: $font-color-dark;
		padding: 30rpx 0;
	}

	.nickname {
		min-width: 100rpx;
		max-width: 300rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		-webkit-box-orient: vertical;
	}

	.role_name {
		min-width: 90rpx;
		line-height: 40rpx;
		color: #ffffff;
		padding: 2rpx 10rpx;
		display: inline-block;
		text-align: center;
		background: linear-gradient(100deg, #F8CD89 1%, #F6A957 100%);
		border-radius: 20rpx;
	}

	.icon {
		width: 56rpx;
		height: 56rpx;
		margin: 0 auto;

		image {
			width: 100%;
			height: 100%;
		}
	}

	.list_box {
		height: 178rpx;
		align-items: center;
		// background: linear-gradient(180deg, rgba(0, 0, 0, 1) 0%, rgba(33, 31, 32, 0) 100%);
		// margin-top: -150rpx;
	}

	.menu_box {
		border-radius: 20rpx;
	}

	.list-cell {
		padding: 15rpx 20rpx;
	}

	.tip-msg-dian {
		position: absolute;
		right: -5rpx;
		top: 0rpx;
		width: 15rpx;
		height: 15rpx;
		background-color: #F2692F;
		border-radius: 50%;
	}

	// .navbar_fixed {
	// 	width: 100%;
	// 	position: fixed;
	// 	top: 0;
	// 	z-index: 99;
	// 	background: #1F1F20;
	// }

	// .search_fixed {
	// 	position: fixed;
	// 	top: 99rpx;
	// 	z-index: 99;
	// 	width: 100%;
	// 	background: #1F1F20;
	// }

	.top_navbar {
		position: sticky;
		z-index: 99;
		// background-color: $page-color-base;
		top: calc(var(--window-top) - 3px);
		
		// &.wechat {
		// 	top: -3px;
		// }
		// border-top-left-radius: 60rpx;
		// border-top-right-radius: 60rpx;
		overflow: hidden;
		
		.navbar {
			// background-color: $box-color-base;
			background-color: $page-color-base;
			border-radius: 0;
			height: auto;
			position: absolute;
			width: 100%;
			left: 0;
			bottom: -1px;
			
			.nav-item {
				height: 100rpx;
				font-size: 28rpx;
			}
			.nav-item.current:after {
				width: 44rpx;
				height: 8rpx;
				bottom: 12rpx;
				border-radius: 4rpx;
				border: none;
				background: #fff;
			}
		} 
	}
	.list {
		width: 330rpx;
		border-radius: 24rpx;
		background-color: #414141;
		
		.img_b {
			width: 330rpx;
			height: 330rpx;

			image {
				width: 100%;
				height: 100%;
				border-radius: 24rpx;
			}
		}
	}
	
	.cover {
		.cover-top {
			position: absolute;
			z-index: 1;
			width: 100%;
			left: 0;
			top: 0;
			padding: 16rpx 0;
			display: flex;
			align-items: center;
			
			.top-tips,
			.top-ps-tips {
				margin-left: 12rpx;
				height: 30rpx;
				border-radius: 4rpx;
				color: #FEFEFE;
				display: flex;
				align-items: center;
			}
			.top-tips {
				background-color: rgba(0, 0, 0, .3);
				font-size: 28rpx;
				padding: 0 6rpx;
			}
			.top-ps-tips {
				background-color: #EF7102;
				font-size: 20rpx;
				padding: 2rpx 8rpx;
			}
		}
	}
	.tips {
		position: absolute;
		top: 20rpx;
		left: 12rpx;
		color: #FFFFFF;
		border-radius: 20rpx;
		padding: 5rpx 15rpx;
		background-color: rgba(29, 29, 46, 0.3);
		z-index: 9;
		display: inline-block;
		padding: 2rpx 8rpx;
		line-height: 30rpx;
		border-radius: 4rpx;
	}

	// .ps_tips {
	// 	position: absolute;
	// 	top: 20rpx;
	// 	left: 10rpx;
	// 	color: #FFFFFF;
	// 	border-radius: 20rpx;
	// 	padding: 5rpx 15rpx;
	// 	background-color: rgba(29, 29, 46, 0.7);
	// 	font-size: 24rpx;
	// 	z-index: 9;
	// }

	.head_b {
		margin-left: 0rpx;
	
		image {
			width: 40rpx;
			height: 40rpx;
			border-radius: 50%;
		}
	}

	.sh {
		// background: linear-gradient(to bottom,$box-color-base,$page-color-base);
		// background: $page-color-base;
		border-top-left-radius: 60rpx;
		border-top-right-radius: 60rpx;
		
		.content {
			background: $page-color-base;
			// background: linear-gradient(to bottom, #2d2d2d, #1E1E1F 40rpx);
		}
	}
	
	.opt {
		width: 498rpx;
		height: 90rpx;
		border: 1rpx solid rgba(108, 107, 118, 1);
		border-radius: 45rpx;
		margin: 0 auto;

		.fz_icon {
			width: 39rpx;
			height: 39rpx;

			image {
				width: 100%;
				height: 100%;
			}
		}
	}

	.left_icon {
		width: 44rpx;
		height: 44rpx;

		image {
			width: 100%;
			height: 100%;
		}
	}

	.b-line {
		border-bottom: 1rpx solid #393939;
		padding-bottom: 40rpx;
	}

	/deep/ .u-drawer-bottom {
		background: #2D2D2D;
	}

	/deep/ .u-actionsheet-cancel {
		color: #FFFFFF;
	}

	/deep/ .u-gab {
		height: 1rpx;
		background: #393939;
	}

	/deep/ .u-border-bottom:after {
		border-bottom: 1rpx solid #393939;
	}

	/deep/ .u-drawer-left {
		background: #242323;
	}

	.listb {
		width: 100%;
		border-radius: 16rpx;
		padding: 30rpx;
		margin: 10rpx;

		.head {
			width: 40rpx;
			height: 40rpx;
			border-radius: 50%;
		}

		.img {
			width: 150rpx;
			height: 150rpx;

			image {
				width: 100%;
				height: 100%;
				border-radius: 24rpx;
			}
		}
	}

	.code_box {
		padding: 15rpx 20rpx;
		border-radius: 24rpx;
		margin: 0 auto;
	}


	.transferInfoBox {
		display: flex;
		flex-direction: column;
		align-items: center;
		position: relative;
		z-index: 99999;
		border-radius: 20rpx;
		margin-bottom: 20rpx;
		position: relative;
		padding-top: 20rpx;
	}

	.transferInfoBox .headimgurl {
		width: 120rpx;
		height: 120rpx;
		border-radius: 50%;
		overflow: hidden;
		border: 3rpx solid #FFFFFF;
		background-color: #FFFFFF;
		text-align: center;

	}

	.transferInfoBox .headimgurl image {
		width: 100%;
		height: 100%;
		overflow: hidden;
		border-radius: 50%;
	}

	.list_btn {
		width: 160rpx;
		padding: 17rpx 0;
		background: rgba(5, 5, 5, 0.1);
		border: 2rpx solid rgba(94, 94, 94, 1);
		border-radius: 16rpx;
		justify-content: center;
	}

	.list_btn {
		border: none !important;
		align-items: center;
		// background: rgba(0, 0, 0, 0) !important;
		.fs30 {
			font-size: 24rpx !important;
		}
	}
	
	.primarybtn {
		border-radius: 45rpx;
	}
	
	.nft-list {
		.box-bg-base {
		// 	position: relative;
			
		// 	&::before,
		// 	&::after {
		// 		content: '';
		// 		width: 100%;
		// 		height: 50rpx;
		// 		position: absolute;
		// 		z-index: 1;
		// 		left: 0;
		// 	}
		// 	&::before {
		// 		top: 0;
		// 		background: linear-gradient(to bottom,$box-color-base 0%,rgba(0,0,0,0) 100%);
		// 	}
		// 	&::after {
		// 		bottom: 0;
		// 		background: linear-gradient(to top,$box-color-base 0%,rgba(0,0,0,0) 100%);
		// 	}
		
			.modal-content {
				justify-content: space-between;
				flex-wrap: wrap;
				padding: 20rpx 20rpx 40rpx;
			}
		}
		
		/deep/ .u-mode-center-box{
			background-color: transparent !important;
		}
		.list {
			width: 315rpx;
			border-radius: 24rpx;
			
			.img_b {
				width: 315rpx;
				height: 315rpx;
			}
		}
		.btn {
			height: 100rpx;
			position: relative;
			
			.close {
				background-color: $box-color-base;
				border-radius: 50%;
				width: 80rpx;
				height: 80rpx;
				position: absolute;
				left: 50%;
				bottom: 6rpx;
				transform: translateX(-50%);
				display: flex;
				justify-content: center;
				align-items: center;
			}
		}
	}
</style>
