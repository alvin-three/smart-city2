import * as THREE from 'three'
import camera from '../camera/camera'
export default class AlarmSprite {
  material: THREE.SpriteMaterial
  mesh: THREE.Sprite
  fns: Array<CallableFunction>
  mouse: THREE.Vector2
  eventListIndex: number
  constructor(type = '火警', position = { x: -2, z: -1 }) {
    const textureLoader = new THREE.TextureLoader()
    const typeObj: {
      [key: string]: string
    } = {
      火警: './textures/tag/fire.png',
      治安: './textures/tag/jingcha.png',
      电力: './textures/tag/e.png'
    }
    const map = textureLoader.load(typeObj[type])
    this.material = new THREE.SpriteMaterial({
      map: map,
      blending: THREE.AdditiveBlending
    })
    this.mesh = new THREE.Sprite(this.material)

    // 修改位置
    this.mesh.position.set(position.x, 3.5, position.z)

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
    this.eventListIndex = 0
  }
  onClick(fn: CallableFunction) {
    this.fns.push(fn)
  }
  remove() {
    this.mesh.remove()
    this.mesh.removeFromParent()
    this.mesh.material.dispose()
    this.mesh.geometry.dispose()
  }
}
