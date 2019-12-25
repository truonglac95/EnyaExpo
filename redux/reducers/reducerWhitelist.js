import {
	GET_STATUS,
	GET_STATUS_SUCCESS,
	GET_STATUS_FAILURE,
	CIRCULATE_STATUS,
} from '../constants';

import initialState from '../initialState';
const INITIAL_STATE = initialState.user;

export function whitelist(state = INITIAL_STATE, action = {}) {
	
	switch(action.type) {
		case GET_STATUS:
			return {
				...state,
				loading: true,
				error: null,
			}
		case GET_STATUS_SUCCESS:
			return {
				...state,
				loading: false,
				error: null,
				status: action.payload.status,
			}
		case GET_STATUS_FAILURE:
			return {
				...state,
				loading: false,
				error: action.payload,
			}
		case CIRCULATE_STATUS:
			return {
				...state,
				loading: false,
				error: null,
				status: action.payload.status,
			}
		default:
			return state;
	}
}
