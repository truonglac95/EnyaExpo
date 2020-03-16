import {
	FHE_KEYGEN_PROGRESS,
} from '../constants';

import initialState from '../initialState';
const INITIAL_STATE = initialState.fhe;

export function fhe(state = INITIAL_STATE, action = {}) {

	switch(action.type) {
		case FHE_KEYGEN_PROGRESS:
			return {
				...state,
				progress: { ...action.payload }
			}
		default:
			return state;
	}
	}