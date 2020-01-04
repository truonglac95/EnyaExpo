/*

EnyaQR provides API and SDK for your app 
enabling securely scanning the QR code.

Blockdoc
help@blockdoc.com
version 1.0.0 DEC 25, 2019

*/

import forge from 'node-forge';
import * as SecureStore from 'expo-secure-store';

exports.QRSetCredentials = async function ( data ) {

    var bytes = forge.util.hexToBytes(data);
    var cipherText = forge.util.createBuffer(bytes, 'raw');

    var salt = cipherText.getBytes(8);
    var keySize = 32;
    var ivSize = 16;

    var derivedBytes = forge.pbe.opensslDeriveBytes('elliptic31415926newAES', salt, keySize + ivSize);
    var buffer = forge.util.createBuffer(derivedBytes);
    var key = buffer.getBytes(keySize);
    var iv = buffer.getBytes(ivSize);

    var decipher = forge.cipher.createDecipher('AES-CBC', key);
    decipher.start({iv: iv});
    decipher.update(cipherText);
    decipher.finish();
    
    try {

    var decodedQR = await forge.util.decodeUtf8(decipher.output);

    if( decodedQR.substring(0, 8) === 'blockdoc' ) {

      var QRversion = decodedQR.substring(9, 13);
      var UUID = decodedQR.substring(14, 30);
      var eccPrivKey = decodedQR.substring(31);

      let newAccount = {
        UUID,
        QRversion,
        QRfullcode: data,
        eccPrivKey,
      };

      //wipe any old account just in case
      //the scanner should only ever be called 
      //when there is no account in the first place
      SecureStore.deleteItemAsync('ENYA_KEYS').then(()=>{}).catch(()=>{});

      //save to local secure storage
      SecureStore.setItemAsync('ENYA_KEYS', JSON.stringify(newAccount));

      return UUID;

    } 
    else {
      
      return {};
    
    }
  } 
  catch(e) {
    console.log(e);
    throw e;
  }

}