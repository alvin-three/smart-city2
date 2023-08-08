import './App.css'
import City from './pages/city/City'
import BigScreen from './pages/bigScreen'
import { useState } from 'react'
import axios from 'axios'
export interface IInfoItem {
  name?: string
  number: number
  unit?: string
}
export interface ICityInfo {
  iot: IInfoItem
  event: IInfoItem
  power: IInfoItem
  test: IInfoItem
  [key: string]: IInfoItem
}
export interface IEventItem {
  name: string
  position: {
    x: number
    y: number
  }
  type: string
  time: string
}
function App() {
  // 获取数据
  const [dataInfo, setDataInfo] = useState<ICityInfo>({
    iot: { number: 0 },
    event: { number: 0 },
    power: { number: 0 },
    test: { number: 0 }
  })
  const [cityList, setCityList] = useState<IEventItem[]>([])

  const changeInfo = async () => {
    const res = await axios.get(
      'http://127.0.0.1:4523/m1/3115366-0-default/api/smartcity/info'
    )
    setDataInfo(res.data.data)
  }
  const getCityList = async () => {
    const res = await axios.get(
      'http://127.0.0.1:4523/m1/3115366-0-default/api/smartcity/list'
    )
    setCityList(res.data.list)
  }

  return (
    <div className="App">
      <City />
      <BigScreen />
    </div>
  )
}

export default App
