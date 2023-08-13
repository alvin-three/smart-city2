import * as Cesium from 'cesium'
import gsap from 'gsap'
import LightWallMaterialProperty from './material/LightWallMaterialProperty'
export default class LightWall {
  params = {
    minLot: 114.39,
    minLat: 30.48,
    maxLot: 114.395,
    maxLat: 30.485
  }
  entity: Cesium.Entity
  constructor(viewer: Cesium.Viewer) {
    const material = new LightWallMaterialProperty()
    this.entity = viewer.entities.add({
      name: 'Green wall from surface with outline',
      wall: {
        // 114.40497, 30.49405
        positions: Cesium.Cartesian3.fromDegreesArrayHeights([
          114.3874, 30.4973, 100.0, 114.394, 30.4973, 100.0, 114.394, 30.5005,
          100.0, 114.3874, 30.5005, 100.0, 114.3874, 30.4973, 100.0
        ]),
        material: material
        // outline: true
      }
    })
  }
}
