import './City.css'
import { useEffect, useRef } from 'react'

import scene from '../../three/scene/Scene'
import camera from '../../three/camera/camera'
import axesHelper from '../../three/axesHelper/axesHelper'
import { orbitControls } from '../../three/controls/controls'
import renderer from '../../three/renderer/renderer'
import animate from '../../three/animate/animate'
import createCity from '../../three/Mesh/City'
import '../../three/init'
import { useFlyline } from '../../three/FlyLight'
import { useFlylineShader } from '../../three/FlyShader'
const City = () => {
  const container = useRef<HTMLDivElement>(null)

  // 初始化
  let isShow = false
  useEffect(() => {
    if (!isShow && container.current) {
      camera.position.set(10, 10, 10)
      scene.add(camera)
      scene.add(axesHelper)
      // 加载城市模型
      createCity()

      orbitControls.enableDamping = true
      container.current.appendChild(renderer.domElement)
      const [flyLight] = useFlyline()
      scene.add(flyLight.mesh)
      // 添加飞线效果

      const [flyShader] = useFlylineShader()
      scene.add(flyShader.mesh)
      animate()
    }
    return () => {
      isShow = true
    }
  }, [])

  return <div className="city" ref={container}></div>
}

export default City
