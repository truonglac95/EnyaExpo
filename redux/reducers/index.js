import { combineReducers } from 'redux';
import { user } from './reducerUser';
import { answer } from './reducerAnswers';
import { result } from './reducerResults';

const reducers = {
	user,
	answer,
	result,
};

const appReducer = combineReducers(reducers);

const resetState = {
  user: {
    error: null,
    loading: false,
    deleted: true,
    account: {
      loading: false, 
    }
  },
  answer: {
    error: null,
    loading: false,
    answers: [],
    smc: []
  },
  result: {
    error: null,
    loading: false,
    results: [],
    localResult: [],
    pleaseDownload: false
  }
}

const rootReducer = (state, action) => {
  if (action.type === 'RESET_APP') {
    state = resetState;
  }
  return appReducer(state, action);
}

export default rootReducer;