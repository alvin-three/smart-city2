import * as THREE from 'three'
import gsap from 'gsap'
import vertexShader from '../shader/lightWall/vertexShader.glsl?raw'
import fragmentShader from '../shader/lightWall/fragmentShader.glsl?raw'
export default class LightWall {
  material: THREE.ShaderMaterial
  mesh: THREE.Mesh
  geometry: THREE.BufferGeometry
  constructor() {
    // 设置集合体
    this.geometry = new THREE.CylinderGeometry(5, 5, 2, 32, 1, true)
    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      side: THREE.DoubleSide
    })
    this.mesh = new THREE.Mesh(this.geometry, this.material)
    this.mesh.position.set(0, 1, 0)

    // 计算高度

    this.mesh.geometry.computeBoundingBox()
    const { min, max } = this.mesh.geometry.boundingBox as THREE.Box3
    const uHeight = max.y - min.y

    ;(this.mesh.material as THREE.ShaderMaterial).uniforms.uHeight = {
      value: uHeight
    }

    gsap.to(this.mesh.scale, {
      x: 2,
      z: 2,
      duration: 1,
      repeat: -1,
      yoyo: true
    })
  }
}
