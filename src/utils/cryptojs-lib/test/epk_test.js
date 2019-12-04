import { expect } from "chai"
import { decryptEpkVcode } from '../bip38'


describe('Test decryptEpkVcode', function() {

  it('should decrypt uncompressed epk passphrase successfully ', () => {
    const epk = '6PfQLxYDvj5sP9c17HFmdqnhCVysnD3EtsjVNWxKeK4rCYMuNMMgoMMsvp'
    const passphrase = '123'
    const { publicKeyHex, privateKeyHex, wif} = decryptEpkVcode(epk, passphrase)

    expect(publicKeyHex).to.equals("040d0bcd3375307b497a30c6c20f502c50429162163a40d39efeca26501b62553bf0b3e903403084b8ad8483c00a7161c849b1e0c8ed00d669a11b0f1d004866ad")
    expect(privateKeyHex).to.equals("731284cd60421fcbcc688c19a6f8287d4452b33d0de34b650cc3b3d1afbfc9f8")
    expect(wif).to.equals("5Jgxx3vrKpD8e2JKv2Xy1jYSTJXPNPn7CnZmzvMzRr8TwWt3njV")
  })

  it('should decrypt compressed epk passphrase successfully ', () => {
    const epk = '6PoLpHU8jZaMsv9dZNNFxfBJfJJnkNMCZapeSESH3bZgQdH5SMt4SRJEiX'
    const passphrase = '3515-H0EP-J513-IUL6-0K5Y'
    const { publicKeyHex, privateKeyHex, wif} = decryptEpkVcode(epk, passphrase)

    expect(publicKeyHex).to.equals("036a093266f21121b01ced5b6cdfbcf7ffdc0816ed18258a879ae09bde836d8602")
    expect(privateKeyHex).to.equals("2154f9c69479511e0adb48eff9cd3a35b7c7611797015c9c8f8f0b5d2195a0df")
    expect(wif).to.equals("KxLWB4zErsEWYRvyFa4NBstmGM4heXAk8U81rbDkZrgE5kiVqEWK")
  })

})