import { RIPEMD160 } from './ripemd160'
import { sha256 } from '../util/sha256'

const base64map = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

export function rotl(n, b) {
  return (n << b) | (n >>> (32 - b));
}

// Bit-wise rotate right
export function rotr(n, b) {
  return (n << (32 - b)) | (n >>> b);
}

// Swap big-endian to little-endian and vice versa
export function endian(n) {

  // If number given, swap endian
  if (n.constructor == Number) {
    return util.rotl(n, 8) & 0x00FF00FF |
      util.rotl(n, 24) & 0xFF00FF00;
  }

  // Else, assume array and swap all items
  for (var i = 0; i < n.length; i++)
    n[i] = util.endian(n[i]);
  return n;

}

// Generate an array of any length of random bytes
export function randomBytes(n) {
  for (var bytes = []; n > 0; n--)
    bytes.push(Math.floor(Math.random() * 256));
  return bytes;
}

// Convert a byte array to big-endian 32-bit words
export function bytesToWords(bytes) {
  for (var words = [], i = 0, b = 0; i < bytes.length; i++, b += 8)
    words[b >>> 5] |= (bytes[i] & 0xFF) << (24 - b % 32);
  return words;
}

// Convert big-endian 32-bit words to a byte array
export function wordsToBytes(words) {
  for (var bytes = [], b = 0; b < words.length * 32; b += 8)
    bytes.push((words[b >>> 5] >>> (24 - b % 32)) & 0xFF);
  return bytes;
}

// Convert a byte array to a hex string
export function bytesToHex(bytes) {
  for (var hex = [], i = 0; i < bytes.length; i++) {
    hex.push((bytes[i] >>> 4).toString(16));
    hex.push((bytes[i] & 0xF).toString(16));
  }
  return hex.join("");
}

// Convert a hex string to a byte array
export function hexToBytes(hex) {
  for (var bytes = [], c = 0; c < hex.length; c += 2)
    bytes.push(parseInt(hex.substr(c, 2), 16));
  return bytes;
}

// Convert a byte array to a base-64 string
export function bytesToBase64(bytes) {
  for (var base64 = [], i = 0; i < bytes.length; i += 3) {
    var triplet = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];
    for (var j = 0; j < 4; j++) {
      if (i * 8 + j * 6 <= bytes.length * 8)
        base64.push(base64map.charAt((triplet >>> 6 * (3 - j)) & 0x3F));
      else base64.push("=");
    }
  }

  return base64.join("");
}

// Convert a base-64 string to a byte array
export function base64ToBytes(base64) {
  // Remove non-base-64 characters
  base64 = base64.replace(/[^A-Z0-9+\/]/ig, "");

  for (var bytes = [], i = 0, imod4 = 0; i < base64.length; imod4 = ++i % 4) {
    if (imod4 == 0) continue;
    bytes.push(((base64map.indexOf(base64.charAt(i - 1)) & (Math.pow(2, -2 * imod4 + 8) - 1)) << (imod4 * 2)) |
      (base64map.indexOf(base64.charAt(i)) >>> (6 - imod4 * 2)));
  }

  return bytes;
}

export const UTF8 = {

  // Convert a string to a byte array
  stringToBytes: function (str) {
    return Binary.stringToBytes(unescape(encodeURIComponent(str)));
  },

  // Convert a byte array to a string
  bytesToString: function (bytes) {
    return decodeURIComponent(escape(Binary.bytesToString(bytes)));
  }

};

// Binary encoding
export const Binary = {

  // Convert a string to a byte array
  stringToBytes: function (str) {
    for (var bytes = [], i = 0; i < str.length; i++)
      bytes.push(str.charCodeAt(i) & 0xFF);
    return bytes;
  },

  // Convert a byte array to a string
  bytesToString: function (bytes) {
    for (var str = [], i = 0; i < bytes.length; i++)
      str.push(String.fromCharCode(bytes[i]));
    return str.join("");
  }

}

export function sha256ripe160(data) {
  return RIPEMD160(sha256(data, { asBytes: true }), { asBytes: true });
}

export const bytesToString = function (bytes) {
  return decodeURIComponent(escape(bytesToString(bytes)));
}

const binaryStringToBytes = function (str) {
  for (var bytes = [], i = 0; i < str.length; i++)
    bytes.push(str.charCodeAt(i) & 0xFF);
  return bytes;
}

export const stringToBytes = function (str) {
  return binaryStringToBytes(unescape(encodeURIComponent(str)));
}