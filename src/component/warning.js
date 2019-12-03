import React from 'react'
import './warning.scss'
import { ReactComponent as WarningImage } from '../image/bit38_decode_pay_attention.svg'
export default (props) => {
  return (
    <div>
      <div className="warning">
        <WarningImage />
        <div className="warningContent">
          <div className="warningTitle"> {props.title}</div>
          <div className="warningDescription">
            {props.content}
          </div>
        </div>
      </div>
    </div>
  )
}