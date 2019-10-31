import { ECPair } from 'bitcoinjs-lib'

const litecoinNetwork = {
  messagePrefix: '\x18Litecoin Signed Message:\n',
  bip32: {
    public: 0x019da462,
    private: 0x019d9cfe,
  },
  pubKeyHash: 0x30,
  scriptHash: 0x32,
  wif: 0xb0,
}

export const getLitecoinWif = privateKeyHex => {
  return ECPair.fromPrivateKey(
    Buffer.from(privateKeyHex, 'hex'),
    {network: litecoinNetwork}
  ).toWIF()
}

export const getBitcoinWif = privateKeyHex => {
  return ECPair.fromPrivateKey(
    Buffer.from(privateKeyHex, 'hex')
  ).toWIF()
}