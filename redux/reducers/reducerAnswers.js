import {
	GET_ANSWERS,
	GET_ANSWERS_SUCCESS,
	GET_ANSWERS_FAILURE,
	GIVE_ANSWER,
	GIVE_ANSWER_SUCCESS,
	GIVE_ANSWER_FAILURE,
	GET_SMC_SUCCESS,
	SECURE_COMPUTE,
	SECURE_COMPUTE_SUCCESS,
	SECURE_COMPUTE_FAILURE,
	SECURE_COMPUTE_PROGRESS,
} from '../constants';

import initialState from '../initialState';
const INITIAL_STATE = initialState.answer;

export function answer(state = INITIAL_STATE, action = {}) {
	
	switch(action.type) {
		case GET_ANSWERS:
			return {
				...state,
				loading: true,
				error: null,
			}
		case GET_ANSWERS_SUCCESS:
			return {
				...state,
				loading: false,
				error: null,
				answers: action.payload,
			}
		case GET_ANSWERS_FAILURE:
			return {
				...state,
				loading: false,
				error: action.payload,
			}
		case GIVE_ANSWER:
			return {
				...state,
				loading: true,
				error: null,
			}
		case GIVE_ANSWER_SUCCESS:
			return {
				...state,
				loading: false,
				error: null,
				answers: action.payload,
			}
		case GIVE_ANSWER_FAILURE:
			return {
				...state,
				loading: false,
				error: action.payload,
			}
		case GET_SMC_SUCCESS:
			return {
				...state,
				loading: false,
				error: null,
				smc: action.payload,
			}
		case SECURE_COMPUTE:
			return {
				...state,
				loading: true,
				error: null,
			}
		case SECURE_COMPUTE_SUCCESS:
			return {
				...state,
				loading: false,
				error: null,
				smc: action.payload,
			}
		case SECURE_COMPUTE_FAILURE:
			return {
				...state,
				loading: false,
				error: action.payload,
			}
		case SECURE_COMPUTE_PROGRESS:
			return {
				...state,
				SMC_compute_progress: action.payload.SMC_compute_progress,
				SMC_computing: action.payload.SMC_computing,
			}
		default:
			return state;
	}
}
