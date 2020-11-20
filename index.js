/**
 * Based on Bitcoinjs BIP39 implementation https://github.com/bitcoinjs/bip39/blob/master/src/index.js
 */

const crypto = require('crypto');

const binaryToByte = (bin) => parseInt(bin, 2);

const bytesToBinary = (bytes) => bytes.map((x) => x.toString(2).padStart(8, '0')).join('');

const deriveChecksumBits = (entropyBuffer) => {
  const ENT = entropyBuffer.length * 8;
  const CS = ENT / 32;
  const hash = crypto.createHash('sha256')
    .update(entropyBuffer)
    .digest();

  return bytesToBinary(Array.from(hash)).slice(0, CS);
}

const validateEntropyBytes = (entropyBytes) => {
  // 128 <= ENT <= 256
  if (entropyBytes.length < 16) {
    throw new Error('INVALID_ENTROPY');
  }
  if (entropyBytes.length > 32) {
    throw new Error('INVALID_ENTROPY');
  }
  if (entropyBytes.length % 4 !== 0) {
    throw new Error('INVALID_ENTROPY');
  }
}

const mnemonicToEntropy = (mnemonic, wordlist) => {
  if (!wordlist) {
    throw new Error('WORDLIST_REQUIRED');
  }
  const words = mnemonic.normalize('NFKD').split(' ');
  if (words.length % 3 !== 0) {
    throw new Error('INVALID_MNEMONIC');
  }
  // convert word indices to 11 bit binary strings
  const bits = words
    .map((word) => {
      const index = wordlist.indexOf(word);
      if (index === -1) {
        throw new Error('INVALID_MNEMONIC');
      }
      return index.toString(2).padStart(11, '0');
    })
    .join('');

  // split the binary string into ENT/CS
  const dividerIndex = Math.floor(bits.length / 33) * 32;
  const entropyBits = bits.slice(0, dividerIndex);
  const checksumBits = bits.slice(dividerIndex);
  // calculate the checksum and compare
  const entropyBytes = entropyBits.match(/(.{1,8})/g).map(binaryToByte);

  validateEntropyBytes(entropyBytes);

  const entropy = Buffer.from(entropyBytes);
  const newChecksum = deriveChecksumBits(entropy);
  if (newChecksum !== checksumBits) {
    throw new Error('INVALID_CHECKSUM');
  }
  return entropy.toString('hex');
}

const entropyToMnemonic = (entropy, wordlist) => {
  if (!Buffer.isBuffer(entropy)) {
    entropy = Buffer.from(entropy, 'hex');
  }
  if (!wordlist) {
    throw new Error('WORDLIST_REQUIRED');
  }

  validateEntropyBytes(entropy);

  const entropyBits = bytesToBinary(Array.from(entropy));
  const checksumBits = deriveChecksumBits(entropy);
  const bits = entropyBits + checksumBits;
  const chunks = bits.match(/(.{1,11})/g);
  const words = chunks.map((binary) => {
    const index = binaryToByte(binary);
    return wordlist[index];
  });
  return wordlist[0] === '\u3042\u3044\u3053\u304f\u3057\u3093' // Japanese wordlist
    ? words.join('\u3000')
    : words.join(' ');
}

exports.mnemonicToEntropy = mnemonicToEntropy;

exports.entropyToMnemonic = entropyToMnemonic;
