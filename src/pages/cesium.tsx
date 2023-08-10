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
// 设置token
Cesium.Ion.defaultAccessToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5MDNjOTM2ZS0zNTJmLTQyOWEtYWE5ZC05NDM1NTBiZDkyYjIiLCJpZCI6MTI3NTg1LCJpYXQiOjE2NzgxNjc0Njd9.XhBVg2LHzny4EXwC46L28z6P9MbuCecfXyv-xlWs3vg'
const CesiumContainer = () => {
  useEffect(() => {
    init()
  })
  const init = () => {
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
      // 设置天空盒
      //   skyBox: new Cesium.SkyBox({})
    })
    const provider = new Cesium.WebMapTileServiceImageryProvider({
      //http://t0.tianditu.gov.cn/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=您的密钥
      url: 'http://t0.tianditu.gov.cn/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=ff37a568897e6029ac2bc62ac27398c9',
      layer: 'tdtVecBasicLayer',
      style: 'default',
      format: 'image/jpeg',
      tileMatrixSetID: 'GoogleMapsCompatible'
    })
    viewer.imageryLayers.addImageryProvider(provider)
    // 隐藏logo
    viewer.cesiumWidget.creditContainer.style.display = 'none'
  }
  return <div id="cesium"></div>
}

export default CesiumContainer
