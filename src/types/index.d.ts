import { ImageryLayer } from 'cesium'

declare module 'Cesium.Viewer.ImageryLayer' {
  export interface ImageryLayer {
    invertColor?: boolean
    filtRGB?: number[]
  }
}
