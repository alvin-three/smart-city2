import { Object3D } from './../../node_modules/@types/three/src/core/Object3D.d'
import * as THREE from 'three'

declare module 'three' {
  export interface Mesh {
    properties?: string
    material?: THREE.MeshBasicMaterial
  }
}
