import { useEffect, useState } from 'react'
import './cesium.css'
import * as Cesium from 'cesium'
import '../Widgets/widgets.css'
import initView from '../cesium/initView'
import { MousePosition } from '../cesium/MousePosition'
import CesiumNavigation from 'cesium-navigation-es6'
import modityMap from '../cesium/modifyMap'
import modifyBuilding from '../cesium/modifyBuildings'
import LigthCone from '../cesium/LightCone'
import RectLightLines from '../cesium/RectLightLines'
import RoadLightLine from '../cesium/RoadLightLine'
import RadarLight from '../cesium/RadarLight'
const CesiumContainer = () => {
  const [viewer, setViewer] = useState<Cesium.Viewer>()
  useEffect(() => {
    init()
  }, [])
  const init = async () => {
    const view = await initView()
    setViewer(view)
  }
  useEffect(() => {
    // 地图初始化之后，拿到viewer需要进行其他的操作
    if (viewer) {
      // 鼠标坐标监听
      new MousePosition(viewer)
      // 启用罗盘
      new CesiumNavigation(viewer, {
        enableCompass: true
      })
      // 修改地图图层
      modityMap(viewer)
      // 修改建筑颜色
      modifyBuilding(viewer)
      // 添加光锥
      new LigthCone(viewer)
      // 添加流光飞线
      new RectLightLines(viewer)
      // 添加路线
      new RoadLightLine(viewer)
      // 添加雷达
      new RadarLight(viewer)
    }
  }, [viewer])
  return <div id="cesium"></div>
}

export default CesiumContainer
