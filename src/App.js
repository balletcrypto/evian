import React, { useState, useRef } from 'react';

import './App.scss';
import { ReactComponent as Logo } from './image/logo.svg'
import { ReactComponent as GitHubIcon } from './image/org_github.svg'
import warningImage from './image/pay_attention.png'
import { validateConfirmation } from './utils/cryptojs-lib/confirmation'
import {
  getBitcoinAddress,
  getBitcoinCashAddress,
  getEthAddress,
  getLitecoinAddress,
  getXRPAddress,
  getSegwitAddress,
  getBTGAddress,
  getBnbAddress
} from './utils/cryptojs-lib/CryptoAddress'
import { decryptEpkVcode } from './utils/cryptojs-lib/bip38.js'
import { getLitecoinWif } from './utils/cryptojs-lib/wif.js'
import copyImage from './image/copy.png'
import qrcodeImage from './image/address.png'
import { CopyToClipboard } from 'react-copy-to-clipboard';
import QRcode from 'qrcode.react'
import QrReader from 'react-qr-reader'

function App() {
  const [passphraseInputCount, setPassphraseInputCount] =
  useState(Array.from(new Array(20).keys())
  .map(num => ''))
  const [confirmationCode, setConfirmationCode] = useState('')
  const [epk, setEpk] = useState('')
  const [publicKeyHex, setPublicKeyHex] = useState('')
  const [privateKeyHex, setPrivateKeyHex] = useState('')
  // Address
  const [bitcoinSegwitAddress, setBitcoinSegwitAddress] = useState('')
  const [bitcoinLegacyAddress, setBitcoinLegacyAddress] = useState('')
  const [ethereumAddress, setethereumAddress] = useState('')
  const [xrpAddress, setXrpAddress] = useState('')
  const [bitcoinCashAddress, setBitcoinCashAddress] = useState('')
  const [litecoinAddress, setLitecoinAddress] = useState('')
  const [bitcoinSVAddress, setBitcoinSVAddress] = useState('')
  const [bitcoinGoldAddress, setBitcoinGoldAddress] = useState('')
  const [bitcoinDiamondAddress, setBitcoinDiamondAddress] = useState('')
  const [bnbAddress, setBnbAddress] = useState('')
  // Private Key
  const [bitcoinSegWitPrivateKeyWIF, setBitcoinSegWitPrivateKeyWIF] = useState('')
  const [bitcoinLegacyPrivateKeyWIF, setBitcoinLegacyPrivateKeyWIF] = useState('')
  const [ethereumPrivateKey, setEthereumPrivateKey] = useState('')
  const [xrpPrivateKey, setXrpPrivateKey] = useState('')
  const [bitcoinCashPrivateKeyWIF, setBitcoinCashPrivateKeyWIF] = useState('')
  const [litecoinPrivateKeyWIF, setLitecoinPrivateKeyWIF] = useState('')
  const [bitcoinSVPrivateKeyWIF, setBitcoinSVPrivateKeyWIF] = useState('')
  const [bitcoinGoldPrivateKeyWIF, setBitcoinGoldPrivateKeyWIF] = useState('')
  const [bitcoinDiamondPrivateKeyWIF, setBitcoinDiamondPrivateKeyWIF] = useState('')
  const [bnbPrivateKey, setBnbPrivateKey] = useState('')
  const [verifyLoading, setVerifyLoading] = useState(false)
  const [isShowAddress, setIsShowAddress] = useState(false)
  const [isShowprivateKey, setIsShowprivateKey] = useState(false)
  const [isShowreadQrcode, setIsShowreadQrcode] = useState(false)
  const [isDecodeLoading, setIsDecodeLoading] = useState(false)
  const inputRefs = []
  for (let i = 0; i < 24; i ++) {
    inputRefs.push(useRef());
  }
  const outputAddressWIFList = [
    {
      currency: 'btc',
      title: 'Bitcoin (BTC)',
      addressKey: 'SegWit Address',
      getAddressMethod: getSegwitAddress,
      addressInputValue: bitcoinSegwitAddress,
      setAddressInputMethod: setBitcoinSegwitAddress,
      privateKeyInputValue: bitcoinSegWitPrivateKeyWIF,
      setPrivateKeyInputMethod: setBitcoinSegWitPrivateKeyWIF,
      WIFKey: 'Private Key (WIF)',
    },
    {
      currency: 'btc',
      title: 'Bitcoin (BTC)',
      addressKey: 'Legacy Address',
      getAddressMethod: getBitcoinAddress,
      addressInputValue: bitcoinLegacyAddress,
      setAddressInputMethod: setBitcoinLegacyAddress,
      privateKeyInputValue: bitcoinLegacyPrivateKeyWIF,
      setPrivateKeyInputMethod: setBitcoinLegacyPrivateKeyWIF,
      WIFKey: 'Private Key (WIF)',
    },
    {
      currency: 'eth',
      title: 'Ethereum (ETH)',
      addressKey: 'Address',
      getAddressMethod: getEthAddress,
      addressInputValue: ethereumAddress,
      setAddressInputMethod: setethereumAddress,
      privateKeyInputValue: ethereumPrivateKey,
      setPrivateKeyInputMethod: setEthereumPrivateKey,
      WIFKey: 'Private Key',
    },
    {
      currency: 'xrp',
      title: 'XRP (XRP)',
      addressKey: 'Address',
      getAddressMethod: getXRPAddress,
      addressInputValue: xrpAddress,
      setAddressInputMethod: setXrpAddress,
      privateKeyInputValue: xrpPrivateKey,
      setPrivateKeyInputMethod: setXrpPrivateKey,
      WIFKey: 'Private Key',
    },
    {
      currency: 'btc',
      title: 'Bitcoin Cash (BCH)',
      addressKey: 'Address',
      getAddressMethod: getBitcoinCashAddress,
      addressInputValue: bitcoinCashAddress,
      setAddressInputMethod: setBitcoinCashAddress,
      privateKeyInputValue: bitcoinCashPrivateKeyWIF,
      setPrivateKeyInputMethod: setBitcoinCashPrivateKeyWIF,
      WIFKey: 'Private Key (WIF)',
    },
    {
      currency: 'ltc',
      title: 'Litecoin (LTC)',
      addressKey: 'Address',
      getAddressMethod: getLitecoinAddress,
      addressInputValue: litecoinAddress,
      setAddressInputMethod: setLitecoinAddress,
      privateKeyInputValue: litecoinPrivateKeyWIF,
      setPrivateKeyInputMethod: setLitecoinPrivateKeyWIF,
      WIFKey: 'Private Key (WIF)',
    },
    {
      currency: 'btc',
      title: 'Bitcoin SV (BSV)',
      addressKey: 'Address',
      getAddressMethod: getBitcoinAddress,
      addressInputValue: bitcoinSVAddress,
      setAddressInputMethod: setBitcoinSVAddress,
      privateKeyInputValue: bitcoinSVPrivateKeyWIF,
      setPrivateKeyInputMethod: setBitcoinSVPrivateKeyWIF,
      WIFKey: 'Private Key (WIF)',
    },
    {
      currency: 'btc',
      title: 'Bitcoin Gold (BTG)',
      addressKey: 'Address',
      getAddressMethod: getBTGAddress,
      addressInputValue: bitcoinGoldAddress,
      setAddressInputMethod: setBitcoinGoldAddress,
      privateKeyInputValue: bitcoinGoldPrivateKeyWIF,
      setPrivateKeyInputMethod: setBitcoinGoldPrivateKeyWIF,
      WIFKey: 'Private Key (WIF)',
    },
    {
      currency: 'btc',
      title: 'Bitcoin Diamond (BCD)',
      addressKey: 'Address',
      getAddressMethod: getBitcoinAddress,
      addressInputValue: bitcoinDiamondAddress,
      setAddressInputMethod: setBitcoinDiamondAddress,
      privateKeyInputValue: bitcoinDiamondPrivateKeyWIF,
      setPrivateKeyInputMethod: setBitcoinDiamondPrivateKeyWIF,
      WIFKey: 'Private Key (WIF)',
    },
    {
      currency: 'bnb',
      title: 'Binance Coin',
      addressKey: 'Address',
      getAddressMethod: getBnbAddress,
      addressInputValue: bnbAddress,
      setAddressInputMethod: setBnbAddress,
      privateKeyInputValue: bnbPrivateKey,
      setPrivateKeyInputMethod: setBnbPrivateKey,
      WIFKey: 'Private Key',
    }
  ]
  const formatPassphrase = (Passphrase) => {
    let formatedPassphraseInput = Passphrase.slice()
    formatedPassphraseInput.splice(4, 0, '-')
    formatedPassphraseInput.splice(9, 0, '-')
    formatedPassphraseInput.splice(14, 0, '-')
    formatedPassphraseInput.splice(19, 0, '-')
    return formatedPassphraseInput.join('').toUpperCase()
  }

  const setAddress = (publicKeyHex) => {
    outputAddressWIFList.forEach(item =>  {
      const address = item.getAddressMethod(publicKeyHex)
      item.setAddressInputMethod(address)
    })
  }
  const  verifyConfirmationCode = async () => {
    setVerifyLoading(true)
    try {
      const { valid, publicKeyHex } = await validateConfirmation(confirmationCode, formatPassphrase(passphraseInputCount))
      if (valid) {
        setPublicKeyHex(publicKeyHex)
        setAddress(publicKeyHex)
        setIsShowAddress(true)
        setVerifyLoading(false)
      } else {
        alert("The wallet passphrase or BIP38 confirmation code you entered is incorrect. Please double-check and try again.")
        setVerifyLoading(false)
      }
    } catch (error) {
      alert("The wallet passphrase or BIP38 confirmation code you entered is incorrect. Please double-check and try again.")
      setVerifyLoading(false)
    }
  }
  const decodePrivateKey = () => {
    if (formatPassphrase(passphraseInputCount).length < 0 || !epk) {
      alert("Please input Passphrase or Private Key")
    }
    setIsDecodeLoading(true)
    setTimeout(() => {
      try {
        const { publicKeyHex, privateKeyHex, wif } = decryptEpkVcode(epk, formatPassphrase(passphraseInputCount))
        setIsDecodeLoading(false)
        setPublicKeyHex(publicKeyHex)
        setPrivateKeyHex(privateKeyHex)
        setAddress(publicKeyHex)
        setIsShowAddress(true)
        setIsShowprivateKey(true)
        outputAddressWIFList.forEach(item => {
          let outputPrivateKey = ''
          if (item.currency === 'btc') {
            outputPrivateKey = wif
          }
          if (item.currency ===  'eth' || item.currency === 'xrp') {
            outputPrivateKey = privateKeyHex
          }
          if (item.currency === 'ltc') {
            outputPrivateKey = getLitecoinWif(privateKeyHex)
          }
          item.setPrivateKeyInputMethod(outputPrivateKey)
         })
      } catch (error) {
        alert('The encrypted private key or wallet passphrase you entered is incorrect. Please double-check and try again.')
        setIsDecodeLoading(false)
      }
    }, 0);
  }

  const outputComponent = (title, key) => {
    const [isHovered, setIsHovered] = useState(false)
    const MouseOver = (key) => {
      setIsHovered(true)

    }
    const MouseOut = () => {
      setIsHovered(false)
    }
    return (
      <div className="outputComponent">
        {isHovered ? (
          <div className="popover">
            <QRcode value={key} />
          </div>
        ) : ''}
        <div className="outputTitle">{title}</div>
        <div className="field">
          <div className="control">
            <input
              value={key}
              className="input"
              type="text"
              readOnly
            />
            <CopyToClipboard
              text={key}
              onCopy={() => alert("copy success")}
            >
              <span><img src={copyImage} /></span>
            </CopyToClipboard>
            <span
              onMouseEnter={(e) => MouseOver(key)}
              onMouseLeave={(e) => MouseOut()}
            ><img src={qrcodeImage} /></span>
          </div>
        </div>
      </div>
    )
  }

const InputItem = ({ inputIndex, value }) => {
  const onKeyDown = (e) => {
    if (e.keyCode === 8) {
      if (!passphraseInputCount[e.target.dataset.id]) {
        setTimeout(() => {
          if (inputIndex > 0) {
            setPassphraseInputCount(passphraseInputCount.map((item, index) => {
              if ((inputIndex - 1) == index) {
                return ''
              }
              return item
            }))
            inputRefs[inputIndex - 1].current.focus()
            inputRefs[inputIndex - 1].current.select()
          }
        }, 0);
        return
      }
      setPassphraseInputCount(passphraseInputCount.map((item, index) => {
        if (e.target.dataset.id == index) {
          return ''
        }
        return item
      }))
      setTimeout(() => {
        if (inputIndex > 0) {
          inputRefs[inputIndex].current.focus()
          inputRefs[inputIndex].current.select()
        }
      }, 0);
    }
  }

  const onChange = (e) => {
    setPassphraseInputCount(passphraseInputCount.map((item, index) => {
      if (e.target.dataset.id == index) {
        return e.target.value
      }
      return item
    }))
    setTimeout(() => {
      if (inputIndex < 19) {
        inputRefs[inputIndex + 1].current.focus()
        // inputRefs[inputIndex + 1].current.select()
      }

    }, 0);
  }
  return (
    <input
      data-id={inputIndex}
      className="inputItem"
      value={value}
      onChange={(e) => {onChange(e)}}
      ref={inputRefs[inputIndex]}
      onKeyDown={(e) => {onKeyDown(e)}}
      onFocus={(e) => { inputRefs[inputIndex].current.select() }}
    />
  )
}

  return (
    <div className="evian">
      <div className="header">
        <a href="https://balletcrypto.com" ><Logo/></a>
        <a href="https://github.com/balletcrypto/evian" target="_blank"><GitHubIcon  className="github" /></a>
      </div>
      <div className="content container">
        <h2>BIP38 Verify & Decrypt</h2>
        <div className="warning">
          <img src={warningImage} alt="warning icon" />
          <div className="warningContent">
            <div className="warningTitle" >Read Before Decrypt</div>
            <div className="warningDescription">To ensure security, we strongly encourage you to disconnect the internet first. You can run the decryption process offline. Never share your private key with the unauthorized party, as it will allow access to your crypto assets.</div>
          </div>
        </div>
        <div className="passphrase">
          <div className="passphrase__title commonTitle">
            Passphrase
            <div className="resetContent" onClick={() => window.location.reload()}>
              Reset Page
            </div>
          </div>
          <div className="commonDescription">Wallet passphrase are case sensitive. Format: xxxx-xxxx-xxxx-xxxx-xxxx</div>
          <div className="passphrase__input">
            <div className="inputWraper">
              {passphraseInputCount.map((item, index) => {
                return (
                  <>
                    <InputItem
                      key={index}
                      inputIndex={index}
                      value={item}
                    />
                    {!((index + 1) % 4) && (index + 1 < 17) ? (<div className="symbolInput">-</div>) : ''}
                  </>
                )
              })}
            </div>
          </div>
        </div>
        <div className="columns is-vcentered inputContent is-desktop">
          <div className="column is-5">
            <div className="commonTitle">
              BIP38 Confirmation Code
            </div>
            <div className="commonDescription">
            This confirmation code is 75 characters starting with "cfrm38". <br/> 
            Use Ballet Crypto <a href="https://app.balletcrypto.com" >App</a> get Confirmation Code(Verify - View Confirmation Code.)
            </div>
            <textarea
              className="textarea"
              placeholder="Enter the confirmation code"
              value={confirmationCode}
              onChange={e => setConfirmationCode(e.target.value)}
            ></textarea>
            <a
              className={`button is-warning ${verifyLoading ? 'is-loading' : ''}`}
              onClick={verifyConfirmationCode}

            >Verify</a>
          </div>
          <div className="column is-2 is-hidden-mobile">
            <div className="middleStyle">or</div>
          </div>
          <div className="column is-5">
            <div className="commonTitle">Private Key</div>
            <div className="commonDescription privateKeyDescription">
              Private key starts with "6P"
              <span className="readQrcodeButton" onClick={() => setIsShowreadQrcode(!isShowreadQrcode)}>
                {isShowreadQrcode ? (
                  <div className="readQrcodeModal">
                    <QrReader
                      delay={200}
                      // onError={onReadQrcodeError}
                      onScan={(data) => {
                        if (data) {
                          setEpk(data)
                          setIsShowreadQrcode(false)
                        }
                      }}
                      style={{ width: "100%" }}
                    />
                  </div>
                ) : ''}
                <span className="readQrcodeText" >Scan</span>
              </span>
            </div>
            <textarea
              className="textarea"
              placeholder="Enter the Private Key"
              value={epk}
              onChange={e => setEpk(e.target.value)}
            ></textarea>
            <a
              className={`button is-warning ${isDecodeLoading ? 'is-loading' : ''}`}
              onClick={decodePrivateKey}
            >Decode</a>
          </div>
        </div>
        <div className="outWraper">
          <div className="columns ouput">
            <div className={`column is-5 ${isShowAddress ? '': 'hide'}`} >
              {outputComponent("Public key in Hex", publicKeyHex)}
            </div>
            <div className="column is-2"></div>
            <div className={`column is-5 ${isShowprivateKey ? '': 'hide'}`}>
              {outputComponent("Private key in Hex", privateKeyHex)}
            </div>
          </div>
          {outputAddressWIFList.map((item, index) =>
            <>
              <div className={`currencyTitle ${isShowAddress ? '': 'hide'}`}>{item.title}</div>
              <div className="columns">
                <div className={`column is-5 ${isShowAddress ? '': 'hide'}`}>
                  {outputComponent(item.addressKey, item.addressInputValue)}
                </div>
                <div className="column"></div>
                <div className={`column is-5 ${isShowprivateKey ? '': 'hide'}`}>
                  {outputComponent(item.WIFKey, item.privateKeyInputValue)}
                </div>
              </div>  
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
