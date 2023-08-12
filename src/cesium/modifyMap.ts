import * as Cesium from 'cesium'

export default function modityMap(viewer: Cesium.Viewer) {
  // 获取地图图层
  const baseLayer = viewer.imageryLayers.get(0)
  console.log(baseLayer, 'asdf')
  // 自定义两个属性，来标记
  baseLayer.invertColor = true // 是否需要翻转颜色
  baseLayer.filtRGB = [0, 50, 100] // 过滤颜色
}
