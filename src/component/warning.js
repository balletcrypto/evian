import React, { useState } from 'react'
import './warning.scss'
import { ReactComponent as WarningImage } from '../image/bit38_decode_pay_attention.svg'
import  useInterval from '../utils/useInterval'
import onlineWifiIcon from '../image/online_notrecommend@2x.png'
import offlineWifiIcon from '../image/offline_recommended@2x.png'
export default (props) => {
  const [isOnline, setIsOnline] = useState(false)
  useInterval(() => {
    if (window.navigator.onLine) {
      setIsOnline(true)
    } else {
      setIsOnline(false)
    }
  }, 1000)
  return (
    <div>
      <div className="warning">
        <WarningImage />
        <div className="warningContent">
          <div className="warningTitle"> {props.title}</div>
          <div className="warningDescription">
            {props.content.map(text => {
              return (
                <div>{text}</div>
              )
            })}
          </div>
          <div className="network__wraper">
            <div>
              Network Connection Status:
              <div className="status" >
                <img src={isOnline ? onlineWifiIcon : offlineWifiIcon} />
                {isOnline ? 'Online' : 'Offline'}
              </div>
              <span
                className="networkTag"
                style={{ background: isOnline ? '#e37f0a' : '#28ab00' }}
              >{isOnline ? 'Not Recommended' : 'Recommended'}</span>
            </div>
            {isOnline ? <div> (For best security, we suggest you to use a permanently offline computer to do this step.)</div> : ''}
          </div>
        </div>
      </div>
    </div>
  )
}