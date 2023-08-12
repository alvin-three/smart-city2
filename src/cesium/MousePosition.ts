import * as Cesium from 'cesium'

export class MousePosition {
  viewer: Cesium.Viewer
  divDom: HTMLDivElement
  constructor(viewer: Cesium.Viewer) {
    this.divDom = document.createElement('div')
    this.divDom.style.cssText = `
        position: fixed;
        bottom:0;
        right:0;
        width:300px;
        height:40px;
        background-color: rgba(0,0,0,0.5);
        color: #fff;
        font-size: 14px;
        line-height: 40px;
        text-align: center;
        z-index: 100;
    `
    document.body.appendChild(this.divDom)
    this.viewer = viewer
    // 鼠标事件处理器
    const handler = new Cesium.ScreenSpaceEventHandler()
    handler.setInputAction((moveMent: any) => {
      // 获取鼠标的坐标
      const cartesian = viewer.camera.pickEllipsoid(
        moveMent.endPosition,
        viewer.scene.globe.ellipsoid
      )
      if (cartesian) {
        // 转换为经纬度
        const cartographic = Cesium.Cartographic.fromCartesian(cartesian)
        const longitude = Cesium.Math.toDegrees(cartographic.longitude).toFixed(
          4
        )
        const latitude = Cesium.Math.toDegrees(cartographic.latitude).toFixed(4)
        // const height = Cesium.Math.toDegrees(cartographic.height)
        this.divDom.innerHTML = `经度：${longitude} 纬度： ${latitude}`
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
  }
}
