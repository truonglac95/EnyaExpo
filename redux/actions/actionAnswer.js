import {
  GET_ANSWERS,
  GET_ANSWERS_SUCCESS,
  GET_ANSWERS_FAILURE,
  GIVE_ANSWER,
  GIVE_ANSWER_SUCCESS,
  GIVE_ANSWER_FAILURE,
  SECURE_STORAGE_ANSWERS
} from '../constants';

import * as SecureStore from 'expo-secure-store'

export const getAnswersBegin   = data  => ({ type: GET_ANSWERS });
export const getAnswersSuccess = data  => ({ type: GET_ANSWERS_SUCCESS, payload: data });
export const getAnswersFailure = error => ({ type: GET_ANSWERS_FAILURE, payload: error });

export const giveAnswerBegin   = data  => ({ type: GIVE_ANSWER });
export const giveAnswerSuccess = data  => ({ type: GIVE_ANSWER_SUCCESS, payload: data });
export const giveAnswerFailure = error => ({ type: GIVE_ANSWER_FAILURE, payload: error });

const answers = {
  birthyear: 0,
  weight: 0,
  height: 0,
  country: 0,
  gender: 0,
  binary_1: 0,
  binary_2: 0,
  percentAnswered: 0.0,
  numberAnswered: 0,
  current: true
}

const NumGoodAnswers = function ( data ) {

  var ga = 0;
  
  if ( data.birthyear > 0 ) { ga += 1; }
  if ( data.gender > 0 ) { ga += 1; }
  if ( data.height > 0 ) { ga += 1; }
  if ( data.weight > 0 ) { ga += 1; }
  if ( data.binary_1 > 0 ) { ga += 1; }
  if ( data.binary_2 > 0 ) { ga += 1; }
  if ( data.country > 0 ) { ga += 1; }

  return ga;
}


export const getAnswers = () => (dispatch) => {

  dispatch(getAnswersBegin());

  SecureStore.getItemAsync(SECURE_STORAGE_ANSWERS).then(result => {
    if (result) {
      if (__DEV__) console.log('Answers: Previous answers found.');
        const data = JSON.parse(result);
        dispatch(getAnswersSuccess(data));
    } else {
      //create the file structure
      if (__DEV__) console.log('Answers: No previous answers found.');
      SecureStore.setItemAsync(SECURE_STORAGE_ANSWERS, JSON.stringify(answers));
    }
  }).catch(err => {
    if (__DEV__) console.log(err);
  });
}

export const giveAnswer = (answer) => (dispatch) => {

  dispatch(giveAnswerBegin());

  SecureStore.getItemAsync(SECURE_STORAGE_ANSWERS).then(result => {
    
    if (result) {

      let data = JSON.parse(result);

      answer.forEach(ans => {data[ans.question_id] = ans.answer});

      var current = false; //because we just received a new answer from the user

      var numberAnswered = NumGoodAnswers( data );

      var percentAnswered = 0;

      if( numberAnswered > 0 ) {
        percentAnswered = Math.round((numberAnswered / 7.0) * 100);
      }

      let updatedData = { 
        ...data,
        percentAnswered,
        numberAnswered,
        current
      };

      dispatch( giveAnswerSuccess(updatedData) );

      SecureStore.setItemAsync(SECURE_STORAGE_ANSWERS, JSON.stringify(updatedData));

    };
  });

};