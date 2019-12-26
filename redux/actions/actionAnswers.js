import * as SecureStore from 'expo-secure-store'

import {
	//basic ops
	GET_ANSWERS,
	GET_ANSWERS_SUCCESS,
  GET_FRS_SUCCESS,
	GET_ANSWERS_FAILURE,
	GIVE_ANSWER,
	GIVE_ANSWER_SUCCESS,
	GIVE_ANSWER_FAILURE,
	//scoring
	CALCULATE_RISK_SCORE,
	CALCULATE_RISK_SCORE_SUCCESS,
	CALCULATE_RISK_SCORE_FAILURE,
  CALCULATE_RISK_SCORE_PROGRESS,
	//stored answers
  SECURE_STORAGE_FRS,
	SECURE_STORAGE_ANSWERS,
  SECURE_STORAGE_USER_ACCOUNT,
} from '../constants';

import { 
	CanComputeRisk, 
	NumGoodAnswersBasic, 
	NumGoodAnswersCardio,
  tenYearRiskLabel,
} from '../../EnyaSDK/ComputeRiskLocal';

import { 
	ComputeRiskSecure, 
} from '../../EnyaSDK/ComputeRiskSecure';

export const getAnswersBegin   = data  => ({ type: GET_ANSWERS });
export const getAnswersSuccess = data  => ({ type: GET_ANSWERS_SUCCESS, payload: data });
export const getAnswersFailure = error => ({ type: GET_ANSWERS_FAILURE, payload: error });

export const giveAnswerBegin   = data  => ({ type: GIVE_ANSWER });
export const giveAnswerSuccess = data  => ({ type: GIVE_ANSWER_SUCCESS, payload: data });
export const giveAnswerFailure = error => ({ type: GIVE_ANSWER_FAILURE, payload: error });

export const getFRSSuccess     = data  => ({ type: GET_FRS_SUCCESS,     payload: data });

const answersL = {
  birthyear: 0,
  weight: 0,
  height: 0,
  country: 0,
  gender: 0,
  smoking: 0,
  diabetes: 0,
  hdlc: 0,
  cholesterol: 0,
  bloodpressure: 0,
}

const frsL = {
  goodAnswersBasic: 0,
  goodAnswersCardio: 0,
  percentAnswered: 0,
  numberAnswered: 0,
  haveFRS: false,
  frsScore_ab: 0.0,
  frsScore_r: 0.0,
  frsLabel_lifestyle: 'unknown',
  frsLabel_gene: 'unknown',
  statinLabel: 'unknown',
  frsCurrent: false,
};

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
        SecureStore.setItemAsync(SECURE_STORAGE_ANSWERS, JSON.stringify(answersL));
      }
    }).catch(err => {
      if (__DEV__) console.log(err);
    });

  SecureStore.getItemAsync(SECURE_STORAGE_FRS).then(result => {
    if (result) {
        if (__DEV__) console.log('Answers: Previous Secure Score found.');
        const data = JSON.parse(result);
        dispatch(getFRSSuccess(data));
      } else {
        //create the file structure
        if (__DEV__) console.log('Answers: No previous Secure Score found.');
        SecureStore.setItemAsync(SECURE_STORAGE_FRS, JSON.stringify(frsL));
      }
    }).catch(err => {
      if (__DEV__) console.log(err);
    });

}

export const giveAnswer = (answer) => (dispatch) => {

	dispatch(giveAnswerBegin());

  SecureStore.getItemAsync(SECURE_STORAGE_ANSWERS).then(res1 => {
    
    if (res1) {

      let data = JSON.parse(res1);

      answer.forEach(ans => {data[ans.question_id] = ans.answer});

      let updatedData = { ...data, };

      SecureStore.setItemAsync(SECURE_STORAGE_ANSWERS, JSON.stringify(updatedData));

      dispatch( giveAnswerSuccess(updatedData) );

      var goodAnswersBasic = NumGoodAnswersBasic( data );
      var goodAnswersCardio = NumGoodAnswersCardio( data );
      
      var numberAnswered = goodAnswersBasic + goodAnswersCardio;
      
      var frsCurrent = false; //because we just got a new answer
      var percentAnswered = 0;

      if( goodAnswersBasic > 0 ) {
        percentAnswered = Math.round((goodAnswersBasic / 7.0) * 100);
      }

      SecureStore.getItemAsync(SECURE_STORAGE_FRS).then(res2 => {

        if (res2) {
          
          let frs = JSON.parse(res2);
          let updatedFRS = {
            ...frs,
            percentAnswered,
            numberAnswered,
            goodAnswersBasic,
            goodAnswersCardio,
            frsCurrent,
          };
          SecureStore.setItemAsync(SECURE_STORAGE_FRS, JSON.stringify(updatedFRS));
          dispatch( getFRSSuccess(updatedFRS) );
          
        };
      });
    }; //close if(res1)
  }); //close ss_answers

};

export const calculateRiskScoreBegin = () => ({
  type: CALCULATE_RISK_SCORE
});

export const calculateRiskScoreSuccess = (data) => ({
	type: CALCULATE_RISK_SCORE_SUCCESS,
	payload: data,
});

export const calculateRiskScoreProgress = (data) => ({
  type: CALCULATE_RISK_SCORE_PROGRESS,
  payload: data,
});

export const calculateRiskScoreFailure = (error) => ({
	type: CALCULATE_RISK_SCORE_FAILURE,
	payload: error,
});

export const calculateRiskScore = (data, gene, UUID, id) => async (dispatch) => {

	dispatch( calculateRiskScoreBegin() );

  dispatch( calculateRiskScoreProgress({
      FRScompute_progress: 0,
      FRScomputing: true 
    })
  );

  var frsScore_ab = 0.0;
  var frsScore_r = 0.0;
  var frsLabel_lifestyle = 'unknown';
  var frsLabel_gene = 'unknown'
  var statinLabel = 'unknown';
  var haveFRS = false;
  var frsCurrent = false;

	if ( CanComputeRisk( data ) ) {
		
		//if (__DEV__) 
      console.log('Yes, there are enough data to compute the risk ');

    APIStatus = await ComputeRiskSecure(data, UUID, id, dispatch); 

    //absolute and relative scores
    frsScore_ab = APIStatus.risk_score_ab; 
    frsScore_r = APIStatus.risk_score_r; 

    if(frsScore_ab > 0) {
      
      frsCurrent = true; //because we just recomputed it
      haveFRS = true; //yes, we have result

      frsLabel_lifestyle = tenYearRiskLabel( frsScore_ab, data.gender, data.birthyear ).riskText;
      
      //genetic frsLabel
      if (gene.gene_rr > 0) {
        frsLabel_gene = tenYearRiskLabel( frsScore_ab * gene.gene_rr, data.gender, data.birthyear ).riskText;
      }

    }

	}

	SecureStore.getItemAsync(SECURE_STORAGE_FRS).then(res => {

		const frs = res ? JSON.parse(res) : {};

    let updatedFRS = {
      ...frs,
      frsScore_ab,
      frsScore_r,
      frsLabel_lifestyle,
      frsLabel_gene,
      statinLabel, //computed elsewhere
      haveFRS,
      frsCurrent,
      error: null
    };

    SecureStore.setItemAsync(SECURE_STORAGE_FRS, JSON.stringify(updatedFRS));

    if ( haveFRS ) {
    
    	dispatch( calculateRiskScoreSuccess( updatedFRS ) );
      
      dispatch( calculateRiskScoreProgress({ 
          FRScompute_progress: 100,
          FRScomputing: false 
        })
      );
    
    } else {

    	dispatch( calculateRiskScoreFailure({ 
          error: 'Not enough data to compute FRS'
        })
      );

    }

  });

}

//this is similar to the above and deals with situation in which e.g. gene_rr changes
//but we do not need to recompute the FRS itself
export const updateRiskLabel = (gene_rr) => async (dispatch) => {

  if (__DEV__) console.log('actionAnswers: Updating Risk Labels because we might have new gene_rr values')

  var frsLabel_lifestyle = 'unknown';
  var frsLabel_gene = 'unknown';

  let answers = {};

  SecureStore.getItemAsync(SECURE_STORAGE_ANSWERS).then(res1 => {
    if (res1) {
      answers = res1 ? JSON.parse(res1) : {};
    }
  });

  SecureStore.getItemAsync(SECURE_STORAGE_FRS).then(res => {
    
    const frs = res ? JSON.parse(res) : {};

    if ( frs.frsScore_ab > 0 ) {

      //lifestyle frsLabel
      frsLabel_lifestyle = tenYearRiskLabel( frs.frsScore_ab, answers.gender, answers.birthyear ).riskText;

      if ( gene_rr > 0 ) { 
        frsLabel_gene = tenYearRiskLabel( frs.frsScore_ab * gene_rr, answers.gender, answers.birthyear ).riskText
      }
      
      if (__DEV__) console.log('actionAnswers: Updating Risk Labels:', frsLabel_lifestyle);

      let updatedFRS = {
        ...frs,
        frsLabel_lifestyle,
        frsLabel_gene,
        error: null
      };

      SecureStore.setItemAsync(SECURE_STORAGE_FRS, JSON.stringify(updatedFRS));
    
      dispatch( calculateRiskScoreSuccess( updatedFRS ) );

    }

  });

}