import { decode} from './util/base58'
import { CryptoScrypt } from './bip38/crypto_scrypt'
import BigInteger from './bip38/biginteger'
import { ec } from './bip38/ellipticcurve'
import { bytesToHex } from './bip38/crypto'
import { C_mode, C_pad } from './bip38/crypto.blockmodes'
import { AES } from './bip38/crypto.aes'
import { address } from './bip38/bitcoinjs-lib.address'
import { doubleSha256 } from './util/sha256'
import { sha256ripe160 } from './bip38/crypto'

export function validateConfirmation(confirmation, passphrase) {
  const bytes = decode(confirmation);
  // Get the flag byte.
  // This gives access to IsCompressedPoint and LotSequencePresent
  const flagByte = bytes[5];
  // Get the address hash.
  const addressHash = bytes.slice(6, 10);
  // Get the owner entropy.  (This gives access to LotNumber and SequenceNumber when applicable)
  const ownerEntropy = bytes.slice(10, 18);
  // Get encryptedpointb
  const encryptedpointb = bytes.slice(18, 51);

  const compressed = (flagByte & 0x20) == 0x20;
  const lotSequencePresent = (flagByte & 0x04) == 0x04;
  const ownerSalt = ownerEntropy.slice(0, lotSequencePresent ? 4 : 8)
  console.log(`ownerSalt: ${ownerSalt}, passphrase: ${passphrase}`)

  const prefactor = CryptoScrypt(passphrase, ownerSalt, 16384, 8, 8, 32)
  // Take SHA256(SHA256(prefactor + ownerentropy)) and call this passfactor
  const passfactorBytes = !lotSequencePresent ? prefactor : doubleSha256(prefactor.concat(ownerEntropy));

  const passfactor = BigInteger.fromByteArrayUnsigned(passfactorBytes);
  console.log(`passfactorBytes: ${passfactorBytes}, passfactor: ${passfactor}`)

  const ecparams = ec.getSECCurveByName("secp256k1");
  const passpoint = ecparams.getG().multiply(passfactor).getEncoded(1);

  const addresshashplusownerentropy = addressHash.concat(ownerEntropy);

  const derivedBytes = CryptoScrypt(passpoint, addresshashplusownerentropy, 1024, 1, 1, 64)
  const AES_opts = {mode: new C_mode.ECB(C_pad.NoPadding), asBytes: true};
  const unencryptedpubkey = [];

  // recover the 0x02 or 0x03 prefix
  unencryptedpubkey[0] = encryptedpointb[0] ^ (derivedBytes[63] & 0x01);

  const decrypted1 = AES.decrypt(encryptedpointb.slice(1, 17), derivedBytes.slice(32), AES_opts);
  const decrypted2 = AES.decrypt(encryptedpointb.slice(17, 33), derivedBytes.slice(32), AES_opts);
  const decrypted = unencryptedpubkey.concat(decrypted1).concat(decrypted2)

  for (let x = 0; x < 32; x++) {
    decrypted[x + 1] ^= derivedBytes[x];
  }

  const curve = ec.getSECCurveByName("secp256k1");
  const ecCurve = curve.getCurve();
  const generatedPoint = ecCurve.decodePointHex(bytesToHex(decrypted).toString().toUpperCase());
  const generatedBytes = generatedPoint.multiply(BigInteger.fromByteArrayUnsigned(passfactor)).getEncoded(compressed);
  const generatedAddress = address(sha256ripe160(generatedBytes));
  const publicKeyHex = Buffer.from(generatedBytes).toString("hex")
  console.log(`generatedBytes: ${generatedBytes}, generatedAddress: ${generatedAddress}`)

  const generatedAddressHash = doubleSha256(generatedAddress).slice(0, 4);

  let valid = true;
  for (let i = 0; i < 4; i++) {
    if (addressHash[i] != generatedAddressHash[i]) {
      valid = false;
    }
  }
  return {
    valid,
    generatedAddress,
    publicKeyHex,
  }
}