import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import camera from '../camera/camera'
import renderer from '../renderer/renderer'

// 可能存在多个控制器
export const orbitControls = new OrbitControls(camera, renderer.domElement)
