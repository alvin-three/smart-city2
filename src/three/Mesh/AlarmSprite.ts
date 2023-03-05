import * as THREE from 'three'
import camera from '../camera/camera'
export default class AlarmSprite {
  material: THREE.SpriteMaterial
  mesh: THREE.Sprite
  fns: Array<CallableFunction>
  mouse: THREE.Vector2
  constructor() {
    const textureLoader = new THREE.TextureLoader()
    const map = textureLoader.load('./textures/alarm1.png')
    this.material = new THREE.SpriteMaterial({ map: map })
    this.mesh = new THREE.Sprite(this.material)

    // 修改位置
    this.mesh.position.set(-4.3, 3.5, -1.5)

    // 点击事件
    this.fns = []
    this.mouse = new THREE.Vector2()
    const raycaster = new THREE.Raycaster()
    window.addEventListener('click', (event) => {
      this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1
      this.mouse.y = -((event.clientY / window.innerHeight) * 2 - 1)
      raycaster.setFromCamera(this.mouse, camera)
      const objs = raycaster.intersectObject(this.mesh)
      if (objs.length > 0) {
        // 监测是否点击到了，如果是就执行函数
        this.fns.forEach((fn) => {
          fn(event)
        })
      }
    })
  }
  onClick(fn: CallableFunction) {
    this.fns.push(fn)
  }
}
