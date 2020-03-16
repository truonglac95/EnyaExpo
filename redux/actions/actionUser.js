import {
	RESET_APP,
	SET_ACCOUNT,
	USER_RESET_ERROR,
	USER_SIGNIN_SUCCESS,
	USER_SIGN_OUT,
	SECURE_STORAGE_ACCOUNT,
	SECURE_STORAGE_ANSWERS,
	SECURE_STORAGE_SC
} from '../constants';

import * as SecureStore from 'expo-secure-store'
import { AsyncStorage } from 'react-native';

export const setAccount = data => ({
	type: SET_ACCOUNT,
	payload: data,
});

export const resetApp = () => ({
	type: RESET_APP,
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
	SecureStore.deleteItemAsync(SECURE_STORAGE_SC).then(() => {}).catch(() => {});
	
	AsyncStorage.clear().then(() => {}).catch(() => {});

	if (__DEV__) console.log('Cleared Secure Storage...')

	dispatch(resetApp());

}
