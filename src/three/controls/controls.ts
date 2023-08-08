import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { FlyControls } from 'three/examples/jsm/controls/FlyControls'
import cameraModule from '../camera/camera'
import renderer from '../renderer/renderer'
import eventBus from '../../utils/eventHub'
class ControlModules {
  controls!: OrbitControls | FlyControls
  constructor() {
    this.setOrbitControls()
    eventBus.on('toggleControls', (name: string) => {
      if (name === 'orbit') {
        this.setOrbitControls()
      } else {
        this.setFlyControls()
      }
    })
  }
  setOrbitControls() {
    this.controls = new OrbitControls(
      cameraModule.activeCamera,
      renderer.domElement
    )
    // 设置阻尼
    this.controls.enableDamping = true
    this.controls.maxPolarAngle = Math.PI / 2
    this.controls.minPolarAngle = 0
  }
  setFlyControls() {
    this.controls = new FlyControls(
      cameraModule.activeCamera,
      renderer.domElement
    )
    this.controls.movementSpeed = 2
    this.controls.rollSpeed = Math.PI / 60
  }
}
export default new ControlModules()
