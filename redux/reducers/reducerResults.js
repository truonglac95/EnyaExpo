import {
	GET_RESULTS,
	GET_RESULTS_SUCCESS,
	GET_RESULTS_FAILURE,
	CIRCULATE_LOCAL_RESULTS,
} from '../constants';

import initialState from '../initialState';
const INITIAL_STATE = initialState.result;

export function result(state = INITIAL_STATE, action = {}) {

	switch(action.type) {

		case GET_RESULTS:
			return {
				...state,
				loading: true,
				error: null,
			}
		case GET_RESULTS_SUCCESS:
			return {
				...state,
				loading: false,
				downloaded: true
			}
		case GET_RESULTS_FAILURE:
			return {
				...state,
				loading: false,
				error: action.payload,
			}
		case CIRCULATE_LOCAL_RESULTS:
			return {
				...state,
				loading: false,
				localResult: action.payload,
			}
		default:
			return state;
	}
}
