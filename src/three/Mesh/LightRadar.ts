import * as THREE from 'three'
import gsap from 'gsap'
import vertexShader from '../shader/lightRadar/vertexShader.glsl?raw'
import fragmentShader from '../shader/lightRadar/fragmentShader.glsl?raw'
export default class LightRadar {
  material: THREE.ShaderMaterial
  mesh: THREE.Mesh
  geometry: THREE.PlaneGeometry
  eventListIndex: number
  constructor(radius = 2, position = { x: 0, z: 0 }, color = 0xffff00) {
    // 雷达，平面
    this.geometry = new THREE.PlaneGeometry(radius, radius)
    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      uniforms: {
        uTime: {
          value: 0
        },
        uColor: {
          value: new THREE.Color(color)
        }
      }
    })
    this.mesh = new THREE.Mesh(this.geometry, this.material)

    // 设置位置
    this.mesh.position.set(position.x, 0.4, position.z)
    this.mesh.rotation.x = -Math.PI / 2

    gsap.to(this.material.uniforms.uTime, {
      value: 1,
      duration: 1,
      repeat: -1,
      //   yoyo: true,
      ease: 'none'
    })
    this.eventListIndex = 0
  }
  remove() {
    this.mesh.remove()
    this.mesh.removeFromParent()
    this.mesh.material?.dispose()
    this.mesh.geometry.dispose()
  }
}
