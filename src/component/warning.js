import React, { useState } from 'react'
import './warning.scss'
import { ReactComponent as WarningImage } from '../image/bit38_decode_pay_attention.svg'
import  useInterval from '../utils/useInterval'
import onlineWifiIcon from '../image/online_notrecommend@2x.png'
import offlineWifiIcon from '../image/offline_recommended@2x.png'
export default (props) => {
  const [isOnline, setIsOnline] = useState(false)
  useInterval(() => {
    console.log(window.navigator.onLine)
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
            {props.content}
          </div>
          {/* <div className="network__wraper">
            
            <div>Network Connection Status:
              <img src={isOnline ? onlineWifiIcon : offlineWifiIcon} />
              {isOnline ? 'Online' : 'Offline'}
            <span
              style={{ background: isOnline ? '#e37f0a' : '#28ab00' }}
            >{isOnline ? 'Not Recommended' : 'Recommended'}</span>
            </div>
            {isOnline ? <div> (Suggest to switch to offline mode for security reason.)</div> : ''}
          </div> */}
        </div>
      </div>
    </div>
  )
}