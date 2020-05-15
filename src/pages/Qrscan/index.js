import React, { useState, useEffect, useRef } from 'react'
import QrReader from 'react-qr-reader'
import camera from '../../image/camera@2x.png'
import { ReactComponent as CopyIcon } from '../../image/bit38_decode_copy.svg'
import { ReactComponent as ClearIcon } from '../../image/clear_all.svg'
import { CopyToClipboard } from 'react-copy-to-clipboard';
import ReactAudioPlayer from 'react-audio-player';
import promptAudio from '../../scan.wav'
import './index.scss'
export default () => {
  const splictAddress = (address) => {
    function chunk (arr, len) {
      var chunks = [],
          i = 0,
          n = arr.length;
    
      while (i < n) {
        chunks.push(arr.slice(i, i += len));
      }
      return chunks;
    }
    return chunk(address.split(""), 17)
  }


  const [isOpenCamera, setIsOpenCamera] = useState(false)
  const [addressArray, setAddressArray] = useState([])
  const [repeatIndex, setRepeatIndex] = useState('')
  const [cameraScanSuccess, setCameraScanSuccess] = useState(false)
  const refAudio = useRef(null)
  useEffect(() => {
    const triggerAutoplay = () => {
      const audioObj = refAudio.current.audioEl.current
      audioObj.play()
      audioObj.pause()
      audioObj.currentTime = 0
    }
    document.body.addEventListener('click', triggerAutoplay, false)
    document.body.addEventListener('touchstart', triggerAutoplay, false)
  }, [])
  useEffect(() => {
    if (addressArray.length !== 0) {
      refAudio.current.audioEl.current.muted = false
      refAudio.current.audioEl.current.play()
      setCameraScanSuccess(true)
      setTimeout(() => {
        setCameraScanSuccess(false)
      }, 600);
    }
  }, [addressArray])
  const AddressBlock = (address) => {
    if(!address) return ""
    const addressArray = splictAddress(address)
    return addressArray.map((data, index) => {
      return (
        <div key={index} >{data.join("")}</div>
      )
    })
  }
  return (
    <div className="container" style={{ paddingBottom: '50px' }}>
      <ReactAudioPlayer
        muted
        src={promptAudio}
        ref={refAudio}
      />
      <div className={`cameraWraper ${cameraScanSuccess ? "greenBoder" : ""}`} >
        {!isOpenCamera ? (
          <div className="cameraNotShow" >
            <img src={camera} alt="camera" />
            <div className="openCameraButton" onClick={() => setIsOpenCamera(true)} >Turn on the camera</div>
          </div>
        ) : (
          <div className="cameraShow">
            <QrReader
              delay={200}
              showViewFinder={false}
              // onError={onReadQrcodeError}
              onScan={(data) => {
                if (data) {
                  if (addressArray.findIndex(item => item === data) > -1) {
                    let repeatIndex = addressArray.findIndex(item => item === data)
                    setRepeatIndex(repeatIndex)
                    setTimeout(() => {
                      setRepeatIndex("")
                    }, 1000);
                  }
                  if (addressArray.length === 0 || addressArray.indexOf(data) < 0) {
                    setAddressArray(addressArray.concat(data))
                  }
                }
              }}
              onError={(error) => {
                console.log(error)
              }}
              style={{ width: "100%" }}
            />
          </div>
        )}
        {addressArray.length > 0 && 
          <div className="lastScan">
            <div className="lastScan__title">
              Last scan：
            </div>
            <div className="lastScan__content">
              {AddressBlock(addressArray[addressArray.length - 1])}
            </div>
          </div>
        }
      </div>
      <div
        className="turnOffCameraButton"
        onClick={() => setIsOpenCamera(false)}
        style={{ visibility: isOpenCamera ? 'visible' : 'hidden' }}
      >Turn off the camera</div>
      <div className="addressList">
        <div className="addressHeader">
          Address ({addressArray.length})
          <div
            className="buttonWraper"
            style={{ visibility: addressArray.length ? 'visible' : 'hidden' }}
          >
            <CopyToClipboard
              text={addressArray.join('\n')}
              onCopy={() => alert("copy success")}
            >
            <div className="featureButton" ><CopyIcon /> Copy all</div>
            </CopyToClipboard>
            <div className="featureButton" onClick={() => setAddressArray([])}><ClearIcon /> Clear all</div>
          </div>
        </div>
        {!addressArray.length ? (
          <div className="noAddress">Turn on the camera and scan the QRcode</div>
        ) : (
          <div className="addressContent">
            <div className="left">
              <ul>
                {addressArray.map((address, index) => {
                  return (
                    <li>{index + 1}</li>
                  )
                })}
              </ul>
            </div>
            <div className="right">
              <ul>
                {
                  addressArray.map((address, index) => {
                    return (
                      <li className={repeatIndex === index ? 'animated flash' : ''} >{address}</li>
                    )
                  })
                }
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}