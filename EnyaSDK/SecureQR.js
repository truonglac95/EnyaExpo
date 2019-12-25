import forge from 'node-forge';

export async function SecureQRGetCredentials( data ) {

    const password = 'elliptic31415926newAES';

    var bytes = forge.util.hexToBytes(data);
    var cipherText = forge.util.createBuffer(bytes, 'raw');

    var salt = cipherText.getBytes(8);
    var keySize = 32;
    var ivSize = 16;

    var derivedBytes = forge.pbe.opensslDeriveBytes(password, salt, keySize + ivSize);
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
        timestamp: (new Date()).getTime(),
        UUID,
        QRversion,
        QRfullcode: data,
        eccPrivKey,
        loading: false,
      };

      return newAccount;

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