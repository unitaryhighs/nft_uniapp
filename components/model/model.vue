<template>
	<view class="u-relative model-container">
		<view class="svg" v-if="loading">
			<image src="/static/images/loading.svg" mode="widthFix" style="width: 100%;"></image>
		</view>
		<view id="threeView" ref="threeView"
		@mousedown="three.startMove" @touchstart="three.startMove"
		@mousemove="three.moving" @touchmove="three.moving"
		@mouseup="three.endMove" @touchend="three.endMove"
		:prop="prop" :change:prop="three.onChange">
		</view>
	</view>
</template>

<script>
	export default {
		name: 'model',
		data(){
			return {
				prop: {},
				loading: true,
			}
		},
		props: {
			type: {
				type: String,
				default: 'model'
			},
			url: {
				type: String,
				default: ''
			},
			speed: {
				type: Number,
				default: 0.3
			},
			senceSpeed: {
				type: [Number,String],
				default: 0
			},
			rotateSpeed: {
				type: [Number,String],
				default: 1
			},
			touchSpeed: {
				type: Number,
				default: 1
			},
			scale: {
				type: Number,
				default: 1
			},
			// true-控制场景
			control: {
				type: Boolean,
				default: false
			},
			// 模型惯性阻尼
			damping: {
				type: Boolean,
				default: true
			},
			// 阻尼值 秒
			dampingValue: {
				type: Number,
				default: 2
			},
			ambient: {
				type: Array,
				default: ()=>[{
						color: 'ffffff',
						intensity: 0.4
					}]
			},
			dirLight: {
				type: Array,
				default: ()=>[{
						color: 'ffffff',
						positionx: 20,
						positiony: 20,
						positionz: 100,
						intensity: 0.4
					},{
						color: 'ffffff',
						positionx: -200,
						positiony: -100,
						positionz: -100,
						intensity: 0.4
					}]
			},
			spotLight: {
				type: Array,
				default: ()=>[{
						color: 'fffbe5',
						positionx: 0,
						positiony: 200,
						positionz: 100
					}]
			},
			cameraData: {
				type: Object,
				default: ()=>{
					return {
						positionx: 0,
						positiony: 0,
						positionz: 2
					}
				}
			},
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
				type: this.type,
				url: this.url,
				speed: this.speed,
				senceSpeed: this.senceSpeed,
				rotateSpeed: this.rotateSpeed,
				touchSpeed: this.touchSpeed,
				scale: this.scale,
				control: this.control,
				damping: this.damping,
				dampingValue: this.dampingValue,
				ambient: this.ambient,
				dirLight: this.dirLight,
				spotLight: this.spotLight,
				cameraData: this.cameraData,
				frontImg: this.frontImg,
				backImg: this.backImg,
			}
		},
		methods: {
			showLoading(){
				// uni.showLoading({
				// 	title: '加载中'
				// });
				this.loading = true;
			},
			hideLoading(){
				// uni.hideLoading();
				this.loading = false;
			}
		},
	}
</script>

<!-- 只能在APP和h5端运行 -->
<script module="three" lang="renderjs">
	const THREE = require('three/build/three.min.js');
	// import * as THREE from '@/static/three/three.min.js';
	
	// OrbitControls 是对 Threejs 的三维场景进行缩放、平移、旋转操作
	import {
		OrbitControls
	} from 'three/examples/jsm/controls/OrbitControls.js'

	// 导入 glb 格式模型，若要导入其他格式模型，可尝试在 loaders 目录下加载其他文件
	import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
	
	import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'
	
	import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
	import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
	
	import { gsap } from "gsap";
	// // var tl = gsap.timeline();

	// var renderer;
	// var scene;
	// var camera;
	// var controls;
	// var mixer;
	// var clock = new THREE.Clock();
	// // var dampingClock = new THREE.Clock();

	export default {
		data(){
			return {
				renderer: null,
				scene: null,
				camera: null,
				controls: null,
				mixer: null,
				clock: new THREE.Clock(),
		
				model: null, //展示模型
				animation: null, //动画
				add: true, //旋转方向
				modelFormat: null, //模型格式
				animationSpeed: null, //动画速度
				
				coordinate: {
					x: 0, //坐标X
					y: 0 //坐标Y
				},
				isTouchMove: false, //移动中
				isMoving: false,
				offsetX: 0, //X轴偏移量
				offsetY: 0, //Y轴偏移量
				pauseMoving: null, //移动中暂停定时器
				updateOffset: {
					x: 0,
					y: 0
				},
			}
		},
		
		watch: {
			coordinate(newData,oldData) {
				// console.log(newData,oldData)
				if(this.isTouchMove && oldData.x && oldData.y){
					this.offsetX = newData.x - oldData.x;
					this.offsetY = newData.y - oldData.y;
					// console.log(this.offsetX,this.offsetY);
					// this.model.rotation.y += this.offsetX * this.animationSpeed;
					// this.model.rotation.x += this.offsetY * this.animationSpeed;
					
					// this.updateOffset.y += this.offsetX * this.animationSpeed;
					// this.updateOffset.x += this.offsetY * this.animationSpeed;
					// tl.to(this.model.rotation,{
					// 	duration: (newData.date - oldData.date) / 1000,
					// 	x: this.model.rotation.x + this.offsetY * this.animationSpeed,
					// 	y: this.model.rotation.y + this.offsetX * this.animationSpeed,
					// 	ease: "none"
					// }, ">");
					
					// gsap.killTweensOf(this.model.rotation);
					// gsap.to(this.model.rotation,{
					// 	duration: (newData.date - oldData.date) / 1000,
					// 	x: this.model.rotation.x + this.offsetY * this.animationSpeed,
					// 	y: this.model.rotation.y + this.offsetX * this.animationSpeed,
					// 	ease: "none"
					// });
					
					this.updateOffset.x += this.offsetY * this.animationSpeed;
					this.updateOffset.y += this.offsetX * this.animationSpeed;
					gsap.killTweensOf(this.updateOffset);
					gsap.to(this.updateOffset,{
					    duration: .2,
					    x: 0,
					    y: 0,
					    ease: "power4.out"
					});
				}
			},
		},

		mounted() {
			this.animationSpeed = (Math.PI / 360 * this.touchSpeed).toFixed(5);
			this.initThree();//加载场景
			this.createControls();//控制模型的缩放、平移、旋转操作
		},
		
		methods: {
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
				
				this.geyModelFormat();//获取模型文件格式
				this.loadModel();//导入模型
			},
			getXY(e){
				let date = Date.now();
				if(e.clientX){
					this.coordinate = {
						x: e.clientX,
						y: e.clientY,
						date
					}
				} else if(e.touches.length == 1){
					this.coordinate = {
						x: e.touches[0].clientX,
						y: e.touches[0].clientY,
						date
					}
				}
			},
			startMove(e){
				// console.log(e);
				// console.log('startMove');
				this.isTouchMove = true;
				this.isMoving = true;
				clearTimeout(this.stopMoving);
				this.getXY(e);
				// 清除动画
				gsap.killTweensOf(this.updateOffset);
				this.offsetX = 0;
				this.offsetY = 0;
				this.updateOffset = {
					x: 0,
					y: 0
				};
			},
			moving(e){
				e.stopPropagation();
				e.preventDefault();
				if(!this.control)return;
				// console.log(e);
				// console.log('moving');
				clearTimeout(this.pauseMoving);
				this.getXY(e);
				this.pauseMoving = setTimeout(() => {
					this.offsetX = 0;
					this.offsetY = 0;
				},50);
			},
			endMove(e){
				// console.log(e);
				// console.log('endMove');
				this.isTouchMove = false;
				this.stopMoving = setTimeout(()=>{
					this.isMoving = false;
				},2000)
				this.coordinate = {
					x: 0,
					y: 0,
					date: Date.now()
				};
				clearTimeout(this.pauseMoving);
				// if(this.damping && !this.control && (this.offsetX || this.offsetY)){
				// 	dampingClock.start();
				// 	dampingClock.getDelta();
				// 	this.stopDamping();
				// }
				
				this.updateOffset.x += this.offsetY * this.animationSpeed;
				this.updateOffset.y += this.offsetX * this.animationSpeed;
				gsap.killTweensOf(this.updateOffset);
				gsap.to(this.updateOffset,{
				    duration: this.dampingValue,
				    x: 0,
				    y: 0,
				    ease: "power4.out"
				});
			},
			// stopDamping(){
			// 	dampingClock.getDelta();
			// 	// console.log(dampingClock.getDelta(),dampingClock.elapsedTime);
			// 	if(this.isTouchMove || (!this.offsetX && !this.offsetY)){
			// 		// this.offsetX = 0;
			// 		// this.offsetY = 0;
			// 		dampingClock.stop();
			// 		return;
			// 	};
			// 	let speed = 1 - (dampingClock.elapsedTime / this.dampingValue);
			// 	console.log(speed);
			// 	if(dampingClock.elapsedTime > this.dampingValue){
			// 		this.offsetX = 0;
			// 		this.offsetY = 0;
			// 		dampingClock.stop();
			// 	} else {
			// 		this.model.rotation.y += this.offsetX * speed * this.animationSpeed;
			// 		this.model.rotation.x += this.offsetY * speed * this.animationSpeed;
			// 		// setTimeout(() => {
			// 		// 	this.stopDamping();
			// 		// },);
			// 	}
			// },
			
			
			geyModelFormat(){
				var text_name=this.url.split('?')[0];
				//  文件名
				var name=text_name.substring(0, text_name.lastIndexOf("."));
				//  转码后的后缀名
				var txt=text_name.substring(text_name.lastIndexOf('.')+1).toLowerCase();
				// console.log(text_name,'文件全名');
				// console.log(name,'文件名');
				// console.log(txt,'后缀名');
				this.modelFormat = txt;
			},

			createControls() {
				this.controls = new OrbitControls(this.camera, this.renderer.domElement)
				this.controls.autoRotate = true; //自动旋转
				this.controls.autoRotateSpeed = this.senceSpeed; //场景自动旋转速度
				this.controls.enableDamping = true; //惯性阻尼
				this.controls.maxDistance = 70; //相机最大外移距离
				this.controls.minDistance = 2; //相机最大内移距离
				this.controls.enabled = this.control; //用户操作
				this.controls.rotateSpeed = this.rotateSpeed; //场景旋转速度
				this.controls.enablePan = false; //场景位移
				this.controls.enableRotate = false; //场景旋转
				// this.controls.minPolarAngle = -Infinity;
				// this.controls.maxPolarAngle = Infinity;
			},

			// 导入模型
			loadModel() {
				// uni.showLoading({
				// 	title: '加载中...'
				// })
				// this.$ownerInstance.callMethod('showLoading');
				// console.log('this.modelFormat',this.modelFormat);
				let loader;
				if(this.modelFormat == 'fbx'){ //fbx模型
					loader = new FBXLoader();
				}if(this.modelFormat == 'glb' || this.modelFormat == 'gltf'){ //glb/gltf模型
					loader = new GLTFLoader();
				}if(this.modelFormat == 'obj'){ //obj模型
					loader = new OBJLoader();
				}

				let p1 = new Promise((resolve,reject) => {
					// 导入本地或者服务器上的模型都可以
					loader.load(this.url, (object) => {
						// loader.load('https://threejs.org/examples/models/gltf/RobotExpressive/RobotExpressive.glb', function(gltf) {
						// this.scene.add(gltf.scene);
						let mesh = object;
						if(this.modelFormat == 'fbx'){ //fbx模型
							
						}if(this.modelFormat == 'glb' || this.modelFormat == 'gltf'){ //glb/gltf模型
							mesh = object.scene;
						}if(this.modelFormat == 'obj'){ //obj模型
							
						}
						// #ifdef H5
						console.log(mesh);
						// #endif
						
						// 模型动作
						if(mesh.animations.length){
							this.mixer = new THREE.AnimationMixer( mesh );
							//同时将这个外部模型的动画全部绑定到动画混合器里面
							for (var i=0;i<mesh.animations.length;i++){
								this.mixer.clipAction(mesh.animations[i]).play();
							}
						}
						
						if(this.frontImg){
							var textureLoader = new THREE.TextureLoader();
							console.log(this.frontImg,this.backImg);
							let textureF = textureLoader.load(this.frontImg);
							let textureB = textureLoader.load(this.backImg);
							mesh.traverse( function ( child ) {
							    var materialF = new THREE.MeshPhongMaterial({
							        map:textureF
							    });
								var materialB = new THREE.MeshPhongMaterial({
								    map:textureB
								});
								// console.log('material',materialF);
								// console.log('child',child);
								console.log('child',child);
							    
							    if ( child.isMesh && child.name == "平面") {
							        child.castShadow = true;
							        child.receiveShadow = true;
									
									// child.material.forEach(item => {
									// 	if(item.isMaterial){
									// 		item = 	materialF
									// 	}
									// })
									// child.material[0] = materialB;
									child.material = materialF;
							    } else if ( child.isMesh && child.name == "后") {
									child.castShadow = true;
									child.receiveShadow = true;
									
									// child.material.forEach(item => {
									// 	if(item.isMaterial){
									// 		item = 	materialF
									// 	}
									// })
									// child.material[0] = materialB;
									child.material = materialF;
								};
							});
						}
						
						
						// 模型居中
						// mesh.children.forEach(item => {
						// 	if(item.geometry){
						// 		// item.geometry.computeBoundingBox();
						// 		// item.geometry.center();
						// 		let center = new THREE.Vector3(); 
						// 		item.geometry.computeBoundingBox(); 
						// 		item.geometry.boundingBox.getCenter(center); 
						// 		console.log(center);
						// 		mesh.position.set(center.x,center.y,center.z);
						// 	}
						// })
						
						// var axis = new THREE.Vector3(1,1,0);//向量axis
						// mesh.rotateOnAxis(axis,Math.PI/8);//绕axis轴旋转π/8
						// mesh.rotateX(4);//绕x轴旋转π/4
						
						mesh.scale.multiplyScalar( this.scale );   //定义模型的缩放大小
						this.model = mesh;
						// mesh.castShadow = true;
						// mesh.receiveShadow = true;
						
						setTimeout(() => {
							this.scene.add(mesh);
							resolve();
						}, 100)
					});
				})
				
				// 坐标轴
				// let ah = new THREE.AxesHelper(10)
				// this.scene.add(ah);
				
				Promise.all([p1]).then(() => {
					// uni.hideLoading();
					this.$ownerInstance.callMethod('hideLoading');
				})
			},

			initThree() {
				// 如果返回的不是未定义，说明threejs成功引入
				// console.log('打印场景API', THREE.Scene);

				/* 创建场景对象Scene */
				this.scene = new THREE.Scene();

				// 环境光
				this.ambient.forEach((item) => {
					var ambient = new THREE.AmbientLight( Number('0x'+item.color), item.intensity||1 );
					this.scene.add(ambient);
				})
				
				// 平行光
				this.dirLight.forEach((item) => {
					var dirLight = new THREE.DirectionalLight( Number('0x'+item.color), item.intensity||1 );
					dirLight.position.set( item.positionx, item.positiony, item.positionz );
					dirLight.castShadow = true;
					// dirLight.shadow.camera.top = 180;
					// dirLight.shadow.camera.bottom = - 100;
					// dirLight.shadow.camera.left = - 120;
					// dirLight.shadow.camera.right = 120;
					this.scene.add( dirLight );
				})
				// const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
				// this.scene.add( directionalLight );
				// const dirLight = new THREE.DirectionalLight( 0xffffff );
				// dirLight.position.set( 200, 200, 100 );
				// dirLight.castShadow = true;
				// dirLight.shadow.camera.top = 180;
				// dirLight.shadow.camera.bottom = - 100;
				// dirLight.shadow.camera.left = - 120;
				// dirLight.shadow.camera.right = 120;
				// this.scene.add( dirLight );
				
				// const dirLight2 = new THREE.DirectionalLight( 0xffffff );
				// dirLight2.position.set( -200, -200, -100 );
				// dirLight2.castShadow = true;
				// dirLight2.shadow.camera.top = 180;
				// dirLight2.shadow.camera.bottom = - 100;
				// dirLight2.shadow.camera.left = - 120;
				// dirLight2.shadow.camera.right = 120;
				// this.scene.add( dirLight2 );
				
				// 聚光灯（SpotLight）
				this.dirLight.forEach((item) => {
					var spotLight = new THREE.SpotLight( Number('0x'+item.color), item.intensity||1 );
					spotLight.position.set( item.positionx, item.positiony, item.positionz );
					spotLight.castShadow = true;
					// spotLight.shadow.mapSize.width = 1024;
					// spotLight.shadow.mapSize.height = 1024;
					// spotLight.shadow.camera.near = 500;
					// spotLight.shadow.camera.far = 4000;
					// spotLight.shadow.camera.fov = 30;
					this.scene.add( spotLight );
				})
				// const spotLight = new THREE.SpotLight( 0xfffbe5 );
				// spotLight.position.set( 0, 200, 100 );
				// spotLight.castShadow = true;
				// spotLight.shadow.mapSize.width = 1024;
				// spotLight.shadow.mapSize.height = 1024;
				// spotLight.shadow.camera.near = 500;
				// spotLight.shadow.camera.far = 4000;
				// spotLight.shadow.camera.fov = 30;
				// this.scene.add( spotLight );
				
				// 点光源
				// const light = new THREE.PointLight( 0x00ff00, 1, 0 );
				// light.position.set( 5, 5, 5 );
				// this.scene.add( light );
				
				// 半球光
				// const light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
				// this.scene.add( light );
				// const hemiLight = new THREE.HemisphereLight( 0xffffff, 0x444444 );
				// hemiLight.position.set( 0, 200, 0 );
				// this.scene.add( hemiLight );
				
				// // TextureLoader创建一个纹理加载器对象，可以加载图片作为几何体纹理
				// var textureLoader = new THREE.TextureLoader();
				// // 灯光
				// // 纹理贴图映射到一个矩形平面上
				// var geometry = new THREE.PlaneGeometry(18, 20); //矩形平面
				// // 执行load方法，加载纹理贴图成功后，返回一个纹理对象Texture
				// textureLoader.load('/static/images/light1.png', function(texture) {
				//   var material = new THREE.MeshLambertMaterial({
				//     // color: 0x0000ff,
				//     // 设置颜色纹理贴图：Texture对象作为材质map属性的属性值
				//     map: texture,//设置颜色贴图属性值
				// 	transparent: true
				//   }); //材质对象Material
				//   var mesh = new THREE.Mesh(geometry, material); //网格模型对象Mesh
				//   mesh.position.set(0,12,-10);
				//   this.scene.add(mesh); //网格模型添加到场景中
				// })
				
				// // 底座------------------------------
				// // 纹理贴图映射到一个矩形平面上
				// var geometry = new THREE.PlaneGeometry(20, 20); 
				// //矩形平面// 执行load方法，加载纹理贴图成功后，返回一个纹理对象Texture
				// textureLoader.load('/static/images/bottom.png', function(texture) {
				//   var material = new THREE.MeshLambertMaterial({
				//     // color: 0x0000ff,
				//     // 设置颜色纹理贴图：Texture对象作为材质map属性的属性值
				//     map: texture,//设置颜色贴图属性值
				// 	transparent: true
				//   }); //材质对象Material
				//   var mesh = new THREE.Mesh(geometry, material); //网格模型对象Mesh
				//   mesh.position.set(0,-7,-10);
				//   this.scene.add(mesh); //网格模型添加到场景中
				// })
				/*
				    相机设置
				 */
				if(this.$refs.threeView.offsetWidth || this.$refs.threeView.addEventListener){
					var threeView = this.$refs.threeView
				} else {
					var threeView = this.$refs.threeView.$el
				}
				
				// var threeView = this.$refs.threeView.$el
				var width = threeView.clientWidth
				var height = threeView.clientHeight
				// var width = window.innerWidth; // 窗口宽度
				// // var height = window.innerHeight; // 高度
				// var height = 600; // 高度
				var k = width / height; // 窗口宽高比
				// 创建相机对象（正射投影）
				this.camera = new THREE.PerspectiveCamera(45, k, 1, 1000);
				if(this.cameraData){
					this.camera.position.set(this.cameraData.positionx||0,this.cameraData.positiony||0,this.cameraData.positionz||20); //设置相机的摆放位置
				} else {
					this.camera.position.set(0,0,20); //设置相机的摆放位置
				}
				// this.camera.position.set(this.cameraData.positionx||0,this.cameraData.positiony||0,this.cameraData.positionz||20); //设置相机的摆放位置
				this.camera.lookAt(new THREE.Vector3(0, 0, 0)); // 控制相机的焦点(镜头)位置，决定相机的朝向（取值为3维坐标对象-THREE.Vector3(x,y,z)）

				/*
				    创建渲染器对象
				 */
				this.renderer = new THREE.WebGLRenderer({
					antialias: true,
					alpha: true //设置透明，为true时，背景颜色需要注释掉
				});
				this.renderer.setPixelRatio(window.devicePixelRatio); // 设置设备像素比
				this.renderer.setSize(width, height); // 设置渲染区域尺寸
				// this.renderer.setClearColor(0X333333, 1); // 设置背景颜色
				const element = document.getElementById('threeView')
				// console.log(element);
				element.appendChild(this.renderer.domElement); // body元素中插入canvas对象
				// 输出端编码,解决模型色差问题
				this.renderer.outputEncoding = THREE.sRGBEncoding;
				// 执行渲染操作，指定场景，相机作为参数
				this.render();
			},

			// 动画
			render(time) {
				let delta = this.clock.getDelta(),
				rotateSpeed = -(delta * this.speed);
				
				// 模型旋转
				if(this.model && this.model.rotation){
					//3d模型
					if(this.type === 'model' && !this.isMoving){
						this.model.rotation.y += rotateSpeed;
					//照片模型
					} else if (this.type === 'photo' && !this.isMoving){
						if(this.model.rotation.y > Math.PI/6){
							this.add = false;
						} else if (this.model.rotation.y < -(Math.PI/6)){
							this.add = true;
						}
						this.add ? this.model.rotation.y += rotateSpeed : this.model.rotation.y -= rotateSpeed;
					}
					
					if(this.damping){
						this.model.rotation.x += Number(this.updateOffset.x);
						this.model.rotation.y += Number(this.updateOffset.y);
					}
				}
					
				this.mixer && this.mixer.update(delta);
				
				// if(this.damping && !this.control && (this.offsetX || this.offsetY)){
				// 	if(!dampingClock.running){
				// 		dampingClock.start();
				// 		dampingClock.getDelta();
				// 	}
				// 	this.stopDamping();
				// }
				
				
				this.controls && this.controls.update();
				this.animation = requestAnimationFrame(this.render);
				this.renderer.render(this.scene, this.camera); //执行渲染操作
			},
			
			
			// 重置
			reset(){
				document.getElementById('threeView').removeChild(this.renderer.domElement);
				this.renderer = null;
				this.scene = null;
				this.camera = null;
				this.controls = null;
				cancelAnimationFrame(this.animation);
				
				this.geyModelFormat();
				this.initThree();//加载场景
				this.loadModel();//导入模型
				this.createControls();//控制模型的缩放、平移、旋转操作
			},

		},
		beforeDestroy() {
			this.renderer = null;
			this.scene = null;
			this.camera = null;
			this.controls = null;
			cancelAnimationFrame(this.animation);
			// console.log(this.clock);
		},
	}
</script>

<style lang="scss" scoped>
	.model-container {
		height: 100%;
		
		#threeView {
			height: 100%;
		}
		.svg {
			width: 100rpx;
			height: 100rpx;
			position: absolute;
			left: 50%;
			top: 50%;
			transform: translate(-50%,-50%);
		}
	}
</style>