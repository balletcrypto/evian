import React, { useState, useRef } from 'react'
import Warning from './component/warning'
import './intermediateGenerate.scss'
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { genIntermediate } from './utils/cryptojs-lib/src/Intermediate'
import { ReactComponent as CopyIcon } from './image/bit38_decode_copy.svg'
import { ReactComponent as ShowIcon } from './image/show.svg'
import { ReactComponent as HideIcon } from './image/hide.svg'
import { ReactComponent as Fause } from './image/fause.svg'
import { ReactComponent as NoteIcon } from './image/tag.svg'
export default () => {
  const intermediateCodeRefs = useRef()
  const [customPassphrase, setCustomPassphrase] = useState('')
  const [confirmPassphrase, setconfirmPassphrase] = useState('')
  const [intermediateCode, setIntermediateCode] = useState('')
  const [generateIntermediateCodeLoading, setGenerateIntermediateCodeLoading] = useState(false)
  const [isShowPassphrase, setisShowPassphrase] = useState(false)
  const [twoPassphraseIsSame, settwoPassphraseIsSame] = useState(true)
  const [generateButtonIsDisable, setGenerateButtonIsDisable] = useState(true)
  const generateIntermediateCode = async () => {
    if (!customPassphrase) {
      alert("please input passphrase")
      return
    }
    if (customPassphrase !== confirmPassphrase) {
      settwoPassphraseIsSame(false)
      return
    } else {
      settwoPassphraseIsSame(true)
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
  const confirmPassphraseOnchange = (e) => {
    setconfirmPassphrase(e.target.value)
    if (customPassphrase === e.target.value) {
      settwoPassphraseIsSame(true)
      setGenerateButtonIsDisable(false)
    } else {
      settwoPassphraseIsSame(false)
      setGenerateButtonIsDisable(true)
    }
  }

  return (
    <div className="container intermediate__content" >
      <h2>Generate BIP38 Intermediate Code</h2>
      <Warning
        title="Warning about wallet security and passphrase"
        content={[
          "We strongly recommend that you run this open-source program on an offline computer. Never reveal your private key or passphrase to an internet-connected device or give access to any untrusted person. Anyone who knows your passphrase can spend the cryptocurrency on your wallet.",
          "Do not lose your passphrase.It is your personal responsibility to memorize or properly back up your passphrase. Human memory is imperfect, so we strongly recommend that you keep a physical backup of your passphrase, in a separate location from the physical wallet itself. If you lose your passphrase, you will lose access to all funds stored on the wallet. Our company cannot help you reset the passphrase or recover the funds."
      ]}
      />

      <div className="intermediate">
      <div className="tip">
      The passphrase is used to protect the private key so we highly recommend to make it reasonably complex, but make sure it’s
something you can always remember. You will need to either memorize it, or back it up safely. The BIP38 passphrase for a
wallet can never be changed, nor reset, nor recovered by anyone. Also, please note that the passphrase is case-sensitive.
      </div>
        <div className="intermediate__form">
          <div className="columns is-vcentered is-desktop">
            <div className="column is-3">
              Create Passphrase
            </div>
            <div className="column is-9 passphraseWraper" >
              <input
                className="input"
                type={isShowPassphrase ? 'text' : 'password'}
                placeholder="Please enter the passphrase"
                value={customPassphrase}
                onChange={e => setCustomPassphrase(e.target.value)}
              ></input>
              {isShowPassphrase
                ? <ShowIcon onClick={() => setisShowPassphrase(!isShowPassphrase)} />
                : <HideIcon onClick={() => setisShowPassphrase(!isShowPassphrase)} /> }
            </div>
          </div>
          <div className="columns is-vcentered is-desktop">
            <div className="column is-3">
              Confirm Passphrase
            </div>
            <div className="column is-9" > 
              <input
                className={`input ${twoPassphraseIsSame ? "" : "is-danger"}`}
                placeholder="Re-enter the passphrase"
                type={isShowPassphrase ? 'text' : 'password'}
                value={confirmPassphrase}
                onChange={(e) => confirmPassphraseOnchange(e)}
              ></input>
            </div>
          </div>
          <div className="columns is-desktop">
            <div className="column is-3"></div>
            <div className="column is-4" >
              <a
                className={` button is-warning ${generateIntermediateCodeLoading ? 'is-loading' : ''}`}
                onClick={generateIntermediateCode}
                disabled={generateButtonIsDisable}
              >Generate Intermediate Code</a>
            </div>
            <div className="column is-1" ></div>
            <div className="column is-4 errorMessage" >
               { twoPassphraseIsSame ? "" : <Fause />}
               {twoPassphraseIsSame ? '' : 'The passphrase you entered do not match. Please re-enter your passphrase.'}
            </div>
          </div>
          <div className="columns is-desktop">
            <div className="column is-3">
              Intermediate Code
            </div>
            <div className="column is-9">
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
        <div className="note">
          <NoteIcon />
          Please note: Even if you use the same passphrase, each time you click "Generate Intermediate Code", you will get a different Intermediate Code. This is normal expected behavior, because the computation to generate the Intermediate Code includes a random number component.
        </div>
      </div>
    </div>
  )
}