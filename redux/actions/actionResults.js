import { API_URL } from '../../settings';

import {
	GET_RESULTS,
	GET_RESULTS_SUCCESS,
	GET_RESULTS_FAILURE,
	CIRCULATE_LOCAL_RESULTS,
} from '../constants';

import * as SecureStore from 'expo-secure-store';
import { SECURE_STORAGE_RESULT } from '../constants';
import * as FileSystem from 'expo-file-system';
const pdfStore = `${FileSystem.documentDirectory}User/PDFs`;
var ENresultPDF = ``;

import { Enya_Result } from '../../EnyaSDK/Result';

export const getResultsBegin   = data  => ({ type: GET_RESULTS });
export const getResultsSuccess = data  => ({ type: GET_RESULTS_SUCCESS, payload: data });
export const getResultsFailure = error => ({ type: GET_RESULTS_FAILURE, payload: error });

export const circulateLocalResults = data => ({ type: CIRCULATE_LOCAL_RESULTS, payload: data });

function getTimestamps(value, index, array) { 
  //this is the upload time - set by the code when file is uploaded
  var unix_time = parseInt(array[index].unix_time);
	return [index, unix_time]; 
};

export const getResults = (uuid) => (dispatch) => {

	dispatch(getResultsBegin());

	if (__DEV__) console.log('REDUX: Getting result from database for UUID:', uuid)

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
	.then(result => {

    //for testing 
    //SecureStore.deleteItemAsync(SECURE_STORAGE_RESULT).then(() => {}).catch(() => {});

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

        //Send the result to Enya
        Enya_Result( result )

        //outdated / need to change once the above is done
		    //dispatch(getResultsSuccess({ results : result }));
			    
			} else {
				//yes we got to the server but no results for me...
				//no point trying to download anything, or updating local results 
				//outdated / need to change once the above is done
				//dispatch(getResultsSuccess({ results : result }));
			}

		//} else {
			//how is this case triggered?
		//	if (__DEV__) console.log('getResultsFailure(result.error) 322:', result)
		//	dispatch(getResultsFailure(result.error));
		//}
	}
})
	.catch((err) => {
		if (__DEV__) console.log('getResults - probable network error 327:', err)
		dispatch(getResultsFailure({error_type : 'network_request_failed'}));
	});

}
