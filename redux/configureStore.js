import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import appReducer from './reducers';
import initialState from './initialState';

const store = createStore(appReducer, initialState, applyMiddleware(thunk));

export default store;
