import React, { useState, useRef } from 'react';

import './App.scss';
import { ReactComponent as Logo } from './image/logo.svg'
import { ReactComponent as GitHubIcon } from './image/org_github.svg'
import { ReactComponent as Arrow } from './image/arrow.svg'
import { ReactComponent as CopyIcon } from './image/bit38_decode_copy.svg'
import { ReactComponent as QrcodeIcon } from './image/bit38_decode_address.svg'
import { ReactComponent as ScanQrcodeIcon } from './image/bit38_decode_scan.svg'
import { ReactComponent as WarningImage } from './image/bit38_decode_pay_attention.svg'
import { validateConfirmation } from './utils/cryptojs-lib/confirmation'
import { genIntermediate } from './utils/cryptojs-lib/Intermediate'
import {
  getBitcoinAddress,
  getBitcoinCashAddress,
  getEthAddress,
  getLitecoinAddress,
  getXRPAddress,
  getSegwitAddress,
  getBTGAddress,
  getBnbAddress,
  getQtumAddress,
  getDashAddress,
  getDogeAddress
} from './utils/cryptojs-lib/CryptoAddress'
import { decryptEpkVcode } from './utils/cryptojs-lib/bip38.js'
import {
  getLitecoinWif,
  getDashwif,
  getDogewif
} from './utils/cryptojs-lib/wif.js'
import { CopyToClipboard } from 'react-copy-to-clipboard';
import QRcode from 'qrcode.react'
import QrReader from 'react-qr-reader'

function App() {
  const [balletPassphrase, setBalletPassphrase] = useState("")
  const [confirmationCode, setConfirmationCode] = useState('')
  const [epk, setEpk] = useState('')
  const [publicKeyHex, setPublicKeyHex] = useState('')
  const [privateKeyHex, setPrivateKeyHex] = useState('')
  const [customPassphrase, setCustomPassphrase] = useState('')
  const [intermediateCode, setIntermediateCode] = useState('')
  const [generateIntermediateCodeLoading, setGenerateIntermediateCodeLoading] = useState(false)
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
  const [qtumAddress, setQtumAddress] = useState('')
  const [usdtERC20Address, setusdtERC20Address] = useState('')
  const [leoAddress, setLeoAddress] = useState('')
  const [linkAddress, setLinkAddress] = useState('')
  const [mkrAddress, setMkrAddress] = useState('')
  const [usdcAddress, setUsdcAddress] = useState('')
  const [htAddress, setHtAddress] = useState('')
  const [tusdAddress, setTusdAddress] = useState('')
  const [daiAddress, setDaiAddress] = useState('')
  const [etcAddress, setEtcAddress] = useState('')
  const [batAddress, setBatAddress] = useState('')
  const [dashAddress, setDashAddress] = useState('')
  const [dogeAddress, setDogeAddress] = useState('')
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
  const [qtumPrivateKey, setQtumPrivateKey] = useState('')
  const [usdtERC20PrivateKey, setUsdtERC20PrivateKey] = useState('')
  const [leoPrivateKey, setleoPrivateKey] = useState('')
  const [linkPrivateKey, setLinkPrivateKey] = useState('')
  const [mkrPrivateKey, setMkrPrivateKey] = useState('')
  const [usdcPrivateKey, setUsdcPrivateKey] = useState('')
  const [htPrivateKey, setHtPrivateKey] = useState('')
  const [tusdPrivateKey, settusdPrivateKey] = useState('')
  const [daiPrivateKey, setDaiPrivateKey] = useState('')
  const [etcPrivateKey, setEtcPrivateKey] = useState('')
  const [batPrivateKey, setBatPrivateKey] = useState('')
  const [dashPrivateKey, setDashPrivateKey] = useState('')
  const [dogePrivateKey, setDogePrivateKey] = useState('')
  //
  const [verifyLoading, setVerifyLoading] = useState(false)
  const [isShowAddress, setIsShowAddress] = useState(false)
  const [isShowprivateKey, setIsShowprivateKey] = useState(false)
  const [isShowreadQrcode, setIsShowreadQrcode] = useState(false)
  const [isDecodeLoading, setIsDecodeLoading] = useState(false)
  const inputRefs = []
  for (let i = 0; i < 24; i ++) {
    inputRefs.push(useRef());
  }
  const resourcesArray = [
    "https://www.bitaddress.org",
    "https://www.infinitumbitcoins.com/bit2factor/",
    "https://github.com/bitcoinjs/bip38",
    "https://github.com/casascius/Bitcoin-Address-Utility",
    "https://github.com/nomorecoin/python-bip38-testing/blob/master/bip38.py",
    "https://github.com/pointbiz/bitaddress.org/blob/master/src/ninja.key.js",
  ]
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
      currency: 'dash',
      title: 'Dash (DASH)',
      addressKey: 'Address',
      getAddressMethod: getDashAddress,
      addressInputValue: dashAddress,
      setAddressInputMethod: setDashAddress,
      privateKeyInputValue: dashPrivateKey,
      setPrivateKeyInputMethod: setDashPrivateKey,
      WIFKey: 'Private Key',
    },
    {
      currency: 'doge',
      title: 'Dogecoin (DOGE)',
      addressKey: 'Address',
      getAddressMethod: getDogeAddress,
      addressInputValue: dogeAddress,
      setAddressInputMethod: setDogeAddress,
      privateKeyInputValue: dogePrivateKey,
      setPrivateKeyInputMethod: setDogePrivateKey,
      WIFKey: 'Private Key',
    },
    {
      currency: 'USDT_ERC20',
      title: 'Tether (USDT)',
      addressKey: 'Address',
      getAddressMethod: getEthAddress,
      addressInputValue: usdtERC20Address,
      setAddressInputMethod: setusdtERC20Address,
      privateKeyInputValue: usdtERC20PrivateKey,
      setPrivateKeyInputMethod: setUsdtERC20PrivateKey,
      WIFKey: 'Private Key',
    },
    {
      currency: 'LEO',
      title: 'UNUS SED LEO (LEO)',
      addressKey: 'Address',
      getAddressMethod: getEthAddress,
      addressInputValue: leoAddress,
      setAddressInputMethod: setLeoAddress,
      privateKeyInputValue: leoPrivateKey,
      setPrivateKeyInputMethod: setleoPrivateKey,
      WIFKey: 'Private Key',
    },
    {
      currency: 'LINK',
      title: 'Chainlink (LINK)',
      addressKey: 'Address',
      getAddressMethod: getEthAddress,
      addressInputValue: linkAddress,
      setAddressInputMethod: setLinkAddress,
      privateKeyInputValue: linkPrivateKey,
      setPrivateKeyInputMethod: setLinkPrivateKey,
      WIFKey: 'Private Key',
    },
    {
      currency: 'MKR',
      title: 'Maker (MKR)',
      addressKey: 'Address',
      getAddressMethod: getEthAddress,
      addressInputValue: mkrAddress,
      setAddressInputMethod: setMkrAddress,
      privateKeyInputValue: mkrPrivateKey,
      setPrivateKeyInputMethod: setMkrPrivateKey,
      WIFKey: 'Private Key',
    },
    {
      currency: 'USDC',
      title: 'USD Coin (USDC)',
      addressKey: 'Address',
      getAddressMethod: getEthAddress,
      addressInputValue: usdcAddress,
      setAddressInputMethod: setUsdcAddress,
      privateKeyInputValue: usdcPrivateKey,
      setPrivateKeyInputMethod: setUsdcPrivateKey,
      WIFKey: 'Private Key',
    },
    {
      currency: 'HT',
      title: 'Huobi Token (HT)',
      addressKey: 'Address',
      getAddressMethod: getEthAddress,
      addressInputValue: htAddress,
      setAddressInputMethod: setHtAddress,
      privateKeyInputValue: htPrivateKey,
      setPrivateKeyInputMethod: setHtPrivateKey,
      WIFKey: 'Private Key',
    },
    {
      currency: 'TUSD',
      title: 'TrueUSD (TUSD)',
      addressKey: 'Address',
      getAddressMethod: getEthAddress,
      addressInputValue: tusdAddress,
      setAddressInputMethod: setTusdAddress,
      privateKeyInputValue: tusdPrivateKey,
      setPrivateKeyInputMethod: settusdPrivateKey,
      WIFKey: 'Private Key',
    },
    {
      currency: 'DAI',
      title: 'Dai (DAI)',
      addressKey: 'Address',
      getAddressMethod: getEthAddress,
      addressInputValue: daiAddress,
      setAddressInputMethod: setDaiAddress,
      privateKeyInputValue: daiPrivateKey,
      setPrivateKeyInputMethod: setDaiPrivateKey,
      WIFKey: 'Private Key',
    },
    {
      currency: 'ETC',
      title: 'Ethereum Classic (ETC)',
      addressKey: 'Address',
      getAddressMethod: getEthAddress,
      addressInputValue: etcAddress,
      setAddressInputMethod: setEtcAddress,
      privateKeyInputValue: etcPrivateKey,
      setPrivateKeyInputMethod: setEtcPrivateKey,
      WIFKey: 'Private Key',
    },
    {
      currency: 'BAT',
      title: 'Basic Attention Token (BAT)',
      addressKey: 'Address',
      getAddressMethod: getEthAddress,
      addressInputValue: batAddress,
      setAddressInputMethod: setBatAddress,
      privateKeyInputValue: batPrivateKey,
      setPrivateKeyInputMethod: setBatPrivateKey,
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
      title: 'Binance Coin (BNB)',
      addressKey: 'Address',
      getAddressMethod: getBnbAddress,
      addressInputValue: bnbAddress,
      setAddressInputMethod: setBnbAddress,
      privateKeyInputValue: bnbPrivateKey,
      setPrivateKeyInputMethod: setBnbPrivateKey,
      WIFKey: 'Private Key',
    },
    {
      currency: 'qtum',
      title: 'QTUM(Qtum)',
      addressKey: 'Address',
      getAddressMethod: getQtumAddress,
      addressInputValue: qtumAddress,
      setAddressInputMethod: setQtumAddress,
      privateKeyInputValue: qtumPrivateKey,
      setPrivateKeyInputMethod: setQtumPrivateKey,
      WIFKey: 'Private Key',
    }
  ]

  const setAddress = (publicKeyHex) => {
    outputAddressWIFList.forEach(item =>  {
      const address = item.getAddressMethod(publicKeyHex)
      item.setAddressInputMethod(address)
    })
  }
  const generateIntermediateCode = async () => {
    if (!customPassphrase) {
      alert("please input passphrase")
      return
    }
    setGenerateIntermediateCodeLoading(true)
    try {
      const intermediateCode = await genIntermediate(customPassphrase)
      setIntermediateCode(intermediateCode)
      setGenerateIntermediateCodeLoading(false)
    } catch (error) {
      alert("generate Intermediate code fail")
      setGenerateIntermediateCodeLoading(false)
    }
  }
  const verifyConfirmationCode = async () => {
    setVerifyLoading(true)
    try {
      const { valid, publicKeyHex } = await validateConfirmation(confirmationCode, balletPassphrase)
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
    if (!balletPassphrase || !epk) {
      alert("Please input Passphrase or Private Key")
    }
    console.log(balletPassphrase)
    console.log(epk)
    setIsDecodeLoading(true)
    setTimeout(() => {
      try {
        const { publicKeyHex, privateKeyHex, wif } = decryptEpkVcode(epk, balletPassphrase)
        setIsDecodeLoading(false)
        setPublicKeyHex(publicKeyHex)
        setPrivateKeyHex(privateKeyHex)
        setAddress(publicKeyHex)
        setIsShowAddress(true)
        setIsShowprivateKey(true)
        outputAddressWIFList.forEach(item => {
          let outputPrivateKey = ''
          switch (item.currency) {
            case 'btc':
            case 'qtum':
              outputPrivateKey = wif
              break;
            case 'eth':
            case 'xrp':
            case 'USDT_ERC20':
            case 'LEO':
            case 'LINK':
            case 'MKR':
            case 'USDC':
            case 'HT':
            case 'TUSD':
            case 'DAI':
            case 'ETC':
            case 'BAT':
            case 'bnb':
              outputPrivateKey = privateKeyHex
              break;
            case 'dash':
              outputPrivateKey = getDashwif(privateKeyHex)
              break;
            case 'doge':
              outputPrivateKey = getDogewif(privateKeyHex)
              break;
            case 'ltc':
              outputPrivateKey = getLitecoinWif(privateKeyHex)
              break;
            default:
              break;
          }
          item.setPrivateKeyInputMethod(outputPrivateKey)
         })
      } catch (error) {
        console.log(error)
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
              <span><CopyIcon /></span>
            </CopyToClipboard>
            <span
              onMouseEnter={(e) => MouseOver(key)}
              onMouseLeave={(e) => MouseOut()}
            ><QrcodeIcon /></span>
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
        <div className="warning">
          <WarningImage />
          <div className="warningContent">
            <div className="warningTitle" >Read Before Decrypt</div>
            <div className="warningDescription">To ensure security, we strongly encourage you to disconnect the internet first. You can run the decryption process offline. Never share your private key with the unauthorized party, as it will allow access to your crypto assets.</div>
          </div>
        </div>
        <h2>Generate BIP38 Intermediate Code</h2>
        <div className="intermediate">
          <div className="columns inputContent">
            <div className="column is-5">
              <div className="commonTitle">
                Wallet Passphrase
              </div>
              <div className="commonDescription">
                Keep your wallet passphrase secret. Anyone who knows your passphrase can spend the coins in your wallet.
              </div>
              <textarea
                
                className="textarea"
                placeholder="Enter the passphrase"
                value={customPassphrase}
                onChange={e => setCustomPassphrase(e.target.value)}
              ></textarea>
              <a
                className={`button is-warning ${generateIntermediateCodeLoading ? 'is-loading' : ''}`}
                onClick={generateIntermediateCode}
              >Generate Intermediate Code</a>
            </div>
            <div className="column is-1 arrowWraper">
              <Arrow />
            </div>
            <div className="column is-5">
              <div className="commonTitle">
                Intermediate Code
              </div>
              <div className="commonDescription">
                Use (<a href="https://www.infinitumbitcoins.com/bit2factor/" >https://www.infinitumbitcoins.com/bit2factor/</a>) to generate BIP Intermediate Code. 
              </div>
              <div className="intermediateCode">
                <textarea
                  disabled={intermediateCode ? false : true}
                  className="textarea"
                  placeholder={`${intermediateCode ? "" : "Not yet generated"}`}
                  value={intermediateCode}
                ></textarea>
                <CopyToClipboard
                  text={intermediateCode}
                  onCopy={() => alert("copy success")}
                >
                  <span
                    style={{ display: intermediateCode ? 'flex' : 'none' }}
                  ><CopyIcon />Copy</span>
                </CopyToClipboard>
              </div>
            </div>
          </div>
          <div className="tip" >Ballet provides trustless two-factor key generation for ultimate security. In order to generate the owner-created passphrase for the BIP38 private key encryption, run this program on a permanently-offline computer:
          <a href="store.balletcrypto.com"> store.balletcrypto.com/customPassphrase</a></div>
        </div>
        <h2>BIP38 Verify & Decrypt</h2>
        <div className="passphrase">
          <div className="passphrase__title commonTitle">
            Passphrase

          </div>
          <div className="commonDescription">Wallet passphrase are case sensitive. Format: xxxx-xxxx-xxxx-xxxx-xxxx</div>
          <div className="passphrase__input">
            <input
              className="input"
              value={balletPassphrase}
              onChange={(e) => setBalletPassphrase(e.target.value)}
            />
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
            <div className="commonTitle">Encrypted Private Key</div>
            <div className="commonDescription privateKeyDescription">
              Encrypted Private Key starts with “6P”
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
                <span className="readQrcodeText" ><ScanQrcodeIcon />Scan</span>
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
        <div className={`outWraper ${isShowAddress || isShowprivateKey ? '': 'hide'}`}>
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
        <div className="line"></div>
        <div className="linkWraper">
          <h3>BIP38 explained</h3>
            <a href="https://github.com/bitcoin/bips/blob/master/bip-0038.mediawiki" >https://github.com/bitcoin/bips/blob/master/bip-0038.mediawiki</a>
          <h3>More BIP38 resources</h3>
          {resourcesArray.map(link => {
            return (
              <>
                <a href={link}>{link}</a><br/>
              </>
            )
          })}
        </div>
      </div>
    </div>
  );
}

export default App;
