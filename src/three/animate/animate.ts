import renderer from '../renderer/renderer'
import { orbitControls } from '../controls/controls'
import scene from '../scene/Scene'
import camera from '../camera/camera'
const animate = () => {
  orbitControls.update()
  renderer.render(scene, camera)
  requestAnimationFrame(animate)
}

export default animate
