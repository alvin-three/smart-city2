import * as THREE from 'three'
import gsap from 'gsap'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'
import { AnimationAction } from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import eventBus from '../../utils/eventHub'
import cameraModule from '../camera/camera'
export default class CreateCity {
  scene: THREE.Scene
  loader: GLTFLoader
  mixer!: THREE.AnimationMixer
  clips!: THREE.AnimationClip
  action!: AnimationAction
  gltf!: GLTF
  curve!: THREE.CatmullRomCurve3
  curveProgress = 0
  redCar!: THREE.Mesh
  constructor(scene: THREE.Scene) {
    this.scene = scene
    this.loader = new GLTFLoader()
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('./draco/')
    this.loader.setDRACOLoader(dracoLoader)
    this.loader.load('./models/city4.glb', (gltf: GLTF) => {
      this.gltf = gltf
      scene.add(gltf.scene)
      console.log(gltf, 'asdf')
      gltf.scene.traverse((child) => {
        if (child.name === '热气球') {
          // 动画混合器
          this.mixer = new THREE.AnimationMixer(child)
          // 动画片段
          this.clips = gltf.animations[1]
          // 将动画切片
          this.action = this.mixer.clipAction(this.clips)
          // 播放动画
          this.action.play()
        }
        if (child.name === '汽车园区轨迹') {
          // 根据汽车轨迹生成路线图
          const line = child as THREE.Line
          line.visible = false
          // 不展示线
          const points = []
          const count = line.geometry.attributes.position.count
          for (let i = 0; i < count; i++) {
            points.push(
              new THREE.Vector3(
                line.geometry.attributes.position.getX(i),
                line.geometry.attributes.position.getY(i),
                line.geometry.attributes.position.getZ(i)
              )
            )
          }
          this.curve = new THREE.CatmullRomCurve3(points)
          this.curveProgress = 0
          this.carAnimation()
        }
        if (child.name === 'redcar') {
          this.redCar = child as THREE.Mesh
        }
      })
      // 添加相机
      gltf.cameras.forEach((camera) => {
        cameraModule.add(camera.name, camera)
      })
    })
    eventBus.on('actionClick', (i: number) => {
      this.action.reset()
      this.clips = this.gltf.animations[i]
      this.action = this.mixer.clipAction(this.clips)
      this.action.play()
    })
  }
  update(time: number) {
    // 需要根据事件来更新动画
    if (this.mixer) {
      this.mixer.update(time)
    }
  }
  carAnimation() {
    gsap.to(this, {
      curveProgress: 0.99,
      repeat: -1,
      duration: 10,
      onUpdate: () => {
        // 根据进度来找到点，即得到具体的点位置信息，更新到汽车上就可以了
        const point = this.curve.getPoint(this.curveProgress)
        this.redCar.position.set(point.x, point.y, point.z)
        // 修改汽车的朝向
        const nextPointValue = this.curveProgress + 0.001
        if (nextPointValue < 1) {
          const nextPoint = this.curve.getPoint(nextPointValue)
          this.redCar.lookAt(nextPoint)
        }
      }
    })
  }
}
