import renderer from '../renderer/renderer'
import controlModule from '../controls/controls'
import scene from '../scene/Scene'
import cameraModule from '../camera/camera'
import * as THREE from 'three'
import { updateMesh } from '../Mesh/CreateMesh'
const clock = new THREE.Clock()
const animate = () => {
  // 总时间
  // const time = clock.getElapsedTime()
  // 时间间隔
  const time = clock.getDelta()
  controlModule.controls.update(time)

  updateMesh(time)
  renderer.render(scene, cameraModule.activeCamera)
  requestAnimationFrame(animate)
}

export default animate
