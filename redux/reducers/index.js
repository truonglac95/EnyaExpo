import { combineReducers } from 'redux';
import { user } from './reducerUser';
import { answer } from './reducerAnswers';
import { result } from './reducerResults';
import { whitelist } from './reducerWhitelist';

const reducers = {
	user,
	answer,
	result,
  whitelist,
};

const appReducer = combineReducers(reducers);

const resetState = {
  user: {
    error: null,
    loading: false,
    deleted: true,
    unreadCount: 0,
    account: {
      loading: false, 
    },
    loginToken: null,
    internet: [],
    sharingState: {
      error: null,
      loading: false,
    },
    preportState: {
      error: null,
      loading: false,
    },
  },
  answer: {
    error: null,
    loading: false,
    answers: [],
    frs: [],
  },
  result: {
    error: null,
    loading: false,
    results: [],
    localResult: [],
    pleaseDownload: false,
  },
  whitelist: {
    error: null,
    loading: false,
    status: 0,
  },
}

const rootReducer = (state, action) => {
  if (action.type === 'RESET_APP') {
    state = resetState;
  }
  return appReducer(state, action);
}

export default rootReducer;