import * as Cesium from 'cesium'
// 扩展这个属性算了。。。
export type IImageryLayer = Cesium.ImageryLayer & {
  invertColor?: boolean
  filtRGB?: number[]
}
