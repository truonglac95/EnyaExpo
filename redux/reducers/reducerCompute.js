import {
	SECURE_COMPUTE,
	SECURE_COMPUTE_SMC,
	SECURE_COMPUTE_SUCCESS,
	SECURE_COMPUTE_FAILURE,
	SECURE_COMPUTE_PROGRESS,
	SECURE_COMPUTE_INVALIDATE
} from '../constants';

import initialState from '../initialState';
const INITIAL_STATE = initialState.compute;

export function compute(state = INITIAL_STATE, action = {}) {
	
	switch(action.type) {
		case SECURE_COMPUTE:
			return {
				...state,
				error: null,
				current: false
			}
		case SECURE_COMPUTE_SMC:
			return {
				...state,
				error: null,
				current: false
			}
		case SECURE_COMPUTE_INVALIDATE:
			return {
				...state,
				current: false
			}
		case SECURE_COMPUTE_PROGRESS:
			return {
				...state,
				...action.payload
			}
		case SECURE_COMPUTE_SUCCESS:
			return {
				...state,
				error: null,
				current: true,
				...action.payload
			}
		case SECURE_COMPUTE_FAILURE:
			return {
				...state,
				loading: false,
				current: false,
				error: action.payload,
			}
		default:
			return state;
	}
}
