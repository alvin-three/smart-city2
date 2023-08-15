import * as THREE from 'three'
import { GUI } from 'dat.gui'
import Stats from 'three/examples/jsm/libs/stats.module'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
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
    scene.add(camera)
    container.current?.appendChild(renderer.domElement)

    // 控制器
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.target.set(0, 0, 0)
    const animate = () => {
      const deltTime = clock.getDelta()
      updatePlayer(deltTime)
      resetPlayer()
      stats.update()
      controls.update()
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

    // 创建一个八叉树
    const worldOctree = new Octree()

    // 创建碰撞物体
    // 上下两个端点，然后上下两个半圆（头和角），凑成一个胶囊，
    // 模拟 1.7m的人
    const playerCollider = new Capsule(
      new THREE.Vector3(0, 0.35, 0), // 下端点
      new THREE.Vector3(0, 1.35, 0), // 上端点
      0.35 // 半圆的半径
    )

    // 创建一个胶囊物体,只是为了展示用
    const capsuleGeometry = new THREE.CapsuleGeometry(0.35, 1, 32)
    const capsuleMaterial = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      side: THREE.DoubleSide
    })
    const capsule = new THREE.Mesh(capsuleGeometry, capsuleMaterial)
    capsule.position.set(0, 0.85, 0)
    scene.add(capsule)

    // 设置重力
    const gravity = -9.8
    // 玩家速度
    const playerVelocity = new THREE.Vector3(0, 0, 0)
    // 玩家的方向
    const playerDirection = new THREE.Vector3(0, 0, 0)

    // 更新玩家的位置信息
    const updatePlayer = (deltTime: number) => {
      // deltTime 每帧之间的时间间隔，即每帧y运动了多少
      playerVelocity.y += gravity * deltTime
      // 计算玩家移动的距离
      const playerDistance = playerVelocity.clone().multiplyScalar(deltTime)
      // 移动玩家
      playerCollider.translate(playerDistance)
      //更新胶囊的位置
      playerCollider.getCenter(capsule.position)
    }

    // 恢复位置
    const resetPlayer = () => {
      if (capsule.position.y < -20) {
        // 重置
        playerCollider.start.set(0, 2.35, 0)
        playerCollider.end.set(0, 3.35, 0)
        playerCollider.radius = 0.35
        // 速度也得重置
        playerVelocity.set(0, 0, 0)
        // 方向
        playerDirection.set(0, 0, 0)
      }
    }

    animate()
  }

  return <div className="container" ref={container}></div>
}
