import * as Cesium from 'cesium'
import gsap from 'gsap'

export default class LightWallMaterialProperty {
  definitionChanged: Cesium.Event
  params = {
    uTime: 0
  }
  name: string
  constructor(name = 'aa') {
    this.name = name
    this.definitionChanged = new Cesium.Event()
    Cesium.Material._materialCache.addMaterial('LightWallMaterialProperty', {
      fabric: {
        type: 'LightWallMaterialProperty',
        uniforms: {
          uTime: 0,
          image: './textures/spriteline2.png'
        },
        source: `
          czm_material czm_getMaterial(czm_materialInput materialInput)
          {
            // 生成默认的基础材质
            czm_material material = czm_getDefaultMaterial(materialInput);
            vec2 st = materialInput.st;
            // 纹理采样
            // 水平旋转
            // vec4 color = texture2D(image, vec2(fract(st.x - uTime), st.y));
            // 垂直效果
            vec4 color = texture2D(image, vec2(fract(st.y - uTime), st.x));
            material.alpha = color.a;
            material.diffuse = color.rgb;
            return material;
          }
          `
      }
    })

    gsap.to(this.params, {
      uTime: 1,
      duration: 1,
      repeat: -1,
      ease: 'linear'
    })
  }
  getType() {
    // 返回材质类型
    return 'LightWallMaterialProperty'
  }
  getValue(time: number, result: any) {
    result.uTime = this.params.uTime
    // 返回材质值
    return result
  }

  equals(other: any) {
    // 判断两个材质是否相等
    return (
      other instanceof LightWallMaterialProperty && this.name === other.name
    )
  }
}
