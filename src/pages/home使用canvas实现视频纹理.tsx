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
      drawVideoText()
      // 回切换相机
      renderer.render(scene, camera)
      requestAnimationFrame(animate)
    }
    document.body.appendChild(stats.dom)

    // 创建canvas对象
    const canvas = document.createElement('canvas')
    canvas.width = 1080
    canvas.height = 1080
    canvas.style.position = 'absolute'
    canvas.style.top = '0px'
    canvas.style.left = '0px'
    canvas.style.zIndex = '1'
    canvas.style.transformOrigin = '0 0'
    canvas.style.transform = 'scale(0.1)'
    const context = canvas.getContext('2d')
    // 视屏纹理
    const video = document.createElement('video')
    video.src = './video/ui_chat.mp4'
    video.muted = true
    video.loop = true
    video.play()
    const texture = new THREE.CanvasTexture(canvas)
    // 平面
    const planeGeometry = new THREE.PlaneGeometry(2, 2, 1, 1)
    const planeMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      map: texture,
      alphaMap: texture
    })
    const plane = new THREE.Mesh(planeGeometry, planeMaterial)
    plane.position.set(0, -1, 0)
    scene.add(plane)

    const drawVideoText = () => {
      // 清楚画布
      context?.clearRect(0, 0, canvas.width, canvas.height)
      context?.drawImage(video, 0, 0, canvas.width, canvas.height)

      // 写上文字
      context!.textAlign = 'center'
      context!.textBaseline = 'middle'
      context!.font = 'bold 100px Arial'
      context!.fillStyle = 'rgba(255,255,255,1)'
      context!.fillText('Hello World', canvas.width / 2, canvas.height / 2)

      texture.needsUpdate = true
      planeMaterial.needsUpdate = true
    }
    document.body.appendChild(canvas)
    animate()
  }

  return <div className="container" ref={container}></div>
}
