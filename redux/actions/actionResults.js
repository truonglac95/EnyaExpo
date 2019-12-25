import { API_URL } from '../../settings';

import {
	GET_RESULTS,
	GET_RESULTS_SUCCESS,
	GET_RESULTS_FAILURE,
	UPDATE_RESULT_FLAG,
	UPDATE_RESULT_FLAG_SUCCESS,
	UPDATE_RESULT_FLAG_FAILURE,
	CIRCULATE_LOCAL_RESULTS,
} from '../constants';

import * as SecureStore from 'expo-secure-store';
import { SECURE_STORAGE_USER_RESULT } from '../constants';
import * as FileSystem from 'expo-file-system';

import { updateRiskLabel, giveAnswer } from './actionAnswers';

//files
const pdfStore = `${FileSystem.documentDirectory}User/PDFs`;
var ENresultPDF = ``;

//if (__DEV__) console.log('Save file as:');
//if (__DEV__) console.log(ENresultPDF);
//if (__DEV__) console.log(FileSystem.documentDirectory);

export const getResultsBegin     = data  => ({ type: GET_RESULTS });
export const getResultsSuccess   = data  => ({ type: GET_RESULTS_SUCCESS, payload: data });
export const getResultsFailure   = error => ({ type: GET_RESULTS_FAILURE, payload: error });

export const updateResultFlagBegin   = data  => ({ type: UPDATE_RESULT_FLAG });
export const updateResultFlagSuccess = data  => ({ type: UPDATE_RESULT_FLAG_SUCCESS, payload: data });
export const updateResultFlagFailure = error => ({ type: UPDATE_RESULT_FLAF_FAILURE, payload: error });

export const circulateLocalResults = data => ({ type: CIRCULATE_LOCAL_RESULTS, payload: data });

function getTimestamps(value, index, array) { 
  //this is the upload time - set by the code when file is uploaded
  //not related to file name
  var unix_time = parseInt(array[index].unix_time);
	return [index, unix_time]; 

};

export const getResults = (uuid) => (dispatch) => {

	dispatch(getResultsBegin());

	if (__DEV__) console.log('REDUX: Getting result from BD database for UUID:', uuid)

	fetch(`${API_URL}/results/${uuid}`, {
		method: 'GET',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		},
	})
	.then((res) => {
    //if the server has a major issue, the .json will fail and we will get unhandled promise
		return res.json()
	})
/*
right here we need to deal with many failure conditions
server not found
timeout
access blocked 
etc. 
*/
	.then(result => {

		//if (__DEV__) console.log('REDUX: Here is what the server said:', result)
		//can reach server but no entry: Array []

    //for testing 
    //SecureStore.deleteItemAsync(SECURE_STORAGE_USER_RESULT).then(() => {}).catch(() => {});

    var newLocalResult = {};
    var downloadURL = '';

		if (!result.error) {

			if (result.length === 0) {
      		if (__DEV__) console.log('ResultsDownload: No results')
    	} else if (result.length === 1) {
      		if (__DEV__) console.log('ResultsDownload: Found one result at DB')
    	} else if (result.length > 1){
      		if (__DEV__) console.log(`ResultsDownload: Found ${result.length} results at DB`)
    	}

      //which one is most current?
      if (result.length > 0) {

    		var timestamps = result.map(getTimestamps);

    		var latest = 0;
    		var latestIndex = 0;

    		timestamps.forEach(element => {
      		if(element[1] > latest) {
        		latestIndex = element[0];
        		latest = element[1];
      		}
    		});

    		if (__DEV__) console.log(`ResultsDownload: Most recent file/status is ${latest} at idx ${latestIndex}`);

    		result[latestIndex].haveDNA = true;
    		result[latestIndex].unix_time = parseInt(result[latestIndex].unix_time);
			    
        // pick out the most current one
			  result = [result[latestIndex]];

			  //compute local results array
			  if( result[0].report_type > 5 ) {
          if (__DEV__) console.log('actionResults: Case 8');
          //case 8
    			newLocalResult = {};
    		} 
        else if( result[0].report_type < 4 ) {
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
            gene_rr: result[0].gene_rr,
            lab_bp: result[0].lab_bp,
            lab_cho: result[0].lab_cho,
            lab_hdl: result[0].lab_hdl,
            lab_bp_history: result[0].lab_bp_history,
            lab_cho_history: result[0].lab_cho_history,
            lab_hdl_history: result[0].lab_hdl_history,
    			};

          //ok we just got new gene_rr data - need to update various labels
          if(newLocalResult.gene_rr > 0) {
            //if we have an FRS, then we have all the answers, too,
            //then recompute the risk labels
            if (__DEV__) console.log('actionResults: Updating Risk Labels because we might have new gene_rr values')
            dispatch(updateRiskLabel(newLocalResult.gene_rr));
          }

    		} //closes rstate 4 or 5

				//now let's see if we have a local result
				SecureStore.getItemAsync(SECURE_STORAGE_USER_RESULT).then(resultL => {
        	
          if (__DEV__) console.log('actionResults: Local keys/results check.')
        	
          //if (__DEV__) console.log(result);
        	if (resultL) {
          				
          	if (__DEV__) console.log('actionResults: Local keys/results found.')
          	
            const localResult = resultL ? JSON.parse(resultL) : {};
            
            //if (__DEV__) console.log('actionResults: Local result:')
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
              if (__DEV__) console.log(`actionResults: circulateLocalResults`);
          		dispatch(circulateLocalResults(localResult));
            } else if( (localResultTime === latestDBResultTime) ) {
              //we already have a copy of the most recent results locally
              //BUT r_state != 8
              //this is a strange case that will only happen during debug operations 
              if (__DEV__) console.log(`actionResults: Local copy is current`);
              if (__DEV__) console.log(`actionResults: circulateLocalResults`);
              dispatch(circulateLocalResults(localResult));
            } else {
              //there is a more recent file and we have not yet downloaded it
              //we need to update the local results
          		if (__DEV__) console.log(`actionResults: Need to UPDATE local results`);
          		//if (__DEV__) console.log('actionResults: Updating localResult to:', newLocalResult)
      				SecureStore.setItemAsync(SECURE_STORAGE_USER_RESULT, JSON.stringify(newLocalResult));

              if(newLocalResult.lab_cho > 0) {
                let newAnswer = [
                  { question_id : 'cholesterol', answer : newLocalResult.lab_cho },
                  { question_id : 'bloodpressure', answer : newLocalResult.lab_bp },
                  { question_id : 'hdlc', answer : newLocalResult.lab_hdl },
                ];
                dispatch(giveAnswer(newAnswer));
              }

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
                  //let the server know we have this file or result
                  dispatch(setResultDownloadFlag(uuid, newLocalResult.id));
                });
              } else {
                if (__DEV__) console.log(`actionResults: circulateLocalResults`);
                dispatch(circulateLocalResults(newLocalResult));
                //let the server know we have this file or result
                dispatch(setResultDownloadFlag(uuid, newLocalResult.id));
              }

      			}

        	} else {

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
              //if (__DEV__) console.log('actionResults: Creating localResult:', newLocalResult)
              SecureStore.setItemAsync(SECURE_STORAGE_USER_RESULT, JSON.stringify(newLocalResult));

              if(newLocalResult.lab_cho > 0) {
                let newAnswer = [
                  { question_id : 'cholesterol', answer : newLocalResult.lab_cho },
                  { question_id : 'bloodpressure', answer : newLocalResult.lab_bp },
                  { question_id : 'hdlc', answer : newLocalResult.lab_hdl }
                ];
                dispatch(giveAnswer(newAnswer));
              }

              if((newLocalResult.r_state === 4) || (newLocalResult.r_state === 5)) {
                if (__DEV__) console.log('actionResults: Downloading file')
                FileSystem.downloadAsync( 
                  downloadURL, //newLocalResult.url,
                  newLocalResult.ENresultPDF,
                ).then(({ uri }) => {
                  if (__DEV__) console.log('actionResults: Finished downloading to', uri);
                  //we do not want to dispatch this message before the download is done - 
                  //can lead to a bug in decrypt
                  if (__DEV__) console.log(`actionResults: circulateLocalResults after file downloaded`);
                  dispatch(circulateLocalResults(newLocalResult));
                  dispatch(setResultDownloadFlag(uuid, newLocalResult.id));
                });
              } else {
                if (__DEV__) console.log(`actionResults: circulateLocalResults non-file`);
                dispatch(circulateLocalResults(newLocalResult));
                dispatch(setResultDownloadFlag(uuid, newLocalResult.id));
              };
            }
        	 }
      	 }
        );

        //outdated / need to change once the above is done
		    dispatch(getResultsSuccess({ results : result }));
			    
			} else {
				//yes we got to the server but no results for me...
				//no point trying to download anything, or updating local results 
				//outdated / need to change once the above is done
				dispatch(getResultsSuccess({ results : result }));
			}

		} else {
			//no idea when this triggers????
			if (__DEV__) console.log('getResultsFailure(result.error) 322:', result)
			dispatch(getResultsFailure(result.error));
		}
	})
	.catch((err) => {
		if (__DEV__) console.log('getResults - probable network error 327:', err)
		dispatch(getResultsFailure({error_type : 'network_request_failed'}));
    //handle error
	});

}

//this changes the r_state to indicate download
//ids is the result id
export const setResultDownloadFlag = (uuid, id) => (dispatch) => {
	
  //if (__DEV__) console.log('setResultDownloadFlag: obtained this result')
  //if (__DEV__) console.log('setResultDownloadFlag: setting flag to zero')
  //if (__DEV__) console.log(uuid)
  //if (__DEV__) console.log(id)

	dispatch(updateResultFlagBegin());

	fetch(`${API_URL}/results/${uuid}`, {
		method: 'PUT',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			id,
		}),
	})
	.then(res => res.json()
  )
	.then(data => {
		//if (__DEV__) console.log('Here is what the server said - update:', data)
		if (!data.error) {
			dispatch(updateResultFlagSuccess({id}));
		} else {
			dispatch(updateResultFlagFailure(data.error));
		}
	})
	.catch((err) => {
		if (__DEV__) console.log('setResultDownloadFlag - probable network error')
		if (__DEV__) console.log(err)
    //handle error
    //humm
    //I guess we are not handling any errors
	});
}
