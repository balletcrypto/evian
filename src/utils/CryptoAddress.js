import { PublicKey as bchPublicKey } from 'bitcore-lib-cash'
import { payments } from 'bitcoinjs-lib'
import { PrivateKey as ltcPrivatekey, PublicKey as ltcPublicKey } from 'litecore-lib'
import { deriveAddress } from 'ripple-keypairs'
import EthCrypto from 'eth-crypto'


export const getBitcoinCashAddress = publicKeyHex => {
  const address = bchPublicKey(publicKeyHex).toAddress()
  return address.toCashAddress('pubkeyhash')
}

export const getBitcoinAddress = publicKeyHex => {
  const pubkey = Buffer.from(publicKeyHex, 'hex')
  const { address } = payments.p2pkh( { pubkey } )
  return address
}

export const getSegwitAddress = publicKeyHex => {
  const pubkey = Buffer.from(publicKeyHex, 'hex')
  const { address } = payments.p2wpkh( { pubkey } )
  return address
}

export const getLitecoinAddress = publicKeyHex => {
  const address = ltcPublicKey(publicKeyHex).toAddress()
  return address.toString()
}

export const getRippleAddress = publicKeyHex => {
  return deriveAddress(publicKeyHex)
}

export const getEthAddress = publicKeyHex => {
  return EthCrypto.publicKey.toAddress(
    publicKeyHex
  )
}

export const getLitecoinWIF = privateKeyHex => {
  return ltcPrivatekey(privateKeyHex).toWIF()
}

export const getBTGAddress = publicKeyHex => {
  const pubkey = Buffer.from(publicKeyHex, 'hex')
  const network = {
    pubKeyHash: 0x26
  }
  const { address } = payments.p2pkh( { pubkey, network } )
  return address
}