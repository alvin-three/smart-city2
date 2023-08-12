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

    // 直接加载
    const czml = [
      {
        id: 'document',
        name: 'box',
        version: '1.0'
      },
      {
        id: 'shape1',
        name: 'Blue box',
        position: {
          cartographicDegrees: [-114.0, 40.0, 300000.0]
        },
        box: {
          dimensions: {
            cartesian: [400000.0, 300000.0, 500000.0]
          },
          material: {
            solidColor: {
              color: {
                rgba: [0, 0, 255, 255]
              }
            }
          }
        }
      },
      {
        id: 'shape2',
        name: 'Red box with black outline',
        position: {
          cartographicDegrees: [-107.0, 40.0, 300000.0]
        },
        box: {
          dimensions: {
            cartesian: [400000.0, 300000.0, 500000.0]
          },
          material: {
            solidColor: {
              color: {
                rgba: [255, 0, 0, 128]
              }
            }
          },
          outline: true,
          outlineColor: {
            rgba: [0, 0, 0, 255]
          }
        }
      },
      {
        id: 'shape3',
        name: 'Yellow box outline',
        position: {
          cartographicDegrees: [-100.0, 40.0, 300000.0]
        },
        box: {
          dimensions: {
            cartesian: [400000.0, 300000.0, 500000.0]
          },
          fill: false,
          outline: true,
          outlineColor: {
            rgba: [255, 255, 0, 255]
          }
        }
      }
    ]
    // 谷歌kml数据的使用
    // const kmlPromise = Cesium.CzmlDataSource.load(czml)
    const kmlPromise = Cesium.CzmlDataSource.load('./Assets/czmlDemo.czml')
    kmlPromise.then((dataSource) => {
      viewer.dataSources.add(dataSource)
      viewer.flyTo(dataSource)
    })
  }
  return <div id="cesium"></div>
}

export default CesiumContainer
