import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
import { GUI } from 'dat.gui'
import Stats from 'three/examples/jsm/libs/stats.module'
import { Clouds, CloudPlus } from './Clouds'
// 封装在一起
export default class ThreePlus {
  domElement: HTMLDivElement
  scene!: THREE.Scene
  camera!: THREE.Camera
  clock: THREE.Clock
  renderer!: THREE.WebGLRenderer
  gui!: GUI
  stats!: Stats
  controls!: OrbitControls
  ambientLight!: THREE.AmbientLight
  width: number
  height: number
  constructor(selector: string) {
    this.domElement = document.querySelector(selector) as HTMLDivElement
    this.width = this.domElement.clientWidth
    this.height = this.domElement.clientHeight
    this.clock = new THREE.Clock()
    this.init()
  }
  init() {
    this.initScene()
    this.initCamera()
    this.initRenderer()
    this.initOrtControls()
    this.initHelps()
    this.animate()
  }
  initHelps() {
    this.gui = new GUI()
    this.stats = new Stats()
    document.body.appendChild(this.stats.dom)
  }
  initOrtControls() {
    const controls = new OrbitControls(this.camera, this.renderer.domElement)
    controls.target.set(0, 0, 0)
    this.controls = controls
  }
  initScene() {
    this.scene = new THREE.Scene()
  }
  initCamera() {
    const camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.001,
      1000
    )
    camera.position.set(0, 10, 50)
    camera.aspect = this.width / this.height
    this.camera = camera
  }
  initRenderer() {
    // renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true
    })
    renderer.setSize(this.width, this.height)
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.shadowMap.enabled = true
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.shadowMap.type = THREE.VSMShadowMap
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 0.75
    this.renderer = renderer
    console.log(this.renderer.info)
    this.domElement.appendChild(this.renderer.domElement)
  }
  setLight() {
    // 添加环境光
    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.2)
    this.scene.add(this.ambientLight)
    const light1 = new THREE.DirectionalLight(0xffffff, 0.1)
    light1.position.set(0, 10, 10)
    const light2 = new THREE.DirectionalLight(0xffffff, 0.1)
    light2.position.set(0, 10, -10)
    const light3 = new THREE.DirectionalLight(0xffffff, 0.6)
    light3.position.set(10, 10, 10)
    light1.castShadow = true
    light2.castShadow = true
    light3.castShadow = true
    light1.shadow.mapSize.width = 10240
    light1.shadow.mapSize.height = 10240
    light2.shadow.mapSize.width = 10240
    light2.shadow.mapSize.height = 10240
    light3.shadow.mapSize.width = 10240
    light3.shadow.mapSize.height = 10240
    this.scene.add(light1, light2, light3)
  }
  animate() {
    this.stats.update()
    this.controls.update()
    // 回切换相机
    this.renderer.render(this.scene, this.camera)
    requestAnimationFrame(this.animate.bind(this))
  }
  hdrLoader(url: string): Promise<THREE.DataTexture> {
    const hdrLoader = new RGBELoader()
    return new Promise((resolve, reject) => {
      hdrLoader.load(url, (hdr) => {
        resolve(hdr)
      })
    })
  }
  setBg(url: string) {
    // 设置背景
    this.hdrLoader(url).then((texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping
      texture.anisotropy = 16
      texture.format = THREE.RGBAFormat
      this.scene.background = texture
      this.scene.environment = texture
    })
  }
  // 添加云朵
  addClouds() {
    const clouds = new Clouds()
    this.scene.add(clouds.mesh)
  }
  // 优化版
  addCloudsPlus() {
    const clouds = new CloudPlus()
    this.scene.add(clouds.mesh)
  }
}
