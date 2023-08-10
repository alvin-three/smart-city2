import { useEffect } from 'react'
import './cesium.css'
import * as Cesium from 'cesium'
import '../Widgets/widgets.css'
// 设置cesium静态资源的位置
window.CESIUM_BASE_URL = '/'
// 设置默认视角
Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(
  // 西 经度
  89.5,
  // 南 纬度
  20.4,
  // 东
  110.4,
  // 北
  61.2
)
const tiandituKey = 'c91205e0bef9e516b018693164bc6e51'
// 设置token
Cesium.Ion.defaultAccessToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5MDNjOTM2ZS0zNTJmLTQyOWEtYWE5ZC05NDM1NTBiZDkyYjIiLCJpZCI6MTI3NTg1LCJpYXQiOjE2NzgxNjc0Njd9.XhBVg2LHzny4EXwC46L28z6P9MbuCecfXyv-xlWs3vg'
const CesiumContainer = () => {
  useEffect(() => {
    init()
  })
  const init = async () => {
    const viewer = new Cesium.Viewer('cesium', {
      // 信息窗
      infoBox: false,
      // 搜索框
      geocoder: false,
      // 是否展示home按钮
      homeButton: false,
      // 观看模式选择， 3d 2.5d, 2d等
      sceneModePicker: false,
      // 图层选择
      baseLayerPicker: false,
      // 帮助按钮
      navigationHelpButton: false,
      // 是否播放动画按钮
      animation: false,
      // 时间线
      timeline: false,
      // 全局按钮
      fullscreenButton: false
    })
    // 隐藏logo
    viewer.cesiumWidget.creditContainer.style.display = 'none'

    // 相机
    // const position = Cesium.Cartesian3.fromDegrees(116.395928, 39.9092, 100)
    const position = Cesium.Cartesian3.fromDegrees(113.3191, 23.109, 2000)
    // 设置相机位置
    // setView ，瞬间到达
    // viewer.camera.setView({
    //   // 指定相机位置
    //   destination: position,
    //   // 设置相机的视角
    //   orientation: {
    //     // 左手坐标系，y轴向上
    //     // 偏航角度， 0 中间，90 向右，-90向左
    //     heading: Cesium.Math.toRadians(0), // 头，沿着y轴转动,即水平左右转动的效果
    //     // 俯仰角， 0 竖直向上， -90垂直向下
    //     pitch: Cesium.Math.toRadians(-30), // 头上下 转动的角度，即沿着x轴转动
    //     // 翻滚角度
    //     roll: 0 // 沿着z轴转动
    //   }
    // })
    // flyto 飞过去
    // viewer.camera.flyTo({
    //   // 指定相机位置
    //   destination: position,
    //   // 设置相机的视角
    //   orientation: {
    //     // 左手坐标系，y轴向上
    //     // 偏航角度， 0 中间，90 向右，-90向左
    //     heading: Cesium.Math.toRadians(0), // 头，沿着y轴转动,即水平左右转动的效果
    //     // 俯仰角， 0 竖直向上， -90垂直向下
    //     pitch: Cesium.Math.toRadians(-30), // 头上下 转动的角度，即沿着x轴转动
    //     // 翻滚角度
    //     roll: 0 // 沿着z轴转动
    //   }
    // })

    // primitives 添加物体
    // 材质 颜色
    // const material = new Cesium.ColorMaterialProperty(
    //   new Cesium.Color(1.0, 1.0, 1.0, 0.5)
    // )
    // 棋盘
    // const material = new Cesium.CheckerboardMaterialProperty({
    //   evenColor: Cesium.Color.YELLOW.withAlpha(0.5),
    //   oddColor: Cesium.Color.GREEN.withAlpha(0.5),
    //   repeat: new Cesium.Cartesian2(2, 2) // 横纵向数量
    // })
    // 条纹
    // const material = new Cesium.StripeMaterialProperty({
    //   evenColor: Cesium.Color.YELLOW.withAlpha(0.5),
    //   oddColor: Cesium.Color.GREEN.withAlpha(0.5),
    //   repeat: 32 // 重复数量
    // })
    // 网格线
    const material = new Cesium.GridMaterialProperty({
      color: Cesium.Color.YELLOW,
      cellAlpha: 0.2,
      lineCount: new Cesium.Cartesian2(8, 8), // 网格数量
      lineThickness: new Cesium.Cartesian2(2.0, 2.0) // 网格线的宽度
    })
    // 两种方式，第一用自带的api
    const rectangle = viewer.entities.add({
      id: 'entity-rect',
      rectangle: {
        coordinates: Cesium.Rectangle.fromDegrees(
          // 西边的经度
          85,
          // 南边维度
          20,
          // 东边经度
          105,
          // 北边维度
          30
        ),
        material: material
      }
    })
    //第二种，使用最原始的方式，
    // 1. 创建几何体
    const geometry = new Cesium.RectangleGeometry({
      // 图形
      rectangle: Cesium.Rectangle.fromDegrees(
        // 西边的经度
        115,
        // 南边维度
        20,
        // 东边经度
        135,
        // 北边维度
        30
      ),
      height: 0, // 距离地面的高度
      // 着色方式
      vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT
    })
    // 2. 生产实例
    const instance = new Cesium.GeometryInstance({
      id: 'instance1',
      geometry,
      attributes: {
        color: Cesium.ColorGeometryInstanceAttribute.fromColor(
          Cesium.Color.RED.withAlpha(0.5)
        )
      }
    })
    const geometry2 = new Cesium.RectangleGeometry({
      // 图形
      rectangle: Cesium.Rectangle.fromDegrees(
        // 西边的经度
        145,
        // 南边维度
        20,
        // 东边经度
        165,
        // 北边维度
        30
      ),
      height: 0, // 距离地面的高度
      // 着色方式
      vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT
    })
    const instance2 = new Cesium.GeometryInstance({
      id: 'instance2',
      geometry: geometry2,
      attributes: {
        color: Cesium.ColorGeometryInstanceAttribute.fromColor(
          Cesium.Color.BLUE.withAlpha(0.5)
        )
      }
    })
    // 3. 设置外观, 如果有多个物体实例，可以拥有不同的颜色外观
    const appearance = new Cesium.PerInstanceColorAppearance({
      flat: true
    })
    // 4.图元
    const primitive = new Cesium.Primitive({
      geometryInstances: [instance, instance2],
      appearance
    })
    // 5. 添加到地图中去
    viewer.scene.primitives.add(primitive)

    // 动态修改颜色
    setInterval(() => {
      const attr = primitive.getGeometryInstanceAttributes('instance2')
      attr.color = Cesium.ColorGeometryInstanceAttribute.toValue(
        // Cesium.Color.YELLOW.withAlpha(0.5)
        // 随机颜色
        Cesium.Color.fromRandom({
          alpha: 0.5
        })
      )
    }, 2000)

    // 鼠标点击事件
    const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
    handler.setInputAction((movement: any) => {
      // 鼠标点
      const pickObj = viewer.scene.pick(movement.position)
      if (Cesium.defined(pickObj) && typeof pickObj.id == 'string') {
        const attr = primitive.getGeometryInstanceAttributes(pickObj.id)
        attr.color = Cesium.ColorGeometryInstanceAttribute.toValue(
          // Cesium.Color.YELLOW.withAlpha(0.5)
          // 随机颜色
          Cesium.Color.fromRandom({
            alpha: 0.5
          })
        )
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
  }
  return <div id="cesium"></div>
}

export default CesiumContainer
