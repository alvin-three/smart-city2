import './City.css'
import { useEffect, useRef, useState } from 'react'
import scene from '../../three/scene/Scene'
import cameraModule from '../../three/camera/camera'
import axesHelper from '../../three/axesHelper/axesHelper'
import renderer from '../../three/renderer/renderer'
import animate from '../../three/animate/animate'

import createMesh from '../../three/Mesh/CreateMesh'
import '../../three/init'
// import gsap from 'gsap'

const City = () => {
  const container = useRef<HTMLDivElement>(null)

  // 初始化
  let isShow = false

  useEffect(() => {
    if (!isShow && container.current) {
      cameraModule.activeCamera.position.set(10, 10, 10)
      scene.add(cameraModule.activeCamera)
      scene.add(axesHelper)
      // 加载城市模型
      createMesh(scene)
      container.current.appendChild(renderer.domElement)

      animate()
    }
    return () => {
      isShow = true
    }
  }, [])

  return <div className="city" ref={container}></div>
}

export default City
