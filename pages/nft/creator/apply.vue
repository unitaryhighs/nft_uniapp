<template>
	<view class="page-body p30">
		<view class="sq-list">
			<view class="p20 line flex fh">
				<text class="color-ff fs32">姓名</text>
				<view class="ul-item fll">
					<view  v-if="check_id_card == 1" class=" fs30 color-ff">{{real_name}}</view>
					<view v-else @click="app.goPage('/pages/member/center/checkIdCard')" class="color-ff">未实名认证，点前往验证<u-icon name="arrow-right " size="20"></u-icon></view>
				</view>
			</view>
			<view class="p20 line flex fh">
				<text class="color-ff fs32">性别</text>
				<view class="ul-item fll ">
					<u-radio-group v-model="model.sex" @change="radioGroupChange">
						<u-radio
							@change="radioChange" 
							v-for="(item, index) in list" :key="index" 
							:name="item.name"
							:disabled="item.disabled"
							shape="circle"
							active-color="#DCB191"
						>
							{{item.name}}
						</u-radio>
					</u-radio-group>
				</view>
			</view>
			<view class="p20 line flex fh">
				<text class="color-ff fs32">年龄</text>
				<view class="ul-item fll">
					<input placeholder="请填写您的年龄" v-model="model.age" type="number" class="inputs fs30 color-ff"/>
				</view>
			</view>
			<view class="p20 flex fh" >
				<text class="color-ff fs32">简介</text>
				<view class="ul-item fll" style="height: 150rpx;">
					<textarea placeholder="请输入简介" v-model="model.desc" class="color-ff"  style="width: 100%;height: 100%;"/>
				</view>
			</view>
		</view>
		<view class="sq-listb mt30">
			<view class="">
				<text class="color-ff fs32 font-w600">上传作品图片（{{fileList.length}}/3）</text>
				<view class=" mt30">
					<u-upload ref="upload" :file-list="fileListNow" @on-change="uploaded" :deletable="postStatus" @on-remove="removeImg" :action="upAction" :max-count="postStatus?3:0"></u-upload>
				</view>
			</view>
		</view>
		<view v-if="apply_status == 0" class="mt30 color-ff text-center">
			正在审核中...
		</view>
		<view v-if="apply_status == 1" class="mt30 color-ff ">
			审核失败：{{check_info}}
		</view>
		
		<view class="sumbitsq primarybtn" @click="postApply" v-if="postStatus">{{apply_status == 1?'重新提交申请':'提交申请'}}</view>
		
		
	</view>
</template>

<script>
	export default{
		data(){
			return{
				isOpen:false,
				baseImgUrl:this.config.baseImgUrl,
				upAction: this.config.upImageUrl,
				fileList:[],
				fileListNow:[],
				list: [
					{
						name: '男',
						disabled: false
					},
					{
						name: '女',
						disabled: false
					},
				],
				// u-radio-group的v-model绑定的值如果设置为某个radio的name，就会被默认选中
				real_name:'',
				check_id_card:0,
				model:{
					sex:'男',
					age:'',
					desc:'',
				},
				apply_status:-1,
				postStatus:true,
				is_post:false
			}
		},
		onShow(){
			this.getUserInfo();
		},
		methods:{
			getUserInfo(){
				//获取登录会员信息
				this.$u.api.getUserInfo().then(res => {
					if (res.data.is_creator == 1){
						this.app.showModal('您已是创作者，无须重复申请.',-1);
						return false;
					}
					this.real_name = res.data.real_name;
					this.check_id_card = res.data.check_id_card;
					this.getApply();
				});
			},
			getApply(){
				this.$u.post('nft/api.publics/getApplyCreator').then(res => {
					if (res.data.id){
						this.model.sex = res.data.sex;
						this.model.age = res.data.age;
						this.model.desc = res.data.desc;
						this.apply_status = res.data.apply_status;
						this.check_info = res.data.check_info;
						if (res.data.apply_status == 0 || res.data.apply_status == 9){
							this.postStatus = false;
						};
						if(!this.fileList.length && res.data.fileList.length){
							this.fileList = [];
							this.fileListNow = [];
							res.data.fileList.forEach((item,index)=>{
								this.fileList.push(item);
								this.fileListNow.push({url:this.baseImgUrl+item});
							})
							//console.log(this.fileListNow);
						}
					}
				});
			},
			//提交申请
			postApply(){
				if (this.is_post == true){
					return false;
				}
				if (this.check_id_card == 0){
					uni.showToast({
					    title: '请完成实名后操作.',
						icon:'none',
					    duration: 2000
					});
					return false;
				}
				if (this.model.age == '' || this.model.desc == '' ){
					uni.showToast({
					    title: '请填写完善信息.',
						icon:'none',
					    duration: 2000
					});
					return false;
				}
				if (this.fileList.length < 1){
					uni.showToast({
					    title: '至少要上传一个作品图片.',
						icon:'none',
					    duration: 2000
					});
					return false;
				}
				this.model.fileList = this.fileList.join(',');
				this.is_post = true;
				this.$u.post('nft/api.publics/postApplyCreator', this.model).then(res => {
					this.is_post = false;
					this.app.showModal(res.msg);
					this.getApply();
				}).catch(res => {
					this.is_post = false;
				})
			},
			// 选中某个单选框时，由radio时触发
			radioChange(e) {
				console.log(e);
			},
			// 选中任一radio时，由radio-group触发
			radioGroupChange(e) {
				console.log(e);
			},
			uploaded(res, index, lists) {
				var res = JSON.parse(res.data);
				this.fileList.push(res.file);
			},
			removeImg(index, lists) {
				let file = this.fileList[index];
				this.fileList.splice(index, 1);
				this.$u.post(this.config.removeImageUrl, {
					file: file
				}).then(res => {})
			}
		}
	}
</script>

<style lang="scss">
	.page-body{
		// background: #09081A;
	}
	.uqbims{
		width: 100%;
		height: 372rpx;
	}
	
	.sq-list{
		margin: 0 auto;
		background: #2D2D2D;
		border-radius: 20rpx;
		padding: 20rpx;
		position: relative;
	}
	.sq-listb{
		margin: 0 auto;
		background: #2D2D2D;
		border-radius: 20rpx;
		padding: 20rpx 14rpx;
		position: relative;
	}
	.po-re{
		.imglis{
			width: 144rpx;
			height: 144rpx;
			margin-right: 30rpx;
			margin-bottom: 30rpx;
			float: left;
			position: relative;
			.delicon{
			    width: 15px;
			    height: 15px;
			    display: block;
			    background-color: #FE0079;
			    border-radius: 50%;
			    color: #FFFFFF;
			    text-align: center;
			    line-height: 14px;
			    position: absolute;
			    top: 0;
			    right: 0;
			    font-weight: bold;
			}
		}
		.licon{
			width: 100%;
			height: 100%;
		}
	}
	
	.ul-item{
		width: 71%;
	}
	
	
	.line{
		position: relative;
		&::before{
			position: absolute;
			content: '';
			width: 100%;
			height: 1px;
			background-color: #424242;
			left: 0;
			bottom: 0;
		}
	}
	.sumbitsq{
		width: calc(100% - 28px);
		left: 14px;
	    margin: 30px auto;
		bottom: 36px;
		text-align: center;
		height: 47px;
		line-height: 47px;
		font-size: 15px;
		border-radius: 21px;
		// background: linear-gradient(90deg, rgba(210, 159, 127, 1) 0%, rgba(247, 222, 190, 1) 100%);
	}
</style>
