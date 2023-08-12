import { useEffect, useState } from 'react'
import './cesium.css'
import * as Cesium from 'cesium'
import '../Widgets/widgets.css'
import initView from '../cesium/initView'
import { MousePosition } from '../cesium/MousePosition'

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
    // 鼠标坐标监听
    if (viewer) {
      new MousePosition(viewer)
    }
  }, [viewer])
  return <div id="cesium"></div>
}

export default CesiumContainer
