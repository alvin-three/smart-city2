import * as THREE from 'three'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import gsap from 'gsap'
import * as dat from 'dat.gui'
import * as d3 from 'd3'
import Stats from 'three/examples/jsm/libs/stats.module.js'
import { useRay } from '../utils/useRay'
//创建gui对象
const gui = new dat.GUI()
const stats = new Stats()
document.body.appendChild(stats.dom)
// console.log(THREE);
// 初始化场景
const scene = new THREE.Scene()

// console.log(d3);
// 创建透视相机
const camera = new THREE.PerspectiveCamera(
  90,
  window.innerHeight / window.innerHeight,
  0.1,
  100000
)
// 设置相机位置
// object3d具有position，属性是1个3维的向量
camera.position.set(0, 0, 1000)
// 更新摄像头
camera.aspect = window.innerWidth / window.innerHeight
//   更新摄像机的投影矩阵
camera.updateProjectionMatrix()
scene.add(camera)

// 加入辅助轴，帮助我们查看3维坐标轴
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
scene.add(directionalLight)
const light = new THREE.AmbientLight(0xffffff, 0.5) // soft white light
scene.add(light)
// 初始化渲染器
const renderer = new THREE.WebGLRenderer({ alpha: true })
// renderer.shadowMap.enabled = true;
// renderer.shadowMap.type = THREE.BasicShadowMap;
// renderer.shadowMap.type = THREE.VSMShadowMap;

// 设置渲染尺寸大小
renderer.setSize(window.innerWidth, window.innerHeight)

// 监听屏幕大小改变的变化，设置渲染的尺寸
window.addEventListener('resize', () => {
  //   console.log("resize");
  // 更新摄像头
  camera.aspect = window.innerWidth / window.innerHeight
  //   更新摄像机的投影矩阵
  camera.updateProjectionMatrix()

  //   更新渲染器
  renderer.setSize(window.innerWidth, window.innerHeight)
  //   设置渲染器的像素比例
  renderer.setPixelRatio(window.devicePixelRatio)
})

// 将渲染器添加到body
document.body.appendChild(renderer.domElement)
const canvas = renderer.domElement

// 初始化控制器
const controls = new OrbitControls(camera, renderer.domElement)
// 设置控制器阻尼
controls.enableDamping = true
// 设置自动旋转
// controls.autoRotate = true;

const clock = new THREE.Clock()
function animate() {
  controls.update()
  stats.update()
  const deltaTime = clock.getDelta()
  requestAnimationFrame(animate)
  // 使用渲染器渲染相机看这个场景的内容渲染出来
  renderer.render(scene, camera)
}

animate()

// 整个地图
const map = new THREE.Object3D()
// 加载地图
const loader = new THREE.FileLoader()
loader.load('./assets/full.json', (res) => {
  const data = JSON.parse(res as string)
  // console.log(data, 'data')
  operationData(data)
  scene.add(map)
})

const operationData = (data: any) => {
  // 获取所有的features
  const features = data.features
  // console.log(features, 'asdf')
  // 遍历所有省份
  features.forEach((feature: any) => {
    const provice = new THREE.Object3D()
    const properties = feature.properties
    const geometry = feature.geometry
    // 判断形状
    if (geometry.type === 'Polygon') {
      // 多边形
      geometry.coordinates.forEach((coordinate: any) => {
        // 根据坐标，得到mesh材质
        const mesh = createMesh(coordinate)
        mesh.properties = properties.name
        provice.add(mesh)
        const line = createLine(coordinate)
        provice.add(line)
      })
    }
    // 其他多多边形, 多循环一次
    if (geometry.type === 'MultiPolygon') {
      geometry.coordinates.forEach((item: any, i: number) => {
        item.forEach((coordinate: any) => {
          // 根据坐标，得到mesh材质
          const mesh = createMesh(coordinate)
          mesh.properties = properties.name
          provice.add(mesh)
          const line = createLine(coordinate)
          provice.add(line)
        })
      })
    }
    map.add(provice)
  })
}
// d3 地图坐标解析
// 获取解析器，并设置 北京为中心，并且将坐标移动到 0,0 的位置
const projection = d3.geoMercator().center([116.4, 39.9]).translate([0, 0])
const createMesh = (polygen: [number, number][]) => {
  const shape = new THREE.Shape()
  // 遍历所有点坐标，得到具体位置，然后 通过shape 绘制图形
  polygen.forEach((row, i) => {
    const [x, y] = projection(row)
    if (i === 0) {
      shape.moveTo(x, -y)
    }
    shape.lineTo(x, -y)
  })
  // 根据 shape形状挤出 立体地图
  const gemotry = new THREE.ExtrudeGeometry(shape, { depth: 5 })
  const color = new THREE.Color(Math.random() * 0xffffff)
  const material = new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity: 0.5
  })
  return new THREE.Mesh(gemotry, material)
}

// 生成边框
const createLine = (polygen: [number, number][]) => {
  // 先物体
  const lineGeometry = new THREE.BufferGeometry()
  const points: THREE.Vector3[] = []
  polygen.forEach((row) => {
    const [x, y] = projection(row)
    points.push(new THREE.Vector3(x, -y, 10))
  })
  lineGeometry.setFromPoints(points)
  const material = new THREE.MeshBasicMaterial({
    color: new THREE.Color(Math.random() * 0xffffff)
  })
  return new THREE.Line(lineGeometry, material)
}

// 鼠标交互
let lastPicker: THREE.Mesh
// 点击事件
useRay(
  camera,
  map,
  (res) => {
    const intersects = res as THREE.Intersection<THREE.Mesh>[]
    // 点到了
    if (lastPicker) {
      lastPicker.material?.color.copy(lastPicker.material!.oldColor)
    }
    lastPicker = intersects[0].object
    lastPicker.material!.oldColor = lastPicker.material?.color.clone()
    lastPicker.material?.color.set(0xffffff)
  },
  () => {
    // 未点到任何物体, 要恢复到原有的颜色
    if (lastPicker) {
      lastPicker.material?.color.copy(lastPicker.material.oldColor)
    }
  }
)
