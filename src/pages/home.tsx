import { useRef, useEffect } from 'react'
import './home.css'
import ThreePlus from '../three'
export default function Home() {
  const container = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (container.current) {
      resizeFn()
      window.addEventListener('resize', resizeFn)

      const threePlus = new ThreePlus('.canvas-container')
      threePlus.setBg('./assets/textures/sky11.hdr')
      threePlus.setLight()
      // threePlus.addClouds()
      threePlus.addCloudsPlus()
    }
  }, [])

  const resizeFn = () => {
    const scale = window.innerWidth / 1920
    container.current!.style.transform = `scale(${scale})`
  }

  return (
    <div className="home" ref={container}>
      <div className="canvas-container"></div>
    </div>
  )
}
