import { decode } from '../util/base58'
import { doubleSha256 } from '../util/sha256'
import BigInteger from './biginteger'

const B58 = {
  alphabet: "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz",
  validRegex: /^[1-9A-HJ-NP-Za-km-z]+$/,
  base: BigInteger.valueOf(58)
}

function encode(input) {
  var bi = BigInteger.fromByteArrayUnsigned(input);
  var chars = [];

  while (bi.compareTo(B58.base) >= 0) {
    var mod = bi.mod(B58.base);
    chars.unshift(B58.alphabet[mod.intValue()]);
    bi = bi.subtract(mod).divide(B58.base);
  }
  chars.unshift(B58.alphabet[bi.intValue()]);

  // Convert leading zeros too.
  for (var i = 0; i < input.length; i++) {
    if (input[i] == 0x00) {
      chars.unshift(B58.alphabet[0]);
    } else break;
  }

  return chars.join('');
}

export function address(bytes) {
  if ("string" == typeof bytes) {
    bytes = decodeString(bytes);
  }
  var hash = bytes.slice(0);

  // Version
  hash.unshift(0x00);
  var checksum = doubleSha256(hash);
  var rv = hash.concat(checksum.slice(0, 4));
  return encode(rv);
};

/**
 * Parse a Bitcoin address contained in a string.
 */
function decodeString(string) {
  var bytes = decode(string);
  var hash = bytes.slice(0, 21);
  var checksum = doubleSha256(hash);

  if (checksum[0] != bytes[21] ||
    checksum[1] != bytes[22] ||
    checksum[2] != bytes[23] ||
    checksum[3] != bytes[24]) {
    throw "Checksum validation failed!";
  }

  var version = hash.shift();

  if (version != 0) {
    throw "Version " + version + " not supported!";
  }

  return hash;
}