import { Binary, UTF8, wordsToBytes, bytesToHex } from './crypto'

function HMAC(hasher, message, key, options) {

  // Convert to byte arrays
  if (message.constructor == String) message = UTF8.stringToBytes(message);
  if (key.constructor == String) key = UTF8.stringToBytes(key);
  /* else, assume byte arrays already */

  // Allow arbitrary length keys
  if (key.length > 16 * 4) {
    key = hasher(key, {asBytes: true});
  }

  // XOR keys with pad constants
  const okey = key.slice(0),
    ikey = key.slice(0);
  for (let i = 0; i < 16 * 4; i++) {
    okey[i] ^= 0x5C;
    ikey[i] ^= 0x36;
  }

  const hmacBytes = hasher(okey.concat(hasher(ikey.concat(message), {asBytes: true})), {asBytes: true});

  return options && options.asBytes ? hmacBytes :
    options && options.asString ? Binary.bytesToString(hmacBytes) :
      bytesToHex(hmacBytes)

}

export function PBKDF2(password, salt, keylen, options) {
  // console.log(`password: ${password}, salt: ${salt}, keylen: ${keylen}`)
  // Convert to byte arrays
  if (password.constructor == String) password = UTF8.stringToBytes(password);
  if (salt.constructor == String) salt = UTF8.stringToBytes(salt);
  /* else, assume byte arrays already */

  // Defaults
  var hasher = options && options.hasher || C.SHA1,
    iterations = options && options.iterations || 1;

  // Pseudo-random function
  function PRF(password, salt) {
    return HMAC(hasher, salt, password, {asBytes: true});
  }

  // Generate key
  var derivedKeyBytes = [],
    blockindex = 1;
  while (derivedKeyBytes.length < keylen) {
    let block = PRF(password, salt.concat(wordsToBytes([blockindex])));

    for (let u = block, i = 1; i < iterations; i++) {
      u = PRF(password, u);
      for (let j = 0; j < block.length; j++) block[j] ^= u[j];
    }
    derivedKeyBytes = derivedKeyBytes.concat(block);
    blockindex++;
  }

  // Truncate excess bytes
  derivedKeyBytes.length = keylen;

  return options && options.asBytes ? derivedKeyBytes :
    options && options.asString ? Binary.bytesToString(derivedKeyBytes) :
      bytesToHex(derivedKeyBytes);

}