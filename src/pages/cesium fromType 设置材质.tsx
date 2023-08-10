import { useEffect } from 'react'
import './cesium.css'
import * as Cesium from 'cesium'
import '../Widgets/widgets.css'
// 设置cesium静态资源的位置
window.CESIUM_BASE_URL = '/'
// 设置默认视角
Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(
  // 西 经度
  89.5,
  // 南 纬度
  20.4,
  // 东
  110.4,
  // 北
  61.2
)
const tiandituKey = 'c91205e0bef9e516b018693164bc6e51'
// 设置token
Cesium.Ion.defaultAccessToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5MDNjOTM2ZS0zNTJmLTQyOWEtYWE5ZC05NDM1NTBiZDkyYjIiLCJpZCI6MTI3NTg1LCJpYXQiOjE2NzgxNjc0Njd9.XhBVg2LHzny4EXwC46L28z6P9MbuCecfXyv-xlWs3vg'
const CesiumContainer = () => {
  useEffect(() => {
    init()
  })
  const init = async () => {
    const viewer = new Cesium.Viewer('cesium', {
      // 信息窗
      infoBox: false,
      // 搜索框
      geocoder: false,
      // 是否展示home按钮
      homeButton: false,
      // 观看模式选择， 3d 2.5d, 2d等
      sceneModePicker: false,
      // 图层选择
      baseLayerPicker: false,
      // 帮助按钮
      navigationHelpButton: false,
      // 是否播放动画按钮
      animation: false,
      // 时间线
      timeline: false,
      // 全局按钮
      fullscreenButton: false
    })
    // 隐藏logo
    viewer.cesiumWidget.creditContainer.style.display = 'none'
    // 1. 创建几何体
    const geometry = new Cesium.RectangleGeometry({
      // 图形
      rectangle: Cesium.Rectangle.fromDegrees(
        // 西边的经度
        115,
        // 南边维度
        20,
        // 东边经度
        135,
        // 北边维度
        30
      ),
      height: 0, // 距离地面的高度
      // 着色方式
      vertexFormat: Cesium.EllipsoidSurfaceAppearance.VERTEX_FORMAT
    })
    // 2. 生产实例
    const instance = new Cesium.GeometryInstance({
      id: 'instance1',
      geometry,
      attributes: {
        color: Cesium.ColorGeometryInstanceAttribute.fromColor(
          Cesium.Color.RED.withAlpha(0.5)
        )
      }
    })
    const geometry2 = new Cesium.RectangleGeometry({
      // 图形
      rectangle: Cesium.Rectangle.fromDegrees(
        // 西边的经度
        145,
        // 南边维度
        20,
        // 东边经度
        165,
        // 北边维度
        30
      ),
      height: 0, // 距离地面的高度
      // 着色方式
      vertexFormat: Cesium.EllipsoidSurfaceAppearance.VERTEX_FORMAT
    })
    const instance2 = new Cesium.GeometryInstance({
      id: 'instance2',
      geometry: geometry2,
      attributes: {
        color: Cesium.ColorGeometryInstanceAttribute.fromColor(
          Cesium.Color.BLUE.withAlpha(0.5)
        )
      }
    })

    // 使用primitive的物体，才是使用MaterialAppearance属性
    // type COLOR
    // const material = Cesium.Material.fromType('Color', {
    //   color: Cesium.Color.AQUA.withAlpha(0.5)
    // })
    // type Image
    const material = Cesium.Material.fromType('Image', {
      image: './textures/logo.png', // 图片地址
      repeate: new Cesium.Cartesian2(1.0, 1.0) // 重复次数
    })
    // 3. 设置外观, 如果有多个物体实例，可以拥有不同的颜色外观
    // 设定几何体都是与地球的椭球体平行
    //假定几何体与地球椭球体平行，就可以在计算大量顶点属性的时候节省内存
    const appearance = new Cesium.EllipsoidSurfaceAppearance({
      material: material,
      aboveGround: true
    })
    // 未提前椭球体计算，性能会差点
    // const appearance = new Cesium.MaterialAppearance({
    //   material: material
    // })
    // 4.图元
    const primitive = new Cesium.Primitive({
      geometryInstances: [instance, instance2],
      appearance
    })
    // 5. 添加到地图中去
    viewer.scene.primitives.add(primitive)
  }
  return <div id="cesium"></div>
}

export default CesiumContainer
