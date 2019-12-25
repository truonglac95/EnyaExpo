import {
	GET_STATUS,
	GET_STATUS_SUCCESS,
	GET_STATUS_FAILURE,
	CIRCULATE_STATUS,
	SECURE_STORAGE_USER_STATUS,
} from '../constants';

import { API_URL } from '../../settings';
import * as SecureStore from 'expo-secure-store';

export const circulateStatus = data => ({ 
	type: CIRCULATE_STATUS, 
	payload: data,
});

export const getStatusBegin = () => ({
	type: GET_STATUS,
});

export const getStatusSuccess = data => ({
	type: GET_STATUS_SUCCESS,
	payload: data,
});

export const getStatusFailure = data => ({
	type: GET_STATUS_FAILURE,
	payload: data,
});

export const getStatus = (uuid) => (dispatch) => {

	//if (__DEV__) console.log('Getting status:');

	dispatch(getStatusBegin());

	fetch(`${API_URL}/whitelists/${uuid}/status`, {
		method: 'GET',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		},
	})
	.then((res) => {
		//if (__DEV__) console.log(res);
		return res.json()
	})
	.then(data => {
		//if (__DEV__) console.log(data);
		if (!data.error) {
			
			SecureStore.setItemAsync(SECURE_STORAGE_USER_STATUS, 
				JSON.stringify({status: data.status})
			).then(() => {
				if (__DEV__) console.log("SUCCESS: SecureStore.setItemAsync(SECURE_STORAGE_USER_STATUS):");
				//if (__DEV__) console.log(res);
			}).catch(() => {
				if (__DEV__) console.log("ERROR: SecureStore.setItemAsync(SECURE_STORAGE_USER_STATUS):");
			});

			//SecureStore.deleteItemAsync(SECURE_STORAGE_FRS).then(() => {}).catch(() => {});

			if (__DEV__) console.log('getStatus: writing to local storage:',JSON.stringify({status: data.status}))
			dispatch(getStatusSuccess(data)); //this will circulate the value
			//functionally duplicates circulateStatus
		} else {
			dispatch(getStatusFailure(data.error));
		}
	})
}
