import { combineReducers } from 'redux';

import { user } from './reducerUser';
import { answer } from './reducerAnswer';
import { compute } from './reducerCompute';
import { fhe } from './reducerFHEKeyGen';

const reducers = {
	user,
	answer,
  compute,
  fhe
};

const appReducer = combineReducers(reducers);

const resetState = {
  user: {
    error: null,
    loading: false,
    deleted: true,
    account: []
  },
  answer: {
    error: null,
    loading: false,
    answers: []
  },
  compute: {
    error: null,
    result: 0.0,
    resultCurrent: false,
    haveSC: false,
    progress: 0,
    computing: false, 
  },
  fhe: {
    error: null,
    loading: false,
    progress: []
  }
}

const rootReducer = (state, action) => {
  if (action.type === 'RESET_APP') {
    state = resetState;
  }
  return appReducer(state, action);
}

export default rootReducer;