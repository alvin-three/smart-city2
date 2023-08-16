import * as THREE from 'three'
import { GUI } from 'dat.gui'
import Stats from 'three/examples/jsm/libs/stats.module'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
import { useEffect, useRef } from 'react'
// 八叉树
import { Octree } from 'three/examples/jsm/math/Octree'
// 八叉树辅助工具
import { OctreeHelper } from 'three/examples/jsm/helpers/OctreeHelper'
// 胶囊
import { Capsule } from 'three/examples/jsm/math/Capsule'
export default function Home() {
  const container = useRef<HTMLDivElement>(null)
  useEffect(() => {
    init()
  }, [])
  // 辅助函数
  const gui = new GUI()
  const stats = new Stats()

  const init = () => {
    const clock = new THREE.Clock()

    // 场景
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x88ccee)
    scene.fog = new THREE.Fog(0x88ccee, 0, 50)
    // 相机
    const camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.001,
      1000
    )
    camera.position.set(0, 5, 10)

    // renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.VSMShadowMap
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    // scene.add(camera)
    container.current?.appendChild(renderer.domElement)

    // 控制器
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.target.set(0, 0, 0)
    const animate = () => {
      stats.update()
      controls.update()
      // 回切换相机
      renderer.render(scene, camera)
      requestAnimationFrame(animate)
    }
    document.body.appendChild(stats.dom)

    //  加载hdr效果
    const loader = new RGBELoader()
    loader.load('./hdr/023.hdr', (texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping
      texture.format = THREE.RGBAFormat
      scene.background = texture
      scene.environment = texture
    })

    // 添加球
    const spherGeomtry = new THREE.SphereGeometry(0.1, 30, 30)
    const material = new THREE.MeshPhysicalMaterial({
      transmission: 1, // 气泡 类的效果 ，玻璃等透明效果
      opacity: 1,
      color: 0xffffff,
      roughness: 0, // 粗糙度
      reflectivity: 0.5,
      ior: 2.33,
      iridescenceIOR: 1.33
    })
    // 气泡反光形成的 彩色效果
    material._iridescence = 1
    const mesh = new THREE.Mesh(spherGeomtry, material)
    scene.add(mesh)
    animate()
  }

  return <div className="container" ref={container}></div>
}
