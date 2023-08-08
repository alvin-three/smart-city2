import './index.scss'
import loading from '../../assets/bg/bar.svg'
import eventBus from '../../utils/eventHub'
const BigScreen = () => {
  const toggleAction = (i: number) => {
    eventBus.emit('actionClick', i)
  }
  const toggleControl = (name: string) => {
    eventBus.emit('toggleControls', name)
  }
  const toggleCamera = (name: string) => {
    eventBus.emit('toggleCamera', name)
  }
  return (
    <div id="bigScreen">
      <div className="header">老陈智慧城市管理系统平台</div>
      <div className="main">
        <div className="left">
          <div className="cityEvent">
            <h3>
              <span>热气球动画</span>
            </h3>
            <h1 onClick={() => toggleAction(0)}>
              <img src={loading} className="icon" />
              <span>横穿模式</span>
            </h1>
            <h1 onClick={() => toggleAction(1)}>
              <img src={loading} className="icon" />
              <span>环绕模式</span>
            </h1>
            <div className="footerBoder"></div>
          </div>
          <div className="cityEvent">
            <h3>
              <span>切换视角</span>
            </h3>
            <h1 onClick={() => toggleCamera('carcamera_Orientation')}>
              <img src={loading} className="icon" />
              <span>横向</span>
            </h1>
            <h1 onClick={() => toggleCamera('rightcamera_Orientation')}>
              <img src={loading} className="icon" />
              <span>尾部</span>
            </h1>
            <div className="footerBoder"></div>
          </div>
        </div>
        <div className="right">
          <div className="cityEvent list">
            <h3>
              <span>事件列表</span>
            </h3>
            <ul>
              <li onClick={() => toggleControl('orbit')}>
                <h1>
                  <div>
                    <span>轨道控制器模式 </span>
                  </div>
                </h1>
                <p></p>
              </li>
              <li onClick={() => toggleControl('fly')}>
                <h1>
                  <div>
                    <span>飞行模式 </span>
                  </div>
                </h1>
                <p></p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BigScreen
