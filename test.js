const assert = require('assert').strict;
const lib = require('./index');

const englishWordlist = require('./english.json');

const test1 = () => {
  const mnemonic = 'cover just ginger beyond where brown day neither liar two ball salon taxi increase holiday outdoor outdoor simple rate lab execute afraid beach fossil';
  const entropy = lib.mnemonicToEntropy(mnemonic, englishWordlist);
  console.log('Test 1. Entropy', entropy);
  const derivedMnemonic = lib.entropyToMnemonic(entropy, englishWordlist);
  console.log('Test 1. Derived Mnemonic', derivedMnemonic);
  assert.equal(mnemonic, derivedMnemonic);
  console.log('Test 1. OK');
}

const test2 = () => {
  const entropy = 'deadbeafdeadbeafdeadbeafdeadbeafdeadbeafdeadbeafdeadbeafdeadbeaf';
  const mnemonic = lib.entropyToMnemonic(entropy, englishWordlist);
  console.log('Test 2. Mnemonic', mnemonic);
  const derivedEntropy = lib.mnemonicToEntropy(mnemonic, englishWordlist);
  console.log('Test 2. Derived Entropy', entropy);
  assert.equal(entropy, derivedEntropy);
  console.log('Test 2. OK');
}

test1();
test2();
