import * as Cesium from 'cesium'
import gsap from 'gsap'
export default class LigthCone {
  model: Cesium.Model
  modelMatrix: Cesium.Matrix4
  params = {
    height: 500,
    degress: 0
  }
  constructor(viewer: Cesium.Viewer) {
    this.modelMatrix = Cesium.Transforms.headingPitchRollToFixedFrame(
      // 位置
      Cesium.Cartesian3.fromDegrees(114.40497, 30.49405, this.params.height),
      // 旋转角度
      new Cesium.HeadingPitchRoll(this.params.degress, 0, 0)
    )
    this.model = viewer.scene.primitives.add(
      Cesium.Model.fromGltf({
        url: './model/pyramid.glb',
        show: true,
        debugShowBoundingVolume: false,
        debugWireframe: false,
        scale: 150,
        maximumScale: 20000,
        minimumPixelSize: 12,
        allowPicking: true, // 是否可以选择
        modelMatrix: this.modelMatrix
      })
    )
    this.animate()
  }
  animate() {
    gsap.to(this.params, {
      height: 600,
      degress: Math.PI,
      duration: 1,
      yoyo: true,
      repeat: -1,
      ease: 'power1.inOut',
      onUpdate: () => {
        this.model.modelMatrix = Cesium.Transforms.headingPitchRollToFixedFrame(
          // 位置
          Cesium.Cartesian3.fromDegrees(
            114.40497,
            30.49405,
            this.params.height
          ),
          // 旋转角度
          new Cesium.HeadingPitchRoll(this.params.degress, 0, 0)
        )
      }
    })
  }
}
