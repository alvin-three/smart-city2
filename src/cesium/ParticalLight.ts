import * as Cesium from 'cesium'

export default class ParticlaLight {
  constructor(viewer: Cesium.Viewer, color = Cesium.Color.WHITE) {
    const boxEntity = viewer.entities.add({
      name: 'box entity',
      position: Cesium.Cartesian3.fromDegrees(114.40497, 30.49405, 90.0),
      box: {
        dimensions: new Cesium.Cartesian3(60.0, 60.0, 180.0),
        material: Cesium.Color.GREEN.withAlpha(0)
      }
    })

    // 生成粒子效果
    const particalSystem = new Cesium.ParticleSystem({
      image: './textures/smoke.png', // 粒子需要用到的图片，纹理
      //   imageSize: new Cesium.Cartesian2(20, 20), // 粒子大小
      // 随机大小
      minimumImageSize: new Cesium.Cartesian2(10, 10),
      maximumImageSize: new Cesium.Cartesian2(20, 20),
      startColor: color,
      endColor: Cesium.Color.PINK.withAlpha(0),
      // 开始时粒子的大小
      startScale: 0.1,
      // 结束时粒子的大小
      endScale: 5.0,
      //   speed: 5, // 粒子速度 米/秒
      // 随机速度，最小1， 最大5
      minimumSpeed: 1.0,
      maximumSpeed: 5.0,
      lifetime: 5.0, // 粒子的生命周期 ，秒
      emissionRate: 5, // 发射速率，每秒发射粒子的数量
      // 发生器，圆形
      //   emitter: new Cesium.CircleEmitter(60),
      emitter: new Cesium.BoxEmitter(new Cesium.Cartesian3(60.0, 60.0, 180.0)),
      // 粒子发射的位置
      modelMatrix: boxEntity.computeModelMatrix(
        viewer.clock.currentTime,
        new Cesium.Matrix4()
      )
    })
    viewer.scene.primitives.add(particalSystem)
  }
}
