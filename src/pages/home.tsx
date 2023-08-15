import * as THREE from 'three'
import { GUI } from 'dat.gui'
import Stats from 'three/examples/jsm/libs/stats.module'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { useEffect, useRef } from 'react'
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
    scene.add(camera)
    container.current?.appendChild(renderer.domElement)

    // 控制器
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.target.set(0, 0, 0)
    const animate = () => {
      stats.update()
      controls.update()
      renderer.render(scene, camera)
      requestAnimationFrame(animate)
    }
    document.body.appendChild(stats.dom)
    animate()

    //  创建平面
    const planeGeometry = new THREE.PlaneGeometry(20, 20, 1, 1)
    const planeMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide
    })
    const plane = new THREE.Mesh(planeGeometry, planeMaterial)
    plane.receiveShadow = true
    plane.rotation.x = -Math.PI / 2
    scene.add(plane)
  }

  return <div className="container" ref={container}></div>
}
