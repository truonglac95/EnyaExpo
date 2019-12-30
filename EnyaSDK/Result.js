import forge from 'node-forge';
import * as SecureStore from 'expo-secure-store';

import { SECURE_STORAGE_RESULT } from '../redux/constants';
import * as FileSystem from 'expo-file-system';
const pdfStore = `${FileSystem.documentDirectory}User/PDFs`;
var ENresultPDF = ``;

function getTimestamps(value, index, array) { 
  //this is the upload time - set by the code when file is uploaded
  var unix_time = parseInt(array[index].unix_time);
  return [index, unix_time]; 
};

export async function Enya_Result( res ) {

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

  if (__DEV__) console.log(`Enya_Result: Most recent file/status is ${latest} at idx ${latestIndex}`);

  result[latestIndex].haveDNA = true;
  result[latestIndex].unix_time = parseInt(result[latestIndex].unix_time);

  // pick out the most current one
  result = [result[latestIndex]];

  //compute local results array
  if( result[0].r_state > 5 ) {
    if (__DEV__) console.log('actionResults: Case 8');
    newLocalResult = {};
  } 
  else if( result[0].r_state < 4 ) {
    //case 0, 1, 2, 3
    if (__DEV__) console.log('actionResults: Simple report < 4');
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
    if (__DEV__) console.log('actionResults: New file, 4 or 5');

    downloadURL = result[0].url_to_s3_crypto_pdf;

    var filename = result[0].url_to_s3_crypto_pdf;

    //asking for trouble down the road...
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

      if (__DEV__) console.log(`actionResults: Most recent remote file or result is: ${latestDBResultTime}`)
      if (__DEV__) console.log(`actionResults: Timestamp of (potential) file on phone: ${localResultTime}`)
      if (__DEV__) console.log(`actionResults: Do timestamps match?`,localResultTime === latestDBResultTime)

      if( result[0].r_state > 5 && (localResultTime != latestDBResultTime) ) {
        //we already _should_ have a copy of the most recent results locally
        if (__DEV__) console.log(`actionResults: there is a newer result but it's already been downloaded`);
        if (__DEV__) console.log(`actionResults: this sometimes happens in testing but should not happen in production`);
        if (__DEV__) console.log(`actionResults: need to fix in the backend`);
        if (__DEV__) console.log(`actionResults: r_state 8 - result already downloaded`);
        //if (__DEV__) console.log(`actionResults: circulateLocalResults`);
        //dispatch(circulateLocalResults(localResult));
      } else if( (localResultTime === latestDBResultTime) ) {
        //we already have a copy of the most recent results locally
        //BUT r_state != 8
        //this is a strange case that will only happen during debug operations 
        if (__DEV__) console.log(`actionResults: Local copy is current`);
        //if (__DEV__) console.log(`actionResults: circulateLocalResults`);
        //dispatch(circulateLocalResults(localResult));
      } else {
        //there is a more recent file and we have not yet downloaded it
        //we need to update the local results
        if (__DEV__) console.log(`actionResults: Need to UPDATE local results`);
        //if (__DEV__) console.log('actionResults: Updating localResult to:', newLocalResult)
        SecureStore.setItemAsync('ENYA_RESULT', JSON.stringify(newLocalResult));
        if((newLocalResult.r_state === 4) || (newLocalResult.r_state === 5)) {
          if (__DEV__) console.log('actionResults: Downloading file')
          FileSystem.downloadAsync( 
            downloadURL,
            newLocalResult.ENresultPDF,
          ).then(({ uri }) => {
            if (__DEV__) console.log('actionResults: Finished downloading to', uri);
              //we do not want to dispatch this message before the download is done - 
              //can lead to a bug in decrypt
              //if (__DEV__) console.log(`actionResults: circulateLocalResults after file downloaded`);
              //dispatch(circulateLocalResults(newLocalResult));
              //let the server know we have this file or result
              //dispatch(setResultDownloadFlag(uuid, newLocalResult.id));
          });
        } else {
          if (__DEV__) console.log(`actionResults: circulateLocalResults`);
            //dispatch(circulateLocalResults(newLocalResult));
            //let the server know we have this file or result
            //dispatch(setResultDownloadFlag(uuid, newLocalResult.id));
        }
      } //closes else

    } //if (resultL) {
    else //no previous local result
    {

    }
  })

}

//}


/*
            if (__DEV__) console.log('actionResults: No local keys/results found.')
            
            if ( result[0].r_state > 5 ) {
              //possible attack or double install
              //do not do anything
              //this should not happen in normal usage since for 
              //every r_state 8 there should be a local file
              if (__DEV__) console.log('getResults - security alert')
              dispatch(getResultsFailure({error_type : 'security_alert'}));
            }
            else {

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

              if (__DEV__) console.log(`actionResults: Need to CREATE local results`);
              SecureStore.setItemAsync(SECURE_STORAGE_RESULT, JSON.stringify(newLocalResult));

              if((newLocalResult.r_state === 4) || (newLocalResult.r_state === 5)) {
                if (__DEV__) console.log('actionResults: Downloading file')
                FileSystem.downloadAsync( 
                  downloadURL,
                  newLocalResult.ENresultPDF,
                ).then(({ uri }) => {
                  if (__DEV__) console.log('actionResults: Finished downloading to', uri);
                  //we do not want to dispatch this message before the download is done - 
                  //can lead to a bug in decrypt
                  if (__DEV__) console.log(`actionResults: circulateLocalResults after file downloaded`);
                  dispatch(circulateLocalResults(newLocalResult));
                  //dispatch(setResultDownloadFlag(uuid, newLocalResult.id));
                });
              } else {
                if (__DEV__) console.log(`actionResults: circulateLocalResults non-file`);
                dispatch(circulateLocalResults(newLocalResult));
                //dispatch(setResultDownloadFlag(uuid, newLocalResult.id));
              };
            }
           }
         }
        );
*/