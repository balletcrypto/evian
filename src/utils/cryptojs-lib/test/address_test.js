import { expect } from "chai"
import {
  getBTGAddress,
  getDashAddress,
  getDogeAddress,
  getLitecoinAddress,
  getBitcoinAddress,
  getEthAddress,
  getXRPAddress
} from '../src/CryptoAddress'

describe('Test crypto currency address generate', () => {

  const publicKeyHex = "036a093266f21121b01ced5b6cdfbcf7ffdc0816ed18258a879ae09bde836d8602"

  it('get doge coin address successfully ', () => {
    const address = getDogeAddress(publicKeyHex)
    expect(address).to.equals("D8YBBdoEyuZVvd3V8vNva9CKD9svqbUEo2")
  })

  it('get dash coin address successfully ', () => {
    const address = getDashAddress(publicKeyHex)
    expect(address).to.equals("Xe5vUdWVeCsoYZTUGDhasuiWAMjKZiY33T")
  })

  it('get litecoin coin address successfully ', () => {
    const address = getLitecoinAddress(publicKeyHex)
    expect(address).to.equals("LNd2ubARm9uGeRZ3aUNfJQ6UYEWugem5Zf")
  })

  it('get bitcoin gold address successfully ', () => {
    const address = getBTGAddress(publicKeyHex)
    expect(address).to.equals("GMF14WBYfMGWU6ABLH3UT9NcFBwUaRTwTx")
  })

  it('get bitcoin address successfully ', () => {
    const address = getBitcoinAddress(publicKeyHex)
    expect(address).to.equals("14Q5eNrbgVfDPcrtQLPN2P2iL29dWbiDtZ")
  })

  it('get eth address successfully ', () => {
    const address = getEthAddress(publicKeyHex)
    expect(address).to.equals("0x3Bd716720A5aEE40Cc08E7F2Abc156d7c30dE334")
  })

  it('get xrp address successfully ', () => {
    const address = getXRPAddress(publicKeyHex)
    expect(address).to.equals("rhQne4ibgVCDPcitQLP4pPp5Lp9dWb5DtZ")
  })

})