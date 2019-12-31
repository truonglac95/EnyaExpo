import { API_URL } from '../../settings';

import {
	GET_RESULTS,
	GET_RESULTS_SUCCESS,
	GET_RESULTS_FAILURE,
	CIRCULATE_LOCAL_RESULTS,
} from '../constants';

import { Enya_GetResult } from '../../EnyaSDK/SecureResult';

export const getResultsBegin   = data  => ({ type: GET_RESULTS });
export const getResultsSuccess = data  => ({ type: GET_RESULTS_SUCCESS });
export const getResultsFailure = error => ({ type: GET_RESULTS_FAILURE, payload: error });

export const circulateLocalResults = data => ({ type: CIRCULATE_LOCAL_RESULTS, payload: data });

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
		return res.json()
	})
	.then(result => {

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
        		Enya_GetResult(result).then(flag => {
          			//console.log('Enya_Result( result ).then(flag => {')
          			//console.log(flag)
          			if(flag == 'downloaded'){
            			console.log('getResultsSuccess()')
            			dispatch(getResultsSuccess());
          			} else {
            			dispatch(getResultsFailure({error_type : 'download failure'}));
          			}
        		})
			}
		}
	})
	.catch((err) => {
		if (__DEV__) console.log('getResults - probable network error:', err)
		dispatch(getResultsFailure({error_type : 'network_request_failed'}));
	});

}
