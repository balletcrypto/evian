import React, { useState, useRef, useEffect } from 'react';
import { decryptEpkVcode } from './utils/cryptojs-lib/src/bip38.js'
import { getEthAddress, getXRPAddress } from './utils/cryptojs-lib/src/CryptoAddress'
import { RippleAPI } from 'ripple-lib'
import { ReactComponent as ScanQrcodeIcon } from './image/bit38_decode_scan.svg'
import { ReactComponent as SuccessIcon } from './image/org_correct.svg'
import { ReactComponent as ShowIcon } from './image/show.svg'
import { ReactComponent as HideIcon } from './image/hide.svg'
// import { ReactComponent as FailedIcon } from './image/org_error.svg'
import QrReader from 'react-qr-reader'
import WAValidator from 'wallet-address-validator'

import './ClaimSpark.scss'

let inputXRPSequence = ''
let decryptPrivateKey = ''
let decryptPublicKey = ''
export default () => {

  const inputRefs = []
  for (let i = 0; i < 24; i ++) {
    inputRefs.push(useRef());
  }
  const [isShowRealPassphrase, setIsShowRealPassphrase] = useState(true)
  const [passphraseInputCount, setPassphraseInputCount] = useState(Array.from(new Array(20).keys()).map(num => ''))
  const [balletPassphrase, setBalletPassphrase] = useState('')
  const [epk, setEpk] = useState("")
  const [decryptXRPAddress, setDecryptXRPAddress] = useState("")
  const [decryptethAddress, setDecryptethAddress] = useState("")
  const [inputXRPAddress, setInputXRPAddress] = useState("")
  const [inputXRPBalance, setInputXRPBalance] = useState("")
  const [isShowInputXRPInfo, setIsShowInputXRPInfo] = useState(false)
  const [isDisableStep2, setIsDisableStep2] = useState(true)
  const [isDisableStep3, setIsDisableStep3] = useState(true)
  const [isShowNotXRPAddressError, setIsShowNotXRPAddressError] = useState(false)
  const [isShowXRPClaimWarnning, setIsShowXRPClaimWarnning] = useState(false)
  const [isShowInputXRPBalanceNotEnough, setIsShowInputXRPBalanceNotEnough] = useState(false)
  const [isShowDecryptError, setIsShowDecryptError] = useState(false)
  const [isShowDecryptXRPAddressNotMatch, setIsShowDecryptXRPAddressNotMatch] = useState(false)
  const [transactionTx, setTransactionTx] = useState('')
  const [isShowSubmitTxSuccess, setIsShowSubmitTxSuccess] = useState(false)
  const [isShowReadEPKQrcode, setIsShowReadEPKQrcode] = useState(false)
  const [isShowReadXRPAddressQrcode, setIsShowReadXRPAddressQrcode] = useState(false)
  const [isLoadingCheckXRP, setIsLoadingCheckXRP] = useState(false);
  const [isShowPassphrase, setisShowPassphrase] = useState(false)
  useEffect(() => {
    alert("The deadline to claim Spark (FLR) tokens expired on June 11, 2021. Since the deadline has past, this tool no longer functions. The open-source code will remain accessible on this page.")
  }, [])
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
  const formatRealPassphrase = (passphraseInputCount) => {
    const realPassphrase = passphraseInputCount.slice()
    realPassphrase.splice(4, 0, "-")
    realPassphrase.splice(9, 0, "-")
    realPassphrase.splice(14, 0, "-")
    realPassphrase.splice(19, 0, "-")
    return realPassphrase.join('').toUpperCase()
  }
  const getPassphrase = () => {
    if (isShowRealPassphrase) {
      return formatRealPassphrase(passphraseInputCount)
    }
    return balletPassphrase
  }
  const decryptClick = () => {
    setIsShowDecryptError(false)
    setIsShowDecryptXRPAddressNotMatch(false)
    setTimeout(() => {
      try {
        const passphrase = getPassphrase()
        const { publicKeyHex, privateKeyHex } = decryptEpkVcode(epk, passphrase)
        const ethAddress = getEthAddress(publicKeyHex)
        const xrpAddress = getXRPAddress(publicKeyHex)
        setDecryptethAddress(ethAddress)
        if (xrpAddress !== inputXRPAddress) {
          // setIsShowDecryptXRPAddressNotMatch(true)
          alert("XRP address does NOT match. Please re-enter XRP address, or enter the corresponding wallet passphrase and encryption private key.")
          setPassphraseInputCount(Array.from(new Array(20).keys()).map(num => ''))
          setBalletPassphrase("")
          setEpk("")
          setDecryptethAddress("")
          return
        }
        setDecryptXRPAddress(xrpAddress)
        signTransaction(privateKeyHex, publicKeyHex, xrpAddress, ethAddress)
        setIsDisableStep2(true)

      } catch (error) {
        console.log(error)
        setIsShowDecryptError(true)
      }
    }, 0);
  }
  const checkInputXRPAddress = async () => {
    inputXRPSequence = ''
    setIsDisableStep2(true)
    setIsDisableStep3(true)
    setInputXRPBalance("")
    setIsShowInputXRPInfo(false)
    setIsShowNotXRPAddressError(false)
    setIsShowInputXRPBalanceNotEnough(false)
    setIsShowXRPClaimWarnning(false)
    const addressIsValid = WAValidator.validate(inputXRPAddress, "XRP")
    if (!addressIsValid) {
      // not a xrp address
      setIsShowNotXRPAddressError(true)
      return 
    }
    setIsLoadingCheckXRP(true)
    let xrpAddressIsClamin = false
    const xrpApi = new RippleAPI({
      server: "wss://s2.ripple.com/"
    })
    let accountInfo = ""
    await xrpApi.connect();
    try {
      accountInfo = await xrpApi.getAccountInfo(inputXRPAddress)
      // console.log("accountInfo", accountInfo)
    } catch (error) {
      console.log(error)
    }
    if (accountInfo) {
      const transactions = await xrpApi.getTransactions(inputXRPAddress, {
        limit: 30,
        types: ["settings"]
      })
      // console.log("transactions", transactions)
      setInputXRPBalance(accountInfo.xrpBalance)
      setIsShowInputXRPInfo(true)
      setIsLoadingCheckXRP(false)
      inputXRPSequence = accountInfo.sequence
      const isMachMessageKey = transactions.find(transaction => {
        const { messageKey } = transaction.specification;
        if (messageKey) {
          const ethAddress = messageKey.replace(/^02[0]{24}/g, "0x");
          if (ethAddress) {
            const ethAddressMatch = ethAddress.match(/^0x[a-fA-F0-9]{40}$/g);
            if (
              ethAddressMatch !== null &&
              ethAddressMatch.length === 1
            ) {
              xrpAddressIsClamin = true
              setIsShowXRPClaimWarnning(true)
              alert(`This XRP address has been associated with the following Spark token address: ${ethAddressMatch[0]} Please confirm if you want to do it again.`)
              return true
            }
          }
        }
        return false
      })
    } else {
      setIsShowInputXRPInfo(true)
      setIsShowInputXRPBalanceNotEnough(true)
      setIsLoadingCheckXRP(false)
    }

    if (Number(accountInfo.xrpBalance) > 20.1) {
      setIsDisableStep2(false)
      setTimeout(() => {
        inputRefs[0].current.focus()
      }, 1);
    }
  }
  const signTransaction = (decryptPrivateKey, decryptPublicKey, decryptXRPAddress, decryptethAddress) => {
    if (!decryptPrivateKey || !decryptPublicKey) {
      return
    }
    const messageKey = `02000000000000000000000000${decryptethAddress.substring(2).toUpperCase()}`
    const rawTx = {
      TransactionType: "AccountSet",
      Account : decryptXRPAddress,
      Fee: "100",
      Sequence: inputXRPSequence,
      MessageKey: messageKey
    }
    // console.log("rawTx", rawTx)
    const xrpApi = new RippleAPI()
    const signTx = xrpApi.sign(JSON.stringify(rawTx), {
      privateKey: decryptPrivateKey,
      publicKey: decryptPublicKey.toUpperCase()
    })
    setTransactionTx(signTx.signedTransaction)
    setPassphraseInputCount(Array.from(new Array(20).keys()).map(num => ''))
    setBalletPassphrase("")
    setEpk("")
    setIsDisableStep3(true)
  }
  const submitSignedTransaction = async () => {
    setIsShowSubmitTxSuccess(false)
    const xrpApi = new RippleAPI({
      server: "wss://s2.ripple.com/"
    })
    await xrpApi.connect();
    try {
      const result = await xrpApi.submit(transactionTx)
      console.log("result", result)
      if (result.engine_result_code === 0) {
        setIsShowSubmitTxSuccess(true)
      } else {
        alert("Invalid transaction, please double-check and try again.")
      }
    } catch (error) {
      console.log(error)
      alert("Invalid transaction, please double-check and try again.")
    }
  }

  return (
    <div className="claimSpark" >
      <div className="container">
        <div className="claimSpark-header" >
          <h1>Spark Token (Flare Networks) Claim Tool</h1>
          <div className="description" >Please note that this tool only works for Ballet cryptocurrency wallets</div>
        </div>
        <div className="claimSpark-step1 disableContent">
          <h2>Step 1. Input XRP address</h2>
          {isShowNotXRPAddressError ? (
            <div className="errorText" >
              This XRP address is invalid. Please double-check and try again.
            </div>
          ) : ""}
          <div className="columns">
            <div className="column is-10">
              <div className="xrpAddressWraper" >
                <input
                  className="input"
                  placeholder="Please enter the XRP address"
                  value={inputXRPAddress}
                  onChange={(e) => setInputXRPAddress(e.target.value)}
                />
                <span className="readQrcodeButton" onClick={() => setIsShowReadXRPAddressQrcode(!isShowReadXRPAddressQrcode)}>
                  {isShowReadXRPAddressQrcode ? (
                    <div className="readQrcodeModal">
                      <QrReader
                        delay={200}
                        // onError={onReadQrcodeError}
                        onScan={(data) => {
                          if (data) {
                            setInputXRPAddress(data)
                            setIsShowReadXRPAddressQrcode(false)
                          }
                        }}
                        style={{ width: "100%" }}
                      />
                    </div>
                  ) : ''}
                  <span className="qrButton" ><ScanQrcodeIcon />Scan</span>
                </span>
              </div>
              {isShowInputXRPInfo ? (
                <div className="columns">
                  <div className="column is-12">
                    <div className="inputXRPInfo" >
                      <div className="inputXRPInfo-first" >
                        <span>XRP balance</span>
                        <div className="balance" >
                          {inputXRPBalance || '--'} XRP
                        </div>
                      </div>
                      {isShowInputXRPBalanceNotEnough ? (
                        <div className="errorText" >The XRP address balance must be at least 21 XRP in order to proceed. Please deposit more to ensure the balance is at least 21 XRP.</div>
                      ) : ""}
                    </div>
                  </div>
                </div>
              ) : ""}
            </div>
            <div className="column is-2">
              <a
                className={`button is-warning ${isLoadingCheckXRP ? "is-loading" : ""}`}
                onClick={() => checkInputXRPAddress()}
              >Check</a>
            </div>
          </div>
        </div>
        <div className="claimSpark-step2 disableContent">
          {isDisableStep2 ? (
            <div>Please check the XRP address first.</div>
          ) : ""}
          <h2>Step 2. Enter passphrase and encrypted private key</h2>
          <div className={`${isDisableStep2 ? "disableContent" : ""}`}>
            <div className="passphrase-title" >A. Enter the wallet passphrase.</div>
            <div>
              {isShowRealPassphrase ?
                  'Remove the tamper-evident scratch-off material to reveal the passphrase.' :
                  'Switch to standard input box for PRO Series wallet'}
            </div>
            <div className="passphrase">
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
            <div className="passphrase-title">
              B. Enter the encrypted private key.
            </div>
            <div className="epkDescription" >
              <div>Peel off the top layer sticker and scan the encrypted private key QR code
                <br/>
                (printed on a yellow background).
              </div>
              <span
                className="readQrcodeButton"
                onClick={() => setIsShowReadEPKQrcode(!isShowReadEPKQrcode)}
                style={{ alignSelf: "center" }}
              >
                {isShowReadEPKQrcode ? (
                  <div className="readQrcodeModal">
                    <QrReader
                      delay={200}
                      // onError={onReadQrcodeError}
                      onScan={(data) => {
                        if (data) {
                          setEpk(data)
                          setIsShowReadEPKQrcode(false)
                        }
                      }}
                      style={{ width: "100%" }}
                    />
                  </div>
                ) : ''}
                <span className="readQrcodeText" ><ScanQrcodeIcon />Scan</span>
              </span>
            </div>
            {isShowDecryptError ? (
              <div className="errorText" >
                The wallet passphrase or encrypted private key you entered is incorrect. Please double-check and try again.
              </div>
            ) : ""}
            <textarea
              className="textarea"
              value={epk}
              onChange={(e) => setEpk(e.target.value)}
            ></textarea>
            <div className="columns" style={{ marginTop: "20px" }}>
              <div className="column is-7"></div>
              <div className="column is-5">
                <a
                  className="button is-warning"
                  onClick={() => decryptClick()}
                >Generate Signed TX</a>
              </div>
            </div>
          </div>
        </div>
        <div className="claimSpark-step3 disableContent">
          <h2>Step 3. Connect XRP and Spark token addresses (Broadcast and mapping)</h2>
          <div className="">
            <div className="input-title" >Spark token address (same format as ETH address)</div>
            <input
              className="input"
              disabled
              value={decryptethAddress}
            />
            <div className="input-title" >Signed transaction</div>
            <textarea
              className="textarea"
              value={transactionTx}
              onChange={(e) => setTransactionTx(e.target.value)}
            ></textarea>
            {isShowSubmitTxSuccess ? "" : (
              <div className="columns" style={{ marginTop: "20px" }}>
                <div className="column is-9"></div>
                <div className="column is-3">
                  <a
                    className="button is-warning"
                    onClick={() => {submitSignedTransaction()}}
                  >Broadcast and Connect</a>
                </div>
              </div>
            )}
            {isShowSubmitTxSuccess ? (
              <div className="submitSuccess" >
                <SuccessIcon />
                <div>
                Address mapping completed. To double check, please <a
                  href={`https://bithomp.com/explorer/${decryptXRPAddress}`}
                  target="_blank"
                >click here, </a><br/>
                To visit Spark Token official website, please <a
                  href="https://flare.xyz/"
                  target="_blank"
                >click here.</a>
                </div>
              </div>
            ) : ""}
          </div>
        </div>
      </div>
    </div>
  )
}
