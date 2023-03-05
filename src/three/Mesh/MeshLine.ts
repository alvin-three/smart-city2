import * as THREE from 'three'
class MeshLine {
  material: THREE.LineBasicMaterial
  mesh: THREE.LineSegments
  geometry: THREE.BufferGeometry
  constructor(geometry: THREE.BufferGeometry) {
    this.geometry = new THREE.EdgesGeometry(geometry)
    this.material = new THREE.LineBasicMaterial({ color: 0xffffff })
    this.mesh = new THREE.LineSegments(this.geometry, this.material)
  }
}

export default MeshLine
