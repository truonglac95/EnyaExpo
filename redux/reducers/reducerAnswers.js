import {
	GET_ANSWERS,
	GET_ANSWERS_SUCCESS,
	GET_ANSWERS_FAILURE,
	GIVE_ANSWER,
	GIVE_ANSWER_SUCCESS,
	GIVE_ANSWER_FAILURE,
	GET_FRS_SUCCESS,
	CALCULATE_RISK_SCORE,
	CALCULATE_RISK_SCORE_SUCCESS,
	CALCULATE_RISK_SCORE_FAILURE,
	CALCULATE_RISK_SCORE_PROGRESS,
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
		case GET_FRS_SUCCESS:
			return {
				...state,
				loading: false,
				error: null,
				frs: action.payload,
			}
		case CALCULATE_RISK_SCORE:
			return {
				...state,
				loading: true,
				error: null,
			}
		case CALCULATE_RISK_SCORE_SUCCESS:
			return {
				...state,
				loading: false,
				error: null,
				frs: action.payload,
			}
		case CALCULATE_RISK_SCORE_FAILURE:
			return {
				...state,
				loading: false,
				error: action.payload,
			}
		case CALCULATE_RISK_SCORE_PROGRESS:
			return {
				...state,
				FRScompute_progress: action.payload.FRScompute_progress,
				FRScomputing: action.payload.FRScomputing,
			}
		default:
			return state;
	}
}
