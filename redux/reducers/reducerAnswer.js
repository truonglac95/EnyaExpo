import {
	GET_ANSWERS,
	GET_ANSWERS_SUCCESS,
	GET_ANSWERS_FAILURE,
	GIVE_ANSWER,
	GIVE_ANSWER_SUCCESS,
	GIVE_ANSWER_FAILURE,
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
		default:
			return state;
	}
}
