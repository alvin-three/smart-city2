import * as THREE from 'three'
import gsap from 'gsap'
import vertexShader from '../shader/lightWall/vertexShader.glsl?raw'
import fragmentShader from '../shader/lightWall/fragmentShader.glsl?raw'
export default class LightWall {
  material: THREE.ShaderMaterial
  mesh: THREE.Mesh
  geometry: THREE.BufferGeometry
  eventListIndex: number
  constructor(
    radius = 5,
    scale = 2,
    position = { x: 0, z: 0 },
    color = 0xff0000
  ) {
    // 设置集合体
    this.geometry = new THREE.CylinderGeometry(radius, radius, 2, 32, 1, true)
    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      side: THREE.DoubleSide
    })
    this.mesh = new THREE.Mesh(this.geometry, this.material)
    this.mesh.position.set(position.x, 1, position.z)

    // 计算高度

    this.mesh.geometry.computeBoundingBox()
    const { min, max } = this.mesh.geometry.boundingBox as THREE.Box3
    const uHeight = max.y - min.y

    ;(this.mesh.material as THREE.ShaderMaterial).uniforms.uHeight = {
      value: uHeight
    }

    gsap.to(this.mesh.scale, {
      x: scale,
      z: scale,
      duration: 1,
      repeat: -1,
      yoyo: true
    })
    this.eventListIndex = 0
  }
  remove() {
    this.mesh.remove()
    this.mesh.removeFromParent()
    this.mesh.material.dispose()
    this.mesh.geometry.dispose()
  }
}
