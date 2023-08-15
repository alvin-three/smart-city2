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
    // 键盘状态
    const keyStates: {
      [key: string]: boolean
    } = {
      KeyW: false,
      KeyA: false,
      KeyS: false,
      KeyD: false,
      Space: false,
      isDown: false
    }
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

    const backCamera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.001,
      1000
    )
    backCamera.position.set(0, 5, -10)

    let activeCamera = camera
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
    // const controls = new OrbitControls(camera, renderer.domElement)
    // controls.target.set(0, 0, 0)
    const animate = () => {
      const deltTime = clock.getDelta()
      controlPlayer(deltTime)
      updatePlayer(deltTime)
      resetPlayer()
      stats.update()
      // controls.update()
      // 回切换相机
      renderer.render(scene, activeCamera)
      // 更新动画
      if (mixer) {
        // activeAction
        mixer.update(deltTime)
      }
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

    // 创建楼梯
    for (let i = 0; i < 15; i++) {
      const boxGeometry = new THREE.BoxGeometry(1, 1, 0.15)
      const boxMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ff00,
        side: THREE.DoubleSide
      })
      const box = new THREE.Mesh(boxGeometry, boxMaterial)
      box.position.y += i * 0.15
      box.position.z += i * 0.25
      plane.add(box)
    }

    // 创建group，碰撞检测的是以group为单位更方便
    const group = new THREE.Group()
    group.add(plane)
    scene.add(group)
    // 创建一个八叉树
    const worldOctree = new Octree()
    worldOctree.fromGraphNode(group)
    // 创建八叉树辅助工具
    // const octreeHelper = new OctreeHelper(worldOctree)
    // scene.add(octreeHelper)
    // 创建碰撞物体
    // 上下两个端点，然后上下两个半圆（头和角），凑成一个胶囊，
    // 模拟 1.7m的人
    const playerCollider = new Capsule(
      new THREE.Vector3(0, 0.35, 0), // 下端点
      new THREE.Vector3(0, 1.35, 0), // 上端点
      0.35 // 半圆的半径
    )

    // 添加光源
    const light = new THREE.HemisphereLight(0xffffff, 0xffffff, 2)
    scene.add(light)
    // 加载模型
    const loader = new GLTFLoader()
    const actions: {
      [key: string]: THREE.AnimationAction
    } = {}
    let activeAction: THREE.AnimationAction
    let mixer: THREE.AnimationMixer
    loader.load('./models/RobotExpressive.glb', (gltf) => {
      const robot = gltf.scene
      robot.scale.set(0.5, 0.5, 0.5)
      robot.position.set(0, -0.8, 0)
      capsule.add(robot)
      // 加载动画
      // 动画混合器
      mixer = new THREE.AnimationMixer(robot)
      for (let i = 0; i < gltf.animations.length; i++) {
        const animation = gltf.animations[i]
        const name = animation.name
        // 裁剪出动画
        actions[name] = mixer.clipAction(animation)
        if (['Idle', 'Walking', 'Running'].includes(name)) {
          // 休闲，走路和跑步，动画需要重复
          actions[name].clampWhenFinished = false
          actions[name].loop = THREE.LoopRepeat
        } else {
          // 其他动作，只做一次
          actions[name].clampWhenFinished = true
          actions[name].loop = THREE.LoopOnce
        }
      }
      // 设置默认动画
      activeAction = actions['Idle']
      activeAction.play()
    })
    // 胶囊身体
    const capsuleBodyGeometry = new THREE.PlaneGeometry(0.5, 1, 1, 1)
    const capsuleBody = new THREE.Mesh(
      capsuleBodyGeometry,
      new THREE.MeshBasicMaterial({
        color: 0x0000ff,
        side: THREE.DoubleSide
      })
    )
    // 创建一个胶囊物体,只是为了展示用
    // const capsuleGeometry = new THREE.CapsuleGeometry(0.35, 1, 32)
    // const capsuleMaterial = new THREE.MeshBasicMaterial({
    //   color: 0xff0000,
    //   side: THREE.DoubleSide
    // })
    // const capsule = new THREE.Mesh(capsuleGeometry, capsuleMaterial)
    // 用rotob替换胶囊
    const capsule = new THREE.Object3D()

    capsule.position.set(0, 0.85, 0)

    // 上下旋转，添加空对象, 在物体和相机之间添加一个空的子对象，
    // 当上下旋转的时候，只旋转这个空对象，带动相机上下旋转
    const capsuleUpDownControls = new THREE.Object3D()
    // 将相机绑定到胶囊的子对象上，实现相机跟随胶囊
    capsuleUpDownControls.add(camera)
    capsuleUpDownControls.add(backCamera)
    capsule.add(capsuleUpDownControls)
    // 相机看着胶囊，相机位置设置
    camera.position.set(0, 2, -5)
    backCamera.position.set(0, 2, 5)
    camera.lookAt(capsule.position)
    backCamera.lookAt(capsule.position)
    // 控制器也是
    // controls.target = capsule.position
    capsuleBody.position.set(0, 0.5, 0)

    capsule.add(capsuleBody)
    scene.add(capsule)

    // 设置重力
    const gravity = -9.8
    // 玩家速度
    const playerVelocity = new THREE.Vector3(0, 0, 0)
    // 玩家的方向
    const playerDirection = new THREE.Vector3(0, 0, 0)

    // 更新玩家的位置信息
    let isPlayerOnFloor = false // 是否在地面上
    // 更新位置
    // 阻尼
    const damping = -0.05
    const updatePlayer = (deltTime: number) => {
      // deltTime 每帧之间的时间间隔，即每帧y运动了多少
      if (isPlayerOnFloor) {
        //如果在地面上，那么就不需要设置速度了
        playerVelocity.y = 0
        // 添加返方向的力
        if (!keyStates.isDown) {
          // 没有按键的时候，需要有阻尼，慢慢停下来, 在原有的方向的速度基础上 * damping来减小速度
          playerVelocity.addScaledVector(playerVelocity, damping)
        }
      } else {
        playerVelocity.y += gravity * deltTime
      }

      // 计算玩家移动的距离
      const playerDistance = playerVelocity.clone().multiplyScalar(deltTime * 5)
      // 移动玩家
      playerCollider.translate(playerDistance)
      //更新胶囊的位置
      playerCollider.getCenter(capsule.position)

      // 进行碰撞检测
      playerCollisions()

      // 为啥写在这里
      if (
        Math.abs(playerVelocity.x) + Math.abs(playerVelocity.z) > 0.1 &&
        Math.abs(playerVelocity.x) + Math.abs(playerVelocity.z) <= 2
      ) {
        fadeToAction('Walking')
        console.log('Walking')
      } else if (Math.abs(playerVelocity.x) + Math.abs(playerVelocity.z) > 2) {
        fadeToAction('Running')
        console.log('Running')
      } else {
        fadeToAction('Idle')
      }
    }
    // 碰撞检测
    const playerCollisions = () => {
      // 检测碰撞
      const res = worldOctree.capsuleIntersect(playerCollider)
      // 每次检测前都要判断下是否在下方
      isPlayerOnFloor = false
      if (res) {
        // 碰撞到了,需要向上移动，才能停止
        isPlayerOnFloor = res.normal.y > 0 // 在地面上
        playerCollider.translate(res.normal.multiplyScalar(res.depth))
      }
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

    // 根据键盘按键移动物体
    const controlPlayer = (deltTime: number) => {
      // 计算
      if (keyStates.KeyW) {
        // 前进按钮
        // z方向加1
        playerDirection.z = 1
        // 设置方向
        // 胶囊方向
        const capsuleFront = new THREE.Vector3(0, 0, 0) // 默认值
        // 获取胶囊方向赋值给 capsuleFront
        capsule.getWorldDirection(capsuleFront)
        // 设置物体的速度,移动操作，统一都在updatePlayer里面进行
        playerVelocity.add(capsuleFront.multiplyScalar(deltTime))
      } else if (keyStates.KeyS) {
        // 后退按钮
        // z方向加1
        playerDirection.z = 1
        // 设置方向
        // 胶囊方向
        const capsuleFront = new THREE.Vector3(0, 0, 0) // 默认值
        // 获取胶囊方向赋值给 capsuleFront
        capsule.getWorldDirection(capsuleFront)
        // 设置物体的速度,移动操作，统一都在updatePlayer里面进行
        playerVelocity.add(capsuleFront.multiplyScalar(-deltTime))
      }
      if (keyStates.KeyA) {
        // 需要根据胶囊的正前方和正上方 叉乘 计算得到 横向左右的侧方向(x的方向)
        playerDirection.x = 1
        // 设置方向
        // 胶囊方向
        const capsuleFront = new THREE.Vector3(0, 0, 0) // 默认值
        // 获取胶囊方向赋值给 capsuleFront, 得到的是正前方的方向向量
        capsule.getWorldDirection(capsuleFront)
        // 叉乘得到侧方向
        capsuleFront.cross(capsule.up)
        // 设置物体的速度,移动操作，统一都在updatePlayer里面进行
        playerVelocity.add(capsuleFront.multiplyScalar(-deltTime))
      } else if (keyStates.KeyD) {
        // 需要根据胶囊的正前方和正上方 叉乘 计算得到 横向左右的侧方向(x的方向)
        playerDirection.x = 1
        // 设置方向
        // 胶囊方向
        const capsuleFront = new THREE.Vector3(0, 0, 0) // 默认值
        // 获取胶囊方向赋值给 capsuleFront, 得到的是正前方的方向向量
        capsule.getWorldDirection(capsuleFront)
        // 叉乘得到侧方向
        capsuleFront.cross(capsule.up)
        // 设置物体的速度,移动操作，统一都在updatePlayer里面进行
        playerVelocity.add(capsuleFront.multiplyScalar(deltTime))
      }
      // 跳跃
      if (keyStates.Space) {
        playerVelocity.y = 15
      }
    }

    // 鼠标移动，旋转胶囊，带动控制器运动
    window.addEventListener(
      'mousemove',
      (e) => {
        // 左右旋转,控制胶囊
        capsule.rotation.y -= e.movementX * 0.003
        // 上下旋转
        capsuleUpDownControls.rotation.x += e.movementY * 0.003
        if (capsuleUpDownControls.rotation.x > Math.PI / 8) {
          capsuleUpDownControls.rotation.x = Math.PI / 8
        } else if (capsuleUpDownControls.rotation.x < -Math.PI / 8) {
          capsuleUpDownControls.rotation.x = -Math.PI / 8
        }
        // camera.rotation.x -= moveYDelt * 0.0001
      },
      false
    )

    // 更新动作
    const fadeToAction = (actionName: string) => {
      const prevAction = activeAction
      activeAction = actions[actionName]
      if (prevAction !== activeAction) {
        // 如果是一样的动作，就不处理了
        prevAction.fadeOut(0.3) // 在0.3s内消失
        activeAction
          .reset()
          .setEffectiveTimeScale(1)
          .setEffectiveWeight(1)
          .fadeIn(0.3)
          .play()
        // 动作完成之后，需要恢复到休闲状态
        mixer.addEventListener('finished', (e) => {
          const prevAction = activeAction
          activeAction = actions['Idle']
          prevAction.fadeOut(0.3) // 在0.3s内消失
          activeAction
            .reset()
            .setEffectiveTimeScale(1)
            .setEffectiveWeight(1)
            .fadeIn(0.3)
            .play()
        })
      }
    }

    // 鼠标锁定事件
    document.addEventListener('mousedown', (e) => {
      // 锁定鼠标
      document.body.requestPointerLock()
    })

    // 键盘事件
    document.addEventListener('keydown', (e) => {
      keyStates[e.code] = true
      keyStates.isDown = true
    })
    document.addEventListener('keyup', (e) => {
      keyStates[e.code] = false
      keyStates.isDown = false
      if (e.code === 'KeyV') {
        // 切换相机
        activeCamera = activeCamera === backCamera ? camera : backCamera
      }

      if (e.code === 'KeyT') {
        fadeToAction('Wave')
      }
    })

    // 多层级渲染物体，提升性能
    const material = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      wireframe: true
    })
    const lod = new THREE.LOD()
    for (let i = 0; i < 5; i++) {
      const geometry = new THREE.SphereGeometry(1, 22 - i * 5, 25 - i * 5)
      const mesh = new THREE.Mesh(geometry, material)
      lod.addLevel(mesh, i * 5)
    }
    lod.position.set(10, 0, 10)
    scene.add(lod)
    animate()
  }

  return <div className="container" ref={container}></div>
}
