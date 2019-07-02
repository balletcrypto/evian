import React, { Component } from 'react'
import { Button, Col, Form, FormControl, InputGroup, OverlayTrigger, Popover, Row, Spinner } from 'react-bootstrap'
import {
  getBitcoinAddress,
  getBitcoinCashAddress,
  getEthAddress,
  getLitecoinAddress,
  getLitecoinWIF,
  getRippleAddress,
  getSegwitAddress,
  getBTGAddress,
} from '../utils/CryptoAddress'
import { decryptEpkVcode, isBip38Format, isValidPassphraseFormat } from '../utils/bip38'
import './Home.css'
import PayAttention from '../assets/pay_attention.png'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import QRCode from 'qrcode.react'
import copy from '../assets/copy.png'
import address from '../assets/address.png'
import { GithubIcon } from '../components/Github'


  // position: 'absolute',
  // top: "50%",
  // left: "51%",
  // width: "30%",
  // height: "40%"
const imgStyle = {
  position: 'absolute',
  top: '60px',
  left: '51%',
  width: '450px',
  height: '260px',
}

const buttonStyle = {
  border: 'solid 1.1px #e7e7e7',
}

const outputAddressWIFList = [
  {
    title: 'Bitcoin (BTC)',
    addressKey: 'Address',
    addressValue: 'btc_address',
    WIFKey: 'Private Key (WIF)',
    WIFValue: 'btc_private_key',
  },
  {
    title: 'Bitcoin (BTC)',
    addressKey: 'SegWit Address',
    addressValue: 'btc_segwit_address',
    WIFKey: 'Private Key (WIF)',
    WIFValue: 'btc_private_key',
  },
  {
    title: 'Bitcoin Cash (BCH)',
    addressKey: 'Address',
    addressValue: 'bch_address',
    WIFKey: 'Private Key (WIF)',
    WIFValue: 'bch_private_key',
  },
  {
    title: 'Litecoin (LTC)',
    addressKey: 'Address',
    addressValue: 'ltc_address',
    WIFKey: 'Private Key (WIF)',
    WIFValue: 'ltc_private_key',
  },
  {
    title: 'Ethereum (ETH)',
    addressKey: 'Address',
    addressValue: 'eth_address',
    WIFKey: 'Private Key',
    WIFValue: 'eth_private_key',
  },
  {
    title: 'USDT Omni (USDT)',
    addressKey: 'Address',
    addressValue: 'usdt_address',
    WIFKey: 'Private Key (WIF)',
    WIFValue: 'usdt_private_key',
  },
  {
    title: 'Ripple (XRP)',
    addressKey: 'Address',
    addressValue: 'xrp_address',
    WIFKey: 'Private Key',
    WIFValue: 'xrp_private_key',
  },
  {
    title: 'Bitcoin SV (BSV)',
    addressKey: 'Address',
    addressValue: 'bsv_address',
    WIFKey: 'Private Key (WIF)',
    WIFValue: 'bsv_private_key',
  },
  {
    title: 'Bitcoin Gold (BTG)',
    addressKey: 'Address',
    addressValue: 'btg_address',
    WIFKey: 'Private Key (WIF)',
    WIFValue: 'btg_private_key',
  },
  {
    title: 'Bitcoin Diamond (BCD)',
    addressKey: 'Address',
    addressValue: 'bcd_address',
    WIFKey: 'Private Key (WIF)',
    WIFValue: 'bcd_private_key',
  },
]

export class Home extends Component {

  constructor(props) {
    super(props)
    this.state = {
      epk: '',
      isInvalidEpk: false,
      isInvalidPassphrase: false,
      passphrase: '',
      public_key: '',
      private_key: '',
      btc_address: '',
      bch_address: '',
      ltc_address: '',
      eth_address: '',
      usdt_address: '',
      xrp_address: '',
      bsv_address: '',
      btg_address: '',
      bcd_address: '',
      btc_segwit_address: '',
      btc_private_key: '',
      bch_private_key: '',
      ltc_private_key: '',
      eth_private_key: '',
      usdt_private_key: '',
      xrp_private_key: '',
      bsv_private_key: '',
      btg_private_key: '',
      bcd_private_key: '',
      loading: false,
    }
  }

  handleSubmit(e) {
    e.preventDefault()

    const { epk, passphrase } = this.state

    const isValidEpk = isBip38Format(epk),
      isValidPassphrase = isValidPassphraseFormat(passphrase)

    this.setState({
      isInvalidEpk: !isValidEpk,
      isInvalidPassphrase: !isValidPassphrase,
    })

    if (!isValidEpk || !isValidPassphrase) {
      return
    }

    this.setState({loading: true})

    setTimeout( () => {
      const { publicKeyHex, privateKeyHex, wif } = decryptEpkVcode(epk, passphrase)

      const bitcoinAddress = getBitcoinAddress(publicKeyHex)
      const bitcoinCashAddress = getBitcoinCashAddress(publicKeyHex)
      const bitcoinSegwitAddress = getSegwitAddress(publicKeyHex)
      const litecoinAddress = getLitecoinAddress(publicKeyHex)
      const xrpAddress = getRippleAddress(publicKeyHex)
      const ethAddress = getEthAddress(publicKeyHex)
      const btgAddress = getBTGAddress(publicKeyHex)

      const ltcPrivateKeyWIF = getLitecoinWIF(privateKeyHex)

      this.setState({
        bch_address: bitcoinCashAddress,
        btc_address: bitcoinAddress,
        ltc_address: litecoinAddress,
        xrp_address: xrpAddress,
        eth_address: ethAddress,
        btc_segwit_address: bitcoinSegwitAddress,
        usdt_address: bitcoinAddress,
        bsv_address: bitcoinCashAddress,
        btg_address: btgAddress,
        bcd_address: bitcoinAddress,
        public_key: publicKeyHex,
        private_key: privateKeyHex,
        btc_private_key: wif,
        bch_private_key: wif,
        ltc_private_key: ltcPrivateKeyWIF,
        eth_private_key: privateKeyHex,
        usdt_private_key: wif,
        xrp_private_key: privateKeyHex,
        bsv_private_key: wif,
        btg_private_key: wif,
        bcd_private_key: wif,
        loading: false,
      })
    }, 500)

  }

  handleChange(e) {
    const { name, value } = e.target
    if (name === 'epk') {
      this.setState({isInvalidEpk: false})
    } else {
      this.setState({isInvalidPassphrase: false})
    }
    this.setState({[name]: value})
  }

  renderSimpleForm() {
    const { loading, epk, passphrase, isInvalidEpk, isInvalidPassphrase } = this.state
    return (
      <Form onSubmit={(e) => this.handleSubmit(e)}
        >
          <Form.Group controlId="validEpk">
            <h6>Private Key</h6>
            <Form.Text className="text-muted">
              Private key starts with "6P"
            </Form.Text>

            <Form.Control
              as="textarea"
              rows="3"
              value={epk}
              onChange={e => this.handleChange(e)}
              name="epk"
              type="text"
              placeholder="Enter the encrypted private key"
              isInvalid={isInvalidEpk}
            />
            <Form.Control.Feedback type="invalid">Please provide a valid EPK</Form.Control.Feedback>
          </Form.Group>

          <Form.Group>
            <h6>Passphrase</h6>
            <Form.Text className="text-muted">
              Password are case sensitive. <br/>
              Mintery's passphrase contains '-', formats: xxxx-xxxx-xxxx-xxxx-xxxx
            </Form.Text>
            <Form.Control
              required
              value={passphrase}
              onChange={e => this.handleChange(e)}
              name="passphrase"
              type="text"
              placeholder="Enter the passphrase"
              isInvalid={isInvalidPassphrase}
            />
            <Form.Control.Feedback type="invalid">Please provide a valid passphrase</Form.Control.Feedback>
          </Form.Group>

        <button
          className="rectangle-copy-2"
          type="submit"
          disabled={loading}
        >
          {loading ? 'Decoding...' : 'Decode'}
        </button>
          {loading &&
            <Spinner as="span" variant="warning" animation="border" size="sm" role="status" aria-hidden="true"/>
          }
        </Form>
    )
  }

  renderInfoFrame() {
    return (
      <div style={imgStyle} className="form-control safe-warning-border">
          <div className="white-separator"/>
          <img src={PayAttention} alt="pay attention" className="center"/>
          <div className="white-separator"/>
          <div className="read-before-decode center">READ BEFORE DECODE </div>
          <div className="white-separator"/>
          <div className="safe-warning center">
            &nbsp; &nbsp; To keep your assets safe, please run the decode process offline. Make sure you are the only one who has access to your Private Key.
          </div>
      </div>
    )
  }

  renderKeyPair() {
    return (
      <>
        <Form.Label>Private Key in Hex</Form.Label>
        <InputGroup className="form-key-pair">
          <Form.Control type="text" readOnly value={this.state.private_key}/>
          <InputGroup.Append>
          <OverlayTrigger trigger="focus" placement="top" overlay={<Popover>Copy successful</Popover>}>
            <CopyToClipboard text={this.state.private_key}>
                <Button variant="outline-secondary" style={buttonStyle}>
                  <img src={copy} alt="prikey_copy_image"/>
                </Button>
            </CopyToClipboard>
          </OverlayTrigger>

          <OverlayTrigger trigger="hover" placement="top" overlay={
            this.state.private_key !== '' ?
            <Popover><QRCode value={this.state.private_key} /></Popover> : <div/>
          }>
            <Button variant="outline-secondary" style={buttonStyle}>
              <img src={address} alt="prikey_address_image"/>
            </Button>
          </OverlayTrigger>
          </InputGroup.Append>
        </InputGroup>

        <div className="white-separator"/>

        <Form.Label>Public Key in Hex</Form.Label>
        <InputGroup className="form-key-pair">
          <FormControl type="text" readOnly value={this.state.public_key}/>
          <InputGroup.Append>
          <OverlayTrigger trigger="focus" placement="top" overlay={<Popover>Copy successful</Popover>}>
            <CopyToClipboard text={this.state.public_key}>
                <Button variant="outline-secondary" style={buttonStyle}>
                  <img src={copy} alt="pubkey_copy_image"/>
                </Button>
            </CopyToClipboard>
          </OverlayTrigger>

          <OverlayTrigger trigger="hover" placement="top" overlay={
            this.state.public_key !== '' ?
            <Popover><QRCode value={this.state.public_key} /></Popover> : <div/>
          }>
            <Button variant="outline-secondary" style={buttonStyle}>
              <img src={address} alt="pubkey_address_image"/>
            </Button>
          </OverlayTrigger>
          </InputGroup.Append>
        </InputGroup>
      </>
    )
  }

  render() {
    return (
      <div>
        <GithubIcon/>
        {this.renderInfoFrame()}
        {this.renderSimpleForm()}
        <hr/>
        {this.renderKeyPair()}
        <hr/>

        { outputAddressWIFList.map((element, index) => (
          <React.Fragment key={index}>
            <h5>{element.title}</h5>

            <Form as={Row}>
              <Col>
                <Form.Label>{element.addressKey}</Form.Label>
                <InputGroup>
                  <Form.Control type="text" readOnly value={this.state[`${element.addressValue}`]}/>
                  <OverlayTrigger trigger="focus" placement="top" overlay={<Popover>Copy successful</Popover>}>
                  <CopyToClipboard text={this.state[`${element.addressValue}`]}>
                      <Button variant="outline-secondary" style={buttonStyle}>
                        <img src={copy} alt={index + '_address_copy_image'}/>
                      </Button>
                  </CopyToClipboard>
                  </OverlayTrigger>
                  <OverlayTrigger trigger="hover" placement="top" overlay={
                    this.state[`${element.addressValue}`] !== '' ?
                    <Popover><QRCode value={this.state[`${element.addressValue}`]} /></Popover> : <div/>
                  }>
                    <Button variant="outline-secondary" style={buttonStyle}>
                      <img src={address} alt={index + "_address_image"}/>
                    </Button>
                  </OverlayTrigger>
                </InputGroup>
              </Col>

              <Col>
                <Form.Label>{element.WIFKey}</Form.Label>
                <InputGroup>
                  <Form.Control type="text" readOnly value={this.state[`${element.WIFValue}`]}/>
                  <OverlayTrigger trigger="focus" placement="top" overlay={<Popover>Copy successful</Popover>}>
                  <CopyToClipboard text={this.state[`${element.WIFValue}`]}>
                      <Button variant="outline-dark" style={buttonStyle}>
                        <img src={copy} alt={index + "copy_image"}/>
                      </Button>
                  </CopyToClipboard>
                  </OverlayTrigger>
                  <OverlayTrigger trigger="hover" placement="top" overlay={
                    this.state[`${element.WIFValue}`] !== '' ?
                    <Popover><QRCode value={this.state[`${element.WIFValue}`]} /></Popover> : <div/>
                  }>
                    <Button variant="outline-dark" style={buttonStyle}>
                      <img src={address} alt={index + "_wif_image"}/>
                    </Button>
                  </OverlayTrigger>
                </InputGroup>
              </Col>
            </Form>
            <hr/>
          </React.Fragment>
        ))
        }
      </div>
    )
  }
}