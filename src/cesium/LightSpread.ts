import * as Cesium from 'cesium'
import gsap from 'gsap'
import LightSpreadMaterialProperty from './material/LightSpreadMaterialProperty'
export default class LightSpread {
  params = {
    minLot: 114.39,
    minLat: 30.48,
    maxLot: 114.395,
    maxLat: 30.485
  }
  entity: Cesium.Entity
  constructor(viewer: Cesium.Viewer) {
    // 歘关键
    const material = new LightSpreadMaterialProperty()
    this.entity = viewer.entities.add({
      rectangle: {
        // 114.40497, 30.49405
        coordinates: Cesium.Rectangle.fromDegrees(
          114.39,
          30.48,
          114.395,
          30.485
        ),
        material: material
      }
    })
    gsap.to(this.params, {
      minLot: 114.28,
      minLat: 30.37,
      maxLot: 114.505,
      maxLat: 30.595,
      duration: 2,
      repeat: -1,
      ease: 'linear',
      onUpdate: () => {
        this.entity.rectangle.coordinates = Cesium.Rectangle.fromDegrees(
          this.params.minLot,
          this.params.minLat,
          this.params.maxLot,
          this.params.maxLat
        )
      }
    })
  }
}
