import { decrypt } from 'bip38'
import { ECPair } from 'bitcoinjs-lib'


export const isBip38Format = epk => {
  return /^6P[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]{56}$/.test(epk)
}


export const isValidPassphraseFormat = passphrase => {
  return /^[0-9A-Z]{4}-[0-9A-Z]{4}-[0-9A-Z]{4}-[0-9A-Z]{4}-[0-9A-Z]{4}$/.test(passphrase)
}

export function decryptEpkVcode(epk, vcode) {
  const { privateKey } = decrypt(epk, vcode)
  const ecPair = ECPair.fromPrivateKey(privateKey)

  const publicKeyHex = ecPair.publicKey.toString('hex')
  const privateKeyHex = privateKey.toString('hex')
  const wif = ecPair.toWIF()

  return {
    publicKeyHex,
    privateKeyHex,
    wif,
  }
}