# BIP39 Mnemonic operations example

> The code is mainly based on [Bitcoinjs BIP39 implementation](https://github.com/bitcoinjs/bip39/blob/master/src/index.js)

## Motivation
For some reasons we may want to store the mnemonic phrase in crypto keys storage that only supports the 256-bit key format.
The BIP39 mnemonic phrase can be easily converted into 32-bytes (256-bits) entropy value. 
And the entropy can be easily restored back to the source mnemonic phrase.

This code example demonstrates how to implement mnemonic to entropy and back conversion in javascript for nodejs.
English wordlists is included. Other languages can be found at the bitcoin repos by link below.
 
## Structure
* `index.js` - main implementation code
* `test.js` - simple usage example and minimal test case

## How to run
* Use the nodejs version 12 and above
* Run test script: `npm test`

## Related
* [BIP39 Proposal](https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki)
* [BIP39 Wordlists](https://github.com/bitcoin/bips/blob/master/bip-0039/bip-0039-wordlists.md)
