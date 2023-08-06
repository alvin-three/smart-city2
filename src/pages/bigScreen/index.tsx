import './index.scss'
import loading from '../../assets/bg/bar.svg'
import electric from '../../assets/bg/dianli.svg'
import fire from '../../assets/bg/fire.svg'
import jingcha from '../../assets/bg/jingcha.svg'
import { ICityInfo, IEventItem } from '../../App'
import eventBus from '../../utils/eventHub'
import { useState } from 'react'
const BigScreen = (props: { dataInfo: ICityInfo; eventList: IEventItem[] }) => {
  const toFixInt = (num: number) => {
    return num.toFixed(0)
  }
  const imgs: {
    [key: string]: string
  } = {
    电力: electric,
    火警: fire,
    治安: jingcha
  }
  const [currentActive, setActive] = useState<number>()
  eventBus.on('spriteClick', (data) => {
    setActive(data.i)
  })

  const toggleEvent = (i: number) => {
    setActive(i)
    eventBus.emit('eventToggle', i)
  }
  return (
    <div id="bigScreen">
      <div className="header">老陈智慧城市管理系统平台</div>
      <div className="main">
        <div className="left">
          {Object.keys(props.dataInfo).map((key, index) => {
            const item = props.dataInfo[key]
            return (
              <div className="cityEvent" key={index}>
                <h3>
                  <span>{item.name}</span>
                </h3>
                <h1>
                  <img src={loading} className="icon" />
                  <span>
                    {toFixInt(item.number)}（{item.unit}）
                  </span>
                </h1>
                <div className="footerBoder"></div>
              </div>
            )
          })}
        </div>
        <div className="right">
          <div className="cityEvent list">
            <h3>
              <span>事件列表</span>
            </h3>
            <ul>
              {props.eventList.map((item, index) => {
                return (
                  <li
                    key={index}
                    className={currentActive == index ? 'active' : ''}
                    onClick={() => toggleEvent(index)}
                  >
                    <h1>
                      <div>
                        <img className="icon" src={imgs[item.name]} />
                        <span> {item.name} </span>
                      </div>
                      <span className="time"> {item.time} </span>
                    </h1>
                    <p>{item.type}</p>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BigScreen
