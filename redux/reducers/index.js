import { combineReducers } from 'redux';
import { user } from './reducerUser';
import { answer } from './reducerAnswers';

const reducers = {
	user,
	answer
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
  }
}

const rootReducer = (state, action) => {
  if (action.type === 'RESET_APP') {
    state = resetState;
  }
  return appReducer(state, action);
}

export default rootReducer;