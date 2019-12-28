import {
	GET_ANSWERS,
	GET_ANSWERS_SUCCESS,
	GET_ANSWERS_FAILURE,
	GIVE_ANSWER,
	GIVE_ANSWER_SUCCESS,
	GIVE_ANSWER_FAILURE,
	GET_SMC_SUCCESS,
	CALCULATE_SMC,
	CALCULATE_SMC_SUCCESS,
	CALCULATE_SMC_FAILURE,
	CALCULATE_SMC_PROGRESS,
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
		    //if (__DEV__) console.log('circulating local answers:', action.payload)
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
		    //if (__DEV__) console.log('GIVE_ANSWER_SUCCESS')
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
				SMC: action.payload,
			}
		case CALCULATE_SMC:
			return {
				...state,
				loading: true,
				error: null,
			}
		case CALCULATE_SMC_SUCCESS:
			return {
				...state,
				loading: false,
				error: null,
				SMC: action.payload,
			}
		case CALCULATE_SMC_FAILURE:
			return {
				...state,
				loading: false,
				error: action.payload,
			}
		case CALCULATE_SMC_PROGRESS:
			return {
				...state,
				SMC_compute_progress: action.payload.SMC_compute_progress,
				SMC_computing: action.payload.SMC_computing,
			}
		default:
			return state;
	}
}
