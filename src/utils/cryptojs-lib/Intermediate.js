import secureRandom from 'secure-random'
import { CryptoScrypt } from './bip38/crypto_scrypt'
import { ec } from './bip38/ellipticcurve'
import BigInteger from './bip38/biginteger'
import { doubleSha256 } from './util/sha256'
import bs58 from 'bs58'
export async function genIntermediate (passphrase) {
  let ownerEntropy, ownerSalt;
  ownerSalt = ownerEntropy = secureRandom(8);
  const prefactor = await CryptoScrypt(passphrase, ownerSalt, 16384, 8, 8, 32);
  const passfactor = BigInteger.fromByteArrayUnsigned(prefactor);
  // 5.
  const ecparams = ec.getSECCurveByName("secp256k1");
  const passpoint = ecparams.getG().multiply(passfactor).getEncoded(1);
  // 6.
  const magicBytes = [0x2C, 0xE9, 0xB3, 0xE1, 0xFF, 0x39, 0xE2, 0x53];
  let intermediate = magicBytes.concat(ownerEntropy).concat(passpoint);
  intermediate = intermediate.concat(doubleSha256(intermediate).slice(0,4));
  return bs58.encode(Buffer.from(intermediate, 'Hex'))
}