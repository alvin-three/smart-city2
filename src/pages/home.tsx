import * as THREE from 'three'
import { GUI } from 'dat.gui'
import Stats from 'three/examples/jsm/libs/stats.module'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
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
    console.log(renderer.info)
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

    // 添加物体
    // 形状和材质必须相同，只是位置不同
    const geometry = new THREE.TorusKnotGeometry(1, 0.3, 100, 16)
    const material = new THREE.MeshBasicMaterial({ color: 0xffff00 })
    // const torusKnot = new THREE.Mesh(geometry, material)
    // torusKnot.position.set(0, 2, 0)
    // scene.add(torusKnot)
    // 常规写法
    // for (let i = 0; i < 1000; i++) {
    //   const torusKnot = new THREE.Mesh(geometry, material)
    //   torusKnot.position.set(
    //     Math.random() * 100 - 50,
    //     Math.random() * 100 - 50,
    //     Math.random() * 100 - 50
    //   )
    //   scene.add(torusKnot)
    // }
    const instanceMesh = new THREE.InstancedMesh(geometry, material, 10000)
    for (let i = 0; i < 10000; i++) {
      const position = new THREE.Vector3(
        Math.random() * 100 - 50,
        Math.random() * 100 - 50,
        Math.random() * 100 - 50
      )
      const rotation = new THREE.Euler(
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2
      )
      // 用四元角来标识旋转
      const quaterinion = new THREE.Quaternion().setFromEuler(rotation)
      const scale = new THREE.Vector3(
        Math.random() * 0.5 + 0.5,
        Math.random() * 0.5 + 0.5,
        Math.random() * 0.5 + 0.5
      )
      // 创建矩阵
      const matrix = new THREE.Matrix4()
      // 组合位置，旋转角度，缩放信息
      matrix.compose(position, quaterinion, scale)
      // 设置矩阵
      instanceMesh.setMatrixAt(i, matrix)
    }
    scene.add(instanceMesh)
    animate()
  }

  return <div className="container" ref={container}></div>
}
