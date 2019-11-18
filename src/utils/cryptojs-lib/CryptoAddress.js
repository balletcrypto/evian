import { payments } from 'bitcoinjs-lib'
import { deriveAddress } from 'ripple-keypairs'
import EthCrypto from 'eth-crypto'
import bnbSdk from '@binance-chain/javascript-sdk'
import { BITBOX } from 'bitbox-sdk'
let bitbox = new BITBOX();

export const getDashAddress = publicKeyHex => {
  const pubKeyHash = 0x4C
  return getBitcoinSeriesAddress(publicKeyHex, pubKeyHash)
}

const getBitcoinSeriesAddress = (publicKeyHex, pubKeyHash) => {
  const pubkey = Buffer.from(publicKeyHex, 'hex')
  const network = {
    pubKeyHash: pubKeyHash
  }
  const { address } = payments.p2pkh( { pubkey, network  } )
  return address.toString()
}

export const getDogeAddress = publicKeyHex => {
  const pubKeyHash = 0x1E
  return getBitcoinSeriesAddress(publicKeyHex, pubKeyHash)
}

export const getBitcoinCashAddress = publicKeyHex => {
  const address = getBitcoinAddress(publicKeyHex)
  return bitbox.Address.toCashAddress(address)
}

export const getBitcoinAddress = publicKeyHex => {
  const pubKeyHash = 0x00
  return getBitcoinSeriesAddress(publicKeyHex, pubKeyHash)
}

export const getSegwitAddress = publicKeyHex => {
  const pubkey = Buffer.from(publicKeyHex, 'hex')
  const { address } = payments.p2wpkh( { pubkey } )
  return address
}

export const getLitecoinAddress = publicKeyHex => {
  const pubKeyHash = 0x30
  return getBitcoinSeriesAddress(publicKeyHex, pubKeyHash)
}

export const getXRPAddress = publicKeyHex => {
  return deriveAddress(publicKeyHex)
}

export const getEthAddress = publicKeyHex => {
  return EthCrypto.publicKey.toAddress(
    publicKeyHex
  )
}

export const getBTGAddress = publicKeyHex => {
  const pubKeyHash = 0x26
  return getBitcoinSeriesAddress(publicKeyHex, pubKeyHash)
}

export const getBnbAddress = publicKeyHex => {
  return bnbSdk.crypto.getAddressFromPublicKey(publicKeyHex, 'bnb')
}

export const getQtumAddress = publicKeyHex => {
  const pubKeyHash = 0x3a
  return getBitcoinSeriesAddress(publicKeyHex, pubKeyHash)
}