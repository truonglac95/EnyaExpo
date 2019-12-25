"use strict";

/*

This is a heavily modified version of eccrypto's browser.js
rewritten to use forge random number generator
and remove requirement for node crypto and subtle,
as well as other packages

Jan Liphardt
jan@blockdoc.com
version 0.1 July 2, 2019

*/

var EC = require("elliptic").ec;
var ec = new EC("secp256k1");
var Buffer = require('buffer/').Buffer;
var forge = require('node-forge');

const EC_GROUP_ORDER = Buffer.from('fffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141', 'hex');
const ZERO32 = Buffer.alloc(32, 0);

function assert(condition, message) {
  if (!condition) {
    throw new Error(message || "Assertion failed");
  }
}

function isScalar (x) {
  return Buffer.isBuffer(x) && x.length === 32;
}

function isValidPrivateKey(privateKey) {
  if (!isScalar(privateKey)){
    return false;
  }
  return privateKey.compare(ZERO32) > 0 && // > 0
  privateKey.compare(EC_GROUP_ORDER) < 0;  // < G
}

// Compare two buffers in constant time to prevent timing attacks.
function equalConstTime(b1, b2) {
  if (b1.length !== b2.length) {
    return false;
  }
  var res = 0;
  for (var i = 0; i < b1.length; i++) {
    res |= b1[i] ^ b2[i];  // jshint ignore:line
  }
  return res === 0;
}

function randomBytes(size) {
  var bytes = forge.random.getBytesSync(size);
  var buffer = forge.util.createBuffer(bytes, 'raw');
  return(Buffer.from( buffer.getBytes(), 'binary'));
}

function sha512(msg) {
  return new Promise(function(resolve) {
    var hash = forge.md.sha512.create();
    var result = Buffer.from(hash.update(msg.toString('binary')).digest().getBytes(), 'binary');
    resolve(new Uint8Array(result));
  });
}

function hmacSha256Sign(key, msg) {
  return new Promise(function(resolve) {
    var hmac = forge.hmac.create();
    hmac.start('sha256', key.toString('binary'));
    hmac.update(msg.toString('binary'));
    var result = Buffer.from(hmac.digest().getBytes(), 'binary');
    resolve(result);
  });
}

function hmacSha256Verify(key, msg, sig) {
  return new Promise(function(resolve) {
    var hmac = forge.hmac.create();
    hmac.start('sha256', key.toString('binary'));
    hmac.update(msg.toString('binary'));
    var expectedSig = Buffer.from(hmac.digest().getBytes(), 'binary');
    resolve(equalConstTime(expectedSig, sig));
  });
}

/**
  * Generate a new valid private key.
  * @return {Buffer} A 32-byte private key.
  * @function
  */
exports.generatePrivate = function () {
  var privateKey = randomBytes(32);
  while (!isValidPrivateKey(privateKey)) {
    privateKey = randomBytes(32);
  }
  return privateKey;
};

var getPublic = exports.getPublic = function(privateKey) {
  // This function has sync API so we throw an error immediately.
  assert(privateKey.length === 32, "Bad private key");
  assert(isValidPrivateKey(privateKey), "Bad private key");
  // XXX(Kagami): `elliptic.utils.encode` returns array for every
  // encoding except `hex`.
  return Buffer.from(ec.keyFromPrivate(privateKey).getPublic("arr"));
};

/**
 * Get compressed version of public key.
 */
var getPublicCompressed = exports.getPublicCompressed = function(privateKey) { // jshint ignore:line
  assert(privateKey.length === 32, "Bad private key");
  assert(isValidPrivateKey(privateKey), "Bad private key");
  // See https://github.com/wanderer/secp256k1-node/issues/46
  let compressed = true;
  return Buffer.from(ec.keyFromPrivate(privateKey).getPublic(compressed, "arr"));
};

// NOTE(Kagami): We don't use promise shim in Browser implementation
// because it's supported natively in new browsers (see
// <http://caniuse.com/#feat=promises>) and we can use only new browsers
// because of the WebCryptoAPI (see
// <http://caniuse.com/#feat=cryptography>).
exports.sign = function(privateKey, msg) {
  return new Promise(function(resolve) {
    assert(privateKey.length === 32, "Bad private key");
    assert(isValidPrivateKey(privateKey), "Bad private key");
    assert(msg.length > 0, "Message should not be empty");
    assert(msg.length <= 32, "Message is too long");
    resolve(Buffer.from(ec.sign(msg, privateKey, {canonical: true}).toDER()));
  });
};

exports.verify = function(publicKey, msg, sig) {
  return new Promise(function(resolve, reject) {
    assert(publicKey.length === 65 || publicKey.length === 33, "Bad public key");
    if (publicKey.length === 65)
    {
      assert(publicKey[0] === 4, "Bad public key");
    }
    if (publicKey.length === 33)
    {
      assert(publicKey[0] === 2 || publicKey[0] === 3, "Bad public key");
    }
    assert(msg.length > 0, "Message should not be empty");
    assert(msg.length <= 32, "Message is too long");
    if (ec.verify(msg, sig, publicKey)) {
      resolve(null);
    } else {
      reject(new Error("Bad signature"));
    }
  });
};

/**
 * Derive shared secret for given private and public keys.
 * @param {Buffer} privateKeyA - Sender's private key (32 bytes)
 * @param {Buffer} publicKeyB - Recipient's public key (65 bytes)
 * @return {Promise.<Buffer>} A promise that resolves with the derived
 * shared secret (Px, 32 bytes) and rejects on bad key.
 */
var derive = exports.derive = function(privateKeyA, publicKeyB) {
  return new Promise(function(resolve) {
    //console.log(privateKeyA);
    assert(Buffer.isBuffer(privateKeyA), "Bad private key 1");
    assert(Buffer.isBuffer(publicKeyB), "Bad public key 2");
    assert(privateKeyA.length === 32, "Bad private key 3");
    assert(isValidPrivateKey(privateKeyA), "Bad private key 4");
    assert(publicKeyB.length === 65 || publicKeyB.length === 33, "Bad public key 5");
    if (publicKeyB.length === 65)
    {
      assert(publicKeyB[0] === 4, "Bad public key 6");
    }
    if (publicKeyB.length === 33)
    {
      assert(publicKeyB[0] === 2 || publicKeyB[0] === 3, "Bad public key 7");
    }
    var keyA = ec.keyFromPrivate(privateKeyA);
    var keyB = ec.keyFromPublic(publicKeyB);
    var Px = keyA.derive(keyB.getPublic());  // BN instance
    resolve(Buffer.from(Px.toArray()));
  });
};

/**
 * Input/output structure for ECIES operations.
 * @typedef {Object} Ecies
 * @property {Buffer} iv - Initialization vector (16 bytes)
 * @property {Buffer} ephemPublicKey - Ephemeral public key (65 bytes)
 * @property {Buffer} ciphertext - The result of encryption (variable size)
 * @property {Buffer} mac - Message authentication code (32 bytes)
 */

/**
 * Encrypt message for given recipient's public key.
 * @param {Buffer} publicKeyTo - Recipient's public key (65 bytes)
 * @param {Buffer} msg - The message being encrypted
 * @param {?{?iv: Buffer, ?ephemPrivateKey: Buffer}} opts - You may also
 * specify initialization vector (16 bytes) and ephemeral private key
 * (32 bytes) to get deterministic results.
 * @return {Promise.<Ecies>} - A promise that resolves with the ECIES
 * structure on successful encryption and rejects on failure.
 */
exports.encrypt = function(publicKeyTo, msg, opts) {
  opts = opts || {};
  // Tmp variables to save context from flat promises;
  var iv, ephemPublicKey, ciphertext, macKey;
  return new Promise(function(resolve) {
    var ephemPrivateKey = opts.ephemPrivateKey || randomBytes(32);
    // There is a very unlikely possibility that it is not a valid key
    while(!isValidPrivateKey(ephemPrivateKey))
    {
      ephemPrivateKey = opts.ephemPrivateKey || randomBytes(32);
    }
    ephemPublicKey = getPublic(ephemPrivateKey);
    resolve(derive(ephemPrivateKey, publicKeyTo));
  }).then(function(Px) {
    return sha512(Px);
  }).then(function(hash) {
    iv = opts.iv || randomBytes(16);
    var encryptionKey = hash.slice(0, 32);
    macKey = hash.slice(32);
    var key = forge.util.createBuffer(encryptionKey);
    var cipher = forge.cipher.createCipher('AES-CBC', key);
    cipher.start({iv: iv.toString('binary')});
    cipher.update(forge.util.createBuffer(msg.toString('binary')));
    cipher.finish();
    return Buffer.from(cipher.output.data, 'binary');
  }).then(function(data) {
    ciphertext = data;
    var dataToMac = Buffer.concat([iv, ephemPublicKey, ciphertext]);
    return hmacSha256Sign(macKey, dataToMac);
  }).then(function(mac) {
    return {
      iv: iv,
      ephemPublicKey: ephemPublicKey,
      ciphertext: ciphertext,
      mac: mac,
    };
  });
};

exports.decrypt = function(privateKey, opts) {
  // Tmp variable to save context from flat promises;
  var encryptionKey;
  return derive(privateKey, opts.ephemPublicKey).then(function(Px) {
    return sha512(Px);
  }).then(function(hash) {
    encryptionKey = hash.slice(0, 32);
    var macKey = hash.slice(32);
    var dataToMac = Buffer.concat([
      opts.iv,
      opts.ephemPublicKey,
      opts.ciphertext
    ]);
    return hmacSha256Verify(macKey, dataToMac, opts.mac);
  }).then(function(macGood) {
    assert(macGood, "Bad MAC");
    var key = forge.util.createBuffer(encryptionKey);
    var decipher = forge.cipher.createDecipher('AES-CBC', key);
    decipher.start({iv: opts.iv.toString('binary')});
    decipher.update(forge.util.createBuffer(opts.ciphertext.toString('binary')));
    decipher.finish();
    return decipher.output.toString();
  }).then(function(plaintext) {
    return Buffer.from(plaintext);
  });
};