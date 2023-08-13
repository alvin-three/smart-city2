import * as Cesium from 'cesium'
import gsap from 'gsap'
let typeNum = 0
export default class PolylineFlyLineMaterialProperty {
  definitionChanged: Cesium.Event
  params = {
    uTime: 0
  }
  num: number
  color: Cesium.Color
  constructor(color = new Cesium.Color(0.7, 0.6, 1.0, 1.0)) {
    typeNum++
    this.num = typeNum
    this.color = color
    this.definitionChanged = new Cesium.Event()
    Cesium.Material._materialCache.addMaterial(
      'PolylineFlyLineMaterialProperty' + this.num,
      {
        fabric: {
          type: 'PolylineFlyLineMaterialProperty',
          uniforms: {
            uTime: 0,
            color: color
          },
          source: `
          czm_material czm_getMaterial(czm_materialInput materialInput)
          {
            // 生成默认的基础材质
            czm_material material = czm_getDefaultMaterial(materialInput);
            // uv
            vec2 st = materialInput.st;
            // 帧数来计算时间
            float time = fract(czm_frameNumber / (60.0 * 5.0));
            time = time * (1.0 + 0.1);
            // 平滑过度函数
            // smoothstep(edge0, edge1, value)
            // value < edge0 return 0
            // value > edge0 && value < edge1 return 0.5
            // value >= edge1 return 1
            // 设置透明度
            float alpha = smoothstep(time - 0.1, time, st.s) * step(-time, -st.s);
            alpha += 0.08;
            // 设置材质
            material.alpha = alpha;
            material.diffuse = color.rgb;
            return material;
          }
          `
        }
      }
    )

    gsap.to(this.params, {
      uTime: 1,
      duration: 2,
      repeat: -1,
      yoyo: true
    })
  }
  getType() {
    // 返回材质类型
    return 'PolylineFlyLineMaterialProperty' + this.num
  }
  getValue(time: number, result: any) {
    result.uTime = this.params.uTime
    // 返回材质值
    return result
  }

  equals(other: any) {
    // 判断两个材质是否相等
    return (
      other instanceof PolylineFlyLineMaterialProperty &&
      this.color === other.color
    )
  }
}
