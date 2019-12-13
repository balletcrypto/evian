import React, { useState, useRef } from 'react'
import Warning from './component/warning'
import './intermediateGenerate.scss'
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { genIntermediate } from './utils/cryptojs-lib/src/Intermediate'
import { ReactComponent as CopyIcon } from './image/bit38_decode_copy.svg'
export default () => {
  const intermediateCodeRefs = useRef()
  const [customPassphrase, setCustomPassphrase] = useState('')
  const [intermediateCode, setIntermediateCode] = useState('')
  const [generateIntermediateCodeLoading, setGenerateIntermediateCodeLoading] = useState(false)
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
  return (
    <div className="container intermediate__content" >
      <h2>BIP38 Intermediate Code</h2>
      <Warning
        title="Warning about wallet security and passphrase"
        content="We strongly recommend that you run this open-source program on a permanently-offline computer. Never reveal your private key or passphrase to an internet-connected device or to any unauthorized person. Anyone who knows your passphrase can spend the coins on your wallet.Do not lose your wallet passphrase. If you lose your passphrase, you will lose access to all coins stored on the wallet. Please be sure to memorize or otherwise backup the exact passphrase of your wallet."
      />

      <div className="intermediate">
      <div className="tip">
Keep your wallet passphrase secret. Never expose it to an online computer or unauthorized person. It is recommended to use
complex passwords.Please note that passphrases are case-sensitive. 
      </div>
        <div className="intermediate__form">
          <div className="columns is-vcentered is-desktop">
            <div className="column is-2">
              Passphrase
            </div>
            <div className="column is-10" >
              <input
                className="input"
                placeholder="Enter the passphrase"
                value={customPassphrase}
                onChange={e => setCustomPassphrase(e.target.value)}
              ></input>
            </div>
          </div>
          <div className="columns is-desktop">
            <div className="column is-2"></div>
            <div className="column is-10" >
              <a
                className={` button is-warning ${generateIntermediateCodeLoading ? 'is-loading' : ''}`}
                onClick={generateIntermediateCode}
              >Generate the Intermediate Code</a>
            </div>
          </div>
          <div className="columns is-desktop">
            <div className="column is-2">
              Intermediate Code
            </div>
            <div className="intermediateCode column is-10">
              <input
                disabled={intermediateCode ? false : true}
                className="input "
                value={intermediateCode}
                ref={intermediateCodeRefs}
                onFocus={() => intermediateCodeRefs.current.select()}
              ></input>
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
      </div>
    </div>
  )
}