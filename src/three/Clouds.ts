import * as THREE from 'three'
import gsap from 'gsap'
import { Float32BufferAttribute } from 'three'
export class Clouds {
  materials: THREE.SpriteMaterial[]
  mesh: THREE.Group
  // 雪碧图
  // height, 云的高度， num 生成云的数量 ，size 云的范围大小， scale是 每个云的大小
  constructor(
    height = 10,
    num = 300,
    size = 10,
    scale = 10,
    autoRotate = true
  ) {
    const textureLoader = new THREE.TextureLoader()
    const map1 = textureLoader.load('./textures/cloud/cloud1.jfif')
    const map2 = textureLoader.load('./textures/cloud/cloud2.jfif')
    const map3 = textureLoader.load('./textures/cloud/cloud3.jpg')

    // 生成材质
    const material1 = new THREE.SpriteMaterial({
      map: map2,
      color: 0xffffff,
      transparent: true,
      alphaMap: map1,
      blending: THREE.AdditiveBlending,
      depthTest: false,
      depthWrite: false
    })
    const material2 = new THREE.SpriteMaterial({
      map: map3,
      color: 0xffffff,
      transparent: true,
      alphaMap: map2,
      blending: THREE.AdditiveBlending,
      depthTest: false,
      depthWrite: false
    })
    const material3 = new THREE.SpriteMaterial({
      map: map1,
      color: 0xffffff,
      transparent: true,
      alphaMap: map3,
      blending: THREE.AdditiveBlending,
      depthTest: false,
      depthWrite: false
    })
    this.materials = [material1, material2, material3]

    // 循环生成精灵
    this.mesh = new THREE.Group()
    for (let i = 0; i < num; i++) {
      // 随机材质下标
      const index = Math.floor(Math.random() * 3)
      const material = this.materials[index]
      // 生成精灵
      const sprite = new THREE.Sprite(material)
      // 设置大小位置等信息
      // 大小
      const randomSize = Math.random() * size
      sprite.scale.set(randomSize, randomSize, randomSize)
      //随机位置
      const randomX = (Math.random() - 0.5) * 2 * scale // -scale -> scale
      const randomY = Math.random() * (height / 2) + height
      const randomZ = (Math.random() - 0.5) * 2 * scale // -scale -> scale
      sprite.position.set(randomX, randomY, randomZ)
      this.mesh.add(sprite)
    }
    if (autoRotate) {
      this.animate()
    }
  }
  animate() {
    gsap.to(this.mesh.rotation, {
      y: Math.PI * 2,
      duration: 120,
      repeat: -1
    })
  }
}

export class CloudPlus {
  materials: THREE.PointsMaterial[]
  mesh = new THREE.Group()
  height: number
  size: number
  scale: number
  num: number

  // 雪碧图
  // height, 云的高度， num 生成云的数量 ，size 云的范围大小， scale是 每个云的大小
  constructor(
    height = 10,
    num = 100,
    size = 20,
    scale = 10,
    autoRotate = true
  ) {
    this.height = height
    this.size = size
    this.scale = scale
    this.num = num
    const textureLoader = new THREE.TextureLoader()
    const map1 = textureLoader.load('./textures/cloud/cloud1.jfif')
    const map2 = textureLoader.load('./textures/cloud/cloud2.jfif')
    const map3 = textureLoader.load('./textures/cloud/cloud3.jpg')

    // 生成材质
    const material1 = new THREE.PointsMaterial({
      map: map2,
      color: 0xffffff,
      transparent: true,
      alphaMap: map1,
      blending: THREE.AdditiveBlending,
      depthTest: false,
      depthWrite: false,
      size: 0.2 * size
    })
    const material2 = new THREE.PointsMaterial({
      map: map3,
      color: 0xffffff,
      transparent: true,
      alphaMap: map2,
      blending: THREE.AdditiveBlending,
      depthTest: false,
      depthWrite: false,
      size: 0.5 * size
    })
    const material3 = new THREE.PointsMaterial({
      map: map1,
      color: 0xffffff,
      transparent: true,
      alphaMap: map3,
      blending: THREE.AdditiveBlending,
      depthTest: false,
      depthWrite: false,
      size: 0.8 * size
    })
    const material4 = new THREE.PointsMaterial({
      map: map2,
      color: 0xffffff,
      transparent: true,
      alphaMap: map1,
      blending: THREE.AdditiveBlending,
      depthTest: false,
      depthWrite: false,
      size: 1 * size
    })
    this.materials = [material1, material2, material3, material4]
    // 根据材质生成粒子群
    for (let i = 0; i < this.materials.length; i++) {
      // const geometry =
      const material = this.materials[i]
      const geometry = this.generateGeometry()
      const point = new THREE.Points(geometry, material)
      this.mesh.add(point)
    }
    if (autoRotate) {
      this.animate()
    }
  }
  generateGeometry(num = this.num) {
    const points = []
    for (let i = 0; i < num; i++) {
      const randomX = (Math.random() - 0.5) * 2 * this.scale // -scale -> scale
      const randomY = Math.random() * (this.height / 2) + this.height
      const randomZ = (Math.random() - 0.5) * 2 * this.scale // -scale -> scale
      points.push(randomX, randomY, randomZ)
    }
    // 根据粒子生成 几何体
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new Float32BufferAttribute(points, 3))
    return geometry
  }
  animate() {
    this.mesh.children.forEach((item, i) => {
      gsap.to(item.rotation, {
        duration: 20 * i,
        repeat: -1,
        ease: 'linear',
        y: Math.PI * 2
      })
    })
  }
}
