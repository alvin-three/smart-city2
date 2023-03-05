import * as THREE from 'three'
import gsap from 'gsap'
class FlyLight {
  geometry: THREE.BufferGeometry
  material: THREE.Material
  mesh: THREE.Object3D
  texture: THREE.Texture
  constructor() {
    // 从点得到曲线
    const lightPoints = [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(5, 5, 0),
      new THREE.Vector3(12, 0, 0)
    ]
    // 创建曲线
    const lightLine = new THREE.CatmullRomCurve3(lightPoints)
    // 根据曲线得到 几何体
    this.geometry = new THREE.TubeGeometry(lightLine, 100, 0.5, 2, false)
    // 材质
    // 添加纹理
    const textureLoader = new THREE.TextureLoader()
    this.texture = textureLoader.load('/textures/z_11.png')

    // 物体是有管道得来的，因此，纵向上只看得到一半的纹理
    this.texture.repeat.set(1, 2)
    // 重复
    this.texture.wrapS = THREE.RepeatWrapping
    // 纵向需要镜像重复，才能看到
    this.texture.wrapT = THREE.MirroredRepeatWrapping
    this.material = new THREE.MeshBasicMaterial({
      //   color: new THREE.Color(0xfff000)
      map: this.texture,
      transparent: true
    })
    // 设置纹理偏移，即动起来了
    gsap.to(this.texture.offset, {
      x: -1,
      duration: 10,
      ease: 'none', // 线性变化
      repeat: -1
    })
    this.mesh = new THREE.Mesh(this.geometry, this.material)
  }
}

export const useFlyline = () => {
  const flyLight = new FlyLight()
  return [flyLight]
}
