import * as THREE from 'three'

const renderer = new THREE.WebGLRenderer({
  alpha: true,
  antialias: true,
  // 深度检测
  logarithmicDepthBuffer: true,
  physicallyCorrectLights: true
})
renderer.setSize(window.innerWidth, window.innerHeight)
// 曝光程度
renderer.toneMapping = THREE.ACESFilmicToneMapping

renderer.toneMappingExposure = 1.5
export default renderer
