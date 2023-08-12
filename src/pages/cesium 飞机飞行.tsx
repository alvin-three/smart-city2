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
      // 信息窗
      infoBox: false,
      // 搜索框
      geocoder: false,
      shouldAnimate: true, // 默认开始动画
      terrainProvider: await Cesium.createWorldTerrainAsync({
        requestVertexNormals: true, // 阴影效果
        requestWaterMask: true // 水纹效果
      })
    })
    // 隐藏logo
    viewer.cesiumWidget.creditContainer.style.display = 'none'
    // 添加建筑物
    const tileset = await Cesium.createOsmBuildingsAsync()
    viewer.scene.primitives.add(tileset)

    // 首先设置时间
    const startTime = new Date('2023-08-14T15:19:00z')
    // 时间间隔 秒做单位
    const timeStep = 30
    // 总共时间
    const totalTime = (planeData.length - 1) * timeStep
    // 设置起始时间
    const startJulinDate = Cesium.JulianDate.fromDate(startTime)
    // 终点时间
    const stopJulianDate = Cesium.JulianDate.addSeconds(
      startJulinDate,
      totalTime,
      new Cesium.JulianDate()
    )

    // 设置时间查看器的起始时间，使用clone之后，就不会对原始的startJulinDate这些时间造成修改
    viewer.clock.startTime = startJulinDate.clone()
    viewer.clock.stopTime = stopJulianDate.clone()
    // 当前时间也调整
    viewer.clock.currentTime = startJulinDate.clone()
    // 设置时间线范围
    viewer.timeline.zoomTo(startJulinDate, stopJulianDate)

    // 采样集合
    const positionProperty = new Cesium.SampledPositionProperty()
    planeData.forEach((dataPoint, i) => {
      // 每个位置点的时间
      const time = Cesium.JulianDate.addSeconds(
        startJulinDate,
        i * timeStep,
        new Cesium.JulianDate()
      )
      // 转换坐标
      const position = Cesium.Cartesian3.fromDegrees(
        dataPoint.longitude,
        dataPoint.latitude,
        dataPoint.height
      )
      // 添加采样点
      positionProperty.addSample(time, position)

      // 可以查看对应点的位置
      viewer.entities.add({
        position: position,
        point: {
          outlineColor: Cesium.Color.WHITE,
          color: Cesium.Color.RED,
          outlineWidth: 2,
          pixelSize: 10
        }
      })
    })

    // 加载飞机
    const planeEntity = viewer.entities.add({
      // 设置在起始和结束时间内是可用的
      availability: new Cesium.TimeIntervalCollection([
        new Cesium.TimeInterval({
          start: startJulinDate,
          stop: stopJulianDate
        })
      ]),
      name: '飞机',
      // 自动计算飞机的位置
      position: positionProperty,
      // VelocityOrientationProperty自动计算 方向和角度
      orientation: new Cesium.VelocityOrientationProperty(positionProperty),
      model: {
        uri: './model/Air.glb',
        maximumScale: 2000,
        minimumPixelSize: 128
      },
      path: new Cesium.PathGraphics({
        width: 5
      })
    })
    // 设置时间速率 为10倍，即 1s =》 10s
    viewer.clock.multiplier = 60
    // 设置相机跟随物体
    viewer.trackedEntity = planeEntity
  }
  return <div id="cesium"></div>
}

export default CesiumContainer
