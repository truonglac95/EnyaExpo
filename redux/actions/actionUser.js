import {
	SET_ACCOUNT,
	USER_SIGNIN_SUCCESS,
	USER_SIGNIN_TOKEN_GEN,
	USER_SIGN_OUT,
	RESET_APP,
	USER_RESET_ERROR,
	RECEIVE_NOTIFICATION,
	SECURE_STORAGE_USER_ACCOUNT,
	SECURE_STORAGE_ANSWERS,
	SECURE_STORAGE_FRS,
	SECURE_STORAGE_USER_FLOW,
	SECURE_STORAGE_USER_RESULT,
	SET_UNREAD_COUNT,
	USER_SIGN_UP,
	USER_SIGN_UP_SUCCESS,
	USER_SIGN_UP_FAILURE,
	UPDATE_USER,
	UPDATE_USER_SUCCESS,
	UPDATE_USER_FAILURE,
	SHARE_DNA,
	SHARE_DNA_SUCCESS,
	SHARE_DNA_FAILURE,
	INTERNET_STATUS,
	GET_SHARING_STATE,
	GET_SHARING_STATE_SUCCESS,
	GET_SHARING_STATE_FAILURE,
	PREPORT,
	PREPORT_SUCCESS,
	PREPORT_FAILURE,
	GET_PREPORT_STATE,
	GET_PREPORT_STATE_SUCCESS,
	GET_PREPORT_STATE_FAILURE,
	SB_CONNECTED,
} from '../constants';

import { API_URL } from '../../settings';
import * as SecureStore from 'expo-secure-store'

export const resetApp = () => ({
	type: RESET_APP,
});

export const sbConnected = () => ({
	type: SB_CONNECTED,
});

export const setAccount = data => ({
	type: SET_ACCOUNT,
	payload: data,
});

export const setUnreadCount = count => ({
	type: SET_UNREAD_COUNT,
	payload: count,
});

export const resetError = data => ({
	type: USER_RESET_ERROR,
});

export const signinSuccess = data => ({
	type: USER_SIGNIN_SUCCESS,
	payload: data,
});

//good now
export const signinTokenGen = data => ({
	type: USER_SIGNIN_TOKEN_GEN,
	payload: data,
});

export const signOut = data => ({
	type: USER_SIGN_OUT,
	payload: data,
});

export const receiveNotification = data => ({
	type: RECEIVE_NOTIFICATION,
	payload: data,
});

export const burnEverything = () => (dispatch) => {

	if (__DEV__) console.log('Burning the account...')

    SecureStore.deleteItemAsync(SECURE_STORAGE_USER_FLOW).then(() => {}).catch(() => {});
	SecureStore.deleteItemAsync(SECURE_STORAGE_USER_ACCOUNT).then(() => {}).catch(() => {});
	SecureStore.deleteItemAsync(SECURE_STORAGE_ANSWERS).then(() => {}).catch(() => {});
	SecureStore.deleteItemAsync(SECURE_STORAGE_FRS).then(() => {}).catch(() => {});
	SecureStore.deleteItemAsync(SECURE_STORAGE_USER_RESULT).then(() => {}).catch(() => {});

    if (__DEV__) console.log('Cleared Secure Storage...')

	dispatch(resetApp());

}

export const signupUser_DB_Begin = () => ({
	type: USER_SIGN_UP,
});

export const signupUser_DB_Success = data => ({
	type: USER_SIGN_UP_SUCCESS,
	payload: data,
});

export const signupUser_DB_Failure = data => ({
	type: USER_SIGN_UP_FAILURE,
	payload: data,
});

export const signupUser_DB = (user) => (dispatch) => {
	
	if (__DEV__) console.log('signupUser_DB');
    //if (__DEV__) console.log(uuid);
    //if (__DEV__) console.log(user);

	dispatch(signupUser_DB_Begin());

	fetch(`${API_URL}/users/signup`, {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(user),
	})
	.then(res => res.json())
	.then(data => {
		//if (__DEV__) console.log('Here is what the server said - signup:', data)
		if (!data.error) {
			dispatch(signupUser_DB_Success(data));
		} else {
			dispatch(signupUser_DB_Failure(data.error));
		}
	})
}

export const updateUser_DB_Begin = () => ({
	type: UPDATE_USER,
});

export const updateUser_DB_Success = data => ({
	type: UPDATE_USER_SUCCESS,
	payload: data,
});

export const updateUser_DB_Failure = data => ({
	type: UPDATE_USER_FAILURE,
	payload: data,
});

export const updateUser_DB = (uuid, user) => (dispatch) => {
	
    if (__DEV__) console.log('updateUser_DB');
    //if (__DEV__) console.log(uuid);
    //if (__DEV__) console.log(user);

	dispatch(updateUser_DB_Begin());

	fetch(`${API_URL}/users/${uuid}`, {
		method: 'PUT',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(user),
	})
	.then(res => res.json())
	.then(data => {
		if (!data.error) {
			dispatch(updateUser_DB_Success(data));
		} else {
			dispatch(updateUser_DB_Failure(data.error));
		}
	})
}

export const internetStatus = data => ({
	type: INTERNET_STATUS,
	payload: data,
});

export const shareDNABegin = () => ({
	type: SHARE_DNA,
});

export const shareDNASuccess = data => ({
	type: SHARE_DNA_SUCCESS,
	payload: data,
});

export const shareDNAFailure = data => ({
	type: SHARE_DNA_FAILURE,
	payload: data,
});

export const shareDNA = (uuid, sharing_time) => (dispatch) => {
	
	if (__DEV__) console.log('shareDNA');
    //if (__DEV__) console.log(uuid);
    //if (__DEV__) console.log(sharing_time);

	dispatch(shareDNABegin());

    //if (__DEV__) console.log('JSON.stringify(share_dna_time)')
	//if (__DEV__) console.log(JSON.stringify(share_dna_time))

	fetch(`${API_URL}/users/${uuid}/share`, {
		method: 'PUT',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(sharing_time),
	})
	.then(res => res.json())
	//{
	//	if (__DEV__) console.log(res)
	//	if (__DEV__) console.log(res.json())
	//	res.json()
	//})
	.then(data => {
		if (!data.error) {
			dispatch(shareDNASuccess(data));
		} else {
			dispatch(shareDNAFailure(data.error));
		}
	})
}

export const getSharingStateBegin = () => ({
	type: GET_SHARING_STATE,
});

export const getSharingStateSuccess = data => ({
	type: GET_SHARING_STATE_SUCCESS,
	payload: data,
});

export const getSharingStateFailure = data => ({
	type: GET_SHARING_STATE_FAILURE,
	payload: data,
});

export const getSharingState = (uuid) => (dispatch) => {

	dispatch(getSharingStateBegin());

	fetch(`${API_URL}/users/${uuid}/sharing-state`, {
		method: 'GET',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		},
	})
	.then(res => res.json())
	.then(data => {
		if (!data.error) {
			dispatch(getSharingStateSuccess(data));
		} else {
			dispatch(getSharingStateFailure(data.error));
		}
	})
}

/*premium report*/
export const preportBegin = () => ({
	type: PREPORT,
});

export const preportSuccess = data => ({
	type: PREPORT_SUCCESS,
	payload: data,
});

export const preportFailure = data => ({
	type: PREPORT_FAILURE,
	payload: data,
});

export const preport = (uuid, preport_data) => (dispatch) => {
	
	if (__DEV__) console.log('preport');
    //if (__DEV__) console.log(uuid);
    //if (__DEV__) console.log(preport_data);

	dispatch(preportBegin());

    //if (__DEV__) console.log('JSON.stringify(share_dna_time)')
	//if (__DEV__) console.log(JSON.stringify(share_dna_time))

	fetch(`${API_URL}/users/${uuid}/preport`, {
		method: 'PUT',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(preport_data),
	})
	.then(res => res.json())
	//{
	//	if (__DEV__) console.log(res)
	//	if (__DEV__) console.log(res.json())
	//	res.json()
	//})
	.then(data => {
		if (!data.error) {
			dispatch(preportSuccess(data));
		} else {
			dispatch(preportFailure(data.error));
		}
	})
}

export const getPreportStateBegin = () => ({
	type: GET_PREPORT_STATE,
});

export const getPreportStateSuccess = data => ({
	type: GET_PREPORT_STATE_SUCCESS,
	payload: data,
});

export const getPreportStateFailure = data => ({
	type: GET_PREPORT_STATE_FAILURE,
	payload: data,
});

export const getPreportState = (uuid) => (dispatch) => {

	dispatch(getPreportStateBegin());

	fetch(`${API_URL}/users/${uuid}/preport-state`, {
		method: 'GET',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		},
	})
	.then(res => res.json())
	.then(data => {
		if (!data.error) {
			dispatch(getPreportStateSuccess(data));
		} else {
			dispatch(getPreportStateFailure(data.error));
		}
	})
}
