import {
	SET_ACCOUNT,
	USER_SIGNIN_SUCCESS,
	USER_SIGN_OUT,
	USER_WIPE_ACCOUNT,
	USER_RESET_ERROR,
	USER_WIPE_PROPS,
} from '../constants';

import initialState from '../initialState';
const INITIAL_STATE = initialState.user;

export function user(state = INITIAL_STATE, action = {}) {
	
	switch(action.type) {
		case SET_ACCOUNT:
			return {
				...state,
				account: {
					loading: false,
					...action.payload,
				},
			}
		case USER_RESET_ERROR:
			return {
				...state,
				error: null,
				deleted: false,
			}
		case USER_SIGNIN_SUCCESS:
			return {
				...state,
				data: {
					loading: false,
					error: null,
					...action.payload,
				},
			}
		case USER_SIGN_OUT:
			return {
				...state,
				loginToken: null,
				loading: false,
				error: null,
				account: {
					...action.payload
				},
			}
		case USER_WIPE_PROPS:
			return {
				...state,
				loading: false,
				error: null,
				deleted: true,
				account: {
					loading: false,
				},
			}
		default:
			return state;
	}
}
