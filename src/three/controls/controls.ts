import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import camera from '../camera/camera'
import renderer from '../renderer/renderer'

// 可能存在多个控制器
export const orbitControls = new OrbitControls(camera, renderer.domElement)

// 设置控制器阻尼
orbitControls.enableDamping = true
// 设置自动旋转
// controls.autoRotate = true;

export default orbitControls
