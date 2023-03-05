import * as THREE from 'three'
import gsap from 'gsap'
import vertexShader from '../shader/lightRadar/vertexShader.glsl?raw'
import fragmentShader from '../shader/lightRadar/fragmentShader.glsl?raw'
export default class LightRadar {
  material: THREE.ShaderMaterial
  mesh: THREE.Mesh
  geometry: THREE.PlaneGeometry
  constructor() {
    // 雷达，平面
    this.geometry = new THREE.PlaneGeometry(2, 2, 2)
    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      uniforms: {
        uTime: {
          value: 0
        },
        uColor: {
          value: new THREE.Color('#ff00ff')
        }
      }
    })
    this.mesh = new THREE.Mesh(this.geometry, this.material)

    // 设置位置
    this.mesh.position.set(-8, 0.4, 8)
    this.mesh.rotation.x = -Math.PI / 2

    gsap.to(this.material.uniforms.uTime, {
      value: 1,
      duration: 1,
      repeat: -1,
      //   yoyo: true,
      ease: 'none'
    })
  }
}
