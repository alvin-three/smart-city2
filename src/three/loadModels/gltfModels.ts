import * as THREE from 'three'
import gsap from 'gsap'
import { Box3, Mesh } from 'three'
import gltfLoader from './gltfLoader'
import scene from '../scene/Scene'
const loadCity = () => {
  gltfLoader.load('/models/city/city.glb?raw', (gltf) => {
    gltf.scene.traverse((item) => {
      if (item.type === 'Mesh') {
        ;(item as THREE.Mesh).material = new THREE.MeshBasicMaterial({
          color: new THREE.Color(0x0c0e33)
        })
        // 开始修改材质
        modifyMaterail(item)

        // if (item.name == "Layerbuildings") {
        //     const meshLine = new MeshLine(item.geometry);
        //     const size = item.scale.x;
        //     meshLine.mesh.scale.set(size, size, size);
        //     scene.add(meshLine.mesh);
        //   }
      }
    })
    scene.add(gltf.scene)
  })
}

const loadModels = () => {
  loadCity()
}

const modifyMaterail = (mesh: THREE.Object3D<THREE.Event>) => {
  // console.log(shader.vertexShader);
  // console.log(shader.fragmentShader);
  // 在材质编译之前 去修改它
  ;(mesh as THREE.Mesh).material.onBeforeCompile = (shader: THREE.Shader) => {
    // console.log(shader.vertexShader)
    // console.log(shader.fragmentShader)
    // //#end#当做上一次修改的标记，后面 要修改时，会用到
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <dithering_fragment>',
      `
          #include <dithering_fragment>
          //#end#
      `
    )
    addGradColor(shader, mesh as THREE.Mesh)
    // 添加扩散
    addSpread(shader)
    // 添加纵向 扫描
    addScane(shader)
  }
}

// 从下到上的渐变
const addGradColor = (shader: THREE.Shader, mesh: THREE.Mesh) => {
  // 从下到上的渐变色
  // 需要计算 模型的最大高度和最小高度
  mesh.geometry.computeBoundingBox()
  const { min, max } = mesh.geometry.boundingBox as Box3
  //   获取物体的高度差
  const uHeight = max.y - min.y

  // 传值
  shader.uniforms.uTopColor = {
    value: new THREE.Color('#aaaeff')
  }
  shader.uniforms.uHeight = {
    value: uHeight
  }
  shader.vertexShader = shader.vertexShader.replace(
    '#include <common>',
    `
      #include <common>
      // 需要就将 位置信息传递下去
      varying vec3 vPosition;
      `
  )
  shader.vertexShader = shader.vertexShader.replace(
    '#include <begin_vertex>',
    `
      #include <begin_vertex>
      // 将posiiton的值传递下去
      vPosition = position;
      `
  )

  // 片元着色器

  // 接收参数
  shader.fragmentShader = shader.fragmentShader.replace(
    '#include <common>',
    `
      #include <common>
      uniform float uHeight;
      uniform vec3 uTopColor;
      varying vec3 vPosition;
      `
  )
  shader.fragmentShader = shader.fragmentShader.replace(
    '//#end#',
    `
        vec4 distGradColor = gl_FragColor;
        // 计算 颜色混合的比例, min -> max 可能为负值，但是颜色混合的值都是在（0,1）之间
        float gradMix = (vPosition.y+uHeight/2.0)/uHeight;
        // 计算出混合颜色
        vec3 gradMixColor = mix(distGradColor.xyz,uTopColor,gradMix);
        gl_FragColor = vec4(gradMixColor, 1);
        //#end#
    `
  )
}
// 圆心渐变 扩散效果
const addSpread = (shader: THREE.Shader, center = new THREE.Vector2(0, 0)) => {
  // 利用 y = - x * x， 与x轴交点为0，当向上移动 1时， 交点为（-1,0）， （1,0），宽度为2
  // 当变形为 y = -(x-1) * (x-1) + 1时，即延x轴真放心平移了1单位，交点为 （0， 0），（2， 0）,宽度仍然为2

  // 定义扩散宽度,即b
  shader.uniforms.uSpreadWidth = {
    value: 40
  }
  // 扩散时间，决定了 x轴正向平移多少
  shader.uniforms.uSpreadTime = {
    value: -2000
  }
  // 扩散中心点, 默认从中心点开始扩散
  shader.uniforms.uSpreadCenter = { value: center }

  // 先定义变量
  shader.fragmentShader = shader.fragmentShader.replace(
    '#include <common>',
    `
    #include <common>
    uniform vec2 uSpreadCenter;
    uniform float uSpreadTime;
    uniform float uSpreadWidth;
    `
  )

  // 修改着色器
  shader.fragmentShader = shader.fragmentShader.replace(
    '//#end#',
    `
    // 计算到中心点的距离
        float spreadRadius = distance(vPosition.xz, uSpreadCenter);
    // 扩散范围函数， - uSpreadTime 相当于 移动 x轴向 y轴正方向移动，可以得到一个两个交点之间的距离
    // uSpreadTime 从 -2000开始时，整体spreadIndex是负值，且很大
    // 当 uSpreadTime ===  spreadRadius 即spreadIndex到达最大值
    float spreadIndex = - (spreadRadius - uSpreadTime) * (spreadRadius - uSpreadTime) + uSpreadWidth;
    if(spreadIndex > 0.0) {
        // 当前颜色和 白色做混合，当值 > spreadIndex / uSpreadWidth, 就用白色，否则用原本的颜色
        gl_FragColor = mix(gl_FragColor, vec4(1,1,1,1), spreadIndex / uSpreadWidth);
    }
    //#end#
    `
  )

  gsap.to(shader.uniforms.uSpreadTime, {
    value: 1000,
    duration: 3,
    repeat: -1,
    ease: 'none'
  })
}

const addScane = (shader: THREE.Shader) => {
  // 扫描效果。先考虑 单向扫描的效果，即假设延x轴方向扫描，因此不会考虑到z值的情况
  // 同上
  // 定义线条宽度,即b
  shader.uniforms.uLightWidth = {
    value: 40
  }
  //
  shader.uniforms.uLightTime = {
    value: 10
  }

  // 先定义变量
  shader.fragmentShader = shader.fragmentShader.replace(
    '#include <common>',
    `
        #include <common>
        uniform float uLightWidth;
        uniform float uLightTime;
        `
  )

  // 修改着色器
  shader.fragmentShader = shader.fragmentShader.replace(
    '//#end#',
    `
        // 只考虑x轴的情况,即沿着x轴动就可以了, 
        //   float lightIndex = - (vPosition.x  - uSpreadTime) * (vPosition.x  - uSpreadTime) + uLightWidth;
        // 如果要考虑z轴的影响，那么就 + z的只值即可,  
        float lightIndex = - (vPosition.x  + vPosition.z - uSpreadTime) * (vPosition.x  + vPosition.z - uSpreadTime) + uLightWidth;
          if(lightIndex > 0.0) {
              // 当前颜色和 白色做混合，当值 > lightIndex / uSpreadWidth, 就用白色，否则用原本的颜色
              gl_FragColor = mix(gl_FragColor, vec4(0.8,1,1,1), lightIndex / uLightWidth);
          }
          //#end#
          `
  )

  gsap.to(shader.uniforms.uLightTime, {
    value: 1000,
    duration: 3,
    repeat: -1,
    ease: 'none'
  })
}
export default loadModels
