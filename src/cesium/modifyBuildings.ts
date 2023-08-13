import * as Cesium from 'cesium'

export default async function modifyBuilding(viewer: Cesium.Viewer) {
  const tiles3d = await initBuildings(viewer)
  // const modelContent = viewer.scene
  // 3d建筑可见时 添加监听事件
  tiles3d.tileVisible.addEventListener((tile) => {
    // console.log(tile, 'asdf')
    const content = tile.content
    // model的数量
    const featuresLength = content.featuresLength
    for (let i = 0; i < featuresLength; i++) {
      const model = content.getFeature(i).content._model
      model._rendererResources.sourceShaders[1] = `
      varying vec3 v_positionEC;
      varying vec2 v_st;
      void main()
      {
          czm_materialInput materialInput;
          vec4 position = czm_inverseModelView * vec4(v_positionEC, 1.0);
          // 根据 高度来设置强度, 此处以武汉保利大厦为最高点，所以只有 160米
          float strength = position.z / 150.0;
          gl_FragColor = vec4(strength, 0.3 * strength, strength, 1);
          // 动态光环
          // 根据帧数来实现. czm_frameNumber 获取当前帧数, 1s 大概60帧
          // fract(x), 返回x的小数部分
          //  1s 大概60帧 , 所以这个time相当于是当前1s内的某个位置, 0 -> 1的范围
          float time = fract(czm_frameNumber / (60.0 * 5.0));
          // 计算往返, -1 -> 1 的范围
          time = abs(time - 0.5) * 2.0;
          // 计算距离
          // clamp(x, min, max) 返回x在min和max中间的最小值
          float diff = abs(clamp(position.z / 500.0, 0.0, 1.0) - time);
          // step(edge, x) 如果x > edge 返回1 ，否则 返回 0
          diff = step(0.01, diff);
          // 先加一个亮色，然后在0 的位置是需要发光的
          gl_FragColor.rgb += vec3(0.5) * (1.0 - diff);

      }
    `
      // 片元着色器已经修改，需要通知更新
      model._shouldRegenerateShaders = true
    }
  })
}

// 添加全球建筑物
const initBuildings = async (viewer: Cesium.Viewer) => {
  const tileset = Cesium.createOsmBuildings()
  viewer.scene.primitives.add(tileset)
  return tileset
}
