import * as Cesium from 'cesium'
import RadarMaterialProperty from './material/RadarMaterialProperty'
export default class RadarLight {
  constructor(viewer: Cesium.Viewer) {
    // 歘关键
    const material = new RadarMaterialProperty()
    viewer.entities.add({
      rectangle: {
        // 114.40497, 30.49405
        coordinates: Cesium.Rectangle.fromDegrees(
          114.39,
          30.49,
          114.395,
          30.495
        ),
        material: material
      }
    })
  }
}
