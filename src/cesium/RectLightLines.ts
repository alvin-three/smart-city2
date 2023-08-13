import * as Cesium from 'cesium'
// import gsap from 'gsap'
import * as turf from '@turf/turf'
import PolylineFlyLineMaterialProperty from './material/PolylineFlyLineMaterialProperty'
export default class RectLightLines {
  bbox: turf.helpers.BBox
  constructor(viewer: Cesium.Viewer) {
    // 创建矩形区域 114.40497, 30.49405 中心点
    this.bbox = [114.35497, 30.44405, 114.45497, 30.54405]
    // 创建随机点
    const points = turf.randomPoint(300, {
      bbox: this.bbox
    })
    // 随机生成线
    const features = points.features
    features.forEach((feature) => {
      // 获取经纬度
      const [long, lat] = feature.geometry.coordinates
      // 设置线的起点
      const start = Cesium.Cartesian3.fromDegrees(long, lat, 0)
      // 设置终点
      const end = Cesium.Cartesian3.fromDegrees(
        long,
        lat,
        200 + Math.random() * 3000
      )
      // 画线
      const polylineFlyLineMaterialProperty =
        new PolylineFlyLineMaterialProperty()
      viewer.entities.add({
        polyline: {
          positions: [start, end],
          width: 2,
          material: polylineFlyLineMaterialProperty
        }
      })
    })
  }
}
