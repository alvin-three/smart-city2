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
      const time = clock.getElapsedTime()
      stats.update()
      controls.update()
      rotateCube(time)
      cubeCamera.update(renderer, scene)
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
      // 立方体的环境纹理 添加到 小球上去
      material.envMap = cubeTarget.texture
      plane.material.shader = cubeTarget.texture
    })

    // 添加球
    const spherGeomtry = new THREE.SphereGeometry(1, 30, 30)
    const material = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      roughness: 0, // 粗糙度
      metalness: 1
    })
    const mesh = new THREE.Mesh(spherGeomtry, material)
    mesh.position.set(0, 0, 0)
    scene.add(mesh)

    // 周围物体
    const cubeGeometry = new THREE.BoxGeometry(1, 1, 1)
    const cube = new THREE.Mesh(
      cubeGeometry,
      new THREE.MeshPhysicalMaterial({
        color: 0xffffff
      })
    )
    cube.position.set(3, 0, 0)
    scene.add(cube)

    // 立方体的纹理，需要缓存起来，
    const cubeTarget = new THREE.WebGLCubeRenderTarget(512)
    // 创建立方体相机，保存观察到的纹理
    const cubeCamera = new THREE.CubeCamera(0.01, 1000, cubeTarget)

    const rotateCube = (time: number) => {
      // cube.rotation.y += deltTime * 10
      cube.position.x = Math.sin(time * 3) * 3
      cube.position.z = Math.cos(time * 3) * 3
    }

    // 镜面
    const planeGeometry = new THREE.PlaneGeometry(10, 10)
    const plane = new Refractor(planeGeometry, {
      color: 0xffffff,
      textureWidth: 1024,
      textureHeight: 1024
    })
    plane.position.set(0, -1, 0)
    plane.rotation.x = -Math.PI / 2
    scene.add(plane)

    animate()
  }

  return <div className="container" ref={container}></div>
}
