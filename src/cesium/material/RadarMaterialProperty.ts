import * as Cesium from 'cesium'
import gsap from 'gsap'

export default class RadarMaterialProperty {
  definitionChanged: Cesium.Event
  params = {
    uTime: 0
  }
  name: string
  constructor(name = 'aa') {
    this.name = name
    this.definitionChanged = new Cesium.Event()
    Cesium.Material._materialCache.addMaterial('RadarMaterialProperty', {
      fabric: {
        type: 'RadarMaterialProperty',
        uniforms: {
          uTime: 0
        },
        source: `
          czm_material czm_getMaterial(czm_materialInput materialInput)
          {
            // 生成默认的基础材质
            czm_material material = czm_getDefaultMaterial(materialInput);
            // 旋转 uv 得到动图
            vec2 newSt = mat2(
              sin(uTime), -cos(uTime),
              cos(uTime), sin(uTime)
            ) * (materialInput.st - 0.5);
            newSt = newSt + 0.5;


            vec2 st = newSt;
            // 绘制圆形
            float alpha = 1.0 - step(0.5,  distance(st, vec2(0.5, 0.5)));
            
            // 按照角度设置强弱
            // 获取角度, -π 到 π
            float angel = atan(st.x - 0.5 , st.y - 0.5);
            // 0 - 1
            float strength = (angel + 3.1415) / 6.28;
            alpha = alpha * strength;
            material.alpha = alpha;
            material.diffuse = vec3(st.x, st.y, 1.0);
            return material;
          }
          `
      }
    })

    gsap.to(this.params, {
      uTime: 6.28,
      duration: 1,
      repeat: -1,
      ease: 'linear'
    })
  }
  getType() {
    // 返回材质类型
    return 'RadarMaterialProperty'
  }
  getValue(time: number, result: any) {
    result.uTime = this.params.uTime
    // 返回材质值
    return result
  }

  equals(other: any) {
    // 判断两个材质是否相等
    return other instanceof RadarMaterialProperty && this.name === other.name
  }
}
