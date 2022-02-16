import React, { useState, useRef } from 'react';
import './App.scss';
import { ReactComponent as CopyIcon } from './image/bit38_decode_copy.svg'
import { ReactComponent as QrcodeIcon } from './image/bit38_decode_address.svg'
import { ReactComponent as ScanQrcodeIcon } from './image/bit38_decode_scan.svg'
import { ReactComponent as EmptyIcon } from './image/org_empty.svg'
import { ReactComponent as SuccessIcon } from './image/org_correct.svg'
import { ReactComponent as FailedIcon } from './image/org_error.svg'
import { Link } from "react-router-dom";
import { validateConfirmation } from './utils/cryptojs-lib/src/confirmation'
import Warning from './component/warning'
import { ReactComponent as NoteIcon } from './image/tag.svg'
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
  getDogeAddress,
  getRvnAddress,
  getZecAddress,
  getAtomAddress,
  getFilAddress,
  getTrxAddress,
  getCfxAddress,
  getQtcAddress,
  getDigiByteAddress,
} from './utils/cryptojs-lib/src/CryptoAddress'
import { decryptEpkVcode } from './utils/cryptojs-lib/src/bip38.js'
import {
  getLitecoinWif,
  getDashwif,
  getDogewif,
  getRvnWif,
  getZecwif
} from './utils/cryptojs-lib/src/wif.js'
import CopyToClipboard from 'react-clipboard.js';
import QRcode from 'qrcode.react'
import QrReader from 'react-qr-reader'
import { ReactComponent as ShowIcon } from './image/show.svg'
import { ReactComponent as HideIcon } from './image/hide.svg'

function App() {
  const [balletPassphrase, setBalletPassphrase] = useState('')
  const [confirmationCode, setConfirmationCode] = useState('')
  const [epk, setEpk] = useState('')
  const [publicKeyHex, setPublicKeyHex] = useState('')
  const [unCompressedPublicKeyHex, setUnCompressedPublicKeyHex] = useState('')
  const [privateKeyHex, setPrivateKeyHex] = useState('')
  const [isShowRealPassphrase, setIsShowRealPassphrase] = useState(true)
  const [passphraseInputCount, setPassphraseInputCount] = useState(Array.from(new Array(20).keys()).map(num => ''))
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
  const [etcAddress, setEtcAddress] = useState('')
  const [dashAddress, setDashAddress] = useState('')
  const [digiByteAddress, setDigiByteAddress] = useState('')
  const [dogeAddress, setDogeAddress] = useState('')
  const [rvnAddress, setRvnAddress] = useState('')
  const [zecAddress, setZecAddress] = useState('')
  const [atomAddress, setAtomAddress] = useState('')
  const [filAddress, setFilAddress] = useState('')
  const [cfxAddress, setCfxAddress] = useState('');
  const [trxAddress, setTrxAddress] = useState('');
  const [qtcAddress, setQtcAddress] = useState('');

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
  const [etcPrivateKey, setEtcPrivateKey] = useState('')
  const [dashPrivateKey, setDashPrivateKey] = useState('')
  const [digiBytePrivateKey, setDigiBytePrivateKey] = useState('')
  const [dogePrivateKey, setDogePrivateKey] = useState('')
  const [rvnPrivateKey, setRvnPrivateKey] = useState('')
  const [zecPrivateKey, setzecPrivateKey] = useState('')
  const [atomPrivateKey, setAtomPrivateKey] = useState('')
  const [filPrivateKey, setFilPrivateKey] = useState('')
  const [cfxPrivateKey, setCfxPrivateKey] = useState('')
  const [trxPrivateKey, setTrxPrivateKey] = useState('');
  const [qtcPrivateKey, setQtcPrivateKey] = useState('');

  //
  const [verifyLoading, setVerifyLoading] = useState(false)
  const [isShowAddress, setIsShowAddress] = useState(false)
  const [isShowprivateKey, setIsShowprivateKey] = useState(false)
  const [isShowreadQrcode, setIsShowreadQrcode] = useState(false)
  const [isDecodeLoading, setIsDecodeLoading] = useState(false)
  const [verifyButtonIsDisabled, setVerifyButtonIsdisabled] = useState(true)
  const [decryptButtonIsDISabled, setdecryptButtonIsDISabled] = useState(true)
  const [isVerifyConfirmationcodeFailed, setIsVerifyConfirmationcodeFailed] = useState(false)
  const [isDecryptFailed, setIsDecryptFailed] = useState(false)

  const [verifyConfirmationCodeSuccess, setverifyConfirmationCodeSuccess] = useState(false)
  const [decriptSuccess, setdecriptSuccess] = useState(false)
  const [isShowPassphrase, setisShowPassphrase] = useState(false)

  const inputRefs = []
  for (let i = 0; i < 24; i ++) {
    inputRefs.push(useRef());
  }
  const outputAddressWIFList = [
    {
      currency: 'btc',
      title: 'Bitcoin (BTC)',
      addressKey: 'Legacy Address Compressed',
      getAddressMethod: getBitcoinAddress,
      addressInputValue: bitcoinLegacyAddress,
      setAddressInputMethod: setBitcoinLegacyAddress,
      privateKeyInputValue: bitcoinLegacyPrivateKeyWIF,
      setPrivateKeyInputMethod: setBitcoinLegacyPrivateKeyWIF,
      WIFKey: 'Private Key WIF Compressed',
    },
    {
      currency: 'btc',
      title: 'Bitcoin (BTC)',
      addressKey: 'SegWit Address Compressed',
      getAddressMethod: getSegwitAddress,
      addressInputValue: bitcoinSegwitAddress,
      setAddressInputMethod: setBitcoinSegwitAddress,
      privateKeyInputValue: bitcoinSegWitPrivateKeyWIF,
      setPrivateKeyInputMethod: setBitcoinSegWitPrivateKeyWIF,
      WIFKey: 'Private Key WIF Compressed',
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
      WIFKey: 'Private Key (Hex)',
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
      WIFKey: 'Private Key (Hex)',
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
      WIFKey: 'Private Key (Hex)',
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
      WIFKey: 'Private Key WIF Compressed',
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
      WIFKey: 'Private Key WIF Compressed',
    },
    {
      currency: 'atom',
      title: 'Cosmos (ATOM)',
      addressKey: 'Address',
      getAddressMethod: getAtomAddress,
      addressInputValue: atomAddress,
      setAddressInputMethod: setAtomAddress,
      privateKeyInputValue: atomPrivateKey,
      setPrivateKeyInputMethod: setAtomPrivateKey,
      WIFKey: 'Private Key (Hex)',
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
      WIFKey: 'Private Key WIF Compressed',
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
      WIFKey: 'Private Key WIF Compressed',
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
      WIFKey: 'Private Key WIF Compressed',
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
      WIFKey: 'Private Key WIF Compressed',
    },
    {
      currency: 'cfx',
      title: 'Conflux Network (CFX)',
      addressKey: 'Address',
      getAddressMethod: getCfxAddress,
      addressInputValue: cfxAddress,
      setAddressInputMethod: setCfxAddress,
      privateKeyInputValue: cfxPrivateKey,
      setPrivateKeyInputMethod: setCfxPrivateKey,
      WIFKey: 'Private Key (Hex)',
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
      WIFKey: 'Private Key WIF Compressed',
    },
    {
      currency: 'dgb',
      title: 'DigiByte (DGB)',
      addressKey: 'Address',
      getAddressMethod: getDigiByteAddress,
      addressInputValue: digiByteAddress,
      setAddressInputMethod: setDigiByteAddress,
      privateKeyInputValue: digiBytePrivateKey,
      setPrivateKeyInputMethod: setDigiBytePrivateKey,
      WIFKey: 'Private Key WIF Compressed',
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
      WIFKey: 'Private Key (Hex)',
    },
    {
      currency: 'fil',
      title: 'Filecoin (FIL)',
      addressKey: 'Address',
      getAddressMethod: getFilAddress,
      addressInputValue: filAddress,
      setAddressInputMethod: setFilAddress,
      privateKeyInputValue: filPrivateKey,
      setPrivateKeyInputMethod: setFilPrivateKey,
      WIFKey: 'Private Key (Hex)',
    },
    {
      currency: 'qtc',
      title: 'Qitcoin (QTC)',
      addressKey: 'Address',
      getAddressMethod: getQtcAddress,
      addressInputValue: qtcAddress,
      setAddressInputMethod: setQtcAddress,
      privateKeyInputValue: qtcPrivateKey,
      setPrivateKeyInputMethod: setQtcPrivateKey,
      WIFKey: 'Private Key (Hex)',
    },
    {
      currency: 'qtum',
      title: 'QTUM (Qtum)',
      addressKey: 'Address',
      getAddressMethod: getQtumAddress,
      addressInputValue: qtumAddress,
      setAddressInputMethod: setQtumAddress,
      privateKeyInputValue: qtumPrivateKey,
      setPrivateKeyInputMethod: setQtumPrivateKey,
      WIFKey: 'Private Key WIF Compressed',
    },
    {
      currency: 'rvn',
      title: 'Raven Coin (RVN)',
      addressKey: 'Address',
      getAddressMethod:getRvnAddress,
      addressInputValue: rvnAddress,
      setAddressInputMethod: setRvnAddress,
      privateKeyInputValue: rvnPrivateKey,
      setPrivateKeyInputMethod: setRvnPrivateKey,
      WIFKey: 'Private Key WIF Compressed',
    },
    {
      currency: 'trx',
      title: 'TRON',
      addressKey: 'Address',
      getAddressMethod: getTrxAddress,
      addressInputValue: trxAddress,
      setAddressInputMethod: setTrxAddress,
      privateKeyInputValue: trxPrivateKey,
      setPrivateKeyInputMethod: setTrxPrivateKey,
      WIFKey: 'Private Key (Hex)',
    },
    {
      currency: 'zec',
      title: 'Zcash (ZEC)',
      addressKey: 'Address',
      getAddressMethod: getZecAddress,
      addressInputValue: zecAddress,
      setAddressInputMethod: setZecAddress,
      privateKeyInputValue: zecPrivateKey,
      setPrivateKeyInputMethod: setzecPrivateKey,
      WIFKey: 'Private Key WIF Compressed',
    },
  ]

  const setAddress = (publicKeyHex, unCompressedPublicKeyHex) => {
    let usePublicKeyHex = publicKeyHex
    outputAddressWIFList.forEach(item => {
      let address = ''
      if (item.currency === 'fil') {
        address = item.getAddressMethod(unCompressedPublicKeyHex)
      } else {
        address = item.getAddressMethod(usePublicKeyHex)
      }
      item.setAddressInputMethod(address)
    })
  }
  const getPassphrase = () => {
    if (isShowRealPassphrase) {
      return formatRealPassphrase(passphraseInputCount)
    }
    return balletPassphrase
  }
  const verifyConfirmationCode = async () => {
    setverifyConfirmationCodeSuccess(false)
    setdecriptSuccess(false)
    setIsShowAddress(false)
    setIsShowprivateKey(false)
    setIsDecryptFailed(false)
    setIsVerifyConfirmationcodeFailed(false)
    if (verifyButtonIsDisabled) {
      return
    }
    setVerifyLoading(true)
    try {
      const { valid, publicKeyHex, uncompressedPublicKeyHex } = await validateConfirmation(confirmationCode, getPassphrase())
      if (valid) {
        setPublicKeyHex(publicKeyHex)
        setAddress(publicKeyHex, uncompressedPublicKeyHex)
        setIsShowAddress(true)
        setVerifyLoading(false)
        setverifyConfirmationCodeSuccess(true)
      } else {
        console.log("confirmation code verify failed")
        setIsVerifyConfirmationcodeFailed(true)
        setVerifyLoading(false)
      }
    } catch (error) {
      console.log("confirmation code verify failed")
      setIsVerifyConfirmationcodeFailed(true)
      setVerifyLoading(false)
    }
  }
  const decodePrivateKey = () => {
    setverifyConfirmationCodeSuccess(false)
    setdecriptSuccess(false)
    setIsShowAddress(false)
    setIsShowprivateKey(false)
    setIsDecryptFailed(false)
    setIsVerifyConfirmationcodeFailed(false)
    if (decryptButtonIsDISabled) {
      return
    }
    if (!getPassphrase() || !epk) {
      alert("Please input Passphrase or Private Key")
    }
    setIsDecodeLoading(true)
    setTimeout(() => {
      try {
        const { publicKeyHex, privateKeyHex, wif, unCompressedPublicKeyHex } = decryptEpkVcode(epk, getPassphrase())
        setUnCompressedPublicKeyHex(unCompressedPublicKeyHex)
        setIsDecodeLoading(false)
        setPublicKeyHex(publicKeyHex)
        setPrivateKeyHex(privateKeyHex)
        setAddress(publicKeyHex, unCompressedPublicKeyHex)
        setIsShowAddress(true)
        setIsShowprivateKey(true)
        setdecriptSuccess(true)
        outputAddressWIFList.forEach(item => {
          let outputPrivateKey = ''
          switch (item.currency) {
            case 'btc':
            case 'qtum':
            case 'rvn':
            case 'dgb':
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
            case 'rvn':
              outputPrivateKey = getRvnWif(privateKeyHex)
              break;
            case 'zec':
              outputPrivateKey = getZecwif(privateKeyHex)
              break;
            default:
              outputPrivateKey = privateKeyHex
              break;
          }
          item.setPrivateKeyInputMethod(outputPrivateKey)
         })
      } catch (error) {
        console.log(error)
        setIsDecryptFailed(true)
        setIsDecodeLoading(false)
      }
    }, 0);
  }

  const outputComponent = (title, key) => {
    const inputRef = useRef()
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
              ref={inputRef}
              onFocus={() => inputRef.current.select()}
            />
            <CopyToClipboard
              component="span"
              data-clipboard-text={key}
              onSuccess={() => alert("Copied to clipboard")}
            >
              <CopyIcon />
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
  const formatRealPassphrase = (passphraseInputCount) => {
    const realPassphrase = passphraseInputCount.slice()
    realPassphrase.splice(4, 0, "-")
    realPassphrase.splice(9, 0, "-")
    realPassphrase.splice(14, 0, "-")
    realPassphrase.splice(19, 0, "-")
    return realPassphrase.join('').toUpperCase()
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
          inputRefs[inputIndex + 1].current.select()
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
  const handleConfirmationCodeChange = (confirmationCode) => {
    setConfirmationCode(confirmationCode)
    if (confirmationCode.length === 75 && confirmationCode.startsWith("cfrm38")) {
      setVerifyButtonIsdisabled(false)
    } else {
      setVerifyButtonIsdisabled(true)
    }
  }
  const judgeEpk = (epk) => {
    if (epk.startsWith("6P") && epk.length === 58) {
      setdecryptButtonIsDISabled(false)
    } else {
      setdecryptButtonIsDISabled(true)
    }
  }
  const handleEPKChange = (epk) => {
    setEpk(epk)
    judgeEpk(epk)
  }
  const divider = (color = '#FFFFFF') => {
    return (
      <div className="divider" >
        <div className="dotLine"></div>
        <span style={{backgroundColor: color}}>or</span>
      </div>
    )
  }
  return (
    <div className="evian">
      <div className="content container">
        <h2>BIP38 Verify & Decrypt <Link to="/bip38-intermediate-code" >Generate BIP38 Intermediate Code</Link></h2>
        <Warning
          title="SAFETY AND SECURITY NOTICE"
          content={
            [
              "We strongly recommend that you run this open-source program on a computer that is permanently offline.Online computers may be at risk of hacking and/or having malware installed, which may allow others to steal access to the private key information that will be generated and shown by this program.",
              "Anyone who knows your wallet passphrase and encrypted private key can spend all the cryptocurrency in your wallet."
            ]
          }
        />
        <div className="explain">
          <NoteIcon className="noteIcon" />
          <div className="explain__title" >This page allows you to verify or decrypt your wallet.</div>
          <div className="explain__content columns is-desktop">
            <div className="explain__left column is-5">
              <div className="explain__secondtitle" >Verification</div>
              <div>
                This process allows you to check your wallet’s authenticity by reviewing its public key and the deposit addresses of all its supported currencies. To verify your wallet, you will need its passphrase and its BIP38 confirmation code, which can be obtained through the Ballet Crypto mobile app.
              </div>
            </div>
          <div className="column is-2 is-hidden-touch">{divider('#FFFBEF')}</div>
            <div className="explain__right column is-5" >
              <div className="explain__secondtitle" >Decryption</div>
              <div>
                This process allows you to reveal your wallet’s decrypted private key using its passphrase and encrypted private key. Decrypting your wallet will reveal its public key and the deposit addresses and decrypted private keys of all its supported currencies. Having the decrypted private keys gives you full access to all funds stored on your wallet.
              </div>
            </div>
          </div>
        </div>
        <div className="passphrase">
          <div className="passphrase__title commonTitle ">
            <h3 className="steptitle" >Step 1 - Enter your wallet passphrase.</h3>
            <div className="passphrase__description" >
              <span>
                {isShowRealPassphrase ?
                  'Remove the tamper-evident scratch-off to get the wallet passphrase.' :
                  'Enter your user-created BIP38 passphrase'}
              </span>
            </div>
          </div>
          <div className="passphrase__input">
            {isShowRealPassphrase ? (
            <div className="passphrase__real">
              {passphraseInputCount.map((item, index) => {
                return (
                  <>
                    <InputItem
                      key={index}
                      inputIndex={index}
                      value={item}
                    />
                    {!((index + 1) % 4) && (index + 1 < 17) ? (<div className="symbolInput"></div>) : ''}
                  </>
                )
              })}
            </div>
            ) : (
              <div className="proInput">
                <input
                  className="input"
                  placeholder="Enter the wallet passphrase"
                  type={isShowPassphrase ? 'text' : 'password'}
                  value={balletPassphrase}
                  onChange={(e) => setBalletPassphrase(e.target.value)}
                />
                {isShowPassphrase
                  ? <ShowIcon onClick={() => setisShowPassphrase(!isShowPassphrase)} />
                  : <HideIcon onClick={() => setisShowPassphrase(!isShowPassphrase)} /> }
              </div>
            )}
          </div>
          <span
            className="switchbutton"
            onClick={() => setIsShowRealPassphrase(!isShowRealPassphrase)}
            style={{
              color: '#4A83BF',
              cursor: 'pointer'
            }}
          >
            {isShowRealPassphrase ?
              'Switch to standard input box for entering generic BIP38 passphrases.' :
              'Switch to specific input box for Ballet wallets.'
            }
          </span>
        </div>
        <h3 className="steptitle" >Step 2 - Enter your wallet’s BIP38 confirmation code or encrypted private key.</h3>
        <div className="columns inputContent is-desktop">
          <div className="column is-5">
            <div className="commonTitle">
              Verify using BIP38 confirmation code.
            </div>
            <div className="commonDescription">
              You can use the Ballet Crypto mobile app to get your wallet’s BIP38 confirmation code.
            </div>
            <textarea
              className="textarea"
              placeholder="Enter your wallet’s BIP38 confirmation code."
              value={confirmationCode}
              onChange={(e) => handleConfirmationCodeChange(e.target.value)}
            ></textarea>
            <a
              className={`button is-warning ${verifyLoading ? 'is-loading' : ''}`}
              onClick={verifyConfirmationCode}
              disabled={verifyButtonIsDisabled}
            >Verify</a>
          </div>
          <div className="column is-2 is-hidden-touch">
            {divider()}
          </div>
          <div className="divider is-hidden-tablet">
            <div className="dotLine-mobile"></div>
            <span style={{ backgroundColor: '#FFFFFF' }}>or</span>
          </div>
          <div className="column is-5">
            <div className="commonTitle">Decrypt using BIP38 encrypted private key.</div>
            <div className="commonDescription privateKeyDescription">
              Peel off the top layer sticker and scan the encrypted private key QR code, which is set against a yellow sticker.
            </div>
            <textarea
              className="textarea"
              placeholder="Enter or scan your wallet’s BIP38 encrypted private key."
              value={epk}
              onChange={e => handleEPKChange(e.target.value)}
            ></textarea>
            <div className="buttonwraper" >
              <a
                className={`button is-warning ${isDecodeLoading ? 'is-loading' : ''}`}
                onClick={decodePrivateKey}
                disabled={decryptButtonIsDISabled}
              >Decrypt</a>
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
                          judgeEpk(data)
                        }
                      }}
                      style={{ width: "100%" }}
                    />
                  </div>
                ) : ''}
                <span className="readQrcodeText" ><ScanQrcodeIcon />Scan</span>
              </span>
            </div>
          </div>
        </div>
        <div className="line"></div>
        <div className="display__area">
          {!isDecryptFailed &&
          !isVerifyConfirmationcodeFailed &&
          !isShowAddress &&
          !isShowprivateKey && 
            <div className="display__empty">
              <EmptyIcon />
              <div>The result of verification or decryption will be displayed here. </div>
            </div>
          }
          {(isShowAddress || isShowprivateKey) &&
            <div className="display__success">
              <SuccessIcon />
              {verifyConfirmationCodeSuccess && <div className="display__resulttext">Congratulations! Your wallet has been successfully verified. Its public key, currencies and deposit addresses are listed below.</div>}
              {decriptSuccess && <div className="display__resulttext">Congratulations! Your wallet has been successfully decrypted. Its public key, currencies, deposit addresses and private keys are listed below.</div>}
            </div>
          }
          {(isDecryptFailed || isVerifyConfirmationcodeFailed) && 
            <div className="display__failed">
              <FailedIcon />
              <div className="display__resulttext">Invalid wallet passphrase or {isVerifyConfirmationcodeFailed ? 'BIP38 confirmation code' : 'encrypted private key'}.</div>
            </div>
          }
          <div className={`outWraper ${isShowAddress || isShowprivateKey ? '': 'hide'}`}>
            <div className="columns ouput">
              <div className={`column is-5 ${isShowAddress ? '': 'hide'}`} >
                <div className="currencyTitle">Wallet</div>
                {outputComponent("Public Key (compressed, 66 characters [0-9A-F]):", publicKeyHex)}
              </div>
              <div className="column is-2"></div>
              <div className={`column is-5 ${isShowprivateKey ? '': 'hide'}`}>
                <div className="currencyTitle">Wallet</div>
                {outputComponent("Private Key Hexadecimal Format (64 characters [0-9A-F]):", privateKeyHex)}
              </div>
            </div>
            {outputAddressWIFList.map((item, index) =>
              <>
                <div className="columns">
                  <div className="column is-5">
                    <div className={`currencyTitle ${isShowAddress ? '': 'hide'}`}>{index + 1}. {item.title}</div>
                    <div className="columns">
                      <div className={`column ${isShowAddress ? '': 'hide'}`}>
                        {outputComponent(item.addressKey, item.addressInputValue)}
                      </div>
                    </div>
                  </div>
                  <div className="column is-5">
                    <div className={`is-hidden-mobile currencyTitle ${isShowprivateKey ? '': 'hide'}`}>{item.title}</div>
                    <div className="columns">
                      <div className={`column ${isShowprivateKey ? '': 'hide'}`}>
                        {outputComponent(item.WIFKey, item.privateKeyInputValue)}
                      </div>
                    </div>
                  </div>
                </div> 
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
