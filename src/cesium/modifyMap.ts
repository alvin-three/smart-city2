import * as Cesium from 'cesium'
import { IImageryLayer } from '../types/CesiumTypes'
export default function modityMap(viewer: Cesium.Viewer) {
  // 获取地图图层
  const baseLayer = viewer.imageryLayers.get(0) as IImageryLayer
  // 自定义两个属性，来标记
  baseLayer.invertColor = true // 是否需要翻转颜色
  baseLayer.filtRGB = [0, 50, 100] // 过滤颜色

  // 获取地图着色器代码
  const baseFragmentShaders =
    viewer.scene.globe._surfaceShaderSet.baseFragmentShaderSource.sources
  baseFragmentShaders.forEach((shader: string, index: number) => {
    // 找到对应颜色的地方
    // 换行要注意带上
    const strS = 'color = czm_saturation(color, textureSaturation);\n#endif\n'
    // 相当于在已有的着色器后面接着改
    let strT = 'color = czm_saturation(color, textureSaturation);\n#endif\n'
    if (baseLayer.invertColor) {
      strT += `
        color.r = 1.0 - color.r;
        color.g = 1.0 - color.g;
        color.b = 1.0 - color.b;
      `
    }
    if (baseLayer.filtRGB) {
      strT += `
        color.r = color.r * ${baseLayer.filtRGB[0]}.0 / 255.0;
        color.g = color.g * ${baseLayer.filtRGB[1]}.0 / 255.0;
        color.b = color.b * ${baseLayer.filtRGB[2]}.0 / 255.0;
      `
    }
    baseFragmentShaders[index] = baseFragmentShaders[index].replace(strS, strT)
  })
}
