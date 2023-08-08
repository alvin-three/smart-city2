import * as THREE from 'three'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
const scene = new THREE.Scene()

const hdrLoader = new RGBELoader()
hdrLoader.loadAsync('./textures/023.hdr').then((texture) => {
  scene.background = texture
  scene.environment = texture
  scene.environment.mapping = THREE.EquirectangularReflectionMapping
})

// 添加平行光
const light = new THREE.DirectionalLight(0xffffff, 1)
light.position.set(10, 100, 10)
scene.add(light)
export default scene
