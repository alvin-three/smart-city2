// 使用着色器来写箭头
import * as THREE from 'three'
import gsap from 'gsap'
import vertexShader from './shader/flyline/vertexShader.glsl?raw'
import fragmentShader from './shader/flyline/fragmentShader.glsl?raw'
class FlayShader {
  geometry: THREE.BufferGeometry
  material: THREE.ShaderMaterial
  mesh: THREE.Object3D
  //   texture: THREE.Texture
  constructor() {
    // 从点得到曲线
    const lightPoints = [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(-4, 5, 0),
      new THREE.Vector3(-12, 0, 0)
    ]
    // 创建曲线
    const lightLine = new THREE.CatmullRomCurve3(lightPoints)

    // 根据线得到 对应的顶点
    const points = lightLine.getPoints(1000)

    // 创建几何体
    this.geometry = new THREE.BufferGeometry().setFromPoints(points)

    // 添加属性
    const aSizeArray = new Float32Array(points.length)
    for (let i = 0; i < aSizeArray.length; i++) {
      aSizeArray[i] = i
    }
    this.geometry.setAttribute(
      'aSize',
      new THREE.BufferAttribute(aSizeArray, 1)
    )
    // 创建材质
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: {
          value: 0
        },
        uLength: {
          value: points.length
        },
        uColor: {
          value: new THREE.Color(0xffff00)
        }
      },
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    })
    this.mesh = new THREE.Points(this.geometry, this.material)

    gsap.to(this.material.uniforms.uTime, {
      value: 1000,
      duration: 2,
      repeat: -1,
      ease: 'none'
    })
  }
}

export const useFlylineShader = () => {
  const flyShader = new FlayShader()
  return [flyShader]
}
