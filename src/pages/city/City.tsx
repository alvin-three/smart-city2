import './City.css'
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import scene from '../../three/scene/Scene'
import camera from '../../three/camera/camera'
import axesHelper from '../../three/axesHelper/axesHelper'

import { orbitControls } from '../../three/controls/controls'
import renderer from '../../three/renderer/renderer'
import animate from '../../three/animate/animate'
import createCity from '../../three/Mesh/City'
import AlarmSprite from '../../three/Mesh/AlarmSprite'
import LightWall from '../../three/Mesh/LightWall'
import '../../three/init'
import gsap from 'gsap'
import { useFlyline } from '../../three/FlyLight'
import { useFlylineShader } from '../../three/FlyShader'
import { FlayShader } from '../../three/FlyShader'
import LightRadar from '../../three/Mesh/LightRadar'
import eventBus from '../../utils/eventHub'
import { IEventItem } from '../../App'
const City = (props: { eventList: IEventItem[] }) => {
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
      // const [flyLight] = useFlyline()
      // scene.add(flyLight.mesh)
      // // 添加飞线效果
      // const [flyShader] = useFlylineShader()
      // scene.add(flyShader.mesh)
      animate()
    }
    return () => {
      isShow = true
    }
  }, [])
  useEffect(() => {
    generateTargets()
    return () => {
      console.log('有变化时，需要清楚事件')
      eventBus.removeAllListeners('eventToggle')
      console.log(eventBus.listenerCount('eventToggle'), 'asdf')
    }
  }, [props.eventList])

  const mapFn: {
    [key: string]: (position: { x: number; z: number }, i: number) => void
  } = {
    火警: (position: { x: number; z: number }, i: number) => {
      // 添加光墙
      const wall = new LightWall(2, 2, {
        x: position.x,
        z: position.z
      })
      wall.eventListIndex = i
      scene.add(wall.mesh)
      eventList.push(wall)
    },
    治安: (position: { x: number; z: number }, i: number) => {
      // 添加光墙
      const color = new THREE.Color(
        Math.random(),
        Math.random(),
        Math.random()
      ).getHex()
      const line = new FlayShader(position, color)
      line.eventListIndex = i
      scene.add(line.mesh)
      eventList.push(line)
    },
    电力: (position: { x: number; z: number }, i: number) => {
      const color = new THREE.Color(
        Math.random(),
        Math.random(),
        Math.random()
      ).getHex()
      // 添加光墙
      const radar = new LightRadar(2, position, color)
      radar.eventListIndex = i
      scene.add(radar.mesh)
      eventList.push(radar)
    }
  }
  const [eventList, setEventList] = useState<
    (AlarmSprite | LightWall | FlayShader | LightRadar)[]
  >([])
  const generateTargets = () => {
    eventList.forEach((item) => {
      item.remove()
    })
    props.eventList.forEach((item, i: number) => {
      const position = {
        x: item.position.x / 5 - 10,
        z: item.position.y / 5 - 10
      }
      // 添加 警告
      const alarm = new AlarmSprite(item.name, position)
      alarm.eventListIndex = i
      eventList.push(alarm)
      alarm.onClick(function () {
        eventBus.emit('spriteClick', { event: item, i })
      })
      scene.add(alarm.mesh)
      if (mapFn[item.name]) {
        mapFn[item.name](position, i)
      }
    })
    setEventList(eventList)
    eventBus.on('eventToggle', changeCamera)
  }
  const changeCamera = (i: number) => {
    eventList.forEach((item) => {
      if (item.eventListIndex === i) {
        item.mesh.visible = true
      } else {
        item.mesh.visible = false
      }
    })
    console.log(i, 'asdf')
    const position = {
      x: props.eventList[i].position.x / 5 - 10,
      y: 0,
      z: props.eventList[i].position.y / 5 - 10
    }
    gsap.to(orbitControls.target, {
      duration: 1,
      x: position.x,
      y: position.y,
      z: position.z
    })
  }

  return <div className="city" ref={container}></div>
}

export default City
