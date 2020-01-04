import {
	GET_RESULTS,
	GET_RESULTS_SUCCESS,
	GET_RESULTS_FAILURE,
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
		default:
			return state;
	}
}
