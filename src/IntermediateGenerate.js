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
        content={["We strongly recommend that you run this open-source program on an offline computer. Never reveal your private key or passphrase to an internet-connected device or give access to any untrusted person. Anyone who knows your passphrase can spend the cryptocurrency on your wallet.", "Do not lose your passphrase.It is your personal responsibility to memorize or properly back up your passphrase. Human memory is imperfect, so we strongly recommend that you keep a physical backup of your passphrase, in a separate location from the physical wallet itself. If you lose your passphrase, you will lose access to all funds stored on the wallet. Our company cannot help you reset the passphrase or recover the funds."]}
      />

      <div className="intermediate">
      <div className="tip">
        Create a passphrase that is long and hard-to-guess (high entropy). Note: passphrases are case-sensitive.
      </div>
        <div className="intermediate__form">
          <div className="columns is-vcentered is-desktop">
            <div className="column is-2">
              Passphrase
            </div>
            <div className="column is-10" >
              <input
                className="input"
                placeholder="Please enter the passphrase"
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
            <div className="column is-10">
              <div className="intermediateCode" >
                <textarea
                  disabled={intermediateCode ? false : true}
                  rows="3"
                  className="textarea has-fixed-size"
                  value={intermediateCode}
                  ref={intermediateCodeRefs}
                  onFocus={() => intermediateCodeRefs.current.select()}
                ></textarea>
                <CopyToClipboard
                  text={intermediateCode}
                  onCopy={() => alert("Copied to clipboard")}
                >
                  <div
                    className="CopyButton"
                    style={{ display: intermediateCode ? 'flex' : 'none' }}
                  ><CopyIcon />Copy</div>
                </CopyToClipboard>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}