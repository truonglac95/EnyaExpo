/*

EnyaDeliver provides functions for handling 
encrypted results.

Blockdoc
help@blockdoc.com
version 1.0.0 DEC 25, 2019

*/

import forge from 'node-forge';
import * as SecureStore from 'expo-secure-store';
import * as FileSystem from 'expo-file-system';

const pdfStore = `${FileSystem.documentDirectory}User/PDFs`;
var ENresultPDF = ``;
var ecies = require('./ECIES.js');
var Buffer = require('buffer/').Buffer;

function getTimestamps(value, index, array) { 
  //this is the upload time - set by the code when file is uploaded
  var unix_time = parseInt(array[index].unix_time);
  return [index, unix_time]; 
};

async function GetKey() {

  let privateKey = {};
  let keyPayload = {};
  let localResult = {};

  try {
    
    await SecureStore.getItemAsync('ENYA_RESULT').then(result => {
      if (result) {
        if (__DEV__) console.log('Enya_GetKey: Yes we have a local file.')
        localResult = result ? JSON.parse(result) : {};
      } else {
        if (__DEV__) console.log('Enya_GetKey: No local file.')
      }
    })
    
    await SecureStore.getItemAsync('ENYA_KEYS').then(keys => {
      if (keys) {
        if (__DEV__) console.log('Enya_GetKey: Yes we have a local key.')
        let localKeys = keys ? JSON.parse(keys) : {};
        let ECC_PRIV_KEY = localKeys.eccPrivKey; 
        privateKey = Buffer.from(ECC_PRIV_KEY, 'hex');
        keyPayload = {
          iv: Buffer.from(localResult.iv, 'hex'),
          ephemPublicKey: Buffer.from(localResult.epc, 'hex'),
          ciphertext: Buffer.from(localResult.ciphertext, 'hex'),
          mac: Buffer.from(localResult.mac, 'hex'),
        };
      } else {
        if (__DEV__) console.log('Enya_GetKey: No local key.')
      }
    })

    return prepareKey( privateKey, keyPayload, localResult.ENresultPDF )
    
  }
  catch(e) {
    console.log(e);
    throw e;
  }
}

async function prepareKey( privateKey, keyPayload, ENresultPDF ) {

  var passwordECIES = await ecies.decrypt(privateKey, keyPayload);
  var passwordHex = passwordECIES.toString();
  var passwordForge = forge.util.hexToBytes(passwordHex);

  return { passwordForge, ENresultPDF }

}

function decryptFile( encrypted64, password ) {

    var encrypted = forge.util.decode64(encrypted64);
    var input = forge.util.createBuffer(encrypted);

    var salt = input.getBytes(8);
    var derivedBytes = forge.pbe.opensslDeriveBytes(password, salt, 48);
    var buffer = forge.util.createBuffer(derivedBytes);
    var key = buffer.getBytes(32);
    var iv = buffer.getBytes(16);

    var decipher = forge.cipher.createDecipher('AES-CBC', key);
    
    decipher.start({iv: iv});
    decipher.update(input);
    
    var decrypted = decipher.output.getBytes();
    var decrypted64 = forge.util.encode64(decrypted);

    if (__DEV__) {
      console.log("Enya_decryptFile decrypted pdf in base64 should be:\nJVBERi0xL");
      console.log("Enya_decryptFile decrypted pdf in base64 actual:\n"+ decrypted64.substr(0,9));
    }

    if (decipher.finish()) {
      if (__DEV__) console.log('Enya_decryptFile: Decipher ops just completed');
      return(decrypted64)
    } else {
      if (__DEV__) console.log('Enya_decryptFile: Decipher ops did not complete');
      return ''
    };

}

exports.BurnEverything = async function () {

  SecureStore.deleteItemAsync('ENYA_KEYS').then(() => {}).catch(() => {});
  SecureStore.deleteItemAsync('ENYA_RESULT').then(() => {}).catch(() => {});

}

exports.DecryptResult = async function () {

  let kpl = await GetKey();

  return new Promise(function (resolve, reject) {

    FileSystem.readAsStringAsync(
      kpl.ENresultPDF, 
      { encoding: FileSystem.EncodingType.Base64 }
    ).then((encrypted64) => {
      var decrypted64 = decryptFile( encrypted64, kpl.passwordForge )
      //if (__DEV__) console.log("Enya_Result_Decrypt2( encrypted64, passwordForge ): " + decrypted64.substr(0,30))
      resolve(decrypted64)
    });
  })

}

exports.GetResult = function ( res ) {

return new Promise(function (resolve, reject) {

  let result = res

  var newLocalResult = {};
  var downloadURL = '';

  var timestamps = result.map(getTimestamps);

  var latest = 0;
  var latestIndex = 0;

  timestamps.forEach(element => {
    if(element[1] > latest) {
      latestIndex = element[0];
      latest = element[1];
    }
  });

  if (__DEV__) console.log(`Enya_GetResult: Most recent file/status is ${latest} at idx ${latestIndex}`);

  result[latestIndex].haveDNA = true;
  result[latestIndex].unix_time = parseInt(result[latestIndex].unix_time);

  // pick out the most current one
  result = [result[latestIndex]];

  //compute local results array
  if( result[0].r_state > 5 ) {
    if (__DEV__) console.log('Enya_GetResult: Case 8');
    newLocalResult = {};
  } 
  else if( result[0].r_state < 4 ) {
    //case 0, 1, 2, 3
    if (__DEV__) console.log('Enya_GetResult: Simple report < 4');
    newLocalResult = {
      id: result[0].id,
      timestamp: parseInt(result[0].unix_time),
      report_type: result[0].report_type,
      r_state: result[0].r_state,
      haveDNA: true,
    };
  } 
  else {
    //case 4 or 5
    if (__DEV__) console.log('Enya_GetResult: New file, 4 or 5');

    downloadURL = result[0].url_to_s3_crypto_pdf;

    var filename = result[0].url_to_s3_crypto_pdf;

    filename = filename.split('?')[0];
    filename = filename.split('/')[3];

    newLocalResult = {
      id: result[0].id,
      timestamp: parseInt(result[0].unix_time),
      report_type: result[0].report_type,
      r_state: result[0].r_state,
      haveDNA: true,
      filename,
      ciphertext: result[0].ecc_cipher,
      mac: result[0].ecc_mac,
      epc: result[0].ecc_epc,
      iv: result[0].ecc_iv,
      ENresultPDF: `${pdfStore}/${filename}`,
    };

  } //closes rstate 4 or 5

  //now let's see if we have a local result
  SecureStore.getItemAsync('ENYA_RESULT').then(resultL => {

    if (__DEV__) console.log('Enya_Result: Local keys/results check.')

    if (resultL) {

      if (__DEV__) console.log('Enya_Result: Local keys/results found.')

      const localResult = resultL ? JSON.parse(resultL) : {};
            
      //if (__DEV__) console.log('Enya_Result: Local result:')
      //if (__DEV__) console.log(localResult)
            
      var localResultTime = localResult.timestamp;
      var latestDBResultTime = result[0].unix_time;

      if (__DEV__) console.log(`Enya_Result: Most recent remote file or result is: ${latestDBResultTime}`)
      if (__DEV__) console.log(`Enya_Result: Timestamp of (potential) file on phone: ${localResultTime}`)
      if (__DEV__) console.log(`Enya_Result: Do timestamps match?`,localResultTime === latestDBResultTime)

      if( result[0].r_state > 5 && (localResultTime != latestDBResultTime) ) {
        //we already _should_ have a copy of the most recent results locally
        if (__DEV__) console.log(`Enya_Result: there is a newer result but it's already been downloaded`);
        if (__DEV__) console.log(`Enya_Result: this sometimes happens in testing but should not happen in production`);
        if (__DEV__) console.log(`Enya_Result: r_state 8 - result already downloaded`);
        resolve('downloaded')
        //if (__DEV__) console.log(`actionResults: circulateLocalResults`);
      } else if( (localResultTime === latestDBResultTime) ) {
        //we already have a copy of the most recent results locally
        //BUT r_state != 8
        //this case that will only happen during debug operations 
        if (__DEV__) console.log(`Enya_Result: Local copy is current`);
        resolve('downloaded')
        //if (__DEV__) console.log(`actionResults: circulateLocalResults`);
      } else {
        //there is a more recent file and we have not yet downloaded it
        //we need to update the local results
        if (__DEV__) console.log(`Enya_Result: Need to UPDATE local results`);
        //if (__DEV__) console.log('actionResults: Updating localResult to:', newLocalResult)
        SecureStore.setItemAsync('ENYA_RESULT', JSON.stringify(newLocalResult));
        
        if((newLocalResult.r_state === 4) || (newLocalResult.r_state === 5)) {
          if (__DEV__) console.log('Enya_Result: Downloading file')
          FileSystem.downloadAsync( 
            downloadURL,
            newLocalResult.ENresultPDF,
          ).then(({ uri }) => {
            if (__DEV__) console.log('Enya_Result: Finished downloading to', uri);
            resolve('downloaded')
            //we do not want to dispatch this message before the download is done - 
            //can lead to a bug in decrypt
            //if (__DEV__) console.log(`actionResults: circulateLocalResults after file downloaded`);
            //let the server know we have this file or result
          });
        } else {
          if (__DEV__) console.log(`Enya_Result: circulateLocalResults`);
          //let the server know we have this file or result
        }
      } //closes else

    } //if (resultL) {
    else //no previous local result
    {
      if (__DEV__) console.log('Enya_Result: No local keys/results found.')

      if ( result[0].r_state > 5 ) {
        //possible attack or double install
        //do not do anything
        //this should not happen in normal usage since for 
        //every r_state 8 there should be a local file
        if (__DEV__) console.log('Enya_Result - security alert')
        reject('alreadyDownloaded')
        //dispatch(getResultsFailure({error_type : 'security_alert'}));
      } else {
        //we _might_ need to set up file system
        FileSystem.getInfoAsync(pdfStore).then(({ exists }) => {
          if( !exists ) {
            FileSystem.makeDirectoryAsync(
              pdfStore, { intermediates: true }
            ).catch(e => {
              if (__DEV__) console.log(e);
            });
          }
        });
        
        if (__DEV__) console.log(`Enya_Result: Need to CREATE local results`);
        SecureStore.setItemAsync('ENYA_RESULT', JSON.stringify(newLocalResult));

        if((newLocalResult.r_state === 4) || (newLocalResult.r_state === 5)) {
          if (__DEV__) console.log('Enya_Result: Downloading file')
          FileSystem.downloadAsync( 
            downloadURL,
            newLocalResult.ENresultPDF,
          ).then(({ uri }) => {
            if (__DEV__) console.log('Enya_Result: Finished downloading to', uri);
            //we do not want to dispatch this message before the download is done - 
            //can lead to a bug in decrypt
            if (__DEV__) console.log(`Enya_Result: circulateLocalResults after file downloaded`);
            resolve('downloaded')
          });
        } else {
          if (__DEV__) console.log(`Enya_Result: circulateLocalResults non-file`);
        };

      } // if ( result[0].r_state > 5 ) {

    } //no previous local result
  }) //SecureStore.getItemAsync('ENYA_RESULT').then(resultL => {
})

} //function

/*
Recover UUID and Elliptic private key (eccPrivKey) from QR code
*/

exports.QRSetCredentials = async function ( data, QRkey, QRid ) {

    var bytes = forge.util.hexToBytes(data);
    var cipherText = forge.util.createBuffer(bytes, 'raw');

    var salt = cipherText.getBytes(8);
    var keySize = 32;
    var ivSize = 16;

    var derivedBytes = forge.pbe.opensslDeriveBytes(QRkey, salt, keySize + ivSize);
    var buffer = forge.util.createBuffer(derivedBytes);
    var key = buffer.getBytes(keySize);
    var iv = buffer.getBytes(ivSize);

    var decipher = forge.cipher.createDecipher('AES-CBC', key);
    decipher.start({iv: iv});
    decipher.update(cipherText);
    decipher.finish();
    
    try {

      var decodedQR = await forge.util.decodeUtf8(decipher.output);

      if( decodedQR.substring(0, 8) === QRid ) {

        var QRversion = decodedQR.substring(9, 13);
        var UUID = decodedQR.substring(14, 30);
        var eccPrivKey = decodedQR.substring(31);

        let newAccount = {
          UUID,
          QRversion,
          eccPrivKey,
        };

        //the scanner should only ever be called 
        //when there is no account in the first place
        //wipe any old account just in case
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