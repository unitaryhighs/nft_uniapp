<template>
	<view class="mainbox">
		<!-- <view id="canvasBox" ref="canvasBox" @touchstart="three.onmousedown" @touchmove="three.onmousemove" @touchend="three.onmouseup" -->
		<view id="canvasBox" ref="canvasBox"
		:prop="prop" :change:prop="three.onChange"></view>
		<!-- <view class="zizhuan" @click="three.zizhuanSet">
			<image :src="baseImgUrl+'/a_static/images/360z.png'"></image>
		</view> -->
	</view>
</template>

<script>
	export default {
		data(){
			return {
				baseImgUrl: this.config.baseImgUrl,
				prop: {},
			}
		},
		props: {
			frontImg: {
				type: String,
				default: ''
			},
			backImg: {
				type: String,
				default: ''
			},
		},
		created() {
			this.prop = {
				frontImg: this.frontImg,
				backImg: this.backImg,
			}
		},
	}
</script>

<script module="three" lang="renderjs">
	const THREE = require('three/build/three.min.js');
	// import * as THREE from '@/static/three/three.min.js';
	import { RoundedBoxGeometry } from '@/static/three/RoundedBoxGeometry.js';
	const textureLoader = new THREE.TextureLoader();
	export default{
		name: "three3d",
		// props: {
		// 	frontImg: {
		// 		type: String,
		// 		default: 'https://img2.baidu.com/it/u=3395582942,4228440123&fm=253&fmt=auto&app=138&f=JPEG?w=889&h=500'
		// 	},
		// 	backImg: {
		// 		type: String,
		// 		default: 'https://img2.baidu.com/it/u=3395582942,4228440123&fm=253&fmt=auto&app=138&f=JPEG?w=889&h=500'
		// 	},
		// },
		data(){
			return{
				// baseImgUrl: this.config.baseImgUrl,
				mouseX:'',
				mouseY:'',
				isZizhuan:true,
				isMove:true,
				main:null,
				line:null,
				scene:null,
				camera:null,
				renderer:null,
				light:null,
			}
		},
		mounted() {
			let that = this;
			this.$nextTick(function(){
				if(that.$refs.canvasBox.offsetWidth || that.$refs.canvasBox.addEventListener){
					var canvasBox = that.$refs.canvasBox
				} else {
					var canvasBox = that.$refs.canvasBox.$el
				}
				
				// var canvasBox = that.$refs.canvasBox.$el
				var W = canvasBox.clientWidth
				var H = canvasBox.clientHeight
				that.intScene();
				that.intCamera(canvasBox,W,H);
				that.intRender(canvasBox,W,H);
				that.intLight();
				that.intModels();
				that.zizhuan();
				this.renderer.render(this.scene, this.camera);
			})
		},
		methods:{
			onChange(newValue, oldValue, ownerInstance, instance) {
				// console.log('service层中的options发生变化')
				// console.log('新值', newValue)
				// console.log('旧值', oldValue)
				// ownerInstance和this.$ownerInstance一样，可用来向service层通信
				// instance和ownerInstance的区别是：
				// instance.$el指向的是触发事件的那个节点；ownerInstance.$el指向当前vue文件中的根节点；
				// instance的作用目前尚不明确，官方没有给出用法
				for(let key in newValue){
					this[key] = newValue[key];
				}
			},
			intScene(){
				this.scene = new THREE.Scene()
			},
			intCamera (canvasBox,W,H) {
			    this.camera = new THREE.PerspectiveCamera(45, W/H, 1,1000);
			    this.camera.position.set(0, 0, 500);
			    this.camera.up.set(0, 1, 0)
			    this.camera.lookAt(this.scene.position)
			},
			intRender(canvasBox,W,H) {
			    this.renderer = new THREE.WebGLRenderer( { antialias: true,alpha: true } );
			    this.renderer.setPixelRatio( window.devicePixelRatio );
			    this.renderer.setSize(W, H)
				console.log(this.renderer)
			    canvasBox.appendChild(this.renderer.domElement)
			},
			intLight() {
			    this.light = new THREE.DirectionalLight(0xffffff, 1)
			    this.light.position.set(50, 50, 500)
			    this.scene.add(this.light)
			},
			intModels() {
			    //主体
			    var main_geometry = new RoundedBoxGeometry(15, 270, 270,2,5);
			    var material = new THREE.MeshPhongMaterial({
			        color: 0xcccccc
			    });
			    var materialArr=[
			        //纹理对象赋值给6个材质对象
			        this.loadtexture(this.frontImg,THREE.FrontSide),
			        this.loadtexture(this.backImg,THREE.FrontSide),
			        material,
			        material,
			        material,
			        material
			    ];
				console.log(materialArr)
			    this.main = new THREE.Mesh(main_geometry,materialArr);
			    this.main.position.set(0, 0, 1);
			    this.main.rotation.y = -0.95;
			    this.scene.add(this.main);
			
			    // 创建一个几何体对象
			    var box = new RoundedBoxGeometry(2, 280, 280,2,2);
			     material = new THREE.MeshBasicMaterial({
			        color: 'pink',
			        opacity: 0,
			        transparent: true
			    });
			    var cube = new THREE.Mesh(box, material);
			    // 立方体几何体box作为EdgesGeometry参数创建一个新的几何体
			    var edges = new THREE.EdgesGeometry(box);
			    // 立方体线框，不显示中间的斜线
			    var edgesMaterial = new THREE.LineBasicMaterial({
			        color: 0xffffff
			    })
			     this.line = new THREE.LineSegments(edges, edgesMaterial);
			    this.line.rotation.y = -0.95;
			    this.scene.add(cube, this.line);
			
			
			},
			zizhuan() {
			    if (this.isMove && this.isZizhuan) {
			        requestAnimationFrame(this.zizhuan);
			        this.main.rotation.y += 0.005;
			        this.line.rotation.y += 0.005;
			        this.renderer.render(this.scene, this.camera);
			    }
			},
			zizhuanSet(){
				if (this.isZizhuan){
					 this.isZizhuan = false;
				}else{
					this.isZizhuan = true;
					this.zizhuan();
				}
			},
			loadtexture(url,_side){
			    var texture = textureLoader.load(url)
			    return new THREE.MeshPhongMaterial({
			        map:texture,
			        side:_side
			        // 前面FrontSide  背面：BackSide 双面：DoubleSide
			    })
			    //这个就是图片所造的一个面的材料
			},
			onmousedown(e) {
			    this.isMove = false;
			    this.mouseX = e.touches[0].pageX;
			    this.mouseY = e.touches[0].pageY;
			},
			onmousemove(e) {
				e.stopPropagation();
				e.preventDefault();
				
			    if (!this.isMove) {
			        var disX = e.touches[0].pageX - this.mouseX;
			        var disY = e.touches[0].pageY - this.mouseY;
			        requestAnimationFrame(this.zizhuan);
			        this.main.rotation.x = this.main.rotation.x > 0.8 ? 0.8 : this.main.rotation.x;
			        this.main.rotation.x = this.main.rotation.x < -0.8 ? -0.8 : this.main.rotation.x;
			        this.main.rotation.x += disY * 0.00005 * Math.PI;
			        this.main.rotation.y += disX * 0.00005 * Math.PI;
					
					this.line.rotation.x = this.line.rotation.x > 0.8 ? 0.8 : this.line.rotation.x;
					this.line.rotation.x = this.line.rotation.x < -0.8 ? -0.8 : this.line.rotation.x;
					this.line.rotation.x += disY * 0.00005 * Math.PI;
					this.line.rotation.y += disX * 0.00005 * Math.PI;
			        this.renderer.render(this.scene, this.camera);
			    }
			},
			onmouseup() {
			    console.log(this.main.rotation.x)
			    this.isMove = true;
				let that = this
				clearTimeout(this.timeout);
			    this.timeout = setTimeout(function() {
			        that.zizhuan();
			    }, 1000)
			},
		}
	}
</script>

<style lang="scss">
	.mainbox{
		width: 100%;
		height: 100%;
		position: relative;
	}
	.zizhuan{
		width: 60rpx;
		height: 60rpx;
		position: absolute;
		right: 20rpx;
		top:50%;
		border: 2rpx #ffffff solid;
		border-radius: 50%;
		image{
			width: 100%;
			height: 100%;
		}
	}
	#canvasBox{
		width: 100%;
		height: 100%;
	}
</style>
