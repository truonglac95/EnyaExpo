import {
	SET_ACCOUNT,
	USER_SIGNIN_TOKEN_GEN,
	USER_SIGNIN_SUCCESS,
	USER_SIGN_OUT,
	USER_WIPE_ACCOUNT,
	USER_RESET_ERROR,
	USER_WIPE_PROPS,
	SET_UNREAD_COUNT,
	RECEIVE_NOTIFICATION,
	INTERNET_STATUS,
	GET_SHARING_STATE,
	GET_SHARING_STATE_SUCCESS,
	GET_SHARING_STATE_FAILURE,
	GET_PREPORT_STATE,
	GET_PREPORT_STATE_SUCCESS,
	GET_PREPORT_STATE_FAILURE,
	SB_CONNECTED,
} from '../constants';

import initialState from '../initialState';
const INITIAL_STATE = initialState.user;

export function user(state = INITIAL_STATE, action = {}) {
	
	switch(action.type) {
		case SB_CONNECTED:
			return {
				...state,
				sbConnected: true,
			}
		case SET_ACCOUNT:
			return {
				...state,
				account: {
					loading: false,
					...action.payload,
				},
			}
		case SET_UNREAD_COUNT:
			return {
				...state,
				unreadCount: action.payload,
			}
		case USER_RESET_ERROR:
			return {
				...state,
				error: null,
				forgotPasswordError: null,
				changePasswordError: null,
				deleted: false,
			}
		case USER_SIGNIN_TOKEN_GEN:
			return {
				...state,
				loginToken: {
					...action.payload,
				},
			}
		case INTERNET_STATUS:
			return {
				...state,
				internet: action.payload,
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
				loginToken: null,
				loading: false,
				error: null,
				deleted: true,
				account: {
					loading: false,
				},
				sbConnected: false,
			}
		case RECEIVE_NOTIFICATION:
			return {
				...state,
				notificationCount: action.payload || 0,
			}
		case GET_SHARING_STATE:
			return {
				...state,
				sharingState: {
					loading: true,
					error: null,
				},
			}
		case GET_SHARING_STATE_SUCCESS:
			return {
				...state,
				sharingState: {
					loading: true,
					error: null,
					data: action.payload.sharing_state,
				},
			}
		case GET_SHARING_STATE_FAILURE:
			return {
				...state,
				sharingState: {
					loading: true,
					error: action.payload,
				},
			}
		case GET_PREPORT_STATE:
			return {
				...state,
				preportState: {
					loading: true,
					error: null,
				},
			}
		case GET_PREPORT_STATE_SUCCESS:
			return {
				...state,
				preportState: {
					loading: true,
					error: null,
					data: action.payload.preport_state,
				},
			}
		case GET_PREPORT_STATE_FAILURE:
			return {
				...state,
				preportState: {
					loading: true,
					error: action.payload,
				},
			}
		default:
			return state;
	}
}
