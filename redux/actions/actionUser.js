import {
	SET_ACCOUNT,
	USER_SIGNIN_SUCCESS,
	USER_SIGN_OUT,
	RESET_APP,
	USER_RESET_ERROR,
	SECURE_STORAGE_USER_ACCOUNT,
	SECURE_STORAGE_ANSWERS,
	SECURE_STORAGE_FRS,
	SECURE_STORAGE_USER_FLOW,
	SECURE_STORAGE_USER_RESULT,
	USER_SIGN_UP,
	USER_SIGN_UP_SUCCESS,
	USER_SIGN_UP_FAILURE,
	UPDATE_USER,
	UPDATE_USER_SUCCESS,
	UPDATE_USER_FAILURE,
} from '../constants';

import { API_URL } from '../../settings';
import * as SecureStore from 'expo-secure-store'

export const resetApp = () => ({
	type: RESET_APP,
});

export const setAccount = data => ({
	type: SET_ACCOUNT,
	payload: data,
});

export const resetError = data => ({
	type: USER_RESET_ERROR,
});

export const signinSuccess = data => ({
	type: USER_SIGNIN_SUCCESS,
	payload: data,
});

export const signOut = data => ({
	type: USER_SIGN_OUT,
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
