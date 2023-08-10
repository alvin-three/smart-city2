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

    // 虚线材质
    // const material = new Cesium.PolylineDashMaterialProperty({
    //   color: Cesium.Color.RED,
    //   dashLength: 30
    // })
    // 箭头材质
    // const material = new Cesium.PolylineArrowMaterialProperty(Cesium.Color.RED)
    // 尾椎材质
    const material = new Cesium.PolylineGlowMaterialProperty({
      glowPower: 0.2, // 发光强度
      taperPower: 0.5, // 尾椎效果
      color: Cesium.Color.RED
    })
    const line = viewer.entities.add({
      polyline: {
        positions: Cesium.Cartesian3.fromDegreesArray([119, 35, 130, 3500]),
        width: 20,
        // material: Cesium.Color.RED
        material
      }
    })
    viewer.zoomTo(viewer.entities)
  }
  return <div id="cesium"></div>
}

export default CesiumContainer
