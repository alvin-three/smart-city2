import * as Cesium from 'cesium'
import PolylineFlyLineMaterialProperty from './material/PolylineFlyLineMaterialProperty'
import SpritlineMaterialProperty from './material/SpritlineMaterialProperty'
export default class RoadLightLine {
  constructor(viewer: Cesium.Viewer) {
    // 加载路线
    const geoPromise = Cesium.GeoJsonDataSource.load(
      './geojson/roadline.geojson'
    )
    geoPromise.then((dataSource) => {
      viewer.dataSources.add(dataSource)
      const entities = dataSource.entities.values
      // const material = new PolylineFlyLineMaterialProperty(
      //   new Cesium.Color(0.7, 1.0, 0.7, 1.0)
      // )
      const material = new SpritlineMaterialProperty()
      entities.forEach((entity) => {
        const polyline = entity.polyline
        polyline.material = material
      })
    })
  }
}
