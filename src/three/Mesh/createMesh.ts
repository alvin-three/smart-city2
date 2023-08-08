import * as THREE from 'three'
import CreateCity from './City'
let cityModel: CreateCity

export default function createMesh(scene: THREE.Scene) {
  cityModel = new CreateCity(scene)
}

export const updateMesh = (time: number) => {
  cityModel.update(time)
}
