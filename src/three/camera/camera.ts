import * as THREE from 'three'
import eventBus from '../../utils/eventHub'

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  100000
)
camera.position.set(1000, 1000, 1000)

class CameraModule {
  activeCamera: THREE.PerspectiveCamera | THREE.Camera
  collection: {
    default: THREE.PerspectiveCamera
    [key: string]: THREE.Camera // 其他相机视角
  }
  constructor() {
    this.activeCamera = camera
    this.collection = {
      default: camera
    }
    // 监听切换相机事件
    eventBus.on('toggleCamera', (name: string) => {
      this.setActive(name)
    })
  }
  add(name: string, camera: THREE.Camera) {
    this.collection[name] = camera
  }
  setActive(name: string) {
    this.activeCamera = this.collection[name]
  }
}

export default new CameraModule()
