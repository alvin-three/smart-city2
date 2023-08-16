import * as THREE from 'three'
import { GUI } from 'dat.gui'
import Stats from 'three/examples/jsm/libs/stats.module'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
import { Refractor } from 'three/examples/jsm/objects/Refractor'
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
    // scene.fog = new THREE.Fog(0x88ccee, 0, 50)
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
      antialias: true
    })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.shadowMap.enabled = true
    renderer.outputColorSpace = THREE.SRGBColorSpace
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

    // 视屏纹理
    const video = document.createElement('video')
    video.src = './video/keji1.mp4'
    video.muted = true
    video.loop = true
    video.play()
    const videoTexture = new THREE.VideoTexture(video)
    // 平面
    const planeGeometry = new THREE.PlaneGeometry(2, 2, 1, 1)
    const plane = new THREE.Mesh(
      planeGeometry,
      new THREE.MeshBasicMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        map: videoTexture,
        alphaMap: videoTexture
      })
    )
    plane.position.set(0, -1, 0)
    scene.add(plane)

    animate()
  }

  return <div className="container" ref={container}></div>
}
