import { useEffect } from 'react'
import './cesium.css'
import * as Cesium from 'cesium'
import '../Widgets/widgets.css'
import planeData from '../assets/json/plane.json'
// 设置cesium静态资源的位置
window.CESIUM_BASE_URL = '/'
// 设置默认视角
// Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(
//   // 西 经度
//   89.5,
//   // 南 纬度
//   20.4,
//   // 东
//   110.4,
//   // 北
//   61.2
// )
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
      // 信息窗,物体的详细信息
      // infoBox: false,
      // 搜索框
      geocoder: false,
      shouldAnimate: true, // 默认开始动画
      terrainProvider: await Cesium.createWorldTerrainAsync({
        requestVertexNormals: true, // 阴影效果
        requestWaterMask: true // 水纹效果
      })
    })

    // 设置沙箱允许使用js, 解决控制台报错问题
    const iframe = document.getElementsByClassName('cesium-infoBox-iframe')[0]
    iframe.setAttribute(
      'sandbox',
      'allow-same-origin allow-scripts allow-popups allow-forms'
    )
    iframe.setAttribute('src', '')

    // 隐藏logo
    viewer.cesiumWidget.creditContainer.style.display = 'none'
    // 添加全球建筑物
    const tileset = await Cesium.createOsmBuildingsAsync()
    viewer.scene.primitives.add(tileset)

    // 广州塔
    const position = Cesium.Cartesian3.fromDegrees(113.3191, 23.109, 1000)
    viewer.camera.flyTo({
      destination: position,
      duration: 1
    })

    // 设置3dtiles的样式
    tileset.style = new Cesium.Cesium3DTileStyle({
      defines: {
        // 与广州塔的距离
        distance:
          "distance(vec2(${feature['cesium#longitude']},${feature['cesium#latitude']}),vec2(113.3191,23.109))"
      },
      color: {
        conditions: [
          ['${distance} < 0.01', "color('rgba(0,0,50, 0.7)')"],
          ['${distance} < 0.02', "color('rgba(0,0,50, 0.5)')"],
          ['${distance} < 0.04', "color('rgba(0,0,50, 0.2)')"],
          ['true', 'color("white")']
        ]
      },
      show: "${distance} < 0.04 && ${feature['building']} === 'apartments'"
    })
    // 监视3dtileset的性能
    // viewer.extend(Cesium.viewerCesium3DTilesInspectorMixin)
  }
  return <div id="cesium"></div>
}

export default CesiumContainer
