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

    // 相机
    // const position = Cesium.Cartesian3.fromDegrees(116.395928, 39.9092, 100)
    const position = Cesium.Cartesian3.fromDegrees(113.3191, 23.109, 2000)
    // 设置相机位置
    // setView ，瞬间到达
    // viewer.camera.setView({
    //   // 指定相机位置
    //   destination: position,
    //   // 设置相机的视角
    //   orientation: {
    //     // 左手坐标系，y轴向上
    //     // 偏航角度， 0 中间，90 向右，-90向左
    //     heading: Cesium.Math.toRadians(0), // 头，沿着y轴转动,即水平左右转动的效果
    //     // 俯仰角， 0 竖直向上， -90垂直向下
    //     pitch: Cesium.Math.toRadians(-30), // 头上下 转动的角度，即沿着x轴转动
    //     // 翻滚角度
    //     roll: 0 // 沿着z轴转动
    //   }
    // })
    // flyto 飞过去
    viewer.camera.flyTo({
      // 指定相机位置
      destination: position,
      // 设置相机的视角
      orientation: {
        // 左手坐标系，y轴向上
        // 偏航角度， 0 中间，90 向右，-90向左
        heading: Cesium.Math.toRadians(0), // 头，沿着y轴转动,即水平左右转动的效果
        // 俯仰角， 0 竖直向上， -90垂直向下
        pitch: Cesium.Math.toRadians(-30), // 头上下 转动的角度，即沿着x轴转动
        // 翻滚角度
        roll: 0 // 沿着z轴转动
      }
    })

    // 添加3d建筑, 默认效果
    const tileset = await Cesium.createOsmBuildingsAsync()
    viewer.scene.primitives.add(tileset)
    // 添加点
    // const point = viewer.entities.add({
    //   position: Cesium.Cartesian3.fromDegrees(113.3191, 23.109, 700), // 要添加的位置
    //   point: {
    //     pixelSize: 10,
    //     outlineWidth: 4,
    //     color: Cesium.Color.RED,
    //     outlineColor: Cesium.Color.WHITE
    //   }
    // })

    // 添加标签
    const label = viewer.entities.add({
      position: Cesium.Cartesian3.fromDegrees(113.3191, 23.109, 750), // 要添加的位置
      label: {
        text: '广州塔',
        font: '24px monospace',
        outlineWidth: 4,
        pixelOffset: new Cesium.Cartesian2(0, -20),
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        outlineColor: Cesium.Color.BLACK,
        fillColor: Cesium.Color.WHITE,
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM
      },
      billboard: {
        image: './textures/gzt.png',
        width: 50,
        height: 50,
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        verticalOrigin: Cesium.VerticalOrigin.TOP
      }
    })
  }
  return <div id="cesium"></div>
}

export default CesiumContainer
