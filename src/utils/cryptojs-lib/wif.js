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

export const getDashwif = privateKeyHex => {
  return ECPair.fromPrivateKey(
    Buffer.from(privateKeyHex, 'hex'),
    {network: {
      messagePrefix: 'dash',
      bip32: {
        public: 0x02fe52cc,
        private: 0x02fe52f8,
      },
      pubKeyHash: 0x4c,
      scriptHash: 0x10,
      wif: 0xcc
    }}
  ).toWIF()
}

export const getDogewif = privateKeyHex => {
  return ECPair.fromPrivateKey(
    Buffer.from(privateKeyHex, 'hex'),
    {network: {
      messagePrefix: 'doge',
      bip32: {
        public: 0x02facafd,
        private: 0x02fac398,
      },
      pubKeyHash: 0x1e,
      scriptHash: 0x16,
      wif: 0x9e
    }}
  ).toWIF()
}