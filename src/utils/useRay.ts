import * as THREE from 'three'
type fn = (
  intersects: THREE.Intersection<THREE.Object3D<THREE.Event>>[]
) => void
type bFn = () => void
export const useRay = (
  camera: THREE.Camera,
  obj: THREE.Object3D,
  cb?: fn,
  blurFn?: bFn
) => {
  // 点击事件监听
  const mouse = new THREE.Vector2()
  const raycaster = new THREE.Raycaster()
  window.addEventListener('click', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
    raycaster.setFromCamera(mouse, camera)
    const intersects = raycaster.intersectObject(obj) as THREE.Intersection<
      THREE.Object3D<THREE.Event>
    >[]
    if (intersects.length > 0) {
      cb && cb(intersects)
    } else {
      // 未点击到
      blurFn && blurFn()
    }
  })
}
