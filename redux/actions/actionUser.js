import {
	RESET_APP,
	SET_ACCOUNT,
	USER_RESET_ERROR,
	USER_SIGNIN_SUCCESS,
	USER_SIGN_OUT,
	SECURE_STORAGE_ACCOUNT,
	SECURE_STORAGE_ANSWERS,
	SECURE_STORAGE_SMC
} from '../constants';

import * as EnyaDeliver from 'enyadeliver';

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

	SecureStore.deleteItemAsync(SECURE_STORAGE_ACCOUNT).then(() => {}).catch(() => {});
	SecureStore.deleteItemAsync(SECURE_STORAGE_ANSWERS).then(() => {}).catch(() => {});
	SecureStore.deleteItemAsync(SECURE_STORAGE_SMC).then(() => {}).catch(() => {});
	EnyaDeliver.BurnEverything();

    if (__DEV__) console.log('Cleared Secure Storage...')

	dispatch(resetApp());

}
